import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../style/user/Register.css";
import { API } from "../../api/api";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        uName: '',
        uEmail: '',
        uPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        if (name === "confirmPassword" || name === "uPassword") {
            setError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.uPassword !== formData.confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            // 회원가입 요청 (백엔드에서 RegisterDto로 저장)
            await API.auth.requestRegister({
                uName: formData.uName,
                uEmail: formData.uEmail,
                uPassword: formData.uPassword
            });
            
            // 임시로 데이터 저장
            localStorage.setItem('tempRegisterName', formData.uName);
            localStorage.setItem('tempRegisterPassword', formData.uPassword);
            
            // 이메일 인증 페이지로 이동
            navigate(`/email-verification?uEmail=${encodeURIComponent(formData.uEmail)}`);
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || error.response.data.message || "회원가입 요청 실패");
            } else {
                setError("회원가입 요청 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2>회원가입</h2>
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
                        <label>이메일</label>
                        <input
                            type="email"
                            name="uEmail"
                            value={formData.uEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>비밀번호</label>
                        <input
                            type="password"
                            name="uPassword"
                            value={formData.uPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>비밀번호 확인</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit">회원가입</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
