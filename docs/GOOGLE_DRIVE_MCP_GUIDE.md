# 📋 **Guía completa del MCP de Google Drive**

Una vez que reinicies Claude Code y el servidor MCP esté conectado, podrás usar estas capacidades:

## 🗂️ **1. Listar archivos y carpetas**

### **Sintaxis natural:**
- "Lista mis archivos de Google Drive"
- "Muestra los archivos en mi carpeta de Documentos"
- "¿Qué archivos tengo ordenados por fecha?"

### **Ejemplos específicos:**
```
# Listar archivos de la raíz
"Lista los primeros 20 archivos de mi Drive"

# Listar archivos de una carpeta específica (necesitas el ID)
"Muestra el contenido de la carpeta con ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

# Ordenar archivos
"Lista mis archivos ordenados por fecha de modificación"
```

## 📄 **2. Subir archivos**

### **Sintaxis natural:**
- "Sube un archivo llamado 'reporte.txt' con este contenido: [contenido]"
- "Crea un documento en Drive con los datos de mi proyecto"

### **Ejemplos específicos:**
```
# Subir archivo de texto
"Crea un archivo llamado 'notas.txt' en mi Drive con el contenido: 'Estas son mis notas del proyecto'"

# Subir archivo JSON
"Sube un archivo 'config.json' con la configuración: {'api_key': 'test', 'environment': 'development'}"

# Subir a una carpeta específica
"Crea un archivo 'README.md' en la carpeta ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
```

## 📥 **3. Descargar archivos**

### **Sintaxis natural:**
- "Descarga el archivo con ID [file_id]"
- "Muestra el contenido del documento [nombre]"

### **Ejemplos específicos:**
```
# Descargar archivo normal
"Descarga el archivo con ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

# Exportar Google Docs como texto
"Exporta el Google Doc con ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms como texto plano"

# Exportar Google Sheets como CSV
"Descarga la hoja de cálculo ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms en formato CSV"
```

## 📁 **4. Crear carpetas**

### **Sintaxis natural:**
- "Crea una carpeta llamada 'Proyecto 2025'"
- "Haz una nueva carpeta 'Reportes' dentro de mi carpeta Documentos"

### **Ejemplos específicos:**
```
# Crear carpeta en la raíz
"Crea una carpeta llamada 'Backup-Frontend'"

# Crear carpeta dentro de otra (necesitas el ID de la carpeta padre)
"Crea una carpeta 'Imágenes' dentro de la carpeta con ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
```

## 🗑️ **5. Eliminar archivos/carpetas**

### **Sintaxis natural:**
- "Elimina el archivo con ID [file_id]"
- "Borra la carpeta de archivos temporales"

### **Ejemplos específicos:**
```
# Eliminar archivo
"Elimina el archivo con ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

# Eliminar carpeta (también elimina todo su contenido)
"Borra la carpeta con ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
```

## 🔗 **6. Compartir archivos**

### **Sintaxis natural:**
- "Comparte el archivo [ID] con juan@ejemplo.com como editor"
- "Da permiiso de lectura a maria@empresa.com en el documento [ID]"

### **Ejemplos específicos:**
```
# Compartir con permisos de lectura
"Comparte el archivo ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms con usuario@gmail.com como reader"

# Compartir con permisos de edición
"Da permisos de editor a colaborador@empresa.com en el archivo ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

# Compartir con comentarios
"Permite comentarios a revisor@empresa.com en el documento ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
```

## 🔍 **7. Buscar archivos**

### **Sintaxis natural:**
- "Busca archivos que contengan 'proyecto'"
- "Encuentra todos mis documentos PDF"
- "Busca archivos modificados hoy"

### **Ejemplos específicos:**
```
# Búsqueda por nombre
"Busca archivos con 'frontend' en el nombre"

# Búsqueda por tipo de archivo
"Encuentra todos los archivos PDF en mi Drive"

# Búsqueda con filtros
"Busca documentos de Google Docs que contengan 'reporte'"
```

## ℹ️ **8. Obtener información de archivos**

### **Sintaxis natural:**
- "Muestra la información del archivo [ID]"
- "¿Cuándo fue modificado el documento [ID]?"

### **Ejemplos específicos:**
```
# Información completa
"Muestra todos los metadatos del archivo ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

# Información específica
"¿Cuál es el tamaño y fecha de modificación del archivo ID 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms?"
```

## 🎯 **Casos de uso prácticos:**

1. **Backup de proyecto**: "Crea una carpeta 'Backup-Frontend-2025' y sube el archivo package.json de mi proyecto"

2. **Documentación**: "Busca todos los archivos README en mi Drive"

3. **Colaboración**: "Comparte la carpeta 'Proyecto-Consumos' con mi equipo de desarrollo"

4. **Organización**: "Lista todos mis archivos ordenados por fecha para ver cuáles son más recientes"

5. **Sincronización**: "Descarga la configuración actualizada del archivo config.json"

## ⚠️ **Nota importante:**
Para usar estos comandos, **primero debes reiniciar Claude Code** para que reconozca el servidor MCP. Una vez reiniciado, simplemente usa lenguaje natural y yo traduciré tus peticiones a las llamadas MCP correspondientes.

## 🔧 **Herramientas técnicas disponibles:**

El servidor MCP incluye las siguientes herramientas técnicas:

- `list_files` - Listar archivos y carpetas
- `upload_file` - Subir archivos a Drive
- `download_file` - Descargar archivos
- `create_folder` - Crear carpetas
- `delete_file` - Eliminar archivos/carpetas
- `share_file` - Compartir con permisos
- `search_files` - Buscar archivos
- `get_metadata` - Obtener metadatos

## 📍 **Configuración del servidor:**

- **Ubicación**: `C:\Users\jchacon\AppData\Roaming\Roo-Code\MCP\google-drive-server`
- **Configuración**: `c:\Users\jchacon\AppData\Roaming\Code\User\globalStorage\rooveterinaryinc.roo-cline\settings\mcp_settings.json`
- **Autenticación**: OAuth2 con tokens guardados en `/tokens/token.json`
- **Estado**: ✅ Actualizado y funcional

---

*Guía creada el 25 de agosto de 2025 - Servidor MCP v1.0.0*