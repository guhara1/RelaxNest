"use strict";

const SITE = require("../data/site.json");

/* ---------- 공통 헤더 내비게이션 (드롭다운: 지역/생활권/지하철역/이용장소/예약전확인/운영기준) ---------- */
function header() {
  return `
  <header class="site-header">
    <div class="wrap nav">
      <a class="brand" href="/"><span class="dot"></span>${SITE.name}</a>
      <button class="nav-toggle" aria-label="메뉴 열기" aria-controls="nav-menu" aria-expanded="false">☰</button>
      <ul class="nav-menu" id="nav-menu">
        <li><a href="/">수도권 홈</a></li>
        <li>
          <a href="/seoul/" aria-haspopup="true">서울</a>
          <div class="dropdown">
            <a href="/seoul/">서울 홈</a>
            <a href="/seoul/life/gangnam-yeoksam/">강남·역삼 생활권</a>
            <a href="/seoul/life/jamsil-songpa/">잠실·송파 생활권</a>
            <a href="/seoul/life/hongdae-hapjeong/">홍대·합정 생활권</a>
            <a href="/seoul/life/yeouido-yeongdeungpo/">여의도·영등포 생활권</a>
          </div>
        </li>
        <li>
          <a href="/gyeonggi/" aria-haspopup="true">경기</a>
          <div class="dropdown">
            <a href="/gyeonggi/">경기 홈</a>
            <a href="/gyeonggi/life/suwon-station-ingye/">수원·인계동 생활권</a>
            <a href="/gyeonggi/life/bundang-pangyo/">분당·판교 생활권</a>
            <a href="/gyeonggi/life/dongtan-newtown/">동탄신도시 생활권</a>
            <a href="/gyeonggi/life/bucheon-station-sangdong/">부천·상동 생활권</a>
          </div>
        </li>
        <li>
          <a href="/incheon/" aria-haspopup="true">인천</a>
          <div class="dropdown">
            <a href="/incheon/">인천 홈</a>
            <a href="/incheon/life/songdo-international-city/">송도국제도시 생활권</a>
            <a href="/incheon/life/bupyeong-station-market/">부평역 생활권</a>
            <a href="/incheon/life/guwol-incheon-cityhall/">구월·시청 생활권</a>
            <a href="/incheon/life/cheongna-international-city/">청라국제도시 생활권</a>
          </div>
        </li>
        <li>
          <a href="/use/" aria-haspopup="true">이용 장소</a>
          <div class="dropdown">
            <a href="/use/home/">자택 이용</a>
            <a href="/use/hotel/">호텔·숙소 이용</a>
            <a href="/use/officetel/">오피스텔 이용</a>
            <a href="/use/business-district/">업무지구 이용</a>
            <a href="/use/airport-island/">공항·도서 지역</a>
          </div>
        </li>
        <li>
          <a href="/check/" aria-haspopup="true">예약 전 확인</a>
          <div class="dropdown">
            <a href="/check/address/">방문 주소 확인</a>
            <a href="/check/travel-fee/">추가 이동비 기준</a>
            <a href="/check/privacy/">개인정보 처리 기준</a>
            <a href="/check/service-policy/">서비스 이용 기준</a>
          </div>
        </li>
        <li><a href="/contact/">문의하기</a></li>
      </ul>
    </div>
  </header>`;
}

/* ---------- 공통 푸터 (오렌지 텔레그램 문의 버튼 포함) ---------- */
function footer() {
  const year = 2026;
  return `
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-cta">
        <p>웹사이트 제작·제휴가 필요하신가요? 텔레그램으로 빠르게 상담하세요.</p>
        <a class="btn btn-orange" href="${SITE.telegram.build}" target="_blank" rel="noopener nofollow">웹사이트 제작문의</a>
        <a class="btn btn-orange" href="${SITE.telegram.partner}" target="_blank" rel="noopener nofollow">제휴문의</a>
      </div>

      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="/"><span class="dot"></span>${SITE.name}</a>
          <p>서울·경기·인천 수도권 방문형 관리 서비스 지역 안내 사이트입니다. 공식 행정구역과 생활권, 지하철역, 이용 장소별 예약 전 확인사항을 정리합니다.</p>
          <p class="footer-contact">
            <strong>상호</strong> ${SITE.name}<br>
            <strong>전화예약</strong> <a href="${SITE.phoneHref}">${SITE.phone}</a>
          </p>
        </div>
        <div>
          <h4>지역 안내</h4>
          <ul>
            <li><a href="/seoul/">서울 출장마사지</a></li>
            <li><a href="/gyeonggi/">경기 출장마사지</a></li>
            <li><a href="/incheon/">인천 출장마사지</a></li>
            <li><a href="/use/">이용 장소별 안내</a></li>
          </ul>
        </div>
        <div>
          <h4>예약 전 확인</h4>
          <ul>
            <li><a href="/check/address/">방문 주소 확인</a></li>
            <li><a href="/check/travel-fee/">추가 이동비 기준</a></li>
            <li><a href="/check/privacy/">개인정보 처리 기준</a></li>
            <li><a href="/check/customer-notice/">고객 유의사항</a></li>
          </ul>
        </div>
        <div>
          <h4>운영 기준</h4>
          <ul>
            <li><a href="/policy/privacy/">개인정보 처리방침</a></li>
            <li><a href="/policy/service/">서비스 이용 기준</a></li>
            <li><a href="/policy/illegal-notice/">불법·선정적 서비스 불가</a></li>
            <li><a href="/policy/authors/">작성자·검수자 안내</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <span>© ${year} ${SITE.name}. 불법·선정적 서비스를 안내하지 않습니다.</span>
        <span><a href="/sitemap.xml">사이트맵</a> · <a href="/policy/privacy/">개인정보 처리방침</a></span>
      </div>
    </div>
  </footer>`;
}

