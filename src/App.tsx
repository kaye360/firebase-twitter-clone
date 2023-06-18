import { createContext } from "react"
import useModal, { UseModal, defaulModalContext } from "./hooks/useModal"
import AppRouter from "./components/Routing/AppRouter"
import Layout from "./components/Layout/Layout"
import { Provider } from "react-redux"
import {store} from "./store"




export const ModalContext = createContext<UseModal>( defaulModalContext )


export default function App() {

	const modal = useModal()

	return (
		<Provider store={store}>
			<ModalContext.Provider value={modal}>
				<Layout>
					<AppRouter />
				</Layout>
			</ModalContext.Provider>
		</Provider>
	)
}

