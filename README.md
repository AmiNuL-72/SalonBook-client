# SalonBook — Salon Appointment Booking Platform (Client)

A modern, high-end salon appointment booking platform built with Next.js 16, TypeScript, Tailwind CSS, and Better Auth. Customers can explore bespoke salon services, book time slots without conflict, manage booking requests, and securely complete payments via Stripe. Administrators have access to full catalog control, appointment scheduling, registered customer moderation, and transaction logs.

---

## 🌟 Important Features

### 👤 Customer Experience
* **Luxury Salon Landing Experience:** Responsive hero banner, dynamic featured services, curated category showcases, verified client testimonials, and satisfaction statistics.
* **Browse & Filter Catalog:** Real-time search by service name, category filtering, and price sorting (Low to High / High to Low).
* **Protected Service Details:** Full treatment dossier with duration, pricing, procedure highlights, and an interactive appointment booking modal.
* **Smart Conflict Prevention:** Automatic detection and prevention of duplicate active appointments for the same date and time slot.
* **Customer Concierge Dashboard:**
  * Overview metrics (Total Requests, Pending, Confirmed, Cancelled).
  * My Appointments manager (view details, cancel pending requests, and pay for confirmed bookings).
  * Profile management with photo and contact updates.
* **Stripe Payment Integration:** Seamless redirection to Stripe Checkout with automated payment status confirmation.

### 🛡️ Admin Suite
* **Executive Overview Dashboard:** Live KPI cards for registered customers, active services, appointment requests, pending confirmations, confirmed bookings, and net revenue.
* **Service Management:** Full CRUD operations (Add Service with direct file image upload, Update Service, Delete Service, Activate/Deactivate visibility).
* **Appointment Operations:** Review customer notes, confirm pending bookings, and process cancellations.
* **Customer Moderation:** View registered customer records and toggle platform access (Block / Unblock).
* **Transaction Ledger:** Immutable audit trail displaying customer identities, services, Stripe Checkout Session IDs, and amounts.

---

## 🛠️ Technology Stack

* **Framework:** [Next.js 16](https://nextjs.org) (App Router, Turbopack, Partial Prefetching)
* **Language:** TypeScript
* **Styling:** [Tailwind CSS](https://tailwindcss.com) & Lucide Icons
* **Authentication:** Better Auth (Credential Login + Google OAuth)
* **Payment Processing:** Stripe Checkout & Webhook verification
* **Notifications:** React Hot Toast
* **HTTP Client:** Axios

---

## 🚀 Installation Instructions

### Prerequisites
* [Node.js](https://nodejs.org) (v18.18.0 or later recommended)
* npm, yarn, or pnpm

### Clone & Install
```bash
git clone <client-repo-url>
cd client
npm install
```

---

## 💻 How to Run the Project Locally

```bash
# Ensure the backend server is running on http://localhost:5000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

To generate an optimized production build:
```bash
npm run build
npm run start
```

---

## 🔐 Required Environment Variables

Create a `.env.local` file in the root of the client folder with the following keys (names only, never commit secret values):

```env
# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Better Auth Configuration
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth Credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# ImgBB API Key (Image Hosting)
NEXT_PUBLIC_IMGBB_API_KEY=
```

---

## 🌐 Project Links

* **Live Website Link:** [https://salonbook-as09.vercel.app/](https://salonbook-as09.vercel.app/)
* **Client GitHub Repository:** [https://github.com/AmiNuL-72/SalonBook-client](https://github.com/AmiNuL-72/SalonBook-client)
* **Server GitHub Repository:** [https://github.com/AmiNuL-72/SalonBook-server](https://github.com/AmiNuL-72/SalonBook-server)

---

## 📄 License
This project is developed for educational assessment under Programming Hero (Assignment 9 - Category 002).
