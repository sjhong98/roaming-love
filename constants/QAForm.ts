export interface QAFormType {
  testDescription: string;
  testImage: any;
  resultTypes: ResultType;
  chapters: Chapter[]
}

export interface Chapter {
  chapter: number;
  chapterDescription: string;
  chapterImage: any;
  imageWidth: number;
  imageHeight: number;
  questions: Question[]
}

export interface Question {
  questionId: string;
  question: string;
  minSelect: number;
  maxSelect: number | null;
  answers: QAFormAnswerType[];
}

export interface QAFormAnswerType {
  answer: string;
  type: string;
  score: number;
  selected: boolean | null;
}

export interface ResultType {
  [key: string]: { 
    score: number,
    color: string,
    keyword: string[]
    description: string
    recommend: string[]
    avoid: string[]
  };
}

export const Test1QAForm: QAFormType = {
  testDescription: 'Test 1',
  testImage: require('@/assets/images/test1_1.png'),
  resultTypes: {
    '아이코닉 포토': { 
      score: 0,
      color: '#FF2D55',
      keyword: ['랜드마크', '야경', '포토', '효율동선'],
      description: '당신은 ‘완성도 있는 기록’에서 큰 만족을 느끼는 유형이에요. 동선을 효율적으로 잡아 대표 스폿을 놓치지 않고, 빛·구도·타이밍을 챙기는 꼼꼼함이 있어요. 이동과 대기보다 사진 결과물이 중요하고, 일정의 리듬을 스스로 주도할 때 컨디션이 좋아집니다. 팀 안에서는 길잡이·포토 디렉터 역할을 맡으면 강점을 발휘해요.\n좋아하는 여행 랜드마크·전망대·스카이라인이 있는 도시, 해가 바뀌는 시간대(황금빛 석양·네온 야경) 중심의 루트가 잘 맞습니다. “핵심 2개 예약 + 여유 1블록” 구조로 촬영 포인트를 확실히 확보하고, 이동은 택시·직항·우선탑승 등으로 컨디션을 지키면 좋아요. 카페는 시그니처 메뉴가 있고 포토 스폿이 분명한 곳이 만족도를 올립니다.\n피하면 좋은 여행 하루에 스폿을 다섯 개 이상 ‘찍고 가는’ 과밀 루틴, 긴 웨이팅을 여러 번 연속 배치하는 일정은 피로 대비 성취가 낮습니다. 실내 위주로만 이어지는 전시 투어나 무계획 이동도 집중력을 떨어뜨려요.',
      recommend: [
        '전망대→랜드마크→시그니처 카페(낮/석양 중 2타임)',
        '핵심 2개 예약 + 여유 1블록',
        '택시/직항/우선탑승으로 컨디션 관리'
      ],
      avoid: [
        '긴 웨이팅 연속, 과밀 체크리스트',
        '실내 투어만 연속 배치'
      ]
    },
    '하이브리드형': {
      score: 0,
      color: '#A78BFA',
      keyword: ['균형', '유연', '핵심예약', '여유블록'],
      description: '당신은 두 축 이상에서 균형이 높은 ‘조율형’이에요. 핵심 몇 가지는 확실히 정하되, 현지 상황에 맞춰 유연하게 바꾸는 운영을 잘합니다. 팀 내에서 역할을 나누고 의견을 수렴하는 능력이 좋아 갈등을 최소화해요. 무엇을 하느냐 못지않게 어떻게 하느냐(리듬·컨디션)를 중시합니다.\n좋아하는 여행 “핵심 예약 2개 + 여유 블록 2개” 구조가 베스트입니다. 오전에는 고정 일정, 오후에는 현지의 우연을 받아들이고, 이동은 40–60분 단위로 끊어 피로를 관리하세요. 전시·포토·로컬·자연 중 그날 컨디션에 맞게 비율을 조절하면 만족도가 높습니다.\n피하면 좋은 여행 분 단위로 쪼개진 과계획이나, 아무 준비 없는 완전 즉흥은 모두 리스크가 큽니다. 장거리 이동을 연속 배치하거나 예약만 과도하게 넣으면 유연함이 사라지고 즐거움이 줄어요.',
      recommend: [
        '핵심 예약 2개 + 여유 블록 2개',
        '오전 고정 일정 + 오후 유연 조정',
        '이동 40–60분 단위로 끊어 피로 관리'
      ],
      avoid: [
        '분 단위 과계획',
        '완전 무계획·장거리 연속 이동'
      ]
    },
    '힐링산책가': {
      score: 0,
      color: '#22C55E',
      keyword: ['골목', '시장', '카페', '머묾'],
      description: '당신은 생활 리듬을 느끼며 머무는 시간에서 행복을 찾는 유형이에요. 골목·시장·동네 카페 같은 작은 스폿을 천천히 연결하고, 우연히 발견한 장소에 오래 머무는 여유가 있어요. 기록은 가볍게, 대화와 관찰이 중심이며 ‘과정 자체’를 즐길 줄 압니다.\n좋아하는 여행 15–20분 소도보 루프(시장→카페→공원/강변)처럼 이동 자체가 즐거운 동선을 선호해요. 숙소는 산책권에 볼거리와 식당이 밀집한 곳이 좋고, 점심은 로컬 정식, 오후에는 노을 산책과 가벼운 디저트를 배치하면 만족도가 높습니다. 일정은 느슨하게 시작해 현지의 우연을 받아들이는 구성이 좋아요.\n피하면 좋은 여행 환승이 잦은 광역 이동, 시간표대로 움직이는 단체 투어, 대형 쇼핑몰 위주 루틴은 관찰과 머묾의 즐거움을 희석시킵니다. 촉박한 체크리스트식 일정도 피로만 남길 수 있어요.',
      recommend: [
        '소도보 루프(시장→카페→공원/강변 15–20분)',
        '로컬 정식 점심 + 노을 산책',
        '뷰 좋은 숙소 베이스, 느슨한 일정'
      ],
      avoid: [
        '광역 환승/단체 투어',
        '대형 쇼핑몰 위주, 촉박 체크리스트'
      ]
    },
    '자연액티브': {
      score: 0,
      color: '#06B6D4',
      keyword: ['하이킹', '해변', '전망', '체험'],
      description: '당신은 몸을 쓰며 얻는 성취감과 야외의 변화무쌍한 풍경에서 에너지를 받는 유형이에요. 하이킹·해변·전망 드라이브·수상 액티비티 등 바깥 활동이 메인이며, 도전–회복의 리듬을 스스로 조절할 때 컨디션이 가장 좋습니다. 안전·장비·영양 관리에 민감할수록 몰입이 길어져요.\n좋아하는 여행 일출·일몰 뷰포인트 1–2개와 하이킹·카약·서핑 같은 액티비티를 묶어 하루를 설계하세요. 날씨 플랜 A/B, 물·간식·복장 체크, 이동은 시간 절약 위주로 잡으면 퍼포먼스가 안정됩니다. 숙소는 샤워·세탁·보관이 편한 곳이 효율적이고, 회복을 위한 온천·스파·브런치를 중간중간 넣으면 좋아요.\n피하면 좋은 여행 종일 실내·웨이팅 중심의 루틴, 무계획 강행, 회복 블록 없이 액티비티만 연속 배치하는 일정은 부상·번아웃 위험이 큽니다. 과도한 장거리 환승도 에너지 누수를 일으켜요.',
      recommend: [
        '일출/일몰 포인트 + 하이킹/카약/서핑',
        '날씨 플랜 A/B + 장비·수분 루틴 내장',
        '시간 절약 이동 + 회복 블록(스파/브런치)'
      ],
      avoid: [
        '종일 실내·웨이팅 루틴',
        '회복 없이 액티비티 연속, 무계획 강행'
      ]
    },
    '전시감상가': {
      score: 0,
      color: '#F59E0B',
      keyword: ['뮤지엄', '건축', '해설', '여운'],
      description: '당신은 이야기가 있는 콘텐츠를 깊이 있게 감상하는 유형이에요. 박물관·미술관·건축·역사 공간을 주제별로 큐레이션하고, 해설·오디오가이드·도슨트를 통해 맥락을 연결할 때 만족도가 올라갑니다. 날씨나 변수에 흔들리지 않는 실내 대체 플랜을 잘 쓰고, 여운을 정리하는 조용한 시간도 중요하게 여깁니다.\n좋아하는 여행 뮤지엄 패스나 타임슬롯을 미리 확보해 하루 1–2개의 전시에 몰입하고, 건축 산책·북카페·아카이브 같은 정적 공간을 곁들인 루트가 잘 맞습니다. 숙소는 조용하고 컨디션 관리가 쉬운 곳이 좋아요. 점심은 전시장 근처의 비스트로나 카페로 이동을 짧게 가져가면 리듬이 안정됩니다.\n피하면 좋은 여행 설명이나 맥락 없이 ‘인증샷’만 남기는 코스, 소음·혼잡이 심한 핫플을 연속으로 도는 일정은 감상 밀도를 떨어뜨립니다. 장거리 도보·환승이 많은 광역 이동도 비추천이에요.',
      recommend: [
        '전시 1–2개(타임슬롯/해설) 집중 감상',
        '건축 산책 + 북카페/아카이브',
        '전시장 근처 비스트로 점심으로 이동 최소화'
      ],
      avoid: [
        '인증샷 순회, 혼잡 핫플 연속 방문',
        '장거리 환승/도보 과다'
      ]
    },
  },
  chapters: [
    {
      chapter: 1,
      chapterDescription: 'Chapter 1',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q1',
          question: `✈️\n항공편은 어떻게 할까?`,
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '저렴하지만 선호하지 않는 시간대', type: '자연액티브', score: 1, selected: null },
            { answer: '비싸지만 선호하는 시간대', type: '아이코닉 포토', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q2',
          question: '🌨️ 출발 전 일기예보를 보니 폭설이 예측된다',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '예약 다 했는데 당연히 떠나야지', type: '자연액티브', score: 1, selected: null },
            { answer: '공항/숙소 고립 위험… 취소/연기하자', type: '전시감상가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q3',
          question: '🏠 숙소를 예약할 때 나는',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '안전하고 룸서비스 가능한 4성급+ 호텔', type: '전시감상가', score: 1, selected: null },
            { answer: '부엌·거실 있는 에어비앤비(집처럼)', type: '힐링산책가', score: 1, selected: null },
            { answer: '가성비 최고! 깔끔한 2~3성급 호텔/호스텔', type: '자연액티브', score: 1, selected: null },
            { answer: '라운지/바/공용공간 활발한 게스트하우스', type: '힐링산책가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q4',
          question: '📆 일정을 계획할 때 나는',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '시간대별로 촘촘히 계획(예약多)', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '큰 틀만 미리 정하고 현지가서 유연하게', type: '하이브리드형', score: 1, selected: null },
            { answer: '숙소 외에는 아무것도 정하지 않고 간다', type: '힐링산책가', score: 1, selected: null },
            { answer: 'SNS에서 본 핫한 식당과 카페를 알아보고 동선을 짠다.', type: '아이코닉 포토', score: 1, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 2,
      chapterDescription: 'Chapter 2',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q5',
          question: '💺 비행기 좌석 선호은?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '창가', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '중간', type: '하이브리드형', score: 1, selected: null },
            { answer: '복도', type: '힐링산책가', score: 1, selected: null },
            { answer: '상관없음', type: '하이브리드형', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q6',
          question: '🙂 탑승이 시작됐다. 나는',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '가장 먼저 줄 선다', type: '자연액티브', score: 1, selected: null },
            { answer: '줄 생기면 바로 합류한다', type: '하이브리드형', score: 1, selected: null },
            { answer: '줄이 짧아질 때까지 기다렸다 합류한다', type: '힐링산책가', score: 1, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 3,
      chapterDescription: 'Chapter 3',  
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q7',
          question: '🔎 여행지에서 식당은 어떻게 고를까',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '미리 찾아본 로컬 식당', type: '힐링산책가', score: 1, selected: null },
            { answer: '돌아다니다가 눈에 보이는 곳', type: '힐링산책가', score: 1, selected: null },
            { answer: '가벼운 카페나 브런치', type: '힐링산책가', score: 1, selected: null },
            { answer: '맛이 보장된 프랜차이즈', type: '전시감상가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q8',
          question: '🫕 웨이팅 60분 인기맛집 vs 바로 먹을 수 있는 로컬식당',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '웨이팅 감수하고 인기맛집', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '바로 먹고 이동 동선 살린다', type: '힐링산책가', score: 1, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 4,
      chapterDescription: 'Chapter 4',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q9',
          question: '☕️ 가장 가고 싶은 카페 스타일은?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: 'SNS 핫플 현지 유명 카페', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '테마/컨셉 강한 카페(동물·영화 등)', type: '전시감상가', score: 1, selected: null },
            { answer: '프랜차이즈(국가별 한정 메뉴 기대)', type: '전시감상가', score: 1, selected: null },
            { answer: '길 걷다 보이는 로컬 카페(즉흥 발견)', type: '힐링산책가', score: 1, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 5,
      chapterDescription: 'Chapter 5',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q10',
          question: '😆 이번 여행에서 \'무엇\'을 즐기고 싶으세요?',
          minSelect: 1,
          maxSelect: null,
          answers: [
            { answer: '사진 잘 찍고 예쁘게 기록하기', type: '아이코닉 포토', score: 2, selected: null },
            { answer: '유명 관광지는 꼭 가보기', type: '아이코닉 포토', score: 2, selected: null },
            { answer: '박물관·미술관에서 천천히 감상하기', type: '전시감상가', score: 2, selected: null },
            { answer: '로컬 동네를 산책하며 현지 분위기 느끼기', type: '힐링산책가', score: 2, selected: null },
            { answer: '액티비티/패키지 체험으로 빡! 즐기기', type: '자연액티브', score: 2, selected: null }
          ]
        },
        {
          questionId: 'Q11',
          question: '📸 사진에 대해 어느 쪽에 가까우세요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '구도·빛까지 신경 써서 전문 카메라로 제대로 남기고 싶어요', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '관광지마다 사진 찍는걸 좋아해요', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '기록용으로 가볍게 찍으면 충분해요', type: '힐링산책가', score: 1, selected: null },
            { answer: '사진보다는 눈으로 담는 편이에요', type: '힐링산책가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q12',
          question: '🗽 유명 관광지는 어떻게 생각하세요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '핵심 스폿은 꼭 가보고 싶어요', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '동선 맞으면 가볼래요', type: '하이브리드형', score: 1, selected: null },
            { answer: '꼭 가야 한다는 생각은 없어요', type: '힐링산책가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q13',
          question: '🗿 박물관·미술관은 어떤가요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '해설/오디오가이드까지 챙겨 즐기는 편이에요', type: '전시감상가', score: 2, selected: null },
            { answer: '유명한 곳 한두 곳이면 좋아요', type: '전시감상가', score: 1, selected: null },
            { answer: '실내 전시는 잘 안 가는 편이에요', type: '자연액티브', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q14',
          question: '🚶‍♀️ 로컬 산책·동네 구경은요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '골목·시장·카페 돌며 오래 머무는 걸 좋아해요', type: '힐링산책가', score: 2, selected: null },
            { answer: '일정에 여유가 있으면 넣고 싶어요', type: '힐링산책가', score: 1, selected: null },
            { answer: '빠른 이동이 더 맞아요', type: '아이코닉 포토', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q15',
          question: '🏄 액티비티/패키지는 어느 정도가 좋아요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '서핑·하이킹 등 체험을 적극적으로 하고 싶어요', type: '자연액티브', score: 2, selected: null },
            { answer: '1~2개만 가볍게 체험하면 충분해요', type: '하이브리드형', score: 1, selected: null },
            { answer: '체험보다는 관람/휴식이 좋아요', type: '전시감상가', score: 1, selected: null },
            // { answer: '기타 (꼭해야해)', type: '자연액티브', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q16',
          question: '🌃 야간 활동은?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '야시장/바/야경 코스 OK!', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '숙소 휴식이 좋아(보드게임/라운지)', type: '전시감상가', score: 1, selected: null },
            { answer: '다음 날 컨디션 보고 당일 결정', type: '하이브리드형', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q17',
          question: '🚃 교통수단 선택',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '걷자! 20분은 산책', type: '힐링산책가', score: 1, selected: null },
            { answer: '환승 2회도 OK(요금 절약/현지 경험)', type: '전시감상가', score: 1, selected: null },
            { answer: '택시로 시간 세이브', type: '아이코닉 포토', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q18',
          question: '🛍️ 쇼핑/기념품은?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '대형 쇼핑센터/아울렛 루트 잡는다', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '동네 마켓·플리마켓 위주', type: '힐링산책가', score: 1, selected: null },
            { answer: '여행은 무겁게 싫다(기념품 최소)', type: '자연액티브', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q19',
          question: '💸 여행 예산 중 가장 아깝지 않은 지출은?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '현지 교통비나 로컬 식당에서의 경험', type: '힐링산책가', score: 1, selected: null },
            { answer: '박물관 입장권 / 투어 비용', type: '전시감상가', score: 1, selected: null },
            { answer: '푹신한 침구와 룸서비스가 있는 럭셔리 숙소 비용', type: '전시감상가', score: 1, selected: null },
            { answer: '예쁜 옷이나 악세서리, 기념품 구매 비용', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '대중교통 패스 / 할인된 투어 상품 비용', type: '하이브리드형', score: 1, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 6,
      chapterDescription: 'Chapter 6',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q20',
          question: '😬 피하고 싶은 것(복수 선택)',
          minSelect: 0,
          maxSelect: null,
          answers: [
            { answer: '과음/클럽', type: '전시감상가', score: 1, selected: null },
            { answer: '새벽 일정(아주 이른 기상)', type: '힐링산책가', score: 1, selected: null },
            { answer: '장거리 도보/과한 걷기', type: '전시감상가', score: 1, selected: null },
            { answer: '장거리 운전/야간 운전', type: '힐링산책가', score: 1, selected: null },
            { answer: '익스트림 액티비티(번지, 패러글라이딩 등)', type: '전시감상가', score: 1, selected: null },
            { answer: '혼잡한 곳/과한 웨이팅', type: '힐링산책가', score: 1, selected: null },
            { answer: '소음 많은 숙소/파티형 숙소', type: '전시감상가', score: 1, selected: null },
            { answer: '위생이 불안한 식당/거리 음식', type: '전시감상가', score: 1, selected: null },
            { answer: '특정 음식/식이 제한(해산물, 돼지고기, 글루텐 등)', type: '전시감상가', score: 1, selected: null },
            { answer: '알레르기 유발 요소(동물털, 꽃가루 등)', type: '전시감상가', score: 1, selected: null },
            { answer: '정치/종교 색채 강한 장소·이벤트', type: '전시감상가', score: 1, selected: null },
            { answer: '사진·촬영 위주 코스', type: '힐링산책가', score: 1, selected: null },
            { answer: '쇼핑 위주 코스', type: '자연액티브', score: 1, selected: null },
            { answer: '기타(직접 입력)', type: '하이브리드형', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q21',
          question: '💞 나에게 여행의 최고의 활동은?',
          minSelect: 1,
          maxSelect: 2,
          answers: [
            { answer: '그 나라의 현지 시장이나 골목을 탐험하는 것', type: '힐링산책가', score: 2, selected: null },
            { answer: '유명한 건축물 앞에서 설명을 들으며 감상하는 것', type: '전시감상가', score: 2, selected: null },
            { answer: '침대나 수영장에서 하루종일 멍 대리는 것', type: '힐링산책가', score: 2, selected: null },
            { answer: '유명한 식당에 가서 사진찍고 맛보는 것', type: '아이코닉 포토', score: 2, selected: null },
            { answer: '유명한 관광명소를 짧게라도 다 둘러보는 것', type: '아이코닉 포토', score: 2, selected: null },
            { answer: '자연 속에서 액티비티를 즐기는 것', type: '자연액티브', score: 2, selected: null }
          ]
        }
      ]
    }
  ]
}

export const Test2QAForm: QAFormType = {
  testDescription: '연애 성향 테스트',
  testImage: require('@/assets/images/test2_1.png'),
  resultTypes: {},
  chapters: [
    {
      chapter: 1,
      chapterDescription: '❤️ 관계 목표에 대해 알려주세요',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q1',
          question: '이번 로밍러브에서 나는 이런 관계를 원한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '진지한 연애를 시작한다.', type: '', score: 0, selected: null },
            { answer: '천천히 알아보고 가능하면 이어간다.', type: '', score: 0, selected: null },
            { answer: '가볍게 만나며 즐거운 만남을 만든다.', type: '', score: 0, selected: null },
            { answer: '여행/소셜 메이트로 지낸다(연애 의도 없음).', type: '', score: 0, selected: null },
            { answer: '아직 결정하지 않았다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q2',
          question: '연락·만남 빈도와 스킨십같은 ‘관계 규칙’을 보통 어떻게 정한다?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '시작 전에 기준을 명확히 정한다.', type: '', score: 0, selected: null },
            { answer: '만나 보며 필요할 때 조율한다.', type: '', score: 0, selected: null },
            { answer: '상황에 따라 유동적으로 정한다.', type: '', score: 0, selected: null },
            { answer: '합의의 중요도를 낮게 본다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q3',
          question: '안정적인 관계를 위해 개인적인 불편함이나 희생을 감수할 수 있다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '', score: 0, selected: null },
            { answer: '2 조금 그렇다', type: '', score: 0, selected: null },
            { answer: '3 보통이다', type: '', score: 0, selected: null },
            { answer: '4 대체로 그렇다', type: '', score: 0, selected: null },
            { answer: '5 매우 그렇다', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q4',
          question: '연애 중에도 각자의 일정·공간을 반드시 보장한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '', score: 0, selected: null },
            { answer: '2 조금 그렇다', type: '', score: 0, selected: null },
            { answer: '3 보통이다', type: '', score: 0, selected: null },
            { answer: '4 대체로 그렇다', type: '', score: 0, selected: null },
            { answer: '5 매우 그렇다', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q5',
          question: '나는 다음 요소와는 절대 만나지 않는다(최대 3개).',
          minSelect: 0,
          maxSelect: 3,
          answers: [
            { answer: '과음과 잦은 음주', type: '', score: 0, selected: null },
            { answer: '흡연', type: '', score: 0, selected: null },
            { answer: '위생 관념 부족', type: '', score: 0, selected: null },
            { answer: '동성/이성 친구가 많다', type: '', score: 0, selected: null },
            { answer: '장거리 연애', type: '', score: 0, selected: null },
            { answer: '정치·종교 극단 성향을 드러낸다.', type: '', score: 0, selected: null },
            { answer: '반려동물 알레르기가 있다.', type: '', score: 0, selected: null },
            { answer: '결혼 의사가 나와 다르다.', type: '', score: 0, selected: null },
            { answer: '자녀 계획이 나와 다르다.', type: '', score: 0, selected: null },
            { answer: '기타(직접 입력한다).', type: '', score: 0, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 2,
      chapterDescription: '🧡 소통, 연락에 대해서 어떻게 생각하세요?',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q6',
          question: '연락 빈도는 이 정도가 편하다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '매일 여러 번 주고받는다.', type: '', score: 0, selected: null },
            { answer: '하루 1–2회 정도 주고받는다.', type: '', score: 0, selected: null },
            { answer: '이틀에 한 번 정도 주고받는다.', type: '', score: 0, selected: null },
            { answer: '필요할 때만 주고받는다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q7',
          question: '답장 속도는 이렇게 기대한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '10분 내로 온다.', type: '', score: 0, selected: null },
            { answer: '1시간 내로 온다.', type: '', score: 0, selected: null },
            { answer: '반나절 내로 온다.', type: '', score: 0, selected: null },
            { answer: '하루 내로 온다.', type: '', score: 0, selected: null },
            { answer: '크게 상관하지 않는다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q8',
          question: '늦답/읽씹이 이어지면 불안이 커진다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '', score: 0, selected: null },
            { answer: '2 조금 그렇다', type: '', score: 0, selected: null },
            { answer: '3 보통이다', type: '', score: 0, selected: null },
            { answer: '4 대체로 그렇다', type: '', score: 0, selected: null },
            { answer: '5 매우 그렇다', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q9',
          question: '연인과의 관계가 끝날까 봐 두렵거나, 버림받는 것에 대한 공포감이 크다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '', score: 0, selected: null },
            { answer: '2 조금 그렇다', type: '', score: 0, selected: null },
            { answer: '3 보통이다', type: '', score: 0, selected: null },
            { answer: '4 대체로 그렇다', type: '', score: 0, selected: null },
            { answer: '5 매우 그렇다', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q10',
          question: '연인에게 나의 깊은 사적인 비밀이나 고민을 털어놓는 것이 편하다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '', score: 0, selected: null },
            { answer: '2 조금 그렇다', type: '', score: 0, selected: null },
            { answer: '3 보통이다', type: '', score: 0, selected: null },
            { answer: '4 대체로 그렇다', type: '', score: 0, selected: null },
            { answer: '5 매우 그렇다', type: '', score: 0, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 3,
      chapterDescription: '💛애인과 갈등이 생겼다. 어떻게 해결하나요?',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q11',
          question: '갈등이 생기면 이렇게 반응한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '바로 대화를 제안한다.', type: '', score: 0, selected: null },
            { answer: '먼저 진정한 뒤 대화한다.', type: '', score: 0, selected: null },
            { answer: '글/메모로 정리해 공유한다.', type: '', score: 0, selected: null },
            { answer: '일단 거리를 두고 나중에 다룬다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q12',
          question: '연인의 감정 기복이 심하거나 감정적 부담이 크면 관계를 지속하기 어렵다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '', score: 0, selected: null },
            { answer: '2 조금 그렇다', type: '', score: 0, selected: null },
            { answer: '3 보통이다', type: '', score: 0, selected: null },
            { answer: '4 대체로 그렇다', type: '', score: 0, selected: null },
            { answer: '5 매우 그렇다', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q13',
          question: '사과와 회복은 이렇게 한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '빠르게 사과하고 재합의한다.', type: '', score: 0, selected: null },
            { answer: '시간을 두고 정리한 뒤 사과한다.', type: '', score: 0, selected: null },
            { answer: '제3자의 조언을 구한다.', type: '', score: 0, selected: null },
            { answer: '묵과하고 넘어간다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q14',
          question: '이성 친구·동료와의 관계에서 나는 이렇게 한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '이성 친구와의 만남·연락을 사전에 알리고 투명하게 공유한다.', type: '', score: 0, selected: null },
            { answer: '상황에 따라 사후 공유로 충분히 설명한다.', type: '', score: 0, selected: null },
            { answer: '사적인 1:1 만남은 가능하면 피하고 경계를 유지한다.', type: '', score: 0, selected: null },
            { answer: '상호 신뢰를 우선하고 별도 공유를 요구하지 않는다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q15',
          question: '연락·만남·예산 같은 최소 규칙을 정해두는 것이 좋다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '', score: 0, selected: null },
            { answer: '2 조금 그렇다', type: '', score: 0, selected: null },
            { answer: '3 보통이다', type: '', score: 0, selected: null },
            { answer: '4 대체로 그렇다', type: '', score: 0, selected: null },
            { answer: '5 매우 그렇다', type: '', score: 0, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 4,
      chapterDescription: '💚 데이트 선호 방식에 대해 알아볼게요',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q16',
          question: '첫 데이트 자리는 이렇게 선호한다.',
          minSelect: 0,
          maxSelect: null,
          answers: [
            { answer: '조용한 카페를 선택한다.', type: '', score: 0, selected: null },
            { answer: '가볍게 식사를 한다.', type: '', score: 0, selected: null },
            { answer: '전시·산책을 즐긴다.', type: '', score: 0, selected: null },
            { answer: '액티비티를 체험한다.', type: '', score: 0, selected: null },
            { answer: '분위기 좋은 바를 선택한다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q17',
          question: '데이트 주도는 이렇게 한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '내가 계획·예약을 주도한다.', type: '', score: 0, selected: null },
            { answer: '서로 번갈아 주도한다.', type: '', score: 0, selected: null },
            { answer: '상대가 주도하길 선호한다.', type: '', score: 0, selected: null },
            { answer: '즉흥 제안을 선호한다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q18',
          question: '데이트 비용은 이렇게 생각한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '더치페이를 한다.', type: '', score: 0, selected: null },
            { answer: '번갈아 계산한다.', type: '', score: 0, selected: null },
            { answer: '제안한 사람이 먼저 낸다.', type: '', score: 0, selected: null },
            { answer: '상황에 따라 유연하게 정한다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q19',
          question: '술자리 성향은 이렇다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '마시지 않는다.', type: '', score: 0, selected: null },
            { answer: '가볍게 마신다.', type: '', score: 0, selected: null },
            { answer: '분위기에 따라 마신다.', type: '', score: 0, selected: null },
            { answer: '즐겨 마신다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q20',
          question: '내가 편한 공개적 애정표현 범위는 이렇다',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '공공장소에서는 애정 표현을 최소화한다.', type: '', score: 0, selected: null },
            { answer: '포옹은 편하다.', type: '', score: 0, selected: null },
            { answer: '짧은 키스는 괜찮다.', type: '', score: 0, selected: null },
            { answer: '사진·SNS에서 커플 사진/표현이 편하다.', type: '', score: 0, selected: null },
            { answer: '모두 괜찮다. 혹은 그 이상도', type: '', score: 0, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 5,
      chapterDescription: '🩵 당신의 라이프 스타일은?',
      chapterImage: require('@/assets/images/test1_2.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q21',
          question: '생활 리듬은 이렇다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '아침형으로 생활한다.', type: '', score: 0, selected: null },
            { answer: '유연하게 상황에 따라 조정', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q22',
          question: '주말은 주로 이렇게 보낸다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '취미·여가를 즐긴다.', type: '', score: 0, selected: null },
            { answer: '친구와 약속을 잡는다.', type: '', score: 0, selected: null },
            { answer: '즉흥 약속을 즐긴다/그때 그때 다르다.', type: '', score: 0, selected: null },
            { answer: '(연애할때) 특별한 일이 없는 한 항상 연인과 보낸다.', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q23',
          question: '새로운 모임·사람 많은 자리를 즐긴다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '', score: 0, selected: null },
            { answer: '2 조금 그렇다', type: '', score: 0, selected: null },
            { answer: '3 보통이다', type: '', score: 0, selected: null },
            { answer: '4 대체로 그렇다', type: '', score: 0, selected: null },
            { answer: '5 매우 그렇다', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q24',
          question: '야시장·바·밤산책 같은 야간 활동을 좋아한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '', score: 0, selected: null },
            { answer: '2 조금 그렇다', type: '', score: 0, selected: null },
            { answer: '3 보통이다', type: '', score: 0, selected: null },
            { answer: '4 대체로 그렇다', type: '', score: 0, selected: null },
            { answer: '5 매우 그렇다', type: '', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q25',
          question: '연애에서 내가 더 우선하는 가치는 무엇이다',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '안정과 일상 루틴을 우선한다.', type: '', score: 0, selected: null },
            { answer: '성장과 도전 기회를 우선한다.', type: '', score: 0, selected: null },
            { answer: '안정과 성장의 균형을 맞춘다.', type: '', score: 0, selected: null },
            { answer: '아직 모르겠다.', type: '', score: 0, selected: null }
          ]
        }
      ]
    }
  ]
}