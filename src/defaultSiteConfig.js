const defaultSiteConfig = {
  cover: {
    dateMark: '11.28',
    time: 'SAT PM 5:00',
    place: '서울대학교 연구공원 웨딩홀',
    groomName: '임훈',
    brideName: '오윤경',
  },
  invitation: {
    title: '초대합니다',
    lines: [
      '각자의 트랙을 달리던 저희 두 사람이 만나',
      '서로의 발걸음을 맞추는 완벽한 짝이 되었습니다.',
      '힘들 땐 서로의 페이스메이커가 되어주며',
      '삶이라는 인생 마라톤을 함께 완주해 나가겠습니다.',
      '부부라는 이름으로 서는 첫 번째 출발선,',
      '귀한 걸음으로 오셔서 힘차게 축복해주세요.',
    ],
    groomParents: '임혁 · 서정하',
    groomRelation: '차남',
    groomName: '임 훈',
    brideParents: '박경순',
    brideRelation: '장녀',
    brideName: '오윤경',
  },
  calendar: {
    title: 'SAVE THE DATE',
    dateLine: '2026년 11월 28일 토요일 오후 5시 00분',
    placeLine: '서울대학교 연구공원 웨딩홀, 연구공원 본관 1층',
    googleButtonText: '구글 캘린더에 추가',
    googleTitle: '임훈 ♥ 오윤경 결혼식',
    googleDates: '20261128T170000/20261128T190000',
    googleDetails: '임훈과 오윤경의 결혼식에 초대합니다.',
    googleLocation: '서울대학교 연구공원 웨딩홀, 서울시 관악구 관악로 1 연구공원 본관 1층',
  },
  location: {
    title: '오시는 길',
    name: '서울대학교 연구공원 웨딩홀',
    address: '서울시 관악구 관악로 1, 연구공원 본관 1층',
    transitTitle: '대중교통',
    transitHtml: "지하철 2호선 <b><span class='location__highlight'>낙성대역</span> 4번 출구</b><br />→ 마을버스 <b><span class='location__highlight'>관악02-1</span> 또는 <span class='location__highlight'>관악02-2</span></b> 승차",
    parkingTitle: '주차',
    parkingHtml: '주차요금 <b>무료(2시간)</b><br />주차장 이용시 웨딩홀과 바로 연결',
    notice: '※ 서울대학교 정문/후문을 통과할 경우 통행료가 발생하므로 낙성대 방향으로 이용해주세요.',
  },
  account: {
    title: '마음 전하실 곳',
    groups: [
      {
        title: '신랑 측',
        people: [
          { role: '신랑', name: '임훈', account: '추후 안내' },
          { role: '아버지', name: '임혁', account: '추후 안내' },
          { role: '어머니', name: '서정하', account: '추후 안내' },
        ],
      },
      {
        title: '신부 측',
        people: [
          { role: '신부', name: '오윤경', account: '추후 안내' },
          { role: '어머니', name: '박경순', account: '추후 안내' },
        ],
      },
    ],
  },
  footer: {
    shareUrl: 'https://crimama.github.io/react-wedding-card/',
    shareTitle: '임훈 ♥ 오윤경 결혼합니다',
    shareText: '2026년 11월 28일 토요일 오후 5시, 서울대학교 연구공원 웨딩홀',
    shareButtonText: '카카오톡 공유하기',
    names: '임훈 ♥ 오윤경',
    datePlace: '2026.11.28 서울대학교 연구공원 웨딩홀',
    credit: 'Based on YOUNGEUN100/react-wedding-card',
  },
  style: {
    bodyFont: 'GmarketSansLight',
    titleFont: 'GmarketSansMedium',
    coverFont: 'Gowun Dodum',
    backgroundColor: '#f8f1e9',
    paperColor: '#fffaf3',
    textColor: '#5f4a3d',
    mutedTextColor: '#8d7667',
    accentColor: '#b8786f',
    highlightColor: '#c43d36',
    buttonTextColor: '#ffffff',
  },
}

export default defaultSiteConfig
