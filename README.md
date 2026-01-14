# GigFlow - Freelance Marketplace Platform

A full-stack freelance marketplace application built with modern web technologies. Connect clients with freelancers through a secure, real-time bidding and hiring system.

![Tech Stack](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-47A248?logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18-000000?logo=express)

## 🎯 Project Overview

GigFlow is a freelance marketplace that enables:
- **Clients** to post gigs and hire freelancers
- **Freelancers** to browse opportunities and submit bids
- **Real-time notifications** for hiring and bidding events
- **Fluid roles** - users can switch between client and freelancer modes
- **Atomic operations** - race-condition safe hiring process
- **Auto-cleanup** - gigs are automatically removed after hiring

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HttpOnly cookies
- Secure password hashing with bcrypt
- Protected routes and API endpoints
- Session management

### 💼 Gig Management
- Create, browse, and search gigs
- Real-time gig feed with pagination
- Gig ownership verification
- Manual gig deletion by owners
- **Auto-deletion** when a freelancer is hired

### 💰 Bidding System
- Submit bids with message and price
- View all bids for a gig (owner-only)
- Bid status tracking (pending/hired/rejected)
- Prevent bidding on own gigs
- Prevent duplicate bids

### 🎯 Hiring Process
- Atomic hiring with MongoDB transactions
- Race-condition protection using guarded updates
- Automatic status updates (gig + all bids)
- **Automatic gig deletion** after successful hire
- Real-time notifications to hired freelancer

### 👥 Fluid Roles System
- No fixed role assignment during registration
- Users can post gigs (client mode) AND bid (freelancer mode)
- Mode switching via navbar toggle
- Persisted mode preference in localStorage
- Ownership-based permissions (not role-based)

### 🔔 Real-time Features
- Socket.io integration for live updates
- Instant notifications for:
  - New bids on your gigs
  - Being hired for a gig
  - Bid status changes
- Notification badge with unread count
- Persistent notification history

### 🎨 User Interface
- Modern, responsive design with TailwindCSS
- Dark mode support
- Smooth animations and transitions
- Mobile-friendly layout
- Loading states and error handling
- Confirmation modals for critical actions

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Socket.io** - WebSocket server
- **Express Validator** - Input validation
- **Cookie Parser** - Cookie handling

### Architecture
- **RESTful API** design
- **MVC pattern** (Models, Views, Controllers)
- **Middleware-based** authentication
- **Transaction-based** atomic operations
- **Event-driven** real-time updates

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager
- Git (for version control)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/TechieParth2310/GIGFLOW.git
cd GIGFLOW
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Environment Setup

#### Server Configuration

Create `server/.env`:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/gigflow
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### Client Configuration

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5001/api
VITE_SOCKET_URL=http://localhost:5001
```

### 4. Start MongoDB

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or use MongoDB Atlas (cloud)
```

### 5. Run the Application

```bash
# From project root - start both server and client
npm run dev

# Or start separately:
# Terminal 1 - Server
cd server && npm start

# Terminal 2 - Client
cd client && npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: token=<jwt_token>
```

#### Logout
```http
POST /api/auth/logout
Cookie: token=<jwt_token>
```

### Gig Endpoints

#### Get All Open Gigs
```http
GET /api/gigs?search=website&page=1&limit=10
```

#### Get Single Gig
```http
GET /api/gigs/:id
```

#### Get My Gigs (Owner Only)
```http
GET /api/gigs/mine
Cookie: token=<jwt_token>
```

#### Create Gig
```http
POST /api/gigs
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "title": "Website Redesign",
  "description": "Need a modern website redesign",
  "budget": 1500
}
```

#### Delete Gig (Owner Only)
```http
DELETE /api/gigs/:id
Cookie: token=<jwt_token>
```

### Bid Endpoints

#### Get Bids for Gig (Owner Only)
```http
GET /api/bids/:gigId
Cookie: token=<jwt_token>
```

#### Create Bid
```http
POST /api/bids
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "gigId": "gig_id_here",
  "message": "I have 5 years of experience...",
  "price": 1200
}
```

#### Get My Bids
```http
GET /api/bids/my-bids
Cookie: token=<jwt_token>
```

#### Hire Freelancer (Owner Only)
```http
PATCH /api/bids/:bidId/hire
Cookie: token=<jwt_token>
```

**Note**: This endpoint automatically deletes the gig after successful hire.

## 🔄 Core Workflows

### Hiring Flow (Atomic & Race-Condition Safe)

1. **Transaction Start**: MongoDB session begins
2. **Guarded Checks**:
   - Verify gig status is "open"
   - Verify bid status is "pending"
   - Verify user is gig owner
3. **Atomic Operations** (all within transaction):
   - Delete gig (instead of marking as assigned)
   - Update chosen bid: `pending` → `hired`
   - Update all other bids: `pending` → `rejected`
