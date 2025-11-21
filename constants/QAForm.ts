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
    avoid: string[],
    image1: any,
    image2: any
  };
}

export const Test1QAForm: QAFormType = {
  testDescription: '여행 성향 테스트',
  testImage: require('@/assets/images/test1_1.png'),
  resultTypes: {
    '모험 유랑단': { 
      score: 0,
      color: '#FF2D55',
      keyword: ['모험', '유랑', '자유', '탐험'],
      description: '당신은 자유롭고 모험적인 여행을 즐기는 유형이에요. 계획에 얽매이지 않고 즉흥적으로 여행을 즐기며, 새로운 곳을 탐험하는 것을 좋아해요.',
      recommend: [
        '즉흥적인 여행 계획',
        '로컬 시장과 골목 탐험',
        '유연한 일정'
      ],
      avoid: [
        '과도한 계획',
        '고정된 일정',
        '관광지 중심 여행'
      ],
      image1: require('@/assets/images/test1_result1.png'),
      image2: require('@/assets/images/test1_result1_2.png'),
    },
    '여행 만학도': {
      score: 0,
      color: '#A78BFA',
      keyword: ['학습', '문화', '역사', '지식'],
      description: '당신은 여행을 통해 배우고 성장하는 것을 좋아하는 유형이에요. 박물관, 미술관, 유명 건축물을 방문하며 깊이 있게 감상하는 것을 즐깁니다.',
      recommend: [
        '박물관/미술관 방문',
        '해설과 가이드 활용',
        '문화적 경험 중심'
      ],
      avoid: [
        '피상적인 관광',
        '사진 위주 코스',
        '빠른 이동'
      ],
      image1: require('@/assets/images/test1_result2.png'),
      image2: require('@/assets/images/test1_result2_2.png'),
    },
    '늘보 베짱이': {
      score: 0,
      color: '#22C55E',
      keyword: ['휴식', '힐링', '여유', '안정'],
      description: '당신은 여행에서 휴식과 힐링을 중시하는 유형이에요. 바쁘게 움직이기보다는 여유롭게 머물며 휴식을 취하는 것을 좋아합니다.',
      recommend: [
        '여유로운 일정',
        '숙소에서의 휴식',
        '느긋한 활동'
      ],
      avoid: [
        '과도한 이동',
        '빡빡한 일정',
        '장거리 도보'
      ],
      image1: require('@/assets/images/test1_result3.png'),
      image2: require('@/assets/images/test1_result3_2.png'),
    },
    '핫플레이더': {
      score: 0,
      color: '#06B6D4',
      keyword: ['핫플', 'SNS', '인기', '트렌드'],
      description: '당신은 SNS에서 유행하는 핫플레이스를 찾아다니는 것을 좋아하는 유형이에요. 인기 있는 식당, 카페, 관광지를 방문하며 사진을 찍는 것을 즐깁니다.',
      recommend: [
        'SNS 핫플 방문',
        '인기 맛집 탐방',
        '사진 찍기'
      ],
      avoid: [
        '로컬 식당',
        '무명 장소',
        '웨이팅 없는 곳'
      ],
      image1: require('@/assets/images/test1_result4.png'),
      image2: require('@/assets/images/test1_result4_2.png'),
    },
    '가성비 로거': {
      score: 0,
      color: '#F59E0B',
      keyword: ['가성비', '절약', '효율', '계획'],
      description: '당신은 가성비를 중시하며 효율적인 여행을 계획하는 유형이에요. 예산을 고려하며 최대한 많은 곳을 둘러보는 것을 좋아합니다.',
      recommend: [
        '가성비 좋은 숙소',
        '대중교통 활용',
        '할인 상품 이용'
      ],
      avoid: [
        '고가 숙소',
        '비싼 식당',
        '비효율적인 이동'
      ],
      image1: require('@/assets/images/test1_result5.png'),
      image2: require('@/assets/images/test1_result5_2.png'),
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
            { answer: '저렴하지만 선호하지 않는 시간대', type: '가성비 로거', score: 5, selected: null },
            { answer: '비싸지만 선호하는 시간대', type: '핫플레이더', score: 4, selected: null }
          ]
        },
        {
          questionId: 'Q2',
          question: '🌨️ 출발 전 일기예보를 보니 폭설이 예측된다',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '예약 다 했는데 당연히 떠나야지', type: '가성비 로거', score: 5, selected: null },
            { answer: '공항/숙소 고립 위험… 취소/연기하자', type: '늘보 베짱이', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q3',
          question: '🏠 숙소를 예약할 때 나는',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '안전하고 룸서비스 가능한 4성급+ 호텔', type: '늘보 베짱이', score: 5, selected: null },
            { answer: '부엌·거실 있는 에어비앤비(집처럼)', type: '모험 유랑단', score: 2, selected: null },
            { answer: '가성비 최고! 깔끔한 2~3성급 호텔/호스텔', type: '가성비 로거', score: 5, selected: null },
            { answer: '라운지/바/공용공간 활발한 게스트하우스', type: '모험 유랑단', score: 4, selected: null }
          ]
        },
        {
          questionId: 'Q4',
          question: '📆 일정을 계획할 때 나는',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '시간대별로 촘촘히 계획(예약多)', type: '여행 만학도', score: 4, selected: null },
            { answer: '큰 틀만 미리 정하고 현지가서 유연하게', type: '모험 유랑단', score: 3, selected: null },
            { answer: '숙소 외에는 아무것도 정하지 않고 간다', type: '모험 유랑단', score: 5, selected: null },
            { answer: 'SNS에서 본 핫한 식당과 카페를 알아보고 동선을 짠다.', type: '핫플레이더', score: 5, selected: null }
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
            { answer: '창가', type: '핫플레이더', score: 4, selected: null },
            { answer: '중간', type: '모험 유랑단', score: 1, selected: null },
            { answer: '복도', type: '늘보 베짱이', score: 4, selected: null },
            { answer: '상관없음', type: '모험 유랑단', score: 4, selected: null }
          ]
        },
        {
          questionId: 'Q6',
          question: '🙂 탑승이 시작됐다. 나는',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '가장 먼저 줄 선다', type: '가성비 로거', score: 5, selected: null },
            { answer: '줄 생기면 바로 합류한다', type: '모험 유랑단', score: 3, selected: null },
            { answer: '줄이 짧아질 때까지 기다렸다 합류한다', type: '늘보 베짱이', score: 5, selected: null }
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
            { answer: '미리 찾아본 로컬 식당', type: '여행 만학도', score: 5, selected: null },
            { answer: '돌아다니다가 눈에 보이는 곳', type: '모험 유랑단', score: 5, selected: null },
            { answer: '가벼운 카페나 브런치', type: '핫플레이더', score: 4, selected: null },
            { answer: '맛이 보장된 프랜차이즈', type: '가성비 로거', score: 3, selected: null }
          ]
        },
        {
          questionId: 'Q8',
          question: '🫕 웨이팅 60분 인기맛집 vs 바로 먹을 수 있는 로컬식당',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '웨이팅 감수하고 인기맛집', type: '핫플레이더', score: 5, selected: null },
            { answer: '바로 먹고 이동 동선 살린다', type: '가성비 로거', score: 5, selected: null }
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
            { answer: 'SNS 핫플 현지 유명 카페', type: '핫플레이더', score: 5, selected: null },
            { answer: '테마/컨셉 강한 카페(동물·영화 등)', type: '핫플레이더', score: 3, selected: null },
            { answer: '프랜차이즈(국가별 한정 메뉴 기대)', type: '가성비 로거', score: 3, selected: null },
            { answer: '길 걷다 보이는 로컬 카페(즉흥 발견)', type: '모험 유랑단', score: 5, selected: null }
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
            { answer: '사진 잘 찍고 예쁘게 기록하기', type: '핫플레이더', score: 5, selected: null },
            { answer: '유명 관광지는 꼭 가보기', type: '가성비 로거', score: 5, selected: null },
            { answer: '박물관·미술관에서 천천히 감상하기', type: '여행 만학도', score: 5, selected: null },
            { answer: '로컬 동네를 산책하며 현지 분위기 느끼기', type: '모험 유랑단', score: 5, selected: null },
            { answer: '액티비티/패키지 체험으로 빡! 즐기기', type: '모험 유랑단', score: 4, selected: null }
          ]
        },
        {
          questionId: 'Q11',
          question: '📸 사진에 대해 어느 쪽에 가까우세요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '구도·빛까지 신경 써서 전문 카메라로 제대로 남기고 싶어요', type: '핫플레이더', score: 5, selected: null },
            { answer: '관광지마다 사진 찍는걸 좋아해요', type: '핫플레이더', score: 4, selected: null },
            { answer: '기록용으로 가볍게 찍으면 충분해요', type: '모험 유랑단', score: 4, selected: null },
            { answer: '사진보다는 눈으로 담는 편이에요', type: '늘보 베짱이', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q12',
          question: '🗽 유명 관광지는 어떻게 생각하세요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '핵심 스폿은 꼭 가보고 싶어요', type: '여행 만학도', score: 5, selected: null },
            { answer: '동선 맞으면 가볼래요', type: '가성비 로거', score: 5, selected: null },
            { answer: '꼭 가야 한다는 생각은 없어요', type: '모험 유랑단', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q13',
          question: '🗿 박물관·미술관은 어떤가요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '해설/오디오가이드까지 챙겨 즐기는 편이에요', type: '여행 만학도', score: 5, selected: null },
            { answer: '유명한 곳 한두 곳이면 좋아요', type: '여행 만학도', score: 3, selected: null },
            { answer: '실내 전시는 잘 안 가는 편이에요', type: '늘보 베짱이', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q14',
          question: '🚶‍♀️ 로컬 산책·동네 구경은요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '골목·시장·카페 돌며 오래 머무는 걸 좋아해요', type: '모험 유랑단', score: 5, selected: null },
            { answer: '일정에 여유가 있으면 넣고 싶어요', type: '여행 만학도', score: 3, selected: null },
            { answer: '빠른 이동이 더 맞아요', type: '가성비 로거', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q15',
          question: '🏄 액티비티/패키지는 어느 정도가 좋아요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '서핑·하이킹 등 체험을 적극적으로 하고 싶어요', type: '모험 유랑단', score: 5, selected: null },
            { answer: '1~2개만 가볍게 체험하면 충분해요', type: '가성비 로거', score: 3, selected: null },
            { answer: '체험보다는 관람/휴식이 좋아요', type: '늘보 베짱이', score: 5, selected: null },
          ]
        },
        {
          questionId: 'Q16',
          question: '🌃 야간 활동은?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '야시장/바/야경 코스 OK!', type: '가성비 로거', score: 5, selected: null },
            { answer: '숙소 휴식이 좋아(보드게임/라운지)', type: '늘보 베짱이', score: 5, selected: null },
            { answer: '다음 날 컨디션 보고 당일 결정', type: '모험 유랑단', score: 3, selected: null }
          ]
        },
        {
          questionId: 'Q17',
          question: '🚃 교통수단 선택',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '걷자! 20분은 산책', type: '모험 유랑단', score: 5, selected: null },
            { answer: '환승 2회도 OK(요금 절약/현지 경험)', type: '가성비 로거', score: 4, selected: null },
            { answer: '택시로 시간 세이브', type: '늘보 베짱이', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q18',
          question: '🛍️ 쇼핑/기념품은?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '대형 쇼핑센터/아울렛 루트 잡는다', type: '가성비 로거', score: 4, selected: null },
            { answer: '동네 마켓·플리마켓 위주', type: '모험 유랑단', score: 5, selected: null },
            { answer: '여행은 무겁게 싫다(기념품 최소)', type: '늘보 베짱이', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q19',
          question: '💸 여행 예산 중 가장 아깝지 않은 지출은?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '현지 교통비나 로컬 식당에서의 경험', type: '모험 유랑단', score: 5, selected: null },
            { answer: '박물관 입장권 / 투어 비용', type: '여행 만학도', score: 5, selected: null },
            { answer: '푹신한 침구와 룸서비스가 있는 럭셔리 숙소 비용', type: '늘보 베짱이', score: 5, selected: null },
            { answer: '예쁜 옷이나 악세서리, 기념품 구매 비용', type: '핫플레이더', score: 5, selected: null },
            { answer: '대중교통 패스 / 할인된 투어 상품 비용', type: '가성비 로거', score: 5, selected: null }
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
            { answer: '장거리 도보/과한 걷기', type: '늘보 베짱이', score: 5, selected: null },
            { answer: '혼잡한 곳/과한 웨이팅', type: '가성비 로거', score: 4, selected: null },
            { answer: '소음 많은 숙소/파티형 숙소', type: '늘보 베짱이', score: 5, selected: null },
            { answer: '사진·촬영 위주 코스', type: '여행 만학도', score: 4, selected: null },
            { answer: '쇼핑 위주 코스', type: '모험 유랑단', score: 3, selected: null },
          ]
        },
        {
          questionId: 'Q21',
          question: '💞 나에게 여행의 최고의 활동은?',
          minSelect: 1,
          maxSelect: 2,
          answers: [
            { answer: '현지 시장이나 골목을 탐험하는 것', type: '모험 유랑단', score: 5, selected: null },
            { answer: '유명한 건축물 앞에서 설명을 들으며 감상하는 것', type: '여행 만학도', score: 5, selected: null },
            { answer: '침대나 수영장에서 하루 종일 멍 때리는 것', type: '늘보 베짱이', score: 5, selected: null },
            { answer: '유명한 식당에 가서 사진 찍고 맛보는 것', type: '핫플레이더', score: 5, selected: null },
            { answer: '유명한 관광명소를 짧게라도 다 둘러보는 것', type: '가성비 로거', score: 5, selected: null },
          ]
        }
      ]
    }
  ]
}

