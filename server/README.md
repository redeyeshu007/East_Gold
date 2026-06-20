# EastGold Admin API

Standalone backend (Node.js + Express + Mongoose) that powers the `/admin`
dashboard and serves the live gold rate to the website. Data is stored in
MongoDB (Atlas in production).

## Architecture (MVC)

```
server/
  index.js              app entry — connects DB, seeds, mounts routes
  config.js             env-backed configuration
  db.js                 Mongoose connection
  seed.js               idempotent seed (admin user + initial gold rate)
  models/               AdminUser, Enquiry, ContactRequest, GoldRate
  controllers/          authController, submissionController, goldRateController
  routes/               authRoutes, enquiryRoutes, contactRoutes, goldRateRoutes
  middleware/           auth (JWT), async-handler, error-handler
```

### Collections

| Collection         | Model          | Purpose                              |
| ------------------ | -------------- | ------------------------------------ |
| `admin_users`      | AdminUser      | Admin credentials (bcrypt-hashed)    |
| `users_enquiries`  | Enquiry        | Website consultation-form submissions|
| `contact_requests` | ContactRequest | Generic contact-us submissions       |
| `gold_rates`       | GoldRate       | Rate history (latest = current rate) |

## Run

```bash
cd server
cp .env.example .env     # set MONGODB_URI (Atlas) + JWT_SECRET
npm install
npm start                # or: npm run dev  (auto-restart)
npm run seed             # (optional) seed admin user + gold rate manually
```

The API listens on `http://localhost:3000`. The frontend's `apiClient` points at
`http://localhost:3000/api` (see root `.env.example` → `VITE_API_BASE_URL`).

On first boot the server seeds the admin user and an initial gold rate
automatically (idempotent — existing data is never overwritten).

## Endpoints

### Public

| Method | Path               | Body                                   |
| ------ | ------------------ | -------------------------------------- |
| GET    | `/api/gold-rate`   | —                                      |
| POST   | `/api/enquiries`   | `{ name, phone, email?, message?, … }` |
| POST   | `/api/contact`     | `{ name, phone, email?, message? }`    |

### Admin (require `Authorization: Bearer <token>`)

| Method | Path                     | Body                                |
| ------ | ------------------------ | ----------------------------------- |
| POST   | `/api/admin/login`       | `{ username, password }`            |
| GET    | `/api/admin/me`          | —                                   |
| PATCH  | `/api/admin/me`          | `{ name?, email?, password? }`      |
| GET    | `/api/enquiries`         | `?search=&status=`                  |
| GET    | `/api/enquiries/stats`   | —                                   |
| PATCH  | `/api/enquiries/:id`     | `{ status }` (New/Contacted/Closed) |
| DELETE | `/api/enquiries/:id`     | —                                   |
| GET    | `/api/gold-rate/history` | —                                   |
| PUT    | `/api/gold-rate`         | `{ oneGramRate, eightGramRate? }`   |

`/api/contact` exposes the same admin surface (`GET`, `/stats`, `PATCH`, `DELETE`).

## Admin credentials

Defaults (override with env vars in production):

- Username: `admin`
- Password: `admin@123`

## Configuration (env vars)

See `.env.example`. Key vars: `MONGODB_URI`, `JWT_SECRET`, `TOKEN_TTL`, `PORT`,
`CORS_ORIGINS`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`.
