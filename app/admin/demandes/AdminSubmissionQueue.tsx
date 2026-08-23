"use client";

import { useCallback, useEffect, useState } from "react";

type SubmissionStatus = "new" | "in_progress" | "closed";

type SubmissionSummary = {
  id: string;
  reference: string;
  kind: "quote" | "service";
  status: SubmissionStatus;
  created_at: number;
  finalized_at: number;
  expires_at: number;
  attachment_count: number;
};

type SubmissionFile = {
  id: string;
  slot: string;
  filename: string;
  content_type: string;
  size_bytes: number;
};

type SubmissionDetail = SubmissionSummary & {
  contact_name: string;
  email: string;
  phone: string;
  payload: Record<string, string | string[]>;
  files: SubmissionFile[];
};

type ApiEnvelope = {
  ok?: boolean;
  message?: string;
  submissions?: SubmissionSummary[];
  submission?: SubmissionDetail;
  nextCursor?: string | null;
};

type QueuePage = {
  submissions: SubmissionSummary[];
  nextCursor: string | null;
};

const statusLabels: Record<SubmissionStatus, string> = {
  new: "Nouvelle",
  in_progress: "En traitement",
  closed: "Fermée",
};

const fieldLabels: Record<string, string> = {
  address: "Adresse",
  city: "Ville",
  postalCode: "Code postal",
  projectType: "Type de projet",
  startDate: "Début souhaité",
  installation: "Installation",
  interests: "Produits visés",
  catalogProduct: "Produit repéré",
  customerType: "Type de client",
  qrCode: "Code QR",
  quantity: "Quantité",
  material: "Matériau",
  color: "Couleur",
  model: "Modèle",
  issue: "Problématique",
  glassMeasurement: "Mesure du vitrage",
  floor: "Étage",
  room: "Pièce",
  description: "Description",
};

const hiddenPayloadFields = new Set(["fullName", "email", "phone"]);

function dateTime(timestamp: number): string {
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(new Date(timestamp * 1000));
}

function readableValue(value: string | string[]): string {
  return Array.isArray(value) ? value.join(", ") : value;
}

async function apiJson(response: Response): Promise<ApiEnvelope> {
  const body = (await response.json().catch(() => null)) as ApiEnvelope | null;
  if (!response.ok || !body?.ok) {
    throw new Error(body?.message || "La file de demandes est indisponible.");
  }
  return body;
}

async function fetchQueue(
  cursor?: string | null,
  signal?: AbortSignal,
): Promise<QueuePage> {
  const query = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
  const body = await apiJson(
    await fetch(`/api/admin/demandes${query}`, {
      credentials: "same-origin",
      cache: "no-store",
      signal,
    }),
  );
  return {
    submissions: body.submissions ?? [],
    nextCursor: body.nextCursor ?? null,
  };
}

