import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { build } from "esbuild";
import { Miniflare } from "miniflare";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const baseUrl = "http://boulet.test";
const adminEmail = "intake-admin@example.com";
const turnstileToken = "turnstile-integration-token";
const accessToken = "quote_intake_access_token_1234567890";
const jpegFixture = new Uint8Array(
  Buffer.from(
    "/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAACAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAABv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AJkAbDj/2Q==",
    "base64",
  ),
);

const workerHarness = `
  import {
    handleSubmissionRequest,
    purgeExpiredSubmissions,
  } from "./worker/submissions.ts";

  export default {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (url.pathname === "/__test/purge") {
        const now = Number(url.searchParams.get("now"));
        const deleted = await purgeExpiredSubmissions(env, now);
        return Response.json({ ok: true, deleted });
      }

      return (
        (await handleSubmissionRequest(request, env)) ??
        new Response("Not found", { status: 404 })
      );
    },
  };
`;

async function bundleWorker() {
  const result = await build({
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    write: false,
    stdin: {
      contents: workerHarness,
      loader: "ts",
      resolveDir: projectRoot,
      sourcefile: "intake-workerd-harness.ts",
    },
  });
  assert.equal(result.outputFiles.length, 1);
  return result.outputFiles[0].text;
}

function quotePayload() {
  return {
    kind: "quote",
    fullName: "Test Workerd",
    email: "workerd@example.com",
    phone: "450 742-9424",
    address: "123, rue du Test",
    city: "Sorel-Tracy",
    postalCode: "J3P 1A1",
    projectType: "renovation",
    installation: "a-confirmer",
    interests: ["fenetres"],
    description: "Remplacement de deux fenêtres pour le test d’intégration.",
    consent: "yes",
    website: "",
    startedAt: Date.now() - 5_000,
    turnstileToken,
  };
}

function sameOriginHeaders(extra = {}) {
  return {
    origin: baseUrl,
    "sec-fetch-site": "same-origin",
    ...extra,
  };
}

async function responseJson(response) {
  const text = await response.text();
  assert.match(response.headers.get("content-type") ?? "", /^application\/json\b/);
  return JSON.parse(text);
}

async function expectStatus(response, status) {
  const body = await responseJson(response);
  assert.equal(response.status, status, JSON.stringify(body));
  return body;
}

function oversizedJpegFixture(length) {
  const bytes = new Uint8Array(length).fill(0x5a);
  bytes.set(jpegFixture, 0);
  return bytes;
}

