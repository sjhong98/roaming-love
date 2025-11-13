import SettingIcon from '@/assets/images/settingIcon.svg';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RadioInactiveIcon from '@/assets/images/radioInactive.svg';
import RadioActiveIcon from '@/assets/images/radioActive.svg';

export default function TypeSelect({ tripType, loveType, setTripType, setLoveType }: { tripType: string | undefined, loveType: string | undefined, setTripType: (tripType: string) => void, setLoveType: (loveType: string) => void }) {
    const [tripTypeSelectOpen, setTripTypeSelectOpen] = useState(false);
    const [loveTypeSelectOpen, setLoveTypeSelectOpen] = useState(false);

    const handleChangeTripType = (tripType: string) => {
        setTripType(tripType);
        setTripTypeSelectOpen(false);
    }

    const handleChangeLoveType = (loveType: string) => {
        setLoveType(loveType);
        setLoveTypeSelectOpen(false);
    }

    return (
        <View style={filterStyles.view}>
            {
                !tripTypeSelectOpen ? (
                    <TouchableOpacity onPress={() => setTripTypeSelectOpen(true)} activeOpacity={1} style={[filterStyles.view2, filterStyles.viewPosition]}>
                        <View style={[filterStyles.view3, { width: '100%', height: '100%' }]} />
                        <Text style={[filterStyles.text, filterStyles.textTypo]}>{tripType ? tripType : '선택해주세요'}</Text>
                        <Text style={[filterStyles.safeareaviewText, filterStyles.textTypo]}>여행 타입</Text>
                        <SettingIcon style={filterStyles.adjustmentsoutlineIcon} width={16} height={16} />
                    </TouchableOpacity>
                ) : (
                    <View style={tripTypeDetail.view}>
                        <Text style={[tripTypeDetail.text, tripTypeDetail.textTypo]}>선택해주세요</Text>
                        <Text style={[tripTypeDetail.safeareaviewText, tripTypeDetail.textTypo]}>여행 타입</Text>
                        <SettingIcon style={filterStyles.adjustmentsoutlineIcon} width={16} height={16} />
                        <View style={tripTypeDetail.parent}>
                            <TouchableOpacity style={[tripTypeDetail.text2, tripTypeDetail.textTypo]} onPress={() => handleChangeTripType('모험 유랑가')}>
                                <Text>모험 유랑가</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[tripTypeDetail.text3, tripTypeDetail.textTypo]} onPress={() => handleChangeTripType('여행 만학도')}>
                                <Text>여행 만학도</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[tripTypeDetail.text4, tripTypeDetail.textTypo]} onPress={() => handleChangeTripType('늘보 베짱이')}>
                                <Text>늘보 베짱이</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[tripTypeDetail.text5, tripTypeDetail.textTypo]} onPress={() => handleChangeTripType('핫플레이더')}>
                                <Text>핫플레이더</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[tripTypeDetail.text6, tripTypeDetail.textTypo]} onPress={() => handleChangeTripType('가성비로거')}>
                                <Text>가성비로거</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={tripTypeDetail.view3}>
                            {
                                tripType === '모험 유랑가' ? (
                                    <RadioActiveIcon style={tripTypeDetail.radioButtonCheckedIcon} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeTripType('모험 유랑가')}>
                                        <RadioInactiveIcon style={tripTypeDetail.radioButtonCheckedIcon} />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                tripType === '여행 만학도' ? (
                                    <RadioActiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon, tripTypeDetail.radioIconLayout]} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeTripType('여행 만학도')}>
                                        <RadioInactiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon, tripTypeDetail.radioIconLayout]} />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                tripType === '늘보 베짱이' ? (
                                    <RadioActiveIcon style={[tripTypeDetail.safeareaviewRadioButtonUncheckedIcon, tripTypeDetail.radioIconLayout]} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeTripType('늘보 베짱이')}>
                                        <RadioInactiveIcon style={[tripTypeDetail.safeareaviewRadioButtonUncheckedIcon, tripTypeDetail.radioIconLayout]} />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                tripType === '핫플레이더' ? (
                                    <RadioActiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon2, tripTypeDetail.radioIconLayout]} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeTripType('핫플레이더')}>
                                        <RadioInactiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon2, tripTypeDetail.radioIconLayout]} />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                tripType === '가성비로거' ? (
                                    <RadioActiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon3, tripTypeDetail.radioIconLayout]} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeTripType('가성비로거')}>
                                        <RadioInactiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon3, tripTypeDetail.radioIconLayout]} />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        {/* <Component7 style={[tripTypeDetail.child, tripTypeDetail.childLayout]} /> */}
                    </View>
                )
            }
            {
                !loveTypeSelectOpen ? (
                    <TouchableOpacity onPress={() => setLoveTypeSelectOpen(true)} activeOpacity={1} style={[filterStyles.view4, filterStyles.viewPosition]}>
                        <View style={[filterStyles.view3, { width: '100%', height: '100%' }]} />
                        <Text style={[filterStyles.text, filterStyles.textTypo]}>{loveType ? loveType : '선택해주세요'}</Text>
                        <Text style={[filterStyles.safeareaviewText, filterStyles.textTypo]}>연애 타입</Text>
                        <SettingIcon style={filterStyles.adjustmentsoutlineIcon} width={16} height={16} />
                    </TouchableOpacity>
                ) : (
                    <View style={tripTypeDetail.view}>
                        {/* <View style={tripTypeDetail.view2} /> */}
                        <Text style={[tripTypeDetail.text, tripTypeDetail.textTypo]}>선택해주세요</Text>
                        <Text style={[tripTypeDetail.safeareaviewText, tripTypeDetail.textTypo]}>여행 타입</Text>
                        <SettingIcon style={filterStyles.adjustmentsoutlineIcon} width={16} height={16} />
                        <View style={tripTypeDetail.parent}>
                            <TouchableOpacity style={[tripTypeDetail.text2, tripTypeDetail.textTypo]} onPress={() => handleChangeLoveType('안정적인 동반자')}>
                                <Text>안정적인 동반자</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[tripTypeDetail.text3, tripTypeDetail.textTypo]} onPress={() => handleChangeLoveType('열정적인 몰입형')}>
                                <Text>열정적인 몰입형</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[tripTypeDetail.text4, tripTypeDetail.textTypo]} onPress={() => handleChangeLoveType('자유로운 유희형')}>
                                <Text>자유로운 유희형</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[tripTypeDetail.text5, tripTypeDetail.textTypo]} onPress={() => handleChangeLoveType('공감중심 밀착형')}>
                                <Text>공감중심 밀착형</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[tripTypeDetail.text6, tripTypeDetail.textTypo]} onPress={() => handleChangeLoveType('독립 보장형')}>
                                <Text>독립 보장형</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={tripTypeDetail.view3}>
                            {
                                loveType === '안정적인 동반자' ? (
                                    <RadioActiveIcon style={tripTypeDetail.radioButtonCheckedIcon} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeLoveType('안정적인 동반자')}>
                                        <RadioInactiveIcon style={tripTypeDetail.radioButtonCheckedIcon} />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                loveType === '열정적인 몰입형' ? (
                                    <RadioActiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon, tripTypeDetail.radioIconLayout]} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeLoveType('열정적인 몰입형')}>
                                        <RadioInactiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon, tripTypeDetail.radioIconLayout]} />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                loveType === '자유로운 유희형' ? (
                                    <RadioActiveIcon style={[tripTypeDetail.safeareaviewRadioButtonUncheckedIcon, tripTypeDetail.radioIconLayout]} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeLoveType('자유로운 유희형')}>
                                        <RadioInactiveIcon style={[tripTypeDetail.safeareaviewRadioButtonUncheckedIcon, tripTypeDetail.radioIconLayout]} />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                loveType === '공감중심 밀착형' ? (
                                    <RadioActiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon2, tripTypeDetail.radioIconLayout]} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeLoveType('공감중심 밀착형')}>
                                        <RadioInactiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon2, tripTypeDetail.radioIconLayout]} />
                                    </TouchableOpacity>
                                )
                            }
                            {
                                loveType === '독립 보장형' ? (
                                    <RadioActiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon3, tripTypeDetail.radioIconLayout]} />
                                ) : (
                                    <TouchableOpacity onPress={() => handleChangeLoveType('독립 보장형')}>
                                        <RadioInactiveIcon style={[tripTypeDetail.radioButtonUncheckedIcon3, tripTypeDetail.radioIconLayout]} />
                                    </TouchableOpacity>
                                )
                            }
                        </View>
                        {/* <Component7 style={[tripTypeDetail.child, tripTypeDetail.childLayout]} /> */}
                    </View>
                )
            }

        </View>
    )
}

