# TeamFlow - Premium Team Task Manager

TeamFlow is a state-of-the-art, full-stack project management platform designed for modern teams. It features a high-performance React frontend, a robust Express backend, and a secure role-based access control (RBAC) system.

##  Features & Functionality

### Advanced Authentication
- **Split-Screen UI**: A premium, immersive login/signup experience featuring high-definition team-focused imagery.
- **Secure JWT**: Token-based authentication with encrypted password storage using Bcrypt.

### 👥 Role-Based Access Control (RBAC)
- **Admin Role**:
  - Create and manage projects.
  - Invite and manage team members.
  - Create, assign, and delete any task.
  - Move any task across the Kanban board.
- **Member Role**:
  - View projects they are assigned to.
  - **Dynamic Permissions**: Members can only update the status of tasks **assigned specifically to them**, ensuring workflow integrity.

###  Interactive Kanban Board
- **Visual Tracking**: Tasks are organized into "To Do," "In Progress," and "Completed" columns.
- **Color-Coded Avatars**: Every team member is assigned a unique, consistent color badge for instant visual recognition.
- **Real-time Updates**: Instant status transitions and task deletions.

### Smart Dashboard
- **Analytics at a Glance**: Track project progress with a dynamic dashboard showing total projects, task counts, and completion percentages.
- **Glassmorphism UI**: A modern, sleek aesthetic using translucent cards and subtle animations.

## Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Framer Motion (Animations), Lucide (Icons), Vanilla CSS (Custom Design System).
- **Backend**: Node.js, Express.js, JWT, Mongoose.
- **Database**: MongoDB (with `mongodb-memory-server` fallback for instant testing).
- **Deployment**: Fully optimized for **Railway** with automatic CI/CD configuration.


### 1. Backend Configuration
```bash
cd backend
npm install
# Create a .env file:
PORT=5001
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
npm run dev
```

### 2. Frontend Configuration
```bash
cd frontend
npm install
npm run dev
```


