import { submissionSchemaStatements } from "../db/schema";

type D1Result<T = Record<string, unknown>> = {
  success: boolean;
  results?: T[];
  error?: string;
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
};

export type D1Database = {
  prepare(query: string): D1PreparedStatement;
  batch<T = Record<string, unknown>>(
    statements: D1PreparedStatement[],
  ): Promise<D1Result<T>[]>;
};

type R2ObjectBody = {
  body: ReadableStream;
};

type R2PutResult = {
  size: number;
};

type FixedLengthStreamPair = {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
};

type FixedLengthStreamConstructor = new (
  expectedLength: number,
) => FixedLengthStreamPair;

export type R2Bucket = {
  put(
    key: string,
    value: ArrayBuffer | ReadableStream,
    options?: {
      httpMetadata?: { contentType?: string };
      customMetadata?: Record<string, string>;
    },
  ): Promise<R2PutResult | null>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string | string[]): Promise<void>;
};

export type SubmissionEnv = {
  DB?: D1Database;
  UPLOADS?: R2Bucket;
  /** Public intake is fail-closed until every production dependency is ready. */
  BOULET_INTAKE_ENABLED?: string;
  /** Secret used only by the Worker to validate one-time Turnstile tokens. */
  TURNSTILE_SECRET?: string;
  /** Comma-separated emails injected by the Sites authentication boundary. */
  BOULET_ADMIN_EMAILS?: string;
};

type SubmissionKind = "quote" | "service";
type SubmissionValues = Record<string, string | string[]>;

type SubmissionRecord = {
  id: string;
  reference: string;
  kind: SubmissionKind;
  finalized_at: number | null;
  expires_at: number;
};

const JSON_BODY_LIMIT = 64 * 1024;
const DRAFT_RETENTION_SECONDS = 24 * 60 * 60;
const FINAL_RETENTION_SECONDS = 90 * 24 * 60 * 60;
const RATE_WINDOW_SECONDS = 15 * 60;
const RATE_LIMIT = 5;
const UPLOAD_RATE_LIMIT = 12;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const JSON_HEADERS = {
  "cache-control": "no-store",
  "content-type": "application/json; charset=utf-8",
  "x-content-type-options": "nosniff",
};

const quoteEnums = {
  projectType: new Set(["renovation", "construction", "commercial", "autre"]),
  installation: new Set(["oui", "non", "a-confirmer"]),
  interests: new Set(["fenetres", "portes-entree", "portes-patio", "portes-garage"]),
};

const serviceEnums = {
  customerType: new Set(["proprietaire", "entrepreneur", "gestionnaire", "autre"]),
  qrCode: new Set(["oui", "non", "incertain"]),
  material: new Set(["pvc", "hybride", "inconnu"]),
  model: new Set(["battant", "auvent", "coulissant", "guillotine", "porte", "autre", "inconnu"]),
  issue: new Set(["thermos", "quincaillerie", "infiltration", "operation", "finition", "autre"]),
  floor: new Set(["sous-sol", "rez-de-chaussee", "etage-1", "etage-2-plus", "autre"]),
  room: new Set(["salon", "cuisine", "chambre", "salle-de-bain", "sous-sol", "garage", "autre"]),
};

const uploadRules: Record<
  SubmissionKind,
  Record<string, { maxBytes: number; label: string; required: boolean }>
> = {
  quote: {
    "photo-1": { maxBytes: 7 * 1024 * 1024, label: "Photo 1", required: false },
    "photo-2": { maxBytes: 7 * 1024 * 1024, label: "Photo 2", required: false },
    "photo-3": { maxBytes: 7 * 1024 * 1024, label: "Photo 3", required: false },
    "photo-4": { maxBytes: 7 * 1024 * 1024, label: "Photo 4", required: false },
    "photo-5": { maxBytes: 7 * 1024 * 1024, label: "Photo 5", required: false },
  },
  service: {
    invoice: { maxBytes: 10 * 1024 * 1024, label: "Facture photographiée", required: false },
    "photo-wide": { maxBytes: 10 * 1024 * 1024, label: "Photo éloignée", required: true },
    "photo-close": { maxBytes: 10 * 1024 * 1024, label: "Photo rapprochée", required: true },
  },
};

function json(body: unknown, status = 200, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...JSON_HEADERS, ...extraHeaders },
  });
}

function methodNotAllowed(allowed: string[]): Response {
  return json(
    { ok: false, message: "Méthode non permise." },
    405,
    { allow: allowed.join(", ") },
  );
}

function normalizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function compactRecord(record: SubmissionValues): SubmissionValues {
  return Object.fromEntries(
    Object.entries(record).filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value.length > 0,
    ),
  );
}

