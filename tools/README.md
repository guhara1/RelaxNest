# 색인(인덱싱) 가속 도구

빌드하면 `dist/`에 색인용 파일이 자동 생성됩니다.

| 파일 | 용도 |
|------|------|
| `sitemap.xml` | 색인 대상 전체 URL (lastmod·priority 포함) — Naver/Google에 제출 |
| `rss.xml` | 페이지 피드 — 발견 가속 |
| `robots.txt` | 모든 크롤러 허용 + Sitemap·RSS 위치 명시 |
| `a3f5c9e21b7d48e6a0c4f9b2d7e15a8c.txt` | IndexNow 키 파일(루트 호스팅 필수) |
| `urls.txt` | IndexNow 일괄 통보용 평문 URL 목록 |

## 가장 빠른 색인 경로

### 1. Naver — Search Advisor
- 메인 페이지에 `naver-site-verification` 메타 등록 완료(빌드에 포함)
- [searchadvisor.naver.com](https://searchadvisor.naver.com) → 사이트 등록 → **사이트맵 제출**: `https://relaxnest.pages.dev/sitemap.xml`
- Naver는 **IndexNow 참여** → 아래 스크립트로 즉시 통보 가능

### 2. Bing — IndexNow (즉시)
- 키 파일이 루트에 있으면 별도 등록 없이 통보됩니다.

### 3. Google — Search Console
- [search.google.com/search-console](https://search.google.com/search-console) → 속성 추가 → **사이트맵 제출**: `sitemap.xml`
- 중요한 URL은 **URL 검사 → 색인 생성 요청**
- ⚠️ Google은 IndexNow 미참여, sitemap ping은 2023년 폐지. 일반 페이지용 즉시 색인 공개 API는 없습니다.

## IndexNow 즉시 통보 (Bing·Naver·Yandex)

```bash
# 빌드 후 첫 일괄 통보 (모든 URL)
node build.js
python tools/indexnow.py

# 글/페이지 올릴 때마다 해당 URL만 즉시 통보
python tools/indexnow.py https://relaxnest.pages.dev/seoul/gangnam-gu/
```

## Google Indexing API (선택)

```bash
pip install google-auth requests
python tools/google_indexing.py service_account.json --from dist/urls.txt
```
⚠️ Google Indexing API는 공식적으로 **JobPosting/BroadcastEvent**만 지원합니다. 일반 페이지는
Search Console(사이트맵 + URL 검사) 사용을 권장합니다. 자세한 주의사항은 스크립트 상단 주석 참고.

## 발행 시 자동화(권장 흐름)
1. 콘텐츠 수정 → `node build.js`
2. 변경 URL을 `python tools/indexnow.py <url> [<url> ...]` 로 즉시 통보
3. Naver/Google은 제출된 sitemap을 주기적으로 재크롤
