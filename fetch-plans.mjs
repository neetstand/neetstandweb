import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing supabase credentials in env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchPlans() {
    const { data, error } = await supabase.from('plans').select('*');
    if (error) {
        console.error("Error fetching plans:", error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

fetchPlans();
