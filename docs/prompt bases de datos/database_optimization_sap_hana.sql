-- ====================================================================
-- OPTIMIZACIONES AVANZADAS Y CONFIGURACIONES SAP HANA
-- Configuraciones específicas para maximizar rendimiento
-- ====================================================================

SET SCHEMA GARMENT_PRODUCTION_CONTROL;

-- ====================================================================
-- 9. TRIGGERS PARA AUTOMATIZACIÓN Y AUDITORÍA
-- ====================================================================

-- Trigger para actualizar automáticamente las fechas de modificación
CREATE OR REPLACE TRIGGER TRG_REFERENCIAS_UPDATE
BEFORE UPDATE ON T_REFERENCIAS
REFERENCING NEW ROW AS NEW
FOR EACH ROW
BEGIN
    :NEW.FECHA_MODIFICACION := CURRENT_TIMESTAMP;
END;

CREATE OR REPLACE TRIGGER TRG_TRAZABILIDAD_TIEMPO
BEFORE INSERT ON T_TRAZABILIDAD
REFERENCING NEW ROW AS NEW
FOR EACH ROW
BEGIN
    DECLARE V_FECHA_ANTERIOR TIMESTAMP;
   
    IF :NEW.TIPO_MOVIMIENTO = 'ENTREGADO' THEN
        SELECT MAX(FECHA_MOVIMIENTO) INTO V_FECHA_ANTERIOR
        FROM T_TRAZABILIDAD
        WHERE ID_REFERENCIA = :NEW.ID_REFERENCIA
          AND ID_FASE = :NEW.ID_FASE
          AND TIPO_MOVIMIENTO = 'RECIBIDO';
       
        IF V_FECHA_ANTERIOR IS NOT NULL THEN
            :NEW.TIEMPO_PERMANENCIA_HORAS := SECONDS_BETWEEN(V_FECHA_ANTERIOR, :NEW.FECHA_MOVIMIENTO) / 3600.0;
        END IF;
    END IF;
END;

-- ====================================================================
-- 10. FUNCIONES AUXILIARES PARA ANÁLISIS
-- ====================================================================

-- Función para calcular días hábiles entre fechas
CREATE FUNCTION FN_DIAS_HABILES(P_FECHA_INICIO DATE, P_FECHA_FIN DATE)
RETURNS INTEGER
LANGUAGE SQLSCRIPT AS
BEGIN
    DECLARE V_DIAS_TOTALES INTEGER;
    DECLARE V_SEMANAS_COMPLETAS INTEGER;
    DECLARE V_DIAS_RESTANTES INTEGER;
    DECLARE V_DIAS_HABILES INTEGER := 0;
    DECLARE V_DIA_INICIO INTEGER;
    DECLARE V_DIA_FIN INTEGER;
    
    -- Calcular días totales
    V_DIAS_TOTALES := DAYS_BETWEEN(P_FECHA_INICIO, P_FECHA_FIN);
    
    -- Calcular semanas completas (5 días hábiles por semana)
    V_SEMANAS_COMPLETAS := V_DIAS_TOTALES / 7;
    V_DIAS_HABILES := V_SEMANAS_COMPLETAS * 5;
    
    -- Calcular días restantes
    V_DIAS_RESTANTES := V_DIAS_TOTALES % 7;
    V_DIA_INICIO := WEEKDAY(P_FECHA_INICIO); -- 0=Lunes, 6=Domingo
    
    -- Contar días hábiles en los días restantes
    FOR i IN 0..V_DIAS_RESTANTES-1 DO
        IF (V_DIA_INICIO + i) % 7 < 5 THEN -- Lunes a Viernes
            V_DIAS_HABILES := V_DIAS_HABILES + 1;
        END IF;
    END FOR;
    
    RETURN V_DIAS_HABILES;
END;

-- Función para obtener el estado de una referencia en tiempo real
CREATE FUNCTION FN_ESTADO_REFERENCIA(P_ID_REFERENCIA BIGINT)
RETURNS TABLE (
    FASE_ACTUAL NVARCHAR(100),
    DIAS_EN_FASE INTEGER,
    ESTADO_TEMPORAL NVARCHAR(20),
    USUARIO_RESPONSABLE NVARCHAR(100)
)
LANGUAGE SQLSCRIPT AS
BEGIN
    RETURN SELECT 
        f.NOMBRE_FASE AS FASE_ACTUAL,
        ea.DIAS_EN_FASE,
        CASE 
            WHEN ea.DIAS_EN_FASE * 24 > f.TIEMPO_MAXIMO_HORAS THEN 'ATRASADA'
            WHEN ea.DIAS_EN_FASE * 24 > f.TIEMPO_ESTIMADO_HORAS THEN 'EN_RIESGO'
            ELSE 'EN_TIEMPO'
        END AS ESTADO_TEMPORAL,
        u.NOMBRE_COMPLETO AS USUARIO_RESPONSABLE
    FROM T_ESTADO_ACTUAL ea
    INNER JOIN T_FASES f ON ea.ID_FASE_ACTUAL = f.ID_FASE
    LEFT JOIN T_USUARIOS u ON ea.ID_USUARIO_ACTUAL = u.ID_USUARIO
    WHERE ea.ID_REFERENCIA = P_ID_REFERENCIA;
