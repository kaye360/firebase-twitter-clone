

export default class Validator {

    static regexHashTag      = /^[a-zA-Z0-9-]+$/
    static regexUserHandle   = /^[a-zA-Z0-9._-]+$/
    static regexUserLocation = /^[a-zA-Z0-9 .,-]+$/

    static isEmpty(string: string) {
        return ( !string || string.length === 0 )
    }

    static isTooShort(string: string, minLength: number) {
        return string.length < minLength
    }

    static isTooLong(string: string, maxLength: number) {
        return string.length > maxLength
    }

    static hasForbiddenCharacters(string: string, regex: RegExp) {
        return !regex.test(string)
    }

    static isTaken(string: string, all: string[], loggedInUser: string) {
        return all.includes(string) && string !== loggedInUser
    }

}