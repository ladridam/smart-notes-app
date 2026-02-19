# AI Smart Notes

A smart notes application powered by Firebase and Google's Gemini AI (via Vertex AI). Built for the "Supercharge your webapps using Firebase and Gemini" demo session.

## Features

- **Google Sign-in** - Secure authentication with Firebase Auth
- **Real-time Notes** - Create, edit, and delete notes with Firestore
- **AI Summarization** - Get instant summaries of your notes
- **Action Items Extraction** - Automatically extract tasks and to-dos
- **Writing Improvement** - Enhance grammar, clarity, and professionalism

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Firebase (Auth, Firestore)
- **AI**: Vertex AI (Gemini 2.0 Flash)

## Prerequisites

- Node.js 18+
- Google account
- Google Cloud account (for Vertex AI credits)

---

## Setup Instructions

### Step 1: Clone and Install Dependencies

```bash
git clone <repository-url>
cd smart-notes-app
npm install
```

---

### Step 2: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or "Add project")
3. Enter project name: `smart-notes-app` (or your preferred name)
4. Disable Google Analytics (optional for demo)
5. Click **"Create project"**
6. Wait for project creation, then click **"Continue"**

---

### Step 3: Enable Firebase Authentication

1. In Firebase Console, select your project
2. Left sidebar → **Build** → **Authentication**
3. Click **"Get started"**
4. Go to **"Sign-in method"** tab
5. Click on **"Google"** provider
6. Toggle **"Enable"** switch ON
7. Select a **Project support email** (your email)
8. Click **"Save"**

---

### Step 4: Create Cloud Firestore Database

1. Left sidebar → **Build** → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for demo purposes)
4. Choose a Firestore location (e.g., `us-central1`)
5. Click **"Enable"**

---

### Step 5: Create Firestore Composite Index

The app uses a compound query that requires an index.

1. In Firestore, go to **"Indexes"** tab
2. Click **"Create index"** under **Composite** tab
3. Fill in:
   | Field | Value |
   |-------|-------|
   | **Collection ID** | `notes` |
   | **Field 1** | `userId` → **Ascending** |
   | **Field 2** | `updatedAt` → **Descending** |
   | **Query scope** | Collection |
4. Click **"Create index"**
5. Wait 1-2 minutes for the index to build (status will show "Enabled")

---

### Step 6: Get Firebase Configuration

