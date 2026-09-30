# Real-Time Chat App

A full-stack real-time chat application built with the MERN stack, TypeScript and Socket.IO.

- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT, Zod
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Axios, socket.io-client

---

## Features

**Chat**
- One-to-one real-time messaging
- Text, image and file messages (2 MB limit, type whitelist)
- Message status ticks: sent, delivered, read
- Typing indicator
- Online / offline presence with last seen
- Multi-tab support (every tab of a user stays in sync)
- Delete your own messages (soft delete, synced live)
- Infinite scroll for older messages
- Unread counters per conversation

**Users**
- Register, login, persistent session (JWT, 7 days)
- Search users and start a chat
- Edit profile name and picture

**Notifications**
- Live in-app notifications
- Unread badge, mark one or all as read

**Moderation**
- Report a user or a specific message
- Admin dashboard with stats, user list, block / unblock and report review
- Blocking a user disconnects their live sockets immediately

---

## Project Structure

```
chat-app/
├── backend/
│   ├── src/
│   │   ├── configs/          database connection
│   │   ├── constants/        auth, chat limits, socket event names
│   │   ├── controllers/      auth, user, conversation, message, notification, report, admin
│   │   ├── enums/            user, message, notification, report
│   │   ├── helper/           asyncHandler, response helpers, AppError, error handler
│   │   ├── interfaces/       TypeScript interfaces and Express type augmentation
│   │   ├── middleware/       authentication, authorization, zod validate, upload
│   │   ├── models/           user, conversation, message, notification, report
│   │   ├── routes/           one router per resource plus index
│   │   ├── scripts/          seed.ts (creates the admin user)
│   │   ├── sockets/          socket auth and chat event handlers
│   │   ├── utils/            token, online users, conversation helpers
│   │   ├── validators/       zod schemas
│   │   └── server.ts
│   ├── uploads/              uploaded files (git-ignored)
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── api/              axios instance and one <resource>.api.ts per resource
    │   ├── components/
    │   │   ├── layout/       Layout, Navbar
    │   │   ├── route/        ProtectedRoute, RoleRoute
    │   │   ├── ui/           Button, Card, Badge, Input, Loader, Modal, EmptyState
    │   │   ├── chat/         Sidebar, MessageList, MessageBubble, MessageInput ...
    │   │   ├── notification/ NotificationBell
    │   │   ├── profile/      ProfileModal
    │   │   ├── common/       Avatar, MessageStatusTicks
    │   │   └── admin/        StatsCards, UsersTable, ReportsTable
    │   ├── context/          Auth, Socket, Chat, Notification providers
    │   ├── hooks/            useDebounce, useTyping, useAutoScroll
    │   ├── pages/            ChatPage, AdminPage, NotFound, auth/Login, auth/Register
    │   ├── types/            all enums and interfaces
    │   ├── utils/            format helpers, server URL helpers
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env.example
    └── package.json
```

---

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally, or a MongoDB Atlas connection string

---

## Getting Started

### 1. Clone and open the project

```bash
git clone https://github.com/Anugrah2303/real_time_chat_app
cd real_time_chat_app
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=replace_with_a_long_random_string
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Admin@123
```

Create the admin user (run once) and start the server:

```bash
npm run seed
npm run dev
```

The API is now available at `http://localhost:5000/api` and the health check at `http://localhost:5000/api/health`.

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173`.

### 4. Try it

1. Register two users in two different browsers (or one normal and one private window).
2. Search for the other user and start a chat.
3. Send messages, images and files.
4. Log in as the admin (`ADMIN_EMAIL` / `ADMIN_PASSWORD`) and open `/admin`.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Server port. Defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign tokens. Use a long random value. |
| `CLIENT_URL` | No | Frontend origin allowed by CORS and Socket.IO. Defaults to `http://localhost:5173`. |
| `ADMIN_EMAIL` | No | Used by `npm run seed`. Defaults to `admin@example.com`. |
| `ADMIN_PASSWORD` | No | Used by `npm run seed`. Defaults to `Admin@123`. |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Backend API base URL including `/api`. The socket and file URLs are derived from it by removing the trailing `/api`. |

---

## Scripts

### Backend

| Command | Description |
| --- | --- |
| `npm run dev` | Start with nodemon and ts-node. |
| `npm run build` | Compile TypeScript to `dist/`. |
| `npm start` | Run the compiled server from `dist/`. |
| `npm run seed` | Create the admin user. |

### Frontend

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server. |
| `npm run build` | Type-check and build for production. |
| `npm run lint` | Run oxlint. |
| `npm run preview` | Preview the production build. |

---

## REST API

Base path: `/api`. Every response uses this shape:

```json
{ "success": true, "message": "Text", "data": {} }
```

Errors return `{ "success": false, "message": "Text" }`. Protected routes need the header `Authorization: Bearer <token>`.

### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create an account. Body: `name`, `email`, `password`. |
| POST | `/auth/login` | Log in. Body: `email`, `password`. |
| GET | `/auth/me` | Current user. |

