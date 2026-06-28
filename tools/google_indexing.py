#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Google Indexing API 통보 (선택) — URL_UPDATED 알림

⚠️ 중요(정직한 안내):
  Google Indexing API는 공식적으로 **JobPosting / BroadcastEvent** 콘텐츠만 지원합니다.
  일반 페이지에 사용하는 것은 Google 정책상 보장되지 않으며 권장되지 않습니다.
  일반 페이지의 가장 확실한 경로는 ↓
    1) Search Console에 sitemap.xml 제출 (한 번)
    2) 중요한 URL은 URL 검사 → 색인 요청
  (참고: Google·Bing의 sitemap "ping" 엔드포인트는 2023년 폐지되어 더 이상 동작하지 않습니다.)

설치:
  pip install google-auth requests

준비:
  1) Google Cloud 프로젝트에서 Indexing API 사용 설정
  2) 서비스 계정 생성 → JSON 키 다운로드 → service_account.json 로 저장
  3) Search Console 속성에 그 서비스 계정 이메일을 '소유자'로 추가

사용법:
  python tools/google_indexing.py service_account.json https://relaxnest.pages.dev/seoul/
  python tools/google_indexing.py service_account.json --from dist/urls.txt
"""

import sys

ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"
SCOPES = ["https://www.googleapis.com/auth/indexing"]


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    sa_file = sys.argv[1]
    rest = sys.argv[2:]

    try:
        from google.oauth2 import service_account
        from google.auth.transport.requests import AuthorizedSession
    except ImportError:
        sys.exit("의존성 필요: pip install google-auth requests")

    if rest[0] == "--from":
        with open(rest[1], encoding="utf-8") as f:
            urls = [ln.strip() for ln in f if ln.strip()]
    else:
        urls = rest

    creds = service_account.Credentials.from_service_account_file(sa_file, scopes=SCOPES)
    session = AuthorizedSession(creds)

    print(f"Google Indexing API 통보: {len(urls)}개")
    for u in urls:
        r = session.post(ENDPOINT, json={"url": u, "type": "URL_UPDATED"})
        print(f"  {r.status_code}  {u}")


if __name__ == "__main__":
    main()
