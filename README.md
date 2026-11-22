# PizzaHub Client — Pizza Ordering & Delivery Platform

<p align="center">
  <strong>A modern, responsive frontend for connecting customers, pizza vendors, and platform administrators.</strong>
</p>

<p align="center">
  <a href="https://pizzahub-client-gold.vercel.app/">Live Application</a> ·
  <a href="https://github.com/Rawayan/pizzahub-server">Backend Repository</a>
</p>

---

## Project Description

### The Problem PizzaHub Solves

Ordering pizza online can be inconvenient when customers have to depend on disconnected ordering channels, contact restaurants manually, or struggle to track the progress of their orders. At the same time, independent pizza vendors often lack an organized digital platform to manage their restaurant profiles, menus, incoming orders, and business growth. Platform administrators also need a centralized way to oversee users, menu listings, and transactions.

**PizzaHub addresses these problems by providing one centralized, role-based pizza ordering and delivery platform.**

It gives customers a convenient way to discover pizza options, place orders, and follow order progress. Vendors get a dedicated dashboard to manage their restaurants, menus, and orders, while administrators can monitor and manage the platform from a centralized dashboard.

The result is a more organized ordering experience for customers, simpler daily operations for vendors, and better platform management for administrators.

## Live Application

- **Frontend:** https://pizzahub-client-gold.vercel.app/
- **Backend API:** https://pizzahub-server-puce.vercel.app/

## Related Repository

- **Client:** https://github.com/Rawayan/pizzahub-client
- **Server:** https://github.com/Rawayan/pizzahub-server

## User Roles and Features

### Customer
- Browse available pizza menu items.
- Search, filter, and sort menu items.
- View individual menu item details.
- Place orders with delivery information and preferred delivery dates.
- Track order status through an order status timeline.
- Cancel pending orders.
- View customer dashboard and order history.
- Manage profile information.

### Vendor
- Access a dedicated vendor dashboard.
- Manage restaurant profile information.
- Create, update, and delete menu items.
- Manage incoming customer orders.
- Accept or reject orders.
- View subscription status and transaction history.
- Upgrade to a Premium subscription through Stripe Checkout.
- Manage an existing subscription through the billing portal.

### Administrator
- Access the admin dashboard.
- Manage customers and vendors.
- Review and manage menu items.
- Monitor platform transactions.

## Premium Vendor Features

PizzaHub offers a Premium subscription for vendors.

Premium benefits include:
- Unlimited active menu items.
- Featured placement on the homepage.
- Premium badge.

Premium subscription payments are handled through Stripe. The frontend does not independently activate Premium status; activation depends on backend verification of Stripe webhook events.

## Main Frontend Features

- Role-based dashboards and navigation.
- Authentication interface with email/password and Google OAuth support.
- Responsive layouts for desktop, tablet, and mobile.
- Menu browsing, searching, filtering, and sorting.
- Customer order management.
- Vendor menu and order management.
- Admin management interface.
- Premium subscription interface.
- Payment success and cancellation pages.
- Profile management.
- Dark and light theme support.
- Order status timeline.
- Loading, error, and notification interfaces.

## Technology Stack

- **Framework:** Next.js 16
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI / Base UI
- **Authentication:** Better Auth
- **Form Management:** React Hook Form
- **Validation:** Zod
- **Charts:** Recharts
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** Sonner
- **Theme Management:** next-themes
- **HTTP Client:** Axios

## Project Structure

The client repository contains the frontend application.

```text
pizzahub-client/
├── components/
│   └── ui/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   └── ...
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Installation and Local Setup

### Prerequisites

- Node.js
- npm
- Git
- Access to the PizzaHub backend API
- MongoDB configuration required by Better Auth

### 1. Clone the repository

```bash
git clone https://github.com/Rawayan/pizzahub-client.git
cd pizzahub-client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

Use `.env.example` as the reference:

```env
BETTER_AUTH_SECRET=replace_with_a_random_secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

MONGODB_URI=your_mongodb_connection_string
DB_NAME=pizzahub

NEXT_PUBLIC_API_URL=http://localhost:5000
```

Replace the placeholders with your own configuration. Never commit actual credentials.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Make sure the PizzaHub server is running separately.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Backend Integration

The frontend communicates with the separate PizzaHub Express API.

Local API URL:

```text
http://localhost:5000
```

Production API URL:

```text
https://pizzahub-server-puce.vercel.app
```

The frontend uses the `NEXT_PUBLIC_API_URL` environment variable to configure the API base URL.

## Deployment

The client application is deployed on Vercel.

**Production URL:** https://pizzahub-client-gold.vercel.app/

Configure the required production environment variables in the Vercel project before deployment.

## Security Notes

- Never commit `.env.local` or files containing real credentials.
- Keep authentication secrets and OAuth credentials private.
- Protected actions must be authorized by the backend.
- Frontend success pages must not be treated as proof of successful subscription payment.
- Stripe subscription activation is controlled by verified backend webhook processing.

## Author

**GitHub:** https://github.com/Rawayan

## License

This project was developed as an academic assignment. No separate open-source license is specified.