const tripTypeDetail = StyleSheet.create({
    safeareaview: {
        flex: 1
    },
    textTypo: {
        textAlign: "left",
        color: "#000",
        fontFamily: "NanumSquare Neo OTF",
        position: "absolute"
    },
    childLayout: {
        maxHeight: "100%",
        overflow: "hidden",
        maxWidth: "100%",
        position: "absolute"
    },
    radioIconLayout: {
        color: "#1d1b20",
        height: 20,
        overflow: "hidden",
        maxWidth: "100%",
        left: "0%",
        right: "0%",
        position: "absolute",
        width: "100%"
    },
    view: {
        height: 238,
        width: 167,
        boxShadow: "0px 4px 7.4px rgba(0, 0, 0, 0.25)",
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    text: {
        width: "70.29%",
        top: "10.92%",
        fontSize: 14,
        color: "#000",
        fontFamily: "NanumSquare Neo OTF",
        left: "6.86%"
    },
    safeareaviewText: {
        width: "24.29%",
        top: "4.2%",
        left: "7.1%",
        fontSize: 10
    },
    adjustmentsoutlineIcon: {
        height: "10.08%",
        width: "14.23%",
        top: "5.46%",
        right: "6.34%",
        bottom: "84.45%",
        left: "79.43%"
    },
    parent: {
        height: "61.76%",
        width: "70%",
        top: "25.63%",
        right: "53.14%",
        bottom: "12.61%",
        left: "6.86%",
        position: "absolute"
    },
    text2: {
        fontSize: 14,
        color: "#000",
        fontFamily: "NanumSquare Neo OTF",
        left: "0%",
        top: "0%"
    },
    text3: {
        top: "22.45%",
        fontSize: 14,
        color: "#000",
        fontFamily: "NanumSquare Neo OTF",
        left: "0%"
    },
    text4: {
        top: "44.9%",
        fontSize: 14,
        color: "#000",
        fontFamily: "NanumSquare Neo OTF",
        left: "0%"
    },
    text5: {
        top: "67.35%",
        fontSize: 14,
        color: "#000",
        fontFamily: "NanumSquare Neo OTF",
        left: "0%"
    },
    text6: {
        top: "89.8%",
        fontSize: 14,
        color: "#000",
        fontFamily: "NanumSquare Neo OTF",
        left: "0%"
    },
    view3: {
        width: "11.43%",
        top: 57,
        right: "10.29%",
        left: "78.29%",
        height: 152,
        position: "absolute"
    },
    radioButtonCheckedIcon: {
        top: 0,
        color: "#ff2d55",
        height: 20,
        overflow: "hidden",
        maxWidth: "100%",
        left: "0%",
        right: "0%",
        position: "absolute",
        width: "100%"
    },
    radioButtonUncheckedIcon: {
        top: 33
    },
    safeareaviewRadioButtonUncheckedIcon: {
        top: 66
    },
    radioButtonUncheckedIcon2: {
        top: 99
    },
    radioButtonUncheckedIcon3: {
        top: 132
    },
    child: {
        height: "0.42%",
        width: "87.43%",
        top: "21.43%",
        right: "6.29%",
        bottom: "78.15%",
        left: "6.29%",
        color: "#d9d9d9"
    }
});

const filterStyles = StyleSheet.create({
    viewPosition: {
        width: '46.5%',
        // left: "50%",
        // top: 0,
        // position: "absolute",
        height: 52,
        position: 'relative'
    },
    textTypo: {
        textAlign: "left",
        fontFamily: "NanumSquare Neo OTF",
        left: 12,
        position: "absolute"
    },
    view: {
        width: "100%",
        marginTop: 17,
        position: 'relative',
        flexDirection: 'row',
        gap: 20,
        paddingHorizontal: 22,
    },
    view2: {
        position: 'relative',
        height: 52
    },
    view3: {
        // marginLeft: -87.5,
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)",
        elevation: 7.4,
        borderRadius: 10,
        backgroundColor: "#fff"
    },
    text: {
        top: 26,
        fontSize: 14,
        color: "#000"
    },
    safeareaviewText: {
        top: 10,
        fontSize: 10,
        color: "#999",
        width: 43
    },
    adjustmentsoutlineIcon: {
        top: 19,
        left: 135,
        width: 25,
        height: 24,
        position: "absolute"
    },
    view4: {
        position: 'relative',
        height: 52
    }
});