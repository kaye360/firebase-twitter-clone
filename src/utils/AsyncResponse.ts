import { AsynchronousResponse } from './types';


export class AsyncResponse {


    /**
     * @method Success
     * Factory function for returning a standardized successful 
     * response object for async functions
     * 
     * @param message
     * (string) (optional) The message to be used in the UI
     * 
     * @param content
     * (string) (optional) Any retrieved content that needs to be
     * displayed in the UI
     */
    public static success(
        {message, content} : {message? : string, content? : string } = {}
    ) : AsynchronousResponse {
        
        return { success : true, message, content }
    }
        
        
    /**
     * @method Success
     * Factory function for returning a standardized error 
     * response object for async functions
     * 
     * @param message
     * (string) (optional) The message to be used in the UI
     * 
     * @param content
     * (string) (optional) Any retrieved content that needs to be
     * displayed in the UI
     */
    public static error(
        {message, content} : {message? : string, content? : string } = {}
    ) : AsynchronousResponse {

        return { success : false, message, content }
    }
}