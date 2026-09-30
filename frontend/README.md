# ChatNest frontend (drop-in files)

1. Install the only new dependency:

   npm install socket.io-client

2. Copy the contents of this `src/` folder into your project's `src/`, replacing files with the same name.
   Your existing UI kit (Button, Card, Badge, Input, Loader, Modal, EmptyState), ProtectedRoute, RoleRoute,
   index.css and vite-env.d.ts are NOT included and stay untouched.

3. Copy .env.example to .env and set VITE_API_URL.

Notes
- Brand name is APP_NAME in src/utils/constants.ts (currently "ChatNest").
- App.tsx uses ProtectedRoute and RoleRoute with children (<ProtectedRoute><Page /></ProtectedRoute>).
  If yours use <Outlet />, adjust App.tsx accordingly.
- Type imports use the inline `type` keyword so the code compiles with verbatimModuleSyntax on or off.
- Passes `tsc --noEmit` in strict mode with noUnusedLocals and noUnusedParameters.
- utils/format.ts replaces your file: it keeps formatCurrency and formatDate, and adds the chat helpers.
- New Tailwind tokens: none.
