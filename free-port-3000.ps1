# Script para liberar el puerto 3000
Write-Host "Verificando procesos en puerto 3000..." -ForegroundColor Yellow

# Obtener procesos que usan el puerto 3000
$processes = netstat -ano | findstr :3000

if ($processes) {
    Write-Host "Procesos encontrados en puerto 3000:" -ForegroundColor Red
    Write-Host $processes
    
    # Extraer PIDs de los procesos
    $pids = $processes | ForEach-Object {
        if ($_ -match '\s+(\d+)$') {
            $matches[1]
        }
    } | Sort-Object -Unique
    
    # Matar cada proceso
    foreach ($pid in $pids) {
        try {
            Write-Host "Terminando proceso PID: $pid" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Host "Proceso $pid terminado exitosamente" -ForegroundColor Green
        }
        catch {
            Write-Host "Error al terminar proceso $pid`: $_" -ForegroundColor Red
        }
    }
    
    # Verificar que el puerto esté libre
    Start-Sleep -Seconds 1
    $check = netstat -ano | findstr :3000
    if (-not $check) {
        Write-Host "Puerto 3000 liberado exitosamente!" -ForegroundColor Green
    } else {
        Write-Host "Advertencia: Algunos procesos pueden seguir activos en puerto 3000" -ForegroundColor Yellow
    }
} else {
    Write-Host "Puerto 3000 ya está libre" -ForegroundColor Green
}