import type { Metadata } from "next";
import Link from "next/link";
import { requireChatGPTUser } from "../../chatgpt-auth";
import { AdminSubmissionQueue } from "./AdminSubmissionQueue";

export const metadata: Metadata = {
  title: "File privée des demandes",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function configuredAdminEmails(): Set<string> {
  return new Set(
    (process.env.BOULET_ADMIN_EMAILS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
}

export default async function AdminSubmissionsPage() {
  const user = await requireChatGPTUser("/admin/demandes");
  const allowedEmails = configuredAdminEmails();
  const authorized = allowedEmails.has(user.email.trim().toLowerCase());

  return (
    <main id="contenu">
      <header className="page-hero shell">
        <div>
          <nav className="breadcrumb" aria-label="Fil d’Ariane">
            <Link href="/">Accueil</Link>
            <span aria-hidden="true">/</span>
            <span>Demandes privées</span>
          </nav>
          <h1>
            File privée <em>des demandes.</em>
          </h1>
        </div>
        <div className="page-hero-aside">
          <p>
            Cet espace affiche les demandes finalisées et leurs pièces jointes
            privées. Les dossiers deviennent inaccessibles après 90 jours; la
            purge quotidienne doit être confirmée lors de l’activation du
            stockage.
          </p>
          <p className="form-help">Session: {user.displayName}</p>
        </div>
      </header>

      <section className="section shell">
        {!authorized ? (
          <div className="notice" role="alert">
            <strong>Accès métier non configuré.</strong>{" "}
            L’identité ChatGPT est reconnue, mais cette adresse n’est pas dans
            la liste explicite <code>BOULET_ADMIN_EMAILS</code>. La page et
            l’API refusent l’accès par défaut.
          </div>
        ) : (
          <AdminSubmissionQueue />
        )}
      </section>
    </main>
  );
}
