# WCAG 2.2 AA — Implementation Record

Status: accessibility improvements committed; full conformance is not claimed.

## Implemented

- Shared site shell uses semantic `header`, named primary/mobile `nav` landmarks, one `main` landmark, and a `footer` landmark.
- Footer destinations are now grouped in a named `nav aria-label="Navigasi footer"`, providing a second navigation method alongside the header.
- The mobile navigation exposes `aria-expanded`, `aria-controls`, a changing accessible name, Escape-to-close, focus restoration, and hidden-state handling.
- Main content has a skip link and a programmatically focusable `main` target.
- Page and navigation links expose the current page with `aria-current="page"`.
- Program and staff directory result counts expose status updates through `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`.
- Dynamic Color text on canvas surfaces uses the system foreground rather than assuming that an arbitrary OS accent color has sufficient text contrast. Branded hero text retains a light foreground; accent-filled controls use the system accent foreground.
- Primary navigation, mobile navigation, language selection, directory filters, and key controls use a 44 CSS px preferred target baseline. Footer links and the official-site link now also use a 44 CSS px minimum height.
- Reduced-motion and visible-focus rules remain enabled, including forced-colors support.
- Reflow support avoids clipping page content and allows long text fragments to wrap.

## WCAG 2.2 AA coverage

The implementation addresses relevant parts of:
- 1.3.1 Info and Relationships
- 1.3.2 Meaningful Sequence
- 1.4.3 Contrast (Minimum), including Dynamic Color text fallbacks
- 1.4.4 Resize Text
- 1.4.10 Reflow
- 1.4.12 Text Spacing
- 2.1.1 Keyboard and 2.1.2 No Keyboard Trap (native links, buttons, selects, and disclosure controls; interaction still requires manual verification)
- 2.4.1 Bypass Blocks
- 2.4.2 Page Titled
- 2.4.3 Focus Order
- 2.4.5 Multiple Ways
- 2.4.6 Headings and Labels
- 2.4.7 Focus Visible
- 2.4.11 Focus Not Obscured (Minimum)
- 2.5.3 Label in Name
- 2.5.8 Target Size (Minimum)
- 3.1.1 Language of Page
- 3.2.3 Consistent Navigation
- 4.1.2 Name, Role, Value
- 4.1.3 Status Messages

## Manual verification still required

A source-code change or static HTML check cannot establish WCAG conformance. Before claiming WCAG 2.2 AA compliance, verify every route and relevant state with:
1. Keyboard-only operation (Tab, Shift+Tab, Enter, Space, Escape) and visible focus at 200% zoom.
2. Reflow at 320 CSS px and text resize to 200%.
3. Text-spacing overrides: line height 1.5×, paragraph spacing 2×, letter spacing 0.12em, word spacing 0.16em.
4. Contrast of every text, icon, border, control, hover, focus, active, disabled, and error state across all five themes and both Dynamic Color system schemes.
5. TalkBack with Android Chrome and NVDA with a desktop browser; confirm landmarks, heading sequence, labels, live status announcements, and menu state.
6. Reduced-motion and forced-colors modes.
7. Any images, media, forms, and future interactive components added after this record.

This document records implementation work, not certification, a legal accessibility statement, or a claim that all WCAG 2.2 AA success criteria have been satisfied.

## Source review update — 18 November 2026

A focused source review covered the shared layout, primary and mobile navigation, footer, program and staff directories, global styles, theme compatibility rules, and the static audit scripts.

- Confirmed the shared shell contains named primary/mobile navigation landmarks, a skip link, a single main-content target, and a separately named footer navigation landmark.
- Confirmed the mobile disclosure updates its expanded state and accessible name, closes with Escape, restores focus to the menu button on Escape, and closes after navigation or an outside pointer interaction.
- Confirmed directory result counts use polite status announcements and the search controls retain programmatic labels.
- Confirmed reduced-motion and forced-colors rules remain present in the source styles; their rendered behavior still requires assistive-technology and browser verification.
- Reviewed the theme contrast preflight and reflow safeguards as source-level checks only. Dynamic operating-system color combinations, gradients, images, and every interactive state are not proven by this review.
- No browser, screen-reader, keyboard, zoom, or build test was run in this pass.

The review does not change the conformance status: WCAG 2.2 AA compliance is **not verified or certified**. The manual verification list above remains open.

## Production status update — 19 November 2026

- A production deployment is READY and the primary project alias returned HTTP 200 during the public route crawl.
- The project was sent an unpause request. However, the Vercel project details response continued to report `live: false`; see `docs/DEPLOYMENT-AUDIT-2026-11-19.md` for the control-plane discrepancy.
- The deployment does not change the accessibility status. Manual browser, keyboard, zoom, and assistive-technology verification remains outstanding.
