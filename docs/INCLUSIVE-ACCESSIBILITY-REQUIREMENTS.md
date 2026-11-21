# Inclusive accessibility requirements — supplementary to WCAG 2.2 AA

This document records user-needs-led practices in addition to the normative WCAG 2.2 Level A and AA matrix. It is not a separate certification and does not imply that every feature is already manually verified.

## Design principles

- **Deaf and hard-of-hearing users:** provide synchronized captions for prerecorded synchronized media with audio (WCAG 1.2.2), live captions where applicable (1.2.4), transcripts where useful, and visual/text status messages.
- **Non-speaking users:** never require a voice call as the only route to help; provide text-based contact and task alternatives. Keep visible control labels aligned with accessible names (2.5.3).
- **Autistic and other neurodivergent users:** use predictable navigation, clear literal wording, concise content chunks, stable layouts, user-controlled motion, and no surprise audio/video. Do not assume a diagnosis implies a single preferred presentation. Offer preferences individually.
- **Photosensitive users:** avoid strobe and decorative flashing entirely. Review every video, GIF, animation, and embedded media item against 2.3.1, including flash area and intensity; the three-flashes-per-second figure is not a blanket safe harbor. Provide pause/stop controls where 2.2.2 applies.
- **Color vision deficiency:** never use color alone to communicate status, meaning, or action (1.4.1); pair color with text, shape, icon, or pattern.
- **Low vision:** meet 4.5:1 normal-text contrast, 3:1 large-text contrast, and applicable 3:1 non-text contrast; support 200% text resize and 320 CSS px reflow. Do not attempt to change device brightness.
- **Motor and dexterity access:** support keyboard operation, visible and unobscured focus, and 24×24 CSS px minimum targets subject to WCAG exceptions; prefer 44×44 CSS px.
- **Cognitive and reading access:** use plain language, descriptive headings, visible labels, helpful errors, forgiving forms, and consistent controls.
- **Older adults:** provide readable typography, clear action labels, simple task paths, and mobile layouts without assuming abilities from age.
- **Low-end devices and slow networks:** keep primary content readable if optional assets fail; optimize images, fonts, and scripts; avoid unnecessary autoplay and heavy animation.
- **Language access:** preserve complete ID, EN, MY and Simplified Chinese localization, correct document/part language tags, and locale-aware formats.
- **Accessible documents:** prefer HTML for important school information; PDFs must have real text, logical reading order, headings, table headers, and document language.

## User-controlled preference panel

The shared site shell provides optional controls for text size up to 200%, higher contrast, reduced motion, a simplified reading presentation, and color-independent visual reinforcement for links and common status hooks. The visual aid reinforces underlines and outlines; it is not a color-vision simulator and does not guarantee that every chart or status is understandable without color. Preferences are stored locally on the current device and can be reset. They do not replace browser/OS accessibility settings, captions, assistive technology, or user testing. The panel itself must remain keyboard and screen-reader operable.

## Release verification

1. Check every route and interactive state, not only the homepage.
2. Test keyboard-only, TalkBack, NVDA, and VoiceOver where devices are available.
3. Measure contrast for every theme and state; inspect color-independent cues.
4. Test 200% text resize, 320 CSS px reflow, text-spacing overrides, orientation, and forced colors.
5. Review all media for captions, transcripts, audio description needs, and flashing hazards.
6. Test reduced motion and ensure users can pause applicable moving content.
7. Test on constrained Android devices and slower connections.
8. Include people with varied access needs in usability evaluation; record barriers and retest fixes.

## Normative versus supplemental

WCAG success criteria are normative conformance requirements. Autism-friendly patterns, low-bandwidth optimization, text-only contact alternatives, and user research are valuable inclusive practices but are not each separate WCAG success criteria. WCAG 2.2 AA conformance requires every applicable Level A and AA criterion, not just the items emphasized here.

## References

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [WAI Cognitive Accessibility](https://www.w3.org/WAI/cognitive)
- [WAI Supplemental Guidance](https://www.w3.org/WAI/WCAG2/supplemental/)
- [Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/)
- [WCAG Evaluation Methodology (WCAG-EM) 2.0](https://www.w3.org/TR/wcag-em-2/)


## Current real-user validation status — 21 November 2026

- The project does **not** currently have real users with varied access needs participating as accessibility testers.
- Keyboard, screen-reader, low-vision, Deaf/hard-of-hearing, neurodivergent, and motor-access workflows have not been validated through direct user testing for this release.
- Existing source checks, automated audits, and static WCAG matrices are engineering preflight only. They do not establish usability or WCAG 2.2 AA conformance.
- The public accessibility page must state this limitation plainly and must not claim that the website is accessible to everyone or certified.
- Feedback intake through public GitHub Issues must warn contributors not to publish diagnoses, medical records, addresses, or other sensitive personal information.
- Physical school accommodations (accessible routes, toilets, quiet rooms, assistance, event seating, or other on-campus services) are outside the verified scope of this independent website replica. Do not imply they exist without confirmation from an official school source.
- The Eurofurence accessibility page is used as a reference for transparent communication about available accommodations, limitations, content warnings, venue access, and feedback. Its event-specific services must not be attributed to SMK Negeri 1 Mandau.

A future manual evaluation should invite volunteers with varied access needs, compensate or otherwise respect their time where possible, obtain informed consent, avoid collecting unnecessary health information, document barriers without identifying participants, and retest fixes with the people affected.
