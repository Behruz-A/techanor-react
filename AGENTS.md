# Techanor React working agreement

This repository is the customer-facing React application for Techanor.

## Sources of truth

- Frontend workspace: `C:\Users\behru\Desktop\techanor-react`
- Backend workspace: `C:\Users\behru\Desktop\techanor`
- Local API base URL: `http://localhost:3001`
- Integration contract: `docs/backend-integration.md`
- Architecture reference: `docs/burak-reference.md`

`burak` and `burak-react` are reference projects only. Never connect Techanor
to the Burak backend, copy a Burak endpoint without checking Techanor, or edit a
Burak repository while implementing Techanor work.
CO

## Required workflow

# CODE RULES

1 read "path": "C:/developer/Software Projects/burak-react" and write a sam code structure and style with this project

Before adding or changing a backend integration:

1. Read `docs/backend-integration.md`.
2. Verify the route in `C:\Users\behru\Desktop\techanor\src\router.ts` (or
   `routerAdmin.ts` for SSR admin work).
3. Verify the controller response shape and the backend type/model.
4. Add or update the matching frontend type before consuming the response.
5. Keep HTTP code in `src/app/services`; components must not call Axios directly.
6. Store shared page/server data in Redux Toolkit and access it through typed
   hooks and selectors.
7. Handle loading, empty and error states in the UI when relevant.
8. Verify the endpoint against port `3001`, then run the frontend build.
9. Update `docs/backend-integration.md` whenever the API contract changes.

Do not claim an integration is complete merely because frontend code exists.
The backend route must exist and return the documented response.

## Frontend conventions

- Use TypeScript and avoid `any` and `@ts-ignore` in new code.
- Use `useAppDispatch` and `useAppSelector`, never untyped Redux hooks.
- Each Redux feature keeps `slice.ts` and `selector.ts` beside its screen.
- Type reducer actions with `PayloadAction<T>`.
- Register every feature reducer in `src/app/store.ts`.
- Keep API DTOs and domain interfaces in `src/lib/types`.
- Keep enums in one canonical frontend location; do not duplicate string values
  inside components.
- Build query strings with `URLSearchParams` and omit absent optional filters.
- Read the base URL only through `serverApi`; do not hard-code it in components.
- Send `withCredentials: true` only for endpoints that use authentication/session
  cookies.
- Normalize uploaded media paths before rendering and support both absolute URLs
  and backend-relative paths.
- User-facing errors go through the shared SweetAlert helpers. Console logging is
  for development diagnostics, not the only error handling.
- Preserve unrelated user changes in the working tree.

## State ownership

- Redux Toolkit: shared server/page data such as products, chosen product,
  orders and homepage collections.
- Context: app-wide client/session state already owned by Context, currently the
  authenticated member and basket behavior.
- Local component state: transient presentation state such as modal visibility,
  active tabs, form drafts and carousel controls.

Do not move state between these layers without a concrete need. Follow the
existing Burak-style service -> component effect -> Redux action -> selector
flow unless the project deliberately adopts async thunks or RTK Query later.

## Completion checks

- The backend is reachable at `http://localhost:3001`.
- The exact request returns the expected status and payload.
- Redux state and selectors are correctly typed.
- Images resolve from local public assets or the Techanor backend.
- `npm.cmd run build` succeeds on Windows.
