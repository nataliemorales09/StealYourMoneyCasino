export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      branches: {
        Row: {
          branch_id: number
          city: string | null
          state: string | null
        }
        Insert: {
          branch_id?: number
          city?: string | null
          state?: string | null
        }
        Update: {
          city?: string | null
          state?: string | null
        }
        Relationships: []
      }
      persons: {
        Row: {
          person_id: number
          name_first: string | null
          name_last: string | null
          email: string | null
        }
        Insert: {
          person_id?: number
          name_first?: string | null
          name_last?: string | null
          email?: string | null
        }
        Update: {
          name_first?: string | null
          name_last?: string | null
          email?: string | null
        }
        Relationships: []
      }
      employees: {
        Row: {
          employee_id: number
          position: string | null
        }
        Insert: {
          employee_id: number
          position?: string | null
        }
        Update: {
          position?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "persons"
            referencedColumns: ["person_id"]
          },
        ]
      }
      games: {
        Row: {
          game_id: number
          name: string | null
          price_per_play: number | null
        }
        Insert: {
          game_id?: number
          name?: string | null
          price_per_play?: number | null
        }
        Update: {
          name?: string | null
          price_per_play?: number | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          customer_id: number
          credit: number
        }
        Insert: {
          customer_id: number
          credit: number
        }
        Update: {
          credit?: number
        }
        Relationships: [
          {
            foreignKeyName: "customers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "persons"
            referencedColumns: ["person_id"]
          },
        ]
      }
      special_rooms: {
        Row: {
          room_id: number
          type: string | null
        }
        Insert: {
          room_id?: number
          type?: string | null
        }
        Update: {
          type?: string | null
        }
        Relationships: []
      }
      games_at_branches: {
        Row: {
          game_id: number
          branch_id: number
        }
        Insert: {
          game_id: number
          branch_id: number
        }
        Update: {
          // Composite primary key; updates should not change keys.
        }
        Relationships: [
          {
            foreignKeyName: "games_at_branches_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "games_at_branches_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
        ]
      }
      rooms_at_branches: {
        Row: {
          room_id: number
          branch_id: number
        }
        Insert: {
          room_id: number
          branch_id: number
        }
        Update: {
          // Composite primary key; updates should not change keys.
        }
        Relationships: [
          {
            foreignKeyName: "rooms_at_branches_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "rooms_at_branches_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "special_rooms"
            referencedColumns: ["room_id"]
          },
        ]
      }
      works_at: {
        Row: {
          employee_id: number
          branch_id: number
          since: string
          to: string | null
        }
        Insert: {
          employee_id: number
          branch_id: number
          since: string
          to?: string | null
        }
        Update: {
          to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "works_at_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "works_at_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      management: {
        Row: {
          employee_id: number
          branch_id: number
        }
        Insert: {
          employee_id: number
          branch_id: number
        }
        Update: {
          // Both columns effectively identify the row; don't allow updating them.
        }
        Relationships: [
          {
            foreignKeyName: "management_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: true
            referencedRelation: "branches"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "management_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: true
            referencedRelation: "employees"
            referencedColumns: ["employee_id"]
          },
        ]
      }
      gameplay: {
        Row: {
          customer_id: number
          game_id: number
          time_played: string
          money_won: number
        }
        Insert: {
          customer_id: number
          game_id: number
          time_played: string
          money_won: number
        }
        Update: {
          money_won?: number
        }
        Relationships: [
          {
            foreignKeyName: "gameplay_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "gameplay_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["game_id"]
          },
        ]
      }
      cocktails: {
        Row: {
          drink_id: number
          name: string
        }
        Insert: {
          drink_id: number
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      cocktail_offerings: {
        Row: {
          offering_id: number
          bar_id: number
          drink_id: number
          price: number
        }
        Insert: {
          offering_id: number
          bar_id: number
          drink_id: number
          price: number
        }
        Update: {
          bar_id?: number
          drink_id?: number
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "cocktail_offerings_bar_id_fkey"
            columns: ["bar_id"]
            isOneToOne: false
            referencedRelation: "special_rooms"
            referencedColumns: ["room_id"]
          },
          {
            foreignKeyName: "cocktail_offerings_drink_id_fkey"
            columns: ["drink_id"]
            isOneToOne: false
            referencedRelation: "cocktails"
            referencedColumns: ["drink_id"]
          },
        ]
      }
      cocktail_purchases: {
        Row: {
          customer_id: number
          offering_id: number
          date: string
        }
        Insert: {
          customer_id: number
          offering_id: number
          date: string
        }
        Update: {
          // Composite primary key; purchases are immutable identifiers.
        }
        Relationships: [
          {
            foreignKeyName: "cocktail_purchases_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["customer_id"]
          },
          {
            foreignKeyName: "cocktail_purchases_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "cocktail_offerings"
            referencedColumns: ["offering_id"]
          },
        ]
      }
      shows: {
        Row: {
          show_id: number
          name: number | null
        }
        Insert: {
          show_id: number
          name?: number | null
        }
        Update: {
          name?: number | null
        }
        Relationships: []
      }
      show_offerings: {
        Row: {
          showroom_id: number
          show_id: number | null
          date: string | null
        }
        Insert: {
          showroom_id: number
          show_id?: number | null
          date?: string | null
        }
        Update: {
          // Composite primary key; offerings are immutable identifiers.
        }
        Relationships: [
          {
            foreignKeyName: "show_offerings_show_id_fkey"
            columns: ["show_id"]
            isOneToOne: false
            referencedRelation: "shows"
            referencedColumns: ["show_id"]
          },
          {
            foreignKeyName: "show_offerings_showroom_id_fkey"
            columns: ["showroom_id"]
            isOneToOne: false
            referencedRelation: "special_rooms"
            referencedColumns: ["room_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
};
