import { supabase } from "../lib/supabase";
export const getAdminData = async (adminId)=>{
    try {
        const {data, error} = await supabase.from('admins').select().eq('id', adminId).single();
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

// export const updateStudent = async (adminId, data)=>{
//     try {
//         const {error} = await supabase.from('admins').update({a_name: data.name, phone: data.phone, address: data.address}).eq('id', adminId);
//         if (error) {
//             console.log('got error', error);
//             return {success: false, message: error.message}
//         }
//         return{success: true, data};
//     } catch (error) {
//         console.log('got error', error);
//         return {success: false, message: error.message}
        
//     }
// }