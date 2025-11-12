import Login from "@/components/main/Login";
import Splash from "@/components/main/Splash";
import { router, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function Index() {
  const [isSplashScreen, setIsSplashScreen] = useState(true);
  const screenHeight = Dimensions.get('window').height;

  const splashTranslateY = useSharedValue(0);
  const loginTranslateY = useSharedValue(-screenHeight);

  const customEasing = Easing.bezier(0.06, 0.68, 0.39, 1.01);

  useEffect(() => {
    setTimeout(() => {
      router.push('/(tabs)/main')
    }, 100);
  }, [])

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsSplashScreen(false);
  //   }, 1500);
  // }, []);

  useEffect(() => {
    if (!isSplashScreen) {
      // Splash를 아래로 내리고, Login을 제자리로
      splashTranslateY.value = withTiming(screenHeight, { duration: 1000, easing: customEasing });
      loginTranslateY.value = withTiming(0, { duration: 1000, easing: customEasing });
    } else {
      // Splash를 제자리로, Login을 위로
      splashTranslateY.value = withTiming(0, { duration: 1000, easing: customEasing });
      loginTranslateY.value = withTiming(-screenHeight, { duration: 1000, easing: customEasing });
    }
  }, [isSplashScreen]);

  const splashAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: splashTranslateY.value }],
    };
  });

  const loginAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: loginTranslateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.screen, splashAnimatedStyle]}>
        <Splash />
      </Animated.View>
      <Animated.View style={[styles.screen, loginAnimatedStyle]}>
        <Login />
      </Animated.View>
    </View>
  );
}

{/* <View>
<ParallaxScrollView
  headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
  headerImage={
    <Image
      source={require('@/assets/images/partial-react-logo.png')}
      style={styles.reactLogo}
    />
  }>
  <ThemedView style={styles.titleContainer}>
    <ThemedText type="title">로밍러브test</ThemedText>
    <HelloWave />
  </ThemedView>
  <ThemedView style={styles.stepContainer}>
    <View style={{ width: '100%', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => router.push('/guestLogin')}>
        <Text style={{ textDecorationLine: 'underline' }}>게스트로 시작하기</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity onPress={() => router.push('/login?provider=kakao')}>
      <Image source={require('@/assets/images/kakaoLogin.png')} style={{ width: '100%' }} />
    </TouchableOpacity>
    <GoogleSignInButton onPress={() => router.push('/login?provider=google')} />
  </ThemedView>
</ParallaxScrollView>
</View> */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  screen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    flex: 1,
    justifyContent: 'flex-end',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});