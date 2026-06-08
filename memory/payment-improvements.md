# Payment Improvements Memory

This file records the state of the Stripe-based course purchasing flow and improvements made to it. Read this + AGENTS.md when resuming work after a restart.

## Project Context (recap)
- Next.js Pages Router + TS + MUI + Recoil (but purchases use direct axios + server in-memory store, not Recoil)
- Main student-facing purchase page: src/pages/courses.tsx (uses shared CourseCard)
- Other: coursesssr.tsx is old practice SSR page (does not have purchase tracking)

## Current Payment Flow (simple step-by-step for easy explanation)

1. **On /courses page (logged in user)**
   - Fetches all courses from /api/admin/courses
   - Fetches the user's purchased course IDs from /api/purchases (which reads from purchaseStore)
   - Renders a grid of CourseCard components
   - For each card: passes `bought={purchasedCourseIds.includes(course._id)}` and `loading={buyingCourseId === course._id}`

2. **Clicking "Buy course" on a card**
   - Calls buyCourse(course) in courses.tsx
   - Has a guard: if already in purchasedCourseIds, alert and return (prevents double-buy)
   - Sets buyingCourseId for THIS card only (so only that card shows "Processing..." while others stay normal)
   - POSTs to /api/stripe/create-checkout-session with the full course object + auth token
   - On response, does `window.location.href = session.url` (full redirect to Stripe hosted checkout)

3. **Inside create-checkout-session.ts (API route)**
   - Validates token -> gets username
   - Validates course payload (title, price, _id etc.)
   - Creates a Stripe Checkout Session (mode: payment, currency inr)
   - Puts useful info in `metadata`: { username, courseId, courseTitle }
   - success_url: /success?session_id={CHECKOUT_SESSION_ID}
   - cancel_url: /courses?checkout=cancelled   (we chose this over a dedicated /cancel page so user stays on the list and can retry easily)
   - Returns the url to frontend

4. **Cancel path (user closes Stripe or clicks cancel)**
   - Stripe redirects to /courses?checkout=cancelled
   - A dedicated useEffect (runs when router.isReady) detects it
   - Shows a friendly MUI Alert explaining nothing was charged
   - Calls router.replace('/courses', ..., { shallow: true }) to remove the query param from the address bar
   - This way a later browser refresh does not re-show the cancel message

5. **Success path**
   - Stripe redirects to /success?session_id=...
   - success.tsx reads session_id from router.query
   - Calls GET /api/stripe/confirm?session_id=...
   - confirm.ts: retrieves the Checkout Session from Stripe, checks payment_status === "paid"
   - If paid: calls markPurchased(username, courseId) from the in-memory purchaseStore
   - Returns the courseTitle etc. so the success page can say "You now own X"
   - User sees a nice centered Card with success message + "Back to courses" button
   - Button does router.push("/courses?refreshPurchases=true")

6. **Back on /courses after success**
   - The router useEffect also watches for `refreshPurchases === 'true'`
   - When seen: calls init() again (re-fetches courses + purchases from APIs)
   - This makes the purchasedCourseIds state include the newly bought course
   - Therefore CourseCard receives `bought=true` and shows the "Purchased" chip + disabled button
   - Then router.replace cleans the URL (shallow)
   - Result: user sees the updated state immediately without a manual refresh

7. **Webhook (for reliability)**
   - src/pages/api/stripe/webhook.ts
   - Listens for "checkout.session.completed" (and async succeeded)
   - Also calls markPurchased using the metadata
   - This catches the purchase even if the user never visits the /success page (e.g. closes tab, network issue after paying, or async payment methods)
   - Requires STRIPE_WEBHOOK_SECRET and stripe listen for local testing

8. **How "already purchased" is enforced in UI**
   - CourseCard receives `bought` prop
   - If bought: shows extra "Purchased" chip, button text becomes "Purchased", button is disabled
   - The loading prop (for the active buy) is combined: disabled={bought || loading}
   - Button text logic: loading ? "Processing..." : bought ? "Purchased" : "Buy course"

## Improvements made in this session (continuing previous payment work)

- **Fixed broken per-card loading / "Processing..." state**
  - courses.tsx already had buyingCourseId state + comments + passed `loading={...}` to CourseCard
  - CourseCard interface already declared `loading?: boolean` and had explanatory comments
  - BUT the component function did NOT destructure `loading` from props: `{ course, bought, onBuy }`
  - Inside it still referenced bare `loading` for disabled and button text → this would cause runtime error ("loading is not defined")
  - Fix: updated the destructuring to `{ course, bought, onBuy, loading }`
  - Now the "only this card shows Processing while redirecting to Stripe" UX works as the comments described.

- **Added buyCourse guard against already-purchased courses**
  - Even though UI disables the button, the function itself now checks `purchasedCourseIds.includes(...)` first
  - Prevents accidental Stripe session creation for owned courses
  - Added clear comment explaining "defense in depth"

