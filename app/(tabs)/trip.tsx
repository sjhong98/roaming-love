import { Image } from "expo-image";
import { Text, View, StyleSheet, Dimensions, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import { useEffect } from "react";

export default function Trip() {
    const { location } = useLocalSearchParams();
    const screenWidth = Dimensions.get('window').width;
    
    let locationData;
    try {
        locationData = location ? JSON.parse(decodeURIComponent(location as string)) : null;
    } catch (e) {
        locationData = null;
    }

    // useEffect(() => {
    //     Alert.alert('trip 으로 이동됨')
    // }, [])

    if (!locationData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>위치 정보를 찾을 수 없습니다.</Text>
            </View>
        );
    }

    return (
        <View style={{ position: 'relative', backgroundColor: '#fff', width: '100%', height: '100%' }}>
            {/* 카드 이미지 - 애니메이션 완료 상태와 동일 */}
            <View
                style={{
                    width: screenWidth,
                    height: 412,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: 24,
                    overflow: 'hidden',
                }}
            >
                <Image
                    source={locationData.image}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    contentFit="cover"
                />
                <HeartActiveIcon style={{ position: 'absolute', top: 14, right: 19, width: 25, height: 25 }} />
                <View
                    style={{
                        position: 'absolute',
                        bottom: 35,
                        left: 24,
                        width: 45,
                        height: 45,
                    }}
                >
                    <Image 
                        source={require('@/assets/images/marker.png')} 
                        style={{ width: '100%', height: '100%' }} 
                        contentFit="contain" 
                    />
                </View>
                <Text
                    style={{
                        position: 'absolute',
                        bottom: 44,
                        left: 84,
                        fontSize: 24,
                        fontWeight: 600,
                        color: '#FFF',
                    }}
                >
                    {locationData.name}
                </Text>
            </View>
        </View>
    );
}
