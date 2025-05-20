import "../style/Header.css"
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector(state => state.auth);
    const isAdmin = user?.uRole === "ADMIN";

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className="header">
            <h1 onClick={() => navigate("/")} className="home-logo">
                STUDYLOG
            </h1>
            <nav className="nav-menu">
                <span onClick={() => navigate("/study/search")}>스터디 찾기</span>
                <span onClick={() => navigate("/study/create")}>스터디 만들기</span>
                <span onClick={() => navigate("/board")}>게시판</span>
            </nav>
            <div className="header-buttons">
                {isAdmin && (
                    <button onClick={() => navigate("/admin")}>관리자</button>
                )}
                {isLoggedIn ? (
                    <>
                        <button onClick={() => navigate("/mypage")}>마이페이지</button>
                        <button onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <button onClick={() => navigate("/login")}>로그인</button>
                )}
            </div>
        </div>
    );
}

export default Header;
