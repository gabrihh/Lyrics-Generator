# Lyrics Generator

> **Automatically generate synced lyric videos** from any song using **Remotion** + **GroqCloud Whisper API**.

<p align="center">
  <img src="https://img.shields.io/badge/Remotion-4.0+-blueviolet?style=for-the-badge&logo=remotion" alt="Remotion">
  <img src="https://img.shields.io/badge/Groq-Whisper_API-orange?style=for-the-badge" alt="Groq">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT">
  <img src="https://img.shields.io/badge/Free_for_Fair_Use-✔-brightgreen?style=for-the-badge" alt="Fair Use">
</p>

---

## ✨ What is this?

A lyric video generator that runs **100% in the cloud** via GitHub Actions.  
You provide the audio and a few details — the workflow handles the rest: AI transcription, syncing, and final render.

---

## 🚀 Quick Start

**1.** Go to the [**Actions**](https://github.com/gabrihh/Lyrics-Generator/actions/workflows/render.yml) tab

**2.** Click on **`Run workflow`**

**3.** Fill in the fields below and confirm:

| Field | Description | Required |
|---|---|:---:|
| 🎵 **Audio URL (.mp3)** | Direct link to the audio file | ✅ |
| 📝 **Song title** | Title shown in the top-left corner | ✅ |
| 🎤 **Artist / Author** | Author shown below the title | ✅ |
| 🌐 **Language** | Song language — speeds up and improves transcription | ❌ |
| 🎨 **Background color (hex)** | Background color in hex (e.g. `#0d1117`) | ✅ |
| 🖼️ **Logo URL** | Logo shown in the bottom-right corner | ❌ |
| 💡 **Lyric Example** | Snippets of the lyrics to boost AI accuracy | ❌ |

**4.** Wait for the render and download the video from the **Artifacts** section of the run.

---

## 🧠 How it works

```
🎵 Audio  →  🎙️ Whisper (Groq)  →  📝 Lyrics + Timestamps  →  🎬 Remotion  →  🎥 MP4 Video
```

---

## 📄 License

Distributed under the **MIT License** — free for fair use.

---

<p align="center">
  <sub>© 2026 <strong>GabrihhDEV</strong> · Made with ☕ and GitHub Actions</sub>
</p>