function cleanFilename(name: string): string {
  const withoutControlCharacters = Array.from(name, (character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || code === 0x7f ? "" : character;
  }).join("");
  return (
    withoutControlCharacters
      .split(/[\\/]/)
      .pop()!
      .slice(0, 180) || "image"
  );
}

function decodeFilename(value: string | null): string {
  if (!value) return "image";
  try {
    return cleanFilename(decodeURIComponent(value));
  } catch {
    return cleanFilename(value);
  }
}

function fileExtension(name: string): string {
  return name.toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] ?? "";
}

async function ensureSchema(db: D1Database): Promise<void> {
  const results = await db.batch(
    submissionSchemaStatements.map((statement) => db.prepare(statement)),
  );
  const failed = results.find((result) => !result.success);
  if (failed) throw new Error(failed.error ?? "Submission schema unavailable");
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function intakeIsEnabled(env: SubmissionEnv): boolean {
  return (
    env.BOULET_INTAKE_ENABLED === "true" &&
    Boolean(env.TURNSTILE_SECRET?.trim())
  );
}

function intakeUnavailable(): Response {
  return json(
    {
      ok: false,
      code: "INTAKE_DISABLED",
      message:
        "Le formulaire en ligne n’est pas encore activé. Appelez au 450 742-9424 ou écrivez à info@fenetresboulet.com.",
    },
    503,
  );
}

async function fingerprintRequest(
  request: Request,
  scope: string,
): Promise<string> {
  const source = [
    request.headers.get("cf-connecting-ip") ?? "local",
    new Date().toISOString().slice(0, 10),
    scope,
    "boulet-lead-rate-v3",
  ].join("|");
  return sha256(source);
}

async function enforceRateLimit(
  db: D1Database,
  request: Request,
  now: number,
  scope: string,
  limit: number,
): Promise<boolean> {
  const fingerprint = await fingerprintRequest(request, scope);
  await db
    .prepare(
      `INSERT INTO submission_rate_limits (fingerprint, window_started_at, request_count)
       VALUES (?, ?, 1)
       ON CONFLICT(fingerprint) DO UPDATE SET
         window_started_at = CASE
           WHEN excluded.window_started_at - submission_rate_limits.window_started_at >= ?
             THEN excluded.window_started_at
           ELSE submission_rate_limits.window_started_at
         END,
         request_count = CASE
           WHEN excluded.window_started_at - submission_rate_limits.window_started_at >= ?
             THEN 1
           ELSE submission_rate_limits.request_count + 1
         END`,
    )
    .bind(fingerprint, now, RATE_WINDOW_SECONDS, RATE_WINDOW_SECONDS)
    .run();
  const current = await db
    .prepare("SELECT request_count FROM submission_rate_limits WHERE fingerprint = ?")
    .bind(fingerprint)
    .first<{ request_count: number }>();
  return Boolean(current && current.request_count <= limit);
}

type TurnstileVerification = {
  success?: boolean;
  action?: string;
};

async function verifyTurnstile(
  request: Request,
  secret: string,
  token: unknown,
  action: string,
): Promise<boolean> {
  const responseToken = normalizeText(token, 2048);
  if (!responseToken) return false;

  const body = new URLSearchParams({ secret, response: responseToken });
  const remoteIp = request.headers.get("cf-connecting-ip")?.trim();
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!response.ok) return false;
    const result = (await response.json()) as TurnstileVerification;
    return result.success === true && result.action === action;
  } catch {
    return false;
  }
}

async function cleanExpiredSubmissions(
  db: D1Database,
  uploads: R2Bucket,
  now: number,
): Promise<number> {
  let deleted = 0;

  while (true) {
    const expired = await db
      .prepare(
        "SELECT id FROM submissions WHERE expires_at < ? ORDER BY expires_at LIMIT 50",
      )
      .bind(now)
      .all<{ id: string }>();
    const rows = expired.results ?? [];
    if (rows.length === 0) break;

    for (const { id } of rows) {
      const files = await db
        .prepare("SELECT object_key FROM submission_files WHERE submission_id = ?")
        .bind(id)
        .all<{ object_key: string }>();
      const keys = (files.results ?? []).map((row) => row.object_key);
      if (keys.length > 0) await uploads.delete(keys);
      await db
        .prepare("DELETE FROM submission_files WHERE submission_id = ?")
        .bind(id)
        .run();
      await db.prepare("DELETE FROM submissions WHERE id = ?").bind(id).run();
      deleted += 1;
    }

    if (rows.length < 50) break;
  }

  await db
    .prepare("DELETE FROM submission_rate_limits WHERE window_started_at < ?")
    .bind(now - RATE_WINDOW_SECONDS * 2)
    .run();

  return deleted;
}

