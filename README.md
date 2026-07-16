# Interfaith Scripture Academy 📖✨

An interactive scripture reader and interfaith search tool for browsing, exploring, and comparing holy texts across major world religions. Designed for academic research, spiritual exploration, and comparative theology.

---

## 🚀 Features

- **Multi-Faith Library**: Access scripture across major world religions (Hinduism, Buddhism, Christianity, Islam, Judaism, and more).
- **Interfaith Search**: Search for terms or verses across multiple holy texts simultaneously.
- **Durable Cloud Sync**: Built-in support for bookmarking, private reflection notes, custom collections, and book metadata stored in Cloud Firestore.
- **Secure Database Migration**: Features an administrative panel allowing secure data synchronization from legacy Firestore database schemas into the new active `interfaith-108` instance.
- **Media Settings & Gallery**: Custom book cover images, audio cache management, and full gallery integration.

---

## ⚙️ Setup & Installation

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+) installed on your local machine.

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-github-repo-url>
cd interfaith-scripture-academy

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="your-app-url"
```

### 3. Running the App

To start the local development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 🔧 Deployment

### Exporting to GitHub from AI Studio

If you encounter errors when exporting this app from **Google AI Studio** to your **GitHub** repository, follow these quick resolutions:

#### Issue A: Conflict with an existing or pre-initialized repository
**Cause**: The GitHub repository you are pushing to already contains files (like a `README.md`, `.gitignore`, or License) created on GitHub.
**Solution**:
1. Create a **brand new, completely empty** repository on GitHub.
2. **Do NOT** check "Initialize this repository with a README", "Add .gitignore", or "Choose a license" when creating it.
3. Use the **Export to GitHub** flow in AI Studio and point it to this clean, empty repository.

#### Issue B: Insufficient GitHub Permissions
**Cause**: The OAuth connection or personal access token does not have write permissions for your repositories.
**Solution**:
1. Go to your GitHub account settings -> Applications -> Authorized OAuth Apps.
2. Ensure **Google AI Studio** (or the respective integration) has full `repo` (write) permissions.
3. If using a personal token, make sure it has the `repo` scope checked.

---

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS, Lucide Icons, Framer Motion
- **Database**: Google Cloud Firestore (Firebase)
- **Deployment**: Google Cloud Run / GitHub Pages
