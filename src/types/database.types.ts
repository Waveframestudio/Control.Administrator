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
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          ip_address: string;
          category: 'Server' | 'Workstation' | 'Database' | 'Network';
          status: 'Active' | 'Maintenance' | 'Offline';
          criticality: 'Low' | 'Medium' | 'High' | 'Critical';
          last_inspected?: string;
          created_at?: string;
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
