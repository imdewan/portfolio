---
title: "I Replaced an Invoice App With One HTML File"
excerpt: "No build step, no backend, no subscription. Just one HTML file, localStorage, and the browser's print dialog doing the PDF work."
date: 2026-07-03
updated: 2026-07-03
tags: ["Web", "Tools", "Build log"]
seoDescription: "How I built a single-file HTML invoice generator with autosave in localStorage and A4 PDF export using window.print and @page CSS, with no framework or build step."
---

I needed to send an invoice.

That was the whole problem. Not "build an invoicing platform". Just send one clean, correct PDF, and then do it again next month without retyping everything.

I looked at a few apps. All of them wanted an account, a plan, a logo upload flow, and my client list in their database. For something I do once a month, that felt like too much ceremony.

So I opened a blank `index.html`.

## The constraints I gave myself

- one file
- no build step, no npm install
- opens by double clicking it
- remembers what I typed last time
- outputs a proper A4 PDF

It ended up around 1,200 lines, most of which is CSS. Which honestly tells you where the real work in an invoice is.

## The browser already has a PDF engine

This was the part that made the whole thing click.

I didn't need a PDF library. Every browser already ships one behind `window.print()`. You just have to design for paper:

```css
@page {
  size: A4;
  margin: 0;
}

@media print {
  .editor { display: none; }
  .invoice { box-shadow: none; }
}
```

The left side of the page is a form. The right side is the invoice, rendered live at A4 proportions. When I hit print, the form disappears and "Save as PDF" gives me exactly what I see.

Getting the page breaks, margins, and table widths right took longer than everything else combined. Print CSS is its own little world. But once it works, it is completely predictable, which is more than I can say for most PDF libraries.

## localStorage is the database

Every field autosaves to localStorage as I type. When I open the file next month, last month's invoice is already there. I bump the invoice number, change the dates and line items, and print.

I prefilled the defaults from a previous invoice so the first run was basically zero effort too.

No sync, no accounts, no backups beyond the PDFs themselves. And for this use case, that's fine. The PDF is the record. The HTML file is just the pen.

## Why I like tools like this

There is a version of me that would have built this with Next.js, a database, and auth, "in case I want to turn it into a product later".

I didn't want a product. I wanted an invoice.

Small, single-purpose tools age really well. There is nothing to update, nothing to break, no dependency that disappears. In five years that file will still open and still print.

That is a nice feeling to have about software.
