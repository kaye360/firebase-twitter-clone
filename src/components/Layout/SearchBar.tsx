import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Icon from "./Icon";
import Button from "./Button";
import ValidatedForm from "../ValidatedForm/components/ValidatedForm";
import ValidatorRules from "../ValidatedForm/utils/ValidatorRules";
import ValidatedField from "../ValidatedForm/components/ValidatedField";
import SubmitErrorMessage from "../ValidatedForm/components/SubmitErrorMessage";



export function SearchBar({ defaultSearchPhrase = '' }) {

    const [searchPhrase, setSearchPhrase] = useState<string>(defaultSearchPhrase);

    const { handleSearch } = useSearchBar({defaultSearchPhrase, searchPhrase, setSearchPhrase})

    return (
        <ValidatedForm 
            handleSubmit={handleSearch}
            config={{successMessage : ''}}
            rules={{}}
        >

            <h2 className="mt-4 mb-2">Search Tags</h2>

            <div className="grid grid-cols-[1fr_50px_50px] items-center pl-4 rounded-xl border border-blue-300">

                <ValidatedField 
                    type={"search"} 
                    title={"Search"} 
                    value={searchPhrase} 
                    setValue={setSearchPhrase} 
                    showError={false}
                    className="border-0 hover:outline-none focus-visible:outline-none"
                    rules={{
                        required : true,
                        allowableChars : {
                            regex : ValidatorRules.regexHashTag,
                            chars : 'letters, numbers, and hyphens (-)'
                        }
                    }} 
                />

                <Button type="submit">
                    <Icon icon="search" />
                </Button>

                <Button type="reset" onClick={() => setSearchPhrase('')}>
                    <Icon icon="close" />
                </Button>

            </div>

            <SubmitErrorMessage />

        </ValidatedForm>
    );

}



interface UseSearchBarProps {
    defaultSearchPhrase : string,
    searchPhrase        : string,
    setSearchPhrase     : Dispatch<SetStateAction<string>>
}

function useSearchBar({defaultSearchPhrase = '', searchPhrase, setSearchPhrase} : UseSearchBarProps) {

    const navigate = useNavigate();


    function handleSearch() {
            navigate(`/tag/${searchPhrase}`);
    }


    useEffect( () => {
        setSearchPhrase(defaultSearchPhrase)
    }, [defaultSearchPhrase])


    return { handleSearch }
}