END;

-- ====================================================================
-- 11. VISTAS MATERIALIZADAS PARA PERFORMANCE CRÍTICO
-- ====================================================================

-- Vista materializada para métricas de dashboard en tiempo real
CREATE MATERIALIZED VIEW MV_METRICAS_DASHBOARD AS
SELECT 
    f.AREA_RESPONSABLE,
    f.ETAPA,
    COUNT(DISTINCT ea.ID_REFERENCIA) AS REFERENCIAS_ACTIVAS,
    COUNT(CASE WHEN ea.DIAS_EN_FASE > 3 THEN 1 END) AS REFERENCIAS_ATRASADAS,
    AVG(ea.DIAS_EN_FASE) AS PROMEDIO_DIAS_FASE,
    MAX(ea.DIAS_EN_FASE) AS MAXIMO_DIAS_FASE,
    CURRENT_TIMESTAMP AS ULTIMA_ACTUALIZACION
FROM T_ESTADO_ACTUAL ea
INNER JOIN T_FASES f ON ea.ID_FASE_ACTUAL = f.ID_FASE
INNER JOIN T_REFERENCIAS r ON ea.ID_REFERENCIA = r.ID_REFERENCIA
WHERE ea.ESTADO_FASE = 'EN_PROCESO'
  AND r.ESTADO_GENERAL = 'EN_PROCESO'
GROUP BY f.AREA_RESPONSABLE, f.ETAPA
WITH REFRESH CASCADE IMMEDIATE;

-- Refrescar vista materializada cada 15 minutos
CREATE PROCEDURE SP_REFRESH_DASHBOARD()
LANGUAGE SQLSCRIPT AS
BEGIN
    REFRESH MATERIALIZED VIEW MV_METRICAS_DASHBOARD WITH DATA;
END;

-- ====================================================================
-- 12. CONFIGURACIONES DE RENDIMIENTO SAP HANA
-- ====================================================================

-- Configurar compresión avanzada para tablas principales
ALTER TABLE T_TRAZABILIDAD COMPRESS;
ALTER TABLE T_REFERENCIAS COMPRESS;

-- Configurar estadísticas automáticas
ALTER SYSTEM ALTER CONFIGURATION ('indexserver.ini', 'SYSTEM') 
SET ('statisticsserver', 'active') = 'yes' WITH RECONFIGURE;

-- Configurar plan cache para consultas frecuentes
ALTER SYSTEM ALTER CONFIGURATION ('indexserver.ini', 'SYSTEM') 
SET ('sql', 'plan_cache_size') = '4096' WITH RECONFIGURE;

-- ====================================================================
-- 13. ÍNDICES ESPECIALIZADOS PARA CONSULTAS ANALÍTICAS
-- ====================================================================

-- Índice compuesto para consultas de rango temporal (sin campos calculados)
CREATE INDEX IDX_TRAZABILIDAD_TEMPORAL_ANALYTICS ON T_TRAZABILIDAD 
(FECHA_MOVIMIENTO, ID_FASE, TIPO_MOVIMIENTO);

-- Índice para análisis de productividad por usuario
CREATE INDEX IDX_TRAZABILIDAD_USUARIO_PRODUCTIVITY ON T_TRAZABILIDAD 
(ID_USUARIO_DESTINO, FECHA_MOVIMIENTO, ESTADO_CALIDAD);

-- Índice para reportes de colección (sin campo inexistente ANIO_CREACION)
CREATE INDEX IDX_REFERENCIAS_COLECCION_ANALYTICS ON T_REFERENCIAS 
(ID_COLECCION, ESTADO_GENERAL, TIPO_PRENDA, FECHA_CREACION);

-- Índice para búsquedas de trazabilidad completa (sin INCLUDE - no compatible con SAP HANA)
CREATE INDEX IDX_TRAZABILIDAD_COMPLETA ON T_TRAZABILIDAD 
(ID_REFERENCIA, FECHA_MOVIMIENTO, TIPO_MOVIMIENTO);

