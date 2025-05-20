import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "../../style/user/MyPage.css";
import "../../style/user/modal.css";
import "../../style/user/deleteAccount.css";
import MyInfoSection from './MyInfoSection';
import DeleteAccountSection from './DeleteAccountSection';
import MyPostsSection from '../board/MyPostsSection';

const MyPage = () => {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
    const [selectedMenu, setSelectedMenu] = useState('info');

    if (!user) {
        return (
            <div className="mypage-container">
                <p>로그인이 필요합니다.</p>
                <button onClick={() => navigate('/login')}>로그인</button>
            </div>
        );
    }

    return (
        <div className="mypage-wrapper">
            <nav className="sidebar">
                <h2>마이페이지</h2>
                <ul>
                    <li className={selectedMenu === 'info' ? 'active' : ''} onClick={() => setSelectedMenu('info')}>내 정보</li>
                    <li className={selectedMenu === 'post' ? 'active' : ''} onClick={() => setSelectedMenu('post')}>내 게시글</li>
                    <li className={selectedMenu === 'delete' ? 'active' : ''} onClick={() => setSelectedMenu('delete')}>회원 탈퇴</li>
                </ul>
            </nav>
            <main className="main-content">
                {selectedMenu === 'info' && <MyInfoSection />}
                {selectedMenu === 'post' && <MyPostsSection uEmail={user.uEmail} />}
                {selectedMenu === 'delete' && <DeleteAccountSection />}
            </main>
        </div>
    );
};

export default MyPage;
