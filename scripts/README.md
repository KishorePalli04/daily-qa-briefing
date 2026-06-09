Usage: set GitHub Actions secrets with the GitHub CLI

1. Install `gh` and authenticate:

```powershell
winget install --id GitHub.cli
gh auth login
```

2. From the repository root, run:

```powershell
.\scripts\set-github-secrets.ps1
```

3. When prompted, paste values for:
- `SENDGRID_API_KEY` (your SendGrid API key)
- `SENDGRID_FROM` (verified sender email)
- `EMAIL_TO` (recipient email)

The script sets the secrets using `gh secret set`. Confirm in GitHub repo settings after running.
