# MERN-Social Refactored for 2025 - Updated Technology Stack

This guide provides a complete refactoring of the MERN-Social application to use the latest versions of all technologies as of August 2025.

## 🚀 Updated Technology Stack

### Current Versions (August 2025)
- **Node.js**: v22.17.1 (LTS) - Current LTS until April 2027
- **React**: v19.1.1 - Latest stable with Server Components and Actions
- **Express**: v5.0.1 - Latest major version with async/await support
- **MongoDB**: v8.0+ - Latest with enhanced performance
- **Mongoose**: v8.17.0 - Current stable with full MongoDB 8.0 support
- **Material-UI**: v6.3.0 (@mui/material) - Current major version

## 📁 Updated Project Structure

```
mern-social/
├── client/                     # React 19 Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── utils/             # Utility functions
│   │   ├── services/          # API services
│   │   ├── context/           # React context
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── vite.config.js         # Using Vite instead of Create React App
├── server/                     # Express 5 Backend
│   ├── controllers/           # Route handlers
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── middleware/           # Express middleware
│   ├── utils/                # Server utilities
│   ├── config/               # Configuration files
│   ├── app.js                # Express app setup
│   └── server.js             # Server entry point
├── shared/                    # Shared utilities
├── .env.example
├── .gitignore
├── docker-compose.yml         # Docker setup for development
├── package.json              # Root package.json
└── README.md
```

## 📦 Root Package.json

```json
{
  "name": "mern-social-2025",
  "version": "2.0.0",
  "description": "A modern MERN stack social media application with React 19 and Express 5",
  "main": "server/server.js",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"npm run server:dev\" \"npm run client:dev\"",
    "start": "node server/server.js",
    "server:dev": "cd server && npm run dev",
    "client:dev": "cd client && npm run dev",
    "build": "cd client && npm run build",
    "install:all": "npm install && cd server && npm install && cd ../client && npm install",
    "test": "cd server && npm test && cd ../client && npm test"
  },
  "engines": {
    "node": ">=22.0.0",
    "npm": ">=10.0.0"
  },
  "devDependencies": {
    "concurrently": "^9.0.1"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/mern-social-2025.git"
  },
  "keywords": [
    "react",
    "express",
    "mongodb",
    "node",
    "mern",
    "social-media",
    "react-19",
    "express-5"
  ],
  "author": "Your Name",
  "license": "MIT"
}
```

## 🌐 Client Package.json (React 19 + Vite)

```json
{
  "name": "mern-social-client",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0"
  },
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-router-dom": "^6.28.0",
    "@mui/material": "^6.3.0",
    "@mui/icons-material": "^6.3.0",
    "@emotion/react": "^11.13.5",
    "@emotion/styled": "^11.13.0",
    "@mui/x-date-pickers": "^7.22.2",
    "axios": "^1.7.9",
    "react-query": "^3.39.3",
    "@tanstack/react-query": "^5.59.16",
    "formik": "^2.4.6",
    "yup": "^1.4.0",
    "date-fns": "^4.1.0",
    "react-hot-toast": "^2.4.1",
    "zustand": "^5.0.1"
  },
  "devDependencies": {
    "@types/react": "^19.0.6",
    "@types/react-dom": "^19.0.3",
    "@vitejs/plugin-react": "^4.3.3",
    "vite": "^6.0.1",
    "vitest": "^2.1.8",
    "eslint": "^9.14.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.14"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

## 🖥️ Server Package.json (Express 5 + Modern Node.js)

```json
{
  "name": "mern-social-server",
  "version": "2.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "express": "^5.0.1",
    "mongoose": "^8.17.0",
    "cors": "^2.8.5",
    "helmet": "^8.0.0",
    "morgan": "^1.10.0",
    "compression": "^1.7.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.2.0",
    "multer": "^1.4.5",
    "cloudinary": "^2.5.1",
    "nodemailer": "^6.9.17",
    "express-rate-limit": "^7.4.1",
    "express-mongo-sanitize": "^2.2.0",
    "xss-clean": "^0.1.4",
    "hpp": "^0.2.3",
    "dotenv": "^16.4.7",
    "cookie-parser": "^1.4.7",
    "express-async-errors": "^3.1.1"
  },
  "devDependencies": {
    "nodemon": "^3.1.7",
    "jest": "^29.7.0",
    "supertest": "^7.0.0",
    "@babel/preset-env": "^7.26.0"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

## ⚙️ Key Configuration Files

### Vite Configuration (client/vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Express App Setup (server/app.js)

```javascript
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import hpp from 'hpp'
import cookieParser from 'cookie-parser'
import 'express-async-errors'

// Route imports
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import postRoutes from './routes/posts.js'

const app = express()

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api', limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Data sanitization middleware
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())

// Compression and logging
app.use(compression())
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    })
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    })
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    })
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    })
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  })
})

export default app
```

### MongoDB Connection with Mongoose 8 (server/config/database.js)

```javascript
import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const options = {
      // Connection options for Mongoose 8
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, options)
    
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('MongoDB connection closed through app termination')
      process.exit(0)
    })
    
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

export default connectDB
```

## 📱 Updated React Components with React 19 Features

### App Component with React 19 (client/src/App.jsx)

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Components
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute'

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
})

