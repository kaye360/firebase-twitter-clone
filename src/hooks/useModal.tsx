import { useState } from "react"

export interface UseModal {
    content : JSX.Element | null,
    set     : Function,
    close   : Function,
}

export default function useModal() : UseModal  {


    const [content, set] = useState<JSX.Element | null>(null)

    
    function close() : void {
        set(null)
    }


    return { content, set, close }
}


export const defaulModalContext = { content: null, set: () => {}, close : () => {} }