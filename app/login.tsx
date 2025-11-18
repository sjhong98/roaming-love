import supabase, { AsyncStorageAdapter } from '@/db';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { AnyRecord } from 'react-native-reanimated/lib/typescript/css/types';

export default function LoginScreen() {
    const router = useRouter();
    const { provider } = useLocalSearchParams<{ provider: 'kakao' | 'google' }>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const signInWithOAuth = async () => {
            if (!provider) {
                Alert.alert('오류', '로그인 제공자가 지정되지 않았습니다.');
                router.back();
                return;
            }

            try {
                // Deep link URL 생성 (exp: 로 시작하는 앱으로 돌아올 수 있는 URL)
                const redirectUrl = Linking.createURL('/auth/callback');

                console.log('=== OAuth 플로우 시작 ===');
                console.log('Redirect URL:', redirectUrl);
                console.log('URL 타입:', redirectUrl.startsWith('exp://') ? 'Expo Go (개발)' : 'Custom Scheme (프로덕션)');

                // Supabase OAuth 링크 생성 -> supabase 서버 링크임
                const { data, error } = await supabase.auth.signInWithOAuth({
                    provider: provider as 'kakao' | 'google',
                    options: {
                        redirectTo: redirectUrl,
                    }
                });

                if (error) {
                    throw error;
                }

                if (!data.url) {
                    throw new Error('OAuth URL을 가져올 수 없습니다');
                }

                console.log('\n\n\nOAuth URL:', data.url);

                // OAuth 진행할 링크를 시스템 브라우저에서 열기 (google 정책상 이유)
                const result = await WebBrowser.openAuthSessionAsync(
                    data.url,
                    // 딥링크이므로, 완료 후에 앱으로 복귀하게 되며, result 반환.
                    redirectUrl
                );

                console.log('\n\n\nWebBrowser result:', result);

                // 시스템 브라우저에서 진행한 OAuth 결과 값 처리
                if (result.type === 'success') {
                    // URL에서 토큰 추출
                    const url = result.url;
                    const parsedUrl = new URL(url);
                    
                    // URL fragment에서 token 정보 추출
                    const fragment = parsedUrl.hash;
                    if (fragment) {
                        const params = new URLSearchParams(fragment.substring(1));
                        const accessToken = params.get('access_token');
                        const refreshToken = params.get('refresh_token');

                        if (accessToken && refreshToken) {
                            console.log('토큰 발견, 세션 설정 중...');
                            
                            // Supabase 세션 설정
                            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken,
                            });

                            if (sessionError) {
                                throw sessionError;
                            }

                            if (sessionData.user) {
                                console.log('로그인 성공:', sessionData.user);

                                let userInfo: AnyRecord = {
                                    name: sessionData.user.user_metadata?.name,
                                    email: sessionData.user.email,
                                    id: sessionData.user.id,
                                    platform: 'auth',
                                    introduction: ''
                                }

                                const userFromDb = await supabase
                                    .from('user')
                                    .select('*')
                                    .eq('id', userInfo.email)
                                    .single();

                                    console.log('userFromDb', userFromDb)

                                if (userFromDb && userFromDb.data) {
                                    userInfo.pk = userFromDb.data.pk;
                                } else {
                                    const { data: insertedUser, error: insertError } = await supabase
                                    .from('user')
                                    .insert({
                                        nickname: userInfo.name,
                                        // email: userInfo.email,
                                        id: userInfo.email,
                                        platform: userInfo.platform,
                                        introduction: ''
                                    })
                                    .select()
                                    .single();

                                    userInfo.pk = insertedUser.pk;
                                }
                                
                                // AsyncStorageAdapter를 사용하여 사용자 정보 저장
                                await AsyncStorageAdapter.setItem('userInfo', JSON.stringify(userInfo));

                                // main 화면으로 이동
                                router.replace('/(tabs)/main');
                            }
                        } else {
                            throw new Error('토큰을 찾을 수 없습니다');
                        }
                    }
                } else if (result.type === 'cancel') {
                    console.log('사용자가 로그인을 취소했습니다');
                    Alert.alert('로그인 취소', '로그인이 취소되었습니다');
                    // 브라우저가 이미 닫혔을 수 있으므로 try-catch로 감싸기
                    try {
                        await WebBrowser.dismissBrowser();
                    } catch (e) {
                        // 이미 닫혔을 수 있으므로 무시
                    }
                    router.back();
                }
            } catch (error: any) {
                console.error('로그인 오류:', error);
                Alert.alert('로그인 실패', error.message || '알 수 없는 오류가 발생했습니다');
                // 에러 발생 시에도 브라우저 닫기
                try {
                    await WebBrowser.dismissBrowser();
                } catch (e) {
                    // 이미 닫혔을 수 있으므로 무시
                }
                router.back();
            } finally {
                setIsLoading(false);
            }
        };

        signInWithOAuth();
    }, [provider]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>
                    {provider === 'kakao' ? '카카오' : '구글'} 브라우저 실행 중...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text>로그인 처리 중...</Text>
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
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#333',
    },
});
