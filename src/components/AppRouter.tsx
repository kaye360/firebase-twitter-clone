import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Explore from '../pages/Explore'
import SinglePost from '../pages/SinglePost'
import Notifications from '../pages/Notifications'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'
import PrivateRoutes from './PrivateRoutes'
import Unauthorized from '../pages/Unauthorized'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/"             element={<Home />} />
            <Route path="post/:id"      element={<SinglePost />} />
            <Route path="/explore"      element={<Explore />} />
            <Route path="/profile/:id"  element={<Profile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*"             element={<div>Error</div>} />

            <Route element={<PrivateRoutes />} >
                <Route path="/profile"       element={<Profile />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings"      element={<Settings />} />
            </Route>
        </Routes>
    )
}