export async function purgeExpiredSubmissions(
  env: SubmissionEnv,
  now = Math.floor(Date.now() / 1000),
): Promise<number> {
  if (!env.DB || !env.UPLOADS) return 0;
  await ensureSchema(env.DB);
  return cleanExpiredSubmissions(env.DB, env.UPLOADS, now);
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

async function readJsonBody(
  request: Request,
): Promise<Record<string, unknown> | null> {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (declaredLength > JSON_BODY_LIMIT) return null;
  if (!request.body) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > JSON_BODY_LIMIT) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    const value = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function validateSubmission(body: Record<string, unknown>): {
  kind: SubmissionKind | null;
  errors: string[];
  values: SubmissionValues;
  contact: { name: string; email: string; phone: string };
} {
  const errors: string[] = [];
  const kindText = normalizeText(body.kind, 20);
  const kind = kindText === "quote" || kindText === "service" ? kindText : null;
  if (!kind) errors.push("Le type de demande est invalide.");

  const required = (name: string, label: string, max = 300) => {
    const value = normalizeText(body[name], max);
    if (!value) errors.push(`${label} est requis.`);
    return value;
  };
  const optional = (name: string, max = 1000) => normalizeText(body[name], max);
  const enumValue = (name: string, label: string, accepted: ReadonlySet<string>) => {
    const value = required(name, label, 80);
    if (value && !accepted.has(value)) errors.push(`${label} est invalide.`);
    return value;
  };

  const name = required("fullName", "Le nom complet", 140);
  const email = required("email", "Le courriel", 180).toLowerCase();
  const phone = required("phone", "Le téléphone", 40);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Le courriel est invalide.");
  }
  if (phone && phone.replace(/\D/g, "").length < 10) {
    errors.push("Le téléphone est invalide.");
  }

  const values: SubmissionValues = {
    fullName: name,
    email,
    phone,
    address: required("address", "L’adresse", 220),
  };

  if (kind === "quote") {
    values.city = required("city", "La ville", 100);
    values.postalCode = required("postalCode", "Le code postal", 16).toUpperCase();
    if (
      values.postalCode &&
      !/^[A-Z]\d[A-Z][ -]?\d[A-Z]\d$/.test(values.postalCode as string)
    ) {
      errors.push("Le code postal est invalide.");
    }
    values.projectType = enumValue(
      "projectType",
      "Le type de projet",
      quoteEnums.projectType,
    );
    values.startDate = optional("startDate", 20);
    if (values.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(values.startDate as string)) {
      errors.push("La date de début est invalide.");
    }
    values.installation = enumValue(
      "installation",
      "Le choix d’installation",
      quoteEnums.installation,
    );
    values.catalogProduct = optional("catalogProduct", 180);
    const interests = Array.isArray(body.interests)
      ? body.interests
          .map((value) => normalizeText(value, 50))
          .filter((value) => quoteEnums.interests.has(value))
          .slice(0, 4)
      : [];
    if (interests.length === 0) errors.push("Choisissez au moins une famille de produits.");
    values.interests = interests;
    values.description = required("description", "La description du projet", 4000);
  }

  if (kind === "service") {
    values.customerType = enumValue(
      "customerType",
      "Le type de client",
      serviceEnums.customerType,
    );
    values.qrCode = enumValue("qrCode", "Le statut du code QR", serviceEnums.qrCode);
    values.quantity = required("quantity", "La quantité", 12);
    const quantity = Number(values.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 999) {
      errors.push("La quantité doit être comprise entre 1 et 999.");
    }
    values.material = enumValue("material", "Le matériau", serviceEnums.material);
    values.color = required("color", "La couleur", 100);
    values.model = enumValue("model", "Le modèle", serviceEnums.model);
    values.issue = enumValue("issue", "La problématique", serviceEnums.issue);
    values.glassMeasurement = optional("glassMeasurement", 100);
    values.floor = enumValue("floor", "L’étage", serviceEnums.floor);
    values.room = enumValue("room", "La pièce", serviceEnums.room);
    values.description = required("description", "La description du problème", 4000);
  }

  if (normalizeText(body.consent, 10) !== "yes") {
    errors.push("Votre consentement est requis pour traiter la demande.");
  }

  return {
    kind,
    errors,
    values: compactRecord(values),
    contact: { name, email, phone },
  };
}

function submissionReference(kind: SubmissionKind, now: Date): string {
  const prefix = kind === "quote" ? "SOU" : "SAV";
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const random = crypto.randomUUID().replaceAll("-", "").slice(0, 6).toUpperCase();
  return `${prefix}-${date}-${random}`;
}

function validAccessToken(value: string | null): value is string {
  return Boolean(value && /^[A-Za-z0-9_-]{32,128}$/.test(value));
}

