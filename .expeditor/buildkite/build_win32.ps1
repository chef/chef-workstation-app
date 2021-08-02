# Stop script execution when a non-terminating error occurs
$ErrorActionPreference = "Stop"

# A good chunk of this script was pulled from https://gist.github.com/noelmace/997a2e3d3ced0e1e6086066990036b16

# Install NodeJSs
$version = "14.17.4"
$url = "https://nodejs.org/dist/v$version/node-v$version-x64.msi"
$install_node = $TRUE

### require administator rights

if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
  write-Warning "This setup needs admin permissions. Please run this file as admin."
  break
}

### nodejs version check

if (Get-Command node -errorAction SilentlyContinue) {
  $current_version = (node -v)
}

if ($current_version) {
  $install_node = $FALSE
}

if ($install_node) {

  ### download nodejs msi file
  # warning : if a node.msi file is already present in the current folder, this script will simply use it

  write-host "`n----------------------------"
  write-host "  nodejs msi file retrieving  "
  write-host "----------------------------`n"

  $filename = "node.msi"
  $node_msi = "$env:TEMP\$filename"

  $download_node = $TRUE

  if (Test-Path $node_msi) {
    $download_node = $FALSE
  }

  if ($download_node) {
      write-host "[NODE] downloading nodejs install"
      write-host "url : $url"
      $start_time = Get-Date
      $wc = New-Object System.Net.WebClient
      $wc.DownloadFile($url, $node_msi)
      write-Output "$filename downloaded"
      write-Output "Time taken: $((Get-Date).Subtract($start_time).Seconds) second(s)"
  } else {
      write-host "using the existing node.msi file"
  }

  ### nodejs install

  write-host "`n----------------------------"
  write-host " nodejs installation  "
  write-host "----------------------------`n"

  write-host "[NODE] running $node_msi"
  Start-Process $node_msi -Wait

  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

} else {
  write-host "Proceeding with the previously installed nodejs version ..."
}

# Perform the build
npm install --unsafe-perm=true --allow-root
npm run-script build-win