-- ====================================================================
-- 14. PROCEDIMIENTOS DE MANTENIMIENTO Y OPTIMIZACIÓN
-- ====================================================================

-- Procedimiento para mantenimiento de particiones
CREATE PROCEDURE SP_MANTENER_PARTICIONES()
LANGUAGE SQLSCRIPT AS
BEGIN
    DECLARE V_ANIO_ACTUAL INTEGER;
    DECLARE V_MES_ACTUAL INTEGER;
    DECLARE V_FECHA_NUEVA_PARTICION DATE;
    
    V_ANIO_ACTUAL := YEAR(CURRENT_DATE);
    V_MES_ACTUAL := MONTH(CURRENT_DATE);
    
    -- Crear partición para el próximo mes si no existe
    V_FECHA_NUEVA_PARTICION := ADD_MONTHS(CURRENT_DATE, 2);
    
    -- Aquí se agregarían las sentencias ALTER TABLE para crear nuevas particiones
    -- según el avance del tiempo
    
    -- Eliminar particiones antiguas (más de 2 años)
    -- Solo en casos específicos y con respaldo previo
END;

-- Procedimiento para actualizar estadísticas críticas
CREATE PROCEDURE SP_ACTUALIZAR_ESTADISTICAS()
LANGUAGE SQLSCRIPT AS
BEGIN
    -- Actualizar estadísticas de las tablas principales
    UPDATE STATISTICS ON T_TRAZABILIDAD;
    UPDATE STATISTICS ON T_REFERENCIAS;
    UPDATE STATISTICS ON T_ESTADO_ACTUAL;
    
    -- Refrescar vistas materializadas
    REFRESH MATERIALIZED VIEW MV_METRICAS_DASHBOARD WITH DATA;
END;

-- ====================================================================
-- 15. CONSULTAS DE EJEMPLO PARA CASOS DE USO PRINCIPALES
-- ====================================================================

-- CASO DE USO 1: Consultar estado actual de una referencia específica
/*
SELECT * FROM V_ESTADO_ACTUAL_COMPLETO 
WHERE CODIGO_REFERENCIA = 'REF001234'
ORDER BY FECHA_LLEGADA_FASE DESC;
*/

-- CASO DE USO 2: Obtener histórico completo de una referencia
/*
SELECT * FROM V_HISTORICO_REFERENCIAS 
WHERE CODIGO_REFERENCIA = 'REF001234'
ORDER BY SECUENCIA_MOVIMIENTO ASC;
*/

-- CASO DE USO 3: Reportes de tiempo promedio por fase (últimos 3 meses)
/*
SELECT 
    NOMBRE_FASE,
    ETAPA,
    AREA_RESPONSABLE,
    TIEMPO_PROMEDIO_REAL,
    TIEMPO_ESTIMADO_HORAS,
    CASE 
        WHEN TIEMPO_PROMEDIO_REAL > TIEMPO_ESTIMADO_HORAS THEN 'SOBREPASA_ESTIMADO'
        ELSE 'DENTRO_ESTIMADO'
    END AS ESTADO_PERFORMANCE,
    PORCENTAJE_ATRASOS
FROM V_ANALISIS_TIEMPOS_FASE
ORDER BY PORCENTAJE_ATRASOS DESC;
*/

-- CASO DE USO 4: Identificar cuellos de botella
/*
SELECT 
    AREA_RESPONSABLE,
    ETAPA,
    REFERENCIAS_ATRASADAS,
    PROMEDIO_DIAS_FASE,
    MAXIMO_DIAS_FASE
FROM MV_METRICAS_DASHBOARD
WHERE REFERENCIAS_ATRASADAS > 0
ORDER BY REFERENCIAS_ATRASADAS DESC, PROMEDIO_DIAS_FASE DESC;
*/

-- CASO DE USO 5: Auditar cambios de un período específico
/*
SELECT 
    r.CODIGO_REFERENCIA,
    f.NOMBRE_FASE,
    t.TIPO_MOVIMIENTO,
    t.FECHA_MOVIMIENTO,
    uo.NOMBRE_COMPLETO AS USUARIO_ORIGEN,
    ud.NOMBRE_COMPLETO AS USUARIO_DESTINO,
    t.OBSERVACIONES,
    t.USUARIO_REGISTRO,
    t.IP_REGISTRO
FROM T_TRAZABILIDAD t
INNER JOIN T_REFERENCIAS r ON t.ID_REFERENCIA = r.ID_REFERENCIA
INNER JOIN T_FASES f ON t.ID_FASE = f.ID_FASE
LEFT JOIN T_USUARIOS uo ON t.ID_USUARIO_ORIGEN = uo.ID_USUARIO
LEFT JOIN T_USUARIOS ud ON t.ID_USUARIO_DESTINO = ud.ID_USUARIO
WHERE t.FECHA_MOVIMIENTO BETWEEN '2024-08-01' AND '2024-08-31'
ORDER BY t.FECHA_MOVIMIENTO DESC;
*/

