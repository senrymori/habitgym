# Getting Started

## Step 1: Install dependencies

Install all project dependencies using yarn (recommended):

```sh
yarn install
```

## Step 2: Install Ruby dependencies

Install CocoaPods and other Ruby dependencies:

```sh
bundle install
```

## Step 3: Run Android

To launch the app on Android, simply run:

```sh
yarn android
```

## Step 4: Install iOS native dependencies

Navigate to the `ios` directory and install CocoaPods dependencies:

```sh
cd ios && bundle exec pod install
```

---

## Common Issues

### macOS: Android Studio fails to import 'android' Gradle project

On macOS, opening the project directly via Finder or the Android Studio welcome screen often causes the Gradle sync to fail with an error like _"importing 'android' Gradle Project"_. This typically happens because Android Studio can't locate the `node` binary when launched that way.

**Solution** — always open Android Studio from the terminal:

```sh
open -a "Android Studio"
```

This ensures the shell environment (including `node` from your PATH) is inherited correctly.