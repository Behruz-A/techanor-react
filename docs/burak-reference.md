# Burak architecture reference for Techanor

## Purpose

`C:\Users\behru\Desktop\burak` and
`C:\Users\behru\Desktop\burak-react` are mature reference projects for the
Techanor integration style. They help preserve a familiar, simple architecture;
they are not Techanor's runtime dependencies or API contract.

## Patterns we retain

### Backend separation

Burak uses a clear pipeline:

```text
router -> controller -> service/model -> Mongoose schema
```

Techanor should retain these responsibilities:

- router: paths, HTTP methods and middleware order;
- controller: parse request, construct typed inquiry/input, choose status and
  response shape;
- service/model: business rules and database queries;
- schema: persistence structure and defaults;
- shared libs: enums, types, errors, upload helpers and configuration.

### Frontend separation

Burak React uses:

```text
service -> screen/component -> Redux slice -> selector -> UI
```

Techanor retains the same lightweight Redux Toolkit approach:

- one store with feature reducers;
- typed dispatch and selector hooks;
- feature-local `slice.ts` and `selector.ts`;
- domain services for HTTP;
- Context for authenticated-member and basket client state;
- local state for short-lived UI concerns.

### Product collection flow

The established collection pattern is reusable:

1. Build a typed inquiry.
2. Encode optional query filters.
3. Request an array from the service.
4. Dispatch it into the relevant page slice.
5. Read it with a selector.
6. Render loading, empty, success and failure states appropriately.

## Techanor-specific differences

| Concern | Burak reference | Techanor rule |
| --- | --- | --- |
| Backend address | Burak's own configured port | Always Techanor `http://localhost:3001` locally |
| Product grouping | Restaurant/food collections | Electronics condition, category, brand, memory and screen size |
| Product ordering | Primarily creation, price, views | Allowlisted `createdAt`, `productPrice`, `productViews` |
| Member domain | Includes restaurant concepts | No restaurant assumption unless Techanor explicitly adds it |
| Authentication | Session middleware and protected routes | Login/signup only today; protected auth remains pending |
| Orders | Complete create/list/update flow | Backend routes/models are not yet implemented |
| Product detail | Route with optional auth/view tracking | Backend route is not yet implemented |
| Blog | Not the Techanor blog contract | Techanor currently has SSR admin blog management only |
| Redux logging | Burak includes `redux-logger` | Do not add it unless requested; keep production dependencies lean |

## Things not to copy blindly

- Endpoint strings and route prefixes.
- Restaurant-specific names such as `restaurant`, `dishes` or collections.
- Untyped Redux actions.
- `@ts-ignore`, unused imports and debugging-only logs.
- A protected frontend call before Techanor authentication exists.
- Burak MongoDB, ports, environment variables or uploaded media paths.
- Backend response assumptions that were not verified in the Techanor controller.

## Standard for new features

For a new Techanor feature such as product detail, orders or public blogs:

1. Inspect the comparable Burak flow to understand its structure.
2. Design the Techanor route and types around Techanor's domain.
3. Implement and verify the Techanor backend route first.
4. Add the frontend service and types.
5. Add a typed Redux slice/selector when the data is shared or page-level.
6. Connect the UI and handle all user-visible states.
7. Update `docs/backend-integration.md` so future work does not need to
   rediscover the contract.

This keeps the useful Burak architecture while preventing the two products from
being mixed together.
