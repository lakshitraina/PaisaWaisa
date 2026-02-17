# PaisaWaisa - Personal Finance Tracker 💰

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)

PaisaWaisa is a modern, clean, and intuitive Personal Finance Tracker capable of tracking your income and expenses in real-time. Built with React.js and powered by Firebase, it offers a seamless experience with data visualization and secure authentication.

## ✨ Features

-   **📊 Dashboard**: Get a quick overview of your total balance, income, and expenses.
-   **📈 Visual Analytics**: Interactive charts to visualize your spending patterns by category.
-   **🔐 Secure Authentication**: Sign up and login securely using Firebase Authentication.
-   **📝 Transaction Management**: Easily add, edit, and delete transactions.
-   **🔍 Smart Filtering**: Filter transactions by type (Income/Expense) and category.
-   **🌓 Dark/Light Mode**: Toggle between themes for a comfortable viewing experience.
-   **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), TailwindCSS
-   **Backend (BaaS)**: Firebase (Auth, Firestore)
-   **Charts**: Recharts
-   **Icons**: Lucide React

## 🚀 Getting Started

Follow these steps to get a local copy up and running.

### Prerequisites

-   Node.js (v14 or higher)
-   npm (v6 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/lakshitraina/PaisaWaisa.git
    cd paisawaisa
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the root directory and add your Firebase configuration:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4.  **Run the application**
    ```bash
    npm run dev
    ```

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
├── context/          # React Context (Auth, Theme)
├── lib/              # Utility functions and Firebase config
├── pages/            # Application pages (Dashboard, Login, etc.)
├── App.jsx           # Main application entry
└── main.jsx          # DOM rendering
```

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

> Built with ❤️ by Lakshit Raina
