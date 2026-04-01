

# Migrate Frontend from localStorage to Backend API

## Problem
All four frontend components still import from `@/lib/store` (localStorage). The API layer (`@/lib/api.ts`) exists but is unused. The app needs to fetch/mutate data through the FastAPI backend.

## What Changes

### 1. EmployeeSelect — fetch employees from API
- Replace `getEmployees()` with `useEffect` + `fetchEmployees()` from `api.ts`
- Add loading state while fetching

### 2. TimesheetForm — fetch codes, locations, submissions from API
- Replace `getAllActiveCodes()` → `fetchCodes()` (filter active client-side)
- Replace `getLocations()` → `fetchLocations()`
- Replace `getLastSubmission()` → `fetchSubmissions()` with date filter for previous week
- Replace `addSubmission()` → `upsertSubmission()`
- Add loading states

### 3. Admin page — full CRUD via API
- Replace all `get*`/`save*` localStorage calls with API equivalents:
  - Employees: `fetchEmployees`, `createEmployee`, `updateEmployee`
  - Codes: `fetchCodes`, `createCode`, `updateCode`
  - Locations: `fetchLocations`, `createLocation`, `deleteLocation`
  - Submissions: `fetchSubmissions`
- Each mutation calls the API, then refreshes the list

### 4. Reports page — fetch from API
- Replace `getSubmissions()`, `getEmployees()`, `getCodes()` with API calls
- Pass `dateFrom`/`dateTo` to `fetchSubmissions()` server-side filtering
- Add loading state

### 5. Add missing API function
- Add `fetchUserRole()` call in `api.ts` (already referenced in auth but worth confirming)

### 6. Keep store.ts temporarily
- Keep `getCurrentWeekEnding`, `getPreviousWeekEnding` helper functions (pure date logic)
- Remove all localStorage read/write functions and seed data since they're no longer needed
- Alternatively, move date helpers to a `utils` or `dateHelpers` file

## Technical Details
- All API calls use `api.ts` which already handles auth headers via `setTokenProvider`
- Error handling: wrap API calls in try/catch, show `toast.error()` on failure
- Loading states: use simple `useState<boolean>` flags with skeleton or spinner UI
- No new dependencies needed

## Files Modified
- `src/components/EmployeeSelect.tsx`
- `src/components/TimesheetForm.tsx`
- `src/pages/Admin.tsx`
- `src/pages/Reports.tsx`
- `src/lib/store.ts` (strip down to date helpers only)

