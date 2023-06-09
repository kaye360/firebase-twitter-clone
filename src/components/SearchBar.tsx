import { useNavigate } from "react-router-dom";
import { SyntheticEvent, useEffect, useState } from "react";
import Icon from "./Icon";
import Button from "./Button";
import ValidationError from "./Validation/ValidationError";
import SearchValidator from "../utils/validators/SearchValidator";



export function SearchBar({ defaultSearchPhrase = '' }) {

    const { 
        searchPhrase, 
        setSearchPhrase, 
        handleChange, 
        handleSearch, 
        errorMessage,
    } = useSearchBar({defaultSearchPhrase})

    return (
        <form onSubmit={handleSearch}>

            <div className="grid grid-cols-[1fr_50px_50px] items-center pl-4 rounded-xl border border-blue-300">

                <input
                    type="text"
                    className="border-none outline-none focus-visible:outline-none bg-transparent"
                    value={searchPhrase}
                    onChange={handleChange} 
                />

                <Button>
                    <Icon icon="search" />
                </Button>

                <Button type="reset" onClick={() => setSearchPhrase('')}>
                    <Icon icon="close" />
                </Button>

            </div>

            <ValidationError message={errorMessage} />

        </form>
    );

}




function useSearchBar({defaultSearchPhrase = ''}) {

    const navigate = useNavigate();

    const [searchPhrase, setSearchPhrase] = useState<string>(defaultSearchPhrase);
    const [errorMessage, setErrorMessage] = useState<string>('');

    function handleSearch(e: SyntheticEvent) {
        e.preventDefault();

        try {
            SearchValidator.onSubmit({searchPhrase})
    
            setErrorMessage('');
            navigate(`/tag/${searchPhrase}`);

        } catch (error : any) {
            setErrorMessage(error)
        }
    }


    function handleChange(e: SyntheticEvent) {
        if (!(e.target instanceof HTMLInputElement)) return;
        setErrorMessage('');
        setSearchPhrase(e.target.value);
    }


    useEffect( () => {
        setSearchPhrase(defaultSearchPhrase)
    }, [defaultSearchPhrase])


    return { handleChange, handleSearch, searchPhrase, setSearchPhrase, errorMessage }
}