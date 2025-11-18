import { Dimensions, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChangeEachOtherIcon from '@/assets/images/changeEachOther.svg';
import CalendarIcon from '@/assets/images/calendarRed.svg';
import { useState } from "react";
import { Image, ImageSource } from "expo-image";
import LocationCard from "@/components/ui/LocationCard";
import SearchRedIcon from '@/assets/images/searchRed.svg';

export default function LocationSelect({ setLocationSelectOpen, location, setLocation }: { setLocationSelectOpen: (open: boolean) => void, location: string | undefined, setLocation: (location: string) => void }) {
    const [selectedContinental, setSelectedContinental] = useState<string | null>(null);
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const continentalList = [
        {
            title: '전체',
            image: require('@/assets/images/location/hawaii.png'),
        },
        {
            title: '미주',
            image: require('@/assets/images/location/newyork.png'),
        },
        {
            title: '유럽',
            image: require('@/assets/images/location/paris.png'),
        },
        {
            title: '오세아니아',
            image: require('@/assets/images/location/sydney.png'),
        },
        {
            title: '아시아',
            image: require('@/assets/images/location/tokyo.png'),
        },
        {
            title: '동남아시아',
            image: require('@/assets/images/location/singapore.png'),
        },
    ]

    const popularLocationRows = [
        ['도쿄', '오사카', '다낭'],
        ['런던', '후쿠오카', '시드니'],
    ];

    const eastAsiaLocationRows = [
        ['오사카', '도쿄', '후쿠오카'],
        ['교토', '삿포로', '오키나와'],
    ];

    const southEastAsiaLocationRows = [
        ['방콕', '치앙마이', '하노이'],
        ['호이안', '냐짱', '세부'],
    ];

    const europeAmericaLocationRows = [
        ['런던', '로스엔젤레스', '토론토'],
        ['뉴욕', '라스베이거스', '벤쿠버'],
    ];

    const australiaLocationRows = [
        ['시드니', '멜버른', '오클랜드'],
        ['골드코스트', '브리즈번', '뉴질랜드'],
    ];

    const totalLocationList = [
        ...eastAsiaLocationRows.flat(),
        ...southEastAsiaLocationRows.flat(),
        ...europeAmericaLocationRows.flat(),
        ...australiaLocationRows.flat(),
    ];

    const handleSelectLocation = (label: string) => {
        setLocation(label)
        setSearchKeyword(label)
        setLocationSelectOpen(false)
    }

    return (
        <TouchableOpacity activeOpacity={1} style={[locationSelectStyles.overlayTouchable, { zIndex: 1000 }]}>
            <View style={locationSelectStyles.overlayCard}>
                <Text style={locationSelectStyles.overlayTitle}>여행지를 알려주세요</Text>
                <View style={locationSelectStyles.searchSection}>
                    <View style={locationSelectStyles.searchBar}>
                        <SearchRedIcon style={locationSelectStyles.searchIcon} />
                        <TextInput
                            value={searchKeyword}
                            onChangeText={(text) => setSearchKeyword(text)}
                            style={locationSelectStyles.searchInput}
                            placeholder="여행지 검색"
                            placeholderTextColor="#141414"
                        />
                    </View>
                </View>

                {searchKeyword ? (
                    <>
                        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                            {totalLocationList.filter((label) => label.includes(searchKeyword)).map((label) => (
                                <TouchableOpacity key={label} style={[locationSelectStyles.chip, location !== label ? { borderWidth: 1, borderColor: "#bebebe" } : { borderWidth: 2, borderColor: '#FF2D55' }]} onPress={() => handleSelectLocation(label)}>
                                    <Text style={locationSelectStyles.chipText}>{label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={locationSelectStyles.recommendationRow} contentContainerStyle={locationSelectStyles.recommendationCardContainer}>
                            {continentalList.map((continental, index) => (
                                <TouchableOpacity key={index} activeOpacity={1} style={[locationSelectStyles.recommendationCard, { overflow: 'hidden' }]} onPress={() => {
                                    if (continental.title === '전체') {
                                        setSelectedContinental(null)
                                    } else {
                                        setSelectedContinental(continental.title)
                                    }
                                }}>
                                    <Image source={continental.image} style={{ width: 90, height: 90, zIndex: 1 }} />
                                    <Text style={{ zIndex: 999, position: 'absolute', top: '40%', left: 0, right: 0, bottom: 0, textAlign: 'center', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 900, fontSize: 20 }}>{continental.title}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        {!selectedContinental &&
                            <>
                                <View style={locationSelectStyles.divider} />
                                <Text style={locationSelectStyles.sectionLabel}>인기 여행지</Text>
                                <View style={locationSelectStyles.chipGrid}>
                                    {popularLocationRows.map((row, rowIndex) => (
                                        <View
                                            key={rowIndex}
                                            style={[
                                                locationSelectStyles.chipRow,
                                                rowIndex !== popularLocationRows.length - 1 && locationSelectStyles.chipRowSpacing,
                                            ]}
                                        >
                                            {row.map((label) => (
                                                <TouchableOpacity key={label} style={[locationSelectStyles.chip, location !== label ? { borderWidth: 1, borderColor: "#bebebe" } : { borderWidth: 2, borderColor: '#FF2D55' }]} onPress={() => handleSelectLocation(label)}>
                                                    <Text style={locationSelectStyles.chipText}>{label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </>
                        }

                        {
                            (!selectedContinental || selectedContinental === '동아시아') &&
                            <>
                                <View style={locationSelectStyles.divider} />
                                <Text style={locationSelectStyles.sectionLabel}>동아시아의 인기 여행지</Text>
                                <View style={locationSelectStyles.chipGrid}>
                                    {eastAsiaLocationRows.map((row, rowIndex) => (
                                        <View
                                            key={rowIndex}
                                            style={[
                                                locationSelectStyles.chipRow,
                                                rowIndex !== eastAsiaLocationRows.length - 1 && locationSelectStyles.chipRowSpacing,
                                            ]}
                                        >
                                            {row.map((label) => (
                                                <TouchableOpacity key={label} style={[locationSelectStyles.chip, location !== label ? { borderWidth: 1, borderColor: "#bebebe" } : { borderWidth: 2, borderColor: '#FF2D55' }]} onPress={() => setLocation(label)}>
                                                    <Text style={locationSelectStyles.chipText}>{label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </>
                        }

                        {
                            (!selectedContinental || selectedContinental === '동남아시아') &&
                            <>
                                <View style={locationSelectStyles.divider} />
                                <Text style={locationSelectStyles.sectionLabel}>동남아시아의 인기 여행지</Text>
                                <View style={locationSelectStyles.chipGrid}>
                                    {southEastAsiaLocationRows.map((row, rowIndex) => (
                                        <View
                                            key={rowIndex}
                                            style={[
                                                locationSelectStyles.chipRow,
                                                rowIndex !== southEastAsiaLocationRows.length - 1 && locationSelectStyles.chipRowSpacing,
                                            ]}
                                        >
                                            {row.map((label) => (
                                                <TouchableOpacity key={label} style={[locationSelectStyles.chip, location !== label ? { borderWidth: 1, borderColor: "#bebebe" } : { borderWidth: 2, borderColor: '#FF2D55' }]} onPress={() => handleSelectLocation(label)}>
                                                    <Text style={locationSelectStyles.chipText}>{label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </>
                        }

                        {
                            (!selectedContinental || selectedContinental === '유럽' || selectedContinental === '미주') &&
                            <>
                                <View style={locationSelectStyles.divider} />
                                <Text style={locationSelectStyles.sectionLabel}>유럽/미주의 인기 여행지</Text>
                                <View style={locationSelectStyles.chipGrid}>
                                    {europeAmericaLocationRows.map((row, rowIndex) => (
                                        <View
                                            key={rowIndex}
                                            style={[
                                                locationSelectStyles.chipRow,
                                                rowIndex !== europeAmericaLocationRows.length - 1 && locationSelectStyles.chipRowSpacing,
                                            ]}
                                        >
                                            {row.map((label) => (
                                                <TouchableOpacity key={label} style={[locationSelectStyles.chip, location !== label ? { borderWidth: 1, borderColor: "#bebebe" } : { borderWidth: 2, borderColor: '#FF2D55' }]} onPress={() => handleSelectLocation(label)}>
                                                    <Text style={locationSelectStyles.chipText}>{label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </>
                        }

                        {
                            (!selectedContinental || selectedContinental === '오세아니아') &&
                            <>
                                <View style={locationSelectStyles.divider} />
                                <Text style={locationSelectStyles.sectionLabel}>오세아니아의 인기 여행지</Text>
                                <View style={locationSelectStyles.chipGrid}>
                                    {australiaLocationRows.map((row, rowIndex) => (
                                        <View
                                            key={rowIndex}
                                            style={[
                                                locationSelectStyles.chipRow,
                                                rowIndex !== australiaLocationRows.length - 1 && locationSelectStyles.chipRowSpacing,
                                            ]}
                                        >
                                            {row.map((label) => (
                                                <TouchableOpacity key={label} style={[locationSelectStyles.chip, location !== label ? { borderWidth: 1, borderColor: "#bebebe" } : { borderWidth: 2, borderColor: '#FF2D55' }]} onPress={() => handleSelectLocation(label)}>
                                                    <Text style={locationSelectStyles.chipText}>{label}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    ))}
                                </View>
                            </>
                        }
                    </>
                )}






            </View>
        </TouchableOpacity>
    )
}

const locationSelectStyles = StyleSheet.create({
    overlayTouchable: {
        paddingHorizontal: 22,
        marginTop: 80,
    },
    overlayCard: {
        paddingVertical: 32,
        paddingHorizontal: 24,
        borderRadius: 20,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 7.4,
        elevation: 7.4,
    },
    overlayTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#141414",
        fontFamily: "NanumSquare Neo",
        marginBottom: 24,
    },
    searchSection: {},
    sectionLabel: {
        fontSize: 14,
        fontWeight: "700",
        color: "#141414",
        fontFamily: "NanumSquare Neo",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#999",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        height: 54,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: "300",
        color: "#141414",
        fontFamily: "NanumSquare Neo",
        paddingVertical: 0,
    },
    divider: {
        height: 1,
        backgroundColor: "#DEDEDE",
        marginTop: 24,
        marginBottom: 12,
    },
    chipGrid: {
        marginTop: 24,
    },
    chipRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    chipRowSpacing: {
        marginBottom: 12,
    },
    chip: {
        width: '32%',
        height: 39,
        borderRadius: 15,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        position: 'relative',
    },
    chipText: {
        fontSize: 12,
        fontWeight: "300",
        color: "#000",
        fontFamily: "NanumSquare Neo",
    },
    recommendationRow: {
        marginTop: 24,
        width: Dimensions.get('window').width - 44,
        marginLeft: -24,
        paddingHorizontal: 24,
    },
    recommendationCardContainer: {
        flexDirection: "row",
        width: 'auto'
    },
    recommendationCard: {
        width: 90,
        height: 90,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#d9d9d9",
        backgroundColor: "#f6f6f6",
        marginRight: 12,
    },
});