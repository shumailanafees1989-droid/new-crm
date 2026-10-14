# ==============================================================================
# Bright Digital Agency CRM - Local Development Server with .env API Support
# ==============================================================================

$root = (Get-Location).Path
$envFile = Join-Path $root ".env"

function Get-EnvConfig {
    param([string]$path)
    $config = @{
        "SUPABASE_URL" = ""
        "SUPABASE_ANON_KEY" = ""
        "PORT" = "3000"
    }
    if (Test-Path $path) {
        Get-Content $path | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
                $idx = $line.IndexOf("=")
                $key = $line.Substring(0, $idx).Trim()
                $val = $line.Substring($idx + 1).Trim().Trim('"').Trim("'")
                $config[$key] = $val
            }
        }
    }
    return $config
}

$initialConfig = Get-EnvConfig $envFile
$port = if ($initialConfig.ContainsKey("PORT") -and $initialConfig["PORT"]) { [int]$initialConfig["PORT"] } else { 3000 }

$listener = New-Object System.Net.HttpListener

try {
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Output "Bright Agency CRM server running at http://localhost:$port/"
} catch {
    $port = 5050
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$port/")
    $listener.Start()
    Write-Output "Bright Agency CRM server running at http://localhost:$port/"
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".sql"  = "text/plain; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".env"  = "text/plain; charset=utf-8"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS Headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.OutputStream.Close()
            continue
        }

        $urlPath = $request.Url.LocalPath

        # API Route: /api/config
        if ($urlPath -eq "/api/config") {
            if ($request.HttpMethod -eq "GET") {
                $cfg = Get-EnvConfig $envFile
                $json = @{
                    "SUPABASE_URL" = $cfg["SUPABASE_URL"]
                    "SUPABASE_ANON_KEY" = $cfg["SUPABASE_ANON_KEY"]
                    "PORT" = $port
                } | ConvertTo-Json
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } elseif ($request.HttpMethod -eq "POST") {
                $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
                $body = $reader.ReadToEnd()
                try {
                    $jsonInput = $body | ConvertFrom-Json
                    $newUrl = if ($jsonInput.SUPABASE_URL) { $jsonInput.SUPABASE_URL } else { "" }
                    $newKey = if ($jsonInput.SUPABASE_ANON_KEY) { $jsonInput.SUPABASE_ANON_KEY } else { "" }

                    $envContent = "# ========================================================`n# Bright Digital Agency CRM - Configuration`n# ========================================================`n`nSUPABASE_URL=$newUrl`nSUPABASE_ANON_KEY=$newKey`nPORT=$port`n"
                    [System.IO.File]::WriteAllText($envFile, $envContent, [System.Text.Encoding]::UTF8)

                    $respJson = @{ "success" = $true; "message" = ".env updated successfully" } | ConvertTo-Json
                    $bytes = [System.Text.Encoding]::UTF8.GetBytes($respJson)
                    $response.ContentType = "application/json; charset=utf-8"
                    $response.ContentLength64 = $bytes.Length
                    $response.OutputStream.Write($bytes, 0, $bytes.Length)
                } catch {
                    $response.StatusCode = 500
                    $errBytes = [System.Text.Encoding]::UTF8.GetBytes("Error updating .env: $_")
                    $response.ContentLength64 = $errBytes.Length
                    $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
                }
            }
            $response.OutputStream.Close()
            continue
        }

        # Static File Serving
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        $filePath = Join-Path $root ($urlPath.TrimStart("/").Replace("/", "\"))

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $response.ContentType = $mime

            $contentBytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $contentBytes.Length
            $response.OutputStream.Write($contentBytes, 0, $contentBytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # continue loop
    }
}
