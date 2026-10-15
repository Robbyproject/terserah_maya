---
name: Floaty Azure
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#2260a2'
  on-secondary: '#ffffff'
  secondary-container: '#81b6fd'
  on-secondary-container: '#004681'
  tertiary: '#006387'
  on-tertiary: '#ffffff'
  tertiary-container: '#007da9'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a4c9ff'
  on-secondary-fixed: '#001c39'
  on-secondary-fixed-variant: '#004883'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7bd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels an upbeat, airy, and candid personality inspired by playful, modern consumer packaging. It embraces high-energy optimism through vivid sky-blue tones, grounded deep cerulean typography, and clean, generous white surfaces.

The style fuses **modern minimalism** with **tactile, pill-shaped playfulness**:
- **Clean & Light**: Spacious layouts on crisp, cool-tinted canvases create an uncluttered, modern browsing environment.
- **Expressive & Approachable**: Chunky pill shapes, lively high-contrast blue accents, and buoyant touchpoints make every interaction feel responsive, cheerful, and effortless.
- **Punchy Contrast**: Dark cerulean and midnight blues substitute standard muted greys, ensuring sharp legibility while reinforcing the distinct brand palette.

## Colors

The palette is derived from the bright sky and deep ink blues of the packaging reference, completely replacing warm orange/reds with a layered blue spectrum.

- **Primary (`#0284c7` - Sky Blue)**: Anchors prominent CTAs, active indicators, and high-priority user actions. Bright, energetic, and eye-catching.
- **Secondary (`#025091` - Deep Cerulean)**: Used for robust structural anchors, emphasized badges, primary headings, and selected states requiring deep visual authority.
- **Tertiary (`#38bdf8` - Vivid Electric Light Blue)**: Provides luminous accents, hover glow effects, pill badges, and light background fills.
- **Neutral (`#0f172a` - Ink Deep Blue/Slate)**: Replaces dull flat black for body text and solid icons, harmonizing seamlessly with the chromatic blue tones.
- **Canvas / Tinted Backgrounds**: Base background sits at `#f8fafc` with subtle container fills at `#f0f9ff` and clean floating surfaces at `#ffffff`.

## Typography

The type system exclusively leverages **Plus Jakarta Sans**, mirroring the geometric, friendly, and readable sans-serif feel of contemporary lifestyle packaging. 

- Large titles adopt a heavy weight (`700` or `800`) with subtle negative tracking for a crisp, punchy presentation.
- Body copy emphasizes clarity and breathability with an open 1.5x line-height ratio.
- Micro-labels, weight tags, and pill chips utilize medium-to-bold weights with slight letter-spacing to preserve punchy legibility at compact scales.

## Layout & Spacing

A flexible 12-column grid system governs desktop views, adapting to 8 columns on tablet and 4 columns on mobile screens.

- **Canvas Margins**: Set to `2rem` on desktop for wide side breathing space, stepping down to `1rem` on mobile to maximize content real estate.
- **Component Rhythms**: Internal element grouping follows strict multiples of `4px` / `8px`, utilizing `space-md` (`1rem`) for standard gaps and `space-xl` (`2.5rem`) for separating disparate product modules.
- **Reflow Behavior**: Grids naturally stack cards from multi-column rows into clean single-column or 2-column masonry on handheld devices.

## Elevation & Depth

Visual hierarchy favors clean white surfaces against soft icy-blue backgrounds rather than dark, muddy dropshadows.

- **Ambient Tinted Shadows**: Elevations use gentle cerulean-tinted ambient shadows (`0 8px 24px -4px rgba(2, 80, 145, 0.08)` and `0 2px 6px -1px rgba(2, 80, 145, 0.04)`), creating a buoyant, floating aesthetic.
- **Micro-Borders**: Subtle `1px` borders in `rgba(2, 132, 199, 0.12)` or crisp white halos define element perimeters cleanly over pale sky backgrounds.
- **Floating Modals & Dropdowns**: Layered surfaces sit on elevated white cards with soft, expansive blurs (`blur: 16px`, `rgba(2, 80, 145, 0.12)`).

## Shapes

The geometry draws heavily from the playful pill-shaped product weight badge (e.g., the `60gr` badge) on the reference snack packaging.

- **Full-Pill Treatment**: Tags, chips, primary CTA buttons, and status badges utilize complete pill radii (`roundedness: 2` / `9999px`), delivering a fun, approachable, and tactile demeanor.
- **Containers & Cards**: Larger panels and cards use `rounded-xl` (`1.5rem` / `24px`) to mirror the softened silhouette of pillow-pack snack wraps.

## Components

### Buttons
- **Primary Action**: Pill-shaped (`rounded-full`), solid `#0284c7` fill, crisp white text, and a soft blue glow on hover (`0 6px 20px rgba(2, 132, 199, 0.35)`). Active state scales slightly down (`0.98`).
- **Secondary Action**: White or `#f0f9ff` container fill with a vibrant `#0284c7` border (`1.5px`) and `#025091` typography.
- **Ghost/Tertiary**: No border, cerulean `#0284c7` label, shifting to light `#e0f2fe` background on hover.

### Badges & Chips
- Modeled directly after the iconic snack badge: elongated capsule silhouettes with deep blue (`#025091`) or electric blue (`#0284c7`) solid fills and bold white type.
- Filter chips default to `#f0f9ff` with `#025091` text, turning solid `#0284c7` with white type when selected.

### Input Fields
- Enclosed with soft pill or 16px curved borders, `#ffffff` surface, and a subtle `1.5px` border in `#bae6fd`.
- Focused state transitions to a bold `#0284c7` perimeter accompanied by a faint sky-blue outer ring (`0 0 0 3px rgba(56, 189, 248, 0.25)`).

### Cards
- Set upon pure white `#ffffff` surfaces over the default `#f8fafc` canvas.
- Rounded with `1.5rem` corners, padded with `1.5rem` internally, bounded by a feather-light `#e0f2fe` stroke, and lifted with an airy cerulean-tinted shadow.

### Selection Controls (Checkboxes & Radios)
- Rounded forms filled with `#0284c7` upon check, displaying sharp white icons.
- Inactive states feature `#e2e8f0` background borders that shift to `#38bdf8` on hover.