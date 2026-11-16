# Badges et accréditations

- `/` : page invité (génère le badge et enregistre l'inscription)
- `/admin` : page organisateur (inscriptions reçues, contrôle à l'entrée, envoi des badges, suppression)

## Variables d'environnement (Render)

| Nom | Rôle |
|---|---|
| `ADMIN_PASSWORD` | Mot de passe initial de `/admin` (défaut `0000`) |
| `RESET_CODE` | Code du bouton « Mot de passe oublié » (défaut `0000`). **À changer : tant qu'il vaut `0000`, tout le monde peut prendre la main sur `/admin`.** |
| `DATA_DIR` | Dossier de la base (défaut `./data`). Pour garder les données après un redémarrage, ajoutez un Disk Render et pointez `DATA_DIR` dessus (ex. `/var/data`). |

Sans Disk, les données sont perdues à chaque redéploiement ou redémarrage du plan gratuit.
