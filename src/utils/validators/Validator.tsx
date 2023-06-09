

export default class Validator {

    public static regexHashTag      = /^[a-zA-Z0-9-]+$/
    public static regexUserHandle   = /^[a-zA-Z0-9._-]+$/
    public static regexUserLocation = /^[a-zA-Z0-9 .,-]+$/

    public static isEmpty(string: string) {
        return ( !string || string.length === 0 )
    }

    public static isTooShort(string: string, minLength: number) {
        return string.length < minLength
    }

    public static isTooLong(string: string, maxLength: number) {
        return string.length > maxLength
    }

    public static hasForbiddenCharacters(string: string, regex: RegExp) {
        return !regex.test(string)
    }

    public static isTaken(string: string, all: string[], loggedInUser: string) {
        return all.includes(string) && string !== loggedInUser
    }

}