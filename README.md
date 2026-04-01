#  Admission Management System - Backend

##  Overview

This backend application is built for a simple Admission Management system. It allows colleges to manage programs, applicants, seat allocation, and admission confirmation with basic rules and validations.

---

##  Features

* Create programs with intake and quotas (KCET, COMEDK, Management)
* Manage applicants and their details
* Allocate seats based on quota availability
* Prevent seat overbooking
* Generate unique admission numbers
* Track document verification status
* Track fee status (Pending / Paid)
* Provide basic dashboard data

---

##  User Roles

* **Admin**

  * Create programs and define quotas

* **Admission Officer**

  * Add applicants
  * Allocate seats
  * Verify documents
  * Confirm admissions

* **Management**

  * View dashboard (read-only)

---

##  Key Rules

* Total quota must equal program intake
* Cannot allocate seat if quota is full
* Admission is confirmed only when fee is paid
* Admission number is generated only once

---

##  Tech Stack

* Node.js 
* Express.js (optional)
* Database: MongoDB 

---

## 📁 Project Structure

```
backend/
├── controllers/
├── routes/
├── models/
├── utils/
├── middleware/
│── .env
│── package.json
│── README.md
│── server.js
```

---

##  Installation & Setup

```bash
git clone https://github.com/navalrahman/edumerge_backend.git
cd edumerge_backend
npm install
npm run dev
```

---

##  Environment Variables

Create a `.env` file and add:
I already pushed the env file to the repo not ignored so no need to add again

```env
PORT=5000
DB_URL=your_database_url
JWT_SECRET=your_secret_key
```
---

##  Note

This is a minimal backend implementation created as part of an assignment. It focuses on core functionality and business rules without external integrations like payment gateways or messaging services.

---