export function AdminSubmissionQueue() {
  const [submissions, setSubmissions] = useState<SubmissionSummary[]>([]);
  const [selected, setSelected] = useState<SubmissionDetail | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const loadList = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const page = await fetchQueue();
      setSubmissions(page.submissions);
      setNextCursor(page.nextCursor);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "La file est indisponible.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    void fetchQueue(null, controller.signal)
      .then((page) => {
        if (!active) return;
        setSubmissions(page.submissions);
        setNextCursor(page.nextCursor);
        setError("");
      })
      .catch((loadError: unknown) => {
        if (!active || (loadError instanceof DOMException && loadError.name === "AbortError")) return;
        setError(loadError instanceof Error ? loadError.message : "La file est indisponible.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  async function loadMore() {
    if (!nextCursor) return;
    setLoading(true);
    setError("");
    try {
      const page = await fetchQueue(nextCursor);
      setSubmissions((current) => {
        const known = new Set(current.map((submission) => submission.id));
        return [
          ...current,
          ...page.submissions.filter((submission) => !known.has(submission.id)),
        ];
      });
      setNextCursor(page.nextCursor);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "La suite de la file est indisponible.");
    } finally {
      setLoading(false);
    }
  }

  async function openSubmission(id: string) {
    setDetailLoading(true);
    setError("");
    try {
      const body = await apiJson(
        await fetch(`/api/admin/demandes/${id}`, {
          credentials: "same-origin",
          cache: "no-store",
        }),
      );
      setSelected(body.submission ?? null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "La demande est indisponible.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function changeStatus(status: SubmissionStatus) {
    if (!selected) return;
    setDetailLoading(true);
    setError("");
    try {
      await apiJson(
        await fetch(`/api/admin/demandes/${selected.id}`, {
          method: "PATCH",
          credentials: "same-origin",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ status }),
        }),
      );
      setSelected({ ...selected, status });
      setSubmissions((current) =>
        current.map((submission) =>
          submission.id === selected.id ? { ...submission, status } : submission,
        ),
      );
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Le statut n’a pas été enregistré.");
    } finally {
      setDetailLoading(false);
    }
  }

  async function deleteSelected() {
    if (!selected) return;
    const confirmed = window.confirm(
      `Supprimer définitivement ${selected.reference} et toutes ses pièces jointes?`,
    );
    if (!confirmed) return;
    setDetailLoading(true);
    setError("");
    try {
      await apiJson(
        await fetch(`/api/admin/demandes/${selected.id}`, {
          method: "DELETE",
          credentials: "same-origin",
        }),
      );
      setSubmissions((current) =>
        current.filter((submission) => submission.id !== selected.id),
      );
      setSelected(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "La demande n’a pas pu être supprimée.",
      );
    } finally {
      setDetailLoading(false);
    }
  }

  return (
    <div className="admin-queue" aria-busy={loading || detailLoading}>
      <div className="admin-queue__toolbar">
        <p aria-live="polite">
          {loading ? "Chargement…" : `${submissions.length} demande(s) conservée(s)`}
        </p>
        <button className="button button-dark" type="button" onClick={() => void loadList()} disabled={loading}>
          Actualiser
        </button>
      </div>

      {error ? <p className="submission-error" role="alert">{error}</p> : null}

      {!loading && submissions.length === 0 ? (
        <p className="notice">Aucune demande finalisée n’est actuellement conservée.</p>
      ) : null}

      <div className="admin-queue__layout">
        <section aria-labelledby="queue-list-title">
          <h2 id="queue-list-title">File de traitement</h2>
          <div className="admin-submission-list">
            {submissions.map((submission) => (
              <article className="admin-submission-summary" key={submission.id}>
                <div>
                  <span>{submission.kind === "quote" ? "Soumission" : "Après-vente"}</span>
                  <h3>{submission.reference}</h3>
                </div>
                <dl>
                  <div><dt>Statut</dt><dd>{statusLabels[submission.status]}</dd></div>
                  <div><dt>Reçue</dt><dd>{dateTime(submission.finalized_at)}</dd></div>
                  <div><dt>Pièces</dt><dd>{submission.attachment_count}</dd></div>
                </dl>
                <button
                  className="text-link"
                  type="button"
                  aria-expanded={selected?.id === submission.id}
                  onClick={() => void openSubmission(submission.id)}
                >
                  Ouvrir la demande
                </button>
              </article>
            ))}
          </div>
          {nextCursor ? (
            <button
              className="button button-dark"
              type="button"
              onClick={() => void loadMore()}
              disabled={loading}
            >
              Charger les demandes suivantes
            </button>
          ) : null}
        </section>

        <section className="admin-submission-detail" aria-labelledby="queue-detail-title">
          <h2 id="queue-detail-title">Dossier sélectionné</h2>
          {detailLoading && !selected ? <p>Chargement du dossier…</p> : null}
          {!selected && !detailLoading ? (
            <p className="notice">Les renseignements personnels ne sont affichés qu’après l’ouverture d’un dossier.</p>
          ) : null}
          {selected ? (
            <div>
              <div className="admin-submission-detail__heading">
                <div>
                  <p className="eyebrow">{selected.kind === "quote" ? "Soumission" : "Après-vente"}</p>
                  <h3>{selected.reference}</h3>
                </div>
                <div className="form-field">
                  <label htmlFor="admin-status">Statut</label>
                  <select
                    id="admin-status"
                    value={selected.status}
                    disabled={detailLoading}
                    onChange={(event) => void changeStatus(event.target.value as SubmissionStatus)}
                  >
                    <option value="new">Nouvelle</option>
                    <option value="in_progress">En traitement</option>
                    <option value="closed">Fermée</option>
                  </select>
                </div>
              </div>

              <dl className="admin-submission-fields">
                <div><dt>Nom</dt><dd>{selected.contact_name}</dd></div>
                <div><dt>Courriel</dt><dd><a href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
                <div><dt>Téléphone</dt><dd><a href={`tel:${selected.phone}`}>{selected.phone}</a></dd></div>
                {Object.entries(selected.payload)
                  .filter(([key]) => !hiddenPayloadFields.has(key))
                  .map(([key, value]) => (
                    <div key={key}>
                      <dt>{fieldLabels[key] ?? key}</dt>
                      <dd>{readableValue(value)}</dd>
                    </div>
                  ))}
              </dl>

              <div className="admin-submission-files">
                <h4>Pièces jointes</h4>
                {selected.files.length === 0 ? <p>Aucune pièce jointe.</p> : (
                  <ul>
                    {selected.files.map((file) => (
                      <li key={file.id}>
                        <a
                          href={`/api/admin/demandes/${selected.id}/fichiers/${file.id}`}
                          download
                        >
                          {file.filename}
                        </a>{" "}
                        <span>({Math.ceil(file.size_bytes / 1024)} Ko)</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p className="form-help">
                Reçue le {dateTime(selected.finalized_at)} · suppression prévue le {dateTime(selected.expires_at)}
              </p>
              <button
                className="button button-danger"
                type="button"
                disabled={detailLoading}
                onClick={() => void deleteSelected()}
              >
                Supprimer définitivement ce dossier
              </button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
