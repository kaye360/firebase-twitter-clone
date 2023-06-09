import { auth } from "../../../firebase-config";
import Validator from "./Validator";


interface PostValidatorProps {
    postBody : string
}


export default class PostValidator extends Validator {

    public static maxLength: number = 200


    public static onChange({postBody} : PostValidatorProps) : void {

        if( this.isEmpty(postBody) ) {
            throw 'Please enter a post.'
        }

        if( this.isTooLong(postBody, this.maxLength)) {
            throw `Post may not exceed ${this.maxLength} characters`
        }

    }


    public static onSubmit({postBody} : PostValidatorProps) : void {

        this.onChange({postBody})

        if( !postBody || postBody === '' || typeof postBody !== 'string' ) {
            throw 'Invalid post type.'
        }

        if( !auth.currentUser ) {
            throw 'You must be logged in to post.'
        }
    }

}