# HelpDesk Mini

A ticket management system with SLA tracking, role-based access control, and real-time analytics.

## Features

### Core Functionality

- **Authentication & Authorization**: JWT-based auth with role-based access (User, Agent, Admin)
- **Ticket Management**: Create, view, update, and track tickets with status flow (Open → In Progress → Resolved → Closed)
- **SLA Tracking**: Automatic deadline calculation based on priority with visual indicators (green/orange/red)
- **Comments & Collaboration**: Thread-style discussions with @mentions support
- **Analytics Dashboard**: Real-time insights with charts for ticket distribution and agent workload
- **File Attachments**: Support for screenshots and documents

### Role-Specific Views

- **User Dashboard**: Create tickets, track status, view SLA countdown
- **Agent Dashboard**: View assigned tickets, update status, add comments
- **Admin Dashboard**: System overview, SLA compliance metrics, agent workload, ticket assignment

## Tech Stack

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)

### Frontend

- React 18
- Tailwind CSS
- React Router v6
- Recharts (analytics)
- Axios (API calls)

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (running locally or cloud instance)

### Installation

1. **Install all dependencies**

```bash
npm run install-all
```

2. **Configure environment variables**

Create `backend/.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

3. **Start MongoDB**

```bash
# If using local MongoDB
mongod
```

4. **Run the application**

Option 1 - Run both servers concurrently:

```bash
npm run dev
```

Option 2 - Run separately:

```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

5. **Access the application**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Tickets

- `POST /api/tickets` - Create ticket (with file upload)
- `GET /api/tickets` - List tickets (filtered by role)
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id/status` - Update ticket status
- `PUT /api/tickets/:id/assign` - Assign ticket to agent
- `DELETE /api/tickets/:id` - Delete ticket (admin only)

### Comments

- `POST /api/comments` - Add comment to ticket
- `GET /api/comments/:ticketId` - Get ticket comments
- `DELETE /api/comments/:id` - Delete comment

### Analytics

- `GET /api/analytics/dashboard` - Admin dashboard stats
- `GET /api/analytics/my-stats` - User/Agent stats
- `GET /api/analytics/agents` - List active agents

## SLA Rules

Priority-based deadlines:

- **High**: 24 hours
- **Medium**: 48 hours
- **Low**: 72 hours

Visual indicators:

- **Green**: More than 24 hours remaining
- **Orange**: 6-24 hours remaining
- **Red**: Less than 6 hours remaining
- **Dark Red**: SLA breached

## Default Users for Testing

Create test users via signup with different roles:

```javascript
// Admin
{ name: "Admin User", email: "admin@test.com", password: "admin123", role: "admin" }

// Agent
{ name: "Agent User", email: "agent@test.com", password: "agent123", role: "agent" }

// User
{ name: "Test User", email: "user@test.com", password: "user123", role: "user" }
```

## Project Structure

```
helpdesk/
├── backend/
│   ├── config/          # Database configuration
│   ├── middleware/      # Auth & file upload middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   └── server.js        # Express server
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # React context (Auth)
│       ├── pages/       # Route pages
│       ├── utils/       # API client & helpers
│       ├── App.js       # Main app component
│       └── index.js     # Entry point
└── package.json
```

## Development Notes

- The backend uses JWT tokens stored in localStorage
- File uploads are stored in `backend/uploads/`
- SLA deadlines are calculated automatically on ticket creation
- Tickets show real-time SLA status based on current time
- Role-based access control is enforced on both frontend and backend

## Future Enhancements

- Email notifications on ticket updates
- Real-time updates with WebSockets
- Export reports (CSV/PDF)
- Advanced search and filtering
- Tags/Labels for tickets
- Dark mode
- Ticket templates

## License

ISC
