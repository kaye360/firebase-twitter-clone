import { Dispatch, useContext, useEffect, useState } from "react"
import { AppContext } from "../App"
import { auth } from "../../firebase-config"



interface UseValidateCommentProps {
    defaultCommentBody? : string,
}


interface UseValidateComment { 
    commentBody         : string, 
    setCommentBody      : Dispatch<React.SetStateAction<string>>, 
    submitMessage       : string, 
    setSubmitMessage    : Dispatch<React.SetStateAction<string>>, 
    resetForm           : Function, 
    errorMessage        : string, 
    isOnChangeValidated : boolean,
    isOnSubmitValidated : Function,
}

export default function useValidateComment({defaultCommentBody = ''} : UseValidateCommentProps) : UseValidateComment {

    const appContext  = useContext(AppContext)

    
    const [commentBody, setCommentBody]                 = useState<string>(defaultCommentBody)
    const [errorMessage, setErrorMessage]               = useState<string>('')
    const [submitMessage, setSubmitMessage]             = useState<string>('')
    const [isOnChangeValidated, setIsOnChangeValidated] = useState<boolean>(true)
    

    const isLoggedIn = typeof auth.currentUser?.uid === 'string' && typeof appContext?.userHandle === 'string'
    const isEmpty    = !commentBody.trim() || commentBody.trim().length === 0
    const isTooLong  = commentBody.length > 200


    const validateComment   = () : void => setIsOnChangeValidated(true)
    const invalidateComment = () : void => setIsOnChangeValidated(false)


    function resetForm() {
        setCommentBody('')
        setErrorMessage('')
        setSubmitMessage('')
        setIsOnChangeValidated(true)
    }
    

    async function isOnSubmitValidated() : Promise<boolean> {

        if( !isLoggedIn ) {
            setSubmitMessage('You must be logged in to post')
            return false
        }

        if( !isOnChangeValidated ) {
            setSubmitMessage("Comment invalid. Please check your comment for errors")
            return false
        }

        if( isEmpty ) {
            setSubmitMessage('Please enter a comment.')
            return false
        }

        return true
    }


    useEffect( () => {
        ( function validateCommentBody() {

            invalidateComment()

            if( isTooLong ) {
                setErrorMessage('Comment must be less than 200 characters')

            } else { // Validated
                setErrorMessage('')
                validateComment()
            }
        })()
    }, [commentBody])


    return { 
        commentBody, setCommentBody, 
        submitMessage, setSubmitMessage, 
        isOnChangeValidated, 
        isOnSubmitValidated,
        errorMessage, 
        resetForm, 
    }
}
