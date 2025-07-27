# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5401089f-4a47-49e7-9f50-74110204007a

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5401089f-4a47-49e7-9f50-74110204007a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5401089f-4a47-49e7-9f50-74110204007a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## Claude Code CLI Integration

Cardshow/CRD works great with Anthropic’s **Claude Code** CLI for large–scale refactors, multi-file edits, and advanced git workflows.

### Installation & Usage

```bash
# 1  Install globally
npm install -g @anthropic-ai/claude-code

# 2  From the project root
claude            # starts an interactive Claude session
```

### Authentication Options

1. **Browser OAuth** (default) – Anthropic Console
2. **Claude App** – if you have Pro/Max
3. **API Key** – set `ANTHROPIC_API_KEY`

### Recommended Workflow inside Cursor

1. Open Cursor’s integrated terminal.
2. Run `claude` and let it index the repo.
3. Keep Cursor’s inline AI for small changes, use Claude Code for repo-wide tasks.

### Helper Scripts

After running `npm run dev:ai` (see _package.json_) the CLI starts automatically in the correct directory with environment variables loaded.
