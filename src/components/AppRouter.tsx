import { Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Explore from '../pages/Explore'
import SinglePost from '../pages/SinglePost'
import Notifications from '../pages/Notifications'
import Profile from '../pages/Profile'
import Settings from '../pages/Settings'

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="post/:id" element={<SinglePost />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div>Error</div>} />
        </Routes>
    )
}
