import { ErrorBoundary } from "react-error-boundary"
import { ModalContext } from "../App"
import { SyntheticEvent, useContext, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Icon from "../components/Layout/Icon"

interface ModalProps {
    content : JSX.Element | null | undefined
}

export default function Modal({content} : ModalProps) : JSX.Element {
    

    const modal = useContext(ModalContext)


    function handleModalBgClick(e : SyntheticEvent ) {
        if( e.target instanceof HTMLDivElement && e.target.id === 'modal' ) {
            modal.close()
        }
    }


    function handleModalEsc(e : KeyboardEvent ) {
        if( e.key === 'Escape' ) {
            modal.close()
        }
    }

    
    let ModalContent = () : JSX.Element => content ? content : <></>


    useEffect(() => {
        document.addEventListener("keydown", (e) => handleModalEsc(e), false);
    
        return () => {
            document.removeEventListener("keydown", (e) => handleModalEsc(e), false);
        };
      }, []);

      
    return (
        <ErrorBoundary fallback={<ModalError handleModalBgClick={handleModalBgClick} />}>
            <AnimatePresence>
                { content && 
                    <motion.div 
                        initial={{ opacity : 0 }}
                        animate={{ opacity : 1 }}
                        transition={{ duration : 0.5 }}
                        exit={{ opacity : 0}}
                        id="modal"
                        onMouseDown={ handleModalBgClick }
                        className="fixed inset-0 z-[9999] grid grid-cols-1 place-items-center bg-slate-900 bg-opacity-50"
                    >
                        <motion.div 
                            initial={{ opacity : 0, scale : 0, rotate : '12.5deg' }} 
                            animate={{ opacity : 1, scale : 1, rotate :  '0deg' }}
                            exit={{ opacity : 0, scale : 0, rotate : '12.5deg'}}
                            transition={{ duration : 0.3 }}
                            className="relative z-[9999] max-w-[95vw] md:max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-gradient-to-r from-blue-50 via-fuchsia-50 to-blue-100 m-4 drop-shadow-lg opacity-100 p-4 pb-6 rounded-2xl aanimate-bounce-up-in"
                        >
                            <div className="flex justify-end">
                                <button 
                                    className="text-sm leading-3 hover:underline"
                                    onClick={ () => modal.close() }
                                >
                                    <Icon icon="close" />
                                </button>
                            </div>

                            <ModalContent />
                        </motion.div>
                    </motion.div>
                }
            </AnimatePresence>
        </ErrorBoundary>
    )
}





interface ModalErrorProps {
    handleModalBgClick : Function
}

function ModalError({handleModalBgClick} : ModalErrorProps) {

    const modal = useContext(ModalContext)

    return (
        <div
            id="modal"
            onClick={ () => handleModalBgClick() }
            className="fixed inset-0 z-9999 grid grid-cols-1 place-items-center bg-slate-900 bg-opacity-50 animate-fade-in"
        >
            <div
                className="max-w-2xl w-full bg-slate-50 m-4 drop-shadow-lg opacity-100 p-4 pb-6 rounded-2xl"
            >

                <div className="flex justify-end">
                    <button 
                        className="text-sm leading-3 hover:underline"
                        onClick={ () => modal.close() }
                    >
                        Close
                    </button>
                </div>

                <h2>Oops, something went wrong. Please try again.</h2>
            </div>
        </div>
    )
}