## Monorepo Project: Frontend and Backend

This project is a monorepo with a React frontend and a Node.js backend.

### Frontend (`/frontend`)

- **Run:** `npm start`
- **Build:** `npm run build`
- **Test:** `npm test`
  - To run a single test file, use: `npm test -- src/components/Dashboard.test.js`
- **Linting:** ESLint is integrated into the build. Run `npm run test` to see lint errors.
- **Code Style:**
  - Follow existing conventions in the code.
  - Use functional components with hooks.
  - Tailwind CSS is used for styling.
  - Imports are grouped (React, external libraries, internal components).

### Backend (`/backend`)

- **Run:** `npm start`
- **Testing:** No test framework is set up.
- **Linting:** No linter is configured.
- **Code Style:**
  - Standard Node.js with CommonJS modules.
  - Use Express for the server.
  - Error handling with middleware.
  - Naming conventions: `camelCase` for variables and functions.
