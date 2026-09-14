# ReceiptCave Mobile

iOS and Android app for ExpenseTracker / ReceiptCave, built with Expo (SDK 57) and Expo Router.
It signs in with the same Auth0 tenant as the web client and calls the existing ExpenseTrackerAPI.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set `EXPO_PUBLIC_AUTH0_CLIENT_ID` to the Auth0 **Native** application's client ID.
3. In the Auth0 dashboard, add both of these to the Native application's **Allowed Callback URLs** and **Allowed Logout URLs**:
   ```
   com.receiptcave.app.auth0://dev-sizppb5m3zuup43h.us.auth0.com/ios/com.receiptcave.app/callback
   com.receiptcave.app.auth0://dev-sizppb5m3zuup43h.us.auth0.com/android/com.receiptcave.app/callback
   ```

## Running

`react-native-auth0` contains native code, so the app does **not** run in Expo Go — it needs a development build.

- **Android (local):** install Android Studio with an emulator, then `npx expo run:android`.
- **iOS / Android (cloud):** `npx eas-cli build --profile development --platform ios` (iOS device installs need an Apple Developer account).

Once a development build is installed, start the bundler with `npm start`.

## Project structure

```
src/
  app/        Routes only (Expo Router). Each file re-exports a screen from features/.
  features/   Screens and feature-specific components.
  core/       Non-UI code: auth config, API client, services, models.
  shared/     Reusable UI components.
  theme/      Recave design tokens, mirrored from the web client's styles.css.
  config/     Environment variables.
```
