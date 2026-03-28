# Moose Docs Landing Page — Ideas

## Overview

The SvelteKit library project doubles as its own docs site (routes outside `src/lib` are excluded from the package). The landing page lives at `src/routes/+page.svelte`.

## Guiding Principles

- Minimal CSS for now — focus on getting the HTML and content out there
- Straightforward, deadpan tone — no catchy taglines, no "fun" or "clickbaity" copy. Short sentences that convey the selling points plainly. Dare to be boring.
- Let the code examples do the heavy lifting. Prose should be 1-2 sentences per section max.
- The comment in `+page.svelte` has the original brainstorm notes.

## Page Structure (agreed direction)

### 1. Hero
- "Moose" + a short, straightforward description (NOT a catchy tagline — see feedback below)
- `npm i @dugalcedo/moose` install command up front
- Small row of pills: "Minimal" / "Flexible" / "Unopinionated" / "Not a UI library"

### 2. `defineHandler` — the keystone
- Core pitch: no Response objects, no try/catch. You return or throw. That's it.
- Show a simple GET and a POST with Zod body schema (use the math example)
- Show the type exports (`typeof POST.inferInput`, `typeof POST.inferOutput`) as the bridge to frontend sections
- Secondary appeals: automatic zod error handling, easy JWT helper

### 3. `request()` — reactive fetching
- Use inferred types on the frontend. Reactive state (isPending, data, error).
- Quick usage example with the math endpoint
- Brief mention of polling and `sharedRequest`

### 4. `defineForm()` — form handling
- Zod or custom validation, `prepare` transform, `onGoodRes`/`onBadRes`
- Server-side Zod errors automatically map back to form field errors

### 5. `Field` / `FieldError` / `FieldHint`
- Optional, unstyled components
- Auto-generated IDs, aria attributes, zero CSS
- Completely optional — users can handle errors/hints however they want

### 6. Install + links
- Repeat install command, link to full docs

## Feedback

- **No catchy taglines.** The "define once, infer everywhere" suggestion was rejected — too cheesy, too Java. Instead, use short straightforward sentences that convey selling points plainly.
- Code examples should be static (`<pre><code>`) to start. Live/interactive demos can come later.

## Open Questions

- Exact wording for the hero description (needs to be written fresh with the straightforward tone)
- Whether to include live demos later using the existing math/currency API routes
