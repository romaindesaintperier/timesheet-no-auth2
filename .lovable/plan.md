

# Remove Authentication — Keep Everything Else

## Summary
Strip out Microsoft Entra ID (MSAL) authentication from both frontend and backend. All pages become openly accessible. All API endpoints become public (no JWT validation). The role system is removed — all users see all nav items (Timesheet, Admin, Reports).

## Frontend Changes

### 1. `src/main.tsx` — Remove MSAL wrapper
- Remove all `@azure/msal-browser` and `@azure/msal-react` imports
- Render `<App />` directly without `PublicClientApplication` or `<MsalProvider>`

### 2. `src/App.tsx` — Remove AuthProvider and ProtectedRoute
- Remove `AuthProvider`, `TokenBridge`, and `ProtectedRoute` wrappers
- Render `<Index />`, `<Admin />`, `<Reports />` directly inside routes (wrapped in `<AppLayout>` instead)

### 3. `src/components/AppLayout.tsx` — Remove auth-dependent UI
- Remove `useAuth` import and usage
- Show all nav items (Timesheet, Admin, Reports) unconditionally — no role filtering
- Remove the sign-out button and user name display from the header

### 4. `src/components/ProtectedRoute.tsx` — Delete file
- No longer needed

### 5. `src/lib/auth.tsx` — Delete file
- The entire AuthProvider, useAuth hook, and role-fetching logic are removed

### 6. `src/lib/msalConfig.ts` — Delete file
- MSAL configuration no longer needed

### 7. `src/lib/api.ts` — Simplify headers
- Remove `tokenProvider`, `setTokenProvider`, and the `Authorization` header logic
- `authHeaders()` just returns `{ "Content-Type": "application/json" }`
- Remove `fetchUserRole` function

## Backend Changes

### 8. All route files — Remove `validate_token` dependency
Remove `_=Depends(validate_token)` from every endpoint in:
- `backend/app/routes/employees.py`
- `backend/app/routes/codes.py`
- `backend/app/routes/locations.py`
- `backend/app/routes/submissions.py`

### 9. `backend/app/routes/users.py` — Delete file
- The `/users/me/role` endpoint is no longer needed

### 10. `backend/app/main.py` — Remove users router
- Remove `from .routes import ... users` and `app.include_router(users.router, ...)`

### 11. `backend/app/auth.py` — Delete file
- JWT validation module no longer needed

### 12. `backend/app/config.py` — Remove Azure settings
- Remove `azure_client_id` and `azure_tenant_id` fields from `Settings`

### 13. `backend/.env.example` — Remove Azure env vars
- Remove `AZURE_CLIENT_ID` and `AZURE_TENANT_ID` lines

## What Stays the Same
- All pages (Timesheet, Admin, Reports) and their full functionality
- All CRUD operations for employees, codes, locations, submissions
- The API service layer structure (`api.ts`)
- The backend database models, schemas, Alembic migrations
- The UI design, styling, and layout

