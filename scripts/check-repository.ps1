param(
  [switch]$ForceDownload
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

$required = @(
  "AGENTS.md",
  "APP_SPEC.md",
  "app.config.json",
  "assets\favicon.svg",
  "dependencies.json",
  "dependencies.lock.json",
  ".github\workflows\dependency-updates.yml",
  "components\confirm-dialog.html",
  "components\toast.html",
  "components\popover-menu.html",
  "components\setting-field.html",
  "components\async-state.html",
  "components\mobile-bottom-bar.html",
  "components\webrtc-qr-pairing.html",
  "docs\COMPONENTS.md",
  "docs\DEPENDENCIES.md",
  "docs\DEPENDENCIES.ja.md",
  "docs\COMPONENTS.ja.md",
  "docs\WEBRTC_QR_PAIRING.md",
  "docs\WEBRTC_QR_PAIRING.ja.md",
  "examples\dependencies.webrtc-qr.json",
  "src\index.template.html",
  "build-standalone.ps1",
  "scripts\build-self-extract.ps1",
  "scripts\check-powershell-syntax.ps1",
  "scripts\dependency-tools.ps1",
  "scripts\check-dependency-updates.ps1",
  "scripts\sync-dependency-lock.ps1",
  "scripts\update-dependency.ps1",
  "scripts\verify-standalone.ps1",
  "scripts\verify-self-extract.ps1",
  "README.md",
  "README.ja.md",
  "LICENSE",
  "THIRD_PARTY_NOTICES.md",
  "RELEASE_CHECKLIST.md",
  "MOBILE_ACCESSIBILITY_TEST_MATRIX.md",
  "RELIABILITY_TEST_MATRIX.md",
  "assets\screenshot.png",
  "assets\screenshot-en.png",
  "assets\screenshot-mobile.png",
  "assets\screenshot-mobile-en.png",
  "schemas\app-config.schema.json",
  "schemas\dependencies.schema.json",
  "schemas\dependencies-lock.schema.json"
)

foreach ($relative in $required) {
  $path = Join-Path $Root $relative
  if (-not (Test-Path $path)) { throw "Required repository file is missing: $relative" }
}

& (Join-Path $Root "scripts\check-powershell-syntax.ps1") -RootPath $Root

$mobileBottomBarPath = Join-Path $Root "components\mobile-bottom-bar.html"
$mobileBottomBarText = Get-Content -Raw -Encoding UTF8 $mobileBottomBarPath
$mobileBottomBarRequiredTokens = @(
  'position: fixed',
  'env(safe-area-inset-bottom)',
  'data-mobile-page-target',
  'app-mobile-page',
  'showPage',
  'currentPage',
  'data-mobile-target',
  'data-mobile-action',
  'disabled',
  'window.AppMobileBottomBar'
)
foreach ($token in $mobileBottomBarRequiredTokens) {
  if (-not $mobileBottomBarText.Contains($token)) {
    throw "components\mobile-bottom-bar.html is missing required behavior marker: $token"
  }
}


$componentContracts = @(
  @{ Path = "components\toast.html"; Tokens = @("window.AppToast", "actionLabel", "onAction", "env(safe-area-inset-bottom)") },
  @{ Path = "components\popover-menu.html"; Tokens = @("window.AppPopoverMenu", "data-popover-trigger", "aria-expanded", "Escape") },
  @{ Path = "components\setting-field.html"; Tokens = @("window.AppSettingField", "data-setting-custom", "data-setting-range", "settingchange") },
  @{ Path = "components\async-state.html"; Tokens = @("window.AppAsyncState", "invalidateSource", "captureGeneration", "isCurrent") },
  @{ Path = "components\webrtc-qr-pairing.html"; Tokens = @("window.AppWebRtcQrPairing", "iceServers:[]", "waitForIceComplete", "BarcodeDetector", "answerAutoRetryLimit", "StandaloneAssets", "createJoinAnswer", "payloadPrefix", "qrPrefix") }
)
foreach ($contract in $componentContracts) {
  $componentText = Get-Content -Raw -Encoding UTF8 (Join-Path $Root $contract.Path)
  foreach ($token in @($contract.Tokens)) {
    if (-not $componentText.Contains([string]$token)) {
      throw "$($contract.Path) is missing required behavior marker: $token"
    }
  }
}

$dependencyConfig = Get-Content -Raw -Encoding UTF8 (Join-Path $Root "dependencies.json") | ConvertFrom-Json
$dependencyLock = Get-Content -Raw -Encoding UTF8 (Join-Path $Root "dependencies.lock.json") | ConvertFrom-Json
if ([int]$dependencyLock.schemaVersion -ne 1) { throw "dependencies.lock.json must use schemaVersion 1." }
$configIds = @($dependencyConfig.dependencies | ForEach-Object { [string]$_.id })
$lockIds = @($dependencyLock.dependencies | ForEach-Object { [string]$_.id })
if ($configIds.Count -ne $lockIds.Count) { throw "dependencies.lock.json must contain exactly one entry for every dependency." }
foreach ($dependency in @($dependencyConfig.dependencies)) {
  $matches = @($dependencyLock.dependencies | Where-Object { [string]$_.id -eq [string]$dependency.id })
  if ($matches.Count -ne 1) { throw "dependencies.lock.json must contain exactly one lock entry for '$([string]$dependency.id)'." }
  if ([string]$matches[0].package -ne [string]$dependency.package -or [string]$matches[0].version -ne [string]$dependency.version) {
    throw "dependencies.lock.json does not match dependencies.json for '$([string]$dependency.id)'."
  }
}

$webrtcDependencyExample = Get-Content -Raw -Encoding UTF8 (Join-Path $Root "examples\dependencies.webrtc-qr.json") | ConvertFrom-Json
$webrtcDependencyIds = @($webrtcDependencyExample.dependencies | ForEach-Object { [string]$_.id })
foreach ($requiredDependencyId in @("qrcode-generator", "jsqr")) {
  if ($webrtcDependencyIds -notcontains $requiredDependencyId) {
    throw "examples\dependencies.webrtc-qr.json is missing required dependency: $requiredDependencyId"
  }
}

$sourceText = Get-Content -Raw -Encoding UTF8 (Join-Path $Root "src\index.template.html")
if (-not $sourceText.Contains("__EMBEDDED_ASSET_BUNDLE_JSON__")) { throw "src\index.template.html must embed the asset bundle JSON directly." }
if ($sourceText.Contains("__EMBEDDED_ASSET_BUNDLE_BASE64__")) { throw "Legacy double-Base64 asset bundle placeholder must not return." }
$iconPlaceholderCount = ([regex]::Matches($sourceText, [regex]::Escape("__APP_ICON_DATA_URI__"))).Count
if ($iconPlaceholderCount -ne 2) { throw "src\index.template.html must use __APP_ICON_DATA_URI__ exactly twice: favicon and header icon." }
if (-not $sourceText.Contains('id="appBrandIcon"')) { throw "src\index.template.html is missing the canonical header brand icon marker." }
foreach ($token in @("bytesAsync", "blobUrlAsync", "outputFilename", "window.AppToast")) {
  if (-not $sourceText.Contains($token)) { throw "src\index.template.html is missing required template behavior marker: $token" }
}

# Practice Mirror reliability regression contract.
$practiceMirrorReliabilityTokens = @(
  "RELIABILITY_WATCHDOG_MS",
  "MAX_RECOVERIES_PER_MINUTE",
  "liveQueueExceeded",
  "attemptLiveRecovery",
  "suspendSessionForBackground",
  "resumeSessionFromBackground",
  "attemptReviewRecovery",
  "cameraSwitchToken",
  "state.review.degraded",
  'window.addEventListener("pageshow"'
)
foreach ($token in $practiceMirrorReliabilityTokens) {
  if (-not $sourceText.Contains([string]$token)) {
    throw "src\index.template.html is missing Practice Mirror reliability marker: $token"
  }
}
if (-not $sourceText.Contains("connect-src 'none'")) {
  throw "Practice Mirror must keep runtime network access blocked."
}
if (-not $sourceText.Contains("audio:false")) {
  throw "Practice Mirror camera capture must keep microphone audio disabled."
}

# Practice Mirror v1.0.0 release-asset contract.
$approvedIconSha256 = "1b1b88edb9dcb1da5e42b294577fb1a5cf8d3ce023ab19096180bb087004229e"
$iconPath = Join-Path $Root "assets\favicon.svg"
$iconStream = [System.IO.File]::OpenRead($iconPath)
$iconHashAlgorithm = [System.Security.Cryptography.SHA256]::Create()
try {
  $iconSha256 = (($iconHashAlgorithm.ComputeHash($iconStream) | ForEach-Object { $_.ToString("x2") }) -join "")
} finally {
  $iconHashAlgorithm.Dispose()
  $iconStream.Dispose()
}
if ($iconSha256 -ne $approvedIconSha256) {
  throw "assets\favicon.svg does not match the approved Practice Mirror artwork."
}

$releaseScreenshots = @(
  "assets\screenshot.png",
  "assets\screenshot-en.png",
  "assets\screenshot-mobile.png",
  "assets\screenshot-mobile-en.png"
)
$pngSignature = @(0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a)
foreach ($relative in $releaseScreenshots) {
  $screenshotPath = Join-Path $Root $relative
  $bytes = [System.IO.File]::ReadAllBytes($screenshotPath)
  if ($bytes.Length -lt 10000) {
    throw "$relative is too small to be a release screenshot."
  }
  for ($index = 0; $index -lt $pngSignature.Count; $index += 1) {
    if ($bytes[$index] -ne $pngSignature[$index]) {
      throw "$relative is not a valid PNG release screenshot."
    }
  }
}

# Practice Mirror mobile/accessibility regression contract.
$practiceMirrorAccessibilityTokens = @(
  'id="appLiveRegion"',
  "setAutoHideAccessibility",
  "keyboardMode",
  'aria-valuetext',
  'aria-invalid="false"',
  'aria-keyshortcuts',
  'guide.orientation==="vertical"?"horizontal":"vertical"',
  "safe-area-inset-left",
  ".guide-line.vertical{top:0;bottom:0;width:44px",
  ".guide-line.horizontal{left:0;right:0;height:44px",
  ".secondary-button{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:44px"
)

# Review playback must restart a freshly configured decoder from an actual key frame.
$practiceMirrorReviewKeyframeTokens = @(
  "prepareReviewPlaybackDecoder",
  "playbackFloorUs",
  'let index=-1;',
  'if(keyIndex<0)',
  'if(startIndex<0)'
)
foreach ($token in $practiceMirrorReviewKeyframeTokens) {
  if (-not $sourceText.Contains([string]$token)) {
    throw "src\index.template.html is missing Review key-frame restart marker: $token"
  }
}

# v1.0.0 Review ergonomics and seekable export regression contract.
$practiceMirrorReviewRcTokens = @(
  'data-rate="2"',
  'id="toolsToggleButton"',
  'id="reviewStopButton"',
  'id="reviewExportDetails"',
  "body.review-active .stage-shell",
  ".mirror-panel:fullscreen .stage-shell{width:min(100%,calc((100dvh - 180px) * 16 / 9));margin-inline:auto",
  "getWebmDurationFixer",
  "makeSeekableWebm",
  'StandaloneAssets.blobUrlAsync("fix-webm-duration","main")',
  "recorder.start();"
)
foreach ($token in $practiceMirrorReviewRcTokens) {
  if (-not $sourceText.Contains([string]$token)) {
    throw "src\index.template.html is missing v1.0.0 Review release marker: $token"
  }
}
if ($sourceText.Contains('video/mp4;codecs=avc1.42E01E') -or $sourceText.Contains('{mimeType:"video/mp4"')) {
  throw "Practice Mirror v1.0.0 Review export must not prefer raw MediaRecorder MP4; use seekable WebM."
}

# Configurable Review history must remain 10 seconds by default and support up to 180 seconds.
$practiceMirrorReviewDurationTokens = @(
  'reviewSeconds:10',
  'id="reviewSecondsInput"',
  'min="10" max="180"',
  "MIN_REVIEW_READY_US = 10_000_000",
  "REVIEW_HISTORY_MARGIN_US = 4_000_000",
  "reviewTargetDurationUs",
  "reviewHistoryKeepUs",
  'practice-mirror-review-seconds'
)
foreach ($token in $practiceMirrorReviewDurationTokens) {
  if (-not $sourceText.Contains([string]$token)) {
    throw "src\index.template.html is missing configurable Review history marker: $token"
  }
}
if ($sourceText.Contains("REVIEW_DURATION_US") -or $sourceText.Contains("HISTORY_KEEP_US")) {
  throw "Practice Mirror must not return to fixed 10-second Review history constants."
}

# Stable release identity.
if (-not $sourceText.Contains("v1.0.0")) {
  throw "src\index.template.html must contain the v1.0.0 release identity."
}
if ($sourceText.Contains("v1.0.0 is the release candidate")) {
  throw "v1.0.0 source must not describe itself as a release candidate."
}
$readmeText = Get-Content -Raw -Encoding UTF8 (Join-Path $Root "README.md")
$readmeJaText = Get-Content -Raw -Encoding UTF8 (Join-Path $Root "README.ja.md")
foreach ($token in @(
  "https://ttomohisa.github.io/htmlapps-practice-mirror/",
  "practice-mirror.html",
  "## Quick start",
  "## Privacy and runtime network protection"
)) {
  if (-not $readmeText.Contains($token)) { throw "README.md is missing v1.0.0 public README marker: $token" }
}
foreach ($token in @(
  "https://ttomohisa.github.io/htmlapps-practice-mirror/",
  "practice-mirror.html",
  "fix-webm-duration",
  "RELEASE_CHECKLIST.md"
)) {
  if (-not $readmeJaText.Contains($token)) { throw "README.ja.md is missing v1.0.0 public README marker: $token" }
}

if ($sourceText.Contains("data:packet.data.slice()")) {
  throw "Practice Mirror must not duplicate every encoded Review packet when freezing long history."
}

$dependencyConfig = Get-Content -Raw -LiteralPath (Join-Path $Root "dependencies.json") | ConvertFrom-Json
$webmFixDependency = @($dependencyConfig.dependencies | Where-Object { $_.id -eq "fix-webm-duration" })
if ($webmFixDependency.Count -ne 1 -or [string]$webmFixDependency[0].version -ne "1.0.6") {
  throw "Practice Mirror must pin fix-webm-duration exactly at 1.0.6."
}
foreach ($token in $practiceMirrorAccessibilityTokens) {
  if (-not $sourceText.Contains([string]$token)) {
    throw "src\index.template.html is missing Practice Mirror accessibility marker: $token"
  }
}
if ($sourceText.Contains('<section class="workspace" aria-live="polite">')) {
  throw "Practice Mirror must not make the entire workspace an aria-live region."
}

$builderText = Get-Content -Raw -Encoding UTF8 (Join-Path $Root "build-standalone.ps1")
foreach ($token in @("compressionSetting", "Compress-GzipBytes", "build-size-report.json", "sizeBudget", "DependencyLockPath", "tarballSha256", "__EMBEDDED_ASSET_BUNDLE_JSON__", "AppIconPath", "__APP_ICON_DATA_URI__", "rootHtmlOutputPath", 'StartsWith("htmlapps-"')) {
  if (-not $builderText.Contains($token)) { throw "build-standalone.ps1 is missing required asset pipeline marker: $token" }
}
if ($builderText.Contains("__EMBEDDED_ASSET_BUNDLE_BASE64__")) { throw "build-standalone.ps1 must not wrap the full asset bundle in Base64." }

$selfExtractBuilderPath = Join-Path $Root "scripts\build-self-extract.ps1"
$selfExtractBuilderBytes = [System.IO.File]::ReadAllBytes($selfExtractBuilderPath)
$selfExtractBuilderStart = 0
if (
  $selfExtractBuilderBytes.Length -ge 3 -and
  $selfExtractBuilderBytes[0] -eq 0xef -and
  $selfExtractBuilderBytes[1] -eq 0xbb -and
  $selfExtractBuilderBytes[2] -eq 0xbf
) {
  $selfExtractBuilderStart = 3
}
for ($index = $selfExtractBuilderStart; $index -lt $selfExtractBuilderBytes.Length; $index += 1) {
  if ($selfExtractBuilderBytes[$index] -gt 0x7f) {
    throw "scripts\build-self-extract.ps1 must contain ASCII text only so Windows PowerShell 5.1 cannot corrupt loader text."
  }
}

$buildCompatibilityFiles = @(
  "build-standalone.ps1",
  "scripts\build-self-extract.ps1",
  "scripts\check-powershell-syntax.ps1",
  "scripts\verify-standalone.ps1",
  "scripts\verify-self-extract.ps1",
  "scripts\dependency-tools.ps1",
  "scripts\check-dependency-updates.ps1",
  "scripts\sync-dependency-lock.ps1",
  "scripts\update-dependency.ps1"
)
foreach ($relative in $buildCompatibilityFiles) {
  $compatibilityPath = Join-Path $Root $relative
  $compatibilityText = Get-Content -Raw -Encoding UTF8 $compatibilityPath
  if ($compatibilityText -match '(?i)\bGet-FileHash\b') {
    throw "$relative must not depend on Get-FileHash; use the .NET SHA-256 helper for broader Windows PowerShell compatibility."
  }
  if ($compatibilityText -match '::new\s*\(') {
    throw "$relative must not use ::new(); use New-Object or older-compatible .NET construction syntax."
  }
}

# Regression check: dependency update reporting must handle both zero dependencies and one disabled dependency without network access.
$dependencyUpdateCheckPath = Join-Path $Root "scripts\check-dependency-updates.ps1"
$dependencyUpdateTestRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("single-html-template-dependency-check-" + [Guid]::NewGuid().ToString("N"))
$dependencyUpdateCases = @(
  @{
    Name = "empty"
    Json = '{"dependencies":[]}'
    DependencyCount = 0
    CheckedCount = 0
    DisabledCount = 0
  },
  @{
    Name = "single-disabled"
    Json = '{"dependencies":[{"id":"fixture","package":"fixture-package","version":"1.0.0","updates":{"enabled":false,"policy":"manual"}}]}'
    DependencyCount = 1
    CheckedCount = 0
    DisabledCount = 1
  }
)
try {
  New-Item -ItemType Directory -Force -Path $dependencyUpdateTestRoot | Out-Null
  foreach ($case in $dependencyUpdateCases) {
    $caseRoot = Join-Path $dependencyUpdateTestRoot ([string]$case.Name)
    New-Item -ItemType Directory -Force -Path $caseRoot | Out-Null
    $caseDependenciesPath = Join-Path $caseRoot "dependencies.json"
    $caseJsonOutput = Join-Path $caseRoot "report.json"
    $caseMarkdownOutput = Join-Path $caseRoot "report.md"
    [System.IO.File]::WriteAllText($caseDependenciesPath, [string]$case.Json, (New-Object System.Text.UTF8Encoding($false)))
    & $dependencyUpdateCheckPath -DependenciesPath $caseDependenciesPath -JsonOutput $caseJsonOutput -MarkdownOutput $caseMarkdownOutput
    $caseReport = Get-Content -Raw -Encoding UTF8 $caseJsonOutput | ConvertFrom-Json
    if ([int]$caseReport.dependencyCount -ne [int]$case.DependencyCount) { throw "Dependency update regression '$($case.Name)' reported an unexpected dependencyCount." }
    if ([int]$caseReport.checkedCount -ne [int]$case.CheckedCount) { throw "Dependency update regression '$($case.Name)' reported an unexpected checkedCount." }
    if ([int]$caseReport.disabledCount -ne [int]$case.DisabledCount) { throw "Dependency update regression '$($case.Name)' reported an unexpected disabledCount." }
    if ([int]$caseReport.updateCount -ne 0) { throw "Dependency update regression '$($case.Name)' must not report updates." }
  }
} finally {
  Remove-Item -Recurse -Force -ErrorAction SilentlyContinue $dependencyUpdateTestRoot
}

# Regression check: runtime identifiers like __APP_INTERNAL_STATE__ are not build placeholders.
$verifyPath = Join-Path $Root "scripts\verify-standalone.ps1"
$tempVerifyPath = Join-Path ([System.IO.Path]::GetTempPath()) ("single-html-template-verify-" + [Guid]::NewGuid().ToString("N") + ".html")
$syntheticHtml = @'
<!doctype html>
<html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; connect-src 'none'">
</head><body><script>const __APP_INTERNAL_STATE__ = 1;</script></body></html>
'@
try {
  [System.IO.File]::WriteAllText($tempVerifyPath, $syntheticHtml, (New-Object System.Text.UTF8Encoding($false)))
  & $verifyPath -Path $tempVerifyPath -RequireNetworkBlock $true -RequireCanonicalIcon $false
} finally {
  Remove-Item -Force -ErrorAction SilentlyContinue $tempVerifyPath
}

$app = Get-Content -Raw -Encoding UTF8 (Join-Path $Root "app.config.json") | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace([string]$app.name)) { throw "app.config.json: name is required" }
if ([string]::IsNullOrWhiteSpace([string]$app.slug)) { throw "app.config.json: slug is required" }
if ([string]::IsNullOrWhiteSpace([string]$app.version)) { throw "app.config.json: version is required" }

