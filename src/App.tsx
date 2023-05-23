import Layout from "./components/Layout"
import { createContext, useEffect } from "react"
import useAppContext, { UseAppContext } from "./hooks/useAppContext"
import AppRouter from "./components/AppRouter"


export const AppContext = createContext<UseAppContext | null>(null)



export default function App() {

	useEffect( () => {
		document.title = 'Firebase/React Social Media web app'
	}, [])

	const appContext = useAppContext()

	return (
		<AppContext.Provider value={appContext}>
			<Layout>
				<AppRouter />
			</Layout>
		</AppContext.Provider>
	)
}

