---
title: "I Built a Fully Local Voice Assistant on a Raspberry Pi 3B+"
excerpt: "Wake word, speech to text, a tiny LLM, and text to speech, all running on a 2018 Raspberry Pi with 1 GB of RAM. It's slow. It also works."
date: 2026-07-05
updated: 2026-07-05
tags: ["On-device AI", "Raspberry Pi", "LLM", "KittenTTS"]
seoDescription: "A fully offline voice assistant on a Raspberry Pi 3B+ using openWakeWord, whisper.cpp tiny.en, llama.cpp running Gemma 3 270M, and KittenTTS nano. Setup notes and what broke."
---

![A Raspberry Pi board in a clear case](https://cdn.pixabay.com/photo/2016/05/10/14/05/raspberry-pi-1383832_1280.jpg)

I had a Raspberry Pi 3B+ sitting in a drawer. 1 GB of RAM, a quad core ARM chip from 2018, and nothing to do.

I wanted to know something simple: how small can a voice assistant get before it stops being useful? No cloud, no API keys, nothing leaving the device.

So I built one. The code is on [GitHub](https://github.com/imdewan/local-voice-assistant).

## The pipeline

```text
microphone
  -> openWakeWord ("hey jarvis")
  -> whisper.cpp tiny.en
  -> llama.cpp running Gemma 3 270M
  -> KittenTTS nano
  -> speaker
```

Every piece is chosen for one reason: it's the smallest thing that still does the job.

- **Wake word:** [openWakeWord](https://github.com/dscripka/openWakeWord) listens constantly, so it has to be cheap. It uses the built in "hey jarvis" model.
- **Speech to text:** [whisper.cpp](https://github.com/ggerganov/whisper.cpp) with the `tiny.en` model. English only, but much lighter than the multilingual one.
- **The brain:** [llama.cpp](https://github.com/ggerganov/llama.cpp) serving Gemma 3 270M, quantized to 4 bits. 270 million parameters is tiny for an LLM, but it can answer short questions.
- **The voice:** [KittenTTS](https://github.com/KittenML/KittenTTS) nano, the smallest model we make at Stellon Labs, at 1.3x speed so replies don't drag.

## How it feels to use

You say "hey jarvis". It plays a short tone. You ask something. It thinks, answers out loud, then listens for a few seconds in case you have a follow up, so you don't have to say the wake word again. If you stay quiet, it plays a sleep tone and goes back to idle.

No startup greeting. No command router. It records only after the wake word. I wanted the simplest loop that felt like an assistant, not a demo with features.

Is it fast? No. There's a noticeable pause while Gemma thinks. But it's all happening on a board that costs less than a nice dinner, and nothing touches the internet.

## What actually broke

The models were the easy part. The Pi was the hard part.

**Compiling llama.cpp ran out of memory.** On a 3B+, the compiler gets killed halfway through. The fix was a script that adds a swap file just for the build and compiles with a single job. Slow, but it finishes. I also try the official arm64 prebuilt first and only build from source if it fails its self test.

**Python versions.** KittenTTS's dependencies needed Python 3.10 to 3.12. Newer OS images ship 3.13. The install script uses `uv` to create a 3.12 environment when it needs to, so nobody has to fight their system Python.

**Audio devices.** Every USB mic and speaker shows up differently. There are flags to pick input and output devices, and a mode that skips the wake word entirely, which made debugging so much nicer.

## Why I did this

Partly for fun. Partly because I spend my working days on small models and I wanted to feel the edge of "small" with my own hands.

Every piece of this pipeline would have been a cloud API a few years ago. Now it fits on a board from a drawer. It's not a product. But it's a pretty good reminder of [where on-device AI is going](/blog/on-device-ai-future-gemma-4-apple).