async function findSubmissionByAccess(
  db: D1Database,
  id: string,
  accessToken: string,
): Promise<SubmissionRecord | null> {
  return db
    .prepare(
      `SELECT id, reference, kind, finalized_at, expires_at
       FROM submissions
       WHERE id = ? AND access_token_hash = ?`,
    )
    .bind(id, await sha256(accessToken))
    .first<SubmissionRecord>();
}

async function startSubmission(
  request: Request,
  env: SubmissionEnv,
): Promise<Response> {
  if (request.method !== "POST") return methodNotAllowed(["POST"]);
  if (!sameOrigin(request)) {
    return json({ ok: false, message: "Origine non permise." }, 403);
  }
  if (!intakeIsEnabled(env)) return intakeUnavailable();
  if (!env.DB || !env.UPLOADS) {
    return json(
      {
        ok: false,
        message: "Le formulaire est temporairement indisponible. Appelez au 450 742-9424.",
      },
      503,
    );
  }
  const accessToken = request.headers.get("idempotency-key");
  if (!validAccessToken(accessToken)) {
    return json({ ok: false, message: "La session d’envoi est invalide." }, 400);
  }

  const body = await readJsonBody(request);
  if (!body) return json({ ok: false, message: "La demande est invalide ou trop volumineuse." }, 400);
  if (normalizeText(body.website, 200)) {
    return json({ ok: true, accepted: true }, 202);
  }

  const startedAt = Number(body.startedAt);
  const nowMs = Date.now();
  if (
    !Number.isFinite(startedAt) ||
    nowMs - startedAt < 3_000 ||
    nowMs - startedAt > 86_400_000
  ) {
    return json(
      { ok: false, message: "La session du formulaire a expiré. Rechargez la page." },
      400,
    );
  }

  await ensureSchema(env.DB);
  const now = Math.floor(nowMs / 1000);

  const accessTokenHash = await sha256(accessToken);
  const previous = await env.DB
    .prepare(
      `SELECT id, reference, kind, finalized_at, expires_at
       FROM submissions WHERE access_token_hash = ?`,
    )
    .bind(accessTokenHash)
    .first<SubmissionRecord>();
  if (previous && previous.expires_at >= now) {
    return json({
      ok: true,
      submissionId: previous.id,
      reference: previous.reference,
      finalized: previous.finalized_at !== null,
    });
  }

  if (!(await enforceRateLimit(env.DB, request, now, "start", RATE_LIMIT))) {
    return json(
      { ok: false, message: "Trop de demandes ont été reçues. Réessayez dans quelques minutes." },
      429,
    );
  }
  await cleanExpiredSubmissions(env.DB, env.UPLOADS, now).catch(() => undefined);

  const parsed = validateSubmission(body);
  if (parsed.errors.length > 0 || !parsed.kind) {
    return json(
      {
        ok: false,
        message: "Vérifiez les champs indiqués puis réessayez.",
        errors: parsed.errors,
      },
      400,
    );
  }
  const turnstileOk = await verifyTurnstile(
    request,
    env.TURNSTILE_SECRET!.trim(),
    body.turnstileToken,
    parsed.kind === "quote" ? "quote_intake" : "service_intake",
  );
  if (!turnstileOk) {
    return json(
      {
        ok: false,
        message: "La vérification anti-robot a expiré ou a échoué. Confirmez-la puis réessayez.",
      },
      400,
    );
  }

  const id = crypto.randomUUID();
  const reference = submissionReference(parsed.kind, new Date(nowMs));
  const result = await env.DB
    .prepare(
      `INSERT INTO submissions (
        id, reference, kind, status, contact_name, email, phone, payload_json,
        access_token_hash, consent_at, created_at, updated_at, finalized_at,
        expires_at, attachment_count
      ) VALUES (?, ?, ?, 'new', ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, 0)`,
    )
    .bind(
      id,
      reference,
      parsed.kind,
      parsed.contact.name,
      parsed.contact.email,
      parsed.contact.phone,
      JSON.stringify(parsed.values),
      accessTokenHash,
      now,
      now,
      now,
      now + DRAFT_RETENTION_SECONDS,
    )
    .run();
  if (!result.success) {
    const concurrent = await env.DB
      .prepare(
        `SELECT id, reference, kind, finalized_at, expires_at
         FROM submissions WHERE access_token_hash = ?`,
      )
      .bind(accessTokenHash)
      .first<SubmissionRecord>();
    if (concurrent && concurrent.expires_at >= now) {
      return json({
        ok: true,
        submissionId: concurrent.id,
        reference: concurrent.reference,
        finalized: concurrent.finalized_at !== null,
      });
    }
    return json(
      { ok: false, message: "La demande n’a pas pu être préparée. Appelez au 450 742-9424." },
      500,
    );
  }

  return json({ ok: true, submissionId: id, reference, finalized: false }, 201);
}

