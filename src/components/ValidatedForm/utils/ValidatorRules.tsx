import { auth } from "../../../../firebase-config"


interface ValidateProps {
    title  : string,
    string : string,
    rules  : Rules,
}

export interface Rules {
    required?       : true,
    minLength?      : number,
    maxLength?      : number,
    allowableChars? : {
        regex : RegExp,
        chars : string,
    },
    unique? : {
        all                  : string[],
        currentLoggedInUsername : string,
    },
    auth? : true,
}

export default class ValidatorRules {

    public static regexHashTag      = /^[a-zA-Z0-9-]+$/
    public static regexUserHandle   = /^[a-zA-Z0-9._-]+$/
    public static regexUserLocation = /^[a-zA-Z0-9 .,-]+$/

    public static isEmpty(string: string) : boolean {
        return ( !string || string.length === 0 )
    }

    public static isTooShort(string: string, minLength: number) : boolean {
        return string.length < minLength
    }

    public static isTooLong(string: string, maxLength: number) : boolean {
        return string.length > maxLength
    }

    public static hasForbiddenCharacters(string: string, regex: RegExp) : boolean {
        return !regex.test(string)
    }

    public static isTaken(string: string, all: string[], loggedInUser: string) : boolean {
        return all.includes(string) && string !== loggedInUser
    }

    public static isLoggedIn() : boolean {
        return !!auth.currentUser
    }


    /**
     * @method validate() Validates an input or textarea value, or Form submission
     * 
     * @param title    
     * Name of field. If a form submission, set to 'FormSubmit'
     * 
     * @param string   
     * String to validate. If a form submission, set to empty string
     * 
     * @param rules    Rules object to validate string against
     */
    public static validate({title, string, rules } : ValidateProps) : void {


        /**
         * Is empty
         */
        if( 
            'required' in rules && 
            rules.required === true && 
            this.isEmpty(string)
        ) {
            throw `${title} is required.`
        }


        /**
         * Is Too Short
         */
        if( 
            'minLength' in rules && 
            typeof rules.minLength === 'number' && 
            this.isTooShort(string, rules.minLength) 
        ) {
            throw `${title} must have a minimum of ${rules.minLength} characters.`
        }

        /**
         * Is Too Long
         */
        if(
            'maxLength' in rules &&
            typeof rules.maxLength === 'number' &&
            this.isTooLong(string, rules.maxLength)
        ) {
            throw `${title} may not be longer than ${rules.maxLength} characters.`
        }

        /**
         * Has Forbidden Characters
         */
        if(
            'allowableChars' in rules && typeof rules.allowableChars === 'object' &&
            'regex' in rules.allowableChars && 
            'chars' in rules.allowableChars &&
            this.hasForbiddenCharacters(string, rules.allowableChars.regex)
        ) {
            throw `${title} may only have ${rules.allowableChars.chars}.`
        }

        /**
         * Is Taken
         */
        if(
            'unique' in rules && typeof rules.unique === 'object' &&
            'all' in rules.unique &&
            'currentLoggedInUsername' in rules.unique &&
            this.isTaken(string, rules.unique.all, rules.unique.currentLoggedInUsername)
        ) {
            throw `${string} is already taken.`
        }

        /**
         * Is Logged In
         */
        if(
            'auth' in rules &&
            !this.isLoggedIn()
        ) {
            throw 'You must be logged in.'
        }

    }
}