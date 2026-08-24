# KhananDrishti — खाननदृष्टि
### AI-Powered Smart Governance & Compliance Platform for Indian Coal Mining

> A centralized, full-stack digital governance system built for Coal India Limited (CIL) subsidiaries, enabling statutory compliance monitoring, geo-tagged field inspections, AI-driven risk analytics, and cryptographically audited regulatory workflows — all under Mines Act 1952 and CMR 2017.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 (JSX), Vite, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (JSON Web Tokens) + bcryptjs |
| **AI** | Google Gemini API |
| **Audit** | SHA-256 cryptographic hash-chaining |

---

## 📁 Project Structure

```
KhananDrishti/
├── frontend/               # React JSX frontend (Vite)
│   ├── src/
│   │   ├── components/     # UI components (Login, Dashboard, Maps, etc.)
│   │   ├── data/           # Mock data for development
│   │   └── main.jsx        # App entry point
│   ├── index.html
│   └── vite.config.js
│
├── backend/                # Node.js + Express REST API
│   ├── src/
│   │   ├── config/         # DB, Gemini AI, environment config
│   │   ├── controllers/    # Auth, Mines, Inspections, AI, Audit
│   │   ├── models/         # Mongoose schemas (User, MineSite, etc.)
│   │   ├── routes/         # Express API routes
│   │   └── data/seed.js    # Database seeder with test users
│   └── src/server.js       # Express app entry point
│
├── scripts/                # Utility scripts
└── package.json            # Root orchestration (runs both services)
```

---

## 🚀 Running Locally

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** running locally on port `27017`

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/KhananDrishti.git
cd KhananDrishti
```

### 2. Install all dependencies
```bash
npm install             # root dependencies
npm install --prefix frontend
npm install --prefix backend
```

### 3. Configure environment variables

**Backend** — create `backend/.env` from the example:
```bash
cp backend/.env.example backend/.env
```
Then fill in your values:
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/khanandrishti
JWT_SECRET=your_strong_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Seed the database with test users
```bash
npm run seed --prefix backend
```

### 5. Start both frontend & backend together
```bash
npm run dev
```

This starts:
- **Frontend** → `http://localhost:5173`
- **Backend API** → `http://localhost:5002`

---

## 🔐 Test Login Credentials

| Role | Employee Code | Password | Subsidiary |
|------|--------------|----------|------------|
| Mine Official (GM) | `EIS-90214432` | `password123` | SECL |
| Director Technical (CIL HQ) | `EIS-80012904` | `password123` | CIL HQ |

---

## 🧩 Key Features

- **🔒 Secure JWT Auth** — Role-based login with bcrypt password hashing, dynamic CAPTCHA, and 8-hour session tokens
- **🗺️ GIS Mine Map** — Geo-tagged mine site visualization with violation overlays
- **📋 Field Inspection Module** — Offline-capable statutory inspection forms with digital signatures
- **⚖️ Statutory Registers** — Digital registers under Mines Act 1952 and CMR 2017
- **🤖 AI Sentinel** — Gemini-powered OCR for DGMS notices, risk analysis, and ATR drafting
- **👷 Contractor Labour Portal** — Form-B worker registration and contractor compliance tracking
- **🔗 Workflow Audit Trail** — SHA-256 cryptographic hash-chained immutable audit logs

---

## 🏛️ Regulatory Compliance

This platform is designed for use within the framework of:
- Mines Act, 1952
- Coal Mines Regulations (CMR), 2017
- DGMS Circulars & Statutory Notices
- Coal India Limited Corporate Governance Guidelines

---

## 📄 License

This project is developed for statutory governance use within Indian coal mining operations.