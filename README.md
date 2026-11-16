# Badges et accréditations

- `/` : page invité (génère le badge et enregistre l'inscription)
- `/admin` : page organisateur (inscriptions reçues, contrôle à l'entrée, envoi des badges, suppression)

## Variables d'environnement (Render)

| Nom | Rôle |
|---|---|
| `ADMIN_PASSWORD` | Mot de passe de `/admin` (obligatoire) |
| `DATA_DIR` | Dossier de la base (défaut `./data`). Pour garder les données après un redémarrage, ajoutez un Disk Render et pointez `DATA_DIR` dessus (ex. `/var/data`). |

Sans Disk, les données sont perdues à chaque redéploiement ou redémarrage du plan gratuit.
