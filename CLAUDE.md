@AGENTS.md

# ReceiptCave mobile (Expo SDK 57, Expo Router)

Full file map: `FolderStructure.md`. Don't read it up front; use the `folder-structure` skill when you need to find something.

## Where things go
- `src/app/`: routes only. Each file re-exports a screen from `src/features/` (e.g. `src/app/(app)/(tabs)/expenses/index.tsx`). Sheets are registered in `src/app/(app)/_layout.tsx`.
- `src/features/<feature>/`: `<Name>Screen.tsx` or `<Name>Sheet.tsx`, plus `components/`, `hooks/` and `utils/`.
- `src/core/`, non-UI code:
  - `api/`: the API client and error helpers.
  - `services/`: one function per endpoint, taking `api` as a parameter and with a `// API CALL:` comment (see `expenseService.ts`).
  - `queries/`: TanStack Query hooks, plus `queryKeys.ts`.
  - `models/`, `utils/`, and `sample/` (the fake API used by sample-data mode).
- `src/shared/components/`: reusable UI primitives (`AppText`, `Button`, `Card`, `TextField`…). Build new UI from these rather than raw `Text` or `View` styling.
- `src/theme/`: design tokens. Style with `useThemedStyles(createStyles)`, and take `spacing` and `radius` from `@/theme`.
- Platform-specific versions: a `*.web.ts(x)` file sits beside the native one.

## Patterns to copy
- Data: `core/queries/expenseQueries.ts` (`useQuery`/`useMutation`, invalidating via `queryKeys`).
- A sheet with multiple steps: `features/upload-receipt/`.
- Imports use the `@/` alias.

## Sample data
`EXPO_PUBLIC_USE_SAMPLE_DATA=true` swaps the real API for `core/sample/sampleApiClient.ts`. A new API route needs a handler there too, or sample mode fails with an error. Sample mode ignores request bodies, including multipart uploads, so check anything network-related with sample data off.

## Commands
- `npm run lint`, `npx tsc --noEmit`
- Native modules (Auth0, the image picker) need a development build, not Expo Go.
