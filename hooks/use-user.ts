import { AsyncStorageAdapter } from "@/db";
import { useEffect, useState } from "react";

export default function useUser() {
    const [user, setUser] = useState<any>(null);

    // supabase-auth 로 인증된 사용자 정보 가져오기
    // const getAuthUser = async () => {
    //     try {
    //         const { data: { user }, error } = await supabase.auth.getUser();

    //         if(error) {
    //             console.error('사용자 정보 가져오기 실패:', error);
    //             return null;
    //         }

    //         return user;
    //     } catch (error) {
    //         console.error('사용자 정보 가져오기 실패:', error);
    //         return null
    //     }
    // }

    // 게스트 사용자 정보 가져오기
    // const getAnonymousUser = async () => {
    //     const user = await SecureStore.getItemAsync('userInfo');
    //     if(!user) {
    //         return null;
    //     }
    //     return user;
    // }

    const getUserInfoFromStorage = async () => {
        if (typeof window !== 'undefined') {
            // const userInfo = window.localStorage.getItem('userInfo');
            const userInfo = await AsyncStorageAdapter.getItem('userInfo');
            if(!userInfo) return null;
            return JSON.parse(userInfo);
        }
        return null;
    }

    useEffect(() => {
        (async () => {
            // const authUser = await getAuthUser();
            // if(!authUser) {
            //     const anonymousUser = await getAnonymousUser();
            //     setUser(anonymousUser);
            // } else setUser(authUser);

            const userInfo = await getUserInfoFromStorage();
            setUser(userInfo);
        })()
    }, []);

    return {
        user,
        getUserInfoFromStorage,
        // getAuthUser,
        // getAnonymousUser
    }
}