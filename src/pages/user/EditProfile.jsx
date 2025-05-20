import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserInfo } from '../../store/authSlice';
import "../../style/user/MyPage.css";
import { API } from "../../api/api";

const EditProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const [formData, setFormData] = useState({
        uName: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                uName: user.uName
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const updateData = {
                uName: formData.uName
            };

            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            await API.user.updateName(updateData);
            
            // 토큰 갱신
            const refreshResponse = await API.auth.refresh();
            if (refreshResponse.data.accessToken) {
                localStorage.setItem('accessToken', refreshResponse.data.accessToken);
            }

            dispatch(updateUserInfo({
                uName: formData.uName,
                uEmail: user.uEmail,
                uRole: user.uRole
            }));
            alert('프로필이 성공적으로 업데이트되었습니다.');
            navigate('/mypage');
        } catch (error) {
            alert('사용자 정보 업데이트에 실패했습니다.');
        }
    };

    if (!user) {
        return (
            <div className="edit-profile-container">
                <p>로그인이 필요합니다.</p>
                <button onClick={() => navigate('/login')}>로그인</button>
            </div>
        );
    }

    return (
        <div className="edit-profile-container">
            <h2>프로필 수정</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>이름</label>
                    <input
                        type="text"
                        name="uName"
                        value={formData.uName}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>현재 비밀번호</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>새 비밀번호</label>
                    <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>새 비밀번호 확인</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <div className="button-group">
                    <button type="submit">저장</button>
                    <button type="button" onClick={() => navigate('/mypage')}>취소</button>
                </div>
            </form>
        </div>
    );
};

export default EditProfile; 