import { supabase } from "../lib/supabase";

export const getCourseData = async ()=>{
    try {
        const {data, error} = await supabase.from('course').select('*').eq('request', 'pending')
        if (error) {
            console.log('got error', error);
            return {success: false, message: error.message}
        }
        
        return{success: true, data};
    } catch (error) {
        console.log('got error', error);
        return {success: false, message: error.message}
        
    }
}
