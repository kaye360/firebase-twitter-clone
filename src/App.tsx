import { createContext } from "react"
import useAppContext, { UseAppContext } from "./hooks/useAppContext"
import AppRouter from "./components/Routing/AppRouter"
import Layout from "./components/Layout/Layout"


export const AppContext = createContext<UseAppContext | null>(null)



export default function App() {

	const appContext = useAppContext()

	return (
		<AppContext.Provider value={appContext}>
			<Layout>
				<AppRouter />
			</Layout>
		</AppContext.Provider>
	)
}

