import LiquidGlassButton from "@/components/LiquidGlassButton";
import { useEffect, useState } from "react";
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProgressBar = ({ progress, totalSteps }: { progress: number, totalSteps: number }) => {
	const [animatedWidth] = useState(new Animated.Value(0));
	const progressPercentage = (progress / totalSteps) * 100;

	useEffect(() => {
		Animated.timing(animatedWidth, {
			toValue: progressPercentage,
			duration: 300, // 300ms 애니메이션
			useNativeDriver: false, // width는 native driver 사용 불가
		}).start();
	}, [progress, animatedWidth]);

	return (
		<View style={{ width: '100%', paddingHorizontal: 35, position: 'relative', paddingVertical: 22 }}>
			<View style={[progressBarStyle.view, progressBarStyle.viewBg]}>
				<Animated.View
					style={[
						progressBarStyle.filled,
						{
							width: animatedWidth.interpolate({
								inputRange: [0, 100],
								outputRange: ['0%', '100%'],
								extrapolate: 'clamp',
							})
						}
					]}
				/>
			</View>
			<Text style={progressBarStyle.text}>{progress}/{totalSteps}</Text>
		</View>
	)
}

const Test1_1_Screen = () => {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34 }}>
			<Image style={[test1_1_style.icon,]} resizeMode="cover" source={require('@/assets/images/test1_1.png')} />
			<Text style={[test1_1_style.text, { paddingVertical: 20 }]}>
				{`여행을 떠난다면\n당신은 어떤 타입인가요?`}
			</Text>
		</View>
	)
}

const Test1_2_Screen = () => {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, gap: 30 }}>
			<Text style={test1_2_style.text}>
				{`[1]\n드디어 휴가 시즌!\n여행을 계획한다`}
			</Text>
			<Image style={[test1_2_style.icon]} resizeMode="cover" source={require('@/assets/images/test1_2.png')} />
		</View>
	)
}


const Test1_3_Screen = ({selected, onChange}: {selected: number, onChange: (newSelected: number) => void}) => {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, gap: 116, marginTop: -200 }}>
			<Text style={test1_3_style.text}>
				{`✈️\n항공편은 어떻게 할까?`}
			</Text>
			<View style={test1_3_style.view}>
				<TouchableOpacity style={[test1_3_style.rectangleGroup]} onPress={() => onChange(1)}>
					<View style={[test1_3_style.groupChild, { backgroundColor: selected === 1 ? '#FF2D55' : '#efeff0' }]}>
						<Text style={[test1_3_style.textTypo, {color: selected === 1 ? '#fff' : '#999'}]}>저렴하지만 선호하지 않는 시간대</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={[test1_3_style.rectangleGroup]} onPress={() => onChange(2)}>
					<View style={[test1_3_style.groupChild, { backgroundColor: selected === 2 ? '#FF2D55' : '#efeff0' }]}>
						<Text style={[test1_3_style.textTypo, {color: selected === 2 ? '#fff' : '#999'}]}>비싸지만 선호하는 시간대</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const Test1_4_Screen = ({selected, onChange}: {selected: number, onChange: (newSelected: number) => void}) => {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, gap: 116, marginTop: -200 }}>
			<Text style={test1_3_style.text}>
				{`🌨️\n출발 전 일기예보를 보니\n여행기간 폭설이 예측된다`}
			</Text>
			<View style={test1_3_style.view}>
				<TouchableOpacity style={[test1_3_style.rectangleGroup]} onPress={() => onChange(1)}>
					<View style={[test1_3_style.groupChild, { backgroundColor: selected === 1 ? '#FF2D55' : '#efeff0' }]}>
						<Text style={[test1_3_style.textTypo, {color: selected === 1 ? '#fff' : '#999'}]}>예약 다 했는데 당연히 떠나야지</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={[test1_3_style.rectangleGroup]} onPress={() => onChange(2)}>
					<View style={[test1_3_style.groupChild, { backgroundColor: selected === 2 ? '#FF2D55' : '#efeff0' }]}>
						<Text style={[test1_3_style.textTypo, {color: selected === 2 ? '#fff' : '#999'}]}>공항/숙소 고립 위험… 취소/연기하자</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const Test1_5_Screen = ({selected, onChange}: {selected: number, onChange: (newSelected: number) => void}) => {
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 34, gap: 116, marginTop: -200 }}>
			<Text style={test1_3_style.text}>
				{`🏠\n숙소를 예약할 때\n나는`}
			</Text>
			<View style={test1_3_style.view}>
				<TouchableOpacity style={[test1_3_style.rectangleGroup]} onPress={() => onChange(1)}>
					<View style={[test1_3_style.groupChild, { backgroundColor: selected === 1 ? '#FF2D55' : '#efeff0' }]}>
						<Text style={[test1_3_style.textTypo, {color: selected === 1 ? '#fff' : '#999'}]}>저렴하지만 선호하지 않는 시간대</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={[test1_3_style.rectangleGroup]} onPress={() => onChange(2)}>
					<View style={[test1_3_style.groupChild, { backgroundColor: selected === 2 ? '#FF2D55' : '#efeff0' }]}>
						<Text style={[test1_3_style.textTypo, {color: selected === 2 ? '#fff' : '#999'}]}>비싸지만 선호하는 시간대</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const Component = () => {
	const [step, setStep] = useState(1);
	const [selectedForm, setSelectedForm] = useState<any>({
		form1: null,
		form2: null,
		form3: null,
	});

	const handleSelectForm = (form: string, value: number) => {
		setSelectedForm({ ...selectedForm, [form]: value });
	}
	return (
		<SafeAreaView style={styles.safeareaview}>
			{step > 1 && <ProgressBar progress={step - 1} totalSteps={5} />}
			<View style={styles.view}>
				{
					step === 1 ? <Test1_1_Screen /> :
						step === 2 ? <Test1_2_Screen /> :
							step === 3 ? <Test1_3_Screen selected={selectedForm.form1} onChange={(newSelected: number) => handleSelectForm('form1', newSelected)} /> :
								step === 4 ? <Test1_4_Screen selected={selectedForm.form2} onChange={(newSelected: number) => handleSelectForm('form2', newSelected)} /> :
									<Test1_5_Screen selected={selectedForm.form3} onChange={(newSelected: number) => handleSelectForm('form3', newSelected)} />
				}
				<View style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: 0 }}>
					<LiquidGlassButton
						text={step === 1 ? "시작하기" : "다음"}
						backgroundColor="#FF5878"
						onPress={() => setStep(prev => prev + 1)}
					/>
				</View>
			</View>
		</SafeAreaView>);
};

