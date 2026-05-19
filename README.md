# W3C Design System for Liferay

A Liferay site initializer plus theme client extension that recreates the look and feel of the
[W3C Design System](https://design-system.w3.org/) inside Liferay DXP 7.4.13.

## Contents

```
W3C-ds/
├── settings.gradle                ← workspace plugin (Gradle)
├── gradle.properties              ← liferay.workspace.product=dxp-2024.q4.0
├── build-scripts/
│   └── w3c-site-initializer/
│       ├── bnd.bnd                ← OSGi headers (Liferay-Site-Initializer-Name, Provide-Capability)
│       └── build.gradle
├── client-extensions/
│   └── w3c-theme/
│       ├── client-extension.yaml  ← type: themeCSS
│       ├── frontend-token-definition.json
│       └── src/index.css          ← primitives + semantic tokens (W3C palette, Noto Sans, 24px pill buttons)
├── META-INF/
│   └── resources/thumbnail.png    ← shown in "New Site → Select Template"
└── site-initializer/              ← source of truth — EDIT HERE
    ├── thumbnail.png
    ├── fragments/group/w3c/
    │   ├── collection.json        ← "W3C Components"
    │   ├── resources/             ← logo-w3c.svg + all icon-*.svg
    │   └── fragments/w3c-*/       ← 33 fragments
    ├── layout-page-templates/master-pages/main/
    ├── layouts/                   ← 1_home, styles, components
    ├── layout-set/public/metadata.json
    └── style-books/               ← w3c-default (default), w3c-dark
```

## What you get

- **OSGi site initializer** named **"W3C Design System"** that appears in *New Site → Select Template*.
- **CSS theme client extension** `w3c-theme` that publishes the W3C token palette as CSS variables.
- **33 fragments** under the `w3c-*` namespace (header, footer, hero, button, card, accordion, tabs,
  badge, breadcrumb, divider, dropdown, modal, alert, notification, pagination, progress,
  spinner, input, select, radio, checkbox, textarea, search, sign-in, link, list, tooltip,
  datepicker, timepicker, header-dynamic, header-official, styles-showcase, components-grid).
- **3 pages**:
  - `/home` — Default template (hero, breadcrumb, news cards, accordion, alert quote)
  - `/styles` — colors, typography, spacing, icons
  - `/components` — gallery of every fragment
- **2 style books**: `W3C Default` (light) and `W3C Dark`.

## Build

### 1) Site initializer (OSGi JAR)

The workspace's bundled JS transpiler does not work for a resources-only bundle, so build the
JAR manually from the workspace root. First create the manifest from the bnd headers:

```bash
cat > /tmp/w3c-manifest.mf <<'EOF'
Manifest-Version: 1.0
Bundle-ManifestVersion: 2
Bundle-Name: W3C Site Initializer
Bundle-SymbolicName: com.w3c.site.initializer
Bundle-Version: 1.0.0
Liferay-Site-Initializer-Name: W3C Design System
Provide-Capability: liferay.site.initializer
Web-ContextPath: /site-initializer-w3c

EOF
```

(Note: the trailing blank line is required for a valid manifest.)

Then build the JAR including both `site-initializer/` and `META-INF/`:

```bash
mkdir -p build-scripts/w3c-site-initializer/build/libs
jar cfm build-scripts/w3c-site-initializer/build/libs/com.w3c.site.initializer-1.0.0.jar \
  /tmp/w3c-manifest.mf \
  -C . site-initializer -C . META-INF
```

### 2) Theme client extension (ZIP)

```bash
./gradlew :client-extensions:w3c-theme:assemble
```

The artifact is `client-extensions/w3c-theme/dist/w3c-theme.zip`.

## Deploy

Drop both artifacts into the Liferay `deploy/` directory of your target instance:

- `build-scripts/w3c-site-initializer/build/libs/com.w3c.site.initializer-1.0.0.jar`
- `client-extensions/w3c-theme/dist/w3c-theme.zip`

Confirm in the Liferay logs:

- The bundle `com.w3c.site.initializer` reaches the `STARTED` state.
- The client extension `w3c-theme` is registered (look for the `cssURL` entry under
  *Control Panel → System → Client Extensions*).

## Create the site

1. Go to **Control Panel → Sites → Add Site** (or *Site Admin → New Site*).
2. Pick the **W3C Design System** entry under *Select Template*.
3. Name it (e.g. `W3C DS`) and finish.

Liferay copies all fragments, layouts, master page and style books into the new site.

## Select the CSS theme (post-site creation)

The site is created with `themeName: "Classic"` because Liferay 7.4.13 does not resolve a
`themeCSS` client extension via the site initializer metadata. Apply the W3C theme manually:

1. Go to **Site Administration → Site Builder → Pages**.
2. Click **Configuration** (gear icon) → **Look and Feel** *(or "Site Settings → Look and Feel")*.
3. Under **CSS Client Extension**, pick **W3C Theme** from the dropdown.
4. Save. The site picks up the W3C palette, typography (Noto Sans) and pill buttons.

If you also want the dark style book applied site-wide:

1. **Site Builder → Style Books**.
2. Open **W3C Dark** and set as default (or apply per page).

## Edit / iterate

- Edit fragments, layouts, master page and style books **under `site-initializer/`** —
  that directory is the single source of truth.
- Edit theme tokens under `client-extensions/w3c-theme/src/index.css`
  (primitives in `--regular-primitives-*`; semantics in `--color-*`).
- Rebuild the JAR / ZIP (commands above) and redeploy. Existing sites do **not** pick up
  changes from the JAR — only newly created sites do. Theme CE changes are live on redeploy.

## Liferay 7.4.13 specifics (gotchas)

- Fragment FreeMarker uses **bracket** syntax: `[#if]…[/#if]`. AntiSamy filters `<#if>`.
- Avoid `[#elseif]`. Use multiple `[#if]` blocks with a `[#assign]` instead.
- Checkbox config fields: no `dataType`, and `defaultValue` is the string `"true"`/`"false"`.
- Style books always use `"themeId": "classic_WAR_classictheme"`.
- The site initializer thumbnail must live at `META-INF/resources/thumbnail.png` inside the JAR
  (not at `site-initializer/thumbnail.png` — keep one copy in each path for safety).
- `fragment.json` must reference `"configurationPath": "configuration.json"` exactly.

## License

This implementation is based on the publicly available W3C design system source. The W3C logo,
trademarks and any visual identity belong to the W3C — usage is subject to W3C
[trademark policy](https://www.w3.org/policies/#trademarks).
