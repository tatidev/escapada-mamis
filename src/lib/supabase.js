import { createClient } from '@supabase/supabase-js';

// Usamos valores por defecto vacíos para evitar que el constructor de Supabase explote
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || "";
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
    console.error("⚠️ Error: Las variables de Supabase no están cargadas.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);