"use strict";

const SITE = require("../data/site.json");

/* 브레드크럼 HTML (스키마는 layout에서 별도 생성) */
function breadcrumb(crumbs) {
  const items = crumbs
    .map((c, i) => {
      const last = i === crumbs.length - 1;
      const sep = i > 0 ? '<span class="sep">/</span>' : "";
      return last
        ? `${sep}<span aria-current="page">${c.name}</span>`
        : `${sep}<a href="${c.url}">${c.name}</a>`;
    })
    .join("");
  return `<div class="wrap"><nav class="breadcrumb" aria-label="breadcrumb">${items}</nav></div>`;
}

/* FAQ 아코디언 */
function faqBlock(faq, heading = "자주 묻는 질문") {
  if (!faq || !faq.length) return "";
  const items = faq
    .map(
      (f) =>
        `<details><summary>${f.q}</summary><p>${f.a}</p></details>`
    )
    .join("\n");
  return `
  <section class="section section--tight">
    <div class="wrap">
      <span class="eyebrow">FAQ</span>
      <h2>${heading}</h2>
      <div class="faq">${items}</div>
    </div>
  </section>`;
}

/* E-E-A-T + Who/How/Why 블록 (모든 주요 페이지 하단) */
function eeatBlock(opts = {}) {
  const who =
    opts.who ||
    "이 페이지는 수도권 방문형 관리 서비스 지역 안내 콘텐츠 담당자가 작성하고 운영 책임자가 검수합니다.";
  const how =
    opts.how ||
    "공식 행정구역, 주요 생활권, 가까운 지하철역, 이용 장소별 확인사항, 예약 전 체크리스트를 기준으로 구성했습니다.";
  const why =
    opts.why ||
    "서울·경기·인천에서 방문형 서비스를 찾는 사용자가 자기 지역과 이용 장소를 안전하게 확인할 수 있도록 돕기 위해 작성했습니다.";
  return `
  <section class="section section--tight">
    <div class="wrap">
      <div class="eeat">
        <h3>작성·검수 정보</h3>
        <p><strong>작성자</strong> ${SITE.author} · <strong>검수자</strong> ${SITE.reviewer}<br>
        본 콘텐츠는 공식 행정구역, 실제 생활권, 지하철역, 이용 장소별 예약 전 확인사항을 기준으로 작성하며,
        행정구역 개편·지하철역 변화·생활권 변화·콘텐츠 품질 점검 결과를 반영해 갱신합니다.</p>
        <div class="whw">
          <div><strong>Who</strong>${who}</div>
          <div><strong>How</strong>${how}</div>
          <div><strong>Why</strong>${why}</div>
        </div>
      </div>
    </div>
  </section>`;
}

/* 운영 기준 / 불법·선정적 서비스 불가 안내 (모든 주요 페이지 연결) */
function policyNotice() {
  return `
  <section class="section section--tight">
    <div class="wrap">
      <div class="card" style="border-color:var(--c-line)">
        <h3>안전한 이용을 위한 운영 기준</h3>
        <p>RelaxNest는 <a href="/policy/illegal-notice/">불법·선정적 서비스를 안내하지 않습니다</a>.
        허위 후기, 가짜 평점, 과장된 할인 문구를 사용하지 않으며, 개인정보는 예약 확인과 연락에 필요한
        최소 범위만 안내합니다. 자세한 내용은 <a href="/policy/privacy/">개인정보 처리방침</a>과
        <a href="/check/customer-notice/">고객 유의사항</a>을 확인하세요.</p>
      </div>
    </div>
  </section>`;
}

/* 내부링크 카드 그리드 */
function linkCards(heading, eyebrow, cards) {
  const items = cards
    .map(
      (c) => `
      <a class="card" href="${c.url}">
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <span class="card-link">자세히 보기 →</span>
      </a>`
    )
    .join("\n");
  return `
  <section class="section">
    <div class="wrap">
      ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ""}
      <h2>${heading}</h2>
      <div class="grid grid-3">${items}</div>
    </div>
  </section>`;
}

/* 히어로 (좌측 텍스트 · 우측 이미지) — 메인·지역·생활권 공통 */
function hero({ eyebrow, h1, lede, cta = "", alt, img = "/assets/img/hero.webp" }) {
  return `
  <section class="hero">
    <div class="wrap hero-grid">
      <div class="hero-copy">
        ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ""}
        <h1>${h1}</h1>
        ${lede ? `<p class="lede">${lede}</p>` : ""}
        ${cta ? `<div class="hero-cta">${cta}</div>` : ""}
      </div>
      <div class="hero-media">
        <img src="${img}" alt="${alt || "RelaxNest 프리미엄 관리 공간 안내 이미지"}" width="1448" height="1086" decoding="async">
      </div>
    </div>
  </section>`;
}

module.exports = { breadcrumb, faqBlock, eeatBlock, policyNotice, linkCards, hero };
