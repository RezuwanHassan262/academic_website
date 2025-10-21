---
title: "Bangla Grammatical Error Detection"
excerpt: "Identifies grammatical mistakes in Bangla
language text."
collection: portfolio
category: ml
permalink: portfolio/bangla_ged
description: "**Rising Team** in [Bhashabhrom](https://www.kaggle.com/competitions/bengali-ged)"
slidesurl: 'https://drive.google.com/file/d/1h8QPdTE4O1mIiW4Ot-g8_MUjvX2aucsz/view'
paperurl: 'https://arxiv.org/abs/2308.14397'
---

This project aims to develop a grammatical error detection model for the Bengali language, capable of identifying various error types such as single-chunk errors, multi-chunk errors, punctuation errors, and spacing errors.

To address this challenge, we fine-tuned the **ByT5-small model**, a multilingual model that utilizes byte-level tokenization, making it highly adaptable to Bengali. Additionally, we implemented a custom **greedy decoding algorithm** to efficiently insert error indicators into the text. 

In the **post-processing stage**, we applied a heuristic-based approach to handle spacing issues and multiple punctuation errors effectively. Our method achieved **edit distance of 1.14**.




