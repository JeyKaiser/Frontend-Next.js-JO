# 🔍 Guía de Búsqueda - Plataforma de Diseño JO

## Funcionalidad de Búsqueda Mejorada

La barra de búsqueda en el navbar ahora soporta múltiples tipos de búsqueda con detección automática de patrones.

## ✅ Patrones Soportados

### 1. **Códigos PT (Referencias)**
- **Formato**: PT seguido de 3-6 números
- **Ejemplos válidos**:
  - `PT003112`
  - `PT01662`
  - `PT03388`
  - `pt003112` (no es sensible a mayúsculas)

### 2. **Códigos MD (En Desarrollo)**
- **Formato**: MD seguido de 3-6 números
- **Ejemplos válidos**:
  - `MD003422`
  - `MD12345`
  - `md003422` (no es sensible a mayúsculas)
- **Estado**: Funcionalidad en desarrollo, mostrará mensaje informativo

### 3. **Búsqueda de Colecciones**
- **Patrones detectados**: Winter, Spring, Summer, Resort, Fall, Collection
- **Ejemplos válidos**:
  - `Winter`
  - `Spring Summer`
  - `Resort`

### 4. **Búsqueda General**
- Cualquier otro término de búsqueda
- Proporciona sugerencias para mejores resultados

## 🎯 Características de la Búsqueda

### **Detección Automática**
- La búsqueda detecta automáticamente el tipo de código ingresado
- El placeholder cambia dinámicamente según el patrón detectado

### **Búsqueda en Tiempo Real**
- Para códigos PT/MD: búsqueda automática después de escribir
- Debounce de 300ms para evitar búsquedas excesivas

### **Navegación con Teclado**
- `↑↓` - Navegar entre resultados
- `Enter` - Seleccionar resultado destacado
- `Escape` - Cerrar dropdown

### **Resultados Inteligentes**
- Dropdown con resultados detallados
- Iconos diferenciados por tipo (📄 Referencias, 📁 Colecciones)
- Auto-navegación para códigos PT únicos

## 🚨 Manejo de Excepciones

### **Errores Comunes y Sugerencias**

1. **Código PT no encontrado**
   - Mensaje: "Código PT 'PTXXXXX' no encontrado"
   - Sugerencias automáticas para verificar formato

2. **Código MD en desarrollo**
   - Mensaje informativo sobre estado de desarrollo
   - Sugerencias para usar códigos PT mientras tanto

3. **Sin resultados**
   - Sugerencias contextuales basadas en el tipo de búsqueda
   - Ejemplos de formatos válidos

4. **Errores de conexión**
   - Manejo graceful de errores de red
   - Botones para reintentar búsqueda

## 🔧 Ejemplos de Uso

### **Búsqueda Exitosa de Código PT**
1. Escribir: `PT01662`
2. Resultado automático: Navega a referencia-detalle
3. URL: `/modules/referencia-detalle/063/PT01662`

### **Búsqueda de Colección**
1. Escribir: `Winter`
2. Resultados: Lista de colecciones que contienen "Winter"
3. Clic en resultado: Navega a la colección seleccionada

### **Código Inválido**
1. Escribir: `PT` (incompleto)
2. Resultado: Modal con sugerencias de formato
3. Ejemplos proporcionados automáticamente

## 📋 Estados de la Búsqueda

- **🔍 Idle**: Campo vacío, placeholder general
- **⚡ Detecting**: Detectando patrón mientras se escribe
- **🔄 Loading**: Búsqueda en progreso (spinner visible)
- **✅ Results**: Resultados encontrados (dropdown visible)
- **❌ Error**: Error o sin resultados (modal con sugerencias)

## 🎨 Diseño UX/UI

- **Interfaz consistente** con el sistema de diseño unificado
- **Animaciones suaves** para transiciones
- **Feedback visual** claro para todos los estados
- **Responsive** - funciona en todos los dispositivos
- **Accesible** - navegación completa por teclado

## 🚀 Características Futuras

- Búsqueda de códigos MD completamente funcional
- Historial de búsquedas recientes
- Búsqueda fuzzy para códigos similares
- Filtros avanzados por colección/año
- Búsqueda por texto libre en descripciones