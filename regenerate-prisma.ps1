Write-Host "=== Regenerating Prisma Client ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "IMPORTANT: Please stop your dev server first (Ctrl+C in the dev server terminal)" -ForegroundColor Yellow
Write-Host "Press any key when ready to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Regenerating Prisma client..." -ForegroundColor Green
Set-Location "C:\dev\Monorepo\ICTIRC\packages\database"

$result = pnpm prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Prisma client regenerated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Now you can restart your dev server:" -ForegroundColor Cyan
    Write-Host "  cd C:\dev\Monorepo\ICTIRC" -ForegroundColor White
    Write-Host "  pnpm dev" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "✗ Failed to regenerate Prisma client" -ForegroundColor Red
    Write-Host "Make sure dev server is stopped and try again" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
