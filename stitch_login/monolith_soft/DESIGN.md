# Design System Specification: The Ethereal Terminal

## 1. Overview & Creative North Star
**Creative North Star: "The Obsidian Glass Architecture"**

This design system moves away from the rigid, sharp-edged aesthetic of traditional command-line interfaces toward a high-end, editorial SaaS experience. By combining a "Pitch Black" (#000000) foundation with the electric energy of "Cyber Green" (#9CFF93 / #00FC41), we create a high-contrast environment that feels both authoritative and infinitely deep.

The core philosophy breaks the "template" look through **Tonal Nesting**. We do not use lines to define space; we use light and shadow. The UI should feel like a series of polished obsidian plates floating in a void, utilizing exaggerated corner radii (`ROUND_SIXTEEN`) to soften the technical edge and invite interaction.

---

## 2. Colors & Surface Logic

### The "No-Line" Rule
To achieve a premium, seamless aesthetic, **1px solid borders are strictly prohibited** for sectioning. Boundaries must be defined solely through background color shifts or subtle tonal transitions. Use `surface_container_low` against a `surface` background to define regions.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack. The deeper the element is in the workflow, the higher its surface elevation:
*   **Base Layer:** `surface` (#0e0e0e) or `surface_container_lowest` (#000000).
*   **Section Layer:** `surface_container` (#191919) to define main content areas.
*   **Component Layer:** `surface_container_high` (#1f1f1f) for cards and modals.
*   **Active/Floating Layer:** `surface_bright` (#2c2c2c) with backdrop-blur.

### The "Glass & Gradient" Rule
For primary CTAs and high-impact "Hero" moments, move beyond flat hex codes. 
*   **Signature Gradient:** Transition from `primary` (#9cff93) to `primary_container` (#00fc40) at a 135° angle.
*   **Glassmorphism:** For floating menus or command palettes (Raycast-style), use `surface_container_highest` at 70% opacity with a `20px` backdrop-blur.

---

## 3. Typography: Editorial Precision
We use **Inter** exclusively to maintain a professional, Swiss-style clarity. The hierarchy relies on extreme scale contrast rather than color variation.

*   **Display (Large/Medium):** Use `display-lg` (3.5rem) for data-heavy dashboards or welcome states. Tracking should be set to `-0.02em` to feel tighter and more "custom."
*   **Headlines:** `headline-sm` (1.5rem) serves as the primary anchor for card titles.
*   **Body:** `body-md` (0.875rem) is the workhorse. Use `on_surface_variant` (#ababab) for secondary body text to create a clear visual tail-off from the primary white text.
*   **Labels:** `label-md` (0.75rem) should always be uppercase with `0.05em` letter spacing when used for metadata or tags to provide an "architectural" feel.

---

## 4. Elevation & Depth

### The Layering Principle
Avoid shadows on flat elements. Depth is achieved by "stacking" the surface tiers. A `surface_container_low` card sitting on a `surface` background creates a soft, natural lift.

### Ambient Shadows
When a component must "float" (e.g., a Command Palette or Dropdown), use a **Triple-Layer Shadow**:
1.  Offset: 0, 4px | Blur: 6px | Color: `surface_container_lowest` @ 10%
2.  Offset: 0, 10px | Blur: 20px | Color: `surface_container_lowest` @ 20%
3.  Offset: 0, 24px | Blur: 48px | Color: `surface_container_lowest` @ 30%

### The "Ghost Border" Fallback
If accessibility requires a container definition in low-contrast environments, use a **Ghost Border**: `outline_variant` (#484848) at 15% opacity. Never use 100% opaque outlines.

---

## 5. Components

### Buttons
*   **Primary:** Background: `primary_container` (#00fc40); Text: `on_primary` (#006413). Radius: `lg` (1rem). 
*   **Secondary:** Background: `surface_variant` (#262626); Text: `on_surface` (#ffffff).
*   **Tertiary:** No background. Text: `primary`. Subtle glow on hover using `primary_dim` at 10% opacity.

### Input Fields
*   **Base:** Background: `surface_container_highest` (#262626); Radius: `md` (0.75rem).
*   **Focus:** Border: `Ghost Border` (outline-variant @ 40%); Shadow: 0px 0px 0px 3px `primary_dim` @ 20% opacity.
*   **Typography:** Use `body-md`. Labels must use `label-md` positioned 8px above the input.

### Cards
*   **Constraint:** No borders. Use `surface_container_low` (#131313) for the card body.
*   **Rounding:** Strictly `lg` (1rem) or `xl` (1.5rem) for large dashboard modules.
*   **Spacing:** Use `spacing-6` (1.5rem) for internal padding to ensure "breathing room" consistent with high-end SaaS tools.

### Chips/Tags
*   **Style:** Pill-shaped (`full` radius). Use `secondary_container` with `on_secondary_container` text for a subtle, tech-focused look that doesn't compete with the primary green.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use `0.5rem` to `1.5rem` gaps between elements. Negative space is a functional tool, not a "waste of space."
*   **Do** use asymmetrical layouts. For example, a left-aligned headline with a right-aligned action button tucked into a corner.
*   **Do** use "Cyber Green" sparingly. It is a laser, not a paint bucket. Use it for progress bars, primary actions, and status indicators.

### Don't
*   **Don't** use 1px dividers. Use a `spacing-4` (1rem) vertical gap or a slight background shift (`surface` to `surface_container_low`).
*   **Don't** use standard "Drop Shadows." Use the Ambient Shadow or Tonal Layering.
*   **Don't** use `ROUND_FOUR`. It feels dated and "standard." Stick to `md` (0.75rem) or higher for all interactive elements.