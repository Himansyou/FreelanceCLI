# API Contracts

All APIs are reached via the **API Gateway** at base URL `http://localhost:8080`.  
Gateway routes:

- `/auth/**` → Auth Service
- `/tracking/**` → Tracking Service  
- `/reports/**` → Report Service

---

## 1. Auth Service

Base path: `/auth`

### 1.1 Register

- **POST** `/auth/register`
- **Request body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

- **Response:** `201 Created`

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "createdAt": "2025-02-22T10:00:00Z"
}
```

- **Errors:** `400` if email already exists or validation fails.

### 1.2 Login

- **POST** `/auth/login`
- **Request body:**

```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

- **Response:** `200 OK`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "userId": "uuid"
}
```

- **Errors:** `401` for invalid credentials.

---

## 2. Tracking Service

Base path: `/tracking`

All tracking endpoints require **Authorization: Bearer &lt;JWT&gt;**.

### 2.1 Sync sessions (idempotent)

- **POST** `/tracking/sessions/sync`
- **Request body:** Array of sessions (client-generated ids for idempotency):

```json
{
  "sessions": [
    {
      "id": "client-generated-uuid",
      "projectId": "my-project",
      "startTime": "2025-02-22T09:00:00Z",
      "endTime": "2025-02-22T10:30:00Z",
      "durationMinutes": 90,
      "deviceId": "device-optional"
    }
  ]
}
```

- **Response:** `200 OK`

```json
{
  "synced": 2,
  "rejected": 0,
  "message": "OK"
}
```

- **Idempotency:** Same `id` sent again results in update or no-op, not duplicate rows.

### 2.2 List sessions (for Report service and Web)

- **GET** `/tracking/sessions?userId={userId}&projectId={projectId}&from={isoDate}&to={isoDate}`
- **Query params:**  
  - `userId` (required): from JWT or passed for same-user only.  
  - `projectId` (optional): filter by project.  
  - `from`, `to` (optional): inclusive date range (ISO date or datetime).
- **Response:** `200 OK`

```json
{
  "sessions": [
    {
      "id": "uuid",
      "userId": "uuid",
      "projectId": "my-project",
      "startTime": "2025-02-22T09:00:00Z",
      "endTime": "2025-02-22T10:30:00Z",
      "durationMinutes": 90,
      "deviceId": "device-optional",
      "createdAt": "2025-02-22T10:31:00Z"
    }
  ]
}
```

---

## 3. Report Service

Base path: `/reports`

Requires **Authorization: Bearer &lt;JWT&gt;**.  
Report service uses `userId` from JWT and optionally query params for project/date range. Results are **cached in Redis** (key includes userId, project, from, to). Cache is invalidated when new sessions are synced (e.g. TTL or explicit invalidation).

### 3.1 Summary report (cached)

- **GET** `/reports/summary?projectId={projectId}&from={isoDate}&to={isoDate}`
- **Query params:**  
  - `projectId` (optional): filter by project.  
  - `from`, `to` (optional): date range; default to last 30 days if omitted.
- **Response:** `200 OK`

```json
{
  "userId": "uuid",
  "projectId": "all",
  "from": "2025-02-01",
  "to": "2025-02-22",
  "totalMinutes": 1200,
  "sessionCount": 15,
  "byProject": [
    { "projectId": "project-a", "totalMinutes": 720, "sessionCount": 8 },
    { "projectId": "project-b", "totalMinutes": 480, "sessionCount": 7 }
  ],
  "sessions": []
}
```

- `sessions` can be included or omitted depending on contract (e.g. summary-only vs. detail); for charts, frontend may call both `/tracking/sessions` and `/reports/summary`.

---

## 4. CORS and Headers

- **Content-Type:** `application/json` for request/response bodies.
- **Authorization:** `Bearer <accessToken>` for protected endpoints.
- CORS: Gateway or each service should allow the Web origin (e.g. `http://localhost:3000`).

---

## 5. Example sequence (CLI sync)

1. **POST** `/auth/login` → get `accessToken`, `userId`.
2. **POST** `/tracking/sessions/sync` with `Authorization: Bearer <accessToken>` and body `{ "sessions": [ ... ] }`.
3. Report and Web then use **GET** `/tracking/sessions` and **GET** `/reports/summary` with the same token.
