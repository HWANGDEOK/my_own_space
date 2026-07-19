import { useAuthStore } from "../store/authStore";
import { useAuthTimer } from "../store/useAuthTimer";

function forceLogout() {
    useAuthStore.getState().logout();
    useAuthTimer.getState().setTimeLeft(0);
    if (window.location.pathname !== '/') {
        window.location.href = '/';
    }
}

export default forceLogout;