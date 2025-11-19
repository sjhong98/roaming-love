const UserDummy = [
    {
        id: 1,
        nickname: '제니퍼',
        introduction: '안녕하세요! 저는 제니퍼입니다.',
        favorite: '#연애취향',
        loveType: '자유로운 유희형',
        tripType: '늘보 베짱이',
        image: require('@/assets/images/user/jennifer.png'),
        follow: 'Follow',
        backgroundColor: '#ffd8e4',
        description: `11월 10일 - 25일 \n동행구해요!\n일본 가고싶습니다.`,
        favoriteLocation: ['도쿄', '오사카', '후쿠오카', '교토', '삿포로', '오키나와'],
        date: {
            startDate: new Date('2025-11-10'),
            endDate: new Date('2025-11-25'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 제니퍼입니다.',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: '오늘은 어떤 일이 있었나요?',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: '오늘은 공원으로 피크닉을 다녀왔어요!',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
            {
                text: '좋았겠네요!',
                time: '2025-11-14 12:03:00',
                isUser: true
            }
        ],
        period: ['weekend', '1week+'],
        month: ['2025/11', '2025/12', '2026/01', '2026/02', '2026/03', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 2,
        nickname: '브루노',
        introduction: '브루노입니다. 좋은 하루 보내세요.',
        favorite: '#연애취향',
        loveType: '안정적인 동반자',
        tripType: '모험 유랑가',
        image: require('@/assets/images/user/bruno.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 23일 - 27일 \n동행구해요!\n미주 여행 가고싶습니다.`,
        favoriteLocation: ['도쿄', '런던', '오클랜드', '교토', '뉴욕', '오키나와'],
        date: {
            startDate: new Date('2025-11-23'),
            endDate: new Date('2025-11-27'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 홍승재입니다.',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: 'I am fine, thank you!',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: 'What are you doing?',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
            {
                text: 'I am doing nothing, you?',
                time: '2025-11-14 12:03:00',
                isUser: true
            }
        ],
        period: ['weekend', '1week+'],
        month: ['2025/11', '2025/12', '2026/01', '2026/02', '2026/03', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 3,
        nickname: '루카스',
        introduction: '제 이름은 루카스 입니다.',
        favorite: '#연애취향',
        loveType: '열정적인 몰입형',
        tripType: '여행 만학도',
        image: require('@/assets/images/user/lucas.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 23일 - 25일 (2박 3일)\n동행구해요!\n동남아시아 가고싶습니다.`,
        favoriteLocation: ['냐짱', '오사카', '하노이', '세부', '방콕', '치앙마이'],
        date: {
            startDate: new Date('2025-11-23'),
            endDate: new Date('2025-11-25'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 루카스입니다.',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: '안녕하세요! 어디에서 오셨나요?',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: '저는 오스트리아에서 왔어요.',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
        ],
        period: ['2days', '3days', '4days', '5days'],
        month: ['2025/11', '2025/12', '2026/01', '2026/02', '2026/03'],
    },
    {
        id: 4,
        nickname: '프란츠',
        introduction: '여행 같이 가요~',
        favorite: '#연애취향',
        loveType: '핫플레이더',
        tripType: '공감중심 밀착형',
        image: require('@/assets/images/user/franz.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 23일 - 25일 (2박 3일)\n동행구해요!\n미국, 캐나다 가고싶습니다.`,
                favoriteLocation: ['도쿄', '뉴욕', '토론토', '벤쿠버', '로스엔젤레스', '런던'],
        date: {
            startDate: new Date('2025-11-23'),
            endDate: new Date('2025-12-25'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 프란츠입니다.',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: '안녕하세요! 어디에서 오셨나요?',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: '저는 오스트리아에서 왔어요.',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
        ],
        period: ['2days', '3days', '4days', '5days'],
        month: ['2025/11', '2025/12', '2026/01', '2026/02', '2026/03'],
    },
    {
        id: 5,
        nickname: '알렉스',
        introduction: '알렉스입니다. 좋은 하루 보내세요.',
        favorite: '#연애취향',
        loveType: '독립 보장형',
        tripType: '가성비로거',
        image: require('@/assets/images/user/alex.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 23일 - 25일 (2박 3일)\n동행구해요!\n오세아니아 여행 가고싶습니다.`,
        favoriteLocation: ['골드코스트', '뉴질랜드', '브리즈번', '멜버른', '오클랜드', '시드니'],
        date: {
            startDate: new Date('2025-11-23'),
            endDate: new Date('2025-12-25'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 고정한입니다.',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: 'I am fine, thank you!',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: 'What are you doing?',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
            {
                text: 'I am doing nothing, you?',
                time: '2025-11-14 12:03:00',
                isUser: true
            }
        ],
        period: ['2days', '3days', '4days', '5days'],
        month: ['2025/11', '2025/12', '2026/01', '2026/02', '2026/03'],
    },

    {
        id: 6,
        nickname: '이병건',
        introduction: '이병건입니다.',
        favorite: '#연애취향',
        loveType: '자유로운 유희형',
        tripType: '가성비로거',
        image: require('@/assets/images/user/lee.png'),
        follow: 'Follow',
        backgroundColor: '#ffd8e4',
        description: `11월 23일 - 25일 (2박 3일)\n동행구해요!\n오세아니아 여행 가고싶습니다.`,
        favoriteLocation: ['오클랜드', '오사카', '골드코스트', '교토', '브리즈번', '오키나와'],
        date: {
            startDate: new Date('2025-11-23'),
            endDate: new Date('2025-12-25'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 곽다빈입니다.',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: 'I am fine, thank you!',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: 'What are you doing?',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
            {
                text: 'I am doing nothing, you?',
                time: '2025-11-14 12:03:00',
                isUser: true
            }
        ],
        period: ['2days', '3days', 'weekend', '1week+'],
        month: ['2026/01', '2026/02', '2026/03', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 7,
        nickname: '손흥민',
        introduction: '안녕하세요 손흥민입니다.',
        favorite: '#연애취향',
        loveType: '안정적인 동반자',
        tripType: '핫플레이더',
        image: require('@/assets/images/user/son.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 23일 - 25일 (2박 3일)\n동행구해요!\n런던 가고싶습니다.`,
        favoriteLocation: ['다낭', '오사카', '후쿠오카', '교토', '라스베이거스', '런던'],
        date: {
            startDate: new Date('2025-11-23'),
            endDate: new Date('2025-11-25'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 천승호입니다.',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: 'I am fine, thank you!',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: 'What are you doing?',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
            {
                text: 'I am doing nothing, you?',
                time: '2025-11-14 12:03:00',
                isUser: true
            }
        ],
        period: ['2days', '3days', 'weekend', '1week+'],
        month: ['2026/01', '2026/02', '2026/03', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 8,
        nickname: '조이',
        introduction: '조이에요! 좋은 하루 보내세요.',
        favorite: '#연애취향',
        loveType: '열정적인 몰입형',
        tripType: '늘보 베짱이',
        image: require('@/assets/images/user/joy.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 23일 - 25일 (2박 3일)\n동행구해요!\n일본, 동남아시아 가고싶습니다.`,
        favoriteLocation: ['세부', '하노이', '방콕', '호이안', '삿포로', '오키나와'],
        date: {
            startDate: new Date('2025-11-23'),
            endDate: new Date('2025-11-25'),
        },
        message: [
            {
                text: '안녕하세요!',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: '안녕하세요! 어디로 여행가고 싶으신가요?',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: '저는 일본이나 동남아시아 가고 싶어요!',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
            {
                text: '저두요!',
                time: '2025-11-14 12:03:00',
                isUser: true
            }
        ],
        period: ['2days', '3days', 'weekend', '1week+'],
        month: ['2026/01', '2026/02', '2026/03', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 9,
        nickname: '엘리스',
        introduction: '엘리스입니다. 좋은 하루 보내세요.',
        favorite: '#연애취향',
        loveType: '핫플레이더',
        tripType: '여행 만학도',
        image: require('@/assets/images/user/elice.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 23일 - 25일 (2박 3일)\n동행구해요!\n일본 가고싶습니다.`,
        favoriteLocation: ['로스엔젤레스', '멜버른', '교토', '오키나와', '호이안', '오키나와'],
        date: {
            startDate: new Date('2025-11-10'),
            endDate: new Date('2025-12-14'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 홍가원입니다.',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: 'I am fine, thank you!',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: 'What are you doing?',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
            {
                text: 'I am doing nothing, you?',
                time: '2025-11-14 12:03:00',
                isUser: true
            }
        ],
        period: ['2days', '3days', 'weekend', '1week+'],
        month: ['2026/01', '2026/02', '2026/03', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 10,
        nickname: '줄리아',
        introduction: '줄리아입니다. 좋은 하루 보내세요.',
        favorite: '#연애취향',
        loveType: '독립 보장형',
        tripType: '모험 유랑가',
        image: require('@/assets/images/user/julia.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 23일 - 25일 (2박 3일)\n동행구해요!\n오세아니아나 동남아시아 여행 가고싶습니다.`,
        favoriteLocation: ['시드니', '하노이', '치앙마이', '냐짱', '삿포로', '브리즈번'],
        date: {
            startDate: new Date('2025-12-01'),
            endDate: new Date('2025-12-23'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 줄리아에요.',
                time: '2025-11-14 12:00:00',
                isUser: false
            },
            {
                text: '안녕하세요! 저랑 여행가실래요?',
                time: '2025-11-14 12:01:00',
                isUser: true
            },
            {
                text: '좋아요!',
                time: '2025-11-14 12:02:00',
                isUser: false
            },
        ],
        period: ['2days', '3days', 'weekend', '1week+'],
        month: ['2026/01', '2026/02', '2026/03', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 11,
        nickname: '마리아',
        introduction: '마리아입니다. 함께 여행해요!',
        favorite: '#연애취향',
        loveType: '자유로운 유희형',
        tripType: '모험 유랑가',
        image: require('@/assets/images/user/maria.png'),
        follow: 'Follow',
        backgroundColor: '#ffd8e4',
        description: `12월 1일 - 5일 (4박 5일)\n동행구해요!\n유럽 여행 함께 가요.`,
        favoriteLocation: ['파리', '로마', '바르셀로나', '아테네', '리스본', '암스테르담'],
        date: {
            startDate: new Date('2025-12-01'),
            endDate: new Date('2025-12-05'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 박민수입니다.',
                time: '2025-11-15 10:00:00',
                isUser: false
            },
            {
                text: 'Hello! Nice to meet you.',
                time: '2025-11-15 10:01:00',
                isUser: true
            }
        ],
        period: ['4days', '5days', 'weekend'],
        month: ['2025/12', '2026/01', '2026/02', '2026/03'],
    },
    {
        id: 12,
        nickname: '다니엘',
        introduction: '다니엘이에요. 여행 좋아해요!',
        favorite: '#연애취향',
        loveType: '자유로운 유희형',
        tripType: '여행 만학도',
        image: require('@/assets/images/user/daniel.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `1월 10일 - 15일 (5박 6일)\n동행구해요!\n동남아 여행 가요.`,
        favoriteLocation: ['방콕', '치앙마이', '푸켓', '발리', '세부', '보라카이'],
        date: {
            startDate: new Date('2026-01-10'),
            endDate: new Date('2026-01-15'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 최지영입니다.',
                time: '2025-11-16 14:00:00',
                isUser: false
            },
            {
                text: 'Hi there!',
                time: '2025-11-16 14:01:00',
                isUser: true
            }
        ],
        period: ['5days', '1week+'],
        month: ['2026/01', '2026/02', '2026/03'],
    },
    {
        id: 13,
        nickname: '소피아',
        introduction: '소피아입니다. 새로운 곳을 탐험하는 걸 좋아해요.',
        favorite: '#연애취향',
        loveType: '자유로운 유희형',
        tripType: '공감중심 밀착형',
        image: require('@/assets/images/user/sophia.png'),
        follow: 'Follow',
        backgroundColor: '#ffd8e4',
        description: `2월 14일 - 18일 (4박 5일)\n동행구해요!\n발렌타인데이 특별 여행!`,
        favoriteLocation: ['도쿄', '오사카', '후쿠오카', '교토', '삿포로', '오키나와'],
        date: {
            startDate: new Date('2025-02-14'),
            endDate: new Date('2026-02-18'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 이수진입니다.',
                time: '2025-11-17 09:00:00',
                isUser: false
            },
            {
                text: 'Nice to meet you!',
                time: '2025-11-17 09:01:00',
                isUser: true
            }
        ],
        period: ['4days', '5days'],
        month: ['2025/02', '2025/03', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 14,
        nickname: '홀란드',
        introduction: '홀란드입니다. 모험을 즐겨요!',
        favorite: '#연애취향',
        loveType: '안정적인 동반자',
        tripType: '늘보 베짱이',
        image: require('@/assets/images/user/halland.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `3월 1일 - 3일 (2박 3일)\n동행구해요!\n주말 여행 가요.`,
        favoriteLocation: ['부산', '제주', '강릉', '전주', '여수', '경주'],
        date: {
            startDate: new Date('2025-03-01'),
            endDate: new Date('2026-03-03'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 정태호입니다.',
                time: '2025-11-18 11:00:00',
                isUser: false
            },
            {
                text: 'Hello!',
                time: '2025-11-18 11:01:00',
                isUser: true
            }
        ],
        period: ['weekend', '2days', '3days'],
        month: ['2025/03', '2025/04', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 15,
        nickname: '에밀리',
        introduction: '에밀리예요. 여행을 통해 배우는 걸 좋아해요.',
        favorite: '#연애취향',
        loveType: '안정적인 동반자',
        tripType: '여행 만학도',
        image: require('@/assets/images/user/emily.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `3월 15일 - 20일 (5박 6일)\n동행구해요!\n문화 탐방 여행.`,
        favoriteLocation: ['교토', '나라', '가마쿠라', '히로시마', '오사카', '도쿄'],
        date: {
            startDate: new Date('2025-03-15'),
            endDate: new Date('2026-03-20'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 강미영입니다.',
                time: '2025-11-19 15:00:00',
                isUser: false
            },
            {
                text: 'Hi!',
                time: '2025-11-19 15:01:00',
                isUser: true
            }
        ],
        period: ['5days', '1week+'],
        month: ['2025/03', '2025/04', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 16,
        nickname: '아구에로',
        introduction: '아구에로입니다. 편안한 여행을 선호해요.',
        favorite: '#연애취향',
        loveType: '안정적인 동반자',
        tripType: '공감중심 밀착형',
        image: require('@/assets/images/user/aguero.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `4월 1일 - 5일 (4박 5일)\n동행구해요!\n봄 여행 가요.`,
        favoriteLocation: ['제주', '부산', '강릉', '여수', '전주', '경주'],
        date: {
            startDate: new Date('2025-04-01'),
            endDate: new Date('2026-04-05'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 송지훈입니다.',
                time: '2025-11-20 16:00:00',
                isUser: false
            },
            {
                text: 'Nice to meet you!',
                time: '2025-11-20 16:01:00',
                isUser: true
            }
        ],
        period: ['4days', '5days'],
        month: ['2025/04', '2025/05', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 17,
        nickname: '올리비아',
        introduction: '올리비아입니다. 가성비 좋은 여행을 추구해요.',
        favorite: '#연애취향',
        loveType: '안정적인 동반자',
        tripType: '가성비로거',
        image: require('@/assets/images/user/olivia.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `5월 1일 - 7일 (6박 7일)\n동행구해요!\n가성비 여행!`,
        favoriteLocation: ['다낭', '하노이', '호이안', '세부', '방콕', '치앙마이'],
        date: {
            startDate: new Date('2025-05-01'),
            endDate: new Date('2026-05-07'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 한지원입니다.',
                time: '2025-11-21 10:00:00',
                isUser: false
            },
            {
                text: 'Hello!',
                time: '2025-11-21 10:01:00',
                isUser: true
            }
        ],
        period: ['1week+'],
        month: ['2025/05', '2025/06', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 18,
        nickname: '루이스',
        introduction: '루이스입니다. 열정적으로 여행해요!',
        favorite: '#연애취향',
        loveType: '열정적인 몰입형',
        tripType: '모험 유랑가',
        image: require('@/assets/images/user/lewis.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `6월 1일 - 10일 (9박 10일)\n동행구해요!\n대장정 여행!`,
        favoriteLocation: ['뉴욕', '로스엔젤레스', '시카고', '마이애미', '라스베이거스', '샌프란시스코'],
        date: {
            startDate: new Date('2025-06-01'),
            endDate: new Date('2025-06-10'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 김도현입니다.',
                time: '2025-11-22 12:00:00',
                isUser: false
            },
            {
                text: 'Hi there!',
                time: '2025-11-22 12:01:00',
                isUser: true
            }
        ],
        period: ['1week+'],
        month: ['2025/06', '2025/07', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 19,
        nickname: '샬롯',
        introduction: '샬롯이에요. 공감하며 여행하는 걸 좋아해요.',
        favorite: '#연애취향',
        loveType: '열정적인 몰입형',
        tripType: '공감중심 밀착형',
        image: require('@/assets/images/user/charlotte.png'),
        follow: 'Follow',
        backgroundColor: '#ffd8e4',
        description: `7월 1일 - 5일 (4박 5일)\n동행구해요!\n여름 휴가 여행.`,
        favoriteLocation: ['오키나와', '세부', '보라카이', '푸켓', '발리', '코타키나발루'],
        date: {
            startDate: new Date('2025-07-01'),
            endDate: new Date('2025-07-05'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 이현우입니다.',
                time: '2025-11-23 13:00:00',
                isUser: false
            },
            {
                text: 'Nice to meet you!',
                time: '2025-11-23 13:01:00',
                isUser: true
            }
        ],
        period: ['4days', '5days'],
        month: ['2025/07', '2025/08', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 20,
        nickname: '노엘',
        introduction: '노엘입니다. 가성비 좋은 여행을 찾아요.',
        favorite: '#연애취향',
        loveType: '열정적인 몰입형',
        tripType: '가성비로거',
        image: require('@/assets/images/user/noel.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `8월 1일 - 8일 (7박 8일)\n동행구해요!\n가성비 최고 여행!`,
        favoriteLocation: ['다낭', '하노이', '호이안', '세부', '방콕', '치앙마이'],
        date: {
            startDate: new Date('2025-08-01'),
            endDate: new Date('2026-08-08'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 박서연입니다.',
                time: '2025-11-24 14:00:00',
                isUser: false
            },
            {
                text: 'Hello!',
                time: '2025-11-24 14:01:00',
                isUser: true
            }
        ],
        period: ['1week+'],
        month: ['2025/08', '2025/09', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 21,
        nickname: '이사벨',
        introduction: '이사벨입니다. 핫플레이스를 좋아해요!',
        favorite: '#연애취향',
        loveType: '핫플레이더',
        tripType: '늘보 베짱이',
        image: require('@/assets/images/user/isabel.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `9월 1일 - 3일 (2박 3일)\n동행구해요!\n핫플레이스 탐방!`,
        favoriteLocation: ['도쿄', '오사카', '서울', '부산', '제주', '강릉'],
        date: {
            startDate: new Date('2025-09-01'),
            endDate: new Date('2026-09-03'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 최민석입니다.',
                time: '2025-11-25 15:00:00',
                isUser: false
            },
            {
                text: 'Hi!',
                time: '2025-11-25 15:01:00',
                isUser: true
            }
        ],
        period: ['weekend', '2days', '3days'],
        month: ['2026/09', '2026/10'],
    },
    {
        id: 22,
        nickname: '크리스',
        introduction: '크리스입니다. 모험을 즐겨요!',
        favorite: '#연애취향',
        loveType: '핫플레이더',
        tripType: '모험 유랑가',
        image: require('@/assets/images/user/chris.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `10월 1일 - 7일 (6박 7일)\n동행구해요!\n가을 모험 여행!`,
        favoriteLocation: ['뉴질랜드', '오클랜드', '퀸스타운', '크라이스트처치', '웰링턴', '로토루아'],
        date: {
            startDate: new Date('2025-10-01'),
            endDate: new Date('2026-10-07'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 윤서아입니다.',
                time: '2025-11-26 16:00:00',
                isUser: false
            },
            {
                text: 'Nice to meet you!',
                time: '2025-11-26 16:01:00',
                isUser: true
            }
        ],
        period: ['1week+', '6days', '7days'],
        month: ['2025/10', '2025/11', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 23,
        nickname: '그레이스',
        introduction: '그레이스예요. 공감하며 여행하는 걸 좋아해요.',
        favorite: '#연애취향',
        loveType: '핫플레이더',
        tripType: '공감중심 밀착형',
        image: require('@/assets/images/user/grace.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 1일 - 5일 (4박 5일)\n동행구해요!\n가을 여행 가요.`,
        favoriteLocation: ['교토', '도쿄', '오사카', '후쿠오카', '삿포로', '오키나와'],
        date: {
            startDate: new Date('2026-02-01'),
            endDate: new Date('2026-11-05'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 장우진입니다.',
                time: '2025-11-27 10:00:00',
                isUser: false
            },
            {
                text: 'Hello!',
                time: '2025-11-27 10:01:00',
                isUser: true
            }
        ],
        period: ['4days', '5days'],
        month: ['2026/11', '2026/12'],
    },
    {
        id: 24,
        nickname: '리암',
        introduction: '리암입니다. 가성비 좋은 여행을 찾아요.',
        favorite: '#연애취향',
        loveType: '핫플레이더',
        tripType: '가성비로거',
        image: require('@/assets/images/user/liam.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 1일 - 12월 8일 \n동행구해요!\n겨울 가성비 여행!`,
        favoriteLocation: ['다낭', '하노이', '호이안', '세부', '방콕', '치앙마이'],
        date: {
            startDate: new Date('2025-12-01'),
            endDate: new Date('2026-01-08'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 김나은입니다.',
                time: '2025-11-28 11:00:00',
                isUser: false
            },
            {
                text: 'Hi there!',
                time: '2025-11-28 11:01:00',
                isUser: true
            }
        ],
        period: ['1week+'],
        month: ['2025/11', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 25,
        nickname: '아멜리아',
        introduction: '아멜리아입니다. 독립적으로 여행하는 걸 좋아해요.',
        favorite: '#연애취향',
        loveType: '독립 보장형',
        tripType: '늘보 베짱이',
        image: require('@/assets/images/user/amelia.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 1일 - 12월 3일 \n동행구해요!\n신년 여행!`,
        favoriteLocation: ['제주', '부산', '강릉', '여수', '전주', '경주'],
        date: {
            startDate: new Date('2026-01-01'),
            endDate: new Date('2027-01-03'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 이준호입니다.',
                time: '2025-11-29 12:00:00',
                isUser: false
            },
            {
                text: 'Nice to meet you!',
                time: '2025-11-29 12:01:00',
                isUser: true
            }
        ],
        period: ['weekend', '2days', '3days'],
        month: ['2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 26,
        nickname: '페르난도',
        introduction: '페르난도입니다. 여행을 통해 배우는 걸 좋아해요.',
        favorite: '#연애취향',
        loveType: '독립 보장형',
        tripType: '여행 만학도',
        image: require('@/assets/images/user/fernando.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 1일 - 12월 7일 \n동행구해요!\n문화 탐방 여행.`,
        favoriteLocation: ['교토', '나라', '가마쿠라', '히로시마', '오사카', '도쿄'],
        date: {
            startDate: new Date('2025-11-01'),
            endDate: new Date('2025-12-07'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 박지은입니다.',
                time: '2025-11-30 13:00:00',
                isUser: false
            },
            {
                text: 'Hello!',
                time: '2025-11-30 13:01:00',
                isUser: true
            }
        ],
        period: ['1week+'],
        month: ['2025/11', '2025/12', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 27,
        nickname: '말포이',
        introduction: '말포이예요. 공감하며 여행하는 걸 좋아해요.',
        favorite: '#연애취향',
        loveType: '독립 보장형',
        tripType: '공감중심 밀착형',
        image: require('@/assets/images/user/malfoy.png'),
        follow: 'Follow',
        backgroundColor: '#ffd8e4',
        description: `11월 1일 - 12월 5일 \n동행구해요!\n봄 여행 가요.`,
        favoriteLocation: ['도쿄', '오사카', '후쿠오카', '교토', '삿포로', '오키나와'],
        date: {
            startDate: new Date('2025-11-01'),
            endDate: new Date('2025-12-05'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 최동현입니다.',
                time: '2025-12-01 14:00:00',
                isUser: false
            },
            {
                text: 'Hi!',
                time: '2025-12-01 14:01:00',
                isUser: true
            }
        ],
        period: ['4days', '5days'],
        month: ['2025/11', '2025/12', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
    {
        id: 28,
        nickname: '해리',
        introduction: '해리입니다. 가성비 좋은 여행을 추구해요.',
        favorite: '#연애취향',
        loveType: '독립 보장형',
        tripType: '가성비로거',
        image: require('@/assets/images/user/harry.png'),
        follow: 'Follow',
        backgroundColor: '#C9FFF5',
        description: `11월 1일 - 12월 8일 \n동행구해요!\n가성비 최고 여행!`,
        favoriteLocation: ['도쿄', '하노이', '호이안', '세부', '방콕', '치앙마이'],
        date: {
            startDate: new Date('2025-11-01'),
            endDate: new Date('2025-12-08'),
        },
        message: [
            {
                text: '안녕하세요, 제 이름은 한소희입니다.',
                time: '2025-12-02 15:00:00',
                isUser: false
            },
            {
                text: 'Nice to meet you!',
                time: '2025-12-02 15:01:00',
                isUser: true
            }
        ],
        period: ['1week+'],
        month: ['2025/11', '2025/12', '2026/01', '2026/02', '2026/03', '2026/04', '2026/05', '2026/06', '2026/07', '2026/08', '2026/09', '2026/10', '2026/11', '2026/12'],
    },
]

export default UserDummy;