4. **Transaction Commit**: All changes succeed or fail together
5. **Real-time Notification**: Socket.io emits to hired freelancer

**Race Condition Protection**:
- MongoDB transactions ensure atomicity
- Guarded updates prevent double-hiring
- `findOneAndDelete` with status check prevents conflicts

### Fluid Roles System

- **No Role Selection**: Users register without choosing a role
- **Mode Toggle**: Switch between Client/Freelancer mode in navbar
- **Context-Based Actions**:
  - Client Mode: Post gigs, view "My Gigs", review bids
  - Freelancer Mode: Browse gigs, submit bids, view "My Bids"
- **Ownership-Based Permissions**: Access control based on `gig.ownerId` and `bid.freelancerId`

## 📁 Project Structure

```
GIGFLOW/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── gigController.js     # Gig CRUD operations
│   │   │   ├── bidController.js     # Bid management
│   │   │   ├── hireController.js    # Atomic hiring process
│   │   │   ├── notificationController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT verification
│   │   │   ├── validation.js        # Error handling
│   │   │   └── validators.js        # Input validation rules
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   ├── Gig.js               # Gig schema
│   │   │   ├── Bid.js               # Bid schema
│   │   │   └── Notification.js     # Notification schema
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── gigRoutes.js
│   │   │   ├── bidRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── utils/
│   │   │   └── generateToken.js     # JWT generation
│   │   └── index.js                 # Express app setup
│   ├── package.json
│   └── .env                         # Environment variables
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation with mode toggle
│   │   │   ├── ProtectedRoute.jsx   # Route protection
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── Skeleton.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Gigs.jsx             # Browse gigs
│   │   │   ├── GigDetails.jsx       # View gig + bid form
│   │   │   ├── CreateGig.jsx
│   │   │   ├── MyGigs.jsx           # Client dashboard
│   │   │   ├── ClientReview.jsx     # Review bids & hire
│   │   │   ├── MyBids.jsx           # Freelancer dashboard
│   │   │   ├── Notifications.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/
│   │   │   ├── api.js               # Axios API client
│   │   │   └── socket.js            # Socket.io client
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── gigSlice.js
│   │   │   │   ├── bidSlice.js
│   │   │   │   ├── notificationSlice.js
│   │   │   │   ├── modeSlice.js     # Client/Freelancer mode
│   │   │   │   ├── themeSlice.js
│   │   │   │   └── userSlice.js
│   │   │   └── store.js             # Redux store config
│   │   ├── utils/
│   │   │   └── dateUtils.js
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   └── .env                         # Environment variables
├── package.json                     # Root package.json
├── .gitignore
└── README.md
```

## 🧪 Testing the Application

### Manual Testing Checklist

#### Authentication
- [x] Register new user (no role selection)
- [x] Login with valid credentials
- [x] Access protected routes
- [x] Logout functionality

#### Gig Management
- [x] Create gig as authenticated user
- [x] Browse all open gigs
- [x] Search gigs by title
- [x] View single gig details
- [x] Delete own gig
- [x] Cannot delete others' gigs

#### Bidding
- [x] Submit bid on open gig
- [x] Cannot bid on own gig
- [x] View bid count on gig details
- [x] View all my bids

#### Hiring
- [x] Client hires freelancer
- [x] Gig automatically deleted after hire
- [x] Chosen bid marked as "hired"
- [x] All other bids marked as "rejected"
- [x] Real-time notification sent
- [x] Cannot hire if gig already deleted

#### Mode Switching
- [x] Toggle between Client/Freelancer mode
- [x] Mode persists in localStorage
- [x] Navigation updates based on mode
- [x] Appropriate pages accessible per mode

## 🚢 Deployment

### Deploy to Render (Recommended - Single Service)

Render allows you to deploy both client and server as a single web service.

#### Prerequisites
- MongoDB Atlas account (free tier available)
- Render account (free tier available)

#### Step 1: Prepare MongoDB Atlas

1. **Create a MongoDB Atlas account** at https://www.mongodb.com/cloud/atlas
2. **Create a new cluster** (free tier M0)
3. **Create a database user**:
   - Go to "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Username: your choice (e.g., `gigflow_user`)
   - Password: generate a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"
4. **Whitelist IP addresses** (CRITICAL for Render):
   - Go to "Network Access" → "IP Access List"
   - Click "Add IP Address"
   - Choose one of these options:
     - **Option A (Recommended for Render)**: Click "Allow Access from Anywhere"
       - This adds `0.0.0.0/0` which allows all IPs (safe for Render)
     - **Option B**: Add specific Render IPs (not recommended, changes frequently)
   - Click "Confirm"
