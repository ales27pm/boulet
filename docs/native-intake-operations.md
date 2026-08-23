# Exploitation des demandes natives

## État de livraison

Le code des parcours `/soumission`, `/service` et `/admin/demandes` est complet et testable localement. L’ouverture à des visiteurs publics doit toutefois rester bloquée tant que les ressources, identités et engagements ci-dessous ne sont pas approuvés.

## Bindings obligatoires

- D1 `DB` : fiches, états, consentement, expiration et clés d’idempotence hachées.
- R2 privé `UPLOADS` : images JPEG/PNG; aucun domaine public ne doit être associé au bucket.
- `BOULET_INTAKE_ENABLED=true` : coupe-circuit explicite. En son absence, le Worker et l’interface refusent toute nouvelle collecte avec un statut 503.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` : clé publique du widget associée aux domaines autorisés.
- `TURNSTILE_SECRET` : secret serveur utilisé pour vérifier chaque jeton et son action (`quote_intake` ou `service_intake`).
- `BOULET_ADMIN_EMAILS` : liste explicite d’adresses séparées par des virgules. L’API et la page d’administration refusent l’accès si cette valeur est vide.

Sites doit appliquer `drizzle/0000_native_submissions.sql` au D1 associé. Le manifeste `.openai/hosting.json` et les migrations sont copiés dans l’archive de déploiement par `build/sites-vite-plugin.ts`.

## Parcours technique

1. `POST /api/demandes/demarrer` reçoit un JSON validé, une origine identique, `Idempotency-Key` et un jeton Turnstile à usage unique vérifié côté serveur.
2. Chaque image est envoyée seule par `PUT /api/demandes/{id}/fichiers/{slot}` avec le jeton d’accès temporaire.
3. Le serveur vérifie le nom, l’extension, le type déclaré, la signature JPEG/PNG et la taille réelle pendant le streaming vers R2.
4. `POST /api/demandes/{id}/finaliser` vérifie les pièces requises puis rend le dossier visible dans la file privée.

Les brouillons expirent après 24 heures et les dossiers finalisés après 90 jours. Le nettoyage opportuniste s’exécute lors des requêtes et le Worker déclare aussi une purge quotidienne par Cron Trigger. Vérifier que ce déclencheur est effectivement installé dans le déploiement Sites avant d’activer la collecte publique.

La file d’administration charge les dossiers par pages de 50. Une personne autorisée peut aussi supprimer immédiatement un dossier et ses objets R2; si la suppression des fichiers échoue, les métadonnées sont conservées et l’interface demande de reprendre l’opération.

## Décisions requises avant ouverture publique

1. Confirmer les destinataires soumission/SAV et l’expéditeur vérifié.
2. Choisir et configurer le transport courriel ou CRM. L’interface ne prétend actuellement pas envoyer une notification.
3. Configurer Turnstile avec une clé de site, un secret serveur et les domaines autorisés, puis seulement ensuite définir `BOULET_INTAKE_ENABLED=true`.
4. Approuver la conservation de 90 jours, la procédure de suppression et les transferts hors Canada possibles avec Cloudflare.
5. Configurer l’identité Sign in with ChatGPT et `BOULET_ADMIN_EMAILS` pour les personnes autorisées.
6. Choisir un service d’analyse antimalware avant d’accepter des PDF; jusque-là, le serveur répond 415 et l’équipe convient d’un transfert sûr par téléphone ou courriel.
7. Tester une vraie demande contrôlée de bout en bout, y compris sa réception opérationnelle, son téléchargement privé, sa suppression et sa reprise après erreur.

## Sécurité et confidentialité

- Aucun renseignement personnel ne doit être écrit dans les journaux.
- Les réponses API utilisent `Cache-Control: no-store` et des messages génériques.
- Les téléchargements privés exigent l’identité et l’autorisation administratives, puis répondent avec `nosniff`, une disposition de pièce jointe et une politique sandbox.
- La limitation de fréquence utilise une empreinte irréversible de courte durée; elle ne constitue pas un identifiant analytique.
- La création est limitée par adresse réseau; les transferts ont en plus un quota distinct par dossier. Turnstile reste obligatoire et le coupe-circuit demeure fermé par défaut.
- Le bucket R2 doit rester privé et les noms d’objet sont aléatoires.
- Les PDF restent désactivés sans analyse antimalware vérifiée.
