---
title: "从零搭建 AI 记忆系统：Ex-Memory 技术解析"
excerpt: "LLM + RAG 如何让 AI 学会一个人的说话风格？聊聊 Ex-Memory 背后的向量检索与微调技术。"
date: 2026-06-20
draft: true

section: tech
tags: [AI, RAG, LLM, "Ex-Memory"]
---
## 什么是 Ex-Memory

Ex-Memory 是一个让 AI 模仿特定人说话风格的系统。你导入聊天记录，AI 学习并还原 ta 的语气、用词习惯和表达方式。

## 技术栈

核心链路是 **LLM + RAG**：

```
聊天记录 → 分块 → 向量化 → 存入向量库
                                    ↓
用户输入 → 检索相似片段 → 组装 Prompt → LLM 生成
```

向量库用的是 ChromaDB（本地运行，隐私优先）。LLM 支持 OpenAI、Claude、Ollama 等多种后端。

## 语气还原的关键

单纯 RAG 检索只能保证内容相关，不能保证语气一致。我们的做法是：

1. **人格画像提取**——分析聊天记录，自动生成 persona.md（MBTI 倾向、高频用语、情感模式）
2. **Few-shot 示例动态选择**——每次对话从历史中挑选最相似的 5 段对话作为 few-shot
3. **风格一致性评分**——生成后自评，低于阈值则重新生成

## 隐私

所有数据只在本地处理。聊天记录、向量索引、人格画像文件全部存储在用户本机。
