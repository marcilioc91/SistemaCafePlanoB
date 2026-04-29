$ErrorActionPreference = "SilentlyContinue"
Add-Type -AssemblyName System.Windows.Forms

$appDir    = Split-Path -Parent $MyInvocation.MyCommand.Path
$jarPath   = Join-Path $appDir "PortoCabral.jar"
$propsPath = Join-Path $appDir "application.properties"
$porta     = 8080
$url       = "http://localhost:$porta"

# Verifica se o Java esta instalado
$java = Get-Command "java" -ErrorAction SilentlyContinue
if (-not $java) {
    [System.Windows.Forms.MessageBox]::Show(
        "Java nao encontrado no sistema.`n`nInstale o Java 25 ou superior e tente novamente.`nDisponivel em: https://adoptium.net",
        "Porto Cabral - Erro",
        "OK",
        "Error"
    ) | Out-Null
    exit 1
}

# Verifica se o sistema ja esta rodando na porta $porta
function Test-Porta {
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $result = $tcp.ConnectAsync("localhost", $porta).Wait(500)
        $tcp.Close()
        return $result
    } catch { return $false }
}

if (Test-Porta) {
    # Sistema ja esta rodando — apenas abre o navegador
    Start-Process $url
    exit 0
}

# Inicia o backend
$argList = "-jar `"$jarPath`" --spring.config.location=`"$propsPath`""
Start-Process -FilePath "java" `
    -ArgumentList $argList `
    -WorkingDirectory $appDir `
    -WindowStyle Hidden

# Aguarda o sistema ficar disponivel (ate 2 minutos)
$maxEspera = 120
$intervalo = 3
$decorrido = 0
$iniciou   = $false

while ($decorrido -lt $maxEspera) {
    Start-Sleep -Seconds $intervalo
    $decorrido += $intervalo
    if (Test-Porta) {
        $iniciou = $true
        break
    }
}

if ($iniciou) {
    Start-Process $url
} else {
    [System.Windows.Forms.MessageBox]::Show(
        "O sistema nao respondeu em $maxEspera segundos.`n`nVerifique:`n- Se o banco de dados SQL Server esta em execucao`n- Se as credenciais em application.properties estao corretas`n- O arquivo de log em: $appDir\logs\",
        "Porto Cabral - Timeout",
        "OK",
        "Warning"
    ) | Out-Null
}
