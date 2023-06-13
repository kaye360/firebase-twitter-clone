import { Navigate, Outlet } from 'react-router-dom'
import { auth } from '../../../firebase-config'


export default function PrivateRoutes() {

    return (
        auth.currentUser ? <Outlet /> : <Navigate to='/unauthorized' />
    )
}