# Architecture Diagram (Mermaid)

## System Context

```mermaid
flowchart TB
    subgraph Clients
        CLI[CLI Client\nJava + SQLite]
        Web[Web App\nReact]
    end

    subgraph Gateway
        GW[API Gateway\n:8080]
    end

    subgraph Backend["Backend Services"]
        Auth[Auth Service\nJWT]
        Track[Tracking Service\nSessions]
        Report[Report Service\nCached Reports]
    end

    subgraph Data
        Redis[(Redis\nCache)]
        AuthDB[(auth_db\nPostgreSQL)]
        TrackDB[(tracking_db\nPostgreSQL)]
    end

    CLI -->|HTTPS /sync, /auth| GW
    Web -->|HTTPS /auth, /reports, /tracking| GW
    GW --> Auth
    GW --> Track
    GW --> Report
    Auth --> AuthDB
    Track --> TrackDB
    Report --> Redis
    Report -->|HTTP| Track
```

## Sync Flow (Offline-First)

```mermaid
sequenceDiagram
    participant CLI
    participant SQLite
    participant Gateway
    participant Tracking
    participant DB

    CLI->>SQLite: start session / stop session
    SQLite->>SQLite: store session (synced=0)
    CLI->>CLI: freelance sync
    CLI->>SQLite: get unsynced sessions
    CLI->>Gateway: POST /tracking/sessions/sync + JWT
    Gateway->>Tracking: forward
    Tracking->>DB: upsert by session id (idempotent)
    Tracking-->>CLI: 200 { synced: n }
    CLI->>SQLite: set synced=1 for sent ids
```

## Report Caching

```mermaid
sequenceDiagram
    participant Web
    participant Gateway
    participant Report
    participant Redis
    participant Tracking

    Web->>Gateway: GET /reports/summary?from=&to=
    Gateway->>Report: forward + JWT
    Report->>Redis: get cache key
    alt cache hit
        Redis-->>Report: cached JSON
        Report-->>Web: 200 cached
    else cache miss
        Report->>Tracking: GET /tracking/sessions?userId=&from=&to=
        Tracking-->>Report: sessions
        Report->>Report: compute summary
        Report->>Redis: set key, TTL 300s
        Report-->>Web: 200
    end
```

## Database per Service

```mermaid
erDiagram
    AUTH_DB ||--o{ users : ""
    users {
        uuid id PK
        varchar email UK
        varchar password_hash
        timestamp created_at
    }

    TRACKING_DB ||--o{ sessions : ""
    sessions {
        uuid id PK
        uuid user_id
        varchar project_id
        timestamp start_time
        timestamp end_time
        int duration_minutes
        varchar device_id
        timestamp created_at
    }

    ReportService ..> Redis : "cache"
    ReportService ..> TrackingService : "HTTP"
```
