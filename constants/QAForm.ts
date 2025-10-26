export interface QAFormType {
  testDescription: string;
  testImage: any;
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

export const Test1QAForm: QAFormType = {
  testDescription: 'Test 1',
  testImage: require('@/assets/images/test1_1.png'),
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
          question: '출발 전 일기예보: 여행기간 폭설 예측',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '예약 다 했는데 당연히 떠나야지', type: '자연액티브', score: 1, selected: null },
            { answer: '공항/숙소 고립 위험… 취소/연기하자', type: '전시감상가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q3',
          question: '숙소를 예약할 때',
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
          question: '일정 계획 스타일',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '시간대별로 촘촘히 계획(예약多)', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '큰 틀만 정하고 현지에서 유연하게', type: '하이브리드형', score: 1, selected: null },
            { answer: '가서 보고 끌리는 대로(즉흥)', type: '힐링산책가', score: 1, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 2,
      chapterDescription: 'Chapter 2',
      chapterImage: require('@/assets/images/test1_3.png'),
      imageWidth: 308,
      imageHeight: 229,
      questions: [
        {
          questionId: 'Q5',
          question: '체크인 방식',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '오프라인 셀프 체크인(키오스크)', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '온라인 체크인(모바일)', type: '하이브리드형', score: 1, selected: null },
            { answer: '오프라인 카운터 대면 체크인', type: '힐링산책가', score: 1, selected: null },
            { answer: '유료 사전 좌석 지정(사전 결제)', type: '자연액티브', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q6',
          question: '좌석 선호',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '창가', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '중간', type: '하이브리드형', score: 1, selected: null },
            { answer: '복도', type: '힐링산책가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q7',
          question: '탑승 줄 서기 타이밍',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '가장 먼저 줄 선다', type: '자연액티브', score: 1, selected: null },
            { answer: '줄 생기면 바로 합류', type: '하이브리드형', score: 1, selected: null },
            { answer: '줄이 짧아질 때까지 기다렸다 합류', type: '힐링산책가', score: 1, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 3,
      chapterDescription: 'Chapter 3',  
      chapterImage: require('@/assets/images/test1_1.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q8',
          question: '여행지에서 식당은 어디로 고를까요?',
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
          questionId: 'Q9',
          question: '웨이팅 60분 인기맛집 vs 바로 먹을 수 있는 로컬식당',
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
      chapterImage: require('@/assets/images/test1_1.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q10',
          question: '가장 가고 싶은 카페 스타일',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: 'SNS 핫플 현지 유명 카페', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '테마/컨셉 강한 카페(동물·영화 등)', type: '전시감상가', score: 1, selected: null },
            { answer: '프랜차이즈(국가별 한정 메뉴 기대)', type: '전시감상가', score: 1, selected: null },
            { answer: '길 걷다 보이는 로컬 카페(즉흥 발견)', type: '힐링산책가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q11',
          question: '카페에서의 시간 사용',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '사진/영상 촬영이 메인(연출·구도 중요)', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '대화·휴식 위주(사진은 기록 정도)', type: '힐링산책가', score: 1, selected: null },
            { answer: '정보 정리/다음 동선 계획(계획 보강)', type: '전시감상가', score: 1, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 5,
      chapterDescription: 'Chapter 5',
      chapterImage: require('@/assets/images/test1_1.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q12',
          question: '이번 여행에서 무엇을 즐기고 싶으세요?',
          minSelect: 1,
          maxSelect: 2,
          answers: [
            { answer: '사진 잘 찍고 예쁘게 기록하기', type: '아이코닉 포토', score: 2, selected: null },
            { answer: '유명 관광지는 꼭 가보기', type: '아이코닉 포토', score: 2, selected: null },
            { answer: '박물관·미술관에서 천천히 감상하기', type: '전시감상가', score: 2, selected: null },
            { answer: '로컬 동네를 산책하며 현지 분위기 느끼기', type: '힐링산책가', score: 2, selected: null },
            { answer: '액티비티/패키지 체험으로 빡! 즐기기', type: '자연액티브', score: 2, selected: null }
          ]
        },
        {
          questionId: 'Q13',
          question: '사진에 대해 어느 쪽에 가까우세요?',
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
          questionId: 'Q14',
          question: '유명 관광지는 어떻게 생각하세요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '핵심 스폿은 꼭 가보고 싶어요', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '동선 맞으면 가볼래요', type: '하이브리드형', score: 1, selected: null },
            { answer: '꼭 가야 한다는 생각은 없어요', type: '힐링산책가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q15',
          question: '박물관·미술관은 어떤가요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '해설/오디오가이드까지 챙겨 즐기는 편이에요', type: '전시감상가', score: 2, selected: null },
            { answer: '유명한 곳 한두 곳이면 좋아요', type: '전시감상가', score: 1, selected: null },
            { answer: '실내 전시는 잘 안 가는 편이에요', type: '자연액티브', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q16',
          question: '로컬 산책·동네 구경은요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '골목·시장·카페 돌며 오래 머무는 걸 좋아해요', type: '힐링산책가', score: 2, selected: null },
            { answer: '일정에 여유가 있으면 넣고 싶어요', type: '힐링산책가', score: 1, selected: null },
            { answer: '빠른 이동이 더 맞아요', type: '아이코닉 포토', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q17',
          question: '액티비티/패키지는 어느 정도가 좋아요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '서핑·하이킹 등 체험을 적극적으로 하고 싶어요', type: '자연액티브', score: 2, selected: null },
            { answer: '1~2개만 가볍게 체험하면 충분해요', type: '하이브리드형', score: 1, selected: null },
            { answer: '체험보다는 관람/휴식이 좋아요', type: '전시감상가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q18',
          question: '계획형 vs 즉흥형 — 내 스타일에 가장 가까운 문장을 골라주세요.',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '나는 예약과 시간 관리가 철저한 계획형으로 여행한다.', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '나는 큰 틀만 정해두고 현지에서 유연하게 조정하는 형태로 여행한다.', type: '하이브리드형', score: 1, selected: null },
            { answer: '나는 로컬 분위기와 우연을 즐기는 즉흥형으로 여행한다.', type: '힐링산책가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q19',
          question: '길을 잃으면 어떻게 하시나요?',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '불안이 커져 즉시 도움/택시로 복귀한다', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '지도를 확인하고 표지판을 따라 침착히 찾는다', type: '하이브리드형', score: 1, selected: null },
            { answer: '골목을 탐험하며 새로운 스폿을 발견하는 편이다', type: '힐링산책가', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q20',
          question: '야간 활동 제안',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '야시장/바/야경 코스 OK!', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '숙소 휴식이 좋아(보드게임/라운지)', type: '전시감상가', score: 1, selected: null },
            { answer: '다음 날 컨디션 보고 당일 결정', type: '하이브리드형', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q21',
          question: '교통수단 선택(도보 20분 vs 대중교통 환승 2회 vs 택시)',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '걷자! 20분은 산책', type: '힐링산책가', score: 1, selected: null },
            { answer: '환승 2회도 OK(요금 절약/현지 경험)', type: '전시감상가', score: 1, selected: null },
            { answer: '택시로 시간 세이브', type: '아이코닉 포토', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q22',
          question: '쇼핑/기념품',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '대형 쇼핑센터/아울렛 루트 잡는다', type: '아이코닉 포토', score: 1, selected: null },
            { answer: '동네 마켓·플리마켓 위주', type: '힐링산책가', score: 1, selected: null },
            { answer: '여행은 무겁게 싫다(기념품 최소)', type: '자연액티브', score: 1, selected: null }
          ]
        }
      ]
    },
    {
      chapter: 6,
      chapterDescription: 'Chapter 6',
      chapterImage: require('@/assets/images/test1_1.png'),
      imageWidth: 319,
      imageHeight: 381,
      questions: [
        {
          questionId: 'Q23',
          question: '피하고 싶은 것(복수 선택)',
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
          questionId: 'Q24',
          question: '걷기 허용량(일평균)',
          minSelect: 1,
          maxSelect: 1,
          answers: [
            { answer: '10,000보 이하', type: '전시감상가', score: 1, selected: null },
            { answer: '10,000보 - 20,000보', type: '힐링산책가', score: 1, selected: null },
            { answer: '20,000보 이상', type: '자연액티브', score: 1, selected: null }
          ]
        },
        {
          questionId: 'Q25',
          question: '지금 끌리는 여행 이미지를 골라주세요.',
          minSelect: 1,
          maxSelect: 2,
          answers: [
            { answer: 'A: 전망대/랜드마크 야경(아이코닉·포토)', type: '아이코닉 포토', score: 2, selected: null },
            { answer: 'B: 갤러리 화이트 큐브/오디오가이드(전시)', type: '전시감상가', score: 2, selected: null },
            { answer: 'C: 골목 카페/벽화/시장(로컬 라이프)', type: '힐링산책가', score: 2, selected: null },
            { answer: 'D: 산 능선/해변 액티비티(자연/액티브)', type: '자연액티브', score: 2, selected: null }
          ]
        }
      ]
    }
  ]
}