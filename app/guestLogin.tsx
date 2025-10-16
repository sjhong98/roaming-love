import supabase from "@/db";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GuestLogin() {
    const router = useRouter();
    
    const [guestLoginForm, setGuestLoginForm] = useState<any>({
        name: ''
    });

    const handleChangeGuestLoginForm = (name: string, value: string) => {
        setGuestLoginForm({ ...guestLoginForm, [name]: value });
    }

    const handleGuestLogin = async () => {
        const { data, error } = await supabase.from('user').insert({
            nickname: guestLoginForm.name,
            platform: 'guest',
            id: '',
        }).select().single()

        if(error) Alert.alert('오류', error.message || '알 수 없는 오류가 발생했습니다.')

        console.log('\n\n\n생성된 데이타', data, error)

        const userInfo = {
            name: data.nickname,
            email: '',
            id: data.id,
            platform: 'guest',
        }
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
        router.replace('/main')
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 50, paddingVertical: 100, justifyContent: 'space-between' }}>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>이름을 입력해 주세요.</Text>
                    <TextInput
                        style={{ borderWidth: 1, borderColor: '#333', padding: 10, marginTop: 10 }}
                        placeholder="이름을 입력해 주세요."
                        value={guestLoginForm.name}
                        onChangeText={(text) => handleChangeGuestLoginForm('name', text)}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={{ backgroundColor: '#333', padding: 10, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                        onPress={handleGuestLogin}
                    >
                        <Text style={{ color: 'white' }}>게스트로 시작하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}