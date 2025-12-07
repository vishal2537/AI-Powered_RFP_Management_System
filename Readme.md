# 📘 AI-Powered RFP & Vendor Management System

A complete full-stack **AI-powered Request For Proposal (RFP) and Vendor Management System** designed to streamline procurement workflows.  
It includes:

✅ Create RFPs  
✅ Add Vendors  
✅ Send emails to vendors  
✅ Receive vendor quotations  
✅ Use AI to evaluate quotations  
✅ View vendor responses with a clean UI  


---

# 🚀 Features

### 📝 RFP Management

- Create RFPs
- Auto-structure RFP details

### 🧾 Vendor Management

- Add vendors with company details

### ✉️ Email Automation

- Send RFP emails directly to vendors and automatically assign

### 📥 Vendor Response Handling

- Read vendor replies from Gmail inbox
- Extract TEXT quotation
- Convert TEXT → JSON structure
- Save vendor response to DB
- Remove vendor email from pending list

### 🤖 AI Scoring Engine

Uses OpenAI to evaluate vendor quotes:

- Assigns score (0–100)
- Gives explanation based on alignment with RFP specs

### 🖥️ Frontend Dashboard (React + Zustand)

- View all RFPs
- Check vendor response status
- Open vendor quote modal
- Show structured quote + AI evaluation

---

# 📂 Project Structure
This project contains two main directories:
- /server → Backend (Node.js + Express)
- /client → Frontend (React)

---

# 📂 1. Clone Repository

```bash
git clone https://github.com/your-username/rfp-management-system.git
cd rfp-management-system
```

# ⚙️ 2. Backend Setup (Node.js + Express)
```bash 
cd backend 
npm i
```

# Create .env file inside /backend
```bash
PORT=8800
JWT_SECRET_KEY=anything
MONGODB_URL=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password
```

# Start Backend
```bash
npm start
```

# 🖥️ 3. Frontend Setup (React)
```bash
cd frontend
npm i
npm run dev
```

# Folder Structure
```bash 
AI-Powered_RFP_Management_System/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── dBConfig/
│   ├── index.js
│   └── package.json
|   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── store/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

# 📨 Email Setup (Nodemailer)
To send emails, you need a Gmail App Password:
- Go to Google Account
- Enable 2-Step Verification
- Go to App Passwords
- Generate a password
- Put in your .env:

```bash
MAIL_USER=your_email@gmail.com
MAIL_PASS=xxxx xxxx xxxx xxxx
```

# 🤖 AI Evaluation Setup

Used for scoring vendor quotations.
- Add your OpenAI API Key:

``` bash 
OPENAI_API_KEY=your_openai_key
