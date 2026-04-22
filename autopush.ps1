$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "$PSScriptRoot"
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    if ($path -notmatch 'node_modules|\.next|\.git|package-lock\.json') {
        Write-Host "Change detected in $path. Committing..." -ForegroundColor Cyan
        Set-Location "$PSScriptRoot"
        git add .
        $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        git commit -m "auto: updates at $timestamp"
        git push origin main
    }
}

Register-ObjectEvent $watcher "Changed" -Action $action
Register-ObjectEvent $watcher "Created" -Action $action
Register-ObjectEvent $watcher "Deleted" -Action $action
Register-ObjectEvent $watcher "Renamed" -Action $action

Write-Host "Auto-push system active. Watching for changes..." -ForegroundColor Green
while ($true) { Start-Sleep -Seconds 1 }
