import supabase, { AsyncStorageAdapter } from "@/db";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function GuestLogin() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    const [guestLoginForm, setGuestLoginForm] = useState<any>({
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        birthDate: '',
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    useEffect(() => {
        if (params.form) {
            try {
                const formData = typeof params.form === 'string' ? JSON.parse(params.form) : params.form;
                setGuestLoginForm(formData);
                if (formData.birthDate) {
                    const dateParts = formData.birthDate.split('.');
                    if (dateParts.length === 3) {
                        setSelectedDate(new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2])));
                    }
                }
            } catch (e) {
                console.error('Failed to parse form data:', e);
            }
        }
    }, [params.form]);

    const handleChangeGuestLoginForm = (name: string, value: string) => {
        setGuestLoginForm({ ...guestLoginForm, [name]: value });
    }

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    const handleDateChange = (event: any, date?: Date) => {
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
        if (date) {
            setSelectedDate(date);
            handleChangeGuestLoginForm('birthDate', formatDate(date));
        }
    };

    const handleGuestLogin = async () => {
        if (!guestLoginForm.lastName || !guestLoginForm.firstName || !guestLoginForm.email || !guestLoginForm.birthDate || !guestLoginForm.password) {
            Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
            return;
        }

        const fullName = `${guestLoginForm.lastName}${guestLoginForm.firstName}`;
        const { data, error } = await supabase.from('user').insert({
            nickname: fullName,
            platform: 'guest',
            id: '',
        }).select().single()

        if(error) {
            Alert.alert('오류', error.message || '알 수 없는 오류가 발생했습니다.')
            return;
        }

        console.log('\n\n\n생성된 데이타', data, error)

        const userInfo = {
            name: fullName,
            email: guestLoginForm.email,
            id: data.id,
            platform: 'guest',
        }
        await AsyncStorageAdapter.setItem('userInfo', JSON.stringify(userInfo))
        router.replace('/main')
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1, paddingHorizontal: 50, paddingVertical: 100, justifyContent: 'space-between' }}>
                <View style={{ gap: 20 }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>회원가입</Text>
                    
                    <View>
                        <Text style={{ fontSize: 14, marginBottom: 5 }}>성</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#333', padding: 10, borderRadius: 5 }}
                            placeholder="성"
                            value={guestLoginForm.lastName}
                            onChangeText={(text) => handleChangeGuestLoginForm('lastName', text)}
                        />
                    </View>

                    <View>
                        <Text style={{ fontSize: 14, marginBottom: 5 }}>이름</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#333', padding: 10, borderRadius: 5 }}
                            placeholder="이름"
                            value={guestLoginForm.firstName}
                            onChangeText={(text) => handleChangeGuestLoginForm('firstName', text)}
                        />
                    </View>

                    <View>
                        <Text style={{ fontSize: 14, marginBottom: 5 }}>이메일</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#333', padding: 10, borderRadius: 5 }}
                            placeholder="이메일"
                            value={guestLoginForm.email}
                            onChangeText={(text) => handleChangeGuestLoginForm('email', text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <Text style={{ fontSize: 14, marginBottom: 5 }}>생년월일</Text>
                        <TouchableOpacity 
                            style={{ borderWidth: 1, borderColor: '#333', padding: 10, borderRadius: 5 }}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <TextInput
                                style={{ color: '#000' }}
                                placeholder="생년월일 (YYYY.MM.DD)"
                                value={guestLoginForm.birthDate}
                                editable={false}
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <>
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleDateChange}
                                    maximumDate={new Date()}
                                    locale="ko-KR"
                                />
                                {Platform.OS === 'ios' && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                                        <TouchableOpacity 
                                            onPress={() => setShowDatePicker(false)}
                                            style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}
                                        >
                                            <Text>확인</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </View>

                    <View>
                        <Text style={{ fontSize: 14, marginBottom: 5 }}>비밀번호</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#333', padding: 10, borderRadius: 5 }}
                            placeholder="비밀번호"
                            value={guestLoginForm.password}
                            onChangeText={(text) => handleChangeGuestLoginForm('password', text)}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View>
                    <TouchableOpacity
                        style={{ backgroundColor: '#333', padding: 15, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}
                        onPress={handleGuestLogin}
                    >
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>게스트로 시작하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}