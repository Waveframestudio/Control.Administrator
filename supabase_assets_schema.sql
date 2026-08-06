-- ==============================================================================
-- SCRIPT COMPLETO DE TABLA 'assets' PARA SUPABASE (RD PLAST)
-- Copia y pega todo este contenido en el Editor SQL de tu panel de Supabase
-- ==============================================================================

-- 1. Crear tabla principal si no existe
CREATE TABLE IF NOT EXISTS public.assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    ip_address TEXT DEFAULT '',
    category TEXT DEFAULT 'Workstation',
    status TEXT DEFAULT 'Active',
    criticality TEXT DEFAULT 'Medium',
    last_inspected TIMESTAMPTZ DEFAULT NOW(),

    -- Datos de Identificación y Fechas del Cliente
    client_id TEXT,
    fecha_comienzo TEXT,
    fecha_fin TEXT,
    fecha_entrega TEXT,

    -- Sección 1: Producto Solicitado
    producto TEXT,
    descripcion TEXT,
    ancho TEXT,
    largo TEXT,
    micrones TEXT,
    cantidad_unidades TEXT,
    cantidad_kilos TEXT,
    cantidad_metros TEXT,
    dato_extra_producto TEXT,

    -- Sección 2: Datos de Extrusión
    material_cliente TEXT DEFAULT 'no',
    tubo_tipo TEXT,
    tratado TEXT DEFAULT 'no',
    caras_extrusion TEXT DEFAULT '1 cara',
    fuelle TEXT DEFAULT 'no',
    fuelle_cm TEXT,
    microperforada TEXT DEFAULT 'no',
    material_a_extrudar TEXT,
    color_tela TEXT,
    kilos_extrudados TEXT,
    metros_extrudados TEXT,
    cantidad_bobinas TEXT,
    dato_extra_extrusion TEXT,
    extrusor TEXT,

    -- Sección 3: Datos de Confección
    corte TEXT DEFAULT 'Lateral',
    golpes_por_minuto TEXT,
    pista TEXT DEFAULT 'Simple',
    fuelle_confeccion TEXT DEFAULT 'no',
    perforado TEXT DEFAULT 'no',
    bolsa_exhibidora TEXT DEFAULT 'no',
    dato_extra_confeccion TEXT,
    cantidad_resultante TEXT,
    bultos TEXT,
    confeccionista TEXT,

    -- Sección 4: Datos de Impresión
    impresion_caras TEXT DEFAULT '1 cara',
    colores_impresion TEXT DEFAULT '1C',
    impresion_lateral TEXT DEFAULT 'no',
    impresion_fondo TEXT DEFAULT 'no',
    metros_por_hora TEXT,
    t_puesta_a_punto TEXT,
    t_impresion TEXT,
    cilindro TEXT,
    bobinas_impresas TEXT,
    colores_detalle TEXT,
    impresor TEXT,

    -- Observaciones Generales
    observaciones TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Asegurar que todas las columnas existan si la tabla ya había sido creada antes
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS client_id TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS fecha_comienzo TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS fecha_fin TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS fecha_entrega TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS producto TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS descripcion TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS ancho TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS largo TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS micrones TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS cantidad_unidades TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS cantidad_kilos TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS cantidad_metros TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS dato_extra_producto TEXT;

ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS material_cliente TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS tubo_tipo TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS tratado TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS caras_extrusion TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS fuelle TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS fuelle_cm TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS microperforada TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS material_a_extrudar TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS color_tela TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS kilos_extrudados TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS metros_extrudados TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS cantidad_bobinas TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS dato_extra_extrusion TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS extrusor TEXT;

ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS corte TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS golpes_por_minuto TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS pista TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS fuelle_confeccion TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS perforado TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS bolsa_exhibidora TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS dato_extra_confeccion TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS cantidad_resultante TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS bultos TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS confeccionista TEXT;

ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS impresion_caras TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS colores_impresion TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS impresion_lateral TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS impresion_fondo TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS metros_por_hora TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS t_puesta_a_punto TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS t_impresion TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS cilindro TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS bobinas_impresas TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS colores_detalle TEXT;
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS impresor TEXT;

ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS observaciones TEXT;

-- 3. Habilitar políticas RLS públicas para lectura y guardado sin errores de permisos
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir lectura publica de assets" ON public.assets;
CREATE POLICY "Permitir lectura publica de assets" ON public.assets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir insercion publica de assets" ON public.assets;
CREATE POLICY "Permitir insercion publica de assets" ON public.assets FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualizacion publica de assets" ON public.assets;
CREATE POLICY "Permitir actualizacion publica de assets" ON public.assets FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir eliminacion publica de assets" ON public.assets;
CREATE POLICY "Permitir eliminacion publica de assets" ON public.assets FOR DELETE USING (true);
