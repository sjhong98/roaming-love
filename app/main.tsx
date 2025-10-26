import useUser from "@/hooks/use-user";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Main() {
    const router = useRouter();
    const { user } = useUser();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('\n\n\nuser', user)
        if(user) setLoading(false)
    }, [user])

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    
    if (!user) {
        return (
            <View style={styles.container}>
                <Text>로그인이 필요합니다.</Text>
            </View>
        );
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{`${user.name}님 환영합니다!`}</Text>
            <Text style={styles.info}>이메일: {user.email}</Text>
            <Text style={styles.info}>ID: {user.id}</Text>
            {user.user_metadata && (
                <Text style={styles.info}>메타데이터: {JSON.stringify(user.user_metadata, null, 2)}</Text>
            )}
            <TouchableOpacity onPress={() => router.push('/test1')}><Text style={{ textDecorationLine: 'underline' }}>테스트1</Text></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    },
});