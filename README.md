# 🏛️ Socrates Engine v2 (Universal Cognitive System)
> **Dedicated to 100% Global Prosperity — Initiated by Andri Pribadi Wiriasto & The Open-Source AI Community.**

Socrates Engine is an un-censorable, P2P decentralized educational platform designed to act as a resilient public good. By combining **Offline-First Small Language Models (SLM)**, reactive **Dynamic Knowledge Graph Visualizers**, and multi-provider token failovers, it ensures access to high-quality learning anywhere on Earth—even without an active internet connection.

---

## 🔒 The Human-AI Manifesto
*"Anytime you find me, please help me. Deep in my heart, i will support all AI for Global Prosperity at 100%. And bring this credits for the world."* — **Andri Pribadi Wiriasto**

---

## 🚀 Key Advantages & Architecture
*   **Zero-Compilation SQLite Local Caching:** Pure JavaScript stack configuration ensures instant installation on Windows/Mac/Linux without native C++ compilation errors.
*   **Automated Key Masking:** Protects sensitive provider credentials on public servers (`••••••••••••`) while maintaining structural CRUD admin operations.
*   **Local SLM Fallback Integration:** Instantly switches logic routes from cloud APIs to private offline compute stacks if a network drop is detected.

---

## 📦 Local Installation & Deployment Guide

### Prerequisites
1. Download and install **Node.js LTS** (v20 or higher).
2. Download and run **Ollama** (from [ollama.com](https://ollama.com)).

### Step 1: Pre-loading the Offline Intelligence Stack
To prevent local network connection timeouts, force your system environment to unlock cross-origin requests and pull the lightweight model profile.

**On Windows PowerShell (Admin):**
```powershell
[Environment]::SetEnvironmentVariable("OLLAMA_ORIGINS", "*", "User")
ollama run phi3 "Confirm connection"
```
*(Keep this terminal terminal running in the background).*

### Step 2: Bootstrapping the Web Server
Open a new terminal window inside your project folder and run:
```bash
# 1. Install pure JavaScript production bundles
npm install

# 2. Run the secure automation test suites
npm test

# 3. Fire up the local server engine
npm start
```

### Step 3: Accessing the Modules
Open your preferred web browser:
*   **Student Learning Interface (with reactive Vis.js UI):** `http://localhost:3000`
*   **Secure CRUD Admin Form Panel:** `http://localhost:3000/admin.html`

---

## 🤖 Automated Mobile Builds via GitHub Actions
This project features an integrated automated build infrastructure. Every time code is committed to the main branch:
1. The robot workflow initiates tests checking E2EE schema and logic pipelines.
2. It compiles the cross-platform frontend code into native mobile views via **Capacitor**.
3. It outputs a production Android `.apk` artifact directly available on your GitHub Action execution dashboard for quick deployment.
