export type AssetCategory = 'Server' | 'Workstation' | 'Database' | 'Network';
export type AssetStatus = 'Active' | 'Maintenance' | 'Offline';
export type AssetCriticality = 'Low' | 'Medium' | 'High' | 'Critical';

export interface SystemAsset {
  id: string;
  name: string;
  ip_address: string;
  category: AssetCategory;
  status: AssetStatus;
  criticality: AssetCriticality;
  last_inspected: string;

  // Campos de Ficha Técnica (Orden de Producción)
  client_id?: string;
  fecha_comienzo?: string;
  fecha_fin?: string;
  fecha_entrega?: string;

  // Producto
  producto?: string;

  // Producto Solicitado
  descripcion?: string;
  ancho?: string;
  largo?: string;
  micrones?: string;
  cantidad_unidades?: string | number;
  cantidad_kilos?: string | number;
  cantidad_metros?: string | number;
  dato_extra_producto?: string;

  // Extrusión
  material_cliente?: 'SI' | 'NO' | 'si' | 'no';
  tubo_tipo?: string;
  tratado?: 'SI' | 'NO' | 'si' | 'no';
  caras_extrusion?: string;
  fuelle?: 'SI' | 'NO' | 'si' | 'no';
  fuelle_cm?: string;
  microperforada?: 'SI' | 'NO' | 'si' | 'no';
  material_a_extrudar?: string;
  color_tela?: string;
  kilos_extrudados?: string | number;
  metros_extrudados?: string | number;
  cantidad_bobinas?: string | number;
  dato_extra_extrusion?: string;
  extrusor?: string;

  // Confección
  corte?: 'LATERAL' | 'FONDO' | 'Lateral' | 'Fondo';
  golpes_por_minuto?: string | number;
  pista?: 'SIMPLE' | 'DOBLE' | 'TRIPLE' | 'Simple' | 'Doble' | 'Triple';
  fuelle_confeccion?: 'SI' | 'NO' | 'si' | 'no';
  perforado?: 'SI' | 'NO' | 'si' | 'no';
  bolsa_exhibidora?: 'SI' | 'NO' | 'si' | 'no';
  dato_extra_confeccion?: string;
  cantidad_resultante?: string | number;
  bultos?: string | number;
  confeccionista?: string;

  // Impresión
  impresion_caras?: '1 CARA' | '2 CARAS' | '1 cara' | '2 caras';
  colores_impresion?: '1C' | '2C' | '3C' | '4C' | '5C' | '6C';
  impresion_lateral?: 'SI' | 'NO' | 'si' | 'no';
  impresion_fondo?: 'SI' | 'NO' | 'si' | 'no';
  metros_por_hora?: string | number;
  t_puesta_a_punto?: string;
  t_impresion?: string;
  cilindro?: string;
  bobinas_impresas?: string | number;
  colores_detalle?: string;
  impresor?: string;

  // Observaciones
  observaciones?: string;
}

export interface AssetFiltersState {
  search: string;
  field: string; // 'all' | 'client_id' | 'name' | 'producto' | 'status' | 'fecha_comienzo' | 'fecha_fin' | 'fecha_entrega'
}

export interface AssetStatsData {
  total: number;
  active: number;
  maintenance: number;
  offline: number;
}

export function parseDateString(dateStr?: string | null): Date | null {
  if (!dateStr || !dateStr.trim()) return null;
  const trimmed = dateStr.trim();

  // Si viene en formato DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
    const [d, m, y] = trimmed.split('/').map(Number);
    return new Date(y, m - 1, d);
  }

  // Si viene en formato YYYY-MM-DD
  const dateOnly = trimmed.split('T')[0].split(' ')[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    const [y, m, d] = dateOnly.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

export function getEffectiveStatus(asset: Partial<SystemAsset>): AssetStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = parseDateString(asset.fecha_comienzo);
  const end = parseDateString(asset.fecha_fin);
  const delivery = parseDateString(asset.fecha_entrega);

  // 1. Si existe fecha de entrega y hoy es >= fecha de entrega -> Entregado ('Offline')
  if (delivery && today >= delivery) {
    return 'Offline';
  }

  // 2. Si existe fecha de fin y hoy es >= fecha de fin -> Finalizado ('Maintenance')
  if (end && today >= end) {
    return 'Maintenance';
  }

  // 3. Si existe fecha de comienzo y hoy es >= fecha de comienzo -> En proceso ('Active')
  if (start && today >= start) {
    return 'Active';
  }

  // Fallback al estado explícito o por defecto 'Active'
  const s = (asset.status || '').toLowerCase().trim();
  if (s === 'maintenance' || s === 'finalizado') return 'Maintenance';
  if (s === 'offline' || s === 'entregado') return 'Offline';
  return 'Active';
}
