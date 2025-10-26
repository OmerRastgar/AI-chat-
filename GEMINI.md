This application has two main features:

1.  **Chat:** This feature provides a chat interface where users can interact with a fine-tuned Large Language Model (LLM).
2.  **Policy Generation:** This feature helps users generate security and compliance policies tailored to their specific domain and company requirements.

## Technology Stack

*   **Frontend:** React, TypeScript, Webpack
*   **Backend:** Node.js, Express
*   **Key Libraries:** `@google/genai`, `cors`, `dotenv`
*   **Build/Dev Tools:** `webpack`, `webpack-dev-server`, `ts-loader`, `npm-run-all`

## Project Structure and Key Files

*   `GEMINI.md`: This file, providing an overview of the application for the agent.
*   `package.json`: Defines scripts and dependencies. The main script is `start`.
*   `webpack.config.js`: Webpack configuration for the frontend build.
*   `server.mjs`: The backend Express server, which handles API requests.
*   `App.tsx`: The main React application component.
*   `components/`: Contains reusable React components that make up the UI.
*   `templates/`: Contains markdown templates for the policy generation feature.
*   `.env.example`: Shows the required environment variables (e.g., for API keys).

## Setup and Running the Application

The application is set up as a monorepo with a React frontend and a Node.js backend.

To run the application, use the following command:

```bash
npm start
```

This command executes `npm-run-all` to start both the frontend development server and the backend server concurrently.

If you get stuck, reviewing `package.json` for scripts and dependencies, `webpack.config.js` for the build process, and `server.mjs` for backend logic is a good starting point.