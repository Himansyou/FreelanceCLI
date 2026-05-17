# Sample Data

## 1. Create a user and get token

```bash
# Register (or use Postman)
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"freelancer@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"freelancer@example.com","password":"secret123"}'
# Save the accessToken from the response.
```

## 2. Sync sample sessions (replace TOKEN)

```bash
export TOKEN="<paste accessToken here>"

curl -X POST http://localhost:8080/tracking/sessions/sync \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
  "sessions": [
    {
      "id": "11111111-1111-1111-1111-111111111101",
      "projectId": "website-redesign",
      "startTime": "2025-02-20T09:00:00Z",
      "endTime": "2025-02-20T11:30:00Z",
      "durationMinutes": 150,
      "deviceId": "cli-laptop"
    },
    {
      "id": "11111111-1111-1111-1111-111111111102",
      "projectId": "website-redesign",
      "startTime": "2025-02-21T14:00:00Z",
      "endTime": "2025-02-21T16:00:00Z",
      "durationMinutes": 120,
      "deviceId": "cli-laptop"
    },
    {
      "id": "11111111-1111-1111-1111-111111111103",
      "projectId": "api-backend",
      "startTime": "2025-02-22T10:00:00Z",
      "endTime": "2025-02-22T12:45:00Z",
      "durationMinutes": 165,
      "deviceId": "cli-laptop"
    }
  ]
}'
```

## 3. CLI workflow

```bash
# Login (interactive)
freelance login freelancer@example.com --password secret123

# Start session
freelance start website-redesign

# ... work ...

# Stop session
freelance stop

# Local report
freelance report
freelance report website-redesign --from 2025-02-20 --to 2025-02-22

# Sync to backend
freelance sync
```

## 4. Example API responses

**GET /reports/summary** (after syncing above):

```json
{
  "userId": "<uuid>",
  "projectId": "all",
  "from": "2025-02-01",
  "to": "2025-02-22",
  "totalMinutes": 435,
  "sessionCount": 3,
  "byProject": [
    { "projectId": "website-redesign", "totalMinutes": 270, "sessionCount": 2 },
    { "projectId": "api-backend", "totalMinutes": 165, "sessionCount": 1 }
  ]
}
```
