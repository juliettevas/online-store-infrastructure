# online-store-infrastructure
Online store for innovative electronics where users can register, browse products, place orders, and track shipments - built with modular architecture and cloud integrations.
# Online Store for Innovative Electronics

![Infrastructure Diagram](docs/infrastructure.png)

## Project Description
An online store for innovative electronics such as drones, 3D printers, and robotics.  
Users can register, browse products, place orders, and track deliveries through a simple and modern interface.  
The system integrates secure payments, delivery, and communication APIs, demonstrating scalable cloud architecture and structured data design.

---

## Project Features
- User registration and authentication (Auth0)
- Product search and catalog browsing
- Order placement, payment, and delivery tracking
- Personal user profile management
- Website administration and order management

---

## Infrastructure Overview
The application is built around a **client-server-database** model with multiple third-party integrations.

### Components
- **Clients:** Web, iOS, Android apps (HTTP/JSON communication)
- **Server:** Cloud-hosted backend handling business logic
- **Database:** Relational (MySQL / AWS RDS)
- **Third-Party APIs:**
  - Auth0 → Authentication & JWT
  - Stripe → Payments
  - DHL → Delivery tracking
  - SendGrid → Email notifications
  - Twilio → SMS notifications

This architecture ensures scalability, modularity, and separation of concerns.

---

## Database Structure (Simplified)

| Table | Key Fields | Description |
|--------|-------------|-------------|
| **users** | id, email, password_hash, role | User accounts |
| **products** | id, category_id, name, price, status | Product catalog |
| **orders** | id, user_id, total, status | Customer orders |
| **order_items** | id, order_id, product_id, qty | Items in each order |
| **payments** | id, order_id, provider, status | Payment records |
| **shipments** | id, order_id, provider, tracking_number | Delivery info |
| **reviews** | id, product_id, user_id, rating | Product reviews |

**Storage & Backup:**  
RDS automated daily backups, point-in-time recovery, and S3 storage for static assets (images).

---

## API Endpoints (REST Example)

| Method | Endpoint | Description | Auth |
|---------|-----------|--------------|------|
| POST | /v1/auth/register | Register new user | Public |
| POST | /v1/auth/login | Login (JWT) | Public |
| GET | /v1/products | List all products | Public |
| GET | /v1/products/:id | Get product details | Public |
| POST | /v1/orders | Create order | User |
| GET | /v1/orders/:id | View order details | User |
| POST | /v1/payments/:order_id/intents | Create Stripe payment intent | User |
| POST | /v1/payments/webhook | Payment webhook (Stripe → Server) | Public |
| POST | /v1/shipments/webhook | Delivery webhook (DHL → Server) | Public |

---

## Technologies Used
- **Backend:** Node.js / Express *(example stack)*
- **Hosting**: Vercel (serverless functions)
- **Database:** Supabase
- **Storage:** Supabase 
- **Auth:** Auth0 / JWT
- **Payments:** Stripe API
- **Delivery:** DHL API
- **Notifications:** SendGrid (email), Twilio (SMS)CURRENT TECHNOLOGY STACK

---

## Author
Created by [**Yulia Vasylenko**](https://www.linkedin.com/in/yuliavasylenko)  
Technical Project Manager & Delivery Lead — bridging product and engineering through structured, scalable systems.

![status](https://img.shields.io/badge/status-completed-green)
![tech](https://img.shields.io/badge/platform-AWS-blue)
![docs](https://img.shields.io/badge/docs-Markdown-lightgrey)

