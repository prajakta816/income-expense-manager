# FinanceTracker — Income & Expense Manager

FinanceTracker is a simple, modern web application designed to help users take control of their personal finances. It allows users to track their daily income and expenses, calculate real-time net balances, filter transaction histories, and manage user accounts through a dedicated admin panel.


##  Folder Structure

income-expense-manager/
│
└── web/
    ├── index.html            # Public landing page
    ├── login.html            # User & admin login page
    ├── register.html         # New user registration page with validation
    ├── user-dashboard.html   # Personal finance dashboard (income, expense, transactions)
    ├── dashboard.html        # Admin dashboard overview
    ├── users.html            # Admin user management panel
    │
    ├── css/
    │   └── style.css         # Global styling, theme colors, and responsive layouts
    │
    ├── js/
    │   ├── login.js          # Authentication and login validation logic
    │   ├── register.js       # Form validation and user registration logic
    │   ├── user-dashboard.js # Income/expense CRUD, filtering, & summary calculations
    │   ├── dashboard.js      # Admin stats and overview logic
    │   ├── users.js          # User management table rendering & actions
    │   └── user.js           # Shared user utilities and session handling
    │
    └── assets/
        └── images/           # Application logos, branding, and images

![alt text](<landing page-1.png>)
![alt text](<register page.png>)
![alt text](<login page.png>)
![alt text](<user dashboard.png>)
![alt text](<admin users.png>)
![alt text](<admin dashboard.png>)

##  Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **UI Framework:** Bootstrap 5 & Bootstrap Icons
- **Typography:** Inter (Google Fonts)
- **Storage:** LocalStorage / Client-side state

## How to Run

1. Clone or download this repository.
2. Open `web/index.html` in any modern web browser (or use a live server extension in your editor).
3. Register a new account or log in to explore the features!
