
# API Documentation

## Authentication

All protected endpoints require authentication. In development mode, authentication is bypassed with a mock user.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

## User Management

### Get Current User
```http
GET /api/user
```

**Response:**
```json
{
  "id": "user-123",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profileImageUrl": "https://example.com/avatar.jpg"
}
```

## Organizations

### Create Organization
```http
POST /api/organizations
```

**Body:**
```json
{
  "name": "My Startup",
  "description": "AI-powered SaaS platform",
  "industry": "Technology",
  "stage": "seed"
}
```

### Get User Organizations
```http
GET /api/organizations
```

### Get Organization Details
```http
GET /api/organizations/:id
```

## Collaborations

### Create Collaboration
```http
POST /api/collaborations
```

**Body:**
```json
{
  "name": "Product Development",
  "description": "Collaborative product planning",
  "participants": ["user-456", "user-789"],
  "type": "project"
}
```

### Get User Collaborations
```http
GET /api/collaborations
```

## Invitations

### Send Invitation
```http
POST /api/invitations
```

**Body:**
```json
{
  "inviteeEmail": "colleague@example.com",
  "organizationId": "org-123",
  "role": "member",
  "type": "organization",
  "message": "Join our startup!"
}
```

### Get User Invitations
```http
GET /api/invitations
```

### Accept/Decline Invitation
```http
PATCH /api/invitations/:id
```

**Body:**
```json
{
  "status": "accepted" // or "declined"
}
```

## Analytics

### Get Dashboard Analytics
```http
GET /api/analytics/dashboard
```

**Response:**
```json
{
  "performanceMetrics": {
    "totalRevenue": 2450000,
    "revenueGrowth": 15.8,
    "userGrowth": 23.2,
    "conversionRate": 8.7
  },
  "revenueData": [...],
  "userGrowthData": [...]
}
```

## Business Plans

### Get Business Plans
```http
GET /api/business-plans
```

### Create Business Plan
```http
POST /api/business-plans
```

### Get Business Plan
```http
GET /api/business-plans/:id
```

### Update Business Plan
```http
PUT /api/business-plans/:id
```

### Delete Business Plan
```http
DELETE /api/business-plans/:id
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {...}
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
