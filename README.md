# RelaxNest

서울·경기·인천 수도권 출장마사지(방문형 관리 서비스) **지역 안내** 정적 사이트.
Google 검색 가이드라인(E-E-A-T · Who/How/Why · Helpful Content · 스팸 정책) 준수형 구조로
다크 네이비 + 골드 **프리미엄 팔레트**와 Pretendard 토큰 시스템 위에 구축했습니다.

## 빌드

```bash
npm run build     # data/ + templates/ → dist/
npm run serve     # 빌드 후 http://localhost:8080 에서 미리보기
```

의존성 없음(Node 18+ 내장 모듈만 사용). 산출물은 `dist/`에 생성되며 정적 호스팅
(예: GitHub Pages, Cloudflare Pages)으로 바로 배포할 수 있습니다.

## 구조

```
data/        site.json(상호·전화·텔레그램), regions.json(서울/경기/인천 + 생활권),
             use-cases.json, checks.json, policies.json   ← 콘텐츠 데이터
templates/   layout.js(head·메타·JSON-LD·헤더·푸터), components.js(브레드크럼·FAQ·E-E-A-T)
assets/      css/tokens.css(프리미엄 팔레트 토큰), css/main.css(컴포넌트·오버레이),
             js/site.js(모바일 내비), img/og-default.svg
build.js     정적 사이트 생성기 (sitemap.xml · robots.txt 자동 생성)
dist/        생성된 산출물(서빙 대상)
```

## 반영된 요구사항

- **푸터 오렌지 텔레그램 버튼** — `웹사이트 제작문의` · `제휴문의` (모든 페이지 공통)
- **상호** RelaxNest · **전화예약** 0508-202-4719 (푸터 + 문의 페이지)
- **메타 디스크립션 80자 이내** — 전 페이지(현재 최대 48자), 빌드 시 초과 경고
- **스키마(JSON-LD)** — Organization · WebPage · BreadcrumbList · FAQPage · ImageObject
  - 실제 매장 주소가 없는 방문형 서비스이므로 `LocalBusiness`/`Review`/`AggregateRating` 미사용
- **내부링크** — 메인 → 서울·경기·인천 허브 → 생활권/이용장소/예약전확인 (롱테일 키워드 강화)
- **E-E-A-T / Who·How·Why / 개인정보·불법 서비스 불가 안내** 모든 주요 페이지 하단 연결
- **URL 정책 준수** — 출구별/노선별/번호동 개별 페이지 미생성, 역명·대표동 기준

## ⚙️ 배포 전 설정 필요

`data/site.json`에서 아래 값을 실제 값으로 교체하세요(현재는 플레이스홀더):

| 키 | 현재 값 | 설명 |
|----|---------|------|
| `telegram.build` | `https://t.me/relaxnest_build` | 웹사이트 제작문의 텔레그램 |
| `telegram.partner` | `https://t.me/relaxnest_partner` | 제휴문의 텔레그램 |
| `baseUrl` | `https://relaxnest.co.kr` | 실제 도메인 (canonical·OG·sitemap에 사용) |

## 단계적 확장 (지시서 기준)

본 저장소는 **1차-A** 범위(메인·3개 지역 허브·핵심 생활권·이용 장소 8종·예약 전 확인
8종·운영 기준·문의)를 구현합니다. 서울 25개 구 / 경기 31개 시군 / 인천 구군 및 추가
생활권·역세권은 `data/`에 항목을 추가하면 동일 템플릿으로 생성됩니다. 지역명만 바꾼
중복 본문을 만들지 않도록, 각 페이지는 생활권·역세권·이용 장소 기준으로 차별화된
본문을 작성한 뒤 색인합니다. 인천 2026 행정개편 페이지는 개편 전까지 `noindex`로 관리합니다.
