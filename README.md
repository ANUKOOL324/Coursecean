# Coursecean

Coursecean is a course-selling admin interface built while learning the Next.js 13 project structure. The project started as a React application and was converted into a Next.js application to practice file-based routing, API routes, server-side rendering, TypeScript setup, and global state management inside a Next.js codebase.

The app uses the Next.js Pages Router (`src/pages`) because the learning goal was to understand how a React SPA can be moved into a Next.js 13 project while keeping familiar React patterns such as client-side state, component-driven UI, and API calls.

## Tech Stack

- Next.js 13.4
- React 18
- TypeScript
- Material UI
- Recoil
- Axios
- Next.js API Routes

## Features

- Landing page for the course admin platform
- Admin signup and signin flows
- Token persistence through `localStorage`
- Recoil-based user session state
- Shared app shell with a navigation bar
- Course listing page with client-side data fetching
- SSR practice route using `getServerSideProps`
- Local Next.js API route that returns course data
- TypeScript interfaces for course and user state

## Project Structure

```txt
src/
  components/
    Appbar.tsx        # Top navigation and auth-aware actions
    InitUser.tsx      # Initializes user state from the stored token
  config.ts           # Base URLs used by the frontend and Next API layer
  pages/
    _app.tsx          # Global Recoil provider and layout shell
    _document.tsx     # Custom HTML document
    index.tsx         # Landing page
    signin.tsx        # Admin signin page
    signup.tsx        # Admin signup page
    courses.tsx       # Client-side course listing
    coursesssr.tsx    # Server-side rendered course listing practice
    api/
      hello.ts
      admin/
        courses.ts    # Mock course API route
  store/
    atoms/            # Recoil atoms
    selectors/        # Recoil selectors
  styles/             # Global and module CSS
```

## Routing

This project uses the Pages Router, where files inside `src/pages` automatically become routes.

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `src/pages/index.tsx` | Landing page |
| `/signup` | `src/pages/signup.tsx` | Admin registration |
| `/signin` | `src/pages/signin.tsx` | Admin login |
| `/courses` | `src/pages/courses.tsx` | Client-side course listing |
| `/coursesssr` | `src/pages/coursesssr.tsx` | SSR course listing practice |
| `/api/admin/courses` | `src/pages/api/admin/courses.ts` | Mock course data API |

## State Management

The app uses Recoil to store authentication-related UI state.

- `userState` tracks the current user email and loading state.
- `InitUser` runs on app load and validates the stored token through the `/admin/me` endpoint.
- `Appbar` reads user state and renders auth-aware navigation.
- Signup and signin pages update Recoil state after a successful request.

## Data Fetching

The project intentionally demonstrates two Next.js data-fetching styles:

- `src/pages/courses.tsx` fetches courses on the client with `useEffect` and Axios.
- `src/pages/coursesssr.tsx` fetches courses on the server with `getServerSideProps`.

This makes the project useful for comparing React-style client fetching with Next.js server-side rendering.

## API Layer

The mock course API is implemented as a Next.js API route:

```txt
GET /api/admin/courses
```

It returns sample course data from `src/pages/api/admin/courses.ts`. Authentication requests are configured through `BASE_URL` in `src/config.ts`, while course data uses `NEXT_URL`.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app in the browser:

```txt
http://localhost:3000
```

If you run the frontend and mock Next API on different ports, update the values in `src/config.ts`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Learning Goals

This project was made as part of the Next.js 13 learning process. The main goals were:

- Convert a React project into a Next.js project
- Understand the `src/pages` file structure
- Practice page-based routing
- Add API routes inside the same project
- Compare client-side rendering and server-side rendering
- Use TypeScript with React components and shared state
- Keep existing React patterns while learning Next.js conventions

## Notes

This is a learning project, so some routes and backend integrations are intentionally simple. The course API is mocked locally, and the authentication flow depends on the configured backend endpoints in `src/config.ts`.
