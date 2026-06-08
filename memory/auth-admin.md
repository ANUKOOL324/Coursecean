# Admin Authorization Memory

## Problem (before fix)
- Routes under `/api/admin/*` had no role checks — any logged-in user could act as admin.
- `GET /api/admin/courses` had no auth at all (anyone could call it directly).
- No `isAdmin` concept existed in authStore.

## Solution
- **`src/lib/authStore.ts`**: `isAdminUser(username)` checks `ADMIN_USERNAMES` from `.env.local` (comma-separated, not hardcoded).
- **`src/lib/authHelpers.ts`**: `requireAuth()` (401) and `requireAdmin()` (401/403) for API routes.
- **`src/pages/api/admin/courses.ts`**:
  - `GET` → any logged-in user (students need to browse/buy)
  - `POST` → admin only (add course)
  - `PUT` → admin only (edit course by `_id`)
  - Course list is mutable in-memory via `globalThis.courseceanCourseList`
- **`src/pages/api/admin/me.ts`**: returns `{ username, isAdmin }` for frontend checks later.

## Setup (.env.local)
```
ADMIN_USERNAMES=your-admin-email@example.com,another-admin@example.com
```
Restart dev server after changing. Sign up / sign in with one of those usernames to get admin access.

## Public routes (unchanged)
- `POST /api/admin/login` and `POST /api/admin/signup` stay public (anyone can register as a normal user).

## Frontend admin UI (isAdmin gating)
- **`userState`**: added `isAdmin: boolean`
- **`isAdminState` selector**: components read admin status easily
- **`fetchCurrentUser.ts`**: shared helper calls `/api/admin/me` for `{ username, isAdmin }`
- **`InitUser`**, **signin**, **signup**: store `isAdmin` from server after load/login
- **`Appbar`**: shows "Admin" chip only when `isAdmin`
- **`index.tsx`**: admin-specific home message only for admins
- **`courses.tsx`**: "Add Course" button + dialog only when `isAdmin`; POSTs to `/api/admin/courses`

Last updated: frontend admin UI gating session.