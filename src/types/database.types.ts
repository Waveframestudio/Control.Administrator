// ─── Database Types ───────────────────────────────────────────────────────────
// Minimal manual type definitions for the tables we create.
// For full type generation, run: npx supabase gen types typescript --project-id YOUR_ID

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
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: 'admin' | 'viewer';
    };
  };
};