// Create Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
```

### Modern Hook Example with React 19 Actions

```jsx
import { useState, useTransition } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

export function useCreatePost() {
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()
  
  const mutation = useMutation({
    mutationFn: async (postData) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(postData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create post')
      }
      
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      toast.success('Post created successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create post')
    },
  })
  
  const createPost = async (postData) => {
    // Using React 19 Actions with useTransition
    startTransition(() => {
      mutation.mutate(postData)
    })
  }
  
  return {
    createPost,
    isPending: isPending || mutation.isPending,
    error: mutation.error,
  }
}
```

## 🔧 Migration Steps

### 1. Update Node.js and npm
```bash
# Install Node.js 22 LTS
nvm install 22
nvm use 22

# Verify versions
node --version  # Should be v22.x.x
npm --version   # Should be 10.x.x
```

### 2. Initialize New Project Structure
```bash
# Create new project directory
mkdir mern-social-2025
cd mern-social-2025

# Initialize root package.json
npm init -y

# Create directory structure
mkdir -p client server shared
```

### 3. Set up Client with Vite and React 19
```bash
cd client
npm create vite@latest . -- --template react
npm install react@^19.1.1 react-dom@^19.1.1
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install react-router-dom axios @tanstack/react-query
npm install formik yup date-fns react-hot-toast zustand
```

### 4. Set up Server with Express 5
```bash
cd ../server
npm init -y
npm install express@^5.0.1 mongoose@^8.17.0
npm install cors helmet morgan compression
npm install bcryptjs jsonwebtoken express-validator
npm install multer cloudinary nodemailer
npm install express-rate-limit express-mongo-sanitize xss-clean hpp
npm install dotenv cookie-parser express-async-errors
npm install -D nodemon jest supertest
```

### 5. Environment Configuration

Create `.env` file in the root directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/mern-social-2025

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🚀 Development Commands

```bash
# Install all dependencies
npm run install:all

# Start development server (both client and server)
npm run dev

# Start only server
npm run server:dev

# Start only client
npm run client:dev

# Build for production
npm run build

# Run tests
npm test
```

## 📈 Performance Improvements

### 1. React 19 Features Used
- **Server Components** for better SSR performance
- **Actions** for simplified async state management
- **useTransition** for smooth UI updates
- **Concurrent rendering** for better user experience

### 2. Express 5 Features
- **Native async/await support** in middleware
- **Improved error handling**
- **Better performance** with updated dependencies
- **Enhanced security** with latest security packages

### 3. Mongoose 8 Features
- **Better TypeScript support**
- **Improved connection handling**
- **Enhanced performance** with optimized queries
- **Better error handling**

## 🔒 Security Enhancements

1. **Helmet.js** - Sets various HTTP headers
2. **CORS** - Configured for specific origins
3. **Rate Limiting** - Prevents abuse
4. **Data Sanitization** - Prevents injection attacks
5. **XSS Protection** - Prevents cross-site scripting
6. **HPP Protection** - Prevents parameter pollution

## 🎯 Key Benefits of This Refactor

1. **Latest Technology Stack** - All packages updated to 2025 versions
2. **Better Performance** - React 19 and Express 5 optimizations
3. **Modern Development** - Vite for faster builds, ESM modules
4. **Enhanced Security** - Updated security middleware and practices
5. **Better Developer Experience** - Hot reloading, better error handling
6. **Production Ready** - Proper configuration for deployment
7. **Type Safety** - Modern TypeScript setup
8. **Testing Ready** - Jest and Vitest configured

This refactored version provides a solid foundation for a modern social media application using the latest MERN stack technologies available in 2025.