import './App.css'
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './store/authSlice';
import Home from './pages/Home';
import Login from './pages/user/Login';
import Header from './layout/Header';
import Footer from './layout/Footer';
import BoardPage from './pages/board/BoardPage';
import Register from './pages/user/Register';
import ScrollTop from './components/ScrollTop';
import PostDetail from './pages/board/PostDetail';
import BoardManagement from './pages/board/BoardManagement';
import PostCreate from './pages/board/PostCreate';
import SchedulePage from './pages/SchedulePage';
import PostEdit from './pages/board/PostEdit';
import MyPage from './pages/user/MyPage';
import EmailVerification from "./pages/user/EmailVerification";
import ResetPassword from './pages/user/ResetPassword';
import EditProfile from './pages/user/EditProfile';
import OpenAIPage from './pages/OpenAIPage';
import StudySearch from './pages/group/StudySearch';
import StudyCreate from './pages/group/StudyCreate';
import StudyDetail from './pages/group/StudyDetail';
import RestoreAccount from './pages/user/RestoreAccount';
import AdminPage from './pages/admin/AdminPage';
import GroupMember from "./pages/group/GroupMember.jsx";

function App() {
    const location = useLocation();
    const dispatch = useDispatch();
    const hideLayoutRoutes = ["/login", "/register", "/reset-password", "/restore-account", "/email-verification"];
    const hideLayout = hideLayoutRoutes.includes(location.pathname);

    useEffect(() => {
        // localStorage에서 저장된 상태 확인
        const savedUserState = localStorage.getItem('userState');
        const savedToken = localStorage.getItem('accessToken');

        if (savedUserState && savedToken) {
            const userState = JSON.parse(savedUserState);
            console.log('저장된 사용자 상태:', userState);
            
            if (userState.isLoggedIn && userState.user) {
                // Redux 상태 복원
                dispatch(loginSuccess({
                    uName: userState.user.uName,
                    uEmail: userState.user.uEmail,
                    uRole: userState.user.uRole,
                    accessToken: savedToken,
                    deletedAt: userState.user.deletedAt
                }));
            }
        }
    }, [dispatch]);

    return (
        <div>
            <ScrollTop />
            {!hideLayout && <Header />}
            <div className="wrap">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/board" element={<BoardPage />} />
                    <Route path="/posts/:id" element={<PostDetail />} />
                    <Route path="/posts/create" element={<PostCreate />} />
                    <Route path="/post/edit/:postId" element={<PostEdit />} />
                    <Route path="/boards/manage" element={<BoardManagement />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/email-verification" element={<EmailVerification />} />
                    <Route path="/mypage/edit" element={<EditProfile />} />
                    <Route path="/openai-test" element={<OpenAIPage />} />
                    <Route path="/study/search" element={<StudySearch />} />
                    <Route path="/study/create" element={<StudyCreate />} />
                    <Route path="/group/:id" element={<GroupMember/>} />
                    <Route path="/study/:id" element={<StudyDetail />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/restore-account" element={<RestoreAccount />} />
                </Routes>
            </div>
            {!hideLayout && <Footer />}
        </div>
    )
}

export default App
