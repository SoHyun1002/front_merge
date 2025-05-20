import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../style/user/Login.css";
import { API } from "../../api/api";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증코드 입력, 3: 새 비밀번호 입력
    const [uEmail, setUEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            await API.auth.sendVerificationCode(uEmail);
            setStep(2);
            alert('비밀번호 재설정 코드가 이메일로 전송되었습니다.');
        } catch (error) {
            if (error.response) {
                alert(error.response.data.error || '인증 코드 전송에 실패했습니다.');
            } else {
                alert('인증 코드 전송에 실패했습니다.');
            }
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        try {
            await API.auth.verifyCode(uEmail, verificationCode);
            setStep(3);
        } catch (error) {
            alert(error.response?.data?.message || '인증 코드가 일치하지 않습니다.');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            await API.user.resetPassword({ uEmail, verificationCode, newPassword });
            alert('비밀번호가 성공적으로 재설정되었습니다.');
            navigate('/login');
        } catch (error) {
            console.error(error);
            if (error.response) {
                alert(error.response.data.error || '비밀번호 재설정에 실패했습니다.');
            } else {
                alert('비밀번호 재설정에 실패했습니다.');
            }
        }
    };

    return (
        <div className="login-page">
            <h2 className="logo" onClick={() => navigate("/")}>STUDYLOG</h2>
            <div className="login-form">
                {step === 1 && (
                    <form onSubmit={handleSendVerificationCode}>
                        <h3>비밀번호 재설정</h3>
                        <div>
                            <label htmlFor="uEmail">이메일</label>
                            <input
                                type="email"
                                id="uEmail"
                                value={uEmail}
                                onChange={(e) => setUEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">인증 코드 전송</button>
                        <button type="button" onClick={() => navigate('/login')}>로그인으로 돌아가기</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode}>
                        <h3>인증 코드 확인</h3>
                        <div>
                            <label htmlFor="verificationCode">인증 코드</label>
                            <input
                                type="text"
                                id="verificationCode"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">인증 코드 확인</button>
                        <button type="button" onClick={() => setStep(1)}>이전으로</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <h3>새 비밀번호 설정</h3>
                        <div>
                            <label htmlFor="newPassword">새 비밀번호</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">비밀번호 확인</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">비밀번호 재설정</button>
                        <button type="button" onClick={() => setStep(2)}>이전으로</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ResetPassword; 