### Users

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/users?q=` | Search users (max 20). |
| GET | `/users/:id` | Get one user. |
| PUT | `/users/me` | Update name and profile image. |

### Conversations

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/conversations` | My conversations with last message and unread count. |
| POST | `/conversations` | Open or create a chat. Body: `userId`. |

### Messages

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/messages/upload` | Upload a file (multipart, field `file`). |
| GET | `/messages/:conversationId?limit=30&before=ISO_DATE` | Paginated history, oldest first. |
| DELETE | `/messages/:id` | Delete your own message. |

### Notifications

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/notifications` | My notifications and unread count. |
| PATCH | `/notifications/read-all` | Mark all as read. |
| PATCH | `/notifications/:id/read` | Mark one as read. |

### Reports

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/reports` | Body: `reportedUserId`, optional `messageId`, `reason` (1 to 300 characters). |

### Admin (admin role only)

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/admin/stats` | Totals for users, blocked users, messages, open reports and online users. |
| GET | `/admin/users` | All users. |
| PATCH | `/admin/users/:id/block` | Block or unblock a user. |
| GET | `/admin/reports` | All reports with details. |
| PATCH | `/admin/reports/:id/resolve` | Mark a report as resolved. |

---

## Socket.IO

Connect with the JWT after login:

```ts
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { auth: { token } });
```

### Client to server

| Event | Payload | Notes |
| --- | --- | --- |
| `message:send` | `{ receiverId, messageType, content, fileName }` | Uses an ack callback returning `{ success, message, data? }`. Text is 1 to 2000 characters. For files, upload first and send the returned URL as `content`. |
| `message:read` | `{ conversationId }` | Marks messages in that conversation as read. |
| `typing` | `{ to, isTyping }` | Typing indicator for another user. |

### Server to client

| Event | Payload |
| --- | --- |
| `message:new` | Message (sent to the sender's tabs and the receiver) |
| `message:deleted` | `{ id, conversationId }` |
| `messages:status` | `{ by, status, conversationId? }` |
| `typing` | `{ from, isTyping }` |
| `presence` | `{ userId, online, lastSeen? }` |
| `online-list` | Array of online user ids, sent right after connecting |
| `notification:new` | Notification |

---

## How It Works

1. **Login:** the frontend stores the JWT in `localStorage` and sends it on every REST call through an Axios interceptor.
2. **Session restore:** on page load the app calls `GET /auth/me` to confirm the token is still valid.
3. **Socket connection:** after login the frontend opens one Socket.IO connection, authenticated with the same JWT. Every user joins a private room named after their user id, so events reach all of their open tabs.
4. **Sending a message:** the client emits `message:send`. The server validates it, stores it, updates the conversation, creates a notification and emits `message:new` to both users.
5. **Status ticks:** a message starts as `sent`, becomes `delivered` when the receiver is online or connects, and `read` when the receiver opens the chat.
6. **Blocking:** an admin blocks a user. Their next REST call is rejected with 403 and their live sockets are disconnected at once.

---

## Security Notes

- Passwords are hashed with bcrypt.
- Every protected request checks the database, so blocked users are rejected immediately even with a valid token.
- Users always register with the `user` role. Only the seed script creates an admin.
- Request bodies and socket payloads are validated with Zod.
- Uploads use random file names, a type whitelist and a 2 MB limit.
- Helmet and rate limiting are enabled (general limit plus a stricter limit on `/api/auth`).
- Change the default admin password and use a strong `JWT_SECRET` before deploying.
- Uploaded files are served publicly at `/uploads/<file>`. The names are random and hard to guess, but anyone with a link can open a file.

---

## Deployment Notes

- Set `NODE_ENV=production`, a strong `JWT_SECRET`, your real `MONGO_URI` and `CLIENT_URL` (your deployed frontend origin).
- Build and run the backend: `npm run build` then `npm start`.
- Build the frontend with `npm run build` and serve the `dist/` folder from any static host. Set `VITE_API_URL` to your deployed API URL before building.
- Use a host that supports WebSockets (Render, Railway, a VPS and similar). If you run several backend instances, add the Socket.IO Redis adapter and move the online-users map to Redis.
- The `uploads/` folder lives on local disk. On hosts with temporary storage, move uploads to object storage such as S3 or Cloudinary.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `MONGO_URI and JWT_SECRET must be set in .env` | Create `backend/.env` from `.env.example` and fill both values. |
| CORS error in the browser | `CLIENT_URL` in the backend must exactly match the frontend origin, including the port. |
| Socket keeps reconnecting or shows `Unauthorized` | The token is missing, expired or the user is blocked. Log in again. |
| Images do not load | Check that `VITE_API_URL` ends with `/api`. The file URL is built from the server origin without `/api`. |
| Upload fails | Only png, jpeg, webp, gif, pdf and txt are allowed, up to 2 MB. |
| Too many requests on login | `/api/auth` allows 30 requests per 15 minutes per IP. Wait or restart the server in development. |
| Admin login does not work | Run `npm run seed` in the backend and use the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env`. |

---

## License

MIT
