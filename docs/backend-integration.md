# Techanor backend integration contract

Last verified: 2026-09-01

## Runtime

| Application | Location | Local address | Role |
| --- | --- | --- | --- |
| Techanor React | `C:\Users\behru\Desktop\techanor-react` | `http://localhost:3005` | Customer SPA |
| Techanor backend | `C:\Users\behru\Desktop\techanor` | `http://localhost:3001` | API and admin SSR |

Frontend configuration:

```env
REACT_APP_API_URL=http://localhost:3001
```

`src/lib/config.ts` exposes this value as `serverApi`. All services and remote
media URLs must derive from that value.

On this Windows environment, use `npm.cmd` if PowerShell blocks `npm.ps1`:

```powershell
cd C:\Users\behru\Desktop\techanor
npm.cmd run start:dev
```

The backend opens its HTTP port only after MongoDB connects successfully.

## Confirmed SPA endpoints

These routes currently exist in the Techanor backend `src/router.ts`.

| Method | Path | Auth | Request | Success response | Frontend status |
| --- | --- | --- | --- | --- | --- |
| `POST` | `/signup` | No | Public signup JSON | `{ member: Member }` | Connected; creates session |
| `POST` | `/login` | No | `LoginInput` JSON | `{ member: Member }` | Service exists |
| `GET` | `/member/me` | Session | Session cookie | `{ member: Member }` | Connected; restores login |
| `POST` | `/logout` | Session | None | `{ logout: true }` | Connected |
| `GET` | `/product/all` | No | Query parameters | `Product[]` | Connected |
| `GET` | `/product/:id` | No | Product ID path parameter | `Product` | Connected; increments `productViews` |
| `GET` | `/blog/all` | No | `page`, `limit`, optional category/search query | `BlogPost[]` | Connected; published posts only |
| `GET` | `/blog/:id` | No | Blog post ID path parameter | `BlogPost` | Connected; published posts only, increments views |
| `POST` | `/order/create` | Session | `OrderItemInput[]` | `Order` | Connected; backend validates price and stock |
| `GET` | `/order/all` | Session | `page`, `limit`, `orderStatus` query | `Order[]` | Connected |
| `POST` | `/order/update` | Session | `OrderUpdateInput` | `Order` | Connected; validates status transition |

### Product list query

Supported query parameters:

| Parameter | Required by frontend | Meaning |
| --- | --- | --- |
| `page` | Yes | One-based page number |
| `limit` | Yes | Maximum returned items |
| `order` | Yes | `createdAt`, `productPrice`, or `productViews` |
| `productCondition` | No | Exact condition filter |
| `productCategory` | No | Exact category filter |
| `productBrand` | No | Exact brand filter |
| `productMemory` | No | Exact memory filter |
| `productScreenSize` | No | Exact screen-size filter |
| `search` | No | Case-insensitive product-name search |

Homepage `Shop by Category` cards use these same enum values and route to
`/products?category=<ProductCategory>`. Category metadata and images are local
navigation content; matching products always come from the backend and are
stored in the Products Redux slice. Empty API results must remain empty and must
not fall back to showcase/fake products.

Price sorts ascending. Other supported fields sort descending. The backend only
returns products whose status is `PROCESS`.

### Public blog query

`GET /blog/all` accepts one-based `page`, a `limit` capped at 50, optional
`blogPostCategory`, and optional case-insensitive `search` across title and
content. Only `PUBLISHED` posts are returned, newest first. Blog media paths are
backend-relative uploads and must be normalized through `serverApi` in the SPA.

`GET /blog/:id` accepts a MongoDB blog ID, returns only a published article and
increments `blogPostViews`. The Blog list and detail screens store these server
responses in the `blogPage` Redux feature; no static production fallback is
used.

Trending Deals currently requests:

```text
GET /product/all?order=productViews&page=1&limit=4
```

The four-item limit is temporary test behavior while product view tracking is
being completed. The backend still sorts by highest `productViews`; when view
counts are tied, it returns any four matching products. This request was
verified with `200 OK` on 2026-08-30.

## Not yet available in the Techanor SPA API

Frontend code currently contains calls for several Burak-style routes that are
not registered in the Techanor backend router. Treat them as pending work, not
working integrations:

| Frontend expectation | Current backend status |
| --- | --- |
| `POST /member/update` | Missing |
| `GET /member/top-users` | Missing |
| `GET /member/restaurant` | Missing and not a Techanor domain concept |

Do not work around a missing backend endpoint with fake production data. Add the
Techanor backend contract first, then connect its frontend service.

## Authentication status

Techanor uses an HTTP-only Express session stored in MongoDB. Signup and login
write the authenticated member to the server session, `/member/me` restores and
validates that session after a browser refresh, and logout destroys it. Public
signup always creates an `ACTIVE` `USER`; client-provided role/status fields are
ignored. The frontend sends credentials for these calls. `memberData` in
localStorage is only a display cache; it is never accepted as proof of
authentication.

## Redux Toolkit standard

Use the existing feature layout:

```text
src/app/
  store.ts
  hooks.ts
  services/
    ProductService.ts
  screens/<feature>/
    slice.ts
    selector.ts
    <Component>.tsx
src/lib/types/
  <domain>.ts
  screen.ts
```

Data flow:

```text
Component effect/event
  -> typed service method
  -> Techanor API
  -> typed response
  -> dispatch typed slice action
  -> memoized selector
  -> rendered component
```

Implementation rules:

1. Define backend-compatible input and response types in `src/lib/types`.
2. Put Axios calls in a domain service; return payload data, not Axios responses.
3. Create a typed feature state in `screen.ts`.
4. Use `createSlice` with `PayloadAction<ExactType>`.
5. Export selectors from the feature `selector.ts`.
6. Consume state through `useAppSelector` and dispatch through `useAppDispatch`.
7. Keep request triggers in the screen/component for the current architecture.
8. Add explicit async status to Redux only when multiple components need it;
   otherwise a local loading/error state is sufficient.

Example action shape:

```ts
setTrendingDeals: (state, action: PayloadAction<Product[]>) => {
  state.trendingDeals = action.payload;
}
```

## Media URLs

The backend exposes uploaded files below `/uploads`. A frontend helper should
follow these rules:

- return empty/fallback media for a missing path;
- keep `http://` and `https://` URLs unchanged;
- keep frontend public paths such as `/img/example.jpg` on the frontend origin;
- prefix backend-relative upload paths such as `uploads/products/file.jpg` with
  `serverApi`;
- avoid double slashes between the base URL and path.

Do not blindly prefix every path with the backend URL because Techanor also uses
assets from the React `public` directory.

## Verification checklist for each integration

1. Confirm backend route, middleware and HTTP method.
2. Confirm controller defaults, validation and response envelope.
3. Compare backend and frontend enums/types.
4. Test the exact URL and record status/payload shape.
5. Check unauthenticated and empty-result behavior where applicable.
6. Confirm uploaded images load in the browser.
7. Run `npm.cmd run build` in `techanor-react`.
8. Update the confirmed/pending endpoint tables above.
