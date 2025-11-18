import CommentIcon from '@/assets/images/commentIcon.svg';
import HeartInactiveIcon from '@/assets/images/heartIcon.svg';
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import SearchRedIcon from '@/assets/images/searchRed.svg';
import supabase from "@/db";
import useUser from '@/hooks/use-user';
import { Image } from "expo-image";
import { router } from "expo-router";
import { use, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { CustomText as Text } from '@/components/CustomText';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowBack from '@/assets/images/arrowGray.svg';
import SearchIcon from '@/assets/images/searchGray.svg';

export default function ExploreSearch() {
    const { user } = useUser();
    const [searchText, setSearchText] = useState('');
    const [searchPostList, setSearchPostList] = useState([]);
    const [imageAspectRatios, setImageAspectRatios] = useState<Map<number, number>>(new Map());

    const likeAnimations = useRef<Map<number, Animated.Value>>(new Map());

    const handleImageLoad = (postPk: number, event: any) => {
        console.log('Image load event:', event);
        console.log('Image load event.source:', event.source);
        // expo-image의 onLoad 이벤트 구조 확인
        const source = event.source || event.nativeEvent?.source || event;
        const width = source.width;
        const height = source.height;
        console.log('Image dimensions:', { width, height, postPk });
        if (width && height) {
            const aspectRatio = height / width;
            console.log('Calculated aspect ratio:', aspectRatio);
            setImageAspectRatios(prev => {
                const newMap = new Map(prev);
                newMap.set(postPk, aspectRatio);
                return newMap;
            });
        }
    }

    const handleLike = async (postPk: number, didILike: boolean) => {
        console.log('postPk', postPk);
        // Pop 애니메이션 트리거
        triggerPopAnimation(postPk);

        if (didILike) {
            // 좋아요 취소
            await supabase
                .from('post_like')
                .delete()
                .eq('post_pk', postPk)
                .eq('user_pk', user?.pk);
            let newSearchPostList: any = searchPostList.map((item: any) => item.pk === postPk ? { ...item, didILike: false, likeCount: item?.likeCount - 1 } : item);
            setSearchPostList(newSearchPostList);
        } else {
            // 좋아요 추가
            await supabase
                .from('post_like')
                .insert({
                    post_pk: postPk,
                    user_pk: user?.pk,
                });
            let newSearchPostList: any = searchPostList.map((item: any) => item.pk === postPk ? { ...item, didILike: true, likeCount: item?.likeCount + 1 } : item);
            setSearchPostList(newSearchPostList);
        }
    }

    const fetchSearchPost = async () => {
        const { data, error } = await supabase
            .from('post')
            .select('*')
            .like('content', `%${searchText}%`)
            .order('created_at', { ascending: false })
        if (error) {
            console.error('게시글 목록 가져오기 실패:', error);
            return;
        }
        console.log('data', data);
        setSearchPostList(data as any);
    }

    useEffect(() => {
        if (searchText.length === 0) {
            setSearchPostList([]);
            return;
        }

        fetchSearchPost();
    }, [searchText])

    const getLikeAnimation = (postPk: number): Animated.Value => {
        if (!likeAnimations.current.has(postPk)) {
            likeAnimations.current.set(postPk, new Animated.Value(1));
        }
        return likeAnimations.current.get(postPk)!;
    };

    const triggerPopAnimation = (postPk: number) => {
        const animValue = getLikeAnimation(postPk);
        Animated.sequence([
            Animated.timing(animValue, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(animValue, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <SafeAreaView>
            <View style={[styles.view, { paddingHorizontal: 21, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 7 }]}>
                <View style={[styles.view5, { zIndex: 9999 }]}>
                    <View style={[styles.view6, styles.viewPosition]} />
                    <TouchableOpacity activeOpacity={1} onPress={() => router.back()} style={[styles.view7, styles.viewPosition]}>
                        <ArrowBack width={24} height={24} />
                    </TouchableOpacity>
                </View>

                <View style={styles.view2}>
                    <View style={[styles.view3, styles.viewShadowBox, { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 13, backgroundColor: '#FFF', zIndex: 9999 }]}>
                        <View style={styles.search}>
                            <SearchIcon style={[styles.icon, styles.iconClr, { marginTop: -2 }]} />
                        </View>
                        <TextInput
                            style={[styles.text, { color: searchText ? '#000' : '#999', flex: 1, marginBottom: -2 }]}
                            placeholder="원하는 그룹, 글을 찾아보세요"
                            placeholderTextColor="#999"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>
                </View>
            </View>

            {searchPostList.length > 0 ?
                <ScrollView style={{ marginTop: -120}} contentContainerStyle={{ paddingTop: 120 }}>
                    {
                        searchPostList.map((item: any, index) => (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={1}
                                onPress={() => router.push(`/exploreDetail?postPk=${item?.pk}`)}
                                style={{ width: '100%', position: 'relative', borderColor: "#b3b3b3", borderBottomWidth: 0.5, paddingTop: 10, paddingLeft: 21, paddingRight: 13, flexDirection: 'row', gap: 13, paddingBottom: 10, zIndex: 1 }}
                            >
                                <View style={{ width: 45 }}>
                                    <Image source={item?.user?.image ? { uri: item?.user?.image } : require('@/assets/images/userIcon.png')} style={[postStyles.item, postStyles.itemPosition]} resizeMode="cover" />
                                </View>
                                <View style={{ width: '100%' }}>
                                    <View style={[postStyles.view2, { height: 'auto', width: '100%', position: 'relative' }]}>
                                        <Text style={[postStyles.text, postStyles.textTypo]}>{item?.user?.nickname}</Text>
                                        <Text style={[postStyles.text2, postStyles.textTypo]}>{item?.content}</Text>
                                        {item?.image ? (
                                            item?.image?.split('|SPLIT|')?.length === 1 ?
                                                (<Image
                                                    source={{ uri: item?.image?.split('|SPLIT|')?.[0] }}
                                                    style={{
                                                        width: Dimensions.get('window').width - 93,
                                                        height: imageAspectRatios.has(item?.pk)
                                                            ? (Dimensions.get('window').width - 93) * imageAspectRatios.get(item?.pk)!
                                                            : 200, // 임시 높이 (로드 전까지)
                                                        borderRadius: 10,
                                                        marginTop: 9
                                                    }}
                                                    contentFit="cover"
                                                    onLoad={(event) => handleImageLoad(item?.pk, event)}
                                                    onError={(error) => console.log('Image load error:', error)}
                                                />) : (
                                                    <ScrollView
                                                        horizontal
                                                        showsHorizontalScrollIndicator={false}
                                                        style={{ width: Dimensions.get('window').width, gap: 10, marginLeft: -79 }}
                                                        contentContainerStyle={{ gap: 12, paddingLeft: 79, paddingRight: 13 }}
                                                        onStartShouldSetResponder={() => true}
                                                        onMoveShouldSetResponder={() => true}
                                                    >
                                                        {item?.image?.split('|SPLIT|')?.map((image: string, index: number) => (
                                                            <Image
                                                                key={index}
                                                                source={{ uri: image }}
                                                                style={{
                                                                    width: Dimensions.get('window').width - 93,
                                                                    height: imageAspectRatios.has(item?.pk)
                                                                        ? (Dimensions.get('window').width - 93) * imageAspectRatios.get(item?.pk)!
                                                                        : 200, // 임시 높이 (로드 전까지)
                                                                    borderRadius: 10,
                                                                    marginTop: 9
                                                                }}
                                                                contentFit="cover"
                                                            />
                                                        ))}
                                                    </ScrollView>

                                                )
                                        ) : (
                                            <View style={{ width: '100%', height: 0 }} />
                                        )}
                                    </View>
                                    <View style={[postStyles.bookmarkParent, { marginTop: 13 }]}>
                                        <View style={[postStyles.heart, postStyles.heartLayout]}>
                                            <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 40 }}>
                                                <Animated.View style={{ transform: [{ scale: getLikeAnimation(item?.pk) }] }}>
                                                    {item?.didILike ? (
                                                        <TouchableOpacity activeOpacity={1} onPress={() => handleLike(item?.pk, true)}>
                                                            <HeartActiveIcon />
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity activeOpacity={1} onPress={() => handleLike(item?.pk, false)}>
                                                            <HeartInactiveIcon />
                                                        </TouchableOpacity>
                                                    )}
                                                </Animated.View>

                                            </View>
                                        </View>
                                        <View style={[postStyles.bookmark, postStyles.heartLayout]}>
                                            <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <CommentIcon style={[postStyles.icon2, { marginTop: -2 }]} />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>
                :
                <View style={{ flexDirection: 'row', gap: 5, paddingHorizontal: 21, paddingTop: 23, flexWrap: 'wrap' }}>
                    {['T', 'Paris', 'Sydney', 'Place', 'Travel style m123', 'Date', 'Cafe'].map((item, index) => (
                        <View key={index} style={chipStyles.view}>
                            <View style={chipStyles.child}>
                                <Text style={chipStyles.tokyo}>{item}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            }
        </SafeAreaView>
    );
}

const postStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    itemPosition: {
        height: 45,
        top: 0,
        position: "absolute"
    },
    textTypo: {
        textAlign: "left",
        color: "#000",
        lineHeight: 22,
    },
    heartLayout: {
        // overflow: "hidden",
        width: 20,
        height: 20,
        bottom: 2,
        position: "absolute"
    },
    iconLayout: {
        color: "#1b1f26",
        maxHeight: "100%",
        maxWidth: "100%",
        overflow: "hidden",
    },
    view: {
        width: "100%",
    },
    child: {
        marginLeft: -201,
        top: 84,
        left: "50%",
        width: 402,
        height: 0,
        position: "absolute"
    },
    view2: {
        width: '100%'
    },
    item: {
        width: 45,
        left: 0,
        borderRadius: 100
    },
    text: {
        fontSize: 15,
        fontWeight: "600",
        textAlign: "left",
        color: "#000",
        lineHeight: 22,
    },
    text2: {
        fontSize: 14
    },
    bookmarkParent: {
        width: '100%',
        height: 20,
    },
    bookmark: {
        left: 60
    },
    icon: {
        width: 20,
        height: 20,
        color: "#1b1f26"
    },
    heart: {
        left: 0,
        top: -2
    },
    icon2: {
        height: "76%",
        width: "87%",
        top: "12.49%",
        right: "6.55%",
        bottom: "11.51%",
        left: "6.45%"
    },
    messageSquare: {
        left: 0
    },
    icon3: {
        width: "75%",
        right: "12.5%",
        left: "12.5%",
        bottom: "12.5%",
        top: "12.5%",
        height: "75%",
        color: "#1b1f26"
    },
    share: {
        left: 285
    },
    icon4: {
        height: "83.5%",
        width: "66.5%",
        top: "8.33%",
        right: "16.83%",
        bottom: "8.17%",
        left: "16.67%",
        color: "#5b5e63",
        maxHeight: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        position: "absolute"
    }
});

const chipStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    view: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    child: {
        borderRadius: 20,
        backgroundColor: "#f2f2f2",
        borderStyle: "solid",
        borderColor: "#d9d9d9",
        borderWidth: 1,
        paddingHorizontal: 27,
        paddingVertical: 14

    },
    tokyo: {
        fontSize: 12,
        fontWeight: "700",
        color: "#444",
        textAlign: "center",
    }
});

const styles = StyleSheet.create({
    parent: {
        flex: 1
    },
    viewShadowBox: {
        backgroundColor: "#fff",
        elevation: 9.1,
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)"
    },
    viewBorder: {
        borderColor: "#999",
        borderStyle: "solid",
        backgroundColor: "rgba(255, 255, 255, 0)"
    },
    viewPosition: {
        marginLeft: -25,
        width: 50,
        borderRadius: 20,
        left: "50%",
        top: 0,
        position: "absolute",
        height: 50
    },
    iconClr: {
        color: "#999",
        position: "absolute"
    },
    view: {
        width: "100%",
        height: 50,
    },
    view2: {
        width: Dimensions.get('window').width - 99,
        height: 50,
        backgroundColor: '#FFF',
    },
    view3: {
        borderRadius: 20,
        width: '100%',
        height: 50,
    },
    view4: {
        borderRadius: 20,
        width: '100%',
        height: 50
    },
    view5: {
        width: 50,
        top: 0,
        height: 50,
        backgroundColor: '#FFF',
    },
    view6: {
        backgroundColor: "#fff",
        elevation: 9.1,
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)"
    },
    view7: {
        borderColor: "#999",
        borderStyle: "solid",
        backgroundColor: "rgba(255, 255, 255, 0)",
        justifyContent: 'center',
        alignItems: 'center'
    },
    search: {
        width: 24,
        height: 24,
        overflow: "hidden",
    },
    icon: {
        height: "75%",
        width: "75%",
        top: "12.5%",
        right: "12.5%",
        bottom: "12.5%",
        left: "12.5%",
        maxWidth: "100%",
        maxHeight: "100%",
        overflow: "hidden"
    },
    text: {
        fontSize: 12,
        fontWeight: "700",
        textAlign: "left"
    }
});
