import { fetchCurrentUser } from "@/lib/fetchCurrentUser";
import { userState } from "@/store/atoms/user";
import { useSetRecoilState } from "recoil";
import { useEffect } from "react";

export function InitUser() {
    const setUser = useSetRecoilState(userState);

    const init = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser({
                isLoading: false,
                userEmail: null,
                isAdmin: false,
            });
            return;
        }

        try {
            const currentUser = await fetchCurrentUser(token);

            setUser({
                isLoading: false,
                userEmail: currentUser.username,
                isAdmin: currentUser.isAdmin,
            });
        } catch (e) {
            setUser({
                isLoading: false,
                userEmail: null,
                isAdmin: false,
            });
        }
    };

    useEffect(() => {
        init();
    }, []);

    return <></>;
}