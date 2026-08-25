# KhananDrishti — खाननदृष्टि

### Smart Coal Mining Governance, Monitoring, Safety, Compliance & Transparency Platform

> Built for **Smart India Hackathon (SIH)** — a centralized, full-stack digital governance system for Coal India Limited (CIL) subsidiaries. Enables statutory compliance monitoring, role-based field inspections, geo-tagged audit logging, interactive GIS mapping, and AI-driven risk analytics under **Mines Act 1952** and **CMR 2017**.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite 6, Tailwind CSS 4, Leaflet / React-Leaflet, Lucide Icons, Motion |
| **Backend** | Node.js 24, Express 4 |
| **Database** | MongoDB (Mongoose 8 ODM) |
| **Auth** | JWT (`httpOnly` cookies) + bcryptjs + Rate Limiting |
| **AI Engine** | Google Gemini API (`@google/genai`) |
| **Audit** | SHA-256 cryptographic hash-chaining per inspection record |

---

## 📁 Project Structure

```
KhananDrishti/
├── package.json                 # Root — runs both services via concurrently
│
├── backend/                     # Node.js + Express REST API
│   └── src/
│       ├── config/              # DB connection, Gemini AI, environment config
│       │   ├── db.js
│       │   ├── gemini.js
│       │   └── index.js
│       ├── controllers/
│       │   ├── authController.js        # Register / Login / Logout / Me
│       │   ├── inspectionController.js  # Create & fetch field inspections
│       │   ├── aiController.js          # Gemini AI endpoints
│       │   ├── auditTrailController.js
│       │   ├── contractorsController.js
│       │   ├── minesController.js
│       │   └── violationsController.js
│       ├── middleware/
│       │   └── authMiddleware.js   # JWT protect + role-based authorize
│       ├── models/
│       │   ├── User.js             # User schema (roles, subsidiary, bcrypt)
│       │   ├── Inspection.js       # Field inspection records
│       │   ├── LoginLog.js         # Auth audit trail
│       │   ├── MineSite.js
│       │   ├── StatutoryViolation.js
│       │   ├── AuditLog.js
│       │   ├── ContractorRecord.js
│       │   └── FormBWorker.js
│       ├── routes/
│       │   ├── index.js            # Central route mount (/api)
│       │   ├── authRoutes.js       # /api/auth/*
│       │   └── inspectionRoutes.js # /api/inspections/*
│       ├── scripts/
│       │   └── seedInspectors.js   # Seed 4 field inspector accounts
│       ├── data/
│       │   └── seed.js             # General database seeder
│       └── server.js               # Express app entry point
│
├── frontend/                    # React (Vite) SPA
│   ├── index.html
│   ├── vite.config.js           # Dev proxy → backend :5000
│   └── src/
│       ├── main.jsx
│       ├── index.css
│       ├── App.jsx               # Root — AuthProvider + role-based routing
│       ├── context/
│       │   └── AuthContext.jsx    # Auth state, login/logout, cookie handling
│       ├── components/
│       │   ├── LoginPage.jsx           # Role-based statutory login gateway
│       │   ├── Header.jsx              # Navigation with role-based tab filtering
│       │   ├── InspectorDashboard.jsx  # Safety Officer restricted dashboard
│       │   ├── CommandHub.jsx          # Central command (admin)
│       │   ├── GisMineMap.jsx          # Interactive Leaflet GIS map
│       │   ├── FieldInspection.jsx     # Statutory checklist + geo-tagged form
│       │   ├── StatutoryRegisters.jsx  # Digital registers (Mines Act / CMR)
│       │   ├── AiSentinelOcr.jsx       # Gemini AI OCR & risk analysis
│       │   ├── ContractorPortal.jsx    # Contractor & Form-B management
│       │   └── WorkflowAuditTrail.jsx  # CAPA & SHA-256 audit trail
│       └── data/
│           ├── mockData.js        # Mine sites, violations, inspections
│           └── mockUsers.js       # Development user personas
└── scripts/
    └── migrate-ts-to-js.js
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB Atlas** cluster (with Network Access IP whitelisted)

### 1. Clone & install

```bash
git clone https://github.com/YOUR_USERNAME/KhananDrishti.git
cd KhananDrishti

npm install               # root (concurrently)
npm install --prefix backend
npm install --prefix frontend
```

### 2. Configure environment

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Fill in your values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.xxxxx.mongodb.net/KhananDrishti?retryWrites=true&w=majority&appName=Cluster0&family=4
JWT_SECRET=your_strong_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
```

### 3. Seed the database

```bash
# Run the master seed script to populate users, mines, violations, contractors, and workers
node backend/src/scripts/seedAll.js
```

### 4. Start development servers

```bash
npm run dev
```

This launches:

| Service | URL |
|---------|-----|
| Frontend (Vite) | `http://localhost:5173` |
| Backend API | `http://localhost:5000` |

---

## 🔐 Login Credentials

### Admin / Mine Official

| Role | Employee Code | Password | Subsidiary |
|------|--------------|----------|------------|
| Mine Official (GM) | `EIS-90214432` | `password123` | SECL |
| Director Technical (CIL HQ) | `EIS-80012904` | `password123` | CIL HQ |

### Field Inspectors (Safety Officers)

