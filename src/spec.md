# Specification

## Summary
**Goal:** Make the business phone number and address editable from a single source and ensure all displayed contact details (Contact section and footer) stay in sync.

**Planned changes:**
- Centralize the phone number and address as `siteContent.contact.phone` and `siteContent.contact.address` in `frontend/src/content/siteContent.ts`.
- Ensure `frontend/src/sections/ContactSection.tsx` renders phone/address exclusively from `siteContent.contact` with no hardcoded duplicates.
- Update `frontend/src/components/SiteFooter.tsx` to remove hardcoded phone/address and render the “Visit Us” block using `siteContent.contact.phone` and `siteContent.contact.address`.

**User-visible outcome:** Updating the phone number or address in one place (`siteContent.contact`) automatically updates both the Contact section and the footer “Visit Us” block across the site.
