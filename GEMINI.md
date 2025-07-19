# Gemini CLI Session Context

## Project

- **Frontend:** `manga-toread-frontend` (React.js with TypeScript)
- **Backend:** `manga-toread-api-typescript` (TypeScript, Fastify, Prisma, MongoDB)

## What has been done

- Created the `manga-toread-frontend` directory.
- Initialized a new React application using `create-react-app` with the TypeScript template.
- Installed `axios` and `react-router-dom`.
- Created the basic folder structure for the application (`components`, `pages`, `services`, `hooks`, `contexts`, `utils`).
- Created the authentication service (`src/services/auth.ts`).
- Created the `AuthContext` to manage the user's authentication state (`src/contexts/AuthContext.tsx`).
- Created the main application component, `App.tsx`, with routing.
- Created the `PrivateRoute` component.
- Created the `LoginPage`, `RegisterPage`, and `DashboardPage`.
- Updated the `index.tsx` file to render the `App` component.
- Started the development server.
- Fixed a TypeScript configuration issue related to JSX.
- Displayed a message when no manhwas are found after a search.
- Adjusted navigation flow for login, registration, and root path.
- Fixed authentication state re-hydration on page load.
- Implemented automatic redirection from login page for authenticated users.
- Added a loading effect to the dashboard.
- Improved UI for profile update feedback using Snackbar.
- Adjusted Snackbar position to top-center for better visibility.
- Implemented global 401 Unauthorized error handling to redirect to login page.
- Fixed `useNavigate` hook usage by creating a `NavigationSetter` component.

## Next Steps

- [x] Implement the UI for the `LoginPage` and `RegisterPage` with a modern design using Material-UI.
- [ ] Implement the Google SSO login flow.
- [x] Implement the functionality to display a list of manhwas on the dashboard.
- [x] Implement the functionality for users to add, remove, and update their manhwas.
- [x] Implement the user profile page.
- [x] Add a proper styling solution (e.g., Material-UI or Bootstrap).
- [x] **Fix Bug:** Manhwa list does not update automatically after adding a new manhwa.

ALWAYS UPDATE THIS FILE FOR YOUR CONTEXT IN NEXT SESSIONS