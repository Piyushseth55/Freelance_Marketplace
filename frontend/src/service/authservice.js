import { myAxios } from "./helper"
export const login=(loginDetails)=>{
    return myAxios.post('/login',loginDetails)
    .then((response)=>response.data)

}