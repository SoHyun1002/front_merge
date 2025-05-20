import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API } from '../../api/api';
// import '../../style/user/EmailVerification.css';

const EmailVerification = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // URL에서 이메일 파라미터 가져오기
        const params = new URLSearchParams(location.search);
        const emailParam = params.get('uEmail');
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. 이메일 인증 코드 확인
            await API.auth.verifyCode(email, verificationCode);
            
            // 2. 회원가입 완료 요청 (모든 필요한 정보 전달)
            await API.auth.requestRegisterComplete({
                uName: localStorage.getItem('tempRegisterName'),
                uEmail: email,
                uPassword: localStorage.getItem('tempRegisterPassword'),
                code: verificationCode
            });

            // 임시 저장 데이터 삭제
            localStorage.removeItem('tempRegisterName');
            localStorage.removeItem('tempRegisterPassword');

            alert('이메일 인증이 완료되었습니다. 로그인해주세요.');
            navigate('/login');
        } catch (error) {
            console.error('이메일 인증 실패:', error);
            setError(error.response?.data?.message || '이메일 인증에 실패했습니다.');
        }
    };

    const handleResendCode = async () => {
        if (isResending) return;
        
        setIsResending(true);
        setError('');

        try {
            await API.auth.sendVerificationCode(email);
            alert('인증 코드가 재전송되었습니다.');
        } catch (error) {
            console.error('인증 코드 재전송 실패:', error);
            setError(error.response?.data?.message || '인증 코드 재전송에 실패했습니다.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">이메일 인증</h2>
                            <p className="text-center mb-4">
                                {email}로 전송된 인증 코드를 입력해주세요.
                            </p>
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="verificationCode" className="form-label">
                                        인증 코드
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="verificationCode"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary">
                                        인증하기
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleResendCode}
                                        disabled={isResending}
                                    >
                                        {isResending ? '전송 중...' : '인증 코드 재전송'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification; 