async function validatedUploadStream(
  stream: ReadableStream<Uint8Array>,
  type: string,
): Promise<ReadableStream<Uint8Array> | null> {
  const reader = stream.getReader();
  const prefix = new Uint8Array(8);
  const buffered: Uint8Array[] = [];
  let offset = 0;
  while (offset < prefix.byteLength) {
    const { done, value } = await reader.read();
    if (done) break;
    buffered.push(value);
    const take = Math.min(value.byteLength, prefix.byteLength - offset);
    prefix.set(value.subarray(0, take), offset);
    offset += take;
  }
  if (!hasValidMagicBytes(prefix.subarray(0, offset), type)) {
    await reader.cancel();
    return null;
  }

  let bufferedIndex = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (bufferedIndex < buffered.length) {
        controller.enqueue(buffered[bufferedIndex]);
        bufferedIndex += 1;
        return;
      }
      const { done, value } = await reader.read();
      if (done) controller.close();
      else controller.enqueue(value);
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });
}

function hasValidMagicBytes(bytes: Uint8Array, type: string): boolean {
  if (type === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (type === "image/png") {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return bytes.length >= png.length && png.every((byte, index) => bytes[index] === byte);
  }
  return false;
}

async function uploadSubmissionFile(
  request: Request,
  env: SubmissionEnv,
  submissionId: string,
  slot: string,
): Promise<Response> {
  if (request.method !== "PUT") return methodNotAllowed(["PUT"]);
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non permise." }, 403);
  if (!intakeIsEnabled(env)) return intakeUnavailable();
  if (!env.DB || !env.UPLOADS) {
    return json({ ok: false, message: "Le téléversement est indisponible." }, 503);
  }
  const accessToken = request.headers.get("x-idempotency-key");
  if (!validAccessToken(accessToken)) {
    return json({ ok: false, message: "La session d’envoi est invalide." }, 401);
  }

  await ensureSchema(env.DB);
  const submission = await findSubmissionByAccess(env.DB, submissionId, accessToken);
  const now = Math.floor(Date.now() / 1000);
  if (!submission || submission.expires_at < now) {
    return json({ ok: false, message: "La session d’envoi est introuvable ou expirée." }, 404);
  }
  if (submission.finalized_at !== null) {
    return json({ ok: false, message: "Cette demande a déjà été finalisée." }, 409);
  }
  if (
    !(await enforceRateLimit(
      env.DB,
      request,
      now,
      `upload:${submission.id}`,
      UPLOAD_RATE_LIMIT,
    ))
  ) {
    return json(
      { ok: false, message: "Trop de transferts ont été tentés. Réessayez dans quelques minutes." },
      429,
    );
  }

  const rule = uploadRules[submission.kind][slot];
  if (!rule) return json({ ok: false, message: "Le type de pièce jointe est invalide." }, 400);

  const type = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase() ?? "";
  if (type === "application/pdf") {
    return json(
      {
        ok: false,
        code: "PDF_SCANNING_REQUIRED",
        message: "Les PDF ne sont pas acceptés ici tant que l’analyse antivirus n’est pas active.",
      },
      415,
    );
  }
  if (type !== "image/jpeg" && type !== "image/png") {
    return json({ ok: false, message: "Utilisez une image JPEG ou PNG." }, 415);
  }

  const length = Number(request.headers.get("content-length") ?? "0");
  if (!Number.isSafeInteger(length) || length < 1) {
    return json({ ok: false, message: "La taille du fichier est inconnue." }, 411);
  }
  if (length > rule.maxBytes) {
    return json({ ok: false, message: `${rule.label} dépasse la taille permise.` }, 413);
  }
  if (!request.body) return json({ ok: false, message: "Le fichier est vide." }, 400);

  const filename = decodeFilename(request.headers.get("x-file-name"));
  const extension = fileExtension(filename);
  if (
    (type === "image/jpeg" && extension !== "jpg" && extension !== "jpeg") ||
    (type === "image/png" && extension !== "png")
  ) {
    return json({ ok: false, message: "Le nom du fichier ne correspond pas à son format." }, 415);
  }

  const uploadStream = await validatedUploadStream(request.body, type);
  if (!uploadStream) {
    return json({ ok: false, message: "Le contenu du fichier ne correspond pas à une image valide." }, 415);
  }

  const FixedLengthStream = (
    globalThis as typeof globalThis & {
      FixedLengthStream?: FixedLengthStreamConstructor;
    }
  ).FixedLengthStream;
  if (!FixedLengthStream) {
    await uploadStream.cancel();
    return json(
      { ok: false, message: "Le service de téléversement est indisponible." },
      503,
    );
  }
  const fixedLength = new FixedLengthStream(length);

  const existing = await env.DB
    .prepare(
      "SELECT id, object_key FROM submission_files WHERE submission_id = ? AND slot = ?",
    )
    .bind(submission.id, slot)
    .first<{ id: string; object_key: string }>();
  const fileId = existing?.id ?? crypto.randomUUID();
  const objectKey =
    existing?.object_key ??
    `submissions/${submission.kind}/${submission.id}/${slot}`;

  try {
    const [stored] = await Promise.all([
      env.UPLOADS.put(objectKey, fixedLength.readable, {
        httpMetadata: { contentType: type },
      }),
      uploadStream.pipeTo(fixedLength.writable),
    ]);
    if (!stored || stored.size !== length) {
      await env.UPLOADS.delete(objectKey);
      return json({ ok: false, message: "Le transfert du fichier est incomplet." }, 400);
    }

    const saved = await env.DB
      .prepare(
        `INSERT INTO submission_files (
          id, submission_id, slot, object_key, filename, content_type, size_bytes, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(submission_id, slot) DO UPDATE SET
          id = excluded.id,
          object_key = excluded.object_key,
          filename = excluded.filename,
          content_type = excluded.content_type,
          size_bytes = excluded.size_bytes,
          created_at = excluded.created_at`,
      )
      .bind(fileId, submission.id, slot, objectKey, filename, type, length, now)
      .run();
    if (!saved.success) {
      if (!existing) await env.UPLOADS.delete(objectKey);
      return json({ ok: false, message: "La pièce jointe n’a pas pu être enregistrée." }, 500);
    }
    return json({ ok: true, slot, filename }, 201);
  } catch {
    if (!existing) await env.UPLOADS.delete(objectKey).catch(() => undefined);
    return json({ ok: false, message: "La pièce jointe n’a pas pu être transférée." }, 500);
  }
}

async function finalizeSubmission(
  request: Request,
  env: SubmissionEnv,
  submissionId: string,
): Promise<Response> {
  if (request.method !== "POST") return methodNotAllowed(["POST"]);
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non permise." }, 403);
  if (!intakeIsEnabled(env)) return intakeUnavailable();
  if (!env.DB || !env.UPLOADS) {
    return json({ ok: false, message: "La finalisation est indisponible." }, 503);
  }
  const accessToken = request.headers.get("x-idempotency-key");
  if (!validAccessToken(accessToken)) {
    return json({ ok: false, message: "La session d’envoi est invalide." }, 401);
  }

  await ensureSchema(env.DB);
  const submission = await findSubmissionByAccess(env.DB, submissionId, accessToken);
  const now = Math.floor(Date.now() / 1000);
  if (!submission || submission.expires_at < now) {
    return json({ ok: false, message: "La session d’envoi est introuvable ou expirée." }, 404);
  }
  if (submission.finalized_at !== null) {
    return json({
      ok: true,
      reference: submission.reference,
      message: "Votre demande est déjà enregistrée.",
      emailNotification: false,
    });
  }

  const files = await env.DB
    .prepare("SELECT slot FROM submission_files WHERE submission_id = ?")
    .bind(submission.id)
    .all<{ slot: string }>();
  const slots = new Set((files.results ?? []).map((row) => row.slot));
  const missing = Object.entries(uploadRules[submission.kind])
    .filter(([, rule]) => rule.required)
    .map(([slot]) => slot)
    .filter((slot) => !slots.has(slot));
  if (missing.length > 0) {
    return json(
      { ok: false, message: "Ajoutez les deux photos requises avant d’envoyer la demande." },
      400,
    );
  }

  const saved = await env.DB
    .prepare(
      `UPDATE submissions
       SET finalized_at = ?, updated_at = ?, expires_at = ?, attachment_count = ?
       WHERE id = ? AND finalized_at IS NULL`,
    )
    .bind(
      now,
      now,
      now + FINAL_RETENTION_SECONDS,
      slots.size,
      submission.id,
    )
    .run();
  if (!saved.success) {
    return json({ ok: false, message: "La demande n’a pas pu être finalisée." }, 500);
  }

  return json({
    ok: true,
    reference: submission.reference,
    message: "Votre demande est enregistrée dans la file privée de l’équipe.",
    emailNotification: false,
  });
}

function isAdmin(request: Request, env: SubmissionEnv): boolean {
  const email = request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase();
  const configured = env.BOULET_ADMIN_EMAILS
    ?.split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email && configured?.length && new Set(configured).has(email));
}

