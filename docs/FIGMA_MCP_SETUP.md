# Figma MCP Setup (Scope 1)

Figma MCP is required for pixel-accurate UI parity audits. Enable it once per Cursor workspace.

## Option A — Figma plugin (recommended)

1. Open Cursor agent chat and run: `/add-plugin figma`
2. Click **Install**, then **Connect** when prompted
3. Authorize your Figma account in the browser
4. Confirm a green status dot next to `figma` under **Cursor Settings → MCP**

## Option B — Manual MCP config

Add to **Cursor Settings → MCP → Add new global MCP server**:

```json
{
  "mcpServers": {
    "figma": {
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

Then click **Connect** and authorize.

## After setup

1. Open the Noblocks **mobile** Figma file
2. Copy the file URL from the address bar
3. Paste it in chat so audits can target the correct frames

## Connected file (source of truth)

| Field | Value |
|-------|-------|
| File | [Noblocks Mobile](https://www.figma.com/design/GCRxGIlmEaLFTPAqZqG7y7/Noblocks-Mobile) |
| File key | `GCRxGIlmEaLFTPAqZqG7y7` |
| Canvas page | `V1` (`0:1`) |
| Cover page | `1:29747` |

Paste a frame-specific URL (with `node-id=`) when auditing a single screen, e.g. onboarding frame `1:6693`.

## Asset export (icon / splash / onboarding hero)

Exported via Figma MCP `get_screenshot` + `get_design_context` on 2026-06-07:

| Asset | Figma node | Output |
|-------|------------|--------|
| App icon + splash | `1:7118` (Noblocks Logo SVG) | `assets/images/icon.png` (1024), `splash-icon.png` (200), `adaptive-icon.png`, `favicon.png` |
| Onboarding illustration | `1:6693` (crop 340×197) | `assets/images/onboarding-hero.png` |

Source files cached in `assets/source/`. Re-export when MCP URLs expire (~7 days):

```bash
# 1. Refresh URLs in scripts/export-figma-assets.mjs via Figma MCP
# 2. Run:
pnpm export-figma-assets
# 3. iOS native splash/icon refresh:
pnpm prebuild --platform ios --clean
```

## References

- [Figma remote MCP installation](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/)
- [Figma MCP help center](https://help.figma.com/hc/en-us/articles/35281350665623-Figma-MCP-collection-How-to-set-up-the-Figma-remote-MCP-server)

## Interim source of truth

Until Figma MCP is connected, use:

- `agentic-web/public/logos/` for brand marks
- `constants/Colors.ts` for theme tokens
- `docs/UI_SCREEN_INVENTORY.md` for route ↔ screen mapping
