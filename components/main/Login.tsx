import supabase, { AsyncStorageAdapter } from "@/db";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
    const [loginForm, setLoginForm] = useState<any>({
        email: '',
        password: '',
    });

    const [guestLogin, setGuestLogin] = useState(false);

    const handleLoginFormChange = (field: string, value: string) => {
        setLoginForm({ ...loginForm, [field]: value });
    };

    const handleLogin = async () => {
        if (!loginForm.email || !loginForm.password) {
            Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
            return;
        }

        const { data, error } = await supabase.from('user').select('*').eq('nickname', loginForm.email).eq('password', loginForm.password).single()
        if (error) {
            Alert.alert('오류', error.message || '알 수 없는 오류가 발생했습니다.')
            return;
        }

        if (!data) {
            Alert.alert('오류', '사용자를 찾을 수 없습니다.')
            return;
        }

        const userInfo = {
            name: data.nickname,
            email: data.email,
            id: data.id,
            platform: data.platform,
        }
        await AsyncStorageAdapter.setItem('userInfo', JSON.stringify(userInfo))
        router.replace('/(tabs)/main')
    }

    return (
        <View
            style={styles.container}
        >
            <Image source={require('@/assets/images/login-background.png')} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            <SafeAreaView style={styles.safeareaview}>
                <View style={styles.view}>
                    <View style={styles.child} />
                    {/* <Component1 style={styles.item} width={582} height={582} /> */}
                    {/* <Component style={styles.inner} width={934} height={934} /> */}
                    {!guestLogin ? (
                        <View style={styles.input}>
                            {/* <Component2 style={styles.inputChild} width={321} height={321} /> */}
                            <View style={[styles.text, styles.textFlexBox]}>
                                <Text style={styles.login}>Login</Text>
                                <Text style={[styles.enterYourEmail, styles.orLoginWithClr]}>{`Enter your email and password to log in `}</Text>
                            </View>
                            <View style={[styles.field, styles.orFlexBox]}>
                                <View style={[styles.inputFieldParent, styles.signUpFlexBox]}>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={[styles.inputBorder, styles.yournamegmailcom, styles.labelTextTypo]}
                                            placeholder="Enter your email"
                                            placeholderTextColor="#acb5bb"
                                            value={loginForm.email}
                                            onChangeText={(text) => handleLoginFormChange('email', text)}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                    <View style={styles.inputField}>
                                        <TextInput
                                            style={[styles.inputBorder, styles.yournamegmailcom, styles.labelTextTypo]}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#acb5bb"
                                            value={loginForm.password}
                                            onChangeText={(text) => handleLoginFormChange('password', text)}
                                            secureTextEntry
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>
                                <View style={styles.forgotPasswordWrapper}>
                                    <Text style={[styles.forgotPassword, styles.forgotPasswordTypo]}>Forgot Password ?</Text>
                                </View>
                            </View>
                            <View style={styles.buttons}>
                                <TouchableOpacity style={[styles.button, styles.buttonSpaceBlock]} onPress={handleLogin}>
                                    <Text style={[styles.labelText, styles.labelTextFlexBox]}>Log In</Text>
                                </TouchableOpacity>
                                <View style={[styles.or, styles.orFlexBox]}>
                                    <View style={styles.line} />
                                    <Text style={[styles.orLoginWith, styles.labelTextFlexBox]}>Or login with</Text>
                                    <View style={styles.line} />
                                </View>
                                <View style={styles.safeareaviewButton}>
                                    <TouchableOpacity style={[styles.anotherStepLogin, styles.anotherBorder]} onPress={() => router.push('/login?provider=google')}>
                                        <Image source={require('@/assets/images/google.png')} style={styles.googleIcon} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.anotherStepLogin, styles.anotherBorder]} onPress={() => router.push('/login?provider=kakao')}>
                                        <Image source={require('@/assets/images/kakao.png')} style={styles.googleIcon} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={[styles.signUp, styles.signUpFlexBox]}>
                                <Text style={[styles.enterYourEmail, styles.orLoginWithClr]}>Don't have an account?</Text>
                                <TouchableOpacity onPress={() => setGuestLogin(true)}>
                                    <Text style={[styles.safeareaviewSignUp, styles.forgotPasswordTypo]}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <GuestLoginBox
                            onBack={() => setGuestLogin(false)}
                        />
                    )}
                    <View style={styles.homeIndicator}>
                        <View style={styles.safeareaviewHomeIndicator} />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

interface GuestLoginBoxProps {
    onBack: () => void;
}

