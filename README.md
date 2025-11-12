# Todo App

This is a comprehensive Todo application built with a modern tech stack. It allows users to manage their tasks through a kanban-style board interface.

## Project Structure

The project follows a standard Next.js application structure.

```
/
├── .env                # Environment variables
├── components/         # Shared UI components
│   ├── molecules/      # Complex components (feature, footer, hero, etc.)
│   └── ui/             # Basic UI elements (card, loading, etc.)
├── lib/                # Libraries and helper functions (Supabase client)
├── public/             # Static assets (images, icons)
├── redux/              # Redux store and slices
├── routes/             # Route protection and providers
├── schemas/            # Zod validation schemas
├── src/app/            # Next.js App Router pages and API routes
│   ├── (pages)/        # Page routes (dashboard, board, profile, etc.)
│   └── api/            # API endpoints
└── types/              # TypeScript type definitions
```

## Features

*   **User Authentication:** Secure user registration and login.
*   **Dashboard:** A central hub to view and manage boards.
*   **Kanban Board:** Drag-and-drop interface to manage tasks across different lists (e.g., Todo, In Progress, Done).
*   **Task Management:** Create, view, and manage individual tasks.
*   **AI-Powered Features:** Utilizes generative AI for certain functionalities.
*   **Profile Management:** Users can manage their profiles.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/) (with App Router & Turbopack)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/)
*   **Database & Auth:** [Supabase](https://supabase.io/)
*   **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
*   **Drag & Drop:** [dnd-kit](https://dndkit.com/)
*   **Form Handling:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
*   **AI:** [Google Generative AI](https://ai.google.dev/) / [OpenAI](https://openai.com/)

## Prerequisites

*   [Bun](https://bun.sh/docs/installation) (or Node.js and npm/yarn)
*   A Supabase project for database and authentication.
*   API keys for Google Generative AI or OpenAI.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://your-repository-url.git
    cd app-todo
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add the necessary environment variables. See the [Environment Variables](#environment-variables) section for details.

4.  **Run the development server:**
    ```bash
    bun run dev
    ```

    The application will be available at `http://localhost:3000`.

## API Endpoints

The primary API endpoint is used for AI-powered content generation.

*   `POST /api/generate`: Accepts a prompt and uses a generative AI model to produce content.

## Environment Variables

You need to create a `.env` file in the project root and add the following variables. You can get the Supabase URL and keys from your project's dashboard under `Project Settings > API`.

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Generative AI
GOOGLE_API_KEY=your_google_api_key
```