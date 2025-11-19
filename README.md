# Vite React Shadcn UI Admin Dashboard

This project is a modern, responsive administrative dashboard built with React, TypeScript, Vite, and styled using Tailwind CSS and `shadcn/ui` components. It provides a comprehensive overview with key statistics, interactive charts, and robust data management capabilities.

## Features

*   **Modern Tech Stack:** Built with React, TypeScript, and Vite for a fast and efficient development experience.
*   **Sleek UI:** Utilizes `shadcn/ui` components and Tailwind CSS for a beautiful, accessible, and responsive user interface.
*   **Client-Side Routing:** Seamless navigation with `react-router-dom`.
*   **Efficient Data Management:** Powered by `@tanstack/react-query` for data fetching, caching, and synchronization.
*   **Interactive Data Visualization:** Features interactive charts (powered by `recharts`) to display key performance indicators (KPIs), productivity trends, and project statuses.
*   **Robust Form Handling:** Manages forms and validation with `react-hook-form` and `zod`.
*   **Dashboard Overview:** Provides a comprehensive administrative dashboard with key statistics, productivity charts, status charts, and project status cards.
*   **Modular Structure:** Organized into logical components, hooks, and pages for maintainability and scalability.
*   **Theming:** Supports light and dark modes for enhanced user experience.

## Getting Started

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/273420e4-f822-4c49-8689-fb6479ad82a0) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE (Local Development)**

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

## Project Structure

The project follows a standard React application structure:

*   `public/`: Static assets.
*   `src/`: Main application source code.
    *   `api/`: (If applicable) API service definitions.
    *   `components/`: Reusable UI components, including `shadcn/ui` and custom dashboard components.
    *   `hooks/`: Custom React hooks.
    *   `lib/`: Utility functions.
    *   `pages/`: Top-level components representing different views/routes (e.g., Dashboard, Users, Settings).
    *   `App.tsx`: Main application component, sets up routing.
    *   `main.tsx`: Entry point for the React application.
    *   `index.css`: Global styles and Tailwind CSS directives.

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in your browser. The page will reload if you make edits.
*   `npm run build`: Builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
*   `npm run build:dev`: Builds the app for development mode.
*   `npm run lint`: Runs ESLint to check for code quality issues.
*   `npm run preview`: Serves the production build locally for previewing.

## Deployment

Simply open [Lovable](https://lovable.dev/projects/273420e4-f822-4c49-8689-fb6479ad82a0) and click on Share -> Publish.

## Custom Domain

Yes, you can connect a custom domain to your Lovable project!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)