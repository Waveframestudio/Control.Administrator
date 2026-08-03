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
  category: string; // 'all' or AssetCategory
  status: string;   // 'all' or AssetStatus
  criticality: string; // 'all' or AssetCriticality
}

export interface AssetStatsData {
  total: number;
  active: number;
  maintenance: number;
  offline: number;
}