const GuestLoginBox = ({ onBack }: GuestLoginBoxProps) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [guestLoginForm, setGuestLoginForm] = useState<any>({
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        birthDate: '',
    });

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
            handleGuestLoginFormChange('birthDate', formatDate(date));
        }
    };

    const handleGuestLoginFormChange = (field: string, value: string) => {
        setGuestLoginForm({ ...guestLoginForm, [field]: value });
    }

    const handleGuestSignUp = async () => {
        if (!guestLoginForm.lastName || !guestLoginForm.firstName || !guestLoginForm.email || !guestLoginForm.birthDate || !guestLoginForm.password) {
            Alert.alert('입력 오류', '모든 필드를 입력해주세요.');
            return;
        }

        const fullName = `${guestLoginForm.lastName}${guestLoginForm.firstName}`;
        const { data, error } = await supabase.from('user').insert({
            nickname: fullName,
            platform: 'guest',
            password: guestLoginForm.password,
            id: '',
        }).select().single()

        if (error) {
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
        router.replace('/(tabs)/main')
    }

    return (
        <View style={guestLoginStyles.view}>
            {/* <Component style={styles.child} width={321} height={321} /> */}
            <View style={guestLoginStyles.text}>
                <Text style={guestLoginStyles.signUp}>Sign Up</Text>
                <Text style={guestLoginStyles.createAnAccount}>{`Create an account to continue! `}</Text>
            </View>
            <View style={[guestLoginStyles.field, guestLoginStyles.fieldFlexBox]}>
                <View style={[guestLoginStyles.inputField, guestLoginStyles.inputBorder]}>
                    <TextInput
                        style={[guestLoginStyles.yournamegmailcom, guestLoginStyles.labelTextTypo]}
                        placeholder="성"
                        placeholderTextColor="#acb5bb"
                        value={guestLoginForm.lastName}
                        onChangeText={(text) => handleGuestLoginFormChange('lastName', text)}
                    />
                </View>
                <View style={[guestLoginStyles.inputField, guestLoginStyles.inputBorder]}>
                    <TextInput
                        style={[guestLoginStyles.yournamegmailcom, guestLoginStyles.labelTextTypo]}
                        placeholder="이름"
                        placeholderTextColor="#acb5bb"
                        value={guestLoginForm.firstName}
                        onChangeText={(text) => handleGuestLoginFormChange('firstName', text)}
                    />
                </View>
                <View style={[guestLoginStyles.inputField, guestLoginStyles.inputBorder]}>
                    <TextInput
                        style={[guestLoginStyles.yournamegmailcom, guestLoginStyles.labelTextTypo]}
                        placeholder="이메일"
                        placeholderTextColor="#acb5bb"
                        value={guestLoginForm.email}
                        onChangeText={(text) => handleGuestLoginFormChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>
                <View style={guestLoginStyles.inputField}>
                    <TouchableOpacity
                        style={[guestLoginStyles.inputBorder]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <TextInput
                            style={[guestLoginStyles.yournamegmailcom, guestLoginStyles.labelTextTypo]}
                            placeholder="생년월일 (YYYY.MM.DD)"
                            placeholderTextColor="#acb5bb"
                            value={guestLoginForm.birthDate}
                            editable={false}
                            pointerEvents="none"
                        />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={selectedDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                            locale="ko-KR"
                        />
                    )}
                    {Platform.OS === 'ios' && showDatePicker && (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                            <TouchableOpacity
                                onPress={(event: any) => {
                                    setShowDatePicker(false);
                                    handleDateChange(event, selectedDate);
                                }}
                                style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}
                            >
                                <Text>확인</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
                <View style={[guestLoginStyles.inputField, guestLoginStyles.inputBorder]}>
                    <TextInput
                        style={[guestLoginStyles.yournamegmailcom, guestLoginStyles.labelTextTypo]}
                        placeholder="비밀번호"
                        placeholderTextColor="#acb5bb"
                        value={guestLoginForm.password}
                        onChangeText={(text) => handleGuestLoginFormChange('password', text)}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </View>
            </View>
            <TouchableOpacity
                style={[guestLoginStyles.button, guestLoginStyles.buttonFlexBox]}
                onPress={handleGuestSignUp}
            >
                <Text style={[guestLoginStyles.labelText, guestLoginStyles.labelTextTypo]}>Register</Text>
            </TouchableOpacity>
            <View style={[guestLoginStyles.inputSignUp, guestLoginStyles.buttonFlexBox]}>
                <Text style={guestLoginStyles.createAnAccount}>Already have an account?</Text>
                <TouchableOpacity onPress={onBack}>
                    <Text style={guestLoginStyles.login}>Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height,
        width: '100%',
        position: 'relative',
    },
    safeareaview: {
        flex: 1
    },
    textFlexBox: {
        justifyContent: "center",
        alignItems: "center"
    },
    orLoginWithClr: {
        color: "#6c7278",
        fontSize: 12
    },
    orFlexBox: {
        gap: 16,
        alignSelf: "stretch"
    },
    signUpFlexBox: {
        gap: 6,
        alignSelf: "stretch"
    },
    labelTextTypo: {
        lineHeight: 20,
        fontSize: 14,
        fontFamily: "Inter-Medium",
        fontWeight: "500"
    },
    inputBorder: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderColor: "#edf1f3",
        backgroundColor: "#fff",
        borderRadius: 10,
        elevation: 2,
        boxShadow: "0px 1px 2px rgba(228, 229, 231, 0.24)",
        minHeight: 46,
        alignSelf: "stretch",
        borderWidth: 1,
        borderStyle: "solid",
        overflow: "hidden"
    },
    forgotPasswordTypo: {
        fontFamily: "Inter-SemiBold",
        fontWeight: "600",
        lineHeight: 17,
        letterSpacing: -0.1,
        fontSize: 12
    },
    buttonSpaceBlock: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        flexDirection: "row"
    },
    labelTextFlexBox: {
        textAlign: "center",
        letterSpacing: -0.1
    },
    anotherBorder: {
        borderColor: "#eff0f6",
        height: 48,
        backgroundColor: "#fff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "solid",
        overflow: "hidden",
        flex: 1
    },
    view: {
        width: "100%",
        overflow: "hidden",
        height: 874,
        flex: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
    },
    child: {
        top: 0,
        left: -153,
        backgroundColor: "#d9d9d9",
        width: 90,
        position: "absolute",
        height: 874
    },
    item: {
        top: -163,
        left: -229,
        width: 582,
        height: 582,
        color: "#f9d055",
        position: "absolute"
    },
    inner: {
        top: 419,
        right: -559,
        width: 934,
        height: 934,
        color: "#f09ab3",
        position: "absolute"
    },
    input: {
        marginTop: -282,
        marginLeft: 0,
        top: "50%",
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        width: '100%',
        padding: 24,
        gap: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
        borderStyle: "solid",

        position: "absolute",
        overflow: "hidden"
    },
    inputChild: {
        width: 321,
        height: 321,
        top: -170,
        left: 192,
        zIndex: 0,
        color: "#fff",
        position: "absolute"
    },
    text: {
        gap: 12,
        zIndex: 1,
        alignSelf: "stretch"
    },
    login: {
        fontSize: 32,
        letterSpacing: -0.6,
        lineHeight: 42,
        fontWeight: "700",
        fontFamily: "Inter-Bold",
        color: "#111827",
        textAlign: "left"
    },
    enterYourEmail: {
        fontFamily: "Inter-Medium",
        fontWeight: "500",
        lineHeight: 17,
        color: "#6c7278",
        letterSpacing: -0.1,
        fontSize: 12,
        textAlign: "left"
    },
    field: {
        zIndex: 2,
        alignItems: "flex-end"
    },
    inputFieldParent: {
        alignItems: "flex-end"
    },
    inputField: {
        alignSelf: "stretch"
    },
    yournamegmailcomWrapper: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1
    },
    yournamegmailcom: {
        color: "#1a1c1e",
        letterSpacing: -0.1,
        fontSize: 14,
        textAlign: "left",
        padding: 0,
        margin: 0
    },
    safeareaviewInputArea: {
        gap: 10
    },
    eyeOffIcon: {
        height: 16,
        width: 16,
        color: "#acb5bb"
    },
    forgotPasswordWrapper: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignSelf: "stretch",
        alignItems: "center"
    },
    forgotPassword: {
        color: "rgba(128, 128, 128, 0.55)",
        textAlign: "right"
    },
    buttons: {
        zIndex: 3,
        alignSelf: "stretch",
        gap: 24
    },
    button: {
        boxShadow: "0px 1px 2px rgba(37, 62, 167, 0.48)",
        backgroundColor: "#FD3B60",
        borderColor: "rgba(255, 255, 255, 0.12)",
        height: 48,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 10,
        elevation: 2,
        justifyContent: "center",
        alignSelf: "stretch",
        alignItems: "center",
        borderWidth: 1,
        borderStyle: "solid",
        overflow: "hidden"
    },
    labelText: {
        lineHeight: 20,
        fontSize: 14,
        fontFamily: "Inter-Medium",
        fontWeight: "500",
        textAlign: "center",
        color: "#fff"
    },
    or: {
        flexDirection: "row",
        alignItems: "center"
    },
    line: {
        height: 1,
        borderTopWidth: 1,
        borderColor: "#fff",
        borderStyle: "solid",
        flex: 1
    },
    orLoginWith: {
        lineHeight: 18,
        fontFamily: "Inter-Regular",
        color: "#6c7278",
        fontSize: 12,
        textAlign: "center"
    },
    safeareaviewButton: {
        gap: 15,
        flexDirection: "row",
        alignSelf: "stretch"
    },
    anotherStepLogin: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        flexDirection: "row"
    },
    googleIcon: {
        height: 18,
        width: 18
    },
    signUp: {
        zIndex: 4,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    safeareaviewSignUp: {
        color: "#fd355b",
        textAlign: "left"
    },
    homeIndicator: {
        top: 840,
        left: 2,
        width: 400,
        height: 34,
        position: "absolute"
    },
    safeareaviewHomeIndicator: {
        marginLeft: 72,
        bottom: 8,
        borderRadius: 100,
        backgroundColor: "rgba(128, 128, 128, 0.55)",
        width: 144,
        height: 5,
        transform: [
            {
                rotate: "180deg"
            }
        ],
        left: "50%",
        position: "absolute"
    }
});


