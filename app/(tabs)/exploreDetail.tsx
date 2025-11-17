import CommentIcon from '@/assets/images/commentIcon.svg';
import HeartInactiveIcon from '@/assets/images/heartIcon.svg';
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import SearchRedIcon from '@/assets/images/searchRed.svg';
import supabase from "@/db";
import useUser from '@/hooks/use-user';
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { use, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, KeyboardAvoidingView, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import ArrowLeftIcon from '@/assets/images/arrowGray.svg';
import SendIcon from '@/assets/images/sendIcon.svg';

export default function ExploreDetail() {
    const { user } = useUser();
    const { postPk } = useLocalSearchParams();

    const likeAnimations = useRef<Map<number, Animated.Value>>(new Map());

    const [postDetail, setPostDetail] = useState<any>(null);
    const [imageAspectRatios, setImageAspectRatios] = useState<Map<number, number>>(new Map());
    const [commentText, setCommentText] = useState('');

    const fetchPost = async () => {
        console.log('postPk', postPk);
        const { data, error } = await supabase
            .from('post')
            .select('*, user:user(*), comment:post_comment(*, user:user(*)), like:post_like(*)')
            .eq('pk', postPk)
            .single();

        console.log('data', data);

        if (error) {
            console.log('error', error);
        } else {
            setPostDetail(data);
        }
    }

    useEffect(() => {
        if (user === undefined || !postPk) return;
        fetchPost();
    }, [postPk, user]);

    const uploadComment = async () => {
        if (!user) return;
        await supabase
            .from('post_comment')
            .insert({
                post_pk: postPk,
                user_pk: user?.pk,
                content: commentText,
            });

        let newPostDetail: any = { ...postDetail, comment: [...postDetail?.comment, { content: commentText, user: user }] };
        console.log('user', user);
        setPostDetail(newPostDetail);
        setCommentText('');
    }

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
            let newPostDetail: any = { ...postDetail, didILike: false, likeCount: postDetail?.likeCount - 1 };
            setPostDetail(newPostDetail);
        } else {
            // 좋아요 추가
            await supabase
                .from('post_like')
                .insert({
                    post_pk: postPk,
                    user_pk: user?.pk,
                });
            let newPostDetail: any = { ...postDetail, didILike: true, likeCount: postDetail?.likeCount + 1 };
            setPostDetail(newPostDetail);
        }
    }

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

    if (!postDetail) return

    return (
        <>
            <SafeAreaView style={{ width: '100%', position: 'relative', paddingTop: 10, paddingBottom: 0 }}>
                <View style={[topStyles.view0, { paddingHorizontal: 21 }]}>
                    <View style={{ position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { }} style={{ position: 'absolute', left: 0, top: 0 }}>
                            <ArrowLeftIcon width={24} height={24} />
                        </TouchableOpacity>
                        <Text style={topStyles.text}>게시물</Text>
                    </View>
                </View>

                <ScrollView
                    style={{ width: '100%' }}
                    contentContainerStyle={{ paddingLeft: 21, paddingRight: 13, paddingBottom: 100 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                        <Image source={require('@/assets/images/userIcon.png')} style={{ width: 45, height: 45, borderRadius: 100 }} resizeMode="cover" />
                        <Text style={[postStyles.text, postStyles.textTypo]}>{postDetail?.user?.nickname}</Text>
                    </View>
                    <View style={{ width: '100%', marginTop: 13 }}>
                        <View style={[postStyles.view2, { height: 'auto', width: '100%', position: 'relative' }]}>
                            <Text style={[postStyles.text2, postStyles.textTypo]}>{postDetail?.content}</Text>
                            {postDetail?.image ? (
                                postDetail?.image?.split('|SPLIT|')?.length === 1 ?
                                    (<Image
                                        source={{ uri: postDetail?.image?.split('|SPLIT|')?.[0] }}
                                        style={{
                                            width: Dimensions.get('window').width - 93,
                                            height: imageAspectRatios.has(postDetail?.pk)
                                                ? (Dimensions.get('window').width - 93) * imageAspectRatios.get(postDetail?.pk)!
                                                : 200, // 임시 높이 (로드 전까지)
                                            borderRadius: 10,
                                            marginTop: 9
                                        }}
                                        contentFit="cover"
                                        onLoad={(event) => handleImageLoad(postDetail?.pk, event)}
                                        onError={(error) => console.log('Image load error:', error)}
                                    />) : (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={{ width: Dimensions.get('window').width, gap: 10, marginLeft: -21 }}
                                            contentContainerStyle={{ gap: 12, paddingLeft: 21, paddingRight: 21 }}
                                        >
                                            {postDetail?.image?.split('|SPLIT|')?.map((image: string, index: number) => (
                                                <Image
                                                    key={index}
                                                    source={{ uri: image }}
                                                    style={{
                                                        width: Dimensions.get('window').width - 93,
                                                        height: imageAspectRatios.has(postDetail?.pk)
                                                            ? (Dimensions.get('window').width - 93) * imageAspectRatios.get(postDetail?.pk)!
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
                        <View>
                            <Text style={{ fontSize: 10, lineHeight: 12, color: '#5b5e63', marginTop: 6 }}>{dayjs(postDetail?.created_at).format('A H:mm YYYY.MM.DD')}</Text>
                        </View>
                        <View style={[postStyles.bookmarkParent, { marginTop: 18 }]}>
                            <View style={[postStyles.heart, postStyles.heartLayout]}>
                                <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 40 }}>
                                    <Animated.View style={{ transform: [{ scale: getLikeAnimation(postDetail?.pk) }] }}>
                                        {postDetail?.didILike ? (
                                            <TouchableOpacity activeOpacity={1} onPress={() => handleLike(postDetail?.pk, true)}>
                                                <HeartActiveIcon />
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity activeOpacity={1} onPress={() => handleLike(postDetail?.pk, false)}>
                                                <HeartInactiveIcon />
                                            </TouchableOpacity>
                                        )}
                                    </Animated.View>

                                    <Text style={{ fontSize: 12, fontWeight: '300', color: '#000', fontFamily: 'Pretendard', marginLeft: -4 }}>{postDetail?.likeCount === 0 ? '' : postDetail?.likeCount?.toLocaleString()}</Text>
                                </View>
                            </View>
                            <View style={[postStyles.bookmark, postStyles.heartLayout]}>
                                <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <CommentIcon style={[postStyles.icon2, { marginTop: -2 }]} />
                                    <Text style={{ fontSize: 12, fontWeight: '300', color: '#000', fontFamily: 'Pretendard', marginBottom: -1, marginLeft: -4 }}>{postDetail?.comment?.length === 0 ? '' : postDetail?.comment?.length?.toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#b3b3b3', height: 0.5, width: Dimensions.get('window').width, position: 'absolute', bottom: -10, left: -21 }} />
                    </View>

                    <View style={{ width: '100%', height: 20 }} />

                    <View style={{ gap: 10}}>
                        {
                            postDetail?.comment?.map((comment: any, index: number) => (
                                <View key={index} style={commentStyles.view}>
                                    <Image source={require('@/assets/images/userIcon.png')} style={commentStyles.child} resizeMode="cover" />
                                    <Text style={[commentStyles.text, commentStyles.textTypo]}>{comment?.user?.nickname || comment?.user?.name}</Text>
                                    <Text style={[commentStyles.text2, commentStyles.textTypo]}>{comment?.content}</Text>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>

            <KeyboardAvoidingView style={{ position: 'absolute', bottom: 0, height: 49, width: '100%', flexDirection: 'row', gap: 6, paddingVertical: 7, paddingHorizontal: 11, backgroundColor: '#FFF' }}>
                <Image source={require('@/assets/images/userIcon.png')} style={{ width: 35, height: 35, borderRadius: 100 }} resizeMode="cover" />
                <View style={styles.item}>
                    <TextInput
                        style={[styles.text, { color: commentText ? '#000' : '#999' }]}
                        placeholder="답글 게시하기"
                        placeholderTextColor="#999"
                        value={commentText}
                        onChangeText={setCommentText}
                        multiline={false}
                    />
                </View>
                <TouchableOpacity onPress={uploadComment} style={{ height: 32, justifyContent: 'center', alignItems: 'center', marginLeft: -2, marginBottom: -2 }}>
                    <SendIcon width={24} height={24} />
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </>
    );
}

const commentStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    textTypo: {
        textAlign: "left",
        fontFamily: "Pretendard",
        fontWeight: "600",
        lineHeight: 22,
        fontSize: 15,
        left: 47,
        position: "absolute"
    },
    view: {
        width: "100%",
        minHeight: 42,
        flex: 1
    },
    child: {
        top: 4,
        left: 0,
        width: 35,
        height: 35,
        position: "absolute"
    },
    text: {
        top: 0,
        color: "#000"
    },
    text2: {
        top: 20,
        color: "#333"
    }
});

const styles = StyleSheet.create({
    parent: {
        flex: 1
    },
    sendPosition: {
        overflow: "hidden",
        position: "absolute"
    },
    view: {
        width: "100%",
        height: 49,
    },
    child: {
        marginLeft: -201,
        top: 0,
        left: "50%",
        backgroundColor: "#fff",
        width: 402,
        position: "absolute",
        height: 49
    },
    item: {
        borderRadius: 15,
        backgroundColor: "#efeff0",
        width: 306,
        height: 35,
        justifyContent: 'center',
        paddingHorizontal: 13
    },
    text: {
        fontSize: 12,
        fontWeight: "300",
        fontFamily: "NanumSquare Neo",
        color: "#999",
        textAlign: "left",
    },
    plusCircle: {
        top: 13,
        left: 14,
        width: 24,
        height: 24
    },
    send: {
        top: 10,
        left: 396,
        width: 32,
        height: 32,
        transform: [
            {
                rotate: "180deg"
            }
        ]
    },
    icon: {
        height: "83.44%",
        width: "83.44%",
        top: "8.33%",
        right: "8.23%",
        bottom: "8.23%",
        left: "8.33%",
        maxWidth: "100%",
        maxHeight: "100%",
        color: "#ff2d55"
    }
});

const topStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    textTypo1: {
        fontSize: 17,
        top: 37,
        textAlign: "center",
        fontFamily: "NanumSquare Neo OTF",
        fontWeight: "700",
        left: "50%",
        position: "absolute"
    },
    childPosition: {
        left: '6%',
        position: "absolute"
    },
    toTypo: {
        textAlign: "left",
        fontFamily: "Pretendard",
        fontWeight: "300",
        fontSize: 40,
        top: 111,
        position: "absolute"
    },
    groupLayout: {
        height: 16,
        // position: "absolute"
    },
    textTypo: {
        fontSize: 13,
        textAlign: "left",
        fontFamily: "Pretendard",
        fontWeight: "300",
        position: "absolute"
    },
    view0: {
        width: "100%",
        height: 50,
        position: 'relative'
    },
    view: {
        width: "100%",
        height: 240,
        flex: 1,
        position: 'relative'
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        fontFamily: "NanumSquare Neo OTF",
        fontWeight: "700",
        color: "#000",
        top: 0,
        position: "absolute"
    },
    text2: {
        marginLeft: -120.5,
        color: "#e40046"
    },
    text3: {
        marginLeft: 49.5,
        color: "#999"
    },
    view2: {
        top: 79,
        boxShadow: "0px 5px 9.1px rgba(0, 0, 0, 0.1)",
        elevation: 7.4,
        borderRadius: 20,
        backgroundColor: "#fff",
        height: 161,
        width: '100%',
        position: "absolute"
    },
    child: {
        top: 125,
        maxHeight: "100%",
        color: "#d9d9d9",
        width: 347
    },
    sel: {
        left: '20%',
        color: "#e30247"
    },
    to: {
        left: '66%',
        color: "#999"
    },
    toActive: {
        left: '62%',
        color: "#E30247"
    },
    vectorIcon: {
        top: 127,
        left: 166,
        width: 14,
        color: "#000"
    },
    divider: {
        height: 1,
        backgroundColor: "#DEDEDE",
        top: 193,
        width: '100%',
        position: "absolute"
    },
    text4: {
        top: 160,
        left: '18.5%',
        color: "#000"
    },
    text5: {
        color: "#999"
    },
    group: {
        top: 208,
        // left: 117,
        // width: 160
    },
    text6: {
        // left: '30%',
        color: "#999",
        top: 0,
        fontSize: 13
    },
    vectorIcon2: {
        top: 1,
        width: 18,
        height: 14,
        color: "#e40046"
    }
});

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
        fontFamily: "SF Pro",
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
        fontFamily: "SF Pro",
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