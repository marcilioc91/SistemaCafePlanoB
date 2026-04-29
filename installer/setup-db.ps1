$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Data
[System.Reflection.Assembly]::LoadWithPartialName("System.Windows.Forms") | Out-Null

# O script fica em {app}\setup\ — sobe um nivel para chegar em {app}\
$appDir    = Split-Path -Parent $PSScriptRoot
$propsFile = Join-Path $appDir "application.properties"

if (-not (Test-Path $propsFile)) {
    [System.Windows.Forms.MessageBox]::Show(
        "Arquivo de configuracao nao encontrado:`n$propsFile`n`nA instalacao pode estar corrompida.",
        "Porto Cabral - Erro",
        "OK", "Error") | Out-Null
    exit 1
}

# Ler application.properties em um dicionario
$props = @{}
Get-Content $propsFile | Where-Object { $_ -match "^[^#\s].+=" } | ForEach-Object {
    $partes = $_ -split "=", 2
    if ($partes.Length -eq 2) {
        $props[$partes[0].Trim()] = $partes[1].Trim()
    }
}

$jdbcUrl = $props["spring.datasource.url"]
$dbUser  = $props["spring.datasource.username"]
$dbPass  = $props["spring.datasource.password"]

# Parsear URL: jdbc:sqlserver://SERVER:PORT;databaseName=NOME;...
if ($jdbcUrl -notmatch "//([^:;/]+).*[;,]databaseName=([^;]+)") {
    [System.Windows.Forms.MessageBox]::Show(
        "Nao foi possivel interpretar a URL do banco de dados:`n$jdbcUrl",
        "Porto Cabral - Erro",
        "OK", "Error") | Out-Null
    exit 1
}
$server   = $matches[1]
$database = $matches[2]
$winAuth  = $jdbcUrl -match "integratedSecurity=true"

try {
    Write-Host "Conectando ao SQL Server '$server'..."

    if ($winAuth) {
        $connStr = "Server=$server;Integrated Security=True;TrustServerCertificate=True;Connection Timeout=15"
    } else {
        $connStr = "Server=$server;User Id=$dbUser;Password=$dbPass;TrustServerCertificate=True;Connection Timeout=15"
    }

    $conn = New-Object System.Data.SqlClient.SqlConnection($connStr)
    $conn.Open()

    # Cria o banco se nao existir
    $sqlCheck  = "SELECT COUNT(*) FROM sys.databases WHERE name = N'$database'"
    $existe    = [int](New-Object System.Data.SqlClient.SqlCommand($sqlCheck, $conn)).ExecuteScalar()

    if ($existe -eq 0) {
        Write-Host "Criando banco de dados '$database'..."
        (New-Object System.Data.SqlClient.SqlCommand("CREATE DATABASE [$database]", $conn)).ExecuteNonQuery() | Out-Null
        Write-Host "Banco '$database' criado com sucesso."
    } else {
        Write-Host "Banco '$database' ja existe. Nenhuma acao necessaria."
    }

    $conn.Close()
    exit 0

} catch {
    $erro = "Erro ao configurar o banco de dados:`n$_`n`n" +
            "Verifique:`n" +
            "  - SQL Server esta em execucao em '$server'`n" +
            "  - As credenciais estao corretas`n" +
            "  - O firewall permite conexao na porta 1433"

    [System.Windows.Forms.MessageBox]::Show($erro, "Porto Cabral - Erro de Banco", "OK", "Error") | Out-Null
    exit 1
}
