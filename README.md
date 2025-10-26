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
-   **Backend:** Node.js, Express
-   **AI:** Google Gemini API (`@google/genai`)

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
    -   Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key. The backend server is configured to load this variable automatically.

### Running the Application Locally

Once the installation is complete, you can start the local development server, which will run both the frontend and backend concurrently:

```bash
npm start
```

This will launch the application in your default web browser, typically at `http://localhost:3000`.

---

## Deployment

CyberGaar is a full-stack application. The frontend is a React single-page application (SPA), and the backend is a Node.js Express server.

### Build Process

First, you need to create a production-ready build of the frontend application. This process compiles and optimizes all the project files into a static `dist` folder.

```bash
npm run build
```

This command will generate the folder containing the `index.html` and all the necessary JavaScript and CSS assets.

### Hosting

When deploying, you will need to run both the backend server and serve the static frontend files.

-   **Backend:** The backend server can be run using `node server.mjs`. You should use a process manager like `pm2` to keep the server running.
-   **Frontend:** The `dist` folder can be served by a web server like Nginx.

**Important:** When deploying, you must configure your **environment variables** on your server. The backend server expects the `API_KEY` to be available as an environment variable.

### Deployment with Nginx

For self-hosting on a virtual private server (VPS), using Nginx as a reverse proxy is highly recommended. It can handle SSL termination, rate limiting, and efficiently serve the static frontend files while proxying API requests to the backend server.

An example Nginx configuration is provided in `nginx.conf.example`. This configuration serves the static files from the `dist` directory and proxies all requests to `/api/` to the backend server running on port 3001.

1.  **Copy the Nginx Configuration**

    After cloning this repository onto your server, copy the example configuration file from the project directory to Nginx's `sites-available` directory.

    ```bash
    # From within the project's root directory on your server:
    sudo cp nginx.conf.example /etc/nginx/sites-available/your-domain.com
    ```
    Remember to replace `your-domain.com` with a filename that makes sense for your setup (e.g., your actual domain).

2.  **Edit the Configuration**

    On your server, edit the new configuration file. You will need to replace the placeholder values for `server_name`, the `root` path to your project's `dist` folder, and the paths to your `ssl_certificate` and `ssl_certificate_key`.

3.  **Enable the Site and Reload Nginx**

    Create a symbolic link from `sites-available` to `sites-enabled`, test the configuration, and then reload Nginx.

    ```bash
    # Create the symlink to enable the site
    sudo ln -s /etc/nginx/sites-available/your-domain.com /etc/nginx/sites-enabled/

    # Test the Nginx configuration for syntax errors
    sudo nginx -t

    # If the test is successful, reload Nginx to apply the changes
    sudo systemctl reload nginx
    ```
