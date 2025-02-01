import { supabase } from "../lib/supabase";

export const getStudentData = async (studentId) => {
    try {
        // console.log(studentId);
        
        const { data, error } = await supabase
            .from('student')
            .select()
            .eq('id', studentId);

        if (error) {
            throw new Error(error.message);  // Explicitly throw the error message
        }
        // console.log(data);
        
        return data;  // Return the fetched data if successful
    } catch (error) {
        console.error("Error fetching student data:", error.message);
        throw new Error("Failed to fetch student data");  // Provide a generic message for the caller
    }
};
