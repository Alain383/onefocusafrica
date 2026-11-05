# Start ONEFOCUS AFRICA Development Server
Write-Host 'Starting ONEFOCUS AFRICA...' -ForegroundColor Cyan

$env:DATABASE_URL='file:./prisma/dev.db'
$env:NEXTAUTH_SECRET='development-secret-key-change-in-production-1819007088'
$env:NEXTAUTH_URL='http://localhost:3000'

Write-Host 'Server: http://localhost:3000' -ForegroundColor Green
Write-Host 'Admin: http://localhost:3000/admin/login' -ForegroundColor Green
Write-Host 'Email: admin@onefocusafrica.com' -ForegroundColor Yellow
Write-Host 'Password: admin123' -ForegroundColor Yellow
Write-Host ''

npm run dev