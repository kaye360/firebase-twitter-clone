import { ResponseSuccess } from "../utils/types";


interface MarkNotifcationsAsReadProps {
    userId : string
}

export function markNotifcationsAsRead({userId} : MarkNotifcationsAsReadProps) : ResponseSuccess {
    try {
        userId
        return {} as ResponseSuccess
    } catch (error) {
        
        return {} as ResponseSuccess
    }
}