1. In Firebase Console → Click **gear icon** (Settings) → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click **Web icon** (`</>`) to add a web app
4. Enter app nickname: `smart-notes-web`
5. Click **"Register app"**
6. Copy the `firebaseConfig` values (you'll need these for `.env.local`)

---

### Step 7: Enable Billing on Google Cloud

Vertex AI requires billing to be enabled (you can use free credits):

1. Go to [Google Cloud Billing](https://console.cloud.google.com/billing)
2. If you have Google Cloud credits, link that billing account
3. Or create a new billing account
4. Go to: `https://console.developers.google.com/billing/enable?project=YOUR_PROJECT_ID`
   - Replace `YOUR_PROJECT_ID` with your Firebase project ID
5. Select your billing account and click **"Set Account"**
6. Wait 2-3 minutes for propagation

---

### Step 8: Enable Vertex AI API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project from the top dropdown
3. Go to [Vertex AI Console](https://console.cloud.google.com/vertex-ai)
4. If prompted, click **"Enable All Recommended APIs"**
5. Alternatively, enable via search:
   - Left sidebar → **APIs & Services** → **Library**
   - Search for **"Vertex AI API"**
   - Click on it → Click **"Enable"**

---

### Step 9: Create Service Account for Vertex AI

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Left sidebar → **IAM & Admin** → **Service Accounts**
3. Click **"+ CREATE SERVICE ACCOUNT"**
4. Fill in:
   - **Service account name**: `vertex-ai-client`
   - **Service account ID**: (auto-fills)
5. Click **"CREATE AND CONTINUE"**
6. **Grant access** → Click dropdown → Search and select **"Vertex AI User"**
7. Click **"CONTINUE"** → Click **"DONE"**

### Download Service Account Key:

8. In the Service Accounts list, find `vertex-ai-client`
9. Click the **three dots (⋮)** on the right → **"Manage keys"**
10. Click **"ADD KEY"** → **"Create new key"**
11. Select **"JSON"** → Click **"CREATE"**
12. A JSON file will download automatically
13. Rename it to `service-account.json`
14. Move it to your project root folder:
    ```
    smart-notes-app/
    ├── service-account.json  ← Place here
    ├── app/
    ├── components/
    └── ...
    ```

> **IMPORTANT**: Never commit `service-account.json` to git! It's already in `.gitignore`.

---

### Step 10: Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in your Firebase config:
   ```env
   # Firebase Configuration (from Step 6)
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Google Cloud / Vertex AI Configuration
   GOOGLE_CLOUD_PROJECT=your_project_id

   # Path to service account key
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   ```

---

### Step 11: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage Guide

1. **Sign In** - Click "Sign in with Google" on the landing page
2. **Create Note** - Click "New Note" button in the dashboard
3. **Write Content** - Add a title and content to your note
4. **Use AI Features**:
   - Click **"✨ Summarize"** to get a summary of your note
   - Click **"📋 Get Action Items"** to extract tasks and to-dos
   - Click **"✍️ Improve Writing"** to enhance grammar and clarity
5. **Apply Changes** - For improved writing, click "Apply Changes" to update your note
6. **Save** - Click "Save Note" to store in Firestore

---

## Project Structure

```
smart-notes-app/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page with auth
│   ├── globals.css             # Tailwind styles
│   ├── dashboard/
│   │   └── page.tsx            # Main notes dashboard
│   └── api/ai/
│       ├── summarize/route.ts  # AI summarize endpoint
│       ├── actions/route.ts    # Extract action items endpoint
│       └── improve/route.ts    # Improve writing endpoint
├── components/
│   ├── AuthButton.tsx          # Google sign-in/out button
│   ├── NotesList.tsx           # Notes list view
│   ├── NoteEditor.tsx          # Note editing with AI toolbar
│   └── AIToolbar.tsx           # AI action buttons
├── lib/
│   ├── firebase.ts             # Firebase initialization
│   └── vertexai.ts             # Vertex AI Gemini client
├── hooks/
│   └── useNotes.ts             # Notes CRUD operations with Firestore
├── types/
│   └── index.ts                # TypeScript interfaces
├── .env.local                  # Environment variables (create from example)
├── .env.local.example          # Environment template
├── service-account.json        # Vertex AI credentials (DO NOT COMMIT)
└── README.md                   # This file
```

---

## Google Cloud Credits Usage

This app uses Google Cloud credits for:

| Service | Billing |
|---------|---------|
| **Vertex AI API** (Gemini) | Uses Google Cloud credits |
| **Firebase Auth** | Free |
| **Cloud Firestore** | Free tier (50K reads/day, 20K writes/day) |

### Vertex AI Pricing (Gemini 2.0 Flash)
- Input: ~$0.075 per 1M tokens
- Output: ~$0.30 per 1M tokens
- Very affordable for demos and development

---

## Troubleshooting

### Error: "The query requires an index"
**Solution**: Create the composite index in Firestore (see Step 5)

### Error: "This API method requires billing to be enabled"
**Solution**: Enable billing on your Google Cloud project (see Step 7)

### Error: "Publisher Model was not found"
**Solution**:
1. Make sure Vertex AI API is enabled (see Step 8)
2. Check the model name in `lib/vertexai.ts` is `gemini-2.0-flash-001`
3. Restart the dev server after changes

### Error: "Firebase: Error (auth/invalid-api-key)"
**Solution**: Check your Firebase config values in `.env.local` are correct

### Error: "Unable to infer your project"
**Solution**:
1. Ensure `GOOGLE_CLOUD_PROJECT` is set in `.env.local`
2. Ensure `service-account.json` exists in project root

### Sign-in popup closes without signing in
**Solution**:
1. Check Google sign-in is enabled in Firebase Auth
2. Ensure your domain is in authorized domains (Firebase Auth → Settings)

---

## Security Notes

- **Never commit** `service-account.json` to version control
- **Never commit** `.env.local` to version control
- For production, use proper Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Gemini API Documentation](https://cloud.google.com/vertex-ai/generative-ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)

---

## License

MIT - Built for demo/educational purposes

---

## Session Information

**Session Title**: Supercharge your webapps using Firebase and Gemini
**Stack**: Next.js + Firebase + Vertex AI (Gemini)
**Goal**: Demonstrate Google Cloud credits usage with practical AI-powered application
