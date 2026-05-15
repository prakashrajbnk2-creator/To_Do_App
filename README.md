# ⚡ TASK.IQ | Cognitive Workspace Integration

> "Redefining task management through high-performance AI orchestration and real-time synchronization."

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![Firebase](https://img.shields.io/badge/Firebase-v9+-orange.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini_Pro-purple.svg)

---

## 📖 Overview
**TASK.IQ** turns your standard todo list into a high-performance cognitive workspace. It leverages Google's Gemini Pro AI to atomize complex goals and Firebase to ensure your state is synchronized across all nodes instantly.

The pipeline is:
1.  **Cognitive Input:** User provides raw task data.
2.  **Neural Processing:** Gemini Pro identifies categories and breaks down complex tasks into logical sub-units.
3.  **Encrypted Transport:** Data is synchronized via Firestore with strictly enforced security rules.
4.  **Hardware-Accelerated UI:** Framer Motion and Tailwind CSS deliver a zero-latency, 60fps interaction layer.

---

## ✨ What You Get
- **AI Neural Breakdown:** Automatically generate a step-by-step roadmap for any complex task.
- **Biometric-Ready Auth:** Seamless Google Login priority with fallback Node Identifier registration.
- **Enterprise-Grade Sync:** Sub-millisecond data persistence across all devices.
- **Smart Category Triage:** Auto-categorization (Architecture, Backend, Design, etc.) via Gemini.
- **Dark-Core Interface:** A high-contrast, professional-grade theme designed for long-term focus.

---

## 🏗️ Architecture
**TASK.IQ Hybrid Stack**
│
├─ **Web Interface (React 18)**
│    ├─ Framer Motion (Animation Engine)
│    ├─ Tailwind CSS (Visual Framework)
│    └─ Lucide (Iconography)
│
├─ **Neural Engine (Google Gemini)**
│    ├─ Task Atomization (Sub-task generation)
│    └─ Semantic Labeling (Categorization)
│
├─ **Persistence Layer (Firebase Firestore)**
│    ├─ Per-User Isolation
│    └─ Real-time Query Subscriptions
│
└─ **Identity Provider (Firebase Auth)**
     ├─ Google Bio-Sync
     └─ Encrypted Session Management

---

## 🛠️ Requirements
### 📦 Dependencies (Must Do)
Before initializing your node, ensure you have the following credentials ready:

1.  **Google AI Studio API Key:** Required for cognitive breakdown and smart labeling.
2.  **Firebase Project:** Required for database sync and authentication.
3.  **Modern Browser:** Support for hardware-accelerated CSS and WebSockets.

| Requirement | Notes |
| :--- | :--- |
| **Node.js v18+** | Production runtime environment |
| **Firebase Config** | `firebase-applet-config.json` in root |
| **Gemini Key** | Set in `.env` as `VITE_GEMINI_API_KEY` |
| **Tailwind CSS** | Pre-configured via Vite |

---

## 🚀 Getting Started

### 1. Clone and Build
```bash
git clone https://github.com/yourusername/task-iq.git
cd task-iq
npm install
```

### 2. Environment Setup
Create a `.env` file in the root:
```bash
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### 3. Firebase Implementation
- Obtain your `firebase-applet-config.json` from the Firebase Console.
- Enable **Firestore** and **Google Auth**.
- **Crucial:** Deploy the security rules provided in `firestore.rules`.

### 4. Direct Entry
```bash
npm run dev
# Dashboard available at http://localhost:3000
```

---

## ⚙️ Internals & AI Tuning
**Neural Logic (Gemini 1.5 Flash):**
- **Temperature:** 0.7 for balanced creativity in sub-task planning.
- **Context Window:** Optimized for rapid JSON-response schema extraction.
- **Atomic Scaling:** Complex tasks are limited to a 5-step primary roadmap for maximum clarity.

**Database Invariants (Firestore Rules):**
- **Master Gate:** `allow list: if resource.data.userId == request.auth.uid`.
- **Integrity Guard:** Every write is validated against a strict key-set schema.
- **Terminal State:** Completed tasks are immutable except for deletion actions.

---

## 🧱 Project Layout
```
TASK.IQ/
├── README.md                # This Blueprint
├── firestore.rules          # Security Protocols
├── firebase-blueprint.json  # Data Schema IR
├── src/
│   ├── App.tsx              # Cognitive Orchestrator
│   ├── components/
│   │   └── LoginPage.tsx    # Secure Access Node
│   ├── services/
│   │   └── geminiService.ts # Neural Engine Bridge
│   └── lib/
│       ├── firebase.ts      # Persistence Layer
│       └── firestoreErrorHandler.ts
└── public/                  # Static Assets
```

---

## 🗺️ Roadmap
- [x] Stable AI-augmented breakdown logic.
- [x] Real-time Firebase Firestore synchronization.
- [x] Secured Auth Priority (Google Login).
- [ ] Voice-to-Task neural input.
- [ ] Multi-user team collaborative workspace "Shared Nodes".
- [ ] Offline-first persistence via Service Workers.

---

## 📄 License
Licensed under the **MIT License**.

Built by **Prakashraj** · *Expanding your productivity, one task at a time.*

