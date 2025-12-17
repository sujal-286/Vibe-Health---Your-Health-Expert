# Vibe Health

**Vibe Health** is an advanced AI-powered health monitoring and lifestyle analysis application. It uses Google's **Gemini 1.5 Flash** model to synthesize nutrition, sleep, stress, and activity data into a holistic "Vibe Score" and actionable insights.

## Features

*   **Daily Vibe Score**: A consolidated 0-100 metric for your overall wellness.
*   **Contextual Analysis**:
    *   **Meal Analysis**: Log meals using natural language (e.g., "Salmon and quinoa bowl") to get estimated macros and health scores.
    *   **Audio Vibe**: Voice biomarker analysis to detect emotional state and stress levels.
    *   **Diagnostics**: Standardized tests (GAD-7, PHQ-9, Sleep Index) with AI-powered professional recommendations.
*   **AI Chat Therapist**: A compassionate chatbot grounded with Google Maps to find nearby health professionals.
*   **Privacy First**: All personal data is stored locally in your browser.

## Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI**: Google Gemini API (@google/genai)
*   **Visualization**: Recharts
*   **Icons**: Lucide React
*   **Build Tool**: Vite

## Setup & Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/vibe-health.git
    cd vibe-health
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory and add your Google Gemini API Key:
    ```env
    API_KEY=your_actual_api_key_here
    ```
    > **Note:** You can obtain an API key from [Google AI Studio](https://aistudio.google.com/).

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

## Usage

1.  **Onboarding**: Enter your basic profile, activity level, and medical history.
2.  **Dashboard**: View your daily breakdown.
3.  **Log Data**: Use the Meal Tracker or Sleep Analysis tools to populate your dashboard.
4.  **Generate Report**: Click "Generate Initial Report" on the dashboard to trigger the AI analysis based on your inputs.

## License

MIT
