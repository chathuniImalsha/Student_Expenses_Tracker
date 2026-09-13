# Spendly – Student Expense Tracker

**Tagline:** *Track. Save. Spend Smart.*

A simple and modern full-stack web application designed to help university students track their daily expenses, manage monthly budgets, monitor spending patterns, and understand their financial habits.

![Spendly](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)
![Node](https://img.shields.io/badge/Node.js-18.x-green.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Screenshots](#screenshots)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Information](#database-information)
- [Postman Testing](#postman-testing)
- [Future Improvements](#future-improvements)

---

## ✨ Features

### Authentication
- User registration with email validation
- Secure login with JWT authentication
- Password hashing using bcrypt
- Protected routes and API endpoints
- User profile management

### Expense Management
- Add, view, edit, and delete expenses
- Categorize expenses (Food, Transport, Education, etc.)
- Multiple payment methods (Cash, Card, Bank Transfer, Online Payment)
- Search and filter expenses by category, payment method, and month
- Sort expenses by date (newest/oldest)

### Budget Management
- Set monthly budgets
- Track budget usage with visual progress bar
- View remaining budget
- Budget alerts at 80%, 90%, and 100% usage
- Update existing budgets

### Dashboard
- Real-time summary cards (Total Spent, This Month, Today, Remaining Budget)
- Category spending pie chart
- Monthly spending bar chart
- Recent expenses list

### Reports
- Monthly spending reports
- Category-wise spending breakdown
- Highest spending category analysis
- Average daily spending calculation
- Export expenses as CSV

### User Experience
- Clean, modern, and responsive design
- Mobile-friendly interface
- Real-time data updates
- Loading states and error handling
- Sri Lankan Rupees (Rs.) as default currency

---

## 🛠 Technology Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization library
- **CSS** - Styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

### Tools
- VS Code - Code editor
- Postman - API testing
- MongoDB Atlas - Cloud database
- Git - Version control
- GitHub - Code hosting

---

## 📁 Folder Structure

```
student_expenses_tracker/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── expenseController.js  # Expense CRUD operations
│   │   ├── budgetController.js   # Budget management
│   │   ├── dashboardController.js # Dashboard statistics
│   │   └── reportController.js   # Report generation
│   │
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT authentication middleware
│   │
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Expense.js            # Expense schema
│   │   └── Budget.js             # Budget schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   ├── expenseRoutes.js      # Expense endpoints
│   │   ├── budgetRoutes.js       # Budget endpoints
│   │   ├── dashboardRoutes.js    # Dashboard endpoints
│   │   └── reportRoutes.js       # Report endpoints
│   │
│   ├── .env                      # Environment variables (not in git)
│   ├── .env.example              # Environment variables template
│   ├── .gitignore                # Git ignore rules
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx        # Navigation bar
│       │   ├── Sidebar.jsx       # Sidebar navigation
│       │   ├── SummaryCard.jsx   # Dashboard summary card
│       │   ├── ExpenseForm.jsx   # Add/edit expense form
│       │   ├── ExpenseTable.jsx  # Expense list table
│       │   └── Charts.jsx        # Recharts components
│       │
│       ├── pages/
│       │   ├── Login.jsx         # Login page
│       │   ├── Register.jsx      # Registration page
│       │   ├── Dashboard.jsx     # Dashboard page
│       │   ├── Expenses.jsx      # Expenses management page
│       │   ├── Budget.jsx        # Budget management page
│       │   ├── Reports.jsx       # Reports page
│       │   └── Profile.jsx       # User profile page
│       │
│       ├── context/
│       │   └── AuthContext.jsx   # Authentication context
│       │
│       ├── services/
│       │   └── api.js            # Axios configuration
│       │
│       ├── App.jsx               # Main app component with routing
│       ├── App.css               # Global styles
│       ├── main.jsx              # React entry point
│       └── index.css             # Base CSS
│
│   ├── .env                      # Environment variables (not in git)
│   ├── .env.example              # Environment variables template
│   ├── .gitignore                # Git ignore rules
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Vite configuration
│
└── README.md                     # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (MongoDB Atlas or local installation)
- Git
- VS Code (recommended)

### Clone the Repository

```bash
git clone https://github.com/yourusername/spendly.git
cd spendly
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Configure your `.env` file with your MongoDB connection string and JWT secret:
```env
PORT=5000
MONGO_URI=mongodb+srv://yourusername:yourpassword@cluster.mongodb.net/spendly
JWT_SECRET=your_secret_key_here
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. The frontend `.env` file is already configured for local development:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret key for JWT tokens | your_secret_key |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

---

## 🏃 Running the Application

### Running the Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Running the Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---



## 💾 Database Information

### MongoDB Models

#### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

#### Expense Model
```javascript
{
  userId: ObjectId (ref: User),
  amount: Number,
  category: String (enum),
  description: String,
  date: Date,
  paymentMethod: String (enum),
  createdAt: Date,
  updatedAt: Date
}
```

#### Budget Model
```javascript
{
  userId: ObjectId (ref: User),
  month: Number (1-12),
  year: Number,
  amount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Categories
- Food
- Transport
- Education
- Accommodation
- Mobile & Internet
- Shopping
- Entertainment
- Health
- Bills
- Other


---

## 🧪 Postman Testing

A Postman collection is available for testing all API endpoints.

### Import Collection
1. Open Postman
2. Click "Import" in the top left
3. Select the Postman collection JSON file
4. The collection will be imported with all endpoints

### Authentication Flow

1. **Register a new user**
   - Endpoint: `POST /api/auth/register`
   - Body: `{ "name": "John Doe", "email": "john@example.com", "password": "password123" }`
   - Response: Returns user data and JWT token

2. **Login**
   - Endpoint: `POST /api/auth/login`
   - Body: `{ "email": "john@example.com", "password": "password123" }`
   - Response: Returns user data and JWT token

3. **Use JWT Token**
   - Copy the token from the login response
   - Add it to the request headers: `Authorization: Bearer <your_token>`
   - All protected endpoints require this header

### Testing Protected Endpoints

For all expense, budget, dashboard, and report endpoints:
1. Ensure you have a valid JWT token
2. Add the Authorization header with your token
3. Send the request

### Example Request with Token
```
GET http://localhost:5000/api/expenses
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```


For questions or feedback, please open an issue on GitHub.

---

**Spendly – Track. Save. Spend Smart.** 💰
