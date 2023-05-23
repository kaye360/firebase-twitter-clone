import { ErrorBoundary } from "react-error-boundary"
import { AppContext } from "../App"
import { useContext } from "react"

interface ModalProps {
    content : JSX.Element | null | undefined
}

export default function Modal({content} : ModalProps) : JSX.Element {
    
    const appContext = useContext(AppContext)

    function handleModalBgClick(e : any ) {
        if( e?.target?.id === 'modal') {
            appContext?.closeModal()
        }
    }

    if( content ) { 

        const ModalContent = () => content

        return (
            <ErrorBoundary fallback={<ModalError handleModalBgClick={handleModalBgClick} />}>
                <div 
                    id="modal"
                    onClick={ handleModalBgClick }
                    className="fixed inset-0 z-9999 grid grid-cols-1 place-items-center bg-slate-900 bg-opacity-50 animate-fade-in"
                >
                    <div className=" max-w-2xl w-full bg-slate-50 m-4 drop-shadow-lg opacity-100 p-4 pb-6 rounded-2xl animate-bounce-up-in">

                        <div className="flex justify-end">
                            <button 
                                className="text-sm leading-3 hover:underline"
                                onClick={ () => appContext?.closeModal() }
                            >
                                Close
                            </button>
                        </div>

                        <ModalContent />
                    </div>
                </div>
            </ErrorBoundary>
        )
    }

    return <></>
}



interface ModalErrorProps {
    handleModalBgClick : Function
}

function ModalError({handleModalBgClick} : ModalErrorProps) {

    const appContext = useContext(AppContext)

    return (
        <div 
            id="modal"
            onClick={ () => handleModalBgClick() }
            className="fixed inset-0 z-9999 grid grid-cols-1 place-items-center bg-slate-900 bg-opacity-50 animate-fade-in"
        >
            <div className=" max-w-2xl w-full bg-slate-50 m-4 drop-shadow-lg opacity-100 p-4 pb-6 rounded-2xl animate-bounce-up-in">

                <div className="flex justify-end">
                    <button 
                        className="text-sm leading-3 hover:underline"
                        onClick={ () => appContext?.closeModal() }
                    >
                        Close
                    </button>
                </div>

                <h2>Oops, something went wrong. Please try again.</h2>
            </div>
        </div>
    )
}