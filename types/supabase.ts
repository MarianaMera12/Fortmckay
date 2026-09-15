export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" };
  public: {
    Tables: {
      members: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          phone: string;
          email: string | null;
          membership_status: "active" | "paused" | "inactive";
          member_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          phone: string;
          email?: string | null;
          membership_status?: "active" | "paused" | "inactive";
          member_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          email?: string | null;
          membership_status?: "active" | "paused" | "inactive";
          member_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      attendance: {
        Row: {
          id: string;
          member_id: string;
          check_in: string;
          check_out: string | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          check_in?: string;
          check_out?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          check_in?: string;
          check_out?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "attendance_member_id_fkey";
            columns: ["member_id"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
        ];
      };
      classes: {
        Row: {
          id: string;
          name: string;
          instructor: string;
          date: string;
          start_time: string;
          end_time: string;
          capacity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          instructor: string;
          date: string;
          start_time: string;
          end_time: string;
          capacity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          instructor?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          capacity?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      reservations: {
        Row: {
          id: string;
          class_id: string;
          name: string;
          phone: string;
          email: string;
          status: "confirmed" | "cancelled";
          created_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          name: string;
          phone: string;
          email: string;
          status?: "confirmed" | "cancelled";
          created_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          name?: string;
          phone?: string;
          email?: string;
          status?: "confirmed" | "cancelled";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reservations_class_id_fkey";
            columns: ["class_id"];
            isOneToOne: false;
            referencedRelation: "classes";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      class_availability: {
        Row: { class_id: string; capacity: number; reserved: number };
        Relationships: [];
      };
    };
    Functions: {
      reserve_class: {
        Args: {
          p_class_id: string;
          p_name: string;
          p_phone: string;
          p_email: string;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

type DefaultSchema = Database["public"];

export type Tables<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName]["Row"];

export type TablesInsert<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName]["Insert"];

export type TablesUpdate<TableName extends keyof DefaultSchema["Tables"]> =
  DefaultSchema["Tables"][TableName]["Update"];

export type Enums<EnumName extends keyof DefaultSchema["Enums"]> =
  DefaultSchema["Enums"][EnumName];

export type CompositeTypes<
  CompositeTypeName extends keyof DefaultSchema["CompositeTypes"],
> = DefaultSchema["CompositeTypes"][CompositeTypeName];