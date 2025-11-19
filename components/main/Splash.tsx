import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, StyleSheet, View } from "react-native";
import { CustomText as Text } from '@/components/CustomText';
import RoamingLoveIcon from '@/assets/images/roamingLove.svg';

export default function Splash() {
    return (
        <View
            style={splashScreenStyles.safeareaview}
        >
            <Image source={require('@/assets/images/splash-background.png')} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
            <View style={splashScreenStyles.child} />
            <Image source={require('@/assets/images/icon.png')} style={splashScreenStyles.icon} />
            <RoamingLoveIcon style={splashScreenStyles.roamingLove} />
        </View>
    )
}

const splashScreenStyles = StyleSheet.create({
    safeareaview: {
        flex: Dimensions.get('window').height,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    child: {
        top: 0,
        left: -153,
        backgroundColor: "#d9d9d9",
        width: 90,
        position: "absolute",
        height: 874
    },
    roamingLove: {
        fontSize: 35,
        fontWeight: 900,
        color: "#e60047",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 185,
        height: 40,
        marginTop: 20
    },
    icon: {
        width: 129,
        height: 110,
    }
});