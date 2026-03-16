# Project Structure Rules

## General `src/` Structure

The project is organized according to its own structure.

## Folders and Their Purpose

### `src/assets/`

- **`fonts/`** - font files (.ttf, .otf)
- **`images/`** - images, icons, static resources
- Use meaningful file names: `logo-primary.png`, `icon-user.svg`

### `src/components/`

- Reusable UI components (may contain business logic models)
- **`ui-kits/`** - system UI components (Button, Input, Switch, etc.), do not contain business logic models
- Components are grouped by functionality into subfolders if there are many
- If a component is complex and contains a lot of logic, it can be moved to a separate folder and decomposed into files (component + utilities + constants + types)
- Example: `components/Button/Button.tsx`, `components/Button/button-consts.ts`, `components/Button/button-utils.ts`, `components/Button/button-types.ts`, `components/Button/button-hooks.ts`

### `src/constants/`

- Global application constants not related to any specific screen or entity, but related to the application as a whole or useful shared resources
- `platform-consts.ts` - everything related to platform and version detection
- `permissions-consts` - all constants related to device permissions (file access, etc.)
- `dropdown-options` - all nameOptions constants for Dropdown inputs in the app

### `src/hooks/`

- Custom React hooks
- Naming: `use` + name (`useAuth.ts`, `useWorkout.ts`)
- One hook = one file
- Hooks for global events like timers or push notifications, but not for business logic (business logic lives inside parent screens)

### `src/navigation/`

- Navigation configuration (React Navigation)
- Each stack or tab navigator is placed in a separate folder inside `src/navigation/`
- The folder contains a navigator file `NameStack.tsx` / `NameTabs.tsx` and a types file `name-stack-types.ts` / `name-tabs-types.ts`
- The types file contains: `ParamList` (route params), `NavigationScreenProps` (screen props with `navigation` and `route`), `NavigationHookProps` (only `navigation` for hooks and child components)
- Example structure:
  ```
  navigation/
    onboarding-stack/
      OnboardingStack.tsx
      pin-code-stack-types.ts
    main-tabs/
      MainTabs.tsx
      main-tabs-types.ts
  ```

### `src/providers/`

- React Context providers
- Global providers for state, theme, authentication
- One provider = one file or folder if complex

### `src/screens/`

- Application screens (pages)
- Group by features/domains: `auth/`, `workout/`, `profile/`
- Each screen in its own folder if it contains multiple files
- If a screen needs local components (used only within that screen), they are placed in a `components/` folder at the screen level
- Similarly for utilities, constants, and types specific to the screen — they are placed in corresponding files at the screen folder level
- Example screen structure:
  ```
  screens/
    splash/
      SplashScreen.tsx
      components/
        PulseCircle.tsx
      splash-consts.ts
  ```
- Example: `screens/auth/LoginScreen.tsx`, `screens/workout/WorkoutListScreen.tsx`

### `src/server/`

- Backend logic, if a local server is used
- **`service/`** - service classes for business logic
- **`typeorm/`** - TypeORM configuration and models
  - **`database/`** - DB configuration, migrations
  - **`models/`** - TypeORM entity models
- Use for the server part if the app includes a local backend

### `src/utils/`

- Utility functions
- Helpers, formatting, validation, data transformations
- Group by functionality: `date-utils.ts`, `validation-utils.ts`, `common-utils.ts`
- Functions should be pure where possible

## File Organization Rules

### File Naming

- Components: `ComponentName.tsx`
- Hooks: `useHookName.ts` for global ones (in `src/hooks/`), `name-hooks.ts` if component-specific
- Utilities: `name-utils.ts` or `component-name-utils.ts` if component-specific
- Types: `name-types.ts` or `component-name-types.ts` if component-specific
- Constants: `name-consts.ts` or `component-name-consts.ts` if component-specific

### Component Structure

If a component is complex and contains multiple files:

```
components/
  UserCard/
    UserCard.tsx
    user-card-utils.ts
    user-card-consts.ts
    user-card-types.ts
    user-card-hooks.ts
```

For simple components — one file:

```
components/
  Button.tsx
```

### Imports

- Use relative imports from `src/` or absolute if aliases are configured (per babel config)
- Example: `import { Button } from '../components/Button'` or `import { Button } from '@components/Button'`
- Avoid deep import nesting (`../../../../`) — use aliases for that (per babel config)

## Forbidden Practices

- Do not create index files
- Do not create files in the root of `src/`, everything must be in the appropriate folders
- Do not duplicate code, extract shared logic into utilities or components