5. **Get your connection string**:
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Driver: "Node.js", Version: "5.5 or later"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with your database name (e.g., `gigflow`)
   - Example: `mongodb+srv://gigflow_user:yourpassword@cluster0.xxxxx.mongodb.net/gigflow?retryWrites=true&w=majority`

#### Step 2: Deploy to Render

1. **Create New Web Service** on Render
   - Connect your GitHub repository: `https://github.com/TechieParth2310/GIGFLOW`
   - Select the repository

2. **Configure Build Settings**:
   - **Build Command**: 
     ```bash
     npm install && cd server && npm install && cd ../client && npm install && npm run build
     ```
   - **Start Command**: 
     ```bash
     cd server && npm start
     ```
   - **Environment**: Node

3. **Set Environment Variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gigflow?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   PORT=10000
   CORS_ORIGIN=https://your-app-name.onrender.com
   ```
   
   **⚠️ CRITICAL - MongoDB Atlas IP Whitelist:**
   - **Before deploying**, make sure MongoDB Atlas allows connections from Render
   - Go to MongoDB Atlas → **Network Access** → **IP Access List**
   - Click **"Add IP Address"** → **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` which allows all IPs (safe for Render)
   - Without this, you'll get: `"Could not connect... IP isn't whitelisted"` error
   - Make sure MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Render

4. **Deploy**: Click "Create Web Service"

#### Step 3: Update Client Environment (if needed)

The server automatically serves the built client files in production. However, if you need to update the client's API URL:

1. Update `client/.env` or set `VITE_API_URL` in Render environment variables
2. The client will use the same domain as the server in production

#### Render Deployment Notes

- **Free Tier**: Services may spin down after 15 minutes of inactivity
- **Build Time**: First build may take 5-10 minutes
- **Auto-Deploy**: Render automatically deploys on git push to main branch
- **Custom Domain**: You can add a custom domain in Render settings
- **Logs**: View deployment and runtime logs in Render dashboard

### Alternative: Separate Deployments

#### Server Deployment (Render, Heroku, Railway, etc.)

1. Set production environment variables
2. Use PM2 for process management (if needed):
   ```bash
   npm install -g pm2
   pm2 start server/src/index.js --name gigflow-server
   ```

#### Client Deployment (Vercel, Netlify, etc.)

1. Update `client/.env` with production API URL:
   ```
   VITE_API_URL=https://your-server-url.com/api
   VITE_SOCKET_URL=https://your-server-url.com
   ```
2. Build the application:
   ```bash
   cd client && npm run build
   ```
3. Deploy `client/dist` to static hosting

### MongoDB

- Use MongoDB Atlas for cloud hosting
- Ensure connection string includes authentication
- Whitelist server IP addresses (or use `0.0.0.0/0` for Render)

## 🔒 Security Features

- **HttpOnly Cookies**: Prevents XSS attacks
- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure, stateless authentication
- **Input Validation**: Express Validator for all inputs
- **CORS Protection**: Configured for specific origins
- **Ownership Verification**: All operations verify ownership
- **Atomic Transactions**: Prevents race conditions
- **Guarded Updates**: Prevents double-hiring

## 🎯 Key Technical Achievements

1. **Atomic Hiring Process**: Implemented MongoDB transactions with guarded updates to prevent race conditions
2. **Fluid Roles System**: Context-based role switching without database role field
3. **Real-time Updates**: Socket.io integration for instant notifications
4. **Auto-cleanup**: Gigs automatically deleted after hiring
5. **Race Condition Protection**: Guarded updates ensure data consistency
6. **Modern State Management**: Redux Toolkit for predictable state updates
7. **Responsive Design**: Mobile-first approach with TailwindCSS

## 📊 Database Schema

### User Model
```javascript
{
  username: String (unique, required)
  email: String (unique, required)
  password: String (hashed, required)
  role: String (optional, default: 'client')
  createdAt: Date
}
```

### Gig Model
```javascript
{
  title: String (required)
  description: String (required)
  budget: Number (required)
  ownerId: ObjectId (ref: User, required)
  status: String (enum: ['open', 'assigned'], default: 'open')
  createdAt: Date
  updatedAt: Date
}
```

### Bid Model
```javascript
{
  gigId: ObjectId (ref: Gig, required)
  freelancerId: ObjectId (ref: User, required)
  message: String (required)
  price: Number (required)
  status: String (enum: ['pending', 'hired', 'rejected'], default: 'pending')
  createdAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

ISC License

## 👨‍💻 Author

**Parth Kothawade**
- GitHub: [@TechieParth2310](https://github.com/TechieParth2310)
- Project: [GigFlow](https://github.com/TechieParth2310/GIGFLOW)

## 🙏 Acknowledgments

- Built with React, Express, and MongoDB
- Inspired by modern freelance marketplace platforms
- Uses best practices for security and scalability

---

**Built with ❤️ using React, Express, and MongoDB**