| Name | Employee Code | Password | Subsidiary |
|------|--------------|----------|------------|
| Er. Rajesh Verma | `INSP-SECL-001` | `inspect123` | SECL |
| Er. S. N. Mishra | `INSP-SECL-002` | `inspect123` | SECL |
| Er. Tanmay Ghosh | `INSP-ECL-001` | `inspect123` | ECL |
| Er. K. D. Pandey | `INSP-BCCL-001` | `inspect123` | BCCL |

> **Safety Officers** have restricted dashboard access — they can only see the **Field Inspection** form and the **GIS Spatial Map**. All other tabs are hidden.

---

## 🧩 Key Features

### 🔒 Authentication & Role-Based Access Control (RBAC)

- JWT tokens stored in `httpOnly` cookies (no localStorage)
- Password hashing with bcryptjs
- Login rate limiting via `express-rate-limit`
- Login audit trail stored in `LoginLog` collection
- Role-based navigation — `safety_officer` sees only their permitted tabs

### 🗺️ Interactive GIS Spatial Mapping

- Built with **React-Leaflet** and satellite tile layers
- Plots all CIL mine sites with real coordinates
- Statutory violation pins with severity indicators
- Slope stability radar telemetry overlay
- Environmental sensor markers (CAAQMS)
- 500m blasting danger zone circles
- Interactive "Feature Inspector" panel with real-time metadata

### 📋 Field Inspection Module (Fully Functional)

- **10 statutory checkpoints** based on real Indian coal mining laws:
  - Jan Vishwas (Amendment) Act, 2026
  - Mineral Concession (Amendment) Rules, 2022
  - Mineral Laws (Amendment) Ordinance, 2020
  - Coal Mines PF & Misc. Provisions Act, 1948
  - Coal Grading Board (Repeal) Act, 1959
  - Coal India (Regulation of Transfers & Validation) Act, 2000
  - Coal Mines (Special Provisions) Act, 2015
  - Colliery Control (Amendment) Rules, 2025
  - CPSU Land Use Policy Amendment
  - Coal Blocks Allocation Rules, 2017
- Each checkpoint can be marked **Pass**, **Observation**, or **Non-Compliant**
- Geo-tagged GPS coordinates auto-captured
- **Real camera/photo upload** — captures photos via device camera or file upload, stored as Base64 in the database
- Inspector name and designation auto-populated from session (read-only)
- Digital SHA-256 signature hash per submission
- Offline-first capability — queues submissions locally when network is unavailable
- All data persisted to MongoDB `inspections` collection with full timestamps

### 📊 Central Command Hub

- Pan-India mine overview dashboard with key KPIs
- Production metrics, safety compliance scores
- Subsidiary-level and mine-level drill-down

### ⚖️ Statutory Registers

- Digital registers under Mines Act 1952 and CMR 2017
- Structured statutory data views

### 🤖 AI Sentinel & OCR

- Gemini AI-powered endpoints:
  - `POST /api/ai/ocr-doc` — DGMS Notice OCR & Citation Extractor
  - `POST /api/ai/analyze-risk` — Slope radar & gas predictive index
  - `POST /api/ai/generate-atr` — Formal legal Action Taken Report drafting
  - `POST /api/ai/chat-copilot` — CMR 2017 & Mines Act statutory advisor

### 👷 Contractor & Form-B Portal

- Contractor registration and compliance tracking
- Form-B worker data management

### 🔗 Workflow & Audit Trail

- SHA-256 cryptographic hash-chained audit logs
- CAPA (Corrective and Preventive Action) tracking
- Tamper-proof compliance evidence

---

## 🗄️ Database Collections

| Collection | Description |
|------------|-------------|
| `users` | All user accounts (admins, officials, inspectors) |
| `inspections` | Field inspection form submissions with full checklist data |
| `loginlogs` | Authentication audit trail (success/failure + IP + user agent) |
| `minesites` | Mine site master data |
| `statutoryviolations` | Statutory violation records |
| `auditlogs` | SHA-256 hash-chained audit entries |
| `contractorrecords` | Contractor compliance data |
| `formbworkers` | Form-B worker registrations |

---

## 🔌 API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login & receive JWT cookie |
| GET | `/api/auth/logout` | Private | Clear JWT cookie |
| GET | `/api/auth/me` | Private | Get current user profile |

### Inspections (`/api/inspections`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/inspections` | `safety_officer` | Submit a new field inspection |
| GET | `/api/inspections` | `mine_official`, `CIL_HQ`, `safety_officer` | Fetch all inspections |
| GET | `/api/inspections/mine` | `safety_officer` | Fetch inspector's own inspections |
| GET | `/api/inspections/:id` | Private | Get single inspection by ID |

---

## 🏛️ Regulatory Framework

This platform is designed for compliance with:

- **Mines Act, 1952**
- **Coal Mines Regulations (CMR), 2017**
- **Jan Vishwas (Amendment of Provisions) Act, 2026**
- **Coal Mines (Special Provisions) Act, 2015**
- **Mineral Concession (Amendment) Rules, 2022**
- **Mineral Laws (Amendment) Ordinance, 2020**
- **Coal Mines PF & Misc. Provisions Act, 1948**
- **Colliery Control (Amendment) Rules, 2025**
- **Coal Blocks Allocation Rules, 2017**
- **DGMS Technical Circulars & Statutory Notices**
- **Coal India Limited Corporate Governance Guidelines**

---

## 📄 License

This project is developed for the **Smart India Hackathon (SIH)** — statutory governance use within Indian coal mining operations.