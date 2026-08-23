"use client";

import Link from "next/link";
import Script from "next/script";
import { FormEvent, useRef, useState } from "react";

type LeadFormProps = {
  kind: "quote" | "service";
  enabled: boolean;
  turnstileSiteKey?: string;
  initialProduct?: {
    name: string;
    family: "fenetres" | "portes-entree" | "portes-patio" | "portes-garage";
  };
};

type ApiResponse = {
  ok?: boolean;
  message?: string;
  errors?: string[];
  submissionId?: string;
  reference?: string;
  finalized?: boolean;
  emailNotification?: boolean;
};

type PendingUpload = {
  slot: string;
  file: File;
  maxBytes: number;
  label: string;
};

const IMAGE_TYPES = new Set(["image/jpeg", "image/png"]);

declare global {
  interface Window {
    turnstile?: { reset(): void };
  }
}

async function readApiResponse(response: Response): Promise<ApiResponse> {
  const body = (await response.json().catch(() => null)) as ApiResponse | null;
  if (!body) throw new Error("Le serveur a retourné une réponse illisible.");
  if (!response.ok || !body.ok) {
    throw new Error(body.errors?.join(" ") || body.message || "L’envoi a échoué.");
  }
  return body;
}

function fileFrom(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

function collectUploads(
  kind: LeadFormProps["kind"],
  formData: FormData,
): { uploads: PendingUpload[]; errors: string[] } {
  const uploads: PendingUpload[] = [];
  const errors: string[] = [];
  const add = (
    slot: string,
    file: File | null,
    maxBytes: number,
    label: string,
    required = false,
  ) => {
    if (!file) {
      if (required) errors.push(`${label} est requise.`);
      return;
    }
    if (!IMAGE_TYPES.has(file.type)) {
      errors.push(`${label}: utilisez une image JPEG ou PNG.`);
      return;
    }
    if (file.size > maxBytes) {
      errors.push(`${label} dépasse ${Math.round(maxBytes / 1024 / 1024)} Mo.`);
      return;
    }
    uploads.push({ slot, file, maxBytes, label });
  };

  if (kind === "quote") {
    const photos = formData
      .getAll("photos")
      .filter((value): value is File => value instanceof File && value.size > 0);
    if (photos.length > 5) errors.push("Ajoutez un maximum de cinq photos.");
    photos.slice(0, 5).forEach((file, index) => {
      add(`photo-${index + 1}`, file, 7 * 1024 * 1024, `Photo ${index + 1}`);
    });
  } else {
    add(
      "invoice",
      fileFrom(formData.get("invoice")),
      10 * 1024 * 1024,
      "La photo de la facture",
    );
    add(
      "photo-wide",
      fileFrom(formData.get("photoWide")),
      10 * 1024 * 1024,
      "La photo éloignée",
      true,
    );
    add(
      "photo-close",
      fileFrom(formData.get("photoClose")),
      10 * 1024 * 1024,
      "La photo rapprochée",
      true,
    );
  }
  return { uploads, errors };
}

function payloadFromForm(
  kind: LeadFormProps["kind"],
  formData: FormData,
  startedAt: number,
): Record<string, string | string[] | number> {
  const payload: Record<string, string | string[] | number> = {
    kind,
    startedAt,
    website: String(formData.get("website") ?? ""),
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
    catalogProduct: String(formData.get("catalogProduct") ?? ""),
    turnstileToken: String(formData.get("cf-turnstile-response") ?? ""),
    consent: formData.get("consent") === "yes" ? "yes" : "",
  };

  if (kind === "quote") {
    Object.assign(payload, {
      city: String(formData.get("city") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
      projectType: String(formData.get("projectType") ?? ""),
      startDate: String(formData.get("startDate") ?? ""),
      installation: String(formData.get("installation") ?? ""),
      interests: formData.getAll("interests").map(String),
    });
  } else {
    Object.assign(payload, {
      customerType: String(formData.get("customerType") ?? ""),
      qrCode: String(formData.get("qrCode") ?? ""),
      quantity: String(formData.get("quantity") ?? ""),
      material: String(formData.get("material") ?? ""),
      color: String(formData.get("color") ?? ""),
      model: String(formData.get("model") ?? ""),
      issue: String(formData.get("issue") ?? ""),
      glassMeasurement: String(formData.get("glassMeasurement") ?? ""),
      floor: String(formData.get("floor") ?? ""),
      room: String(formData.get("room") ?? ""),
    });
  }
  return payload;
}

export function LeadForm({
  kind,
  enabled,
  turnstileSiteKey,
  initialProduct,
}: LeadFormProps) {
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [pending, setPending] = useState(false);
  const [progress, setProgress] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [reference, setReference] = useState("");
  const feedbackRef = useRef<HTMLDivElement>(null);
  const submittingRef = useRef(false);
  const attemptRef = useRef<{
    accessToken: string;
    submissionId?: string;
    reference?: string;
  } | null>(null);
  const isQuote = kind === "quote";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;
    if (!enabled || !turnstileSiteKey) {
      setErrors([
        "L’envoi en ligne n’est pas encore activé. Appelez-nous ou écrivez-nous pour transmettre votre demande.",
      ]);
      requestAnimationFrame(() => feedbackRef.current?.focus());
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const { uploads, errors: fileErrors } = collectUploads(kind, formData);
    if (fileErrors.length > 0) {
      setErrors(fileErrors);
      setReference("");
      requestAnimationFrame(() => feedbackRef.current?.focus());
      return;
    }

    submittingRef.current = true;
    const attempt =
      attemptRef.current ?? { accessToken: crypto.randomUUID() };
    attemptRef.current = attempt;
    const accessToken = attempt.accessToken;
    setPending(true);
    setErrors([]);
    setReference("");
    setProgress("Préparation sécurisée de la demande…");

    try {
      const startResponse = await fetch("/api/demandes/demarrer", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "idempotency-key": accessToken,
        },
        body: JSON.stringify(payloadFromForm(kind, formData, startedAt)),
      });
      const started = await readApiResponse(startResponse);
      if (!started.submissionId || !started.reference) {
        throw new Error("La demande n’a pas reçu de numéro de suivi.");
      }
      attempt.submissionId = started.submissionId;
      attempt.reference = started.reference;

      if (started.finalized) {
        setReference(started.reference);
        setProgress("");
        form.reset();
        attemptRef.current = null;
        setStartedAt(Date.now());
        requestAnimationFrame(() => feedbackRef.current?.focus());
        return;
      }

      for (const [index, upload] of uploads.entries()) {
        setProgress(
          `Transfert de ${upload.label.toLowerCase()} (${index + 1} sur ${uploads.length})…`,
        );
        const uploadResponse = await fetch(
          `/api/demandes/${started.submissionId}/fichiers/${upload.slot}`,
          {
            method: "PUT",
            headers: {
              "content-type": upload.file.type,
              "x-file-name": encodeURIComponent(upload.file.name),
              "x-idempotency-key": accessToken,
            },
            body: upload.file,
          },
        );
        await readApiResponse(uploadResponse);
      }

      setProgress("Enregistrement final de la demande…");
      const finishResponse = await fetch(
        `/api/demandes/${started.submissionId}/finaliser`,
        {
          method: "POST",
          headers: { "x-idempotency-key": accessToken },
        },
      );
      const finished = await readApiResponse(finishResponse);
      setReference(finished.reference || started.reference);
      setProgress("");
      form.reset();
      attemptRef.current = null;
      setStartedAt(Date.now());
      requestAnimationFrame(() => feedbackRef.current?.focus());
    } catch (error) {
      setProgress("");
      window.turnstile?.reset();
      setErrors([
        error instanceof Error
          ? error.message
          : "L’envoi a échoué. Réessayez ou appelez le 450 742-9424.",
      ]);
      requestAnimationFrame(() => feedbackRef.current?.focus());
    } finally {
      submittingRef.current = false;
      setPending(false);
    }
  }

  return (
    <div className="lead-form-panel">
      <div className="lead-form__intro">
        <p className="eyebrow">Demande en ligne</p>
        <h2>{isQuote ? "Décrivez votre projet" : "Documentez le problème"}</h2>
        <p>
          Les champs marqués d’un astérisque sont obligatoires. La demande est
          conservée dans une file privée et configurée pour expirer après 90
          jours une fois le service activé.
        </p>
        <p>
          Aucune confirmation automatique n’est envoyée par courriel pour le
          moment; notez la référence affichée après l’envoi.
        </p>
        {!enabled || !turnstileSiteKey ? (
          <p className="notice" role="status">
            <strong>Activation en cours.</strong> Le formulaire peut être
            préparé, mais l’envoi demeure désactivé jusqu’à la validation du
            stockage privé, de la protection anti-abus et des accès de
            l’équipe. Appelez le <a href="tel:+14507429424">450 742-9424</a> ou
            écrivez à{" "}
            <a href="mailto:info@fenetresboulet.com">
              info@fenetresboulet.com
            </a>
            .
          </p>
        ) : null}
        {isQuote && initialProduct ? (
          <p className="notice" role="note">
            <strong>Produit repéré:</strong> {initialProduct.name}. Sa famille
            est déjà cochée; l’équipe confirmera la configuration exacte.
          </p>
        ) : null}
      </div>

      <form
        className="lead-form"
        onSubmit={submit}
        onChange={() => {
          if (!pending && attemptRef.current?.submissionId) {
            attemptRef.current = null;
          }
        }}
        aria-busy={pending}
      >
        {isQuote && initialProduct ? (
          <input
            type="hidden"
            name="catalogProduct"
            value={initialProduct.name}
          />
        ) : null}
        <div className="form-honeypot" aria-hidden="true">
          <label htmlFor={`${kind}-website`}>Votre site Web</label>
          <input
            id={`${kind}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <fieldset>
          <legend>Vos coordonnées</legend>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor={`${kind}-name`}>Nom complet *</label>
              <input id={`${kind}-name`} name="fullName" autoComplete="name" required />
            </div>
            <div className="form-field">
              <label htmlFor={`${kind}-email`}>Courriel *</label>
              <input
                id={`${kind}-email`}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor={`${kind}-phone`}>Téléphone *</label>
              <input
                id={`${kind}-phone`}
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor={`${kind}-address`}>Adresse du projet ou du produit *</label>
              <input
                id={`${kind}-address`}
                name="address"
                autoComplete="street-address"
                required
              />
            </div>
            {isQuote ? (
              <>
                <div className="form-field">
                  <label htmlFor="quote-city">Ville *</label>
                  <input id="quote-city" name="city" autoComplete="address-level2" required />
                </div>
                <div className="form-field">
                  <label htmlFor="quote-postal">Code postal *</label>
                  <input
                    id="quote-postal"
                    name="postalCode"
                    autoComplete="postal-code"
                    inputMode="text"
                    pattern="[A-Za-z][0-9][A-Za-z][ -]?[0-9][A-Za-z][0-9]"
                    placeholder="J3P 4J2"
                    required
                  />
                </div>
              </>
            ) : null}
          </div>
        </fieldset>

        {isQuote ? (
          <QuoteFields initialInterest={initialProduct?.family} />
        ) : (
          <ServiceFields />
        )}

        <fieldset>
          <legend>Pièces jointes</legend>
          {isQuote ? (
            <div className="form-field form-field--wide">
              <label htmlFor="quote-photos">Photos du projet (facultatif)</label>
              <input
                id="quote-photos"
                name="photos"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                multiple
                aria-describedby="quote-photos-help"
              />
              <p className="form-help" id="quote-photos-help">
                Jusqu’à cinq images JPEG ou PNG de 7 Mo chacune.
              </p>
            </div>
          ) : (
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="service-invoice">Photo de la facture (facultatif)</label>
                <input
                  id="service-invoice"
                  name="invoice"
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  aria-describedby="service-invoice-help"
                />
                <p className="form-help" id="service-invoice-help">
                  JPEG ou PNG, maximum 10 Mo.
                </p>
              </div>
              <div className="form-field">
                <label htmlFor="service-wide">Photo éloignée *</label>
                <input
                  id="service-wide"
                  name="photoWide"
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  aria-describedby="service-wide-help"
                  required
                />
                <p className="form-help" id="service-wide-help">
                  Montrez l’ouverture et son contexte. Maximum 10 Mo.
                </p>
              </div>
              <div className="form-field">
                <label htmlFor="service-close">Photo rapprochée *</label>
                <input
                  id="service-close"
                  name="photoClose"
                  type="file"
                  accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                  aria-describedby="service-close-help"
                  required
                />
                <p className="form-help" id="service-close-help">
                  Cadrez la zone problématique. Maximum 10 Mo.
                </p>
              </div>
            </div>
          )}
          <p className="notice" role="note">
            <strong>PDF:</strong> ce site ne les accepte pas encore, puisque
            leur analyse antivirus n’est pas activée. Avant de transmettre un
            plan ou une facture PDF, appelez le 450 742-9424 ou écrivez à
            info@fenetresboulet.com pour convenir d’un moyen sûr.
          </p>
        </fieldset>

        {enabled && turnstileSiteKey ? (
          <div className="turnstile-panel">
            <Script
              src="https://challenges.cloudflare.com/turnstile/v0/api.js"
              strategy="afterInteractive"
            />
            <p className="form-help" id={`${kind}-turnstile-help`}>
              Vérification anti-robot requise avant l’envoi.
            </p>
            <div
              className="cf-turnstile"
              data-sitekey={turnstileSiteKey}
              data-action={isQuote ? "quote_intake" : "service_intake"}
              data-language="fr"
              data-size="flexible"
              data-theme="light"
              aria-describedby={`${kind}-turnstile-help`}
            />
          </div>
        ) : null}

        <div className="form-consent">
          <input id={`${kind}-consent`} name="consent" value="yes" type="checkbox" required />
          <label htmlFor={`${kind}-consent`}>
            J’autorise Boulet à conserver et utiliser ces renseignements pour
            analyser et traiter ma demande. * Consultez notre{" "}
            <Link href="/confidentialite">avis de confidentialité</Link>.
          </label>
        </div>

        <div
          className="submission-feedback"
          ref={feedbackRef}
          tabIndex={-1}
          aria-live="polite"
        >
          {progress ? <p>{progress}</p> : null}
          {errors.length > 0 ? (
            <div className="submission-error" role="alert">
              <strong>La demande n’a pas été envoyée.</strong>
              <ul>
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {reference ? (
            <div className="submission-success" role="status">
              <strong>Demande enregistrée — référence {reference}</strong>
              <p>
                Notez ce numéro. L’équipe peut maintenant consulter la demande
                dans sa file privée. Aucune confirmation automatique n’est
                envoyée par courriel pour le moment.
              </p>
            </div>
          ) : null}
        </div>

        <div className="form-actions">
          <button
            className="button button-dark"
            type="submit"
            disabled={pending || !enabled || !turnstileSiteKey}
          >
            {pending
              ? "Envoi en cours…"
              : enabled && turnstileSiteKey
                ? "Enregistrer ma demande"
                : "Activation en cours"}
          </button>
          <p>
            Besoin d’aide? Appelez le{" "}
            <a href="tel:+14507429424">450 742-9424</a> ou écrivez à{" "}
            <a href="mailto:info@fenetresboulet.com">
              info@fenetresboulet.com
            </a>
            .
          </p>
        </div>
      </form>
    </div>
  );
}

function QuoteFields({ initialInterest }: { initialInterest?: string }) {
  return (
    <fieldset>
      <legend>Votre projet</legend>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="quote-project-type">Type de projet *</label>
          <select id="quote-project-type" name="projectType" defaultValue="" required>
            <option value="" disabled>Choisir une option</option>
            <option value="renovation">Rénovation résidentielle</option>
            <option value="construction">Construction neuve</option>
            <option value="commercial">Projet commercial</option>
            <option value="autre">Autre projet</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="quote-installation">Installation souhaitée *</label>
          <select id="quote-installation" name="installation" defaultValue="" required>
            <option value="" disabled>Choisir une option</option>
            <option value="oui">Oui</option>
            <option value="non">Non</option>
            <option value="a-confirmer">À confirmer avec l’équipe</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="quote-date">Début souhaité (facultatif)</label>
          <input id="quote-date" name="startDate" type="date" />
        </div>
      </div>
      <fieldset className="form-options">
        <legend>Produits visés *</legend>
        <label><input type="checkbox" name="interests" value="fenetres" defaultChecked={initialInterest === "fenetres"} /> Fenêtres</label>
        <label><input type="checkbox" name="interests" value="portes-entree" defaultChecked={initialInterest === "portes-entree"} /> Portes d’entrée</label>
        <label><input type="checkbox" name="interests" value="portes-patio" defaultChecked={initialInterest === "portes-patio"} /> Portes patio</label>
        <label><input type="checkbox" name="interests" value="portes-garage" defaultChecked={initialInterest === "portes-garage"} /> Portes de garage</label>
      </fieldset>
      <div className="form-field form-field--wide">
        <label htmlFor="quote-description">Description du projet *</label>
        <textarea
          id="quote-description"
          name="description"
          rows={7}
          maxLength={4000}
          placeholder="Quantités approximatives, priorités, inconforts actuels et résultat recherché…"
          required
        />
      </div>
    </fieldset>
  );
}

function ServiceFields() {
  return (
    <fieldset>
      <legend>Le produit et le problème</legend>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="service-customer">Type de client *</label>
          <select id="service-customer" name="customerType" defaultValue="" required>
            <option value="" disabled>Choisir une option</option>
            <option value="proprietaire">Propriétaire</option>
            <option value="entrepreneur">Entrepreneur</option>
            <option value="gestionnaire">Gestionnaire d’immeuble</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="service-qr">Code QR sur le produit *</label>
          <select id="service-qr" name="qrCode" defaultValue="" required>
            <option value="" disabled>Choisir une option</option>
            <option value="oui">Oui</option>
            <option value="non">Non</option>
            <option value="incertain">Je ne sais pas</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="service-quantity">Quantité concernée *</label>
          <input id="service-quantity" name="quantity" type="number" min="1" max="999" required />
        </div>
        <div className="form-field">
          <label htmlFor="service-material">Matériau *</label>
          <select id="service-material" name="material" defaultValue="" required>
            <option value="" disabled>Choisir une option</option>
            <option value="pvc">PVC</option>
            <option value="hybride">Hybride</option>
            <option value="inconnu">Je ne sais pas</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="service-color">Couleur *</label>
          <input id="service-color" name="color" required />
        </div>
        <div className="form-field">
          <label htmlFor="service-model">Modèle *</label>
          <select id="service-model" name="model" defaultValue="" required>
            <option value="" disabled>Choisir une option</option>
            <option value="battant">Fenêtre à battant</option>
            <option value="auvent">Fenêtre à auvent</option>
            <option value="coulissant">Fenêtre coulissante</option>
            <option value="guillotine">Fenêtre à guillotine</option>
            <option value="porte">Porte</option>
            <option value="autre">Autre produit</option>
            <option value="inconnu">Je ne sais pas</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="service-issue">Problématique principale *</label>
          <select id="service-issue" name="issue" defaultValue="" required>
            <option value="" disabled>Choisir une option</option>
            <option value="thermos">Thermos ou vitrage</option>
            <option value="quincaillerie">Quincaillerie</option>
            <option value="infiltration">Infiltration d’eau ou d’air</option>
            <option value="operation">Ouverture ou fermeture</option>
            <option value="finition">Finition</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="service-measure">Mesure visible du vitrage (facultatif)</label>
          <input id="service-measure" name="glassMeasurement" placeholder="Largeur × hauteur" />
        </div>
        <div className="form-field">
          <label htmlFor="service-floor">Étage *</label>
          <select id="service-floor" name="floor" defaultValue="" required>
            <option value="" disabled>Choisir une option</option>
            <option value="sous-sol">Sous-sol</option>
            <option value="rez-de-chaussee">Rez-de-chaussée</option>
            <option value="etage-1">1er étage</option>
            <option value="etage-2-plus">2e étage ou plus</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="form-field">
          <label htmlFor="service-room">Pièce *</label>
          <select id="service-room" name="room" defaultValue="" required>
            <option value="" disabled>Choisir une option</option>
            <option value="salon">Salon</option>
            <option value="cuisine">Cuisine</option>
            <option value="chambre">Chambre</option>
            <option value="salle-de-bain">Salle de bain</option>
            <option value="sous-sol">Sous-sol</option>
            <option value="garage">Garage</option>
            <option value="autre">Autre</option>
          </select>
        </div>
      </div>
      <div className="form-field form-field--wide">
        <label htmlFor="service-description">Description du problème *</label>
        <textarea
          id="service-description"
          name="description"
          rows={7}
          maxLength={4000}
          placeholder="Décrivez le symptôme, le moment où il survient et tout changement récent…"
          required
        />
      </div>
    </fieldset>
  );
}