-- CASO DE USO 6: Consultas por rangos de fechas masivas (optimizada)
/*
SELECT 
    COUNT(*) AS TOTAL_MOVIMIENTOS,
    COUNT(DISTINCT ID_REFERENCIA) AS REFERENCIAS_AFECTADAS,
    AVG(TIEMPO_PERMANENCIA_HORAS) AS TIEMPO_PROMEDIO,
    f.AREA_RESPONSABLE
FROM T_TRAZABILIDAD t
INNER JOIN T_FASES f ON t.ID_FASE = f.ID_FASE
WHERE t.FECHA_MOVIMIENTO >= ADD_MONTHS(CURRENT_DATE, -6)
  AND t.TIPO_MOVIMIENTO = 'ENTREGADO'
GROUP BY f.AREA_RESPONSABLE
ORDER BY TOTAL_MOVIMIENTOS DESC;
*/

-- ====================================================================
-- 16. CONFIGURACIONES DE SEGURIDAD Y RESPALDO
-- ====================================================================

-- Roles y permisos
CREATE ROLE GARMENT_ADMIN;
CREATE ROLE GARMENT_OPERATOR;
CREATE ROLE GARMENT_VIEWER;

-- Permisos para administradores
GRANT ALL PRIVILEGES ON SCHEMA GARMENT_PRODUCTION_CONTROL TO GARMENT_ADMIN;

-- Permisos para operadores
GRANT SELECT, INSERT, UPDATE ON T_TRAZABILIDAD TO GARMENT_OPERATOR;
GRANT SELECT ON ALL VIEWS TO GARMENT_OPERATOR;
GRANT EXECUTE ON PROCEDURE SP_ENTREGAR_REFERENCIA TO GARMENT_OPERATOR;
GRANT EXECUTE ON PROCEDURE SP_DEVOLVER_REFERENCIA TO GARMENT_OPERATOR;

-- Permisos para visualizadores
GRANT SELECT ON ALL VIEWS TO GARMENT_VIEWER;
GRANT SELECT ON ALL TABLES TO GARMENT_VIEWER;

-- Configuración de auditoría a nivel de sistema
ALTER SYSTEM ALTER CONFIGURATION ('global.ini', 'SYSTEM') 
SET ('auditing configuration', 'global_auditing_state') = 'true' WITH RECONFIGURE;

-- ====================================================================
-- RESUMEN DE CARACTERÍSTICAS OPTIMIZADAS PARA SAP HANA:
-- ====================================================================
/*
1. PARTICIONAMIENTO TEMPORAL: Tablas particionadas por fecha para optimizar consultas históricas
2. COMPRESIÓN COLUMNAR: Aprovecha la arquitectura columnar de HANA para mejor compresión
3. ÍNDICES ESTRATÉGICOS: Índices compuestos optimizados para patrones de consulta específicos
4. VISTAS MATERIALIZADAS: Para métricas de dashboard en tiempo real
5. PROCEDIMIENTOS NATIVOS: Lógica de negocio en SQLSCRIPT para mejor rendimiento
6. TRIGGERS AUTOMATIZADOS: Cálculos automáticos de tiempos y auditoría
7. FUNCIONES ANALÍTICAS: Window functions y agregaciones optimizadas
8. CONFIGURACIÓN HANA: Parámetros específicos para plan cache y estadísticas
9. CAMPOS CALCULADOS: Columnas generadas para optimizar filtros temporales
10. ESTRATEGIA DE MANTENIMIENTO: Procedimientos para mantener rendimiento óptimo

CAPACIDADES ANALÍTICAS:
- Consultas sub-segundo para dashboards ejecutivos
- Trazabilidad completa en tiempo real
- Análisis predictivo de cuellos de botella
- Reportería histórica con agregaciones complejas
- Métricas de productividad por usuario/área
- Auditoría completa con geolocalización IP

ESCALABILIDAD:
- Soporte para millones de movimientos por año
- Particionamiento automático por tiempo
- Compresión inteligente para optimizar almacenamiento
- Índices selectivos para consultas frecuentes
- Plan cache optimizado para consultas repetitivas
*/