async function listSubmissions(request: Request, env: SubmissionEnv): Promise<Response> {
  if (request.method !== "GET") return methodNotAllowed(["GET"]);
  if (!env.DB || !isAdmin(request, env)) {
    return json({ ok: false, message: "Accès refusé ou liste d’administration non configurée." }, 403);
  }
  await ensureSchema(env.DB);
  const cursorText = new URL(request.url).searchParams.get("cursor") ?? "";
  const cursorMatch = cursorText.match(/^(\d+):([a-f0-9-]{36})$/);
  const cursorFinalizedAt = cursorMatch ? Number(cursorMatch[1]) : null;
  const cursorId = cursorMatch?.[2] ?? null;
  const baseSelect = `SELECT id, reference, kind, status,
                             created_at, finalized_at, expires_at, attachment_count
                      FROM submissions`;
  const now = Math.floor(Date.now() / 1000);
  const statement = cursorFinalizedAt && cursorId
    ? env.DB
        .prepare(
          `${baseSelect}
           WHERE finalized_at IS NOT NULL AND expires_at >= ?
             AND (finalized_at < ? OR (finalized_at = ? AND id < ?))
           ORDER BY finalized_at DESC, id DESC
           LIMIT 51`,
        )
        .bind(now, cursorFinalizedAt, cursorFinalizedAt, cursorId)
    : env.DB
        .prepare(
          `${baseSelect}
           WHERE finalized_at IS NOT NULL AND expires_at >= ?
           ORDER BY finalized_at DESC, id DESC
           LIMIT 51`,
        )
        .bind(now);
  const rows = await statement.all<{
      id: string;
      reference: string;
      kind: SubmissionKind;
      status: string;
      created_at: number;
      finalized_at: number;
      expires_at: number;
      attachment_count: number;
    }>();
  const results = rows.results ?? [];
  const submissions = results.slice(0, 50);
  const last = submissions.at(-1);
  return json({
    ok: true,
    submissions,
    nextCursor:
      results.length > 50 && last
        ? `${last.finalized_at}:${last.id}`
        : null,
  });
}

