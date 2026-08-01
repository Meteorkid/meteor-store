---
title: "Building an AI Memory System from Scratch: Ex-Memory Technical Deep Dive"
excerpt: "How do LLM + RAG let an AI learn someone's speaking style? A look at the vector retrieval and fine-tuning behind Ex-Memory."
date: 2026-06-20
section: tech
tags: [AI, RAG, LLM, "Ex-Memory"]
---
## What Is Ex-Memory

Ex-Memory is a system that lets an AI imitate a specific person's speaking style. You import a chat history, and the AI learns and recreates their tone, word choices, and way of expressing things.

## Tech Stack

The core pipeline is **LLM + RAG**:

```
Chat history → Chunking → Vectorization → Stored in vector DB
                                    ↓
User input → Retrieve similar fragments → Assemble prompt → LLM generates
```

The vector database is ChromaDB (runs locally, privacy first). The LLM supports multiple backends including OpenAI, Claude, and Ollama.

## The Key to Tone Reproduction

Pure RAG retrieval only ensures content relevance; it can't guarantee tonal consistency. Our approach:

1. **Persona extraction** — analyze the chat history and auto-generate a persona.md (MBTI tendencies, high-frequency phrases, emotional patterns)
2. **Dynamic few-shot example selection** — for each conversation, pick the 5 most similar exchanges from history as few-shot examples
3. **Style consistency scoring** — self-evaluate after generation; if it falls below a threshold, regenerate

## Privacy

All data is processed locally only. Chat history, vector index, and persona files are all stored on the user's own machine.
