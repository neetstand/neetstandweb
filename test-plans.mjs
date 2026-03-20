import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchPlans() {
    const { data, error } = await supabase.from('plans').select('*');
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Data length:", data?.length);
        console.log("Data:", data);
    }
}

fetchPlans();
