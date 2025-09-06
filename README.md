<h1 align="center">
  <br>
  User Authentication System (MERN) 🔐
  <br>
</h1>

<p align="center">
  A secure MERN authentication system with user registration, email verification, login, logout, password reset, profile management, and OAuth integration.
</p>

| Register Page                                                                   | Login Page                                                                |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| <img src="./client/public/registerPage_ss.png" alt="Register Page" width="400"> | <img src="./client/public/loginPage_ss.png" alt="Login Page" width="400"> |

## 🌟 Features

- **User Registration** 📝: Register new users with name, email, and password.
- **Email Verification** ✉️: Send verification emails for account activation.
- **Secure Login** 🔒: Authenticate users via email/password using JWT (JSON Web Tokens).
- **OAuth Integration** 🔗: Login with Google and GitHub using Passport.js.
- **Forgot Password** 🔑: Request a password reset link via email.
- **Reset Password** 🔄: Securely reset passwords using a time-limited token.
- **Logout** 🚪: Invalidate JWT tokens to log users out securely.
- **Password Hashing** ⚡: bcrypt-based hashing for secure password storage.
- **Email Notifications** 📧: Nodemailer-powered emails for verification and password resets.
- **Responsive UI** 📱: Built with Tailwind CSS for a responsive and visually appealing interface.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Tanstack Query, React Router
- **Backend**: Node.js with Express – RESTful API structure
- **Database**: MongoDB with Mongoose – flexible document-based storage
- **Email Service**: Nodemailer
- **SMTP Server**: Brevo
- **OAuth**: Passport.js with Google and GitHub strategies

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)
- Google OAuth Client ID & Secret
- GitHub OAuth Client ID & Secret

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/soumadip-dev/AuthSystem-MERN.git
   cd AuthSystem-MERN
   ```

2. **Backend Setup**

   ```bash
   cd server
   npm install
   ```

   Create a `.env` file in the `server` directory with:

   ```env
   PORT=8080
   MONGO_URI=<YOUR_MONGODB_URI>
   BASE_URL=http://127.0.0.1:8080
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   BREVO_HOST=smtp.brevo.com
   BREVO_PORT=587
   BREVO_USERNAME=<your_email_address>
   BREVO_PASSWORD=<your_email_password>
   BREVO_SENDEREMAIL=<your_email_address>
   JWT_SECRET=<your_secret_key>
   GOOGLE_CLIENT_ID=<your_google_client_id>
   GOOGLE_CLIENT_SECRET=<your_google_client_secret>
   GITHUB_CLIENT_ID=<your_github_client_id>
   GITHUB_CLIENT_SECRET=<your_github_client_secret>
   ```

3. **Frontend Setup**

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory with:

```env
VITE_BACKEND_URL=<YOUR_BACKEND_URL>
VITE_FRONTEND_URL=<YOUR_FRONTEND_URL>
```

4. **OAuth Setup** 🔧

   - **Google OAuth**:

     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new project or select existing one
     - Configure OAuth consent screen
     - Create credentials (OAuth Client ID)
     - Add authorized redirect URIs: `http://localhost:8080/api/auth/google/callback`

   - **GitHub OAuth**:
     - Go to [GitHub Developer Settings](https://github.com/settings/developers)
     - Create a new OAuth App
     - Set Authorization callback URL: `http://localhost:8080/api/auth/github/callback`

5. **Run the Application** 🚀
   - Backend (Terminal 1):
     ```bash
     cd server
     npm run dev
     ```
   - Frontend (Terminal 2):
     ```bash
     cd ../client
     npm run dev
     ```
