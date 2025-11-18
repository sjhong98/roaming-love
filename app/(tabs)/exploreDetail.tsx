import CommentIcon from '@/assets/images/commentIcon.svg';
import HeartInactiveIcon from '@/assets/images/heartIcon.svg';
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import SearchRedIcon from '@/assets/images/searchRed.svg';
import supabase from "@/db";
import useUser from '@/hooks/use-user';
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { use, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, KeyboardAvoidingView, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, PanResponder, Modal } from "react-native";
import { CustomText as Text } from '@/components/CustomText';
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
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const isClosingModalRef = useRef(false);

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

    const openImageModal = (imageUri: string, allImages?: string[], initialIndex?: number) => {
        if (isClosingModalRef.current) return;
        if (allImages && allImages.length > 0) {
            setSelectedImages(allImages);
            setSelectedImageIndex(initialIndex || 0);
        } else {
            setSelectedImages([imageUri]);
            setSelectedImageIndex(0);
        }
        setSelectedImageUri(imageUri);
    }

    const closeImageModal = () => {
        isClosingModalRef.current = true;
        setSelectedImageUri(null);
        setSelectedImages([]);
        setSelectedImageIndex(0);
        // 모달이 완전히 닫힌 후 플래그 리셋 (더 긴 시간으로 설정)
        setTimeout(() => {
            isClosingModalRef.current = false;
        }, 500);
    }

    if (!postDetail) return

    return (
        <>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <SafeAreaView style={{ width: '100%', position: 'relative', paddingTop: 10, paddingBottom: 0 }}>
                    <View style={[topStyles.view0, { paddingHorizontal: 21 }]}>
                        <View style={{ position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => router.back()} style={{ position: 'absolute', left: 0, top: 0 }}>
                                <ArrowLeftIcon width={24} height={24} />
                            </TouchableOpacity>
                            <Text style={topStyles.text}>게시물</Text>
                        </View>
                    </View>
                </SafeAreaView>

                <ScrollView
                    style={{ width: '100%' }}
                    contentContainerStyle={{ paddingLeft: 21, paddingRight: 13, paddingBottom: 300 }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                        <Image source={postDetail?.user?.image ? { uri: postDetail?.user?.image } : require('@/assets/images/userIcon.png')} style={{ width: 45, height: 45, borderRadius: 100 }} resizeMode="cover" />
                        <Text style={[postStyles.text, postStyles.textTypo, { marginLeft: -3 }]}>{postDetail?.user?.nickname ?? postDetail?.user?.name}</Text>
                    </View>
                    <View style={{ width: '100%', marginTop: 13 }}>
                        <View style={[postStyles.view2, { height: 'auto', width: '100%', position: 'relative' }]}>
                            <Text style={[postStyles.text2, postStyles.textTypo]}>{postDetail?.content}</Text>
                            {postDetail?.image ? (
                                postDetail?.image?.split('|SPLIT|')?.length === 1 ?
                                    (<TouchableOpacity
                                        activeOpacity={0.9}
                                        onPress={() => openImageModal(postDetail?.image?.split('|SPLIT|')?.[0], postDetail?.image?.split('|SPLIT|'), 0)}
                                    >
                                        <Image
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
                                        />
                                    </TouchableOpacity>) : (
                                        <ScrollView
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            style={{ width: Dimensions.get('window').width, gap: 10, marginLeft: -21 }}
                                            contentContainerStyle={{ gap: 12, paddingLeft: 21, paddingRight: 21 }}
                                        >
                                            {postDetail?.image?.split('|SPLIT|')?.map((image: string, index: number) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    activeOpacity={0.9}
                                                    onPress={() => openImageModal(image, postDetail?.image?.split('|SPLIT|'), index)}
                                                >
                                                    <Image
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
                                                </TouchableOpacity>
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

                                    <Text style={{ fontSize: 12, fontWeight: '300', color: '#000', marginLeft: -4 }}>{postDetail?.likeCount === 0 ? '' : postDetail?.likeCount?.toLocaleString()}</Text>
                                </View>
                            </View>
                            <View style={[postStyles.bookmark, postStyles.heartLayout]}>
                                <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <CommentIcon style={[postStyles.icon2, { marginTop: -2 }]} />
                                    <Text style={{ fontSize: 12, fontWeight: '300', color: '#000', marginBottom: -1, marginLeft: -4 }}>{postDetail?.comment?.length === 0 ? '' : postDetail?.comment?.length?.toLocaleString()}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#b3b3b3', height: 0.5, width: Dimensions.get('window').width, position: 'absolute', bottom: -10, left: -21 }} />
                    </View>

                    <View style={{ width: '100%', height: 20 }} />

                    <View style={{ gap: 10 }}>
                        {
                            postDetail?.comment?.map((comment: any, index: number) => (
                                <View key={index} style={[commentStyles.view, { marginTop: 5 }]}>
                                    <Image source={comment?.user?.image ? { uri: comment?.user?.image } : require('@/assets/images/userIcon.png')} style={[commentStyles.child, { borderRadius: 100 }]} resizeMode="cover" />
                                    <Text style={[commentStyles.text, commentStyles.textTypo, { fontWeight: 700 }]}>{comment?.user?.nickname || comment?.user?.name}</Text>
                                    <Text style={[commentStyles.text2, commentStyles.textTypo, { width: Dimensions.get('window').width - 82, position: 'relative', fontWeight: 400 }]}>{comment?.content}</Text>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>

                <View style={{ position: 'relative', height: 49, width: '100%', flexDirection: 'row', gap: 6, paddingVertical: 7, paddingHorizontal: 11, backgroundColor: '#FFF' }}>
                    <Image source={user?.image ? { uri: user?.image } : require('@/assets/images/userIcon.png')} style={{ width: 35, height: 35, borderRadius: 100 }} resizeMode="cover" />
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
                </View>
            </KeyboardAvoidingView>

            {/* 이미지 모달 */}
            <Modal
                visible={selectedImageUri !== null}
                transparent={true}
                animationType="fade"
                onRequestClose={closeImageModal}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={closeImageModal}
                    style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.95)', justifyContent: 'center', alignItems: 'center' }}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={closeImageModal}
                        style={{ position: 'absolute', top: 50, right: 20, zIndex: 1000, padding: 10 }}
                    >
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>✕</Text>
                    </TouchableOpacity>
                    
                    {selectedImages.length > 1 && (
                        <>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    if (selectedImageIndex > 0) {
                                        setSelectedImageIndex(selectedImageIndex - 1);
                                        setSelectedImageUri(selectedImages[selectedImageIndex - 1]);
                                    }
                                }}
                                style={{ position: 'absolute', left: 20, zIndex: 1000, padding: 15 }}
                                disabled={selectedImageIndex === 0}
                            >
                                <Text style={{ color: selectedImageIndex === 0 ? '#666' : '#fff', fontSize: 24, fontWeight: '600' }}>‹</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={(e) => {
                                    e.stopPropagation();
                                    if (selectedImageIndex < selectedImages.length - 1) {
                                        setSelectedImageIndex(selectedImageIndex + 1);
                                        setSelectedImageUri(selectedImages[selectedImageIndex + 1]);
                                    }
                                }}
                                style={{ position: 'absolute', right: 20, zIndex: 1000, padding: 15 }}
                                disabled={selectedImageIndex === selectedImages.length - 1}
                            >
                                <Text style={{ color: selectedImageIndex === selectedImages.length - 1 ? '#666' : '#fff', fontSize: 24, fontWeight: '600' }}>›</Text>
                            </TouchableOpacity>
                            <View style={{ position: 'absolute', bottom: 50, zIndex: 1000 }}>
                                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '400' }}>
                                    {selectedImageIndex + 1} / {selectedImages.length}
                                </Text>
                            </View>
                        </>
                    )}
                    
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={{ flex: 1, width: '100%' }}
                    >
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            contentOffset={{ x: selectedImageIndex * Dimensions.get('window').width, y: 0 }}
                            onMomentumScrollEnd={(event) => {
                                const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
                                setSelectedImageIndex(index);
                                setSelectedImageUri(selectedImages[index]);
                            }}
                        >
                            {selectedImages.map((image, index) => (
                                <View key={index} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: image }}
                                        style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
                                        contentFit="contain"
                                    />
                                </View>
                            ))}
                        </ScrollView>
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </>
    );
}

const commentStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    textTypo: {
        textAlign: "left",
        // fontWeight: "600",
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
        color: "#000",
        marginLeft: -4
    },
    text2: {
        top: 20,
        color: "#333",
        marginLeft: -4
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
        fontWeight: "300",
        position: "absolute"
    },
    view0: {
        width: "100%",
        height: 20,
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