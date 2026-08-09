# React + Node.js Learning App

A full-stack learning application built with React (frontend) and Node.js/Express (backend) to understand basic concepts of both technologies working together.

## Features

- **Frontend**: React with Vite, modern hooks API, component-based architecture
- **Backend**: Node.js with Express.js, RESTful API design
- **Communication**: Axios for HTTP requests from React to Express
- **Functionality**: CRUD operations on a Todo list (in-memory storage)
- **VS Code Integration**: Debug configurations, recommended extensions, and tasks

## Project Structure

```
react-node-learning-app/
├── backend/                  # Node.js/Express server
│   ├── index.js             # Main server file
│   ├── package.json
│   ├── .env                 # Environment variables (PORT)
│   └── .env.example         # Template for .env
├── frontend/                # React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   └── TodoList.jsx # Main todo component
│   │   ├── services/        # API service layer
│   │   │   └── todoService.js
│   │   ├── App.jsx          # Main App component
│   │   ├── App.css          # App/todo styles
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global base styles
│   ├── .env                 # VITE_API_URL pointing at the backend
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .vscode/                 # VS Code configuration
│   ├── launch.json          # Debug configurations
│   ├── tasks.json           # npm tasks
│   └── extensions.json      # Recommended extensions
├── package.json             # Root package.json with convenience scripts
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)
- VS Code (recommended for development experience)

### Installation

1. Clone or download this repository
2. Install dependencies for both frontend and backend:

```bash
# Install all dependencies (root script)
npm run install:all

# Or install separately:
cd backend && npm install
cd frontend && npm install
```

### Environment Variables

`backend/.env` (copy from `backend/.env.example`):

```
PORT=5001
```

`frontend/.env` tells the React app where the API lives:

```
VITE_API_URL=http://localhost:5001/api
```

The backend runs on port 5001 by default and the frontend on port 5173 (Vite default).
Port 5000 is intentionally avoided because macOS reserves it for the AirPlay Receiver.
If you change the backend port, update both files so they stay in sync.

## Development Scripts

From the project root:

```bash
# Start both backend and frontend concurrently
npm run dev

# Start only the backend
npm run backend

# Start only the frontend
npm run frontend

# Install dependencies for both
npm run install:all

# Or separately:
npm run install:backend
npm run install:frontend
```

## VS Code Development

Open this folder in VS Code. The IDE will:

1. Automatically detect recommended extensions (see `.vscode/extensions.json`)
2. Provide debug configurations:
   - "Launch Backend" - Debug the Node.js server
   - "Launch Frontend (Chrome)" - Debug the React app in Chrome
   - "Full Stack: Backend + Frontend" - Debug both simultaneously
3. Provide tasks for running development servers

## Learning Concepts Covered

### Backend (Node.js/Express)
- Setting up an Express server
- Middleware usage (cors, express.json, dotenv)
- RESTful API design patterns
- HTTP methods (GET, POST, PUT, DELETE)
- Request/response handling
- Error handling basics
- Environment configuration

### Frontend (React)
- Functional components and hooks (useState, useEffect)
- Component-based architecture
- State management
- Event handling
- Conditional rendering
- Styling with CSS modules
- API communication with Axios
- Component lifecycle

### Full Stack Integration
- CORS configuration for cross-origin requests
- API endpoint consumption from frontend
- Asynchronous data fetching
- Optimistic UI updates (conceptual)
- Development workflow with concurrent servers

## API Endpoints

All API endpoints are prefixed with `/api`:

- `GET /api/todos` - Retrieve all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Customization & Extension Ideas

Once you understand the basics, try extending the application:

1. **Backend Enhancements**
   - Add validation for todo items
   - Implement persistence with a database (MongoDB, SQLite, etc.)
   - Add user authentication
   - Implement filtering and sorting
   - Add error handling middleware

2. **Frontend Enhancements**
   - Add form validation
   - Implement loading states and error boundaries
   - Add editing capability for todos
   - Implement pagination
   - Add unit tests with Jest and React Testing Library
   - Use React Router for navigation
   - Implement state management with Context API or Redux

3. **DevOps & Deployment**
   - Create Dockerfiles for both frontend and backend
   - Set up CI/CD pipelines
   - Deploy to Vercel, Netlify, or Heroku
   - Implement environment-specific configurations

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Change `PORT` in `backend/.env` (and `VITE_API_URL` in `frontend/.env` to match)
   - Kill existing processes: `lsof -i :5001` or `lsof -i :5173`

2. **Empty responses / 403 on port 5000 (macOS)**
   - macOS runs the AirPlay Receiver on port 5000, which silently returns `403`
   - Either keep the backend on 5001 (default here) or disable AirPlay Receiver in
     System Settings → General → AirDrop & Handoff

3. **CORS Errors**
   - Ensure the cors middleware is properly configured in backend/index.js
   - Verify the frontend is making requests to the correct backend URL

4. **Dependency Installation Issues**
   - Delete node_modules and package-lock.json, then reinstall
   - Try using `npm ci` instead of `npm install`

## Built With

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Node.js web framework
- [React](https://reactjs.org/) - Frontend library
- [Vite](https://vitejs.dev/) - Frontend build tool
- [Axios](https://axios-http.com/) - HTTP client
- [VS Code](https://code.visualstudio.com/) - Development editor

## Acknowledgements

This project was created as a learning exercise to understand full-stack development concepts with React and Node.js. Feel free to use, modify, and extend it for your own learning purposes.

Happy coding! 🚀
