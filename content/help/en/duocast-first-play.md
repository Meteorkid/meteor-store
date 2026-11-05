## Prepare your Mac and output devices

DuoCast routes one audio source to up to three outputs, each with its own volume, delay and 10-band EQ. The current package requires **macOS 14.2 or later on an Apple Silicon Mac**. A Windows installer is not available yet.

Connect your headphones or speakers before opening the app. A wired headset paired with a Bluetooth headset is a useful starting setup. Simultaneous playback on two Bluetooth headsets depends on the system and devices; DuoCast does not guarantee this combination.

## Download, verify and install

1. Open the [download section on the DuoCast product page](/en/products/duocast#download) and download the macOS package. No sign-in is required. The download card shows the current version and filename.
2. Check the download source and SHA-256. Use the filename shown on the download card. If the file is in your default Downloads folder, substitute that filename in this command and run it in Terminal:

   ```bash
   shasum -a 256 ~/Downloads/DuoCast-<version>-macOS-arm64.zip
   ```

   The complete checksum is in the [GitHub Release](https://github.com/Meteorkid/duocast/releases) notes for the current version on the download card. If the values differ, download the package again or report the issue before proceeding.
3. Extract the ZIP and move `DuoCast.app` to Applications.
4. Open the app. This build is **ad-hoc signed and has not been notarized by Apple**. If macOS cannot verify the developer or check the app for malicious software, first confirm that the source is trustworthy and the checksum matches. Then open System Settings → Privacy & Security, find DuoCast, click Open Anyway and follow the confirmation prompts.

This creates an exception for this app. See Apple's [Safely open apps on your Mac](https://support.apple.com/en-us/102445). If macOS says the app is damaged and you have confirmed both the download source and checksum, run the command below in Terminal to remove the quarantine attribute from this DuoCast app only, then try opening it again:

```bash
xattr -dr com.apple.quarantine "/Applications/DuoCast.app"
```

Keep Gatekeeper enabled. Do not run commands that bypass security checks for the operating system or other apps. If the problem remains, [report it](/en/feedback?type=question) with the exact warning.

## Play audio for the first time

1. Choose a headset or speaker from the dropdown at the top of each output card. Start with two outputs, then add a third if needed.
2. Select system audio (「系统声音」) or a local audio file (「音频文件」) at the top left. For system audio, use 「采集：全部 App」 to select the apps you want to capture. For file input, choose a local file.
3. Turn each output's volume down first, then click 「开始分发」 to start routing. For system audio, play audio in the selected app; file mode uses the file you selected.
4. When capturing system audio for the first time, grant Screen & System Audio Recording permission. You can also find DuoCast under System Settings → Privacy & Security → Screen & System Audio Recording, enable access and follow any system prompts.

Without this permission, system audio capture may produce silence. Check permission and the input source before checking each output device and its volume.

## Adjust volume, delay and EQ

- **Volume:** Adjust each output card gradually. Each output has an independent level.
- **Delay:** Listen for the output that arrives earlier and add delay to that output. With wired and Bluetooth headphones, this usually means delaying the wired output or built-in speakers to match Bluetooth.
- **EQ:** Adjust the 10-band equalizer for each headset. Volume, delay and EQ settings are saved per device and restored when you use it again.

Devices can be connected or disconnected while routing. Disconnecting one stops only its output. Adding or removing output channels stops routing; start it again after changing the channel count.

## Stop playback and troubleshoot

Click 「停止分发」 in the control panel to stop routing. **Closing the window does not quit the app.** You can also right-click DuoCast in the Dock to stop routing or reopen the control panel. Locking the Mac or putting it to sleep stops routing; start it manually after waking.

If one output is silent, check that the device is connected, its card selects the correct device, and its volume is audible. If all system audio is silent, check capture permission and the selected apps. When only one of two Bluetooth headsets plays, try a wired and Bluetooth combination to distinguish a Bluetooth connection limit from a volume setting.

If the issue persists, [send a question](/en/feedback?type=question) with your DuoCast version, macOS version, device combination, input source and steps to reproduce it. Project information and release history are available in the [DuoCast GitHub repository](https://github.com/Meteorkid/duocast).