const progressBarStyle = StyleSheet.create({
	track: {
		// flex: 1,
		backgroundColor: "rgba(120, 120, 128, 0.16)"
	},
	viewBg: {
		backgroundColor: "rgba(120, 120, 128, 0.16)",
		// flex: 1
	},
	view: {
		width: "100%",
		height: 4
	},
	filled: {
		position: "absolute",
		marginTop: -2,
		top: "50%",
		left: 0,
		borderRadius: 100,
		backgroundColor: "#FF2D55",
		height: 4,
		width: 0 // 초기값은 0, 애니메이션으로 조절됨
	},
	text: {
		width: 30,
		height: 17,
		fontSize: 14,
		fontWeight: "700",
		fontFamily: "Pretendard",
		color: "#b3b3b3",
		textAlign: "center",
		position: 'absolute',
		bottom: 0,
		right: 34
	}
})

const test1_1_style = StyleSheet.create({
	text: {
		// marginLeft: -160,
		// top: '50%',
		fontSize: 30,
		fontWeight: "700",
		fontFamily: "Pretendard",
		textAlign: "left",
		display: "flex",
		width: 320,
		minHeight: 111,
		alignItems: "center",
		color: "#000",
	},
	icon: {
		marginLeft: 'auto',
		width: 154,
		height: 114
	},
})

const test1_2_style = StyleSheet.create({
	text: {
		width: '100%',
		height: 'auto',
		fontSize: 30,
		fontWeight: "700",
		fontFamily: "Pretendard",
		color: "#000",
		textAlign: "left"
	},
	icon: {
		width: 319,
		height: 381,
		overflow: "hidden",
	},
})

const test1_3_style = StyleSheet.create({
	groupPosition: {
	},
	textTypo: {
		color: "#999",
		fontFamily: "Pretendard",
		fontWeight: "700",
		fontSize: 17,
	},
	view: {
		width: "100%",
		gap: 17
	},
	rectangleParent: {
		width: "100%"
	},
	groupChild: {
		height: 59,
		borderRadius: 30,
		backgroundColor: "#efeff0",
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		width: '100%',
		fontSize: 30,
		fontWeight: "700",
		fontFamily: "Pretendard",
		color: "#000",
	},
	rectangleGroup: {
	},
})

const styles = StyleSheet.create({
	safeareaview: {
		backgroundColor: "#fff",
		flex: 1
	},
	iconPosition: {
		left: "50%",
		position: "absolute"
	},
	iconLayout: {
		height: 12,
		color: "#000"
	},
	view: {
		width: "100%",
		overflow: "hidden",
		height: 'auto',
		backgroundColor: "#fff",
		flex: 1
	},
	safeareaviewHomeIndicator: {
		marginLeft: 72,
		bottom: 8,
		backgroundColor: "rgba(128, 128, 128, 0.55)",
		width: 144,
		height: 5,
		transform: [
			{
				rotate: "180deg"
			}
		],
		borderRadius: 100
	},
	statusBarIphone: {
		marginLeft: -201,
		width: 402,
		height: 50,
		paddingTop: 21,
		top: 0,
		backgroundColor: "#fff"
	},
	frame: {
		alignSelf: "stretch",
		justifyContent: "space-between",
		gap: 0,
		flexDirection: "row",
		alignItems: "center"
	},
	time: {
		paddingLeft: 16,
		paddingRight: 6,
		flexDirection: "row",
		flex: 1
	},
	safeareaviewTime: {
		lineHeight: 22,
		fontWeight: "600",
		color: "#000"
	},
	dynamicIslandSpacer: {
		height: 10,
		width: 124
	},
	levels: {
		paddingLeft: 6,
		paddingRight: 16,
		gap: 7,
		flexDirection: "row",
		flex: 1
	},
	cellularConnectionIcon: {
		width: 19
	},
	wifiIcon: {
		width: 17
	},
	battery: {
		height: 13,
		width: 27
	},
	border: {
		height: "100%",
		marginLeft: -13.65,
		top: "0%",
		bottom: "0%",
		borderRadius: 4,
		borderStyle: "solid",
		borderColor: "#000",
		borderWidth: 1,
		width: 25,
		opacity: 0.35
	},
	capIcon: {
		height: "31.54%",
		marginLeft: 12.35,
		top: "36.78%",
		bottom: "31.68%",
		maxHeight: "100%",
		width: 1,
		color: "#000"
	},
	capacity: {
		height: "69.23%",
		marginLeft: -11.65,
		top: "15.38%",
		bottom: "15.38%",
		borderRadius: 3,
		backgroundColor: "#000",
		width: 21
	}
});

export default Component;
