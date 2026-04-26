import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qqnstuzomvpnfbofdpdw.supabase.co";
// Store the anon key in your .env file as VITE_SUPABASE_ANON_KEY
// Never expose the service_role key in client code
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxbnN0dXpvbXZwbmZib2ZkcGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyMjExODIsImV4cCI6MjA5Mjc5NzE4Mn0.-EhVFPwQAnw4qS1R2LUVcuEWxMX0oIH6a94c-NwtVrQ"

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
