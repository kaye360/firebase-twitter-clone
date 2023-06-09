import Validator from "./Validator";



interface SearchValidatorProps {
    searchPhrase : string,
}

export default class SearchValidator extends Validator {

    public static onSubmit({searchPhrase} : SearchValidatorProps) : void {

        if( this.isEmpty(searchPhrase) ) {
            throw 'Please enter a search phrase'
        }

        if( this.hasForbiddenCharacters(searchPhrase, this.regexHashTag) ) {
            throw 'Tags may only have letters, numbers, and hyphens (-).'
        }
    }
}