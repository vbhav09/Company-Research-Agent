Company Research Agent

An AI-powered research application that collects, analyzes, and summarizes publicly available company information. It helps users quickly understand a company’s profile, products, services, competitors, industry position, and key business insights.

Public Deployment

Live Application:https://relu-consultancy-company-research-agent.ai.studio

Features

AI-generated company overview

Products and services analysis

Competitor identification

Industry and market insights

Company strengths and risks

Structured business research reports

Fast and user-friendly research workflow

Google Gemini integration

Publicly accessible deployment

Use Cases

Company research

Competitor analysis

Sales prospect research

Business intelligence

Investment research

Recruitment research

Startup analysis

Academic research

Tech Stack

Google AI Studio

Google Gemini API

Large Language Models

JavaScript or TypeScript

HTML and CSS

REST APIs

Web search and data-processing tools

How It Works

The user enters a company name or website.

The application processes the research request.

Public company information is collected.

Gemini analyzes and summarizes the information.

A structured company research report is displayed.

Getting Started

Prerequisites

Install the following:

Node.js 18 or later

npm

Git

A Google Gemini API key

Installation

1. Clone the repository

git clone https://github.com/YOUR_USERNAME/company-research-agent.git

2. Open the project directory

cd company-research-agent

3. Install dependencies

npm install

4. Configure environment variables

Create a .env file in the project root.

Linux or macOS:

cp .env.example .env

Windows Command Prompt:

copy .env.example .env

Add your API keys to the .env file.

5. Start the development server

npm run dev

Open the local URL displayed in the terminal, usually:

http://localhost:5173

Environment Variables

Example:

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
SEARCH_API_KEY=your_search_api_key
SEARCH_ENGINE_ID=your_search_engine_id
APP_URL=http://localhost:5173

Variable Reference

Variable

Required

Description

GEMINI_API_KEY

Yes

API key used to access Google Gemini

GEMINI_MODEL

No

Gemini model used by the application

SEARCH_API_KEY

Conditional

API key for an external search provider

SEARCH_ENGINE_ID

Conditional

Search engine identifier

APP_URL

No

Local or production application URL

For Vite frontend projects, the Gemini variable may need to be named:

VITE_GEMINI_API_KEY=your_gemini_api_key

Only document environment variables that are actually used by your source code.

Security

Never upload your real .env file or API keys to GitHub.

Use .env.example to document required variables without including secret values.

For production applications, process Gemini requests through a secure backend whenever possible. Frontend environment variables can be exposed to users.

Available Scripts

npm run dev

Starts the development server.

npm run build

Creates a production build.

npm run preview

Previews the production build locally.

npm run lint

Checks the code for quality and formatting issues.

Available scripts depend on the project’s package.json.

Suggested Project Structure

company-research-agent/
├── public/
├── src/
│   ├── components/
│   ├── services/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
└── README.md

Deployment

Current public deployment:

https://relu-consultancy-company-research-agent.ai.studio

General deployment steps:

Push the source code to GitHub.

Import the repository into a hosting platform.

Add the required environment variables.

Run the production build command.

Deploy the application.

Possible platforms:

Google AI Studio

Vercel

Netlify

Firebase Hosting

Render

Limitations

Research quality depends on publicly available information.

AI-generated information may contain inaccuracies.

Private companies may have limited public data.

API requests may be subject to rate limits.

Important details should be verified using official sources.

Future Improvements

PDF report export

Company comparison

Financial analysis

Source citations

Research history

Interactive charts

Real-time news monitoring

Authentication

Saved reports

CRM integration

Multi-language support

Suggested GitHub Description

AI-powered Company Research Agent built with Google AI Studio and Gemini for company profiling, competitor research, and business intelligence.

Suggested GitHub Topics

artificial-intelligence company-research gemini-api google-ai-studio generative-ai llm business-intelligence market-research competitor-analysis ai-agent

Disclaimer

This application provides AI-generated research based on publicly available information. Generated content may contain inaccurate or incomplete details. Verify important information using official and reliable sources.

License

This project is intended for educational and portfolio purposes. You may add an open-source license such as the MIT License.
