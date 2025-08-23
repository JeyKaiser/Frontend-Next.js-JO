# Backend Integration Prompt for Claude Code

## Context
I have implemented a comprehensive user management system with database connectivity for SAP HANA in the Next.js frontend. The frontend now includes:

1. **Database Connection Utility**: SAP HANA connection with pooling and error handling
2. **Complete CRUD API Routes**: Full user management API endpoints  
3. **User Management UI**: Complete React components with forms, tables, modals
4. **Integration**: Updated usuarios page with full functionality

## Frontend Implementation Summary

### Database Structure (Successfully Created)
- **Schema**: `GARMENT_PRODUCTION_CONTROL`
- **Main Table**: `T_USUARIOS` (users table)
- **Other Tables**: `T_REFERENCIAS`, `T_FASES`, `T_TRAZABILIDAD`, `T_COLECCIONES`

### API Endpoints Created
- `GET /api/users` - List users with pagination and filtering
- `POST /api/users` - Create new user
- `GET /api/users/[id]` - Get specific user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user
- `GET /api/users/search` - Advanced search
- `GET /api/users/options` - Field options and validation data

### Environment Variables Required
```env
# SAP HANA Database Configuration
HANA_HOST=localhost
HANA_PORT=39015
HANA_USER=your_hana_user
HANA_PASSWORD=your_hana_password
HANA_DATABASE=HXE
HANA_SCHEMA=GARMENT_PRODUCTION_CONTROL
HANA_ENCRYPT=true
HANA_VALIDATE_CERTIFICATE=false

# Connection Pool Configuration
HANA_POOL_MIN=2
HANA_POOL_MAX=10
HANA_POOL_TIMEOUT=30000
HANA_CONNECTION_TIMEOUT=10000
```

## Backend Integration Task

I need you to create a **Django backend** that integrates seamlessly with this frontend implementation. The backend should:

### 1. Database Integration
- Connect to the same SAP HANA database (`GARMENT_PRODUCTION_CONTROL` schema)
- Use the existing table structure (especially `T_USUARIOS`)
- Implement Django models that match the database schema
- Handle both the existing Django API endpoints and the new user management

### 2. User Management API
Create Django REST API endpoints that match the frontend's expectations:

```python
# Expected API structure:
GET /api/users/
POST /api/users/
GET /api/users/{id}/
PUT /api/users/{id}/
DELETE /api/users/{id}/
GET /api/users/search/
GET /api/users/options/
```

### 3. Data Model Compatibility
Ensure Django models handle these user fields:
```python
# User model should include:
- codigo_usuario (user code)
- nombres (first name)
- apellidos (last name) 
- email
- telefono (phone)
- area (department/area)
- rol (role)
- estado (status: ACTIVO, INACTIVO)
- fecha_creacion (created_at)
- fecha_actualizacion (updated_at)
- ultimo_acceso (last_login)
```

### 4. Integration Requirements

**Data Mapping**: Map between Django model fields and frontend User interface:
```typescript
interface User {
  id: string;
  firstName: string;    // maps to: nombres
  lastName: string;     // maps to: apellidos
  email: string;
  role: UserRole;       // maps to: rol
  status: UserStatus;   // maps to: estado
  phone?: string;       // maps to: telefono
  department?: string;  // maps to: area
  joinedAt: Date;       // maps to: fecha_creacion
  lastLoginAt?: Date;   // maps to: ultimo_acceso
}
```

**API Response Format**: Match the frontend's expected JSON structure:
```json
{
  "users": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### 5. Existing Integration Points
The backend should work alongside existing endpoints:
- `/api/colecciones/` (collections)
- `/api/detalle-referencia/{id}/` (reference details)
- `/api/fases/{collection}/{reference}/{phase}/` (phases)

### 6. Security & Validation
- Input validation for all user fields
- Proper error handling with meaningful messages
- SQL injection protection
- Role-based access control (if applicable)

### 7. Performance Considerations
- Database connection pooling for SAP HANA
- Efficient queries with proper indexing
- Pagination for large user lists
- Search optimization

## Current File Structure
```
Frontend-Next.js-JO/
├── app/
│   ├── api/
│   │   └── users/
│   │       ├── route.ts
│   │       ├── [id]/route.ts
│   │       ├── search/route.ts
│   │       └── options/route.ts
│   ├── globals/
│   │   ├── lib/
│   │   │   ├── database.ts
│   │   │   └── dal/garment-production.ts
│   │   └── components/
│   │       ├── molecules/
│   │       │   ├── UserCard.tsx
│   │       │   ├── UserForm.tsx
│   │       │   ├── UserModal.tsx
│   │       │   └── UserDeleteConfirmation.tsx
│   │       └── organisms/
│   │           └── UserList.tsx
│   └── modules/
│       ├── (dashboard)/
│       │   └── users/
│       │       └── page.tsx
│       ├── hooks/
│       │   └── useUserManagement.ts
│       └── types/
│           └── index.ts
```

## Success Criteria
1. Users can be created, read, updated, and deleted from both frontend and backend
2. Data consistency between SAP HANA database and Django models
3. Proper error handling and validation
4. Search and filtering work correctly
5. Integration doesn't break existing endpoints
6. Performance is acceptable for enterprise use

## Additional Notes
- The frontend is using Next.js 14+ with App Router
- Database schema was created successfully (first file executed OK)
- Use Django REST Framework for API implementation
- Maintain compatibility with existing authentication/authorization if any
- Consider using django-hana for SAP HANA connectivity

Please implement a complete Django backend that integrates seamlessly with this frontend user management system.