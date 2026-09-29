---
title: "Learning PyTorch as a Mobile Engineer"
excerpt: "I have spent a lot of time shipping models to phones without really understanding how they are trained. So I started learning, from the very beginning."
date: 2026-08-30
updated: 2026-08-30
tags: ["AI", "PyTorch", "Learning", "Apple Silicon"]
seoDescription: "Notes from a React Native and on-device AI engineer starting to learn machine learning: setting up Anaconda and PyTorch on Apple Silicon with the MPS backend, and what felt familiar or strange."
---

![A laptop showing code on a desk](https://cdn.pixabay.com/photo/2017/08/10/08/47/laptop-2620118_1280.jpg)

Here is a slightly embarrassing thing to admit.

A lot of my work is about running AI models on devices. Packaging them, loading them, calling them from React Native, making them feel fast inside a real app. I know a lot about what happens *after* a model exists.

I know much less about how it comes to exist.

I can read "quantized to 4 bits" and understand the tradeoff for a phone. But if you asked me to explain what the optimizer is doing during training, I would be hand waving. That has started to bother me.

So this month I went back to the start.

## The setup

I'm on an Apple Silicon Mac, so the first goal was simple: get PyTorch running on the GPU instead of the CPU.

I used Anaconda for the environment, mostly because I didn't want to fight Python versions while learning something else. Then Jupyter, because being able to run one cell at a time and poke at the output is exactly how I learn.

The first real "oh nice" moment was this:

```python
import torch

device = "mps" if torch.backends.mps.is_available() else "cpu"
a = torch.rand(1000, 1000, device=device)
b = torch.rand(1000, 1000, device=device)
print((a @ b).device)  # mps:0
```

MPS is Apple's Metal Performance Shaders backend. PyTorch can use it the same way it uses CUDA on Nvidia cards. Seeing `mps:0` meant the matrix multiply ran on the Mac's GPU. Small thing. Felt big.

## Starting from the ground

My first notebook doesn't touch neural networks at all. It goes:

1. NumPy arrays and broadcasting
2. Pandas and the Iris dataset
3. a few Seaborn plots to actually look at the data
4. a scikit-learn RandomForest, because it gives you a decent result with almost no code
5. PyTorch tensors on MPS

I wanted to go in that order on purpose. Tensors are just arrays with opinions. If NumPy feels natural, PyTorch feels less like magic.

## What feels familiar

More than I expected.

Tensors and shapes feel a lot like working with typed buffers when you move data between JavaScript and native code. Moving data to a device with `.to(device)` feels like the same idea as crossing a bridge: it's cheap to write, not always cheap to run, and you should know when it is happening.

Also, a lot of the day to day is plumbing. Loading data, reshaping it, batching it, checking shapes. That part I'm comfortable with.

## What feels strange

The feedback loop. In app development, you change something and see it on screen in a second. In ML, you change something and then... wait, and look at a number, and try to guess why the number moved.

It's a very different kind of debugging. Less "this is broken", more "this is slightly worse, and I'm not sure why".

## Why bother

Because I think the people building on-device AI features will make better decisions if they understand the model side a bit more. Why a smaller model is worse at some things and fine at others. What a model actually learned. Where the numbers come from.

I don't want to become an ML researcher. I just want to stop treating the model as a black box I'm shipping.

Next step is a real neural network. The classic one. MNIST.
