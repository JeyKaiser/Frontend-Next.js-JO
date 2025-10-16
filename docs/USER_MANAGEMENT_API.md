# User Management API Documentation

Complete CRUD API routes for user management in the Garment Production Control System.

## Overview

The User Management API provides endpoints to manage users in the `T_USUARIOS` table within the `GARMENT_PRODUCTION_CONTROL` schema in SAP HANA.

## Base URL

```
/api/users
```

## Authentication

Currently, the API does not require authentication. In production, you should implement proper authentication and authorization.

## Data Models

### Usuario (User)

```typescript
interface Usuario {
  ID_USUARIO: number;
  CODIGO_USUARIO: string;
  NOMBRE_COMPLETO: string;
  EMAIL?: string;
  AREA: string;
  ROL: string;
  ESTADO: 'ACTIVO' | 'INACTIVO';
  FECHA_CREACION: string;
}
```

### Valid Values

**Areas:**
- `DISEÑO` - Área de diseño y desarrollo creativo
- `PRODUCCION` - Área de producción y manufactura
- `CALIDAD` - Control y aseguramiento de calidad
- `TECNICO` - Área técnica y de ingeniería
- `PATRONAJE` - Desarrollo de patrones y moldería
- `COMERCIAL` - Área comercial y de costos
- `OPERACIONES` - Operaciones generales y coordinación

**Roles:**
- `JEFE_OPERACIONES` - Responsable de operaciones generales
- `DISEÑADOR_SENIOR` - Diseñador con experiencia senior
- `DISEÑADOR` - Diseñador de prendas
- `CORTADOR_SENIOR` - Especialista en corte senior
- `ESPECIALISTA_CALIDAD` - Control y aseguramiento de calidad
- `INGENIERO_TEXTIL` - Especialista técnico en textiles
- `PATRONISTA_SENIOR` - Especialista en patronaje senior
- `ANALISTA_COSTOS` - Análisis de costos y pricing

## API Endpoints

### 1. List Users

```http
GET /api/users
```

Retrieve a paginated list of users with optional filtering.

**Query Parameters:**
- `offset` (number, optional): Starting position (default: 0)
- `limit` (number, optional): Number of results (default: 50, max: 100)
- `area` (string, optional): Filter by area
- `rol` (string, optional): Filter by role
- `estado` (string, optional): Filter by status (ACTIVO/INACTIVO)
- `search` (string, optional): Search in name, code, or email

**Example Request:**
```bash
curl "http://localhost:3000/api/users?limit=10&area=DISEÑO&estado=ACTIVO"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "ID_USUARIO": 1,
      "CODIGO_USUARIO": "MD001",
      "NOMBRE_COMPLETO": "JO-María García López",
      "EMAIL": "m.garcia@empresa.com",
      "AREA": "DISEÑO",
      "ROL": "DISEÑADOR_SENIOR",
      "ESTADO": "ACTIVO",
      "FECHA_CREACION": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1,
  "pagination": {
    "offset": 0,
    "limit": 10,
    "hasMore": false
  },
  "filters": {
    "area": "DISEÑO",
    "estado": "ACTIVO"
  }
}
```

### 2. Create User

```http
POST /api/users
```

Create a new user.

**Request Body:**
```json
{
  "CODIGO_USUARIO": "NEW001",
  "NOMBRE_COMPLETO": "Nuevo Usuario",
  "EMAIL": "nuevo@empresa.com",
  "AREA": "DISEÑO",
  "ROL": "DISEÑADOR",
  "ESTADO": "ACTIVO"
}
```

**Required Fields:**
- `CODIGO_USUARIO`
- `NOMBRE_COMPLETO`
- `AREA`
- `ROL`