test(
  "runs the native intake through workerd with real D1 and R2 bindings",
  { timeout: 30_000 },
  async (t) => {
    const turnstileChecks = [];
    const miniflare = new Miniflare({
      modules: true,
      script: await bundleWorker(),
      compatibilityDate: "2026-05-15",
      bindings: {
        BOULET_ADMIN_EMAILS: adminEmail,
        BOULET_INTAKE_ENABLED: "true",
        TURNSTILE_SECRET: "turnstile-test-secret",
      },
      d1Databases: { DB: `intake-d1-${process.pid}` },
      r2Buckets: { UPLOADS: `intake-r2-${process.pid}` },
      async outboundService(request) {
        assert.equal(
          request.url,
          "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        );
        assert.equal(request.method, "POST");
        const body = Object.fromEntries(await request.formData());
        turnstileChecks.push(body);
        return Response.json({
          success: true,
          action: "quote_intake",
          hostname: "boulet.test",
        });
      },
    });
    t.after(() => miniflare.dispose());

    const db = await miniflare.getD1Database("DB");
    const uploads = await miniflare.getR2Bucket("UPLOADS");

    const missingOrigin = await miniflare.dispatchFetch(
      `${baseUrl}/api/demandes/demarrer`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": "missing_origin_access_token_123456",
        },
        body: JSON.stringify(quotePayload()),
      },
    );
    assert.equal(missingOrigin.status, 403);

    const crossOrigin = await miniflare.dispatchFetch(
      `${baseUrl}/api/demandes/demarrer`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": "cross_origin_access_token_1234567",
          origin: "https://example.invalid",
          "sec-fetch-site": "cross-site",
        },
        body: JSON.stringify(quotePayload()),
      },
    );
    assert.equal(crossOrigin.status, 403);

    const started = await expectStatus(
      await miniflare.dispatchFetch(`${baseUrl}/api/demandes/demarrer`, {
        method: "POST",
        headers: sameOriginHeaders({
          "content-type": "application/json",
          "idempotency-key": accessToken,
          "cf-connecting-ip": "192.0.2.44",
        }),
        body: JSON.stringify(quotePayload()),
      }),
      201,
    );
    assert.equal(started.ok, true);
    assert.match(started.submissionId, /^[a-f0-9-]{36}$/);
    assert.match(started.reference, /^SOU-\d{8}-[A-F0-9]{6}$/);
    assert.deepEqual(turnstileChecks, [
      {
        remoteip: "192.0.2.44",
        response: turnstileToken,
        secret: "turnstile-test-secret",
      },
    ]);

    const uploadUrl = `${baseUrl}/api/demandes/${started.submissionId}/fichiers/photo-1`;
    const commonUploadHeaders = sameOriginHeaders({
      "x-idempotency-key": accessToken,
    });

    const badMagic = new Uint8Array([0x4e, 0x4f, 0x54, 0x4a, 0x50, 0x45, 0x47, 0x21]);
    const badMagicResponse = await miniflare.dispatchFetch(uploadUrl, {
      method: "PUT",
      headers: {
        ...commonUploadHeaders,
        "content-length": String(badMagic.byteLength),
        "content-type": "image/jpeg",
        "x-file-name": "fausse-image.jpg",
      },
      body: badMagic,
    });
    assert.equal(badMagicResponse.status, 415);
    assert.equal((await uploads.list()).objects.length, 0);

    const pdf = new TextEncoder().encode("%PDF-1.7\nintake test");
    const pdfResponse = await miniflare.dispatchFetch(uploadUrl, {
      method: "PUT",
      headers: {
        ...commonUploadHeaders,
        "content-length": String(pdf.byteLength),
        "content-type": "application/pdf",
        "x-file-name": "document.pdf",
      },
      body: pdf,
    });
    const pdfBody = await expectStatus(pdfResponse, 415);
    assert.equal(pdfBody.code, "PDF_SCANNING_REQUIRED");
    assert.equal((await uploads.list()).objects.length, 0);

    const oversized = oversizedJpegFixture(7 * 1024 * 1024 + 1);
    const oversizedResponse = await miniflare.dispatchFetch(uploadUrl, {
      method: "PUT",
      headers: {
        ...commonUploadHeaders,
        "content-length": String(oversized.byteLength),
        "content-type": "image/jpeg",
        "x-file-name": "trop-grande.jpg",
      },
      body: oversized,
    });
    assert.equal(oversizedResponse.status, 413);
    assert.equal((await uploads.list()).objects.length, 0);

    const uploaded = await expectStatus(
      await miniflare.dispatchFetch(uploadUrl, {
        method: "PUT",
        headers: {
          ...commonUploadHeaders,
          "content-length": String(jpegFixture.byteLength),
          "content-type": "image/jpeg",
          "x-file-name": encodeURIComponent("preuve fenêtre.jpg"),
        },
        body: jpegFixture,
      }),
      201,
    );
    assert.equal(uploaded.ok, true);
    assert.equal(uploaded.filename, "preuve fenêtre.jpg");
    assert.equal((await uploads.list()).objects.length, 1);

    const finalized = await expectStatus(
      await miniflare.dispatchFetch(
        `${baseUrl}/api/demandes/${started.submissionId}/finaliser`,
        {
          method: "POST",
          headers: sameOriginHeaders({ "x-idempotency-key": accessToken }),
        },
      ),
      200,
    );
    assert.equal(finalized.ok, true);
    assert.equal(finalized.reference, started.reference);
    assert.equal(finalized.emailNotification, false);

    const adminHeaders = { "oai-authenticated-user-email": adminEmail };
    const detail = await expectStatus(
      await miniflare.dispatchFetch(
        `${baseUrl}/api/admin/demandes/${started.submissionId}`,
        { headers: adminHeaders },
      ),
      200,
    );
    assert.equal(detail.submission.reference, started.reference);
    assert.equal(detail.submission.attachment_count, 1);
    assert.equal(detail.submission.files.length, 1);
    assert.equal(detail.submission.files[0].filename, "preuve fenêtre.jpg");

    const download = await miniflare.dispatchFetch(
      `${baseUrl}/api/admin/demandes/${started.submissionId}/fichiers/${detail.submission.files[0].id}`,
      { headers: adminHeaders },
    );
    assert.equal(download.status, 200);
    assert.equal(download.headers.get("content-type"), "image/jpeg");
    assert.match(
      download.headers.get("content-disposition") ?? "",
      /filename\*=UTF-8''preuve%20fen%C3%AAtre\.jpg/,
    );
    assert.deepEqual(new Uint8Array(await download.arrayBuffer()), jpegFixture);

    const future = Math.floor(Date.now() / 1_000) + 91 * 24 * 60 * 60;
    const purge = await expectStatus(
      await miniflare.dispatchFetch(`${baseUrl}/__test/purge?now=${future}`),
      200,
    );
    assert.deepEqual(purge, { ok: true, deleted: 1 });
    assert.equal((await uploads.list()).objects.length, 0);

    const storedSubmission = await db
      .prepare("SELECT id FROM submissions WHERE id = ?")
      .bind(started.submissionId)
      .first();
    const storedFile = await db
      .prepare("SELECT id FROM submission_files WHERE submission_id = ?")
      .bind(started.submissionId)
      .first();
    assert.equal(storedSubmission, null);
    assert.equal(storedFile, null);

    const purgedDetail = await miniflare.dispatchFetch(
      `${baseUrl}/api/admin/demandes/${started.submissionId}`,
      { headers: adminHeaders },
    );
    assert.equal(purgedDetail.status, 404);

    const deletionToken = "delete_intake_access_token_123456789";
    const deletionStarted = await expectStatus(
      await miniflare.dispatchFetch(`${baseUrl}/api/demandes/demarrer`, {
        method: "POST",
        headers: sameOriginHeaders({
          "content-type": "application/json",
          "idempotency-key": deletionToken,
          "cf-connecting-ip": "192.0.2.45",
        }),
        body: JSON.stringify(quotePayload()),
      }),
      201,
    );
    await expectStatus(
      await miniflare.dispatchFetch(
        `${baseUrl}/api/demandes/${deletionStarted.submissionId}/finaliser`,
        {
          method: "POST",
          headers: sameOriginHeaders({
            "x-idempotency-key": deletionToken,
          }),
        },
      ),
      200,
    );
    const queue = await expectStatus(
      await miniflare.dispatchFetch(`${baseUrl}/api/admin/demandes`, {
        headers: adminHeaders,
      }),
      200,
    );
    assert.equal(queue.submissions.length, 1);
    assert.equal(queue.nextCursor, null);

    const deleted = await expectStatus(
      await miniflare.dispatchFetch(
        `${baseUrl}/api/admin/demandes/${deletionStarted.submissionId}`,
        {
          method: "DELETE",
          headers: sameOriginHeaders(adminHeaders),
        },
      ),
      200,
    );
    assert.equal(deleted.deleted, true);
    assert.equal(
      await db
        .prepare("SELECT id FROM submissions WHERE id = ?")
        .bind(deletionStarted.submissionId)
        .first(),
      null,
    );
  },
);
