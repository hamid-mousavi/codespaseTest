# API Contract - Coop Backend

Base URL: `/api`

Common Error Response:

```json
{
  "message": "Human-readable error",
  "details": "optional details"
}
```

1) Auth

- POST `/api/auth/login`
  - Request:
    ```json
    { "username": "admin", "password": "admin" }
    ```
  - Response 200:
    ```json
    { "accessToken": "<jwt>", "refreshToken": "<token>", "expiresAt": "2025-12-31T12:00:00Z" }
    ```

2) Members

- GET `/api/members?page=1&pageSize=20` (Requires Authorization)
  - Response 200: `[ { "id": "guid", "fullName": "...", "nationalCode": "..." } ]`

- GET `/api/members/{id}`
  - Response 200:
    ```json
    { "id": "guid", "fullName": "...", "nationalCode": "..." }
    ```

- POST `/api/members` (Admin)
  - Request:
    ```json
    { "fullName": "Ali Reza", "nationalCode": "0012345678" }
    ```
  - Response 201: created resource

3) Units

- GET `/api/units?memberId={guid}`
  - Response 200: `[ { "id": "guid", "memberId": "guid", "block": "A", "phase": "1", "area": 80.5, "ownershipShare": 1 } ]`

- POST `/api/units` (Admin)
  - Request:
    ```json
    { "memberId": "guid", "block": "A", "phase": "1", "area": 80.5, "ownershipShare": 1 }
    ```

4) Payments

- POST `/api/payments` (Authorized)
  - Request:
    ```json
    { "debtItemId": "guid", "amount": 1000000, "method": "Online" }
    ```
  - Response 201:
    ```json
    { "id": "guid", "debtItemId": "guid", "amount": 1000000, "paidAt": "2025-12-01T12:00:00Z", "method": "Online", "transactionRef": null }
    ```

5) Reports

- GET `/api/reports/debt-summary` (Admin)
  - Response 200:
    ```json
    { "totalDebt": 100000000, "totalPaid": 40000000, "debtorCount": 42 }
    ```

Authentication: JWT in `Authorization: Bearer <token>` header.

Pagination: `page` and `pageSize` query parameters for list endpoints.

Filtering/Sorting: Basic query params implemented in controllers as needed.
