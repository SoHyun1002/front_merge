import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import "../../style/user/Login.css";
import { API } from "../../api/api";

function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        uEmail: '',
        uPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('로그인 시도:', formData.uEmail, formData.uPassword);
            const response = await API.auth.login({
                uEmail: formData.uEmail,
                uPassword: formData.uPassword
            });
            
            console.log('로그인 응답:', response.data);
            
            // 계정이 비활성화된 경우
            if (response.data.deletedAt) {
                alert('비활성화된 계정입니다. 계정을 복구하시겠습니까?');
                navigate('/restore-account', { state: { uEmail: formData.uEmail } });
                return;
            }
            
            // 로그인 성공 시에만 사용자 정보 저장
            if (response.data.status === 200) {
                const userData = {
                    uName: response.data.uName,
                    uEmail: response.data.uEmail,
                    uRole: response.data.uRole,
                    accessToken: response.data.accessToken,
                    deletedAt: null
                };
                console.log('저장할 사용자 정보:', userData);
                
                dispatch(loginSuccess(userData));
                navigate('/');
            } else {
                alert(response.data.error || "로그인에 실패했습니다.");
            }
        } catch (err) {
            if (err.response) {
                alert(err.response.data.error);
            } else {
                alert("로그인 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="login-page">
            <h2 className="logo" onClick={() => navigate("/")}>STUDYLOG</h2>
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <h3>로그인</h3>
                    <div>
                        <label htmlFor="uEmail">이메일</label>
                        <input
                            type="email"
                            id="uEmail"
                            name="uEmail"
                            value={formData.uEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="uPassword">비밀번호</label>
                        <input
                            type="password"
                            id="uPassword"
                            name="uPassword"
                            value={formData.uPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">로그인</button>
                    <div className="links">
                        <Link to="/register">회원가입</Link>
                        <Link to="/reset-password">비밀번호 찾기</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;