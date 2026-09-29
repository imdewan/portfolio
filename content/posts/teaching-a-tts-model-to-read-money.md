---
title: "Teaching a TTS Model to Read \"$12.50\""
excerpt: "Before a speech model can say a sentence, something has to decide how that sentence should be said. That part is called text normalization, and it's full of tiny traps."
date: 2026-07-19
updated: 2026-07-19
tags: ["AI", "Python", "Text-to-speech", "KittenTTS"]
seoDescription: "How text normalization works for text-to-speech: expanding abbreviations, currency, times, dates, and URLs into spoken words, plus returning character spans to map audio back to the original text."
---

![Close up of old typewriter keys](https://cdn.pixabay.com/photo/2016/10/30/00/06/typewriter-1782062_1280.jpg)

Here is a sentence:

> Dr. Rivera paid $12.50 at 3:05 p.m.

You read that without thinking. A speech model can't.

It doesn't know "Dr." is "Doctor" here and "Drive" in an address. It doesn't know that "$12.50" is "twelve dollars and fifty cents" and not "dollar sign twelve point five zero". It doesn't know "3:05" is a time.

Before [KittenTTS](https://github.com/KittenML/KittenTTS) turns text into sound, something has to turn written text into *spoken* text. That step is called text normalization, and I spent a good chunk of time making ours more robust.

## What the result looks like

```python
from kittentts import normalize_text

normalize_text("Dr. Rivera paid $12.50 at 3:05 p.m.")
# "Doctor Rivera paid twelve dollars and fifty cents at three oh five p m."
```

That output reads oddly on screen. Said out loud, it's exactly right. That's the whole job: write it down the way a person would say it.

## The traps

Once you start, you find edge cases everywhere.

**Abbreviations are ambiguous.** "St." can be "Saint" or "Street". "Dr." can be "Doctor" or "Drive". Context usually tells you, which means the rules have to look at the words around them.

**Numbers depend on what they are.** "2026" as a year is "twenty twenty six". As a quantity it's "two thousand twenty six". "1/2" might be a fraction or a date.

**Times have their own grammar.** "3:05" is "three oh five", not "three zero five" and not "three point zero five".

**URLs and symbols.** Nobody wants to hear a URL read character by character, but you can't drop it either.

**Punctuation changes rhythm.** Periods in "p.m." are not sentence endings. If you treat them as one, the voice pauses in the middle of a time.

Each of these is easy alone. The difficulty is having dozens of them interact without breaking each other. So the work landed with a proper test file, because this is exactly the kind of code where fixing one case silently breaks another.

## Spans: remembering where things came from

This was my favourite part.

Normalization changes the length of text. "$12.50" is 6 characters. "twelve dollars and fifty cents" is 30. If you want to highlight words on screen while they're spoken, you need to know which spoken words came from which original characters.

So `normalize_text` can return spans:

```python
result = normalize_text("Fig. 2", return_spans=True)
result.text   # the spoken version
result.spans  # original range -> normalized range, for every change
```

Every change is recorded as a mapping from the original text to the normalized text. That's what makes things like karaoke style highlighting, accessibility readers, and word timings possible, without guessing.

## Keeping it small

KittenTTS is about being small. The earlier version of the library had already dropped some heavy dependencies, and I didn't want normalization to bring that weight back. So this is plain Python rules and tests, no big NLP library. For a model that's 25 MB, a normalization step that pulls in hundreds of megabytes would be silly.

## Why this matters more than it seems

People judge a TTS system by its worst sentence, not its best one. A beautiful voice that says "dollar sign twelve point five zero" sounds broken, and the listener stops trusting it.

Normalization is invisible when it works. That's kind of the point.
