# 하~ㅅ딜 크롤러
- 매번 들어가기 귀찮아 죽겠다
- 그냥 크롤링을 때려서 한방에 모아서 보자
- cheerio는 신이다

# 구현 목록
- 각 사이트의 크롤링 로직 추가
- 봇 이슈를 피하기위해서 자동이 아닌 버튼을 눌러 수집하는 수동 크롤링 (최소인터벌 30분)
- 각 사이트의 카테고라이징 + 사이트별 id로 저장 후 캐싱 및 최신정보 반영 (1페이지기준만 표시)
- 전체 사이트 갱신 기능
- crontab 이용하여 특정한 랜덤시간에 fetching하는 스크립트 추가
- 쓰면서 필요한 것들 더욱 추가

# 완료된 사이트
- 이하 사이트의 크롤링, 리스트 출력, id기준 최신화로직
  - Q-사이트, p-사이트
# 버그
- F사이트 파싱이 안됨, 패스패스
