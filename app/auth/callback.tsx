import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // openAuthSessionAsync는 자동으로 브라우저를 닫으므로
                // 여기서 dismissBrowser()를 호출할 필요가 없습니다
                
                // URL에서 현재 세션 확인
                // const { data: { session }, error } = await supabase.auth.getSession();
                
                // if (error) {
                //     console.error('세션 가져오기 실패:', error);
                //     throw error;
                // }

                // if (session) {
                //     console.log('로그인 성공:', session.user);
                //     // main 화면으로 이동
                //     router.replace('/main');
                // } else {
                //     console.log('세션이 없습니다');
                //     router.replace('/(tabs)');
                // }
            } catch (error: any) {
                console.error('콜백 처리 오류:', error);
                // router.replace('/(tabs)');
            }
        };

        handleCallback();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.text}>로그인 처리 중...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        marginTop: 16,
        fontSize: 16,
        color: '#333',
    },
});

