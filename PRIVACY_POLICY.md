# Privacy Policy — AltQ

**Last updated:** August 24, 2026

AltQ ("the extension", "we", "us") is a browser extension developed by an independent developer. This policy applies to both the AltQ (Free) and AltQ PRO builds.

## Summary

**AltQ has no backend server. It never collects, transmits, or sells your data.** Everything the extension does happens locally, inside your own browser.

## What AltQ does with your data

### Selected text
When you select text on a page and use AltQ (via the popup, Alt+Q, or right-click "Send to AI"), that text is inserted directly into the input field of the AI website you chose (e.g. ChatGPT, Claude, Perplexity) — the same as if you had typed or pasted it yourself. This text is **never sent to AltQ or to any server we operate.** It goes only to the third-party AI website you selected, subject to that website's own privacy policy and terms.

### Locally stored data
AltQ uses your browser's built-in local storage (`chrome.storage.local`) to save your preferences and content on your own device. This includes:
- Your settings (theme, hotkeys, popup mode, sound on/off, etc.)
- Usage statistics (counts and time-saved estimates) — numbers only, never the content of what you sent
- Your custom prompts (PRO), if you create any

None of this data is transmitted anywhere. It stays on your device and is removed if you uninstall the extension.

### Local file sync (PRO only)
AltQ PRO can optionally sync your custom prompts to a folder on your computer using the browser's File System Access API, so you can edit them as plain `.txt` files. This is entirely local — files are read from and written to your own disk, never uploaded anywhere. This feature is off unless you explicitly connect a folder.

### Purchases
If you choose to buy AltQ PRO or support the developer via Ko-fi, you leave the extension and are taken to a third-party payment page (Payhip / Ko-fi). We do not receive, process, or store your payment information — that is handled entirely by those third parties under their own privacy policies:
- Payhip: https://payhip.com/privacy
- Ko-fi: https://ko-fi.com/privacy

## Permissions we request, and why

| Permission | Why it's needed |
|---|---|
| `storage` / `unlimitedStorage` | Save your settings and custom prompts locally on your device |
| `tabs` | Open/find the right AI tab when you send text, and return you to your source tab |
| `contextMenus` | Show the "Send to AI" option when you right-click selected text |
| `alarms` (PRO only) | Periodically check for changes to synced prompt files on disk |
| Host access (all sites) | AltQ needs to detect text selection on any page you choose to use it on, and to insert text into the AI site you pick. Without this, the core feature (select text anywhere → send anywhere) would not work. |

## Data we do NOT collect

- We do not collect analytics, telemetry, or crash reports.
- We do not use cookies or tracking pixels.
- We do not know who you are, what pages you visit, or what text you send.
- We do not sell or share data with advertisers or any other third party, because we do not collect any data to begin with.

## Children's privacy

AltQ is not directed at children and does not knowingly collect any data from anyone, regardless of age.

## Changes to this policy

If AltQ's data handling ever changes (for example, if a future version adds an optional cloud sync feature), this policy will be updated first, and the change will be clearly disclosed in the extension's release notes before it takes effect.

## Contact / Support

This project is open on GitHub. Questions about this policy, your data, or bug reports and feature requests go through GitHub Issues:

**[github.com/your-username/altq/issues — replace with your actual repo URL]**

---
*This document covers both the AltQ (Free) and AltQ PRO extensions distributed by the same developer.*
