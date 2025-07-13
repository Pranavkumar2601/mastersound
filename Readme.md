# MasterSound

A full-stack, production-ready e-commerce site for audio enthusiasts—complete with product browsing, warranty registration, and a powerful admin panel.

---

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/backend-Node.js-green.svg)
![React](https://img.shields.io/badge/frontend-React-blue.svg)

---

## 🚀 Features

- **Global Navigation**  
  Home · Shop · E-Warranty · Admin · Contact  

- **Home**  
  Company landing page with mission statement and latest promotions.

- **Shop**  
  - Product listing with **search**, **sort**, **filters** (category, subcategory), and **pagination**  
  - Responsive grid layout  
  - Product detail view with image gallery  

- **E-Warranty**  
  - **Serial-number validation** (one-time use)  
  - Warranty registration form (name, email, phone)  
  - **Email confirmation** with registration details  

- **Contact**  
  - Public message form (name, email, message)  
  - Saved to database for admin review  

- **Admin Panel** (protected)  
  - **Category & Subcategory** management (CRUD)  
  - **Product** management (CRUD, multi-image upload, automated image compression, serial numbers)  
  - **Warranty** request queue (view, accept/reject, delete)  
  - Session-safe logout  
  - Live data tables with search & filters  

---

## 🛠️ Tech Stack

| Layer         | Technology / Library                                       |
|---------------|------------------------------------------------------------|
| **Frontend**  | React · Vite · React Router DOM · Tailwind CSS             |
| **Backend**   | Node.js · Express · MySQL (mysql2) · dotenv                |
| **Storage**   | Amazon S3 (multer-s3 · @aws-sdk/client-s3), AWS rds (MYSQL)|
| **Email**     | Nodemailer (SMTP)                                          |
| **Images**    | Sharp (image compression)  , S3                            |
| **Auth**      | JSON Web Tokens (JWT)                                      |

---

## 📂 Directory Structure

mastersound/
├── frontend/ # React + Vite SPA
│ ├── public/
│ ├── src/
│ │ ├── pages/
│ │ │ ├── Home.jsx
│ │ │ ├── Shop.jsx
│ │ │ ├── EWarranty.jsx
│ │ │ └── admin/
│ │ │ ├── Dashboard.jsx
│ │ │ ├── CategoryManagement.jsx
│ │ │ ├── ProductManagement.jsx
│ │ │ └── WarrantyRequests.jsx
│ │ ├── services/
│ │ │ └── api.js
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
├── backend/ # Express API + MySQL + SMTP + S3
│ ├── config/
│ │ └── db.js
│ ├── models/
│ │ ├── productModel.js
│ │ └── warrantyModel.js
│ ├── routes/
│ │ ├── categoryRoutes.js
│ │ ├── subcategoryRoutes.js
│ │ ├── productRoutes.js
│ │ └── warrantyRoutes.js
│ ├── uploads/ # Local uploads fallback (or S3 URLs in DB)
│ ├── server.js
│ └── package.json
└── README.md


---

## 📥 Getting Started

### Prerequisites

- **Node.js** (v16 or higher) & **npm**  
- **MySQL** server running  
- **AWS S3** bucket for product images  
- **SMTP** account for email notifications  

### Installation

1. **Clone the repo**  
   ```bash
   git clone https://github.com/yourusername/mastersound.git
   cd mastersound


cd backend
npm install
# Copy .env.example to .env and fill in your database, AWS, SMTP credentials
npm run dev

📝 License
This project is licensed under the MIT License.

Crafted with ❤️ by Pranav
MasterSound – where your audio experience is guaranteed!