const guestLoginStyles = StyleSheet.create({
    input: {
        backgroundColor: "rgba(255, 255, 255, 0.6)",
    },
    fieldFlexBox: {
        gap: 6,
        alignSelf: "stretch"
    },
    buttonFlexBox: {
        flexDirection: "row",
        alignItems: "center"
    },
    labelTextTypo: {
        lineHeight: 20,
        fontSize: 14,
        fontFamily: "Inter-Medium",
        fontWeight: "500",
        letterSpacing: -0.1
    },
    inputBorder: {
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderColor: "#edf1f3",
        backgroundColor: "#fff",
        boxShadow: "0px 1px 2px rgba(228, 229, 231, 0.24)",
        minHeight: 46,
        flexDirection: "row",
        borderRadius: 10,
        elevation: 2,
        alignSelf: "stretch",
        zIndex: 0,
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderStyle: "solid"
    },
    view: {
        top: 80,
        width: "100%",
        borderColor: "#fff",
        padding: 24,
        gap: 24,
        alignItems: "center",
        overflow: "hidden",
        borderWidth: 1,
        borderStyle: "solid",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        borderRadius: 12,
    },
    child: {
        width: 321,
        height: 321,
        position: "absolute",
        top: -170,
        left: 192,
        zIndex: 0,
        color: "#fff"
    },
    text: {
        gap: 12,
        zIndex: 1,
        justifyContent: "center",
        alignSelf: "stretch",
        alignItems: "center"
    },
    signUp: {
        fontSize: 32,
        letterSpacing: -0.6,
        lineHeight: 42,
        fontWeight: "700",
        fontFamily: "Inter-Bold",
        color: "#111827",
        textAlign: "left"
    },
    createAnAccount: {
        color: "#6c7278",
        fontFamily: "Inter-Medium",
        fontWeight: "500",
        lineHeight: 17,
        letterSpacing: -0.1,
        fontSize: 12,
        textAlign: "left"
    },
    field: {
        zIndex: 2
    },
    inputField: {
        alignSelf: "stretch"
    },
    yournamegmailcomWrapper: {
        flex: 1,
        flexDirection: "row"
    },
    yournamegmailcom: {
        flex: 1,
        color: "#1a1c1e",
        textAlign: "left"
    },
    inputArea3: {
        gap: 10
    },
    calendarDueIcon: {
        height: 16,
        width: 16,
        color: "#acb5bb"
    },
    button: {
        height: 48,
        boxShadow: "0px 1px 2px rgba(37, 62, 167, 0.48)",
        backgroundColor: "#FF3E62",
        borderColor: "rgba(255, 255, 255, 0.12)",
        paddingHorizontal: 24,
        paddingVertical: 10,
        zIndex: 3,
        borderRadius: 10,
        elevation: 2,
        flexDirection: "row",
        justifyContent: "center",
        alignSelf: "stretch",
        overflow: "hidden",
        borderWidth: 1,
        borderStyle: "solid"
    },
    labelText: {
        textAlign: "center",
        color: "#fff",
        fontSize: 14
    },
    inputSignUp: {
        zIndex: 4,
        gap: 6,
        alignSelf: "stretch",
        justifyContent: "center"
    },
    login: {
        fontWeight: "600",
        fontFamily: "Inter-SemiBold",
        color: "#4d81e7",
        lineHeight: 17,
        letterSpacing: -0.1,
        fontSize: 12,
        textAlign: "left"
    }
});