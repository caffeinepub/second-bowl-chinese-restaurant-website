# Specification

## Summary
**Goal:** Update the admin Orders UI so the orders list and order details match the uploaded cart-style design (rounded cards, soft shadows, warm accent for totals, and pill/rounded controls).

**Planned changes:**
- Restyle the Admin Orders list from a table-like layout into card-style order rows with rounded corners, light borders, soft shadows, and improved spacing/typography for small screens.
- Ensure each order card prominently shows Order #, customer name, item count, total (using the warm primary accent), status badge, and a single rounded primary action (e.g., “View Details”).
- Update the Admin Order Details dialog so the Order Items section uses cart-item style cards (rounded, spaced, readable quantity/name/variant/price) and includes a distinct summary block emphasizing the total in the warm primary color.
- Apply needed Tailwind utility classes and any local styling (without modifying sources under `frontend/src/components/ui`) to support the new look in both light and dark mode, without affecting customer-facing cart/checkout UI.

**User-visible outcome:** Admin users see an Orders panel and Order Details dialog that visually match the cart-style UI reference, with card-based order rows/items, clearer hierarchy, and totals highlighted with the warm primary accent in both light and dark mode.
