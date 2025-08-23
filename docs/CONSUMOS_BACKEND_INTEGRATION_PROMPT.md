# Prompt para Implementación del Backend - Módulo de Consumos

## Contexto
Se necesita implementar en el backend de Django la funcionalidad para consultar consumos de telas por referencia. El frontend ya está implementado y está haciendo llamadas a la API `/api/consumos/`.

## Consulta SQL Base
La consulta SQL que debe ejecutarse en SAP HANA es:

```sql
SELECT 
T3."Name" AS "COLECCION",
T1."U_GSP_Desc" AS "NOMBRE REF",
T2."U_GSP_SchLinName" AS "USO EN PRENDA",
T2."U_GSP_ItemCode" AS "COD TELA",
T2."U_GSP_ItemName" AS "NOMBRE TELA",
T2."U_GSP_QuantMsr" AS "CONSUMO",
T1."U_GSP_GroupSizeCode" AS "GRUPO TALLAS",
T4."Name" AS "LINEA",
T2."U_GSP_SchName" AS "tipo"
FROM "@GSP_TCMODEL" T1
INNER JOIN "@GSP_TCMODELMAT" T2
    ON T1."Name" = T2."U_GSP_ModelCode"
INNER JOIN "@GSP_TCCOLLECTION" T3
    ON T1."U_GSP_COLLECTION" = T3."U_GSP_SEASON"
INNER JOIN "@GSP_TCMATERIAL" T4
    ON T1."U_GSP_MATERIAL" = T4."Code"
WHERE T1."U_GSP_REFERENCE" = ? 
AND T2."U_GSP_SchName" = 'TELAS'
ORDER BY T2."U_GSP_SchName" DESC;
```

## Implementación Requerida

### 1. Endpoint de Django
Crear un endpoint en Django REST Framework que:

**URL:** `/api/consumos/`
**Método:** `GET`
**Parámetro:** `reference` (query parameter)

### 2. Estructura de Respuesta
El endpoint debe devolver un JSON con la siguiente estructura:

```json
{
  "success": true,
  "data": [
    {
      "COLECCION": "WINTER SUN",
      "NOMBRE_REF": "PANTALON CASUAL WINTER",
      "USO_EN_PRENDA": "PRINCIPAL",
      "COD_TELA": "TEL002",
      "NOMBRE_TELA": "DENIM STRETCH",
      "CONSUMO": 2.80,
      "GRUPO_TALLAS": "STD",
      "LINEA": "CASUAL",
      "TIPO": "TELAS"
    }
  ],
  "count": 1,
  "referenceCode": "PT03708"
}
```

### 3. Casos de Error
En caso de error, la respuesta debe ser:

```json
{
  "success": false,
  "error": "Descripción del error",
  "referenceCode": "PT03708"
}
```

### 4. Validaciones Necesarias
- Validar que el parámetro `reference` esté presente
- Validar formato del código de referencia (generalmente formato PT seguido de números)
- Manejar casos donde no se encuentren resultados
- Manejar errores de conexión a la base de datos

### 5. Estructura de Código Sugerida

```python
# views.py o similar
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import connection
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
def get_consumos_by_reference(request):
    """
    Obtiene los consumos de telas para una referencia específica
    """
    try:
        reference_code = request.GET.get('reference')
        
        if not reference_code:
            return Response({
                'success': False,
                'error': 'El parámetro reference es requerido'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar formato de referencia (opcional)
        if not reference_code.upper().startswith('PT'):
            return Response({
                'success': False,
                'error': 'El código de referencia debe tener formato PT seguido de números'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Ejecutar consulta SQL
        with connection.cursor() as cursor:
            sql_query = """
            SELECT 
                T3."Name" AS "COLECCION",
                T1."U_GSP_Desc" AS "NOMBRE_REF",
                T2."U_GSP_SchLinName" AS "USO_EN_PRENDA",
                T2."U_GSP_ItemCode" AS "COD_TELA",
                T2."U_GSP_ItemName" AS "NOMBRE_TELA",
                T2."U_GSP_QuantMsr" AS "CONSUMO",
                T1."U_GSP_GroupSizeCode" AS "GRUPO_TALLAS",
                T4."Name" AS "LINEA",
                T2."U_GSP_SchName" AS "TIPO"
            FROM "@GSP_TCMODEL" T1
            INNER JOIN "@GSP_TCMODELMAT" T2
                ON T1."Name" = T2."U_GSP_ModelCode"
            INNER JOIN "@GSP_TCCOLLECTION" T3
                ON T1."U_GSP_COLLECTION" = T3."U_GSP_SEASON"
            INNER JOIN "@GSP_TCMATERIAL" T4
                ON T1."U_GSP_MATERIAL" = T4."Code"
            WHERE T1."U_GSP_REFERENCE" = %s 
            AND T2."U_GSP_SchName" = 'TELAS'
            ORDER BY T2."U_GSP_SchName" DESC
            """
            
            cursor.execute(sql_query, [reference_code])
            columns = [col[0] for col in cursor.description]
            results = cursor.fetchall()
        
        # Convertir resultados a lista de diccionarios
        data = []
        for row in results:
            data.append(dict(zip(columns, row)))
        
        logger.info(f"Consulta de consumos exitosa para referencia {reference_code}: {len(data)} registros")
        
        return Response({
            'success': True,
            'data': data,
            'count': len(data),
            'referenceCode': reference_code
        })
        
    except Exception as e:
        logger.error(f"Error en consulta de consumos para {reference_code}: {str(e)}")
        return Response({
            'success': False,
            'error': f'Error interno del servidor: {str(e)}',
            'referenceCode': reference_code if 'reference_code' in locals() else None
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
```

### 6. URLs Configuration
Agregar en `urls.py`:

```python
from django.urls import path
from . import views

urlpatterns = [
    # ... otras URLs
    path('api/consumos/', views.get_consumos_by_reference, name='get_consumos'),
]
```

### 7. Configuración de CORS
Asegurarse de que el endpoint permita requests desde el frontend Next.js:

```python
# En settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Frontend Next.js
]

# O para desarrollo:
CORS_ALLOW_ALL_ORIGINS = True
```

### 8. Testing
Ejemplos de pruebas para verificar la implementación:

```bash
# Caso exitoso
curl "http://localhost:8000/api/consumos/?reference=PT03708"

# Caso sin parámetro
curl "http://localhost:8000/api/consumos/"

# Caso referencia no encontrada
curl "http://localhost:8000/api/consumos/?reference=PT99999"
```

### 9. Logs Recomendados
- Log cuando se inicia una consulta de consumos
- Log del número de registros encontrados
- Log de errores con detalles para debugging
- Log de parámetros recibidos para auditoría

### 10. Consideraciones de Performance
- Considerar agregar índices en las tablas SAP HANA si las consultas son lentas
- Implementar cache si las consultas son frecuentes y los datos no cambian constantemente
- Limitar el número de resultados si es necesario

## Pruebas Esperadas
Después de la implementación, se debe poder:
1. Consultar `PT03708` y obtener resultados
2. Consultar una referencia inexistente y recibir respuesta vacía
3. Hacer consulta sin parámetro y recibir error 400
4. Verificar que los datos coincidan con la consulta SQL directa en DBeaver

## Frontend Integration
El frontend está configurado para:
- Enviar requests GET a `/api/consumos/?reference=CODIGO`
- Mostrar loading states durante la consulta
- Manejar errores y mostrar mensajes apropiados
- Renderizar los resultados en una tabla con paginación y búsqueda