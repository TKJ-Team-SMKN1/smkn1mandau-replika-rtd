# CVD UI/UX adaptation — implementation notes

## Goal
Add user-controlled, reversible color-vision support to the existing SMKN 1 Mandau replica redesign without changing production deployment state.

## Profiles
- P00 Accessible Default
- P01 Protanomaly Assist
- P02 Protanopia Assist
- P03 Deuteranomaly Assist
- P04 Deuteranopia Assist
- P05 Tritanomaly Assist
- P06 Tritanopia Assist
- P07 Low-Chroma / Monochrome-Friendly
- P08 High-Distinction UI
- P09 Personal Adjustment

These are ten UI presentation profiles, not ten diagnoses. The six clinical labels are starting points only. The current implementation intentionally does not apply per-diagnosis hue matrices: the evidence does not establish universally safe values for each diagnosis. Every non-default profile uses redundant non-color cues; P07 adds a restrained pattern to status surfaces; P08 strengthens component outlines. Cue strength is independently selectable (subtle, balanced, stronger).

## Implementation
- Extends the existing keyboard-operable accessibility panel.
- Persists profile and cue strength with the existing local-only preference record.
- Applies data attributes to the document root; CSS uses semantic hooks and never recolors user photos/video.
- Keeps P00 as the default and reset target.
- Keeps WCAG 2.2 AA text/non-text contrast and color-independent semantics as separate acceptance requirements.
- Adds localization keys for EN, MY, and Simplified Chinese.

## Validation boundaries
Automated source audits and CI are engineering preflight only. They do not prove WCAG conformance or usability with CVD. Manual route/state review, keyboard, TalkBack/VoiceOver/NVDA where available, forced-colors, all site themes, and real-user task evaluation remain necessary.
