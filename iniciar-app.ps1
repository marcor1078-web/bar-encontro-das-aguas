$ErrorActionPreference = "Stop"

$Port = 5173
$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Url = "http://127.0.0.1:$Port/index.html"

$python = Get-Command python -ErrorAction SilentlyContinue
if (-not $python) {
  Write-Host "Python nao encontrado. Instale Python 3 ou me peca para trocar este iniciador para Node.js."
  Read-Host "Pressione Enter para sair"
  exit 1
}

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
  Start-Process -FilePath $python.Source -ArgumentList @("-m", "http.server", "$Port", "--bind", "127.0.0.1") -WorkingDirectory $Root -WindowStyle Minimized
  Start-Sleep -Seconds 1
}

Start-Process $Url
Write-Host "BarControl aberto em $Url"