export const Test2QAForm: QAFormType = {
  testDescription: '연애 성향 테스트',
  testImage: require('@/assets/images/test2_1.png'),
  resultTypes: {
    '안정적인 동반자': {
      score: 0,
      color: '#4A90E2',
      keyword: ['안정', '규칙', '소통', '균형'],
      description: '당신은 진지한 연애를 추구하며, 명확한 소통과 안정적인 관계를 중시하는 유형이에요. 관계 시작 전에 기준을 명확히 정하고, 연락 빈도와 만남의 규칙을 함께 설정하는 것을 선호합니다. 갈등이 생기면 먼저 진정한 뒤 대화하고, 빠르게 사과하고 재합의하는 스타일이에요.\n좋아하는 관계 연락을 적절히 주고받고, 일상을 공유하며 깊은 대화를 나누는 것을 즐깁니다. 데이트는 조용한 카페나 가벼운 식사, 전시·산책 같은 정적인 활동을 선호하고, 서로 번갈아가며 계획을 주도하는 균형을 좋아해요. 안정과 일상 루틴을 우선시하며, 관계의 안정을 해치지 않는 선에서 서로의 일정과 공간을 보장합니다.\n피하면 좋은 관계 즉흥적이고 무계획한 만남, 연락이 드문 관계, 감정 기복이 심한 파트너와는 어려울 수 있어요. 규칙 없이 유동적으로만 흘러가는 관계나, 개인 공간을 과도하게 요구하는 스타일은 맞지 않습니다.',
      recommend: [
        '관계 시작 전 명확한 규칙과 기준 설정',
        '정기적인 대화 시간 확보',
        '서로 번갈아가며 데이트 계획 주도'
      ],
      avoid: [
        '즉흥적이고 무계획한 만남',
        '연락이 드문 관계',
        '규칙 없이 유동적으로만 흐르는 관계'
      ],
      image1: require('@/assets/images/test2_result1.png'),
      image2: require('@/assets/images/test2_result1_2.png'),
    },
    '열정적인 몰입형': {
      score: 0,
      color: '#E91E63',
      keyword: ['열정', '몰입', '깊이', '공유'],
      description: '당신은 관계에 깊이 몰입하며 열정적인 연애를 추구하는 유형이에요. 사랑에 빠지면 상대의 모든 것을 공유하고 싶어하며, 자주 함께하고 싶어 합니다. 연인과 최대한 많은 시간을 공유하며 정서적으로 밀착하고 싶어해요.\n좋아하는 관계 연락을 자주 주고받고, 하루 1-2회 정도 주고받는 것을 선호합니다. 답장 속도에 민감하며, 늦답이나 읽씹이 이어지면 불안이 커집니다. 연인에게 깊은 사적인 비밀이나 고민을 털어놓는 것이 편하고, 관계가 끝날까 봐 두려워하는 경향이 있어요.\n피하면 좋은 관계 연락이 드문 관계나, 개인 공간을 과도하게 요구하는 스타일은 어려울 수 있어요. 감정 기복이 심하거나 감정적 부담이 큰 관계는 지속하기 어려울 수 있습니다.',
      recommend: [
        '자주 연락 주고받기',
        '함께하는 시간 최대한 확보',
        '깊은 정서적 공유'
      ],
      avoid: [
        '연락이 드문 관계',
        '과도한 개인 공간 요구',
        '감정 기복이 심한 관계'
      ],
      image1: require('@/assets/images/test2_result2.png'),
      image2: require('@/assets/images/test2_result2_2.png'),
    },
    '자유로운 유희형': {
      score: 0,
      color: '#F39C12',
      keyword: ['자유', '즉흥', '유연', '활력'],
      description: '당신은 자유롭고 즉흥적인 연애를 즐기는 유형이에요. 가볍게 만나며 즐거운 만남을 만들고, 상황에 따라 유동적으로 관계를 정립합니다. 합의의 중요도를 낮게 보며, 갈등이 생기면 일단 거리를 두고 나중에 다루는 스타일이에요.\n좋아하는 관계 연락은 필요할 때만 주고받고, 답장 속도에 크게 구애받지 않습니다. 데이트는 즉흥 제안을 선호하고, 상황에 따라 유연하게 비용을 정하는 방식을 좋아해요. 취미·여가를 즐기고, 친구와 약속을 잡으며, 즉흥 약속을 즐기는 스타일입니다.\n피하면 좋은 관계 명확한 규칙을 요구하거나, 자주 연락을 주고받아야 하는 관계는 부담스러울 수 있어요. 과도하게 계획적이거나, 안정만을 추구하는 파트너와는 맞지 않을 수 있습니다.',
      recommend: [
        '즉흥적이고 유연한 만남',
        '필요할 때만 연락 주고받기',
        '자유로운 관계 스타일'
      ],
      avoid: [
        '명확한 규칙 요구',
        '자주 연락 주고받기',
        '과도하게 계획적인 관계'
      ],
      image1: require('@/assets/images/test2_result3.png'),
      image2: require('@/assets/images/test2_result3_2.png'),
    },
    '공감 중심 밀착형': {
      score: 0,
      color: '#9B59B6',
      keyword: ['공감', '밀착', '정서', '유대'],
      description: '당신은 정서적으로 밀착하며 공감을 중시하는 유형이에요. 연인과 최대한 많은 시간을 공유하며 정서적으로 밀착하고 싶어 합니다. 깊은 정서적 유대가 가장 중요하며, 관계가 깊어진다면 자연스럽게 미래를 함께 계획하고 싶어해요.\n좋아하는 관계 연락을 자주 주고받고, 답장 속도에 민감합니다. 늦답이나 읽씹이 이어지면 불안이 커지며, 연인과의 관계가 끝날까 봐 두려워하는 경향이 있어요. 연인에게 깊은 사적인 비밀이나 고민을 털어놓는 것이 편하고, 관계의 분위기를 해치고 싶지 않아 웬만한 문제는 언급하지 않는 스타일입니다.\n피하면 좋은 관계 연락이 드문 관계나, 개인 공간을 과도하게 요구하는 스타일은 어려울 수 있어요. 감정 기복이 심하거나 감정적 부담이 큰 관계는 지속하기 어려울 수 있습니다.',
      recommend: [
        '정서적 밀착과 공감',
        '자주 연락 주고받기',
        '깊은 정서적 유대 형성'
      ],
      avoid: [
        '연락이 드문 관계',
        '과도한 개인 공간 요구',
        '감정 기복이 심한 관계'
      ],
      image1: require('@/assets/images/test2_result4.png'),
      image2: require('@/assets/images/test2_result4_2.png'),
    },
    '독립 보장형': {
      score: 0,
      color: '#E74C3C',
      keyword: ['독립', '공간', '자유', '보장'],
      description: '당신은 개인의 공간과 독립성을 중시하는 유형이에요. 연애 중에도 각자의 일정과 공간을 절대적으로 보장받아야 한다고 생각합니다. 구속받지 않는 자유로운 연애를 추구하며, 각자의 사생활과 공간을 확실히 구분하고 싶어 해요.\n좋아하는 관계 연락은 필요할 때만 주고받고, 답장 속도에 크게 구애받지 않습니다. 갈등이 생기면 바로 대화를 제안하거나, 일단 거리를 두고 나중에 다루는 스타일이에요. 사적인 1:1 만남은 가능하면 피하고 경계를 유지하며, 상호 신뢰를 우선하고 별도 공유를 요구하지 않습니다.\n피하면 좋은 관계 매일 여러 번 연락을 주고받거나, 빠른 답장을 기대하는 관계는 부담스러울 수 있어요. 과도하게 밀착되거나, 개인 공간을 존중하지 않는 파트너와는 어려울 수 있습니다.',
      recommend: [
        '각자의 일정과 공간 보장',
        '필요할 때만 연락 주고받기',
        '독립적인 관계 스타일'
      ],
      avoid: [
        '매일 여러 번 연락 주고받기',
        '빠른 답장 기대',
        '과도하게 밀착된 관계'
      ],
      image1: require('@/assets/images/test2_result5.png'),
      image2: require('@/assets/images/test2_result5_2.png'),
    },
  },
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
            { answer: '진지한 연애를 시작한다.', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '천천히 알아보고 가능하면 이어간다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '가볍게 만나며 즐거운 만남을 만든다.', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '여행/소셜 메이트로 지낸다.', type: '독립 보장형', score: 5, selected: null },
            { answer: '아직 결정하지 않았다.', type: '안정적인 동반자', score: 0, selected: null }
          ]
        },
        {
          questionId: 'Q2',
          question: '연락·만남 빈도와 스킨십같은 \'관계 규칙\'을 보통 어떻게 정한다?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '시작 전에 기준을 명확히 정한다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '만나 보며 필요할 때 조율한다.', type: '열정적인 몰입형', score: 4, selected: null },
            { answer: '상황에 따라 유동적으로 정한다.', type: '독립 보장형', score: 5, selected: null },
            { answer: '합의의 중요도를 낮게 본다.', type: '자유로운 유희형', score: 4, selected: null }
          ]
        },
        {
          questionId: 'Q3',
          question: '안정적인 관계를 위해 개인적인 불편함이나 희생을 감수할 수 있다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '나는 관계의 평화를 위해 나를 바칠 준비가 된, 헌신적인 사랑꾼이다.', type: '공감 중심 밀착형', score: 5, selected: null },
            { answer: '나는 장기적인 관계의 안정을 위해 나의 개인적인 불편함쯤은 당연히 감수할 줄 아는 성숙한 동반자이다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '나는 관계에 깊이 몰입하는 만큼 상대와의 경험을 위해서라면 어느 정도의 희생은 감수할 수 있다.', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '나는 개인의 영역이 크게 침해받지 않는, 독립적인 선에서만 희생을 감수한다.', type: '독립 보장형', score: 5, selected: null },
            { answer: '나는 개인의 자유를 잃는 희생은 절대 감수하지 않는다.', type: '자유로운 유희형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q4',
          question: '연애 중에도 각자의 일정·공간을 반드시 보장한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '나는 연애 중에도 각자의 일정과 공간을 절대적으로 보장받아야 한다고 생각하는 사람이다.', type: '독립 보장형', score: 5, selected: null },
            { answer: '나는 구속받지 않는 자유로운 연애를 추구하며, 각자의 사생활과 공간을 확실히 구분하고 싶다.', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '나는 관계의 안정을 해치지 않는 선에서 서로의 일정과 공간을 보장하되, 함께하는 시간도 중요하게 생각한다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '나는 사랑에 빠지면 상대의 모든 것을 공유하고 싶다. 각자의 공간 보장은 필요하지만, 자주 함께하고 싶다.', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '나는 연인과 최대한 많은 시간을 공유하며 정서적으로 밀착하고 싶다. 각자의 공간은 크게 중요하지 않다.', type: '공감 중심 밀착형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q5',
          question: '나는 다음 요소와는 절대 만나지 않는다(최대 3개).',
          minSelect: 1,
          maxSelect: 3,
          answers: [
            { answer: '과음과 잦은 음주', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '흡연', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '위생 관념 부족', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '동성/이성 친구가 많다', type: '독립 보장형', score: 5, selected: null },
            { answer: '장거리 연애', type: '공감 중심 밀착형', score: 5, selected: null },
            { answer: '정치·종교 극단 성향을 드러낸다.', type: '안정적인 동반자', score: 4, selected: null },
            { answer: '반려동물 알레르기가 있다.', type: '독립 보장형', score: 5, selected: null },
            { answer: '결혼 의사가 나와 다르다.', type: '공감 중심 밀착형', score: 5, selected: null },
            { answer: '자녀 계획이 나와 다르다.', type: '자유로운 유희형', score: 5, selected: null },
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
            { answer: '매일 여러 번 주고받는다.', type: '공감 중심 밀착형', score: 5, selected: null },
            { answer: '하루 1–2회 정도 주고받는다.', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '이틀에 한 번 정도 주고받는다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '필요할 때만 주고받는다.', type: '자유로운 유희형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q7',
          question: '답장 속도는 이렇게 기대한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '10분 내로 온다.', type: '공감 중심 밀착형', score: 5, selected: null },
            { answer: '1시간 내로 온다.', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '반나절 내로 온다.', type: '자유로운 유희형', score: 3, selected: null },
            { answer: '하루 내로 온다.', type: '안정적인 동반자', score: 3, selected: null },
            { answer: '크게 상관하지 않는다.', type: '독립 보장형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q8',
          question: '늦답/읽씹이 이어지면 불안이 커진다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '독립 보장형', score: 1, selected: null },
            { answer: '2 조금 그렇다', type: '자유로운 유희형', score: 2, selected: null },
            { answer: '3 보통이다', type: '안정적인 동반자', score: 3, selected: null },
            { answer: '4 대체로 그렇다', type: '열정적인 몰입형', score: 4, selected: null },
            { answer: '5 매우 그렇다', type: '공감 중심 밀착형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q9',
          question: '연인과의 관계가 끝날까 봐 두렵거나, 버림받는 것에 대한 공포감이 크다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '독립 보장형', score: 2, selected: null },
            { answer: '2 조금 그렇다', type: '자유로운 유희형', score: 1, selected: null },
            { answer: '3 보통이다', type: '안정적인 동반자', score: 3, selected: null },
            { answer: '4 대체로 그렇다', type: '열정적인 몰입형', score: 4, selected: null },
            { answer: '5 매우 그렇다', type: '공감 중심 밀착형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q10',
          question: '연인에게 나의 깊은 사적인 비밀이나 고민을 털어놓는 것이 편하다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '독립 보장형', score: 1, selected: null },
            { answer: '2 조금 그렇다', type: '자유로운 유희형', score: 2, selected: null },
            { answer: '3 보통이다', type: '안정적인 동반자', score: 3, selected: null },
            { answer: '4 대체로 그렇다', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '5 매우 그렇다', type: '공감 중심 밀착형', score: 5, selected: null }
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
            { answer: '바로 대화를 제안한다.', type: '독립 보장형', score: 5, selected: null },
            { answer: '먼저 진정한 뒤 대화한다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '글/메모로 정리해 공유한다.', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '일단 거리를 두고 나중에 다룬다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '관계의 분위기를 해치고 싶지 않아 웬만한 문제는 언급하지 않고, 긍정적인 면만 보려고 노력한다.', type: '자유로운 유희형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q12',
          question: '연인의 감정 기복이 심하거나 감정적 부담이 크면 관계를 지속하기 어렵다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '2 조금 그렇다', type: '안정적인 동반자', score: 2, selected: null },
            { answer: '3 보통이다', type: '안정적인 동반자', score: 2, selected: null },
            { answer: '4 대체로 그렇다', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '5 매우 그렇다', type: '독립 보장형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q13',
          question: '사과와 회복은 이렇게 한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '빠르게 사과하고 재합의한다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '시간을 두고 정리한 뒤 사과한다.', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '제3자의 조언을 구한다.', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '묵과하고 넘어간다.', type: '안정적인 동반자', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q14',
          question: '이성 친구·동료와의 관계에서 나는 이렇게 한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '이성 친구와의 만남·연락을 사전에 알리고 투명하게 공유한다.', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '상황에 따라 사후 공유로 충분히 설명한다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '사적인 1:1 만남은 가능하면 피하고 경계를 유지한다.', type: '독립 보장형', score: 5, selected: null },
            { answer: '상호 신뢰를 우선하고 별도 공유를 요구하지 않는다.', type: '독립 보장형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q15',
          question: '연락·만남·예산 같은 최소 규칙을 정해두는 것이 좋다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '1 전혀 아니다', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '2 조금 그렇다', type: '자유로운 유희형', score: 4, selected: null },
            { answer: '3 보통이다', type: '자유로운 유희형', score: 3, selected: null },
            { answer: '4 대체로 그렇다', type: '자유로운 유희형', score: 2, selected: null },
            { answer: '5 매우 그렇다', type: '자유로운 유희형', score: 1, selected: null }
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
          question: '데이트 주도는 이렇게 한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '내가 계획·예약을 주도한다.', type: '열정적인 몰입형', score: 4, selected: null },
            { answer: '서로 번갈아 주도한다.', type: '안정적인 동반자', score: 4, selected: null },
            { answer: '상대가 주도하길 선호한다.', type: '공감 중심 밀착형', score: 4, selected: null },
            { answer: '즉흥 제안을 선호한다.', type: '열정적인 몰입형', score: 4, selected: null }
          ]
        },
        {
          questionId: 'Q17',
          question: '데이트 비용은 이렇게 생각한다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '더치페이를 한다.', type: '자유로운 유희형', score: 4, selected: null },
            { answer: '번갈아 계산한다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '제안한 사람이 먼저 낸다.', type: '열정적인 몰입형', score: 4, selected: null },
            { answer: '상황에 따라 유연하게 정한다.', type: '열정적인 몰입형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q18',
          question: '관계의 최종 목표 및 미래 계획은?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '관계는 장기적인 삶의 동반자를 찾는 과정이며, 나의 미래 계획에 있어 가장 중요한 부분이다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '깊은 정서적 유대가 가장 중요하며, 관계가 깊어진다면 자연스럽게 미래를 함께 계획하고 싶다.', type: '공감 중심 밀착형', score: 5, selected: null },
            { answer: '현재의 강렬한 감정과 경험을 즐기는 것이 우선이며, 미래 계획은 그 다음 단계로 생각하고 싶다.', type: '열정적인 몰입형', score: 5, selected: null },
            { answer: '연애는 개인의 삶을 보조하는 요소일 뿐, 나의 커리어/개인 목표가 미래 계획에서 우선순위다.', type: '독립 보장형', score: 5, selected: null },
            { answer: '연애는 현재의 즐거움을 위한 것이며, 미래의 구속이나 장기적인 계획은 전혀 고려하지 않는다.', type: '자유로운 유희형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q19',
          question: '주말은 주로 이렇게 보낸다.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '취미·여가를 즐긴다.', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '친구와 약속을 잡는다.', type: '자유로운 유희형', score: 4, selected: null },
            { answer: '즉흥 약속을 즐긴다/그때 그때 다르다.', type: '자유로운 유희형', score: 4, selected: null },
            { answer: '(연애할때) 특별한 일이 없는 한 항상 연인과 보낸다.', type: '열정적인 몰입형', score: 5, selected: null }
          ]
        },
        {
          questionId: 'Q20',
          question: '연애에서 내가 더 우선하는 가치는 무엇이다',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '안정과 일상 루틴을 우선한다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '성장과 도전 기회를 우선한다.', type: '자유로운 유희형', score: 5, selected: null },
            { answer: '안정과 성장의 균형을 맞춘다.', type: '안정적인 동반자', score: 5, selected: null },
            { answer: '아직 모르겠다.', type: '안정적인 동반자', score: 0, selected: null }
          ]
        }
      ]
    }
  ]
}