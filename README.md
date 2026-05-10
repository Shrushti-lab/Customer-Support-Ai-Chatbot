# SupportAI - Customer Support Bot

A robust, enterprise-grade customer support chatbot built with **Express (Node.js)** and **React**. This application features a sophisticated "Hardware-style" dark-mode interface and an intelligent support engine.

## 🚀 Features
- **Intelligent Knowledge Base**: Handles queries about Shipping, Refunds, and Technical Support.
- **Dynamic Fallback**: Intelligently offers to connect to a human agent when queries exceed the bot's current knowledge.
- **Premium UI/UX**: Dark-mode aesthetic inspired by professional specialist tools, built with Tailwind CSS and Motion.
- **Real-time Interaction**: Simulated typing bubbles and smooth state transitions.
- **Portfolio Ready**: Clean architecture, responsive design, and professional documentation.

## 🛠️ Tech Stack
- **Frontend**: React 19, Tailwind CSS, Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **Tooling**: Vite (HMR disabled in this preview), tsx.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd support-ai
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root and add your API key (optional for enhanced AI fallback):
   ```env
   API_KEY=your_key_here
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 🧠 Support Engine Logic
The core logic resides in `server.ts`. It uses a pattern-matching system to identify user intent across three main categories:
1. **Shipping**: Topics related to delivery times and tracking.
2. **Refunds**: Return policy and processing timelines.
3. **Technical Support**: Common troubleshooting and documentation links.

## 📜 Repository Structure
- `server.ts`: The Express server and core SupportEngine class.
- `src/App.tsx`: The full Chat UI implemented with React and Tailwind.
- `metadata.json`: Application metadata for platform integration.

