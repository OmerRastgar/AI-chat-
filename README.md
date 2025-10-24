# CyberGaar - AI-Powered Cybersecurity Assistant

CyberGaar is a sophisticated web application designed to be an AI-powered partner for navigating the complexities of cybersecurity. It features an expert-tuned large language model, real-time source verification, and domain-specific intelligence to provide accurate and actionable insights.

![CyberGaar Screenshot](https://storage.googleapis.com/aistudio-project-images/b48d2874-9548-4384-a14a-71424e6c1e57.png)

## Core Features

-   **Expert AI Chat:** Engage in a conversation with an AI specializing in various cybersecurity frameworks like NIST, ISO, SOC2, and more.
-   **RAG-Powered Verification:** Utilizes Retrieval-Augmented Generation (RAG) with Google Search to ground answers in real-time, verifiable sources, ensuring up-to-date and accurate responses.
-   **Comprehensive Policy Generator:** A step-by-step tool to generate professional, detailed cybersecurity policies tailored to your organization's specific needs, size, and industry.
-   **Modern UI/UX:** A sleek, responsive interface with both dark and light themes for a comfortable user experience.
-   **Dynamic & Responsive:** Fully responsive design that works seamlessly on desktop and mobile devices, featuring a collapsible sidebar for customizable screen real estate.

## Tech Stack

-   **Frontend:** React, TypeScript, Tailwind CSS
-   **AI & Backend:** Google Gemini API (`@google/genai`) for language model capabilities.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   **Node.js & npm:** You'll need Node.js installed on your computer, which includes npm (Node Package Manager). You can download it from [nodejs.org](https://nodejs.org/).
-   **Google Gemini API Key:** You must have a valid API key for the Google Gemini API. You can obtain one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation

1.  **Clone the Repository**
    Open your terminal and clone the project repository to your local machine:
    ```bash
    git clone https://github.com/your-username/cybergaar.git
    cd cybergaar
    ```

2.  **Install Dependencies**
    Install the necessary project dependencies using npm:
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    The application requires your Google Gemini API key to function.
    -   Create a new file named `.env` in the root directory of the project.
    -   Open the `.env` file and add your API key in the following format:
        ```
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    -   Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key. The application is configured to load this variable automatically.

### Running the Application Locally

Once the installation is complete, you can start the local development server. Most modern JavaScript projects use a command like this:

```bash
npm start
```
or if you are using a tool like Vite:
```bash
npm run dev
```

This will launch the application in your default web browser, typically at an address like `http://localhost:3000` or `http://localhost:5173`.

---

## Deployment

CyberGaar is a static single-page application (SPA), making it easy to deploy to various hosting services.

### Build Process

First, you need to create a production-ready build of the application. This process compiles and optimizes all the project files into a static `dist` or `build` folder.

```bash
npm run build
```

This command will generate the folder containing the `index.html` and all the necessary JavaScript and CSS assets.

### Hosting

You can deploy the contents of the generated `dist` (or `build`) folder to any static hosting provider. Popular choices include:

-   [Vercel](https://vercel.com/)
-   [Netlify](https://www.netlify.com/)
-   [GitHub Pages](https://pages.github.com/)

**Important:** When deploying, you must configure your **environment variables** in your hosting provider's dashboard. Add a variable with the key `API_KEY` and set its value to your Google Gemini API key. This is crucial for the deployed application to be able to make calls to the Gemini API.