**Example Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "CODIGO_USUARIO": "NEW001",
    "NOMBRE_COMPLETO": "Nuevo Usuario",
    "AREA": "DISEÑO",
    "ROL": "DISEÑADOR",
    "ESTADO": "ACTIVO"
  },
  "executionTime": 150
}
```

### 3. Get User by ID

```http
GET /api/users/{id}
```

Retrieve a specific user by their ID.

**Path Parameters:**
- `id` (number): User ID

**Example Response:**
```json
{
  "success": true,
  "data": {
    "ID_USUARIO": 1,
    "CODIGO_USUARIO": "MD001",
    "NOMBRE_COMPLETO": "JO-María García López",
    "EMAIL": "m.garcia@empresa.com",
    "AREA": "DISEÑO",
    "ROL": "DISEÑADOR_SENIOR",
    "ESTADO": "ACTIVO",
    "FECHA_CREACION": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Update User

```http
PUT /api/users/{id}
```

Update an existing user. Only provided fields will be updated.

**Path Parameters:**
- `id` (number): User ID

**Request Body (all fields optional):**
```json
{
  "NOMBRE_COMPLETO": "Nombre Actualizado",
  "EMAIL": "nuevo.email@empresa.com",
  "AREA": "PRODUCCION",
  "ROL": "CORTADOR_SENIOR",
  "ESTADO": "INACTIVO"
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "ID_USUARIO": 1,
    "CODIGO_USUARIO": "MD001",
    "NOMBRE_COMPLETO": "Nombre Actualizado",
    "EMAIL": "nuevo.email@empresa.com",
    "AREA": "PRODUCCION",
    "ROL": "CORTADOR_SENIOR",
    "ESTADO": "INACTIVO",
    "FECHA_CREACION": "2024-01-15T10:30:00Z"
  },
  "executionTime": 120
}
```

### 5. Delete User

```http
DELETE /api/users/{id}
```

Delete a user (soft delete by default - sets ESTADO to 'INACTIVO').

**Path Parameters:**
- `id` (number): User ID

**Query Parameters:**
- `hard` (boolean, optional): If true, performs permanent deletion (use with caution)

**Example Response:**
```json
{
  "success": true,
  "message": "User deactivated successfully",
  "deletedUser": {
    "ID_USUARIO": 1,
    "CODIGO_USUARIO": "MD001",
    "NOMBRE_COMPLETO": "María García López"
  },
  "deleteType": "soft",
  "executionTime": 95
}
```

### 6. Search Users

```http
GET /api/users/search
```

Advanced search functionality for users.

**Query Parameters:**
- `q` (string, required): Search term
- `area` (string, optional): Filter by area
- `rol` (string, optional): Filter by role
- `estado` (string, optional): Filter by status
- `exact` (boolean, optional): Exact match for user code
- `limit` (number, optional): Max results (default: 20, max: 50)

**Example Request:**
```bash
curl "http://localhost:3000/api/users/search?q=Maria&area=DISEÑO&limit=5"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "ID_USUARIO": 1,
      "CODIGO_USUARIO": "MD001",
      "NOMBRE_COMPLETO": "JO-María García López",
      "EMAIL": "m.garcia@empresa.com",
      "AREA": "DISEÑO",
      "ROL": "DISEÑADOR_SENIOR",
      "ESTADO": "ACTIVO",
      "FECHA_CREACION": "2024-01-15T10:30:00Z",
      "_searchScore": 30
    }
  ],
  "count": 1,
  "searchType": "general",
  "query": "Maria",
  "filters": {
    "area": "DISEÑO"
  },
  "suggestions": [
    "JO-María García López"
  ]
}
```

### 7. Get User Options

```http
GET /api/users/options
```

Retrieve available options for user fields (areas, roles, etc.) and current statistics.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "currentAreas": [
      { "AREA": "DISEÑO", "USER_COUNT": 3 },
      { "AREA": "PRODUCCION", "USER_COUNT": 2 }
    ],
    "currentRoles": [
      { "ROL": "DISEÑADOR_SENIOR", "USER_COUNT": 1 },
      { "ROL": "DISEÑADOR", "USER_COUNT": 2 }
    ],
    "statusCounts": [
      { "ESTADO": "ACTIVO", "USER_COUNT": 7 },
      { "ESTADO": "INACTIVO", "USER_COUNT": 1 }
    ],
    "validAreas": ["DISEÑO", "PRODUCCION", "CALIDAD", "TECNICO", "PATRONAJE", "COMERCIAL", "OPERACIONES"],
    "validRoles": ["JEFE_OPERACIONES", "DISEÑADOR_SENIOR", "DISEÑADOR", "CORTADOR_SENIOR", "ESPECIALISTA_CALIDAD", "INGENIERO_TEXTIL", "PATRONISTA_SENIOR", "ANALISTA_COSTOS"],
    "validEstados": ["ACTIVO", "INACTIVO"],
    "roleDescriptions": {
      "DISEÑADOR_SENIOR": "Diseñador con experiencia senior"
    },
    "areaDescriptions": {
      "DISEÑO": "Área de diseño y desarrollo creativo"
    }
  },
  "timestamp": "2024-01-20T15:30:00Z"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-01-20T15:30:00Z"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate user code)
- `500` - Internal Server Error
- `503` - Service Unavailable (database connection issues)

## Usage Examples

### JavaScript/TypeScript

```typescript
// Get all users
const response = await fetch('/api/users?limit=20&estado=ACTIVO');
const { data: users } = await response.json();

// Create user
const newUser = {
  CODIGO_USUARIO: 'NEW001',
  NOMBRE_COMPLETO: 'Nuevo Usuario',
  AREA: 'DISEÑO',
  ROL: 'DISEÑADOR'
};

const createResponse = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newUser)
});

// Search users
const searchResponse = await fetch('/api/users/search?q=Maria&exact=false');
const searchResults = await searchResponse.json();
```

### cURL Examples

```bash
# Get users with pagination
curl "http://localhost:3000/api/users?offset=0&limit=10"

# Create a new user
curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "CODIGO_USUARIO": "TEST001",
    "NOMBRE_COMPLETO": "Usuario de Prueba",
    "AREA": "DISEÑO",
    "ROL": "DISEÑADOR"
  }'

# Update user
curl -X PUT "http://localhost:3000/api/users/1" \
  -H "Content-Type: application/json" \
  -d '{
    "NOMBRE_COMPLETO": "Nombre Actualizado",
    "EMAIL": "nuevo@empresa.com"
  }'

# Search users
curl "http://localhost:3000/api/users/search?q=JO&limit=5"

# Soft delete user
curl -X DELETE "http://localhost:3000/api/users/1"

# Hard delete user (use with caution)
curl -X DELETE "http://localhost:3000/api/users/1?hard=true"
```

## Testing

Run the test script to validate all API endpoints:

```bash
node scripts/test-user-api.js
```

## Database Schema

The API works with the `T_USUARIOS` table in the `GARMENT_PRODUCTION_CONTROL` schema:

```sql
CREATE COLUMN TABLE T_USUARIOS (
    ID_USUARIO             INTEGER         GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    CODIGO_USUARIO         NVARCHAR(20)    NOT NULL UNIQUE,
    NOMBRE_COMPLETO        NVARCHAR(100)   NOT NULL,
    EMAIL                  NVARCHAR(100),
    AREA                   NVARCHAR(50)    NOT NULL,
    ROL                    NVARCHAR(30)    NOT NULL,
    ESTADO                 NVARCHAR(20)    DEFAULT 'ACTIVO',
    FECHA_CREACION         TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations

1. **Authentication**: Implement proper authentication before deploying to production.
2. **Authorization**: Add role-based access control.
3. **Input Validation**: All inputs are validated on the server side.
4. **SQL Injection**: Protected by using parameterized queries.
5. **Rate Limiting**: Consider implementing rate limiting for production use.
6. **Audit Trail**: Consider adding audit logs for user modifications.

## Performance Notes

- The API uses database indexes for optimal query performance
- Pagination is implemented to handle large datasets
- Search operations include relevance scoring
- Connection pooling is used for database connections
- Query execution times are logged for monitoring

## Environment Variables

Ensure these environment variables are set:

```env
HANA_HOST=your-hana-host
HANA_PORT=39015
HANA_USER=your-username
HANA_PASSWORD=your-password
HANA_SCHEMA=GARMENT_PRODUCTION_CONTROL
```