cask "xisland" do
  version "2.0.18"
  sha256 "7d7350a434d689d59dc07d5787ebcc76ec9020192a4d3ce534266442aff42f97"

  url "https://github.com/Meteorkid/XIsland/releases/download/v#{version}/XIsland-#{version}.dmg"
  name "X Island"
  desc "Dynamic Island control tower for AI coding agents"
  homepage "https://www.imagentx.top/zh/products/xisland"

  livecheck do
    url :url
    strategy :github_latest
  end

  auto_updates true
  depends_on macos: :sonoma

  app "X Island.app"

  # 这个包没有 Apple Developer 签名与公证，Gatekeeper 会在首次启动时拦截。
  # 必须如实告知：不写 caveats 的话，用户装完打不开、也不知道为什么，
  # 会直接卸载并留下差评 —— 比不提供 cask 更糟。
  caveats <<~EOS
    X Island is not signed with an Apple Developer certificate, so macOS will
    block it on first launch. If you see "X Island is damaged" or
    "cannot be opened because the developer cannot be verified", run:

      xattr -cr "/Applications/X Island.app"

    Or open System Settings → Privacy & Security and click "Open Anyway"
    next to the X Island warning.
  EOS
end
