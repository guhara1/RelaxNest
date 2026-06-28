"use strict";

/* =========================================================================
   RelaxNest 정적 사이트 빌드 (의존성 없음)
   data/ + templates/ → dist/
   ========================================================================= */

const fs = require("fs");
const path = require("path");
const { render, SITE } = require("./templates/layout");
const {
  breadcrumb,
  faqBlock,
  eeatBlock,
  policyNotice,
  linkCards
} = require("./templates/components");
const REGIONS = require("./data/regions.json");

const DIST = path.join(__dirname, "dist");
const pages = []; // {url, title, description, body, breadcrumb, faq, noindex}

/* ---------- 유틸 ---------- */
function addPage(p) {
  pages.push(p);
}
function chips(list) {
  return (
    '<div class="grid grid-4" style="gap:.5rem">' +
    list
      .map(
        (d) =>
          `<span class="btn btn-ghost" style="cursor:default;justify-content:flex-start">${d}</span>`
      )
      .join("") +
    "</div>"
  );
}

/* =========================================================================
   1) 메인 페이지
   ========================================================================= */
function buildHome() {
  const faq = [
    { q: "이 지역도 방문 가능한가요?", a: "실제 방문 주소, 가까운 생활권, 예약 가능 시간, 이동 기준을 확인한 뒤 안내합니다." },
    { q: "호텔이나 숙소에서도 이용할 수 있나요?", a: "숙소 정책과 객실 출입 가능 여부를 먼저 확인해야 합니다." },
    { q: "추가 이동비가 있나요?", a: "서울 외곽, 경기 외곽, 인천 공항·도서 지역은 사전 확인이 필요합니다." },
    { q: "개인정보는 어떻게 처리하나요?", a: "예약 확인과 연락에 필요한 최소 정보만 안내하며, 개인정보 처리방침 페이지로 연결합니다." },
    { q: "불법·선정적 서비스도 가능한가요?", a: "불법·선정적 서비스는 제공하거나 안내하지 않습니다." }
  ];

  const body = `
  <section class="hero">
    <div class="wrap">
      <span class="eyebrow">서울 · 경기 · 인천</span>
      <h1>서울·경기·인천 출장마사지<br>수도권 지역별 예약 안내</h1>
      <p class="lede">서울, 경기, 인천 주요 지역과 생활권, 지하철역, 자택·호텔·오피스텔 이용 기준을 한 번에 확인하세요. 전화예약 <a href="${SITE.phoneHref}">${SITE.phone}</a></p>
      <div class="hero-cta">
        <a class="btn btn-gold" href="/seoul/">서울 보기</a>
        <a class="btn btn-ghost" href="/gyeonggi/">경기 보기</a>
        <a class="btn btn-ghost" href="/incheon/">인천 보기</a>
        <a class="btn btn-ghost" href="/check/">예약 전 확인</a>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="wrap">
      <span class="eyebrow">코스 시간으로 보는 기본 요금</span>
      <h2>관리 시간 기준 기본 금액</h2>
      <p class="lede">관리 시간(60·90·120분)을 기준으로 정리한 기본 금액입니다. 표시되지 않은 별도 비용을 두지 않는 것을 원칙으로 안내합니다.</p>
      <div class="pricing" style="margin-top:var(--sp-5)">
        <div class="price-card">
          <h3>60분 코스</h3>
          <div class="price-amount">90,000<span class="won">원</span></div>
          <div class="price-min">60분</div>
          <p class="price-desc">핵심 부위 위주 가벼운 이완</p>
          <a class="btn btn-ghost" href="/contact/">예약 문의</a>
        </div>
        <div class="price-card price-card--featured">
          <span class="price-badge">추천</span>
          <h3>90분 코스</h3>
          <div class="price-amount">150,000<span class="won">원</span></div>
          <div class="price-min">90분</div>
          <p class="price-desc">전신 균형 표준 구성·아로마 포함</p>
          <a class="btn btn-gold" href="/contact/">예약 문의</a>
        </div>
        <div class="price-card">
          <h3>120분 코스</h3>
          <div class="price-amount">180,000<span class="won">원</span></div>
          <div class="price-min">120분</div>
          <p class="price-desc">구석구석 집중하는 프리미엄 구성</p>
          <a class="btn btn-ghost" href="/contact/">예약 문의</a>
        </div>
      </div>
      <p class="price-desc" style="text-align:center;margin-top:var(--sp-4)">방문 지역과 시간대, 이동 거리에 따라 최종 금액은 통화 시 확정됩니다. <a href="/check/travel-fee/">요금·예약 기준 자세히 보기 →</a></p>
    </div>
  </section>

  <section class="section section--tight">
    <div class="wrap">
      <span class="eyebrow">수도권은 지역별 기준이 다릅니다</span>
      <h2>서울·경기·인천은 같은 수도권이라도 이용 기준이 다릅니다</h2>
      <div class="prose">
        <p>서울은 지하철역과 생활권이 촘촘하게 연결되어 있습니다. 경기는 시군 면적이 넓어 같은 도시 안에서도 이동 기준과 생활권이 달라집니다. 인천은 원도심·신도시·공항·도서 지역이 함께 있어 사전 확인이 특히 중요합니다. RelaxNest는 지역명만 나열하지 않고, 실제 방문 주소·가까운 역·생활권·이용 장소·예약 전 확인사항을 기준으로 안내합니다.</p>
      </div>
    </div>
  </section>

  ${linkCards("서울·경기·인천 지역별 안내", "지역별 바로가기", [
    { url: "/seoul/", title: "서울", desc: "강남, 잠실, 홍대, 여의도, 성수, 용산 등 서울 주요 생활권 중심 안내" },
    { url: "/gyeonggi/", title: "경기", desc: "수원, 분당, 용인, 부천, 안산, 동탄 등 경기 시군·생활권 안내" },
    { url: "/incheon/", title: "인천", desc: "송도, 부평, 구월, 청라, 검단, 영종 등 인천 구군·생활권 안내" }
  ])}

  ${linkCards("이용 장소에 따라 확인할 내용이 다릅니다", "이용 장소별 안내", [
    { url: "/use/home/", title: "자택", desc: "정확한 주소, 공동현관 출입 방식, 방문 가능 시간 확인" },
    { url: "/use/hotel/", title: "호텔·숙소", desc: "숙소 정책과 객실 출입 가능 여부 사전 확인" },
    { url: "/use/officetel/", title: "오피스텔", desc: "공동현관, 엘리베이터, 관리 규정, 방문 시간대 확인" },
    { url: "/use/business-district/", title: "업무지구", desc: "보안 게이트·방문자 등록 절차와 출입 가능 시간 확인" },
    { url: "/use/station-area/", title: "역세권", desc: "환승·위치 기준으로 가까운 역과 건물 위치 공유" },
    { url: "/use/airport-island/", title: "공항·도서", desc: "공항·도서 지역 사전 예약과 이동 기준 확인" }
  ])}

  <section class="section section--tight">
    <div class="wrap">
      <span class="eyebrow">예약 전 체크리스트</span>
      <h2>예약 전 확인하면 좋은 내용</h2>
      <ul class="checklist">
        <li>방문 주소를 정확히 확인했나요?</li>
        <li>공동현관 또는 건물 출입 방식이 있나요?</li>
        <li>호텔·숙소 이용 가능 여부를 확인했나요?</li>
        <li>오피스텔 관리 규정이 있나요?</li>
        <li>주차 또는 차량 이동이 필요한 지역인가요?</li>
        <li>외곽 지역 추가 이동비가 있나요?</li>
        <li>공항·도서 지역 사전 예약이 필요한가요?</li>
        <li>예약 변경 기준과 개인정보 처리 기준을 확인했나요?</li>
      </ul>
    </div>
  </section>

  ${policyNotice()}
  ${faqBlock(faq)}
  ${eeatBlock()}`;

  addPage({
    url: "/",
    title: "서울·경기·인천 출장마사지｜수도권 홈타이 지역별 예약 안내",
    description: "서울·경기·인천 출장마사지 생활권·지하철역·이용 장소별 예약 전 확인 안내",
    body,
    faq,
    breadcrumb: [{ name: "수도권 홈", url: "/" }]
  });
}

