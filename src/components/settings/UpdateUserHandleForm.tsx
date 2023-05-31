import Icon from "../Icon"
import useUpdateUserHandle from "../../hooks/useUpdateUserHandle"



export default function UpdateUserHandleForm() {

    const userHandle = useUpdateUserHandle()
    
    return (
        <form onSubmit={ userHandle.handleUpdate }>

            <div className="grid grid-cols-[1ch_1fr_10px] items-center gap-4">
                <label htmlFor="user-handle" className="text-xl">@</label>
                <input
                    type="text"
                    value={ userHandle.userHandle } 
                    onChange={ userHandle.handleChange }
                    className="border-sky-200"
                    id="user-handle"
                />
                <div>
                    { userHandle.isValidated ? (
                        <Icon icon="check_circle" className="text-emerald-400" />
                    ) : (
                        <Icon icon="error_outline" className="text-rose-400" />
                    )}
                </div>
            </div>


            <div className={` ${userHandle.errorMessage ? 'grid grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-200 text-rose-500 py-2`}>
                <div className="overflow-hidden">
                    { userHandle.errorMessage }
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={ !userHandle.isValidated }
                    className={`inline-flex items-center gap-2 bg-sky-100 hover:bg-fuchsia-100 px-4 py-2 rounded-lg ${ userHandle.isValidated ? '' : 'opacity-40 cursor-not-allowed'}`}
                >
                    <Icon icon="save" /> Save
                </button>

                <button onClick={ userHandle.handleReset } className="bg-sky-50 hover:bg-fuchsia-50 bg-opacity-50 px-4 py-2 rounded-lg">
                    Reset
                </button>

                <div>
                    { userHandle.successMessage }
                </div>
            </div>

        </form>
    )
}


