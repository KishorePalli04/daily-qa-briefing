<#
Sets repository secrets using the GitHub CLI (`gh`).
Run this from the repository root. Requires `gh` installed and authenticated (gh auth login).
This script prompts securely for secret values and sets them via `gh secret set`.
#>

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "GitHub CLI 'gh' not found. Install with: winget install --id GitHub.cli" -ForegroundColor Yellow
  exit 1
}

if (-not (Test-Path .git)) {
  Write-Host "No .git folder found. Run this from the repository root." -ForegroundColor Yellow
  exit 1
}

function SecureToPlain([System.Security.SecureString] $s) {
  $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($s)
  try { [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr) }
  finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

$sgApi = Read-Host -Prompt "Enter SENDGRID_API_KEY (input hidden)" -AsSecureString
$sgFrom = Read-Host -Prompt "Enter SENDGRID_FROM (verified sender email)" -AsSecureString
$emailTo = Read-Host -Prompt "Enter EMAIL_TO (recipient)" -AsSecureString

$sgApiPlain = SecureToPlain $sgApi
$sgFromPlain = SecureToPlain $sgFrom
$emailToPlain = SecureToPlain $emailTo

Write-Host "Setting repository secrets..."
gh secret set SENDGRID_API_KEY --body $sgApiPlain
gh secret set SENDGRID_FROM --body $sgFromPlain
gh secret set EMAIL_TO --body $emailToPlain

Write-Host "Secrets set. Verify in GitHub repo Settings → Secrets and variables → Actions." -ForegroundColor Green