$buildArguments = @{}
if ($ForceDownload) { $buildArguments.ForceDownload = $true }
& (Join-Path $Root "build-standalone.ps1") @buildArguments

$repositoryName = [string]$app.repository.name
if ([string]::IsNullOrWhiteSpace($repositoryName)) { throw "app.config.json: repository.name is required" }
$rootHtmlBaseName = $repositoryName
if ($rootHtmlBaseName.StartsWith("htmlapps-", [System.StringComparison]::OrdinalIgnoreCase)) {
  $rootHtmlBaseName = $rootHtmlBaseName.Substring("htmlapps-".Length)
}
if ([string]::IsNullOrWhiteSpace($rootHtmlBaseName) -or $rootHtmlBaseName -in @(".", "..")) {
  throw "app.config.json: repository.name does not produce a valid repository-root HTML filename"
}
$rootHtmlPath = Join-Path $Root ($rootHtmlBaseName + ".html")
if (-not (Test-Path -LiteralPath $rootHtmlPath -PathType Leaf)) {
  throw "Repository-root HTML was not generated: $rootHtmlPath"
}

$configuredOutput = [string]$app.build.output
$readableOutputPath = if ([System.IO.Path]::IsPathRooted($configuredOutput)) {
  $configuredOutput
} else {
  Join-Path $Root $configuredOutput
}
if (-not (Test-Path -LiteralPath $readableOutputPath -PathType Leaf)) {
  throw "Readable standalone HTML was not generated: $readableOutputPath"
}

