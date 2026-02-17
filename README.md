# PaisaWaisa - Personal Finance Tracker 💰

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

**Live Demo:** [https://paisawaisaa.netlify.app/](https://paisawaisaa.netlify.app/)

PaisaWaisa is a unified personal finance platform designed to make tracking money simple, social, and insightful. Beyond just logging expenses, it allows you to manage shared household finances, split bills with friends, and visualize your financial health with advanced analytics.

## ✨ Features

### 的核心 Core Banking & Tracking
-   **📊 Interactive Dashboard**: Real-time overview of your total balance, income, and expenses.
-   **💬 Funny Financial Quotes**: Rotating Hinglish quotes to keep finance fun.
-   **📝 Transaction Management**: Easily add, edit, and delete transactions.
-   **🔍 Smart Filtering**: Sort transactions by type (Income/Expense) and category.

### 👥 Social Finance (New!)
-   **🏠 Family Circle**: Invite family members to a shared space. Track household spending together in real-time.
-   **💸 Split Expenses**: Split bills with friends or family. Track who paid what and settle debts easily.
-   **🔔 Real-time Notifications**: Get alerted when someone adds a family expense or requests a split.

### 📈 Reports & Insights
-   **📅 GitHub-Style Heatmap**: Visualize your spending intensity over the year.
-   **🍩 Category Breakdown**: Interactive Pie charts to see where your money goes.
-   **📊 Monthly Trends**: Bar charts to compare spending month-over-month.
-   **💰 Net Worth & Savings Rate**: Auto-calculated financial health metrics.

### 🎨 User Experience
-   **🌓 Dark/Light Mode**: Fully theme-aware UI.
-   **📱 Responsive Design**: Works perfectly on mobile, tablet, and desktop.
-   **🔐 Secure Authentication**: Powered by Firebase (Email/Password + Google).

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), TailwindCSS
-   **Backend**: Firebase (Auth, Firestore)
-   **Charts**: Recharts
-   **Icons**: Lucide React
-   **Deployment**: Netlify

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
