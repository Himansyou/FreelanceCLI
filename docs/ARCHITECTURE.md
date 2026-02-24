# FreelanceCLI – Architecture

## 1. High-Level Overview

FreelanceCLI is a **distributed activity logging and analytics system** with:

- **CLI client**: Offline-first session logging with local SQLite and sync to backend.
- **Backend**: Modular Spring Boot microservices (Auth, Tracking, Report) behind an API Gateway.
- **Web platform**: React SPA for login, viewing sessions, and reports with charts.

```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                        CLIENT LAYER                          │
                    │  ┌─────────────┐                    ┌─────────────────────┐  │
                    │  │  CLI (Java) │                    │  Web (React)        │  │
                    │  │  SQLite     │                    │  Browser            │  │
                    │  └──────┬──────┘                    └──────────┬──────────┘  │
                    └─────────┼──────────────────────────────────────┼─────────────┘
                              │ sync / API                           │ API
                              ▼                                      ▼
                    ┌─────────────────────────────────────────────────────────────┐
                    │                     API GATEWAY (Spring Cloud Gateway)       │
                    │                     Single entry point, port 8080            │
                    └─────────────────────────────────────────────────────────────┘
                              │              │              │
              ┌───────────────┼──────────────┼──────────────┼───────────────┐
              ▼               ▼              ▼              ▼               ▼
     ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
     │ Auth Service │ │Tracking Svc  │ │ Report Svc   │ │ Redis        │
     │ JWT login    │ │ Sessions     │ │ Reports      │ │ Cache        │
     │ signup       │ │ Idempotent   │ │ Cached       │ │              │
     └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────────────┘
            │                │                │
            ▼                ▼                │
     ┌──────────────┐ ┌──────────────┐       │ (calls Tracking + Redis)
     │ auth_db      │ │ tracking_db  │       │
     │ (PostgreSQL) │ │ (PostgreSQL) │       │
     └──────────────┘ └──────────────┘       └──────────────────────────
```

## 2. Design Principles

- **Offline-first CLI**: Sessions stored locally; sync is asynchronous and idempotent.
- **Database per service**: Auth and Tracking each have their own PostgreSQL database.
- **Report service**: Stateless; fetches data from Tracking API and caches results in Redis; cache invalidated on new session.
- **Single entry point**: All client traffic goes through the API Gateway (routing to Auth, Tracking, Report).
- **SOLID and modular**: Clear boundaries, interfaces for external dependencies, testable units.

## 3. Component Responsibilities

| Component       | Responsibility |
|----------------|----------------|
| **CLI**        | Login (store token), start/stop sessions, local SQLite storage, idempotent sync of pending sessions. |
| **API Gateway**| Route `/auth/*`, `/tracking/*`, `/reports/*`; optional rate limiting / CORS. |
| **Auth Service** | User registration, login, JWT issuance and validation. |
| **Tracking Service** | Accept synced sessions (idempotent by client session id), store in PostgreSQL, expose query API. |
| **Report Service** | Aggregate data from Tracking API, cache in Redis, invalidate on new session. |
| **Redis**      | Cache report responses; key pattern e.g. `report:{userId}:{project}:{from}:{to}`. |

## 4. Data Flow

- **Login**: CLI/Web → Gateway → Auth → JWT returned; CLI stores token (and optionally user id) locally.
- **Sync**: CLI reads unsynced sessions from SQLite → POST to Gateway → Tracking; Tracking uses `session.id` (or client-generated id) for idempotency; CLI marks sessions as synced.
- **Report**: Web/CLI → Gateway → Report → (check Redis) → if miss, call Tracking API → cache and return; on new session, Tracking notifies Report (or Report invalidates by pattern) to evict cache.

Cache invalidation: When Tracking saves a new session, it publishes an event (e.g. Redis pub/sub or HTTP callback) or Report service uses short TTL; for simplicity we use **TTL-based expiry** (e.g. 5 minutes) and optional invalidation by key when Tracking receives a new session (Report exposes an internal invalidation endpoint or uses Redis pub/sub).

## 5. Technology Stack

- **CLI**: Java 17, Picocli, SQLite (via JDBC), OkHttp, Jackson.
- **Backend**: Java 17, Spring Boot 3.x, Spring Security (JWT), Spring Data JPA, Spring Cloud Gateway (or Gateway pattern with RestTemplate/WebClient).
- **Databases**: PostgreSQL per service (Auth, Tracking).
- **Cache**: Redis for report caching.
- **Web**: React 18, fetch/axios, charting library (e.g. Recharts).
- **Deployment**: Docker Compose for local run (PostgreSQL x2, Redis, Gateway, Auth, Tracking, Report).

## 6. Security

- Passwords hashed with BCrypt in Auth Service.
- JWT in Authorization header; Gateway or each service validates JWT (shared secret or public key).
- No sensitive data in logs; session data scoped by `user_id`.

## 7. Folder Structure (Target)

```
FreelanceCLI/
├── CLI/                    # Java CLI client
│   ├── src/main/java/.../
│   └── build.gradle.kts
├── backend/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── tracking-service/
│   ├── report-service/
│   └── docker-compose.yml  # or at repo root
├── web/                    # React frontend
│   ├── src/
│   └── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   └── architecture-diagram.md (Mermaid)
├── postman/                # Postman collection + env
└── README.md
```
