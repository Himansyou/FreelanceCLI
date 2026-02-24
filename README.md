# FreelanceCLI

A **distributed activity logging and analytics system** for freelancers: log work sessions via a CLI (offline-first), sync to a backend, and view reports on a web platform.

## Features

- **CLI**: `freelance login`, `start <project>`, `stop`, `report [project]`, `sync` — local SQLite storage, idempotent sync
- **Backend**: Modular Spring Boot microservices (Auth, Tracking, Report), API Gateway, PostgreSQL per service, Redis caching
- **Web**: React app — login, view sessions, report with charts

## Architecture

- [Architecture overview](docs/ARCHITECTURE.md)
- [Database design](docs/DATABASE.md)
- [API contracts](docs/API.md)
- [Mermaid diagrams](docs/architecture-diagram.md)
- [Sample data & examples](docs/sample-data.md)

## Prerequisites

- **Java 17**
- **Node.js 18+** (for web)
- **PostgreSQL** (2 instances: auth_db, tracking_db) — or use Docker
- **Redis** (for report cache)
- **Gradle** (for backend; or use IDE)

## Quick start (local, without Docker)

### 1. Databases and Redis

- Start PostgreSQL: create databases `auth_db` (port 5432) and `tracking_db` (port 5433), or use two instances.
- Start Redis on port 6379.

### 2. Backend

From project root, build and run each service (in separate terminals), or run from your IDE.

```bash
# Option A: If you have Gradle installed
cd backend
gradle :auth-service:bootRun      # port 8081
gradle :tracking-service:bootRun  # port 8082
gradle :report-service:bootRun    # port 8083
gradle :api-gateway:bootRun        # port 8080
```

**Option B:** Open `backend` as a Gradle project in IntelliJ and run each `*Application` main class.  
Ensure `application.yml` in each service points to your PostgreSQL and (for report-service) Redis.

- **Auth**: `spring.datasource.url=jdbc:postgresql://localhost:5432/auth_db`
- **Tracking**: `spring.datasource.url=jdbc:postgresql://localhost:5433/tracking_db`
- **Report**: `spring.data.redis.host=localhost`, `tracking.base-url=http://localhost:8082`
- **Gateway**: routes to localhost:8081, 8082, 8083 (default).

### 3. CLI

```bash
cd CLI
./gradlew run --args="login user@example.com --password secret"
./gradlew run --args="start my-project"
./gradlew run --args="stop"
./gradlew run --args="report"
./gradlew run --args="sync"
```

Or build and run the installed script:

```bash
./gradlew installDist
./build/install/CLI/bin/CLI login ...
./build/install/CLI/bin/CLI start my-project
# etc.
```

### 4. Web

```bash
cd web
npm install
npm run dev
# Open http://localhost:3000 — set VITE_API_URL=http://localhost:8080 if needed
```

## Quick start (Docker)

From project root:

```bash
docker-compose up -d
```

This starts:

- PostgreSQL (auth) on 5432, PostgreSQL (tracking) on 5433
- Redis on 6379
- Auth service (8081), Tracking (8082), Report (8083), API Gateway (8080)

Then run CLI and Web locally as above; use `http://localhost:8080` as API base.

## API examples

- **Register**: `POST http://localhost:8080/auth/register`  
  Body: `{"email":"user@example.com","password":"password123"}`
- **Login**: `POST http://localhost:8080/auth/login`  
  Body: `{"email":"user@example.com","password":"password123"}`  
  Response: `accessToken`, `userId`
- **Sync sessions**: `POST http://localhost:8080/tracking/sessions/sync`  
  Header: `Authorization: Bearer <token>`  
  Body: `{"sessions":[{"id":"uuid","projectId":"x","startTime":"...","endTime":"...","durationMinutes":90,"deviceId":"..."}]}`
- **Report**: `GET http://localhost:8080/reports/summary?from=2025-02-01&to=2025-02-28`  
  Header: `Authorization: Bearer <token>`

See [docs/API.md](docs/API.md) and [docs/sample-data.md](docs/sample-data.md) for full contracts and sample payloads.

## Postman

Import [postman/FreelanceCLI-API.postman_collection.json](postman/FreelanceCLI-API.postman_collection.json). Set `baseUrl` to `http://localhost:8080`. Run **Login** first; the collection script saves `token` for subsequent requests.

## Testing

- **Backend**: `cd backend && gradle test` (Auth and Tracking have JUnit tests; use H2 in tests).
- **CLI**: `cd CLI && ./gradlew test`

## Project layout

```
FreelanceCLI/
├── CLI/                 # Java CLI (Picocli, SQLite)
├── backend/
│   ├── api-gateway/     # Spring Cloud Gateway :8080
│   ├── auth-service/   # JWT, PostgreSQL auth_db
│   ├── tracking-service/  # Sessions, PostgreSQL tracking_db
│   └── report-service/ # Reports, Redis cache
├── web/                 # React (Vite) frontend
├── docs/                # Architecture, DB, API, sample data
├── postman/             # Postman collection
└── docker-compose.yml
```

## Constraints and tech stack

- **Java 17**, **Spring Boot 3**, **React**, **PostgreSQL**, **Redis**
- SOLID, readable and commented code; no over-engineering
- Runnable on a single machine (local or Docker)

## License

MIT (or as specified in the repo).
