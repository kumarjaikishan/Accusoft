import { useState } from "react";


export const useForm = (initial = {}) => {

    const [fields, setfields] = useState(initial);
    const handlechange = (e) => {
        const { name, value } = e.target;
        setfields((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }
    const reset = (e) => {
        setfields(initial)
    }
    const editfields=(obj)=>{
          setfields((prev) => {
            return {
               ...prev,
               ...obj
            }
        })
    }

    return { fields, handlechange, reset,editfields };
};
