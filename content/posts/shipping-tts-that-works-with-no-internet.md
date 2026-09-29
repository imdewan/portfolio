---
title: "Shipping TTS That Works With No Internet at All"
excerpt: "On-device AI usually still needs the internet once, to download the model. I worked on removing that last dependency for our React Native and Swift SDKs."
date: 2026-06-23
updated: 2026-06-23
tags: ["React Native", "Swift", "On-device AI", "KittenTTS"]
seoDescription: "How we let apps bundle KittenTTS models inside the app binary: a CLI that packs assets with a manifest, an Expo config plugin, and porting the same idea from React Native to Swift."
---

There's a small lie in a lot of on-device AI.

The model runs locally, sure. But the first time you open the app, it downloads the model from a server. If you're on a plane, in a basement, or on a flaky connection in a new country, that "offline" feature just shows a spinner.

For most apps that's fine. For some it isn't. Accessibility tools, apps for places with bad connectivity, kiosk style devices, anything that has to work the moment it's installed.

So I worked on bundled offline assets for our KittenTTS SDKs, starting with [React Native](https://github.com/KittenML/KittenTTS-react-native).

## What needs to ship

A working voice needs more than the model file:

- the ONNX model itself
- a `voices.npz` file with the voice embeddings
- the phonemizer rule files that turn text into sounds

Miss one and you get an error at runtime, on a user's phone, with no network to recover.

## A CLI instead of instructions

My first instinct was to write docs: "download these files, put them here, reference them like this". I stopped, because that's exactly the kind of setup people get slightly wrong.

Instead there's a command:

```bash
npx @kittentts/react-native bundle-assets --models nano-int8,micro --out assets/kittentts
```

It downloads the chosen models and phonemizer files into one folder and writes a `manifest.json` describing everything. The SDK reads that manifest through `createBundledAssetConfig()`, so the app code never hard codes a file path.

The flags exist on purpose. It works interactively, but it also works in CI, in scripts, and when an AI coding tool is setting up the project. More and more of the "developers" running your setup commands aren't people.

## Getting files into the native app

Files in a JavaScript project don't magically end up in the iOS and Android bundles. For Expo apps, I added a config plugin:

```json
{
  "expo": {
    "plugins": [["@kittentts/react-native", { "assetsDir": "./assets/kittentts" }]]
  }
}
```

During `expo prebuild`, the plugin copies the folder into both native projects. One line of config instead of a page of Xcode and Gradle steps.

There is one rough edge I documented loudly: this SDK doesn't work in Expo Go. It needs native modules (ONNX Runtime and filesystem access) that Expo Go can't load, so you need a development build. I'd rather people read that in the README than lose an afternoon.

## Same idea, in Swift

After React Native, I ported the same approach to the [Swift SDK](https://github.com/KittenML/KittenTTS-swift), with a macOS example that runs from bundled files with zero downloads.

It was a good test of the design. If the concept only makes sense in one ecosystem, it's probably a hack. If it translates cleanly to another language and toolchain, it's probably the right shape. This one translated well: pick models, bundle them with a manifest, point the SDK at the manifest.

## The tradeoff

Bundling makes your app bigger. The smallest model plus its files is roughly 25 MB, and bigger models are more. So it's opt in. The default is still "download once, then cache".

But now an app can choose. And I think "works the moment it's installed" is a feature some apps really need, not just a nice to have.
