import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AppContext } from '../App'


export default function PrivateRoutes() {

    const appContext = useContext(AppContext)

    return (
        appContext?.firebaseAuth ? <Outlet /> : <Navigate to='/unauthorized' />
    )
}