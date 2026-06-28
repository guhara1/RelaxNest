#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
IndexNow 즉시 색인 통보 (Bing · Naver · Yandex 등 IndexNow 참여 검색엔진)
의존성 없음(표준 라이브러리만 사용).

사용법:
  # dist/urls.txt 전체 일괄 통보 (사이트 빌드 후)
  python tools/indexnow.py

  # 특정 URL만 통보 (글/페이지 올릴 때마다)
  python tools/indexnow.py https://relaxnest.pages.dev/seoul/gangnam-gu/

참고:
  - IndexNow는 한 곳에 제출하면 참여 검색엔진(Bing·Naver·Yandex·Seznam)에 공유됩니다.
    안정성을 위해 아래 ENDPOINTS 전체에 전송합니다.
  - 키 파일은 사이트 루트(https://<host>/<key>.txt)에 호스팅되어 있어야 합니다.
    (build.js가 dist/<key>.txt 를 자동 생성합니다.)
  - Google은 IndexNow 미참여 → tools/google_indexing.py 또는 Search Console 사용.
"""

import json
import os
import sys
import urllib.request
import urllib.error

# ── 설정 (data/site.json과 동일하게 유지) ─────────────────────────────
HOST = "relaxnest.pages.dev"
KEY = "a3f5c9e21b7d48e6a0c4f9b2d7e15a8c"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

ENDPOINTS = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
    "https://searchadvisor.naver.com/indexnow",
    "https://yandex.com/indexnow",
]

URLS_FILE = os.path.join(os.path.dirname(__file__), "..", "dist", "urls.txt")
BATCH = 10000  # IndexNow 권장 1회 최대 10,000 URL


def load_urls(args):
    if args:
        return [u.strip() for u in args if u.strip()]
    if not os.path.exists(URLS_FILE):
        sys.exit(f"URL 목록이 없습니다: {URLS_FILE}\n먼저 `node build.js`로 사이트를 빌드하세요.")
    with open(URLS_FILE, encoding="utf-8") as f:
        return [ln.strip() for ln in f if ln.strip()]


def submit(endpoint, url_list):
    payload = json.dumps({
        "host": HOST,
        "key": KEY,
        "keyLocation": KEY_LOCATION,
        "urlList": url_list,
    }).encode("utf-8")
    req = urllib.request.Request(
        endpoint, data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.reason
    except urllib.error.HTTPError as e:
        return e.code, e.reason
    except Exception as e:  # noqa: BLE001
        return None, str(e)


def main():
    urls = load_urls(sys.argv[1:])
    print(f"통보 대상 URL: {len(urls)}개  (host={HOST})")
    for endpoint in ENDPOINTS:
        ok = 0
        for i in range(0, len(urls), BATCH):
            status, reason = submit(endpoint, urls[i:i + BATCH])
            tag = "OK" if status in (200, 202) else f"status={status}"
            if status in (200, 202):
                ok += 1
            print(f"  [{endpoint}] batch {i // BATCH + 1}: {tag} {reason or ''}".rstrip())
        # 200=수락, 202=수락(검증대기), 4xx=키/요청 확인 필요


if __name__ == "__main__":
    main()
