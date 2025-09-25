# Kahawa Pay ☕

A minimalist creator tipping platform allowing fans to "buy a coffee" (kahawa) for their favorite creators using M-Pesa. This project serves as a minimum viable product (MVP) and a technical demonstration, featuring a reusable React tipping widget and a secure, serverless-ready payment flow.

*A screenshot of the Kahawa Pay widget would go here, showing a clean and modern UI with a creator's profile picture and a tipping form with options for different amounts and an M-Pesa phone number input.*

---

## ✨ Core Features

*   **Reusable Tipping Widget:** A self-contained React component (`KahawaTippingWidget`) that can be easily embedded into any website.
*   **Dynamic Tip Amounts:** Users can select from preset tip amounts or enter a custom value.
*   **Secure M-Pesa Flow:** A simulated M-Pesa STK Push payment process, architected with a secure serverless backend approach.
*   **User-Friendly Interface:** A clean, responsive, and intuitive UI/UX, including a confirmation step and clear feedback on payment status.
*   **Developer-Friendly:** Written in TypeScript with a clear project structure and detailed comments.

---

## 🚀 How It Works (The User Flow)

1.  **Select Amount:** A user visiting a creator's page chooses a preset tip amount or enters a custom one.
2.  **Enter Phone Number:** The user provides their M-Pesa-registered phone number (e.g., `712345678`).
3.  **Confirm Payment:** A confirmation modal appears, summarizing the amount and phone number to prevent errors.
4.  **Initiate STK Push:** Upon confirmation, the frontend securely calls a serverless backend endpoint.
5.  **Backend Processing:** The serverless function validates the request and (in a real-world scenario) communicates with the Safaricom Daraja API to trigger an STK push.
6.  **User Authorizes:** The user receives a push notification on their phone and enters their M-Pesa PIN to approve the transaction.
7.  **Feedback:** The UI updates to show a success or error message based on the simulated outcome.

---

## 🔐 Security & Backend Architecture

Security is paramount in any payment system. This project has been refactored from a client-side-only simulation to a more robust and secure architecture using a serverless backend.

**Why a Serverless Backend?**

*   **Prevents Client-Side Manipulation:** The original client-side logic was vulnerable. A malicious user could alter the payment `amount` or `creatorId` in their browser's developer tools before the transaction was processed.
*   **Secure Credential Storage:** By moving the payment logic to a backend function, sensitive information like API keys (`MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`) can be stored securely as environment variables, completely inaccessible to the client's browser.
*   **Server-Side Validation:** The backend now serves as the single source of truth, performing its own validation on all incoming requests from the frontend.

The payment initiation logic now resides in `backend/mpesaLogic.ts`, which is designed to be deployed as a serverless function (e.g., on Vercel, Netlify, or AWS Lambda).

---

## 🛠️ Tech Stack

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **Backend:** Serverless Functions (Node.js runtime, simulated)
*   **Payment Gateway:** M-Pesa (via Daraja API simulation)
*   **Tooling:** esbuild/Vite (implied by the modern module setup)

---

## 📂 Project Structure

```
.
├── backend/
│   └── mpesaLogic.ts   # Serverless function logic for M-Pesa STK push
├── components/
│   ├── icons/          # SVG icon components
│   └── KahawaTippingWidget.tsx # The main UI component
├── services/
│   └── mpesaService.ts # Frontend service to call the backend
├── types.ts            # TypeScript type definitions
├── constants.ts        # App-wide constants
├── App.tsx             # Main application component
├── index.html          # Entry HTML file
└── README.md           # You are here!
```

---

## 🚀 Getting Started

This project is designed to run out-of-the-box in a modern web development environment that supports ES modules and JSX/TSX.

1.  Unzip the project files into a directory.
2.  Open the `index.html` file in your web browser.

For a more robust development setup:

1.  **Prerequisites:** Ensure you have Node.js installed.
2.  **Initialize a project:**
    ```bash
    npm init -y
    # Add a simple dev server, for example:
    npm install --save-dev vite
    ```
3.  **Update `package.json` scripts:**
    ```json
    "scripts": {
      "dev": "vite",
      "build": "vite build"
    }
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This will start the app on a local server, typically `http://localhost:5173`.

---

## 🔮 Future Enhancements

*   **Real-time Payment Status:** Implement a webhook endpoint on the backend to receive real-time updates from the M-Pesa API (e.g., `Completed`, `Cancelled`) and update the UI via WebSockets or polling.
*   **Creator Dashboard:** A dedicated dashboard for creators to view their earnings, see a list of supporters, and manage their profile.
*   **Additional Payment Methods:** Integrate Stripe or PayPal to cater to an international audience.
*   **Authentication:** Allow creators to sign up and manage their accounts.

---

## 📄 License

This project is licensed under the MIT License.
