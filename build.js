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
  linkCards,
  hero,
  pricing
} = require("./templates/components");
const REGIONS = require("./data/regions.json");

// 행정구(구/시군/구군) + 행정동 데이터 부착
REGIONS.seoul.districts = require("./data/seoul-districts.json");
REGIONS.gyeonggi.districts = require("./data/gyeonggi-districts.json");
REGIONS.incheon.districts = require("./data/incheon-districts.json");

// 지하철역(역세권) 데이터 부착
REGIONS.seoul.stations = require("./data/seoul-stations.json");
REGIONS.gyeonggi.stations = require("./data/gyeonggi-stations.json");
REGIONS.incheon.stations = require("./data/incheon-stations.json");

// 슬러그→이름 조회용 맵
function districtName(r, slug) {
  const d = (r.districts || []).find((x) => x.slug === slug);
  return d ? d.name : null;
}
function lifeName(r, slug) {
  const l = (r.life || []).find((x) => x.slug === slug);
  return l ? l.name : null;
}

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
  ${hero({
    eyebrow: "서울 · 경기 · 인천",
    h1: "서울·경기·인천 출장마사지<br>수도권 지역별 예약 안내",
    lede: `서울, 경기, 인천 주요 지역과 생활권, 지하철역, 자택·호텔·오피스텔 이용 기준을 한 번에 확인하세요. 전화예약 <a href="${SITE.phoneHref}">${SITE.phone}</a>`,
    cta: `
        <a class="btn btn-gold" href="/seoul/">서울 보기</a>
        <a class="btn btn-ghost" href="/gyeonggi/">경기 보기</a>
        <a class="btn btn-ghost" href="/incheon/">인천 보기</a>
        <a class="btn btn-ghost" href="/check/">예약 전 확인</a>`,
    alt: "RelaxNest 수도권 프리미엄 관리 공간 안내 이미지"
  })}

  ${pricing()}

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

    const districtCards = r.districts.map((d) => ({
      url: `/${r.slug}/${d.slug}/`,
      title: `${d.name} 출장마사지`,
      desc: `${d.focus} 중심 · ${d.stations}`
    }));

    const hubBody = `
    ${breadcrumb(crumbs)}
    ${hero({
      eyebrow: `${r.name} 지역 안내`,
      h1: r.h1,
      lede: r.intro,
      cta: `<a class="btn btn-gold" href="/contact/">예약 문의</a><a class="btn btn-ghost" href="/check/">예약 전 확인</a>`,
      alt: `${r.name} 방문형 관리 안내 이미지`
    })}

    ${linkCards(`${r.name} 행정구역별 안내`, "구·시군별 바로가기", districtCards)}

    ${pricing()}

    ${linkCards(`${r.name} 핵심 생활권`, "생활권별 안내", lifeCards)}

    ${linkCards(`${r.name} 주요 지하철역`, "역세권별 안내", (r.stations || []).slice(0, 6).map((s) => ({
      url: `/${r.slug}/station/${s.slug}/`,
      title: `${s.name} 출장마사지`,
      desc: `${s.lines} · ${s.focus}`
    })).concat([{ url: `/${r.slug}/station/`, title: `${r.name} 역세권 전체`, desc: "주요 지하철역 역세권 안내 모음" }]))}

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
      ${hero({
        eyebrow: `${r.name} · ${l.focus}`,
        h1: `${l.name} 출장마사지 생활권 안내`,
        lede: l.desc,
        cta: `<a class="btn btn-gold" href="/contact/">예약 문의</a>`,
        alt: `${l.name} 생활권 방문형 관리 안내 이미지`
      })}
      <section class="section section--tight">
        <div class="wrap">
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

      ${pricing()}

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

    // 행정구(구/시군/구군) + 행정동 페이지
    r.districts.forEach((d) => buildDistrict(r, d));

    // 지하철역(역세권) 허브 + 개별 페이지
    buildStations(r);
  });
}

/* 경기 일반구 (시 → 일반구) 허브 페이지 (색인 대상) */
const GYEONGGI_SUBGU = require("./data/gyeonggi-subgu.json");
function subGuCards(r, d) {
  if (r.slug !== "gyeonggi") return [];
  const entry = GYEONGGI_SUBGU.find((e) => e.city === d.slug);
  if (!entry) return [];
  return entry.gu.map((g) => ({
    url: `/gyeonggi/${d.slug}/${g.slug}/`,
    title: `${g.name} 출장마사지`,
    desc: `${g.focus} · ${g.stations}`
  }));
}
function buildSubGu() {
  const r = REGIONS.gyeonggi;
  GYEONGGI_SUBGU.forEach((entry) => {
    const cityName = districtName(r, entry.city);
    if (!cityName) return;
    entry.gu.forEach((g) => {
      const base = `/gyeonggi/${entry.city}/${g.slug}/`;
      const crumbs = [
        { name: "수도권 홈", url: "/" },
        { name: "경기", url: "/gyeonggi/" },
        { name: cityName, url: `/gyeonggi/${entry.city}/` },
        { name: g.name, url: base }
      ];
      const dongLinks = (g.dongs || []).map((d) => ({
        url: `/gyeonggi/${entry.city}/${d.slug}/`,
        title: `${d.name} 출장마사지`,
        desc: `${g.name} ${d.name} 방문 전 확인 안내`
      }));
      const gFaq = [
        { q: `${cityName} ${g.name}도 방문 가능한가요?`, a: `${g.name} 전역과 인접 권역을 기준으로 정확한 방문 주소와 가까운 역을 확인한 뒤 안내합니다.` },
        { q: `${g.name}에서 무엇을 먼저 확인해야 하나요?`, a: `${g.focus} 중심 권역으로 건물 출입 방식과 이용 장소(자택·호텔·오피스텔) 정책을 먼저 확인하면 좋습니다.` },
        { q: "불법·선정적 서비스도 가능한가요?", a: "불법·선정적 서비스는 제공하거나 안내하지 않습니다." }
      ];
      addPage({
        url: base,
        title: `${cityName} ${g.name} 출장마사지｜행정동별 예약 안내 · ${SITE.name}`,
        description: `${cityName} ${g.name} ${g.focus} 행정동·역세권 예약 전 확인 안내`.slice(0, 80),
        body: `
        ${breadcrumb(crumbs)}
        ${hero({
          eyebrow: `경기 ${cityName} · ${g.focus}`,
          h1: `${cityName} ${g.name} 출장마사지 · 행정동별 예약 안내`,
          lede: g.char,
          cta: `<a class="btn btn-gold" href="/contact/">예약 문의</a><a class="btn btn-ghost" href="/gyeonggi/${entry.city}/">${cityName} 전체</a>`,
          alt: `${cityName} ${g.name} 방문형 관리 안내 이미지`
        })}
        <section class="section section--tight">
          <div class="wrap">
            <div class="prose">
              <h2>${cityName} ${g.name} 개요</h2>
              <p>${g.char} 가까운 역은 ${g.stations}입니다. 번호동은 대표 행정동으로 묶어 안내하며, 출구별·노선별 페이지는 만들지 않습니다.</p>
              <h2>이용 장소별 확인사항</h2>
              <p>${g.focus} 중심 권역으로, 자택은 공동현관 출입 방식, 오피스텔은 관리 규정과 방문 가능 시간, 호텔·숙소는 객실 출입 정책을 확인하세요.</p>
              <h2>예약 전 체크리스트</h2>
              <ul>
                <li>정확한 방문 주소와 동·호수</li>
                <li>공동현관·건물 출입 방식</li>
                <li>이용 장소(자택·호텔·오피스텔) 정책</li>
                <li><a href="/check/travel-fee/">추가 이동비 기준</a> · <a href="/check/privacy/">개인정보 처리 기준</a></li>
              </ul>
            </div>
          </div>
        </section>
        ${dongLinks.length ? linkCards(`${g.name} 행정동 바로가기`, "행정동별 안내", dongLinks) : ""}
        ${pricing()}
        ${linkCards("관련 안내", "내부 링크", [
          { url: `/gyeonggi/${entry.city}/`, title: `${cityName} 전체 보기`, desc: `${cityName} 행정동·생활권 허브` },
          { url: "/gyeonggi/", title: "경기 전체 보기", desc: "경기 시군·생활권 허브" },
          { url: "/check/", title: "예약 전 확인", desc: "방문 주소·이동비·개인정보 기준" }
        ])}
        ${policyNotice()}
        ${faqBlock(gFaq)}
        ${eeatBlock({
          who: `이 페이지는 ${SITE.author}가 작성하고 ${SITE.reviewer}가 검수합니다.`,
          how: `${cityName} ${g.name}의 공식 행정구역, ${g.stations} 등 가까운 역, ${g.focus} 중심 이용 장소 기준으로 구성했습니다.`,
          why: `${cityName} ${g.name}에서 방문형 서비스를 찾는 사용자가 행정동·이동 기준을 안전하게 확인할 수 있도록 작성했습니다.`
        })}`,
        faq: gFaq,
        breadcrumb: crumbs
      });
    });
  });
}

/* 지하철역 허브 + 개별 역세권 페이지 (색인 대상) */
function buildStations(r) {
  const base = `/${r.slug}/station/`;
  const stations = r.stations || [];
  const crumbs = [
    { name: "수도권 홈", url: "/" },
    { name: r.name, url: `/${r.slug}/` },
    { name: "지하철역", url: base }
  ];

  // 허브
  addPage({
    url: base,
    title: `${r.name} 지하철역 출장마사지｜역세권별 예약 안내 · ${SITE.name}`,
    description: `${r.name} 강남역·수원역·부평역 등 주요 지하철역 역세권 예약 안내`.slice(0, 80),
    body: `
    ${breadcrumb(crumbs)}
    ${hero({
      eyebrow: `${r.name} 역세권 안내`,
      h1: `${r.name} 지하철역 출장마사지 · 역세권별 예약 안내`,
      lede: `${r.name} 주요 지하철역을 기준으로 가까운 행정구·생활권과 이용 장소별 확인사항을 안내합니다. 출구별·노선별로 페이지를 나누지 않고 역명 기준으로 정리합니다.`,
      cta: `<a class="btn btn-gold" href="/contact/">예약 문의</a><a class="btn btn-ghost" href="/${r.slug}/">${r.name} 전체</a>`,
      alt: `${r.name} 역세권 방문형 관리 안내 이미지`
    })}
    ${linkCards(`${r.name} 주요 역세권`, "지하철역별 안내", stations.map((s) => ({
      url: `${base}${s.slug}/`,
      title: `${s.name} 출장마사지`,
      desc: `${s.lines} · ${s.focus}`
    })))}
    ${pricing()}
    ${policyNotice()}
    ${eeatBlock()}`,
    breadcrumb: crumbs
  });

  // 개별 역
  stations.forEach((s) => {
    const sc = [...crumbs, { name: s.name, url: `${base}${s.slug}/` }];
    const dName = s.district ? districtName(r, s.district) : null;
    const lName = s.life ? lifeName(r, s.life) : null;
    const sFaq = [
      { q: `${s.name} 근처도 방문 가능한가요?`, a: `${s.name} 역세권과 인접 권역을 기준으로 정확한 방문 주소와 가까운 출입구를 확인한 뒤 안내합니다.` },
      { q: "출구별로 안내가 다른가요?", a: "출구별·노선별로 페이지를 나누지 않고 역명 기준으로 안내하며, 정확한 건물 주소와 가까운 출입구를 공유하면 이동이 원활합니다." },
      { q: "불법·선정적 서비스도 가능한가요?", a: "불법·선정적 서비스는 제공하거나 안내하지 않습니다." }
    ];
    const related = [];
    if (dName) related.push({ url: `/${r.slug}/${s.district}/`, title: `${dName} 전체 보기`, desc: `${dName} 행정동·생활권 안내` });
    if (lName) related.push({ url: `/${r.slug}/life/${s.life}/`, title: `${lName} 생활권`, desc: `${lName} 생활권 예약 안내` });
    related.push({ url: base, title: `${r.name} 역세권 전체`, desc: `${r.name} 주요 지하철역 모음` });

    addPage({
      url: `${base}${s.slug}/`,
      title: `${s.name} 출장마사지｜${r.name} 역세권 예약 안내 · ${SITE.name}`,
      description: `${s.name}(${s.lines}) ${s.focus} 역세권 방문형 관리 예약 전 확인 안내`.slice(0, 80),
      body: `
      ${breadcrumb(sc)}
      ${hero({
        eyebrow: `${r.name} · ${s.lines}`,
        h1: `${s.name} 출장마사지 · 역세권 예약 안내`,
        lede: s.char,
        cta: `<a class="btn btn-gold" href="/contact/">예약 문의</a><a class="btn btn-ghost" href="${base}">${r.name} 역세권</a>`,
        alt: `${s.name} 역세권 방문형 관리 안내 이미지`
      })}
      <section class="section section--tight">
        <div class="wrap">
          <div class="prose">
            <h2>${s.name} 역세권 개요</h2>
            <p>${s.char} ${dName ? `행정구역상 <a href="/${r.slug}/${s.district}/">${dName}</a>에 속하며` : ""} ${lName ? `<a href="/${r.slug}/life/${s.life}/">${lName} 생활권</a>과 인접해 있습니다.` : "인접 생활권과 함께 확인하면 좋습니다."}</p>
            <h2>이용 장소별 확인사항</h2>
            <p>${s.focus} 성격의 역세권으로, 자택은 공동현관 출입 방식, 오피스텔은 관리 규정과 방문 가능 시간, 호텔·숙소는 객실 출입 정책을 확인하세요. 업무지구가 포함된 경우 방문자 등록 절차와 출입 가능 시간을 함께 확인합니다.</p>
            <h2>출구·환승 안내</h2>
            <p>${s.name}은 출구별·노선별로 페이지를 나누지 않고 역명 기준으로 안내합니다. 환승역의 경우 동선이 넓어 정확한 방문 주소와 가까운 출입구를 함께 공유하면 이동이 원활합니다.</p>
            <h2>예약 전 체크리스트</h2>
            <ul>
              <li>정확한 방문 주소와 동·호수</li>
              <li>가까운 출입구와 건물 위치</li>
              <li>이용 장소(자택·호텔·오피스텔) 정책</li>
              <li>예약 가능 시간과 변경 기준</li>
              <li><a href="/check/privacy/">개인정보 처리 기준</a> 확인</li>
            </ul>
          </div>
        </div>
      </section>
      ${pricing()}
      ${linkCards("관련 안내", "내부 링크", related)}
      ${policyNotice()}
      ${faqBlock(sFaq)}
      ${eeatBlock({
        who: `이 페이지는 ${SITE.author}가 작성하고 ${SITE.reviewer}가 검수합니다.`,
        how: `${s.name}(${s.lines}) 역세권을 기준으로 가까운 행정구·생활권과 ${s.focus} 중심 이용 장소 기준으로 구성했습니다.`,
        why: `${s.name} 인근에서 방문형 서비스를 찾는 사용자가 역세권 이동 기준을 안전하게 확인할 수 있도록 작성했습니다.`
      })}`,
      faq: sFaq,
      breadcrumb: sc
    });
  });
}

/* 행정구 페이지 (색인 대상) + 소속 행정동 페이지 (대표동·noindex) */
function buildDistrict(r, d) {
  const base = `/${r.slug}/${d.slug}/`;
  const crumbs = [
    { name: "수도권 홈", url: "/" },
    { name: r.name, url: `/${r.slug}/` },
    { name: d.name, url: base }
  ];
  const dongs = d.dongs || [];
  const dongCards = dongs.map((g) => ({
    url: `${base}${g.slug}/`,
    title: `${g.name} 출장마사지`,
    desc: `${g.type} 권역 · 가까운 역 ${g.station}`
  }));

  const dFaq = [
    { q: `${d.name} 어디까지 방문 가능한가요?`, a: `${d.name} 전역과 인접 권역을 기준으로 정확한 방문 주소와 가까운 역을 확인한 뒤 안내합니다.` },
    { q: `${d.name}에서 무엇을 먼저 확인해야 하나요?`, a: `${d.focus} 중심 권역으로, 건물 출입 방식과 이용 장소(자택·호텔·오피스텔) 정책을 먼저 확인하면 좋습니다.` },
    { q: "불법·선정적 서비스도 가능한가요?", a: "불법·선정적 서비스는 제공하거나 안내하지 않습니다." }
  ];

  const dongListHtml = dongs.length
    ? `<ul>${dongs
        .map(
          (g) =>
            `<li><a href="${base}${g.slug}/">${g.name}</a> — ${g.type}, 가까운 역 ${g.station}</li>`
        )
        .join("")}</ul>`
    : "<p>대표 행정동 페이지는 본문 품질이 확보되는 대로 순차 공개합니다.</p>";

  const dBody = `
  ${breadcrumb(crumbs)}
  ${hero({
    eyebrow: `${r.name} · ${d.focus}`,
    h1: `${d.name} 출장마사지 · 행정동별 예약 안내`,
    lede: d.char,
    cta: `<a class="btn btn-gold" href="/contact/">예약 문의</a><a class="btn btn-ghost" href="/${r.slug}/">${r.name} 전체</a>`,
    alt: `${d.name} 방문형 관리 안내 이미지`
  })}

  <section class="section section--tight">
    <div class="wrap">
      <div class="prose">
        <h2>${d.name} 개요</h2>
        <p>${d.char} 번호동(예: 1·2동)은 개별 페이지를 만들지 않고 대표 행정동으로 묶어 안내하며, 출구별·노선별 페이지도 만들지 않습니다.</p>
        <h2>대표 행정동</h2>
        ${dongListHtml}
        <h2>가까운 지하철역</h2>
        <p>가까운 역은 <strong>${d.stations}</strong>입니다. 정확한 방문 주소와 가까운 출입구를 함께 공유하면 이동이 원활합니다.</p>
        <h2>이용 장소별 확인사항</h2>
        <p>${d.focus} 중심 권역으로, 자택은 공동현관 출입 방식, 오피스텔은 관리 규정과 방문 가능 시간, 호텔·숙소는 객실 출입 정책을 확인하세요. 업무지구가 포함된 경우 방문자 등록 절차와 출입 가능 시간을 함께 확인합니다.</p>
        <h2>예약 전 체크리스트</h2>
        <ul>
          <li>정확한 방문 주소와 동·호수</li>
          <li>공동현관·건물 출입 방식</li>
          <li>이용 장소(자택·호텔·오피스텔) 정책</li>
          <li>예약 가능 시간과 변경 기준</li>
          <li><a href="/check/travel-fee/">추가 이동비 기준</a> · <a href="/check/privacy/">개인정보 처리 기준</a></li>
        </ul>
      </div>
    </div>
  </section>

  ${subGuCards(r, d).length ? linkCards(`${d.name} 일반구별 안내`, "일반구 바로가기", subGuCards(r, d)) : ""}

  ${dongCards.length ? linkCards(`${d.name} 행정동 바로가기`, "행정동별 안내", dongCards) : ""}

  ${pricing()}

  ${linkCards("관련 안내", "내부 링크", [
    { url: `/${r.slug}/`, title: `${r.name} 전체 보기`, desc: `${r.name} 구·시군·생활권 허브` },
    { url: "/use/", title: "이용 장소별 안내", desc: "자택·호텔·오피스텔·업무지구 기준" },
    { url: "/check/", title: "예약 전 확인", desc: "방문 주소·이동비·개인정보 기준" }
  ])}

  ${policyNotice()}
  ${faqBlock(dFaq)}
  ${eeatBlock({
    who: `이 페이지는 ${SITE.author}가 작성하고 ${SITE.reviewer}가 검수합니다.`,
    how: `${d.name}의 공식 행정구역, ${d.stations} 등 가까운 역, ${d.focus} 중심 이용 장소 기준으로 구성했습니다.`,
    why: `${d.name}에서 방문형 서비스를 찾는 사용자가 행정동·이동 기준을 안전하게 확인할 수 있도록 작성했습니다.`
  })}`;

  addPage({
    url: base,
    title: `${d.name} 출장마사지｜${r.name} 행정동별 예약 안내 · ${SITE.name}`,
    description: `${d.name} ${d.focus} 중심 행정동·지하철역·이용 장소별 예약 전 확인 안내`.slice(0, 80),
    body: dBody,
    faq: dFaq,
    breadcrumb: crumbs
  });

  // 행정동 페이지 (대표동) — 도어웨이 방지: 차별화 본문 + noindex, 사용자 탐색은 가능
  dongs.forEach((g) => {
    const gc = [...crumbs, { name: g.name, url: `${base}${g.slug}/` }];
    const gFaq = [
      { q: `${g.name}도 방문 가능한가요?`, a: `${g.name}(${d.name}) 일대를 기준으로 정확한 방문 주소와 가까운 역(${g.station})을 확인한 뒤 안내합니다.` },
      { q: "건물 출입은 무엇을 확인하나요?", a: "공동현관·엘리베이터·관리 규정 등 건물 출입 방식과 방문 가능 시간을 확인합니다." }
    ];
    const gBody = `
    ${breadcrumb(gc)}
    ${hero({
      eyebrow: `${d.name} · ${g.type}`,
      h1: `${g.name} 출장마사지 예약 안내`,
      lede: `${g.name}은 ${d.name}의 ${g.type} 권역으로 가까운 역은 ${g.station}입니다.`,
      cta: `<a class="btn btn-gold" href="/contact/">예약 문의</a><a class="btn btn-ghost" href="${base}">${d.name} 전체</a>`,
      alt: `${g.name} 방문형 관리 안내 이미지`
    })}
    <section class="section section--tight">
      <div class="wrap">
        <div class="prose">
          <p>${g.name}은 ${d.name}에 속한 ${g.type} 성격의 권역입니다. ${d.char}</p>
          <h2>이용 장소별 확인사항</h2>
          <p>가까운 역은 <strong>${g.station}</strong>입니다. 자택은 공동현관 출입 방식, 오피스텔은 관리 규정과 방문 가능 시간, 호텔·숙소는 객실 출입 정책을 먼저 확인하세요. 출구별·노선별 안내 대신 정확한 방문 주소와 가까운 출입구를 공유하면 이동이 원활합니다.</p>
          <h2>예약 전 체크리스트</h2>
          <ul>
            <li>정확한 방문 주소와 동·호수</li>
            <li>공동현관·건물 출입 방식</li>
            <li>예약 가능 시간과 변경 기준</li>
            <li><a href="/check/privacy/">개인정보 처리 기준</a> 확인</li>
          </ul>
        </div>
      </div>
    </section>
    ${pricing()}
    ${linkCards("관련 안내", "내부 링크", [
      { url: base, title: `${d.name} 전체 보기`, desc: `${d.name} 행정동·생활권 안내` },
      { url: `/${r.slug}/`, title: `${r.name} 전체 보기`, desc: `${r.name} 구·시군 허브` },
      { url: "/check/", title: "예약 전 확인", desc: "방문 주소·이동비·개인정보 기준" }
    ])}
    ${policyNotice()}
    ${faqBlock(gFaq)}
    ${eeatBlock()}`;

    addPage({
      url: `${base}${g.slug}/`,
      title: `${g.name} 출장마사지｜${d.name} 예약 안내 · ${SITE.name}`,
      description: `${g.name}(${d.name}) ${g.type} 권역 방문형 관리 예약 전 확인 안내`.slice(0, 80),
      body: gBody,
      faq: gFaq,
      breadcrumb: gc,
      noindex: true
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
buildSubGu();
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
