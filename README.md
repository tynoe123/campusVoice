<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/29d072e2-3077-4d9c-8e75-9ed90dc0472e

## Run Locally

You’ve got a Vite + React + TypeScript + Node backend project.

Key clues:

vite.config.ts → uses Vite
App.tsx, main.tsx → React frontend
server.ts → backend server (Node)
package.json → controls how everything runs

1. Open in Visual Studio Code

Open the main folder (the one with package.json)

2. Install dependencies (if not already)

In terminal:
npm install

3. Run the project
Now run:
npm run dev

🔍 What should happen

You’ll likely get TWO things running:

http://localhost:5173
🔵 Backend (server.ts)
http://localhost:4000

Open a new terminal (keep backend running), then run:

npx vite

If everything is fine, you’ll see something like:

http://localhost:5173

👉 Open the Vite URL (usually 5173) in:

Google Chrome
Microsoft Edge

The frontend will automatically talk to the backend.