async function getSubmission(
  request: Request,
  env: SubmissionEnv,
  id: string,
): Promise<Response> {
  if (request.method !== "GET") return methodNotAllowed(["GET"]);
  if (!env.DB || !isAdmin(request, env)) {
    return json({ ok: false, message: "Accès refusé." }, 403);
  }
  await ensureSchema(env.DB);
  const now = Math.floor(Date.now() / 1000);
  const record = await env.DB
    .prepare(
      `SELECT id, reference, kind, status, contact_name, email, phone,
              payload_json, created_at, finalized_at, expires_at, attachment_count
       FROM submissions
       WHERE id = ? AND finalized_at IS NOT NULL AND expires_at >= ?`,
    )
    .bind(id, now)
    .first<{
      id: string;
      reference: string;
      kind: SubmissionKind;
      status: string;
      contact_name: string;
      email: string;
      phone: string;
      payload_json: string;
      created_at: number;
      finalized_at: number;
      expires_at: number;
      attachment_count: number;
    }>();
  if (!record) return json({ ok: false, message: "Demande introuvable." }, 404);

  const files = await env.DB
    .prepare(
      `SELECT id, slot, filename, content_type, size_bytes
       FROM submission_files
       WHERE submission_id = ?
       ORDER BY created_at`,
    )
    .bind(id)
    .all<{
      id: string;
      slot: string;
      filename: string;
      content_type: string;
      size_bytes: number;
    }>();
  return json({
    ok: true,
    submission: {
      ...record,
      payload: JSON.parse(record.payload_json) as SubmissionValues,
      payload_json: undefined,
      files: files.results ?? [],
    },
  });
}

async function updateSubmission(
  request: Request,
  env: SubmissionEnv,
  id: string,
): Promise<Response> {
  if (request.method !== "PATCH") return methodNotAllowed(["PATCH"]);
  if (!sameOrigin(request)) return json({ ok: false, message: "Origine non permise." }, 403);
  if (!env.DB || !isAdmin(request, env)) return json({ ok: false, message: "Accès refusé." }, 403);
  await ensureSchema(env.DB);
  const body = await readJsonBody(request);
  const status = normalizeText(body?.status, 30);
  if (!new Set(["new", "in_progress", "closed"]).has(status)) {
    return json({ ok: false, message: "Statut invalide." }, 400);
  }
  const result = await env.DB
    .prepare(
      "UPDATE submissions SET status = ?, updated_at = ? WHERE id = ? AND finalized_at IS NOT NULL",
    )
    .bind(status, Math.floor(Date.now() / 1000), id)
    .run();
  if (!result.success) return json({ ok: false, message: "Mise à jour impossible." }, 500);
  return json({ ok: true });
}