/* =========================================================================
   2) 지역 허브 + 생활권 페이지
   ========================================================================= */
function buildRegions() {
  Object.values(REGIONS).forEach((r) => {
    const lifeCards = r.life.map((l) => ({
      url: `/${r.slug}/life/${l.slug}/`,
      title: `${l.name} 생활권`,
      desc: l.desc
    }));

    const hubFaq = [
      { q: `${r.name} 어느 지역까지 방문 가능한가요?`, a: "실제 방문 주소와 가까운 생활권, 이동 기준을 확인한 뒤 안내합니다. 외곽 지역은 추가 이동 여부를 함께 확인합니다." },
      { q: "예약 전에 무엇을 확인해야 하나요?", a: "방문 주소, 건물 출입 방식, 이용 장소(자택·호텔·오피스텔), 예약 가능 시간을 확인하면 좋습니다." },
      { q: "불법·선정적 서비스도 가능한가요?", a: "불법·선정적 서비스는 제공하거나 안내하지 않습니다." }
    ];

    const crumbs = [
      { name: "수도권 홈", url: "/" },
      { name: r.name, url: `/${r.slug}/` }
    ];

    const hubBody = `
    ${breadcrumb(crumbs)}
    <section class="section section--tight">
      <div class="wrap">
        <span class="eyebrow">${r.name} 지역 안내</span>
        <h1>${r.h1}</h1>
        <p class="lede">${r.intro}</p>
      </div>
    </section>

    <section class="section section--tight">
      <div class="wrap">
        <h2>${r.name} 주요 행정구역</h2>
        ${chips(r.districts)}
        <p class="price-desc" style="margin-top:var(--sp-4)">행정구역 전체를 한 번에 색인하지 않고, 본문 품질이 확보된 생활권·역세권부터 단계적으로 안내합니다.</p>
      </div>
    </section>

    ${linkCards(`${r.name} 핵심 생활권`, "생활권별 안내", lifeCards)}

    ${policyNotice()}
    ${faqBlock(hubFaq)}
    ${eeatBlock()}`;

    addPage({
      url: `/${r.slug}/`,
      title: `${r.name} 출장마사지｜생활권·지하철역 예약 안내 · ${SITE.name}`,
      description: r.desc,
      body: hubBody,
      faq: hubFaq,
      breadcrumb: crumbs
    });

    // 생활권 페이지
    r.life.forEach((l) => {
      const lc = [
        ...crumbs,
        { name: `${l.name} 생활권`, url: `/${r.slug}/life/${l.slug}/` }
      ];
      const lFaq = [
        { q: `${l.name} 생활권 어디까지 방문하나요?`, a: `${l.districts} 일대와 인접 권역을 기준으로 방문 주소와 가까운 역을 확인한 뒤 안내합니다.` },
        { q: "이 권역에서 무엇을 먼저 확인해야 하나요?", a: l.use },
        { q: "추가 이동비가 있나요?", a: "권역 외곽으로 이동하는 경우 사전에 추가 이동 여부를 확인합니다." }
      ];
      const lBody = `
      ${breadcrumb(lc)}
      <section class="section section--tight">
        <div class="wrap">
          <span class="eyebrow">${r.name} · ${l.focus}</span>
          <h1>${l.name} 출장마사지 생활권 안내</h1>
          <div class="prose">
            <p>${l.body}</p>
            <h2>이용 장소별 확인사항</h2>
            <p>${l.use}</p>
            <h2>가까운 지하철역 · 인접 지역</h2>
            <p>가까운 역은 <strong>${l.stations}</strong>입니다. 대표 행정구역은 ${l.districts}이며, 정확한 방문 주소와 가까운 출입구를 공유하면 이동이 원활합니다. 출구별·노선별로 페이지를 나누지 않고 역명 기준으로 안내합니다.</p>
            <h2>예약 전 체크리스트</h2>
            <ul>
              <li>정확한 방문 주소와 동·호수</li>
              <li>공동현관·건물 출입 방식</li>
              <li>이용 장소(자택·호텔·오피스텔) 정책</li>
              <li>예약 가능 시간과 변경 기준</li>
              <li><a href="/check/privacy/">개인정보 처리 기준</a> 확인</li>
            </ul>
          </div>
        </div>
      </section>

      ${linkCards("관련 지역 더 보기", "내부 링크", [
        { url: `/${r.slug}/`, title: `${r.name} 전체 보기`, desc: `${r.name} 시군·구·생활권 허브로 이동` },
        { url: "/use/", title: "이용 장소별 안내", desc: "자택·호텔·오피스텔·업무지구 기준 확인" },
        { url: "/check/", title: "예약 전 확인", desc: "방문 주소·이동비·개인정보 기준 확인" }
      ])}

      ${policyNotice()}
      ${faqBlock(lFaq)}
      ${eeatBlock({
        who: `이 페이지는 ${SITE.author}가 작성하고 ${SITE.reviewer}가 검수합니다.`,
        how: `${l.districts}의 공식 행정구역, ${l.stations} 등 가까운 역, ${l.focus} 중심 이용 장소 기준으로 구성했습니다.`,
        why: `${l.name} 권역에서 방문형 서비스를 찾는 사용자가 이동 기준과 이용 장소를 안전하게 확인할 수 있도록 작성했습니다.`
      })}`;

      addPage({
        url: `/${r.slug}/life/${l.slug}/`,
        title: `${l.name} 출장마사지｜${r.name} 생활권 예약 안내 · ${SITE.name}`,
        description: l.desc,
        body: lBody,
        faq: lFaq,
        breadcrumb: lc
      });
    });
  });
}

/* =========================================================================
   3) 이용 장소 / 예약 전 확인 / 운영 기준 / 문의
   ========================================================================= */
const USE_CASES = require("./data/use-cases.json");
const CHECKS = require("./data/checks.json");
const POLICIES = require("./data/policies.json");

function buildSimpleSet(items, base, eyebrow, hubTitle, hubDesc) {
  // 허브
  const cards = items.map((it) => ({
    url: `${base}${it.slug}/`,
    title: it.name,
    desc: it.desc
  }));
  addPage({
    url: base,
    title: `${hubTitle} · ${SITE.name}`,
    description: hubDesc,
    body: `
    ${breadcrumb([{ name: "수도권 홈", url: "/" }, { name: hubTitle, url: base }])}
    <section class="section section--tight">
      <div class="wrap">
        <span class="eyebrow">${eyebrow}</span>
        <h1>${hubTitle}</h1>
      </div>
    </section>
    ${linkCards(hubTitle, eyebrow, cards)}
    ${policyNotice()}
    ${eeatBlock()}`,
    breadcrumb: [{ name: "수도권 홈", url: "/" }, { name: hubTitle, url: base }]
  });

  // 개별
  items.forEach((it) => {
    const crumbs = [
      { name: "수도권 홈", url: "/" },
      { name: hubTitle, url: base },
      { name: it.name, url: `${base}${it.slug}/` }
    ];
    const faq = it.faq || [];
    addPage({
      url: `${base}${it.slug}/`,
      title: `${it.title} · ${SITE.name}`,
      description: it.desc,
      body: `
      ${breadcrumb(crumbs)}
      <section class="section section--tight">
        <div class="wrap">
          <span class="eyebrow">${eyebrow}</span>
          <h1>${it.h1}</h1>
          <div class="prose">${it.body}</div>
        </div>
      </section>
      ${linkCards("관련 안내", "내부 링크", it.related || [
        { url: "/check/", title: "예약 전 확인", desc: "방문 주소·이동비·개인정보 기준" },
        { url: "/use/", title: "이용 장소별 안내", desc: "자택·호텔·오피스텔·업무지구" },
        { url: "/contact/", title: "문의하기", desc: "전화·텔레그램 예약 문의" }
      ])}
      ${policyNotice()}
      ${faqBlock(faq)}
      ${eeatBlock()}`,
      faq,
      breadcrumb: crumbs,
      noindex: !!it.noindex
    });
  });
}

function buildPolicies() {
  POLICIES.forEach((p) => {
    const crumbs = [
      { name: "수도권 홈", url: "/" },
      { name: "운영 기준", url: "/policy/" },
      { name: p.name, url: `/policy/${p.slug}/` }
    ];
    addPage({
      url: `/policy/${p.slug}/`,
      title: `${p.title} · ${SITE.name}`,
      description: p.desc,
      body: `
      ${breadcrumb(crumbs)}
      <section class="section section--tight">
        <div class="wrap">
          <span class="eyebrow">운영 기준</span>
          <h1>${p.h1}</h1>
          <div class="prose">${p.body}</div>
        </div>
      </section>
      ${eeatBlock()}`,
      breadcrumb: crumbs
    });
  });
}

function buildContact() {
  const crumbs = [{ name: "수도권 홈", url: "/" }, { name: "문의하기", url: "/contact/" }];
  addPage({
    url: "/contact/",
    title: `문의하기｜전화·텔레그램 예약 · ${SITE.name}`,
    description: "RelaxNest 전화예약 0508-202-4719 및 텔레그램 제작·제휴 문의 안내",
    body: `
    ${breadcrumb(crumbs)}
    <section class="section section--tight">
      <div class="wrap">
        <span class="eyebrow">문의하기</span>
        <h1>예약 및 문의 안내</h1>
        <div class="prose">
          <p>방문 지역과 시간대, 이용 장소를 확인한 뒤 안내해 드립니다. 예약 전 <a href="/check/">확인사항</a>을 함께 살펴보시면 더 빠르게 진행됩니다.</p>
        </div>
        <div class="grid grid-3" style="margin-top:var(--sp-5)">
          <div class="card">
            <h3>전화예약</h3>
            <p>${SITE.name} 대표 예약 번호</p>
            <a class="btn btn-gold" href="${SITE.phoneHref}">${SITE.phone}</a>
          </div>
          <div class="card">
            <h3>웹사이트 제작문의</h3>
            <p>텔레그램으로 빠르게 상담</p>
            <a class="btn btn-orange" href="${SITE.telegram.build}" target="_blank" rel="noopener nofollow">제작문의 열기</a>
          </div>
          <div class="card">
            <h3>제휴문의</h3>
            <p>텔레그램으로 빠르게 상담</p>
            <a class="btn btn-orange" href="${SITE.telegram.partner}" target="_blank" rel="noopener nofollow">제휴문의 열기</a>
          </div>
        </div>
      </div>
    </section>
    ${policyNotice()}
    ${eeatBlock()}`,
    breadcrumb: crumbs
  });
}

