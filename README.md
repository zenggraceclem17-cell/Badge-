# Badges et accréditations

- `/` : page invité (génère le badge et enregistre l'inscription)
- `/admin` : page organisateur (inscriptions reçues, contrôle à l'entrée, envoi des badges, suppression)

## Variables d'environnement (Render)

| Nom | Rôle |
|---|---|
| `ADMIN_PASSWORD` | Mot de passe initial de `/admin` (défaut `0000`) |
| `RESET_CODE` | Code du bouton « Mot de passe oublié » (défaut `0000`). **À changer : tant qu'il vaut `0000`, tout le monde peut prendre la main sur `/admin`.** |
| `DATABASE_URL` | Adresse d'une base PostgreSQL (Neon, Supabase…). **Obligatoire pour ne pas perdre les inscriptions** : sans elle, les données sont effacées à chaque redémarrage de Render. |

Sans `DATABASE_URL`, la page organisateur affiche un avertissement rouge.