/* ---------- JSON-LD 스키마 빌더 ---------- */
function jsonld(obj) {
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.baseUrl + "/",
    telephone: SITE.phone,
    description: "서울·경기·인천 수도권 방문형 관리 서비스 지역 안내",
    logo: SITE.baseUrl + "/assets/img/favicon.svg",
    image: SITE.baseUrl + (SITE.ogImage || "/assets/img/og-default.svg"),
    areaServed: ["서울특별시", "경기도", "인천광역시"],
    sameAs: [SITE.telegram.build].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "reservations",
      availableLanguage: "Korean"
    }
  };
}

/* WebSite (홈 전용) */
function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.baseUrl + "/",
    inLanguage: "ko-KR",
    publisher: { "@type": "Organization", name: SITE.name, url: SITE.baseUrl + "/" }
  };
}

/* Service + 실제 요금(Offer) — 요금표가 있는 페이지에 적용. 가짜 후기/평점은 사용하지 않음 */
function serviceSchema(page) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "방문형 관리 서비스 (출장마사지·홈타이)",
    name: page.serviceName || page.title,
    url: SITE.baseUrl + page.url,
    provider: {
      "@type": "Organization",
      name: SITE.name,
      telephone: SITE.phone,
      url: SITE.baseUrl + "/"
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "서울특별시" },
      { "@type": "AdministrativeArea", name: "경기도" },
      { "@type": "AdministrativeArea", name: "인천광역시" }
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: "90000",
      highPrice: "180000",
      offerCount: "3",
      offers: [
        { "@type": "Offer", name: "60분 코스", price: "90000", priceCurrency: "KRW" },
        { "@type": "Offer", name: "90분 코스", price: "150000", priceCurrency: "KRW" },
        { "@type": "Offer", name: "120분 코스", price: "180000", priceCurrency: "KRW" }
      ]
    }
  };
}

function breadcrumbSchema(crumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: SITE.baseUrl + c.url
    }))
  };
}

function webPageSchema(page) {
  const s = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: SITE.baseUrl + page.url,
    inLanguage: "ko-KR",
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.baseUrl + "/" }
  };
  if (page.ogImage || SITE.ogImage) {
    s.primaryImageOfPage = {
      "@type": "ImageObject",
      url: SITE.baseUrl + (page.ogImage || SITE.ogImage)
    };
  }
  return s;
}

function faqSchema(faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  };
}

/* ---------- 페이지 렌더 ---------- */
function render(page) {
  const desc = page.description || "";
  if (desc.length > 80) {
    console.warn(`⚠️  description ${desc.length}자(>80): ${page.url}`);
  }

  const canonical = SITE.baseUrl + page.url;
  const ogImage = SITE.baseUrl + (page.ogImage || SITE.ogImage);

  // 스키마 조립
  const schemas = [organizationSchema(), webPageSchema(page)];
  if (page.url === "/") schemas.push(websiteSchema());
  // 요금표가 있는 페이지 → Service + 실제 요금(Offer) 스키마
  if (page.body && page.body.indexOf("관리 시간 기준 기본 금액") !== -1) {
    schemas.push(serviceSchema(page));
  }
  if (page.breadcrumb && page.breadcrumb.length) {
    schemas.push(breadcrumbSchema(page.breadcrumb));
  }
  if (page.faq && page.faq.length) {
    schemas.push(faqSchema(page.faq));
  }
  if (page.extraSchema) schemas.push(...page.extraSchema);
  const schemaTags = schemas.map(jsonld).join("\n");

  const robots = page.noindex ? "noindex, follow" : "index, follow";

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${page.title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:title" content="${page.title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${page.title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" type="image/svg+xml" href="/assets/img/favicon.svg">
<link rel="apple-touch-icon" href="/assets/img/favicon.svg">
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="stylesheet" href="/assets/css/tokens.css">
<link rel="stylesheet" href="/assets/css/main.css">
${schemaTags}
</head>
<body>
${header()}
<main>
${page.body}
</main>
${footer()}
<a class="call-fab" href="${SITE.phoneHref}" aria-label="전화예약 ${SITE.phone}">
  <span class="call-fab__ring" aria-hidden="true"></span>
  <svg class="call-fab__icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.62 10.79a15.5 15.5 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24a11.4 11.4 0 0 0 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1a11.4 11.4 0 0 0 .57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z"/></svg>
  <span class="call-fab__label">전화예약</span>
</a>
<script src="/assets/js/site.js" defer></script>
</body>
</html>`;
}

module.exports = {
  render,
  SITE,
  organizationSchema,
  breadcrumbSchema,
  webPageSchema,
  faqSchema,
  jsonld
};
