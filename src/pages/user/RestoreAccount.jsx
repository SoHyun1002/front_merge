import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../style/user/RestoreAccount.css';
import { API } from "../../api/api";

const RestoreAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [uEmail] = useState(location.state?.uEmail || '');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState(1); // 1: 이메일 입력, 2: 인증 코드 입력

    const handleSendVerificationCode = async (e) => {
        e.preventDefault();
        try {
            await API.auth.sendVerificationCode(uEmail);
            setStep(2);
        } catch (error) {
            console.error('메일 인증 에러:', error);
            alert(error.response?.data?.message || '인증 코드 전송에 실패했습니다.');
        }
    };

    const handleVerifyAndRestore = async (e) => {
        e.preventDefault();
        try {
            const verifyResponse = await API.auth.verifyCode(uEmail, verificationCode);

            if (verifyResponse.status === 200) {
                // 계정 복구
                const restoreResponse = await API.user.restoreAccount(uEmail);
                console.log(restoreResponse);

                if (restoreResponse.status === 200) {
                    alert(restoreResponse.data.message);
                    navigate('/mypage');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                alert(error.response.data.error || error.response.data.message || '계정 복구에 실패했습니다.');
            } else {
                alert('서버와의 통신 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="restore-account-page">
            <div className="restore-form">
                <h3>계정 복구</h3>
                {step === 1 ? (
                    <form onSubmit={handleSendVerificationCode}>
                        <p>계정 복구를 위해 이메일 인증이 필요합니다.</p>
                        <div className="form-group">
                            <label>이메일</label>
                            <input
                                type="email"
                                value={uEmail}
                                readOnly
                            />
                        </div>
                        <button type="submit">인증 코드 전송</button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyAndRestore}>
                        <p>이메일로 전송된 인증 코드를 입력해주세요.</p>
                        <div className="form-group">
                            <label>인증 코드</label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">계정 복구하기</button>
                        <button type="button" onClick={() => setStep(1)} className="back-button">
                            이전으로
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default RestoreAccount;