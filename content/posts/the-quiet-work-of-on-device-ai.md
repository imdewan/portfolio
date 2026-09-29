---
title: "The Quiet Work of On-Device AI"
excerpt: "I keep coming back to the same idea: the best AI features should feel less like a demo and more like the app quietly caring about the user."
date: 2026-05-04
updated: 2026-05-04
tags: ["AI", "Mobile"]
---

# The Quiet Work of On-Device AI

![A hand holding a phone with colorful light waves](https://images.pexels.com/photos/20870805/pexels-photo-20870805.jpeg)

There is a kind of AI feature that makes a great demo and then slowly becomes annoying in the actual product.

It talks too much. It needs a loading state every time. It makes the simple path feel heavier. It asks the user to trust a black box before the product has earned any trust at all.

That is not the kind of AI I want to build.

The version I care about is quieter. It runs closer to the user. It helps without turning the whole interface into a chat window. It makes the product feel sharper, not louder.

## The phone is still the most emotional computer

Mobile products are personal in a way dashboards usually are not. Your phone has your photos, receipts, habits, voice notes, passwords, bank alerts, location history, and the weird tiny details that make your life yours.

So when I think about on-device AI, I do not think about it only as a performance decision. I think about it as a product posture.

Running work locally can mean:

- less waiting
- fewer round trips
- better offline behavior
- less sensitive data leaving the device
- features that feel instant enough to become invisible

Google's [LiteRT overview](https://ai.google.dev/edge/litert/overview) frames this technically: on-device inference can run across Android, iOS, web, desktop, and edge devices. Apple has been saying the human side for years through its privacy work: features are better when personal data is minimized, processed locally when possible, and not treated like cheap exhaust. Their [privacy features page](https://www.apple.com/privacy/features/) is worth reading with a product-builder brain, not just a user brain.

## The hard part is not the model

The hard part is usually the edge of the feature.

What happens when the model is slow? What happens when it is wrong? What does the UI show before confidence is high? Does the user understand what changed? Can they undo it? Can they ignore it?

The engineering work is real, but the product work is where trust is won.

I have been trying to use a simple test:

> If the AI disappears, does the product still make sense?

If the answer is no, the feature is probably carrying too much responsibility. If the answer is yes, the AI is likely enhancing a product that already has a spine.

That is the feeling I want in the things I build: useful first, impressive second.
