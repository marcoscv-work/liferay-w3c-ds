# CLAUDE.md — W3C Design System for Liferay

Project context for AI assistants working on this Liferay site initializer.

## What this project is

A Liferay 7.4.13 site initializer + themeCSS client extension that recreates
the [W3C Design System](https://design-system.w3.org/) inside a Liferay site.
The single source of truth lives in `site-initializer/` (edit there); the
build copies it into an OSGi JAR.

Build / deploy steps are documented in `README.md`.

## Theme client extension utilities — duplicated in fragments

The W3C theme client extension at
`client-extensions/w3c-theme/src/index.css` exposes utility classes used by
several fragments:

`.l-center`, `.l-cluster`, `.l-sidebar`, `.l-switcher`, `.clean-list`,
`.with-icon`, `.icon`, `.icon--larger`, `.visuallyhidden`, `.lead`,
`.u-full-width`.

These classes also exist **duplicated at the top of these 9 fragment CSS
files**:

```
site-initializer/fragments/group/w3c/fragments/
├── w3c-header/index.css
├── w3c-footer/index.css
├── w3c-hero/index.css
├── w3c-breadcrumb/index.css
├── w3c-crosslinks/index.css
├── w3c-tag-list/index.css
├── w3c-pagination/index.css
├── w3c-styles-showcase/index.css
└── w3c-form-input/index.css
```

**Why the duplication exists:** Liferay's Style Book → fragment preview
iframe only loads the fragment's own `index.css`. The theme client
extension stylesheet is NOT injected, so a fragment that relies on theme
helpers renders unstyled in that preview (e.g. the header collapses
because `.clean-list` and `.l-center` have no effect).

**This is a temporary workaround. Remove it once Liferay loads theme CSS
into the Style Book fragment preview.** When that upstream fix lands:

1. Delete the duplicated utility class declarations at the top of each of
   the 9 fragment `index.css` files listed above.
2. Keep only the fragment-specific styles (anything below the utility
   classes — typically starting at `.global-header`, `.global-footer`,
   `.hero`, `.breadcrumb`, etc.).
3. Rebuild the JAR and redeploy.

Do not add new fragment-level duplicates of theme utility classes —
prefer to put new utilities in the theme and expect Liferay to fix the
preview limitation.

## Other Liferay 7.4.13 gotchas

- Fragment FreeMarker uses bracket syntax `[#if]…[/#if]` (AntiSamy filters
  `<#if>`). Avoid `[#elseif]`; use multiple independent `[#if]` blocks.
- Checkbox config fields: no `dataType`; `defaultValue` is the string
  `"true"`/`"false"`.
- Style books always use `"themeId": "classic_WAR_classictheme"`.
- The site initializer thumbnail must live at
  `META-INF/resources/thumbnail.png` inside the JAR.
- `fragment.json` references `"configurationPath": "configuration.json"`.
- Master page reference goes inside the page-definition.json `settings`
  block: `"settings": {"masterPage": {"key": "main"}}`. The "key" is the
  master's `layoutPageTemplateEntryKey` (auto-generated from the master's
  name; "Main" → "main").