- **Added refreshPurchases flow after successful payment**
  - success.tsx now redirects with `?refreshPurchases=true`
  - courses.tsx useEffect (same one that handles cancelled) now also handles the refresh flag
  - Calls init() to reload purchased list, then cleans the param with replace (following the exact same pattern and shallow technique used for cancel)
  - Added very detailed comments so the reason (component reuse on router.push, mount effect not re-running) is easy to understand and explain in interviews
  - Without this, the just-bought course would continue showing "Buy course" until a hard refresh

- **Kept / improved comments throughout**
  - All new code and logic has beginner-friendly comments
  - Variable names are clear (buyingCourseId, refreshPurchases, etc.)
  - Explanations include "why" not just "what"

## Key files involved in payments
- src/pages/courses.tsx (main UI + buy logic + query param handling for cancel/success)
- src/components/CourseCard.tsx (reusable card, bought + loading states)
- src/pages/success.tsx (post-Stripe landing, calls confirm)
- src/pages/cancel.tsx (exists but not used in current flow; cancel_url points to courses query instead)
- src/pages/api/stripe/create-checkout-session.ts
- src/pages/api/stripe/confirm.ts
- src/pages/api/stripe/webhook.ts
- src/pages/api/purchases.ts
- src/lib/purchaseStore.ts (in-memory Set per username, survives dev HMR via globalThis)
- src/lib/stripe.ts (singleton client)

## Environment needed to test payments
- STRIPE_SECRET_KEY (sk_test_...)
- NEXT_PUBLIC_APP_URL (for success/cancel URLs)
- (optional but recommended) STRIPE_WEBHOOK_SECRET + `stripe listen`

## Future ideas / possible next improvements (not done yet)
- Separate "My Purchases" tab or section on courses page (filter the list)
- Show purchase date or list of owned courses somewhere (needs extending the store)
- Replace the global in-memory purchaseStore + authStore with a real database (Mongo, Postgres, etc.)
- Add better error UI instead of alert() in buyCourse (e.g. Snackbar)
- Auto-redirect from success page after a few seconds
- Prevent duplicate checkout sessions (idempotency keys)
- Handle the case where confirm fails but webhook succeeds (the refresh would still work if webhook ran)
- Update the old coursesssr.tsx to also support purchases (low priority, it's a practice file)

## How to resume work next time
1. Read AGENTS.md
2. Read memory/payment-improvements.md (this file)
3. List memory/ to see if other notes were added
4. Look at the files listed above + the comments in code
5. Follow the same style: simple, lots of explanatory comments, small focused components

## Recent fix (model switch session)
- **TypeScript build errors in catch blocks** (`err` is `unknown` in strict TS)
  - create-checkout-session.ts: use `err instanceof Error ? err.message : String(err)` before logging/returning
  - courses.tsx buyCourse catch: use `axios.isAxiosError(err)` before reading `err.response?.data?.message`
  - `npm run build` now passes cleanly

## Payment flow cleanup (Snackbar + success page + error handling)
- **courses.tsx**: Replaced all `alert()` with MUI Snackbar + filled Alert
  - `showSnackbar()` helper for buy errors, already-owned info, and post-purchase refresh success
  - Handles missing Stripe checkout URL from API response
  - `refreshPurchases` flow shows green success snackbar after re-fetch
- **success.tsx**: Cleaner card layout with status circle, loading text, divider, course title highlight
  - Waits for `router.isReady` before reading `session_id`
  - `getFriendlyErrorMessage()` maps API errors to user-friendly text
  - Keeps `?refreshPurchases=true` on "Go to My Courses" button
- **confirm.ts**: Wrapped in try/catch; validates metadata exists; returns clear JSON error messages
- **create-checkout-session.ts**: Returns error if Stripe session has no `url`
- **cancel.tsx**: Polished to match success page style (centered Card + Alert)

## My Purchases section (courses.tsx)
- Added MUI Tabs: "All Courses" and "My Purchases (count)"
- `activeView` state filters `displayedCourses` using existing `purchasedCourseIds`
- Reuses `CourseCard` with same `bought` / `loading` props
- Empty state when no purchases yet
- After `?refreshPurchases=true`, auto-switches to "My Purchases" tab

## Stripe env fix (Jun 2026)
- **Root cause of "STRIPE_SECRET_KEY is not set" error**: keys were saved in `Untitled` file, not `.env.local`. Next.js only loads `.env.local`.
- **Fix applied**: moved `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL` into `.env.local`. Also set `ADMIN_USERNAMES=anukoolbhul324@gmail.com`.
- **After editing `.env.local`**: must fully restart `npm run dev` (kill old process on port 3000 first if needed).
- **Stripe checkout image safety**: `create-checkout-session.ts` now only sends `https://` URLs to Stripe (skips `data:` base64 images that Stripe rejects).
- **UI**: `CourseCard` and `CourseDetailModal` show a fallback image when a course image URL is broken.
- **Verified**: API returns `https://checkout.stripe.com/...` URL after env fix + server restart.

Last updated: after Stripe env fix + image fallback.
