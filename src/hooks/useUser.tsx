import { useSelector } from "react-redux"
import { currentUserHandle } from "../slices/userSlice"


export interface UseUser {
    id     : string, 
    handle : string,
}

export default function useUser() : UseUser {

    return useSelector(currentUserHandle)
    
}
