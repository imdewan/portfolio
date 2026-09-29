---
title: "The Link Is the Lock"
excerpt: "I built a little app for making interactive greeting cards. The most interesting decision was that there are no accounts at all. The share link is the only key."
date: 2026-08-11
updated: 2026-08-11
tags: ["Firebase", "React", "Security", "Build log"]
seoDescription: "Building a shareable greeting card app on Firestore with no accounts: unguessable nanoid slugs, get-but-no-list security rules, immutable documents, and fitting photos under the 1 MiB document limit."
---

![A small wrapped gift on a wooden table](https://cdn.pixabay.com/photo/2016/05/28/00/06/gift-1420830_1280.jpg)

Some projects start from a big idea. This one started from wanting to make someone smile.

I wanted to send a birthday message that felt like more than a text. Something you open, like an envelope. With photos, a song, maybe a little quiz about us. And I wanted anyone to be able to make one in a couple of minutes and share it with a single link.

That turned into A Surprise Gift, a small web app for interactive cards. It has 39 templates across 10 categories, particle effects like confetti and petals, a voice note, music embeds, a countdown lock that keeps the card sealed until a date, and a "reasons" deck you flip through one card at a time.

The fun stuff took a while. But the decision I keep thinking about is a boring one.

## No accounts

The person making the card doesn't sign up. The person receiving it definitely shouldn't have to.

So the only thing that grants access to a card is its link. Something like `/c/velvet-moon-7f3a`. Two friendly words and a random suffix.

That means the link *is* the password, and the whole security model has to follow from that.

## Get, but never list

In Firestore, `read` is really two permissions: `get` a single document and `list` a collection. The rules split them:

```js
match /cards/{slug} {
  allow get: if true;
  allow list: if false;
  allow create: if isValidCard(request.resource.data);
  allow update, delete: if false;
}
```

Anyone can read a card if they know its exact slug. Nobody can ask "show me all cards". Without `list`, you can't enumerate the collection, and without enumeration, the only way in is guessing.

The random part of the slug comes from nanoid's `customAlphabet`, with confusing characters like `0`, `o`, `1`, `l`, and `i` removed. People read these links out loud and type them on phones, so avoiding "is that an O or a zero" matters. The two words make it memorable, the suffix makes it hard to guess, and no listing means there is nothing to crawl.

Cards are also immutable. Once written, nobody can update or delete them through the client, not even the creator. That sounds harsh, but it means a shared link can never be swapped for something else later.

The create rule validates sizes too: title under 200 characters, message under 5,000, at most 12 photos and 20 reasons. The rules are the real boundary, so they carry the limits, not just the UI.

## Fitting a gift into a megabyte

Firestore documents have a hard 1 MiB limit. Cards have photos. You can see the problem.

Instead of adding Storage, signed URLs, and cleanup jobs, I kept everything in one document. Photos get resized in the browser with a canvas, re-encoded as JPEG, and stored as data URLs. Before saving, the client measures the whole card and refuses anything over about 950 KB, with a clear message telling you to drop a photo or two.

One document per card means one read to open it. No waterfalls, no broken images if some other service is slow. For something people open once, emotionally, on a phone, that matters.

## Keeping my name off the gift

Small detail, but I care about it. The app's own pages credit me. A finished card never does. It's their gift, not my ad.

I wrote a Puppeteer check that opens a card sealed and unsealed and fails if my name shows up anywhere on it. It feels like a silly test to write. It's also exactly the kind of thing that regresses quietly.

## What I learned

When you remove accounts, you don't remove security. You just move all of it into a few very deliberate decisions: what the link is, what can be listed, what can change, and how big things can get.

I like that. It's a small system you can hold in your head.
