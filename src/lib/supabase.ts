import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qqnstuzomvpnfbofdpdw.supabase.co";
// Store the anon key in your .env file as VITE_SUPABASE_ANON_KEY
// Never expose the service_role key in client code
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Game = {
  id: string;
  name: string;
  description: string;
  file_size: string;
  platform: "PSP" | "PS2";
  genres: string[];
  download_link: string;
  cover_url: string;
  screenshots: string[];
  created_at: string;
};
