# Design specs — public panel

One compact file per section, extracted once from Figma (see `.cursor/rules/15-figma-mcp.mdc`). These files are
the cache: read them instead of calling Figma again. Update a file only if the Figma node changed.

Template:

```
# <Section> — node <desktop id> · mobile <mobile id>
## Texts
## Layout (desktop)
## Tokens (Figma variable → token) and text styles
## Components (reuse / extend / create)
## States shown in Figma (node ids)
## Mobile
```
