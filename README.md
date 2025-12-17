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
![WhatsApp Image 2025-12-17 at 15 23 22_c3254c14](https://github.com/user-attachments/assets/933b4088-164c-48d3-8b4c-4aa9d5fef77b)
![WhatsApp Image 2025-12-17 at 15 31 21_c959279d](https://github.com/user-attachments/assets/5b20396e-bf67-446c-ad90-2306245238f6)
![WhatsApp Image 2025-12-17 at 15 34 19_2f0b326d](https://github.com/user-attachments/assets/fea7e101-0718-4605-8b4f-42c8b9c6e2f0)
![WhatsApp Image 2025-12-17 at 15 38 52_0dc5b1dd](https://github.com/user-attachments/assets/f07816c3-e6f0-42a0-aa98-029d457d76b2)
![WhatsApp Image 2025-12-17 at 15 40 03_458ac169](https://github.com/user-attachments/assets/1ad2f088-a800-4cbf-848e-f859d74c3384)




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
