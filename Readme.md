# TrueLink

A full-stack web application for managing reminders, rituals, friends, and personal notifications. Built for seamless collaboration and personal productivity.

---

## Features

- User registration, login, and profile management
- Add, edit, and delete friends
- Create, edit, and delete reminders for yourself or friends
- Create, edit, and delete rituals (recurring events) with friend selection
- Dashboard with upcoming reminders, rituals, and notifications
- Email notifications for reminders and rituals (with timezone support)
- Personal details: interests, life events, conversation histories
- Timezone and date of birth support in user profiles
- Responsive, modern UI with Tailwind CSS

---

## Tech Stack

See [TECH-STACK.md](./TECH-STACK.md) for a detailed list.

- React, Zustand, Vite, Tailwind CSS (Frontend)
- Node.js, Express.js, MongoDB, Mongoose, JWT, Nodemailer, node-cron (Backend)

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (local or cloud)

### Setup

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd TrueLink
   ```

2. **Install dependencies:**
   ```sh
   cd client && npm install
   cd ../server && npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` in the `server` folder and fill in your MongoDB URI, JWT secret, and SMTP credentials for email notifications.

4. **Run the backend:**
   ```sh
   cd server
   npm start
   ```

5. **Run the frontend:**
   ```sh
   cd client
   npm run dev
   ```

6. **Access the app:**
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Folder Structure

```
TrueLink/
  client/    # React frontend
  server/    # Node.js/Express backend
```

---

## Environment Variables (Backend)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT authentication
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL` - For email notifications

---

## License
MIT

---

## Credits
Created by the TrueLink team for Ideathon 2025.
