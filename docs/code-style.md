# Code Style Rules

## TypeScript

- Always use TypeScript, avoid `any` where possible
- Use strict typing, explicitly declare types for props, state, and functions
- Use functional components with TypeScript for React components
- Use interfaces for component props, types for utilities and complex structures
- Use `type` for union types, `interface` for objects and components
- For code written outside a class/component, create `function verbName` (instead of arrow functions)
- If creating a variable with type `Record`, the name must start with `record`, e.g. `const recordSize: Record<number, >`
- When calling the `useAppThemeColors` hook, the variable must be named `themeColors`; when calling `useAppThemeStyles` — `themeStyles`

## Naming Conventions

- **Components**: PascalCase (`UserProfile.tsx`, `WorkoutCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useWorkoutData.ts`); if a hook is component-specific — the file is named `name-hooks.ts` (`input-hooks.ts`, `user-card-hooks.ts`)
- **Utilities and constants**: camelCase (`formatDate.ts`, `apiClient.ts`)
- **Env constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Regular constants**: camelCase (`isIos`, `maxImageLimit`)
- **Enum constants**: PascalCaseEnum (`isIos`, `maxImageLimit`)
- **Files**: match the exported element (component = PascalCase, hook = camelCase with use); if multiple exports, name by the general content and context where the file is created
- **Folders**: kebab-case for multi-word names (`personal-training/`, `workout-rework/`)

## React Native Components

- When declaring a component, immediately type it as `FC` from react (e.g. `const ComponentName: FC<Props> = function(props) {}`)
- If a component only expects children (common in contexts), don't create a separate type — use PropsWithChildren (e.g. `Provider: FC<PropsWithChildren> = function ({ children })`)
- Use functional components with hooks
- Separate logic from presentation: hooks for logic, components for UI
- Use `StyleSheet.create` for styles, avoid inline styles except for dynamic values (local component styles should not be extracted into a separate file)
- Before adding a new style to a component, check `sharedLayoutStyles` from `@ui-kits/shared-styles.ts` — if the needed style already exists (gap, margin, padding, flex directions, etc.), use it instead of creating a local duplicate
- Use ternary operators or `&&` for conditional rendering, avoid complex nested conditions
- Use `memo` for optimization only when truly necessary
- Don't use `React.memo` — import `memo` directly from react
- If the returned JSX of a component exceeds 100 lines, extract the content into components
- Don't create multiple components in one file — each component must be in its own file
- Don't destructure in props like this: `function ({ example1, example2, ...rest })`, instead do `const { example1, example2, ...rest } = props`
- Don't destructure props unnecessarily — access them directly via `props.fieldName`. Destructuring is only justified when there is a real reason (inheriting from another interface, spreading `...rest`, etc.). Direct access via `props.` makes it easy to distinguish props from local variables inside a component
- Don't use string literals in JSX without curly braces: instead of `<Example field="test">` always write `<Example field={'test'}>`. This applies to all props passed to components: values must always be inside curly braces
- When rendering lists with `.map()`, extract the render logic into a separate `renderItem` function and call `.map(renderItem)` — this keeps JSX clean. `renderItem` must return a **separate React component** (`<ItemComponent />`), not inline JSX. The `renderItem` function itself must be static (declared outside the component) — if that's impossible due to closure over state/props, wrap it in `useCallback`
- When passing event handlers (e.g. `onPress`) to list item components: bind the item/index in `renderItem` (where the data is already in scope) and pass a `() => void` callback to the child — do not pass the raw handler + index/item to the child and bind them inside. Example: `onPress={() => onChange(index)}` in `renderItem`, not `onPress={onChange}` + `index={index}` with `() => onPress(index)` inside the child
- If a component is created to render list items of a specific type, pass a single `item` prop with the item type instead of multiple individual props. Props unrelated to the item (e.g. `color` from theme) are passed separately
- Navigation screens are UI components. All navigation types (ParamList, ScreenProps, NavigationProps) must remain in the navigation layer (`src/navigation/`), in the types file of the corresponding stack/tab (`name-stack-types.ts`). Each types file exports three types: `ParamList` (route params), `NavigationScreenProps<T>` (full screen props via `NativeStackScreenProps`), `NavigationHookProps<T>` (navigation only via `NativeStackNavigationProp`). Screens receive `navigation` and `route` via props destructuring — they come automatically from the navigator, and the screen types its props via `ScreenProps<'ScreenName'>`. Components inside screens use `useNavigation()` / `useRoute()` hooks, typed via the global `ReactNavigation.RootParamList` declaration
- In screens, for safe area device insets, use styles from the `useSafeAreaStyles()` hook instead of manually setting padding/margin. For example, `safeAreaStyles.pLayoutGrowWithSpace` for the screen container
- For scrollable screens with inputs, use `KeyboardAwareScrollView` from `react-native-keyboard-controller` instead of `ScrollView` or `KeyboardAvoidingView` — it automatically lifts content above the keyboard. `KeyboardProvider` must be connected at the app root (`App.tsx`)

## Imports

- Group imports: external libraries first, then internal modules
- Use absolute imports via aliases (if configured) or relative from `src/`
- Order: React/React Native → third-party libraries → internal components → utilities → types → constants
- Never use default exports, prefer named exports
- For importing images and other assets use `import`, not `require()` (TS80005: require call may be converted to an import)

## Code Formatting

- Use Prettier formatting

## Comments

- Comments strictly in English
- Use comments to explain "why", not "what" (except for large sections with general meaning spanning 10+ lines)
- JSDoc comments for public functions and components

## Error Handling

- Use try-catch for async operations
- Handle errors explicitly, don't swallow them (via console.error, not console.log)
- Use typed errors where possible
- Log errors in development mode

## Async/Await

- Prefer async/await over Promise chains
- Use Promise.all for parallel requests
- Handle loading and error states explicitly

## State Management

- Use useState for local component state
- Use useReducer for complex local state
- Use tanstack query for fetching async data
- For global state use Context API or a chosen library (if available)
- Avoid prop drilling, use Context or component composition

## Performance

- Use useMemo and useCallback only when there is a real need
- Avoid creating objects and functions in render without memoization if they are passed as props
- Use FlatList for long lists, not ScrollView
- Optimize images, use appropriate formats and sizes (use caching and preloading with a loader displayed during loading)

## Localization

- Never hardcode text inline in JSX — all strings must be localized
- In components use `translations` from the `useLanguage()` hook to get translations
- For static usage outside components (utilities, constants) use `localizedStrings` directly