import CommentIcon from '@/assets/images/commentIcon.svg';
import HeartActiveIcon from '@/assets/images/heartActive.svg';
import HeartInactiveIcon from '@/assets/images/heartIcon.svg';
import SearchRedIcon from '@/assets/images/searchRed.svg';
import supabase from "@/db";
import useUser from '@/hooks/use-user';
import DotsIcon from '@/assets/images/dots.svg';
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Animated, Dimensions, Modal, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, TouchableOpacity, View, Alert, PanResponder } from "react-native";
import { CustomText as Text } from '@/components/CustomText';

export default function Explore() {
    const { user } = useUser();
    const scrollRef = useRef<ScrollView>(null);

    const [activeTab, setActiveTab] = useState('recommend');
    const [isCustomRefreshing, setIsCustomRefreshing] = useState(false);
    const [tabContainerWidth, setTabContainerWidth] = useState(0);
    const [postList, setPostList] = useState([]);
    const [isPulled, setIsPulled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imageAspectRatios, setImageAspectRatios] = useState<Map<number, number>>(new Map());
    const [imageLoadingStates, setImageLoadingStates] = useState<Map<number, boolean>>(new Map());
    const [selectedPostPk, setSelectedPostPk] = useState<number | null>(null);
    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
    const isClosingModalRef = useRef(false);
    const dotsPressedRef = useRef(false);
    const userProfilePressedRef = useRef(false);
    const likeAnimations = useRef<Map<number, Animated.Value>>(new Map());
    const indicatorLeft = useRef(new Animated.Value(80)).current;
    const indicatorWidth = useRef(new Animated.Value(29)).current;
    const HEADER_HEIGHT = 120;
    const HEADER_HIDE_DISTANCE = HEADER_HEIGHT + 40;
    const scrollY = useRef(new Animated.Value(0)).current;
    const lastHeaderY = useRef(0);
    const pullDistance = useRef(new Animated.Value(0));
    const pullDistanceValue = useRef(0);
    const clampedScrollY = useRef(Animated.diffClamp(scrollY, 0, HEADER_HIDE_DISTANCE)).current;
    const headerTranslateY = clampedScrollY.interpolate({
        inputRange: [0, HEADER_HIDE_DISTANCE],
        outputRange: [0, -HEADER_HIDE_DISTANCE],
        extrapolate: 'clamp',
    });
    const refreshHeight = pullDistance.current.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 185],
        extrapolate: 'clamp'
    });
    const paddingTop = pullDistance.current.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 50],
        extrapolate: 'clamp'
    });
    const refreshOpacity = pullDistance.current.interpolate({
        inputRange: [0, 120],
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });

    const fetchPostList = async () => {
        if (!user) return;

        setIsLoading(true);
        const { data, error } = await supabase
            .from('post')
            .select('*, user:user(*), comment:post_comment(*), like:post_like(*)')
            .order('created_at', { ascending: false })
        if (error) {
            console.error('게시글 목록 가져오기 실패:', error);
            setIsLoading(false);
            return;
        }

        // like count를 계산하여 추가
        const postsWithCount = (data || []).map((post: any) => {
            const didILike = post.like.some((like: any) => like.user_pk === user?.pk);
            return {
                ...post,
                likeCount: Array.isArray(post.like) ? post.like.length : 0,
                didILike
            }
        });
        console.log('postsWithCount', postsWithCount);
        setPostList(postsWithCount as any);
        setIsLoading(false);
    }

    useEffect(() => {
        if (user === undefined) return;

        fetchPostList();
    }, [user])



    useEffect(() => {
        if (!isCustomRefreshing) return;

        fetchPostList().finally(() => {
            setIsCustomRefreshing(false);
        });
    }, [isCustomRefreshing]);

    useEffect(() => {
        const targetWidth = activeTab === 'recommend' ? 40 : 70;
        const targetLeft = activeTab === 'recommend'
            ? 75
            : Math.max(0, (tabContainerWidth || 0) - 73 - targetWidth);

        Animated.parallel([
            Animated.timing(indicatorLeft, {
                toValue: targetLeft,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(indicatorWidth, {
                toValue: targetWidth,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, [activeTab, indicatorLeft, indicatorWidth, tabContainerWidth]);

    const contentHeightRef = useRef(0);
    const containerHeightRef = useRef(0);
    const PULL_THRESHOLD = 80;

    const updatePullDistance = (value: number) => {
        pullDistance.current.setValue(value);
        pullDistanceValue.current = value;
        setIsPulled(value >= PULL_THRESHOLD || isCustomRefreshing);
    };

    useEffect(() => {
        if (isCustomRefreshing) {
            Animated.timing(pullDistance.current, {
                toValue: 135,
                duration: 220,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(pullDistance.current, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [isCustomRefreshing]);

    useEffect(() => {
        if (isCustomRefreshing) {
            setIsPulled(true);
        } else if (pullDistanceValue.current < PULL_THRESHOLD) {
            setIsPulled(false);
        }
    }, [isCustomRefreshing]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const y = event.nativeEvent.contentOffset.y;
        const maxScroll = Math.max(0, contentHeightRef.current - containerHeightRef.current);

        if (y < 0 && !isCustomRefreshing) {
            updatePullDistance(-y);
            return;
        }

        if (!isCustomRefreshing) {
            updatePullDistance(0);
        }
        if (maxScroll > 0 && y > maxScroll) return;

        if (isPulled) {
            lastHeaderY.current = lastHeaderY.current ?? 0;
            return;
        }

        lastHeaderY.current = y;
        scrollY.setValue(y);
    };

    const handleScrollEndDrag = () => {
        if (isCustomRefreshing) return;

        if (pullDistanceValue.current >= PULL_THRESHOLD) {
            setIsCustomRefreshing(true);
        } else {
            Animated.timing(pullDistance.current, {
                toValue: 0,
                duration: 180,
                useNativeDriver: false,
            }).start();
        }
    };

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

    const handleLike = async (postPk: number, didILike: boolean) => {
        // Pop 애니메이션 트리거
        triggerPopAnimation(postPk);

        if (didILike) {
            // 좋아요 취소
            await supabase
                .from('post_like')
                .delete()
                .eq('post_pk', postPk)
                .eq('user_pk', user?.pk);
            let newPostList: any = postList.map((item: any) => item.pk === postPk ? { ...item, didILike: false, likeCount: item?.likeCount - 1 } : item);
            setPostList(newPostList);
        } else {
            // 좋아요 추가
            await supabase
                .from('post_like')
                .insert({
                    post_pk: postPk,
                    user_pk: user?.pk,
                });
            let newPostList: any = postList.map((item: any) => item.pk === postPk ? { ...item, didILike: true, likeCount: item?.likeCount + 1 } : item);
            setPostList(newPostList);
        }
    }

    const handleImageLoadStart = (postPk: number) => {
        setImageLoadingStates(prev => {
            const newMap = new Map(prev);
            newMap.set(postPk, true);
            return newMap;
        });
    }

    const handleImageLoad = (postPk: number, event: any) => {
        console.log('Image load event:', event);
        console.log('Image load event.source:', event.source);
        // expo-image의 onLoad 이벤트 구조 확인
        const source = event.source || event.nativeEvent?.source || event;
        const width = source.width;
        const height = source.height;
        console.log('Image dimensions:', { width, height, postPk });
        // 이미지 로드 완료
        setImageLoadingStates(prev => {
            const newMap = new Map(prev);
            newMap.set(postPk, false);
            return newMap;
        });

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

    const handleMenuPress = (event: any, postPk: number) => {
        event.stopPropagation();
        dotsPressedRef.current = true;
        const { pageX, pageY } = event.nativeEvent;
        setMenuPosition({ x: pageX, y: pageY });
        setSelectedPostPk(postPk);
        // 다음 프레임에서 리셋
        setTimeout(() => {
            dotsPressedRef.current = false;
            userProfilePressedRef.current = false;
        }, 100);
    }

    const handleDeletePost = async () => {
        if (!selectedPostPk) return;

        Alert.alert(
            '게시물 삭제',
            '정말 이 게시물을 삭제하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel',
                    onPress: () => {
                        setSelectedPostPk(null);
                        setMenuPosition(null);
                    }
                },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // 게시물 삭제
                            const { error } = await supabase
                                .from('post')
                                .delete()
                                .eq('pk', selectedPostPk);

                            if (error) {
                                console.error('게시물 삭제 실패:', error);
                                Alert.alert('오류', '게시물 삭제에 실패했습니다.');
                            } else {
                                // 목록에서 제거
                                setPostList((prev: any) => prev.filter((item: any) => item.pk !== selectedPostPk));
                            }
                        } catch (error) {
                            console.error('게시물 삭제 중 오류:', error);
                            Alert.alert('오류', '게시물 삭제 중 오류가 발생했습니다.');
                        } finally {
                            setSelectedPostPk(null);
                            setMenuPosition(null);
                        }
                    }
                }
            ]
        );
    }

    const closeMenu = () => {
        setSelectedPostPk(null);
        setMenuPosition(null);
    }

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


    return (
        <View style={{ flex: 1, position: 'relative' }}>

            <Animated.View style={{ paddingTop: 70, backgroundColor: '#fff', width: '100%', height: 0, zIndex: 1000, position: 'absolute', top: 0, left: 0, right: 0, transform: [{ translateY: headerTranslateY }], paddingBottom: 0 }}>
                <View style={topStyles.view0}>
                    <View style={{ position: 'relative', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={topStyles.text}>탐색하기</Text>
                        <TouchableOpacity onPress={() => router.push('/exploreSearch')} style={{ marginRight: -115, marginTop: -1 }}>
                            <SearchRedIcon width={24} height={24} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>

            {/* <SafeAreaView style={{ flex: 1 }}> */}
            <Animated.ScrollView
                ref={scrollRef}
                style={{ flex: 1, marginTop: -10 }}
                contentContainerStyle={{ paddingBottom: 150, minHeight: Dimensions.get('window').height - 100, paddingTop: 135 }}
                scrollEventThrottle={16}
                onScroll={handleScroll}
                onScrollEndDrag={handleScrollEndDrag}
                onContentSizeChange={(_, height) => { contentHeightRef.current = height; }}
                onLayout={(event) => { containerHeightRef.current = event.nativeEvent.layout.height; }}
            >
                <Animated.View style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: refreshHeight,
                    opacity: refreshOpacity,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                }}>
                    <ActivityIndicator size="small" color="#FF2D55" />
                </Animated.View>
                <Animated.View style={{ width: '100%', height: paddingTop }} />
                {isLoading ? (
                    // 포스트 패치 이전 skeleton
                    Array.from({ length: 3 }).map((_, index) => (
                        <PostSkeleton key={index} />
                    ))
                ) : (
                    postList.map((item: any, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={1}
                            onPress={() => {
                                if (!dotsPressedRef.current && !userProfilePressedRef.current) {
                                    router.push(`/exploreDetail?postPk=${item?.pk}`);
                                }
                                userProfilePressedRef.current = false;
                            }}
                            style={{ width: '100%', position: 'relative', borderColor: "#b3b3b3", borderBottomWidth: 0.5, paddingTop: 10, paddingLeft: 21, paddingRight: 13, flexDirection: 'row', gap: 13, paddingBottom: 10, zIndex: 1 }}
                        >
                            <TouchableOpacity 
                                onPress={(e) => {
                                    userProfilePressedRef.current = true;
                                    if (item?.user?.pk) {
                                        router.push(`/userProfile?id=${item?.user?.pk}&real=true`);
                                    }
                                }}
                                onPressIn={() => { userProfilePressedRef.current = true; }}
                                style={{ width: 45, height: 45 }}
                            >
                                <Image source={item?.user?.image ?? require('@/assets/images/userIcon.png')} style={[postStyles.item, postStyles.itemPosition]} resizeMode="cover" />
                            </TouchableOpacity>
                            <View style={{ width: '100%' }}>
                                <View style={[postStyles.view2, { height: 'auto', width: '100%', position: 'relative' }]}>
                                    {user?.pk === item?.user?.pk &&
                                        <TouchableOpacity 
                                            onPress={(e) => handleMenuPress(e, item?.pk)} 
                                            onPressIn={() => { dotsPressedRef.current = true; }}
                                            style={{ position: 'absolute', right: 60, top: 10, zIndex: 9999, padding: 5 }}
                                        >
                                            <DotsIcon />
                                        </TouchableOpacity>
                                    }
                                    <TouchableOpacity 
                                        onPress={(e) => {
                                            userProfilePressedRef.current = true;
                                            if (item?.user?.pk) {
                                                router.push(`/userProfile?id=${item?.user?.pk}&real=true`);
                                            }
                                        }}
                                        onPressIn={() => { userProfilePressedRef.current = true; }}
                                        style={{ width: 100 }}
                                    >
                                        <Text style={[postStyles.text, postStyles.textTypo, { fontWeight: 700 }]}>{item?.user?.name ?? item?.user?.nickname}</Text>
                                    </TouchableOpacity>
                                    <Text style={[postStyles.text2, postStyles.textTypo, { width: '86%' }]}>{item?.content}</Text>
                                    {item?.image ? (
                                        item?.image?.split('|SPLIT|')?.length === 1 ?
                                            (
                                                <>
                                                    <ImageWrapper
                                                        postPk={item?.pk}
                                                        imageUri={item?.image?.split('|SPLIT|')?.[0]}
                                                        aspectRatio={imageAspectRatios.get(item?.pk)}
                                                        handleImageLoad={handleImageLoad}
                                                        onImagePress={openImageModal}
                                                        allImages={item?.image?.split('|SPLIT|')}
                                                    />
                                                </>
                                            ) : (
                                                <ScrollView
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    style={{ width: Dimensions.get('window').width, gap: 10, marginLeft: -79 }}
                                                    contentContainerStyle={{ gap: 12, paddingLeft: 79, paddingRight: 13 }}
                                                    onStartShouldSetResponder={() => true}
                                                    onMoveShouldSetResponder={() => true}
                                                >
                                                    {item?.image?.split('|SPLIT|')?.map((image: string, index: number) => {
                                                        if (index === 0) {
                                                            return (
                                                                <ImageWrapper
                                                                    key={index}
                                                                    postPk={item?.pk}
                                                                    imageUri={image}
                                                                    aspectRatio={imageAspectRatios.get(item?.pk)}
                                                                    handleImageLoad={handleImageLoad}
                                                                    onImagePress={openImageModal}
                                                                    allImages={item?.image?.split('|SPLIT|')}
                                                                    imageIndex={index}
                                                                />
                                                            );
                                                        }
                                                        const aspectRatio = imageAspectRatios.get(item?.pk);
                                                        const imageWidth = Dimensions.get('window').width - 104;
                                                        return (
                                                            <TouchableOpacity
                                                                key={index}
                                                                activeOpacity={0.9}
                                                                onPress={() => openImageModal(image, item?.image?.split('|SPLIT|'), index)}
                                                            >
                                                                <Image
                                                                    source={{ uri: image }}
                                                                    style={{
                                                                        width: imageWidth,
                                                                        height: aspectRatio ? imageWidth * aspectRatio : 200,
                                                                        borderRadius: 10,
                                                                        marginTop: 9
                                                                    }}
                                                                    contentFit="cover"
                                                                />
                                                            </TouchableOpacity>
                                                        );
                                                    })}
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

                                            <Text style={{ fontSize: 12, fontWeight: '300', color: '#000', marginLeft: -4 }}>{item?.likeCount === 0 ? '' : item?.likeCount?.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                    <View style={[postStyles.bookmark, postStyles.heartLayout]}>
                                        <View style={{ position: 'relative', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                            <CommentIcon style={[postStyles.icon2, { marginTop: -2 }]} />
                                            <Text style={{ fontSize: 12, fontWeight: '300', color: '#000', marginBottom: -1, marginLeft: -4 }}>{item?.comment?.length === 0 ? '' : item?.comment?.length?.toLocaleString()}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                )}
            </Animated.ScrollView>
            {/* </SafeAreaView> */}

            <TouchableOpacity onPress={() => router.push('/createPost')} style={{ position: 'absolute', bottom: 20, right: 10 }}>
                <Image source={require('@/assets/images/createPostIcon.png')} style={{ width: 90, height: 85, zIndex: 9999 }} />
            </TouchableOpacity>

            {/* 메뉴 Modal */}
            <Modal
                visible={!!selectedPostPk}
                transparent={true}
                animationType="fade"
                onRequestClose={closeMenu}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={closeMenu}
                    style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
                >
                    {menuPosition && (
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={(e) => e.stopPropagation()}
                            style={{
                                position: 'absolute',
                                left: menuPosition.x - 100,
                                top: menuPosition.y + 10,
                                backgroundColor: '#fff',
                                borderRadius: 8,
                                paddingVertical: 8,
                                paddingHorizontal: 0,
                                minWidth: 120,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                            }}
                        >
                            <TouchableOpacity
                                onPress={handleDeletePost}
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                }}
                            >
                                <Text style={{
                                    fontSize: 16,
                                    color: '#FF2D55',
                                    fontWeight: '500',
                                }}>
                                    게시물 삭제
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </Modal>

            {/* 이미지 모달 */}
            <Modal
                visible={!!selectedImageUri}
                transparent={true}
                animationType="fade"
                onRequestClose={closeImageModal}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.95)', justifyContent: 'center', alignItems: 'center' }}>
                    {(() => {
                        const backgroundPanResponder = PanResponder.create({
                            onStartShouldSetPanResponder: (evt, gestureState) => {
                                // 수평 스와이프가 시작되면 responder를 설정하지 않음
                                return false;
                            },
                            onMoveShouldSetPanResponder: (_, gestureState) => {
                                // 수직 스와이프만 감지 (아래로 스와이프), 수평 스와이프는 무시
                                if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
                                    return false; // 수평 스와이프는 ScrollView가 처리
                                }
                                return Math.abs(gestureState.dy) > 10;
                            },
                            onPanResponderTerminationRequest: () => true,
                            onPanResponderRelease: (_, gestureState) => {
                                // 수직 스와이프가 50px 이상이면 모달 닫기
                                if (Math.abs(gestureState.dy) > 50 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx)) {
                                    closeImageModal();
                                }
                            },
                        });

                        return (
                            <View style={{ flex: 1, width: '100%' }} {...backgroundPanResponder.panHandlers}>
                                <TouchableOpacity
                                    activeOpacity={1}
                                    onPress={closeImageModal}
                                    style={{ position: 'absolute', top: 50, right: 20, zIndex: 1000, padding: 10 }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>✕</Text>
                                </TouchableOpacity>
                                
                                {selectedImages.length > 1 && (
                                    <View style={{ position: 'absolute', bottom: 50, zIndex: 1000 }}>
                                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '400' }}>
                                            {selectedImageIndex + 1} / {selectedImages.length}
                                        </Text>
                                    </View>
                                )}
                                
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
                                    scrollEventThrottle={16}
                                    style={{ flex: 1, width: '100%' }}
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
                            </View>
                        );
                    })()}
                </View>
            </Modal>
        </View>
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

const tabStyles = StyleSheet.create({
    parent: {
        flex: 1
    },
    textTypo: {
        textAlign: "center",
        color: "#000",
        fontWeight: "700",
        fontSize: 15,
        // top: 0,
        // position: "absolute"
    },
    view: {
        width: "100%",
        height: 30,
        marginTop: -10
        // flex: 1
    },
    child: {
        top: 30,
        borderStyle: "solid",
        borderColor: "#b3b3b3",
        borderBottomWidth: 0.5,
        width: '100%',
        height: 0,
        position: "absolute"
    },
    text: {
        // left: 84
    },
    text2: {
        // left: 275
    },
    item: {
        top: 26,
        borderRadius: 1,
        backgroundColor: "rgba(255, 45, 85, 0.7)",
        width: 29,
        height: 4,
        position: "absolute",
        // left: 80,
        // right: 80
    }
});

// Image Wrapper Component
const ImageWrapper = ({
    postPk,
    imageUri,
    aspectRatio,
    handleImageLoad,
    onImagePress,
    allImages,
    imageIndex = 0
}: {
    postPk: number;
    imageUri: string;
    aspectRatio?: number;
    handleImageLoad: (postPk: number, event: any) => void;
    onImagePress?: (imageUri: string, allImages?: string[], initialIndex?: number) => void;
    allImages?: string[];
    imageIndex?: number;
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasLoadedRef = useRef(false);
    const isLoadStartCalledRef = useRef(false);
    const imageWidth = Dimensions.get('window').width - 103;
    const actualAspectRatio = aspectRatio || 200 / imageWidth; // 기본값
    const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
    const isDraggingRef = useRef(false);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // 이동 거리가 10px 이상이면 드래그로 간주
                return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
            },
            onPanResponderGrant: (evt) => {
                const { pageX, pageY } = evt.nativeEvent;
                touchStartRef.current = { x: pageX, y: pageY, time: Date.now() };
                isDraggingRef.current = false;
            },
            onPanResponderMove: (_, gestureState) => {
                if (touchStartRef.current) {
                    const deltaX = Math.abs(gestureState.dx);
                    const deltaY = Math.abs(gestureState.dy);
                    // 10px 이상 이동하면 드래그로 간주
                    if (deltaX > 10 || deltaY > 10) {
                        isDraggingRef.current = true;
                    }
                }
            },
            onPanResponderRelease: () => {
                if (!isDraggingRef.current && onImagePress && touchStartRef.current) {
                    // 터치 시간이 500ms 이하면 탭으로 간주
                    const touchDuration = Date.now() - touchStartRef.current.time;
                    if (touchDuration < 500) {
                        // 약간의 딜레이를 주어 모달이 완전히 닫힌 후에만 열리도록 함
                        setTimeout(() => {
                            onImagePress(imageUri, allImages, imageIndex);
                        }, 100);
                    }
                }
                touchStartRef.current = null;
                isDraggingRef.current = false;
            },
        })
    ).current;

    // imageUri가 변경될 때만 리셋
    useEffect(() => {
        hasLoadedRef.current = false;
        isLoadStartCalledRef.current = false;
        setIsLoading(true);

        // 타임아웃 설정
        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
        }
        loadTimeoutRef.current = setTimeout(() => {
            if (!hasLoadedRef.current) {
                setIsLoading(false);
            }
        }, 10000);

        return () => {
            if (loadTimeoutRef.current) {
                clearTimeout(loadTimeoutRef.current);
            }
        };
    }, [imageUri]);

    const handleLoadStart = () => {
        // 이미 호출되었거나 로드 완료되었으면 무시
        if (isLoadStartCalledRef.current || hasLoadedRef.current) {
            return;
        }

        console.log('onLoadStart called for postPk:', postPk);
        isLoadStartCalledRef.current = true;
        setIsLoading(true);

        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
        }
        // 타임아웃 재설정
        loadTimeoutRef.current = setTimeout(() => {
            if (!hasLoadedRef.current) {
                setIsLoading(false);
            }
        }, 10000);
    };

    const handleLoad = (event: any) => {
        // 이미 로드 완료되었으면 무시
        if (hasLoadedRef.current) {
            return;
        }

        console.log('onLoad called for postPk:', postPk, 'event:', event);
        hasLoadedRef.current = true;
        setIsLoading(false);

        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
        }
        handleImageLoad(postPk, event);
    };

    const handleError = (error: any) => {
        console.log('Image load error:', error);
        hasLoadedRef.current = true;
        setIsLoading(false);

        if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
        }
    };

    return (
        <View style={{ position: 'relative' }} {...panResponder.panHandlers}>
            {isLoading && (
                <View style={{
                    position: 'absolute',
                    top: 9,
                    left: 0,
                    width: imageWidth,
                    height: imageWidth * actualAspectRatio,
                    borderRadius: 10,
                    backgroundColor: '#f0f0f0',
                    zIndex: 1,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ActivityIndicator size="small" color="#999" />
                </View>
            )}
            <Image
                source={{ uri: imageUri }}
                style={{
                    width: imageWidth,
                    height: aspectRatio ? imageWidth * aspectRatio : 200,
                    borderRadius: 10,
                    marginTop: 9,
                    opacity: isLoading ? 0 : 1
                }}
                contentFit="cover"
                onLoadStart={handleLoadStart}
                onLoad={handleLoad}
                onError={handleError}
            />
        </View>
    );
};

// Post Skeleton Component
const PostSkeleton = () => {
    const shimmerAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnimation, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const opacity = shimmerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <View style={{ width: '100%', position: 'relative', borderColor: "#b3b3b3", borderBottomWidth: 0.5, paddingTop: 10, paddingLeft: 21, paddingRight: 13, flexDirection: 'row', gap: 13, paddingBottom: 10 }}>
            <View style={{ width: 45 }}>
                <Animated.View style={{
                    width: 45,
                    height: 45,
                    borderRadius: 100,
                    backgroundColor: '#e0e0e0',
                    opacity
                }} />
            </View>
            <View style={{ width: '100%', flex: 1 }}>
                <Animated.View style={{
                    width: 80,
                    height: 18,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 4,
                    marginBottom: 8,
                    opacity
                }} />
                <Animated.View style={{
                    width: '100%',
                    height: 16,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 4,
                    marginBottom: 4,
                    opacity
                }} />
                <Animated.View style={{
                    width: '70%',
                    height: 16,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 4,
                    marginBottom: 9,
                    opacity
                }} />
                <Animated.View style={{
                    width: Dimensions.get('window').width - 103,
                    height: 200,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 10,
                    marginTop: 9,
                    opacity
                }} />
                <View style={{ flexDirection: 'row', marginTop: 13, gap: 20 }}>
                    <Animated.View style={{
                        width: 40,
                        height: 16,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 4,
                        opacity
                    }} />
                    <Animated.View style={{
                        width: 40,
                        height: 16,
                        backgroundColor: '#e0e0e0',
                        borderRadius: 4,
                        opacity
                    }} />
                </View>
            </View>
        </View>
    );
};

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
        height: 50,
        position: 'relative',
        backgroundColor: '#FFF'
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