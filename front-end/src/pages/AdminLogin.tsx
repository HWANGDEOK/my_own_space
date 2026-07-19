import { useState } from "react";
import { adminApi } from "../apis/adminApi";

function AdminLogin() {
    const [ key, setKey ] = useState('')


    const handleAdminActivate = async () => {
        try {
            await adminApi.activateAdmin(key);
            window.location.href = '/';
            console.log("관리자모드 활성화");
            alert('관리자 모드 활성화')
        } catch {
            console.log('key 값이 올바르지 않습니다');
            alert('관리자 모드 비활성화에 실패했습니다.');
        }
    }

    return(
        <div>
            <input type="text" value={key} onChange={(e) => setKey(e.target.value)} placeholder="admin key"/>
            <button onClick={handleAdminActivate}>활성화</button>
        </div>

    )
}




export default AdminLogin;