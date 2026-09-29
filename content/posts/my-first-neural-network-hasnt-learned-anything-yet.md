---
title: "My First Neural Network Hasn't Learned Anything Yet"
excerpt: "49 lines of PyTorch, an MNIST model that can't recognise a single digit, and why I'm weirdly happy about it."
date: 2026-09-17
updated: 2026-09-17
tags: ["AI", "PyTorch", "Learning", "MNIST"]
seoDescription: "Building a first neural network in PyTorch: an MNIST multilayer perceptron on Apple Silicon MPS, what each line does, and why the training loop is the next step."
---

![Code on a dark screen](https://cdn.pixabay.com/photo/2016/11/19/14/00/code-1839406_1280.jpg)

I wrote my first neural network this week.

It currently knows nothing.

If you show it a handwritten 7, it will guess with the confidence of a random number generator, because that's what it is right now. There's no training loop yet. And I'm genuinely happy about it, because for the first time I understand every line that exists.

This is part two of me [learning PyTorch as a mobile engineer](/blog/learning-pytorch-as-a-mobile-engineer).

## The data

MNIST is the "hello world" of machine learning. 70,000 small grayscale images of handwritten digits, 28 by 28 pixels each.

```python
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))
])
```

`ToTensor` turns the image into numbers between 0 and 1. The two magic numbers after it are the mean and standard deviation of all MNIST pixels. Normalizing shifts the data so it's centered around zero, which makes training more stable.

I spent an embarrassing amount of time on those two numbers. They're not magic. Someone just computed them once over the whole dataset, and now everyone copies them.

Then the loaders:

```python
train_loader = DataLoader(train_dataset, batch_size=64, shuffle=True)
test_loader = DataLoader(test_dataset, batch_size=1000, shuffle=False)
```

Training looks at 64 images at a time, shuffled, so the model doesn't learn anything from the order. Testing can use big batches because nothing is being learned there.

## The model

```python
class SimpleMLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.flatten = nn.Flatten()
        self.net = nn.Sequential(
            nn.Linear(784, 128),
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, 10),
        )
```

Reading this top to bottom finally clicked for me:

- `Flatten` unrolls the 28 by 28 image into a list of 784 numbers
- the first layer squeezes 784 numbers into 128
- `ReLU` is just `max(0, x)`, and it's the thing that stops the whole network from being one big linear equation
- then down to 64
- then to 10 outputs, one score for each digit

That's it. That's the whole brain. About 110,000 numbers that start random and, eventually, will be nudged until they're useful.

## Running on the Mac GPU

```python
device = "mps" if torch.backends.mps.is_available() else "cpu"
model = SimpleMLP().to(device)
```

Same trick as last time. On Apple Silicon it runs on the GPU through MPS, anywhere else it falls back to the CPU.

## Why no training loop yet

I could have copied one from a tutorial in 30 seconds. The code would run, a number would go up, and I wouldn't be able to explain a single line of it.

This time I want to write the loop myself and understand each step: forward pass, loss, `backward()`, optimizer step, zeroing the gradients, and why forgetting that last one quietly ruins everything.

That's the next post.

There's something nice about going slowly on purpose. My whole job is shipping things fast. This is the one place where I'm allowed to not.
