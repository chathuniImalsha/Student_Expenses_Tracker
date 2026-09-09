# Spendly Postman Collection

This document provides a comprehensive guide for testing the Spendly API using Postman.

## 📋 Table of Contents

- [Setup](#setup)
- [Authentication](#authentication)
- [Expenses](#expenses)
- [Budgets](#budgets)
- [Dashboard](#dashboard)
- [Reports](#reports)
- [Environment Variables](#environment-variables)

---

## 🔧 Setup

### 1. Import the Collection

1. Open Postman
2. Click "Import" in the top left corner
3. Select the JSON file or paste the collection JSON
4. The collection will be imported with all endpoints organized by category

### 2. Configure Environment

Create a new environment in Postman with the following variables:

| Variable | Initial Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:5000/api` | Base API URL |
| `token` | `` | JWT token (set after login) |

### 3. Collection JSON

Copy and paste this JSON into Postman to import the complete collection:

```json
{
  "info": {
    "name": "Spendly API",
    "description": "API collection for Spendly - Student Expense Tracker",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api",
      "type": "string"
    },
    {
      "key": "token",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/auth/register",
              "host": ["{{base_url}}"],
              "path": ["auth", "register"]
            },
            "description": "Register a new user account"
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            },
            "description": "Login with email and password. Returns JWT token."
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "var jsonData = pm.response.json();",
                  "pm.environment.set(\"token\", jsonData.data.token);"
                ],
                "type": "text/javascript"
              }
            }
          ]
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/auth/me",
              "host": ["{{base_url}}"],
              "path": ["auth", "me"]
            },
            "description": "Get current authenticated user details"
          }
        }
      ]
    },
    {
      "name": "Expenses",
      "item": [
        {
          "name": "Add Expense",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"amount\": 1500,\n  \"category\": \"Food\",\n  \"description\": \"Lunch at cafeteria\",\n  \"date\": \"2026-09-10\",\n  \"paymentMethod\": \"Cash\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/expenses",
              "host": ["{{base_url}}"],
              "path": ["expenses"]
            },
            "description": "Create a new expense"
          }
        },
        {
          "name": "Get Expenses",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/expenses?category=Food&paymentMethod=Cash&month=9&year=2026&sort=newest",
              "host": ["{{base_url}}"],
              "path": ["expenses"],
              "query": [
                {
                  "key": "category",
                  "value": "Food",
                  "description": "Filter by category"
                },
                {
                  "key": "paymentMethod",
                  "value": "Cash",
                  "description": "Filter by payment method"
                },
                {
                  "key": "month",
                  "value": "9",
                  "description": "Filter by month (1-12)"
                },
                {
                  "key": "year",
                  "value": "2026",
                  "description": "Filter by year"
                },
                {
                  "key": "sort",
                  "value": "newest",
                  "description": "Sort order: newest or oldest"
                }
              ]
            },
            "description": "Get all expenses with optional filters"
          }
        },
        {
          "name": "Get Single Expense",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/expenses/:id",
              "host": ["{{base_url}}"],
              "path": ["expenses", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "expense_id_here",
                  "description": "Replace with actual expense ID"
                }
              ]
            },
            "description": "Get a single expense by ID"
          }
        },
        {
          "name": "Update Expense",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"amount\": 2000,\n  \"category\": \"Food\",\n  \"description\": \"Lunch and dinner\",\n  \"date\": \"2026-09-10\",\n  \"paymentMethod\": \"Card\"\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/expenses/:id",
              "host": ["{{base_url}}"],
              "path": ["expenses", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "expense_id_here",
                  "description": "Replace with actual expense ID"
                }
              ]
            },
            "description": "Update an existing expense"
          }
        },
        {
          "name": "Delete Expense",
          "request": {
            "method": "DELETE",
            "header": [
              {
              "key": "Authorization",
              "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/expenses/:id",
              "host": ["{{base_url}}"],
              "path": ["expenses", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "expense_id_here",
                  "description": "Replace with actual expense ID"
                }
              ]
            },
            "description": "Delete an expense by ID"
          }
        }
      ]
    },
    {
      "name": "Budgets",
      "item": [
        {
          "name": "Create Budget",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"month\": 9,\n  \"year\": 2026,\n  \"amount\": 30000\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/budgets",
              "host": ["{{base_url}}"],
              "path": ["budgets"]
            },
            "description": "Create a monthly budget"
          }
        },
        {
          "name": "Get Budgets",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/budgets",
              "host": ["{{base_url}}"],
              "path": ["budgets"]
            },
            "description": "Get all budgets for the user"
          }
        },
        {
          "name": "Get Budget Details",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/budgets/:id",
              "host": ["{{base_url}}"],
              "path": ["budgets", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "budget_id_here",
                  "description": "Replace with actual budget ID"
                }
              ]
            },
            "description": "Get budget details with spending and remaining amount"
          }
        },
        {
          "name": "Update Budget",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"amount\": 35000\n}",
              "options": {
                "raw": {
                  "language": "json"
                }
              }
            },
            "url": {
              "raw": "{{base_url}}/budgets/:id",
              "host": ["{{base_url}}"],
              "path": ["budgets", ":id"],
              "variable": [
                {
                  "key": "id",
                  "value": "budget_id_here",
                  "description": "Replace with actual budget ID"
                }
              ]
            },
            "description": "Update budget amount"
          }
        }
      ]
    },
    {
      "name": "Dashboard",
      "item": [
        {
          "name": "Summary",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/dashboard/summary",
              "host": ["{{base_url}}"],
              "path": ["dashboard", "summary"]
            },
            "description": "Get dashboard summary statistics"
          }
        },
        {
          "name": "Category Summary",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/dashboard/category-summary",
              "host": ["{{base_url}}"],
              "path": ["dashboard", "category-summary"]
            },
            "description": "Get spending by category"
          }
        },
        {
          "name": "Monthly Summary",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/dashboard/monthly-summary",
              "host": ["{{base_url}}"],
              "path": ["dashboard", "monthly-summary"]
            },
            "description": "Get monthly spending trends"
          }
        },
        {
          "name": "Recent Expenses",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/dashboard/recent-expenses",
              "host": ["{{base_url}}"],
              "path": ["dashboard", "recent-expenses"]
            },
            "description": "Get 5 most recent expenses"
          }
        }
      ]
    },
    {
      "name": "Reports",
      "item": [
        {
          "name": "Monthly Report",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/reports/monthly?month=9&year=2026",
              "host": ["{{base_url}}"],
              "path": ["reports", "monthly"],
              "query": [
                {
                  "key": "month",
                  "value": "9",
                  "description": "Month (1-12)"
                },
                {
                  "key": "year",
                  "value": "2026",
                  "description": "Year"
                }
              ]
            },
            "description": "Get monthly spending report with analysis"
          }
        },
        {
          "name": "Export Report",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{base_url}}/reports/export?month=9&year=2026",
              "host": ["{{base_url}}"],
              "path": ["reports", "export"],
              "query": [
                {
                  "key": "month",
                  "value": "9",
                  "description": "Month (1-12), optional"
                },
                {
                  "key": "year",
                  "value": "2026",
                  "description": "Year, optional"
                }
              ]
            },
            "description": "Export expenses as CSV file"
          }
        }
      ]
    }
  ]
}
```

---

## 🔐 Authentication

### JWT Token Usage

All protected endpoints (Expenses, Budgets, Dashboard, Reports) require a valid JWT token in the Authorization header.

**Header Format:**
```
Authorization: Bearer <your_jwt_token>
```

### Authentication Flow

1. **Register** a new user (or use existing credentials)
2. **Login** to get the JWT token
3. The token is automatically saved to the environment variable `token` by the test script
4. Use the token in all subsequent requests

### Automatic Token Saving

The Login request includes a test script that automatically saves the token:

```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.data.token);
```

After logging in, the token will be available for all other requests.

---

## 💰 Expenses

### Categories
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

### Payment Methods
- Cash
- Card
- Bank Transfer
- Online Payment

### Example Requests

#### Add Expense
```json
{
  "amount": 1500,
  "category": "Food",
  "description": "Lunch at cafeteria",
  "date": "2026-09-10",
  "paymentMethod": "Cash"
}
```

#### Get Expenses with Filters
```
GET /api/expenses?category=Food&paymentMethod=Cash&month=9&year=2026&sort=newest
```

---

## 📈 Budgets

### Budget Fields
- `month`: Number (1-12)
- `year`: Number (e.g., 2026)
- `amount`: Number (budget amount in Rs.)

### Example Request

#### Create Budget
```json
{
  "month": 9,
  "year": 2026,
  "amount": 30000
}
```

---

## 📊 Dashboard

### Endpoints

1. **Summary** - Total spent, this month, today, remaining budget
2. **Category Summary** - Spending breakdown by category
3. **Monthly Summary** - Monthly spending trends over time
4. **Recent Expenses** - Last 5 expenses

All dashboard endpoints return aggregated data for analytics.

---

## 📋 Reports

### Monthly Report

Returns:
- Total spending
- Highest spending category
- Average daily spending
- Budget amount
- Remaining budget
- Category-wise spending breakdown

### CSV Export

Downloads a CSV file with all expenses for the specified month/year.

---

## 🌍 Environment Variables

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `base_url` | `http://localhost:5000/api` | API base URL |
| `token` | (auto-set) | JWT authentication token |

### Setting Up Environment

1. Click the gear icon (⚙️) in Postman
2. Click "Add"
3. Name the environment "Spendly"
4. Add the variables above
5. Select the environment from the dropdown in the top right

---

## 🧪 Testing Tips

1. **Start with Authentication**: Register/Login first to get the token
2. **Check Responses**: Verify the response format matches the expected structure
3. **Use Variables**: Replace hardcoded IDs with environment variables for reusability
4. **Test Error Cases**: Try invalid data to ensure proper error handling
5. **Test Filters**: Use various filter combinations in the expenses endpoint

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🔗 Common Issues

### 401 Unauthorized
- Token is missing or invalid
- Token has expired
- Solution: Login again to get a fresh token

### 404 Not Found
- Resource doesn't exist
- Invalid ID in URL parameters
- Solution: Verify the ID exists

### 400 Bad Request
- Invalid data format
- Missing required fields
- Solution: Check request body against schema

### 500 Server Error
- Server-side error
- Database connection issue
- Solution: Check server logs

---

## 📞 Support

For issues with the API or Postman collection, please refer to the main README.md or open an issue on GitHub.

---

**Spendly – Track. Save. Spend Smart.** 💰
