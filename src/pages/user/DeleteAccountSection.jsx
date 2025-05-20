import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { API } from '../../api/api';
import '../../style/user/DeleteAccountSection.css';

function DeleteAccountSection() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [password, setPassword] = useState('');
    const user = useSelector(state => state.auth.user);

    const handleDelete = async (e) => {
        e.preventDefault();
        
        if (!window.confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
            return;
        }

        try {
            // 비밀번호 확인
            const checkResponse = await API.user.checkPassword({ rawPassword: password });
            
            if (checkResponse.data.verified) {
                // 계정 비활성화 요청
                await API.user.deactivateAccount({ uEmail: user.uEmail });
                
                dispatch(logout());
                alert('계정이 성공적으로 삭제되었습니다.');
                navigate('/');
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error || '회원 탈퇴에 실패했습니다.');
            } else {
                alert('비밀번호가 일치하지 않습니다.');
            }
        }
    };

    return (
        <div className="delete-account-section">
            <h3>회원 탈퇴</h3>
            <p>계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.</p>
            <form onSubmit={handleDelete}>
                <div className="form-group">
                    <label>비밀번호 확인</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="delete-button">계정 삭제</button>
            </form>
        </div>
    );
}

export default DeleteAccountSection;