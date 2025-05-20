import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API } from "../../api/api";
import { updateUserInfo } from '../../store/authSlice';
// import "../../style/user/MyInfoSection.css";

const MyInfoSection = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const [userInfo, setUserInfo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newUName, setNewUName] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await API.user.getUserInfo();
                setUserInfo(response.data);
                setNewUName(response.data.uName);
            } catch (error) {
                alert('프로필 정보를 불러오는데 실패했습니다.');
            }
        };

        if (user) {
            fetchUserInfo();
        }
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setNewUName(userInfo.uName);
    };

    const handleSave = async () => {
        try {
            await API.user.updateName({ uName: newUName });
            
            const refreshResponse = await API.auth.refresh();
            if (refreshResponse.data.accessToken) {
                localStorage.setItem('accessToken', refreshResponse.data.accessToken);
            }

            dispatch(updateUserInfo({
                uName: newUName,
                uEmail: userInfo.uEmail,
            }));
            setUserInfo(prev => ({ ...prev, uName: newUName }));
            setIsEditing(false);
            alert('이름이 성공적으로 변경되었습니다.');
        } catch (error) {
            alert('이름 변경에 실패했습니다.');
        }
    };

    if (!userInfo) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="my-info-section">
            <h3>내 정보</h3>
            <div className="info-content">
                <div className="info-item">
                    <label>이름:</label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={newUName}
                            onChange={(e) => setNewUName(e.target.value)}
                        />
                    ) : (
                        <span>{userInfo.uName}</span>
                    )}
                </div>
                <div className="info-item">
                    <label>이메일:</label>
                    <span>{userInfo.uEmail}</span>
                </div>
                {isEditing ? (
                    <div className="button-group">
                        <button onClick={handleSave}>저장</button>
                        <button onClick={handleCancel}>취소</button>
                    </div>
                ) : (
                    <button onClick={handleEdit}>수정</button>
                )}
            </div>
        </div>
    );
};

export default MyInfoSection; 