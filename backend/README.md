# Chat Backend

Express + TypeScript + MongoDB + Socket.IO

## Setup

    npm install
    cp .env.example .env
    npm run seed
    npm run dev

## REST API (prefix /api)

Auth
- POST /auth/register
- POST /auth/login
- GET /auth/me

Users
- GET /users?q=
- GET /users/:id
- PUT /users/me

Conversations
- GET /conversations
- POST /conversations { userId }

Messages
- POST /messages/upload (multipart, field: file)
- GET /messages/:conversationId?limit=30&before=ISO_DATE
- DELETE /messages/:id

Notifications
- GET /notifications
- PATCH /notifications/read-all
- PATCH /notifications/:id/read

Reports
- POST /reports { reportedUserId, messageId?, reason }

Admin (admin role)
- GET /admin/stats
- GET /admin/users
- PATCH /admin/users/:id/block
- GET /admin/reports
- PATCH /admin/reports/:id/resolve

## Socket.IO

Connect with: io(URL, { auth: { token } })

Client to server
- message:send { receiverId, messageType, content, fileName } with ack callback
- message:read { conversationId }
- typing { to, isTyping }

Server to client
- message:new
- message:deleted { id, conversationId }
- messages:status { by, status, conversationId? }
- typing { from, isTyping }
- presence { userId, online, lastSeen? }
- online-list [userIds]
- notification:new
