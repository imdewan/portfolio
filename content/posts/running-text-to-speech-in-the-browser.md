---
title: "Running a Text-to-Speech Model Entirely in the Browser"
excerpt: "No server, no API key, no audio streaming from the cloud. Just a 25 MB model, ONNX Runtime Web, and a lot of small fights with WebAssembly."
date: 2026-06-06
updated: 2026-06-06
tags: ["On-device AI", "Web", "WebAssembly", "KittenTTS"]
seoDescription: "Building the KittenTTS web SDK: running a small text-to-speech model in the browser and Node.js with ONNX Runtime Web, a C++ phonemizer compiled to JavaScript, streaming audio, and word timings."
---

Most text-to-speech on the web works the same way. You send text to a server, the server sends audio back, and you pay for every sentence.

At Stellon Labs we make [KittenTTS](https://github.com/KittenML/KittenTTS), a family of very small TTS models. The smallest one is 15 million parameters and about 25 MB when quantized to int8. That's small enough to ask a fun question: what if the browser just did all of it?

So I built the [KittenTTS web SDK](https://github.com/KittenML/KittenTTS-web). Same code in the browser and in Node.js, no server involved.

## What using it looks like

```ts
const tts = await KittenTTS.create({ model: "nano-int8" });

const result = await tts.generate("Hello from KittenTTS on the web.");

await tts.speak("Slower Bruno speaking.", { voice: "bruno", speed: 0.85 });
```

The first call downloads the model and caches it. After that, everything runs locally. You pick from four model sizes (15M to 80M parameters) and eight voices, and you can get WAV, MP3, a stream of chunks, or word level timings for highlighting text as it's spoken.

That short snippet hides most of the work.

## Text has to become sounds first

A TTS model doesn't read letters. It reads phonemes, the actual sounds. "Though" and "tough" look similar and sound nothing alike, so something has to convert text to phonemes before the model runs.

Our phonemizer is written in C++. For the web, it's compiled to JavaScript and shipped with the SDK. It isn't glamorous, but it means the browser gets the same pronunciation rules as every other platform, not a "close enough" JavaScript rewrite.

## ONNX Runtime Web and the WASM file problem

The model runs on [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/), which uses WebAssembly under the hood. WebAssembly is great until you have to answer a very boring question: where does the `.wasm` file come from?

In the browser, the runtime tries to fetch its WASM binaries at startup. If your bundler moved them, or your dev server doesn't serve them, you get a confusing failure far away from the actual cause. My fix was to default to loading the matching ONNX Runtime version from jsDelivr and let people pass a custom path if they want to self host.

Node had the opposite problem. It was trying to fetch files it already had on disk. The fix there was to point it at the local WASM backend directly.

Two runtimes, same library, opposite bugs. That's web development.

## Don't freeze the page

Generating speech is real compute. On a slow laptop, running it in one big chunk would lock up the page. Buttons stop responding, scroll stutters, and the whole thing feels broken even though it's working.

So generation yields back to the main thread between chunks. It's a tiny utility, but it's the difference between "this site is doing something" and "this site crashed".

## Storage is a platform decision

Downloading 25 to 80 MB every page load would be terrible, so the model has to be stored somewhere. The SDK supports the browser Cache API, the filesystem in Node, plain memory, or your own storage adapter.

One small thing I like: if you open the example HTML file directly from your disk (a `file://` URL), the Cache API isn't available. Instead of throwing, the SDK quietly falls back to memory. People who just double click the example get a working demo instead of an error.

## The MP3 detour

Browsers give you WAV easily. People want MP3. The first encoder I reached for had a license that didn't fit a permissively licensed SDK, so I swapped it for an MIT licensed one. Not an interesting technical problem, but a very real one. Licenses are part of your API too.

## Why this matters to me

I keep writing about [the quiet work of on-device AI](/blog/the-quiet-work-of-on-device-ai). This is what it looks like in practice. A voice feature with no server bill, no latency from a round trip, and no text leaving the user's machine.

The web is the most accessible platform we have. If a real speech model can run in a tab, a lot of small products get to have a voice.
