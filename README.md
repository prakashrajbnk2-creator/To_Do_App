# ⚡ TASK.IQ | Cognitive Workspace Integration

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-cyan.svg)
![Firebase](https://img.shields.io/badge/Firebase-v9+-orange.svg)
![Gemini](https://img.shields.io/badge/AI-Gemini_Pro-purple.svg)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind_CSS-blue.svg)

**TASK.IQ** is a next-generation, AI-augmented task management system designed for the modern developer. It transforms flat todo lists into structured, cognitive workflows using Google's Gemini Pro AI and real-time synchronization via Firebase.

---

## 🚀 Key Features

### 🧠 AI-Powered "Breakdown"
Don't just list tasks; solve them. TASK.IQ uses **Gemini Pro** to analyze complex requirements and automatically generate a step-by-step roadmap for execution.

### ⚡ Real-Time Sync
Built on **Firestore**, your workspace stays in perfect sync across all sessions. Add a task on one node, and see it reflected instantly across your enterprise network.

### 🛡️ Enterprise-Grade Authentication
Secure identity management via **Firebase Auth**.
- **Google Bio-Sync:** Single-click authentication.
- **Node Identifier:** Traditional email/password registration.
- **Session Persistence:** State-aware login that preserves your cognitive context.

### 🌌 Cyber-Industrial UI
A high-performance interface built for focus:
- **Neon-Infused Aesthetic:** Deep purple and cyan accents for reduced eye strain.
- **Dynamic Progress Tracking:** Real-time visual telemetry of your completion rate.
- **Contextual Categorization:** Smart tagging for Architecture, Design, Backend, and more.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **AI Brain:** Google Gemini 1.5 Flash (via `@google/genai`)
- **Backend/Store:** Firebase Firestore (Real-time DB)
- **Identity:** Firebase Authentication
- **Graphics & Animation:** Tailwind CSS, Framer Motion, Lucide Icons

---

## 📦 Installation & Setup

### 1. Requirements
- Node.js (v18+)
- A Firebase Project
- A Google AI Studio (Gemini) API Key

### 2. Implementation
```bash
# Clone the repository
git clone https://github.com/yourusername/task-iq.git

# Install dependencies
npm install

# Start the development node
npm run dev
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Google Gemini API Key
VITE_GEMINI_API_KEY=your_key_here

# Firebase Configuration (Auto-loaded from firebase-applet-config.json)
```

### 4. Firebase Setup
Ensure your `firebase-applet-config.json` is present in the root. 
- Enable **Firestore** in your console.
- Enable **Google** and **Email/Password** providers in Firebase Auth.
- Deploy the provided `firestore.rules` to secure your data.

---

## 🏗️ Architecture

- **`src/services/geminiService.ts`**: The neural bridge connecting your tasks to AI processing.
- **`src/lib/firebase.ts`**: Real-time persistence layer.
- **`src/components/LoginPage.tsx`**: Secure entry point with bio-sync capabilities.
- **`src/App.tsx`**: The core cognitive orchestrator.

---

## 📜 Security Rules

We use a **Master Gate** pattern for data integrity. Users can *only* access resources where `userId == request.auth.uid`. All updates are validated through strict schema blueprints.

---

## 🤝 Contribution

Designed by **Prakashraj**. Feel free to give advise thankyou

---

<p align="center">
  <i>"Precision is not an act, it's a habit." — TASK.IQ Core Directive</i>
</p>