$rootHtmlHash = $null
$readableOutputHash = $null
foreach ($hashTarget in @(
  @{ Name = "root"; Path = $rootHtmlPath },
  @{ Name = "readable"; Path = $readableOutputPath }
)) {
  $hashStream = [System.IO.File]::OpenRead([string]$hashTarget.Path)
  $hashAlgorithm = [System.Security.Cryptography.SHA256]::Create()
  try {
    $hashValue = (($hashAlgorithm.ComputeHash($hashStream) | ForEach-Object { $_.ToString("x2") }) -join "")
  } finally {
    $hashAlgorithm.Dispose()
    $hashStream.Dispose()
  }
  if ([string]$hashTarget.Name -eq "root") {
    $rootHtmlHash = $hashValue
  } else {
    $readableOutputHash = $hashValue
  }
}
if ($rootHtmlHash -ne $readableOutputHash) {
  throw "Repository-root HTML must be an exact copy of the readable standalone HTML."
}

Write-Host "[OK] Repository-root HTML matches the readable standalone build: $rootHtmlPath" -ForegroundColor Green
Write-Host "[OK] Repository check passed." -ForegroundColor Green

# WebRTC readiness DataChannel regression
$webrtcReadyText = Get-Content -Raw -Encoding UTF8 (Join-Path $Root "components\webrtc-qr-pairing.html")
if (-not $webrtcReadyText.Contains("readyChannelLabel: null")) {
  throw "WebRTC component is missing readyChannelLabel."
}
if (-not $webrtcReadyText.Contains("requireReadyChannelOpen: true")) {
  throw "WebRTC component is missing requireReadyChannelOpen."
}
if (-not $webrtcReadyText.Contains("readyChannelLabel is required when createDefaultChannel is false")) {
  throw "Custom WebRTC DataChannel layouts must require readyChannelLabel."
}
if (-not $webrtcReadyText.Contains("options.requireReadyChannelOpen!==false&&(!readyChannel||readyChannel.readyState!=='open')")) {
  throw "WebRTC application-ready must wait for the designated DataChannel to open."
}

