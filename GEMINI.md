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
- Implemented the UI for the `LoginPage`, `RegisterPage`, and `DashboardPage` with a modern design using Material-UI.
- Beautified the dashboard home to improve UI/UX for showing the manhwas list.
- Implemented the functionality to display a list of manhwas on the dashboard.
- Implemented the functionality for users to add, remove, and update their manhwas.
- Implemented the user profile page.
- Added a proper styling solution (e.g., Material-UI or Bootstrap).
- **Fixed Bug:** Manhwa list does not update automatically after adding a new manhwa.
- Added confirmation dialog for removing manhwa.
- Improved Telegram notification toggle to update UI optimistically and then with backend response.
- Fixed Telegram notification toggle state on refresh by including `isTelegramNotificationEnabled` in backend response.
- Fixed 500 error on Telegram linking reset by setting `Content-Type` header to `application/json`.
- Improved Telegram linking instructions on frontend.
- Implemented frontend update of Telegram linking status and conditional button display.
- Fixed `useCallback` import in `AuthContext.tsx`.
- Fixed backend `profile` controller to return `telegramId` and `telegramActive`.
- Improved frontend error message for enabling Telegram notifications without linking.
- Adjusted Snackbar position to top-center in `ProfilePage.tsx`.
- Implemented backend route for updating user manhwa (last episode read, provider, status).
- Implemented new UI/UX for adding a new manhwa with a dedicated modal for provider and initial details selection.
- Fixed `@prisma/client` import in `AddManhwaModal.tsx`.
- Enhanced `AddManhwaModal` UI to show manhwa cover and last episode released for each provider.
- Enhanced `ManhwaSearch` UI to show manhwa cover and improve layout in search results.
- Improved UI/UX for adding existing manhwa by displaying a Snackbar message.
- Disabled CORS in the backend to allow access from mobile devices.
- Added a workaround for `window.ethereum` error on mobile by defining it in `public/index.html`.
- Implemented Google SSO login in the frontend.
- Configured Google Client ID to be read from environment variables.
- Fixed incorrect `providerId` being sent when adding a new manhwa.
- Fixed display of "New Episode Available!" when `lastEpisodeRead` is 0.
- Fixed payload names for updating user manhwa in `UpdateManhwaModal.tsx`.
- Fixed `providerId` selection and update in `UpdateManhwaModal.tsx`.
- Added "Clear Search" button to `ManhwaSearch.tsx`.
- Configured `refreshToken` cookie domain to `null` in backend for cross-device access.
- Configured `API_URL` to be read from environment variables in frontend services.
- Fixed TypeScript errors in backend (`fastifyJwt` cookie config and missing imports).
- Implemented pagination for user's manhwa list on the dashboard.
- Configured `pageSize` to be read from environment variables in `DashboardPage.tsx`.
- Implemented pagination for manhwa search results.
- Configured search results `pageSize` to be read from environment variables in `ManhwaSearch.tsx`.
- Fixed TypeScript error in `filter-manhwa.ts` by correcting destructuring and response.

## Next Steps

- [ ] Implement the Google SSO login flow.
- [ ] Add more detailed error handling and user feedback across the application.
- [ ] Implement admin functionalities (e.g., creating/updating manhwas from the frontend).

ALWAYS UPDATE THIS FILE FOR YOUR CONTEXT IN NEXT SESSIONS
