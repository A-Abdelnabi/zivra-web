# Chat Widget Fix Documentation

## Incident: Chat Options Unclickable After Refresh
**Symptoms:** After a hard refresh (Cmd+Shift+R), the chat assistant options (business type chips) would visually appear but not respond to clicks.

## Root Cause
- **Stacking Context Interception:** During hydration, nested CSS transforms or filters in parent layout components were creating a new stacking context. This sometimes caused invisible decorative layers (blurs, glow divs) or the layout grid itself to "intercept" pointer events, even if the Z-index of the buttons was high.
- **Hydration Ordering:** Conditional rendering of the modal meant event listeners weren't always attached to the DOM nodes before the initial animation started, leading to "dead" interactive elements.

## Solution: The "Steel-Wall" Interaction Fix
1. **React Portal Isolation**: The chat modal is now rendered via a `Portal` into `document.body`. This removes it from the site's layout tree and stacking context, making it a direct child of the body.
2. **Fixed Inset-0 Wrapper**: The modal is wrapped in a `fixed inset-0 z-[9999]` container. When closed, this container has `pointer-events-none`; when open, it has `pointer-events-auto`.
3. **Pointer-Event Stratification**:
    - **Decorative Layers**: (Background blurs, gradients) explicitly set to `pointer-events-none`.
    - **Interactive Layers**: (Buttons, input field) explicitly set to `pointer-events-auto` and a high Z-index inside the portal.
4. **Resilient Handlers**: Buttons now use `onPointerDown` with `e.preventDefault()` and `e.stopPropagation()` to ensure events aren't swallowed by mobile touch delays or parent capturing.
5. **DOM Persistence**: The widget remains in the DOM once mounted, toggling visibility via CSS, which prevents hydration-based event loss.

## Verification
- Run `npm run build`
- Test hard refresh 5x and click options immediately. 
- Component progress: `Business Selection` -> `Service Selection` -> `Contact Card`.