/* =========================================================================
   4) 출력 (dist 작성 + sitemap + robots + assets)
   ========================================================================= */
function rimraf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    e.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

function writeAll() {
  rimraf(DIST);
  fs.mkdirSync(DIST, { recursive: true });

  pages.forEach((p) => {
    const html = render(p);
    const rel = p.url === "/" ? "index.html" : p.url.replace(/^\//, "") + "index.html";
    const out = path.join(DIST, rel);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html, "utf8");
  });

  // assets
  copyDir(path.join(__dirname, "assets"), path.join(DIST, "assets"));

  // sitemap (noindex 제외)
  const urls = pages
    .filter((p) => !p.noindex)
    .map(
      (p) =>
        `  <url><loc>${SITE.baseUrl}${p.url}</loc><changefreq>weekly</changefreq></url>`
    )
    .join("\n");
  fs.writeFileSync(
    path.join(DIST, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    "utf8"
  );

  // robots
  fs.writeFileSync(
    path.join(DIST, "robots.txt"),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE.baseUrl}/sitemap.xml\n`,
    "utf8"
  );

  console.log(`✓ ${pages.length} pages → dist/`);
}

/* ---------- run ---------- */
buildHome();
buildRegions();
buildSimpleSet(
  USE_CASES,
  "/use/",
  "이용 장소별 안내",
  "이용 장소별 안내",
  "자택·호텔·오피스텔·업무지구·공항 등 이용 장소별 출장마사지 확인사항"
);
buildSimpleSet(
  CHECKS,
  "/check/",
  "예약 전 확인",
  "예약 전 확인 안내",
  "출장마사지 예약 전 방문 주소·이동비·개인정보·서비스 기준 확인 안내"
);
addPage({
  url: "/policy/",
  title: `운영 기준 안내 · ${SITE.name}`,
  description: "RelaxNest 개인정보 처리방침·서비스 이용 기준·불법 서비스 불가 안내",
  body: `${breadcrumb([{ name: "수도권 홈", url: "/" }, { name: "운영 기준", url: "/policy/" }])}
  <section class="section section--tight"><div class="wrap"><span class="eyebrow">운영 기준</span><h1>운영 기준 안내</h1></div></section>
  ${linkCards("운영 기준", "운영 기준", POLICIES.map((p) => ({ url: `/policy/${p.slug}/`, title: p.name, desc: p.desc })))}
  ${eeatBlock()}`,
  breadcrumb: [{ name: "수도권 홈", url: "/" }, { name: "운영 기준", url: "/policy/" }]
});
buildPolicies();
buildContact();
writeAll();