async function deleteSubmission(
  request: Request,
  env: SubmissionEnv,
  id: string,
): Promise<Response> {
  if (request.method !== "DELETE") return methodNotAllowed(["DELETE"]);
  if (!sameOrigin(request)) {
    return json({ ok: false, message: "Origine non permise." }, 403);
  }
  if (!env.DB || !env.UPLOADS || !isAdmin(request, env)) {
    return json({ ok: false, message: "Accès refusé." }, 403);
  }
  await ensureSchema(env.DB);
  const submission = await env.DB
    .prepare("SELECT id FROM submissions WHERE id = ?")
    .bind(id)
    .first<{ id: string }>();
  if (!submission) {
    return json({ ok: false, message: "Demande introuvable." }, 404);
  }
  const files = await env.DB
    .prepare("SELECT object_key FROM submission_files WHERE submission_id = ?")
    .bind(id)
    .all<{ object_key: string }>();
  const objectKeys = (files.results ?? []).map((file) => file.object_key);
  try {
    if (objectKeys.length > 0) await env.UPLOADS.delete(objectKeys);
  } catch {
    return json(
      {
        ok: false,
        message: "La suppression des pièces privées a échoué; aucune donnée n’a été retirée de la file.",
      },
      503,
    );
  }
  const results = await env.DB.batch([
    env.DB
      .prepare("DELETE FROM submission_files WHERE submission_id = ?")
      .bind(id),
    env.DB.prepare("DELETE FROM submissions WHERE id = ?").bind(id),
  ]);
  if (results.some((result) => !result.success)) {
    return json(
      {
        ok: false,
        message:
          "Les fichiers ont été supprimés, mais le retrait des métadonnées doit être repris par l’équipe.",
      },
      500,
    );
  }
  return json({ ok: true, deleted: true });
}

async function downloadSubmissionFile(
  request: Request,
  env: SubmissionEnv,
  submissionId: string,
  fileId: string,
): Promise<Response> {
  if (request.method !== "GET") return methodNotAllowed(["GET"]);
  if (!env.DB || !env.UPLOADS || !isAdmin(request, env)) {
    return json({ ok: false, message: "Accès refusé." }, 403);
  }
  await ensureSchema(env.DB);
  const record = await env.DB
    .prepare(
      `SELECT sf.object_key, sf.filename, sf.content_type
       FROM submission_files sf
       JOIN submissions s ON s.id = sf.submission_id
       WHERE sf.id = ? AND sf.submission_id = ?
         AND s.finalized_at IS NOT NULL AND s.expires_at >= ?`,
    )
    .bind(fileId, submissionId, Math.floor(Date.now() / 1000))
    .first<{ object_key: string; filename: string; content_type: string }>();
  if (!record) return json({ ok: false, message: "Fichier introuvable." }, 404);
  const object = await env.UPLOADS.get(record.object_key);
  if (!object) return json({ ok: false, message: "Fichier introuvable." }, 404);
  return new Response(object.body, {
    headers: {
      "cache-control": "private, no-store",
      "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(record.filename)}`,
      "content-type": record.content_type,
      "content-security-policy": "default-src 'none'; sandbox",
      "x-content-type-options": "nosniff",
    },
  });
}

export async function handleSubmissionRequest(
  request: Request,
  env: SubmissionEnv,
): Promise<Response | null> {
  const pathname = new URL(request.url).pathname;
  if (pathname === "/api/demandes") {
    return json(
      { ok: false, message: "Utilisez le nouveau parcours d’envoi par étapes." },
      410,
    );
  }
  if (pathname === "/api/demandes/demarrer") return startSubmission(request, env);

  const uploadMatch = pathname.match(
    /^\/api\/demandes\/([a-f0-9-]{36})\/fichiers\/([a-z0-9-]+)$/,
  );
  if (uploadMatch) {
    return uploadSubmissionFile(request, env, uploadMatch[1], uploadMatch[2]);
  }
  const finalizeMatch = pathname.match(
    /^\/api\/demandes\/([a-f0-9-]{36})\/finaliser$/,
  );
  if (finalizeMatch) return finalizeSubmission(request, env, finalizeMatch[1]);

  if (pathname === "/api/admin/demandes") return listSubmissions(request, env);
  const updateMatch = pathname.match(/^\/api\/admin\/demandes\/([a-f0-9-]{36})$/);
  if (updateMatch) {
    if (request.method === "GET") {
      return getSubmission(request, env, updateMatch[1]);
    }
    if (request.method === "PATCH") {
      return updateSubmission(request, env, updateMatch[1]);
    }
    if (request.method === "DELETE") {
      return deleteSubmission(request, env, updateMatch[1]);
    }
    return methodNotAllowed(["GET", "PATCH", "DELETE"]);
  }
  const fileMatch = pathname.match(
    /^\/api\/admin\/demandes\/([a-f0-9-]{36})\/fichiers\/([a-f0-9-]{36})$/,
  );
  if (fileMatch) {
    return downloadSubmissionFile(request, env, fileMatch[1], fileMatch[2]);
  }
  return null;
}
