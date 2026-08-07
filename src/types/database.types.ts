// ─── Database Types ───────────────────────────────────────────────────────────
// Minimal manual type definitions for the tables we create.
// For full type generation, run: npx supabase gen types typescript --project-id YOUR_ID
//
// NOTE: Each table must include a `Relationships` array to satisfy the
// GenericTable constraint from @supabase/postgrest-js.

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'viewer';
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'admin' | 'viewer';
          full_name?: string | null;
        };
        Update: {
          role?: 'admin' | 'viewer';
          full_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          name: string;
          ip_address: string;
          category: 'Server' | 'Workstation' | 'Database' | 'Network';
          status: 'Active' | 'Maintenance' | 'Offline';
          criticality: 'Low' | 'Medium' | 'High' | 'Critical';
          last_inspected: string;
          created_at?: string;

          client_id?: string | null;
          fecha_comienzo?: string | null;
          fecha_fin?: string | null;
          fecha_entrega?: string | null;

          producto?: string | null;
          descripcion?: string | null;
          ancho?: string | null;
          largo?: string | null;
          micrones?: string | null;
          cantidad_unidades?: string | number | null;
          cantidad_kilos?: string | number | null;
          cantidad_metros?: string | number | null;
          dato_extra_producto?: string | null;

          material_cliente?: string | null;
          tubo_tipo?: string | null;
          tratado?: string | null;
          caras_extrusion?: string | null;
          fuelle?: string | null;
          fuelle_cm?: string | null;
          microperforada?: string | null;
          material_a_extrudar?: string | null;
          color_tela?: string | null;
          kilos_extrudados?: string | number | null;
          metros_extrudados?: string | number | null;
          cantidad_bobinas?: string | number | null;
          dato_extra_extrusion?: string | null;
          extrusor?: string | null;

          corte?: string | null;
          golpes_por_minuto?: string | number | null;
          pista?: string | null;
          fuelle_confeccion?: string | null;
          perforado?: string | null;
          bolsa_exhibidora?: string | null;
          dato_extra_confeccion?: string | null;
          cantidad_resultante?: string | number | null;
          bultos?: string | number | null;
          confeccionista?: string | null;

          impresion_caras?: string | null;
          colores_impresion?: string | null;
          impresion_lateral?: string | null;
          impresion_fondo?: string | null;
          metros_por_hora?: string | number | null;
          t_puesta_a_punto?: string | null;
          t_impresion?: string | null;
          cilindro?: string | null;
          bobinas_impresas?: string | number | null;
          colores_detalle?: string | null;
          impresor?: string | null;

          observaciones?: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          ip_address: string;
          category?: 'Server' | 'Workstation' | 'Database' | 'Network';
          status?: 'Active' | 'Maintenance' | 'Offline';
          criticality?: 'Low' | 'Medium' | 'High' | 'Critical';
          last_inspected?: string;
          created_at?: string;

          client_id?: string | null;
          fecha_comienzo?: string | null;
          fecha_fin?: string | null;
          fecha_entrega?: string | null;

          producto?: string | null;
          descripcion?: string | null;
          ancho?: string | null;
          largo?: string | null;
          micrones?: string | null;
          cantidad_unidades?: string | number | null;
          cantidad_kilos?: string | number | null;
          cantidad_metros?: string | number | null;
          dato_extra_producto?: string | null;

          material_cliente?: string | null;
          tubo_tipo?: string | null;
          tratado?: string | null;
          caras_extrusion?: string | null;
          fuelle?: string | null;
          fuelle_cm?: string | null;
          microperforada?: string | null;
          material_a_extrudar?: string | null;
          color_tela?: string | null;
          kilos_extrudados?: string | number | null;
          metros_extrudados?: string | number | null;
          cantidad_bobinas?: string | number | null;
          dato_extra_extrusion?: string | null;
          extrusor?: string | null;

          corte?: string | null;
          golpes_por_minuto?: string | number | null;
          pista?: string | null;
          fuelle_confeccion?: string | null;
          perforado?: string | null;
          bolsa_exhibidora?: string | null;
          dato_extra_confeccion?: string | null;
          cantidad_resultante?: string | number | null;
          bultos?: string | number | null;
          confeccionista?: string | null;

          impresion_caras?: string | null;
          colores_impresion?: string | null;
          impresion_lateral?: string | null;
          impresion_fondo?: string | null;
          metros_por_hora?: string | number | null;
          t_puesta_a_punto?: string | null;
          t_impresion?: string | null;
          cilindro?: string | null;
          bobinas_impresas?: string | number | null;
          colores_detalle?: string | null;
          impresor?: string | null;

          observaciones?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          ip_address?: string;
          category?: 'Server' | 'Workstation' | 'Database' | 'Network';
          status?: 'Active' | 'Maintenance' | 'Offline';
          criticality?: 'Low' | 'Medium' | 'High' | 'Critical';
          last_inspected?: string;
          created_at?: string;

          client_id?: string | null;
          fecha_comienzo?: string | null;
          fecha_fin?: string | null;
          fecha_entrega?: string | null;

          producto?: string | null;
          descripcion?: string | null;
          ancho?: string | null;
          largo?: string | null;
          micrones?: string | null;
          cantidad_unidades?: string | number | null;
          cantidad_kilos?: string | number | null;
          cantidad_metros?: string | number | null;
          dato_extra_producto?: string | null;

          material_cliente?: string | null;
          tubo_tipo?: string | null;
          tratado?: string | null;
          caras_extrusion?: string | null;
          fuelle?: string | null;
          fuelle_cm?: string | null;
          microperforada?: string | null;
          material_a_extrudar?: string | null;
          color_tela?: string | null;
          kilos_extrudados?: string | number | null;
          metros_extrudados?: string | number | null;
          cantidad_bobinas?: string | number | null;
          dato_extra_extrusion?: string | null;
          extrusor?: string | null;

          corte?: string | null;
          golpes_por_minuto?: string | number | null;
          pista?: string | null;
          fuelle_confeccion?: string | null;
          perforado?: string | null;
          bolsa_exhibidora?: string | null;
          dato_extra_confeccion?: string | null;
          cantidad_resultante?: string | number | null;
          bultos?: string | number | null;
          confeccionista?: string | null;

          impresion_caras?: string | null;
          colores_impresion?: string | null;
          impresion_lateral?: string | null;
          impresion_fondo?: string | null;
          metros_por_hora?: string | number | null;
          t_puesta_a_punto?: string | null;
          t_impresion?: string | null;
          cilindro?: string | null;
          bobinas_impresas?: string | number | null;
          colores_detalle?: string | null;
          impresor?: string | null;

          observaciones?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'admin' | 'viewer';
    };
  };
};
