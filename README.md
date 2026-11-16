# Badges et accréditations

- `/` : page invité (génère le badge et le code d'inscription)
- `/admin` : page organisateur (import des codes, contrôle à l'entrée, envoi des badges, suppression)

## Variables d'environnement (Render)

| Nom | Rôle |
|---|---|
| `ADMIN_PASSWORD` | Mot de passe de `/admin` (obligatoire) |
| `ORGANIZER_WHATSAPP` | Numéro international sans `+` (ex. `243812345678`), pour le bouton « Envoyer par WhatsApp » de la page invité |
| `ORGANIZER_EMAIL` | Adresse pour le bouton « Envoyer par e-mail » |
| `DATA_DIR` | Dossier de la base (défaut `./data`). Pour garder les données après un redémarrage, ajoutez un Disk Render et pointez `DATA_DIR` dessus (ex. `/var/data`). |

Sans Disk, les données sont perdues à chaque redéploiement ou redémarrage du plan gratuit.
