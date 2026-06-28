"use strict";

const SITE = require("../data/site.json");
const REVIEWS = require("../data/reviews.json");

function stars(n) {
  const full = "★".repeat(n);
  const empty = "☆".repeat(5 - n);
  return `<span class="stars" aria-label="${n}점">${full}<span class="stars-off">${empty}</span></span>`;
}

/* 고객 후기 + 평점 섹션 */
function reviewsBlock(limit) {
  const items = REVIEWS.items.slice(0, limit || 6);
  const cards = items
    .map(
      (r) => `
      <figure class="review-card">
        <div class="review-top">${stars(r.rating)}<span class="review-area">${r.area}</span></div>
        <blockquote>${r.text}</blockquote>
        <figcaption>${r.author} · <time datetime="${r.date}">${r.date.replace(/-/g, ".")}</time></figcaption>
      </figure>`
    )
    .join("");
  return `
  <section class="section section--tight">
    <div class="wrap">
      <span class="eyebrow">고객 후기 · 평점</span>
      <h2>이용 후기 <span class="rating-badge">★ ${REVIEWS.ratingValue} / 5 · ${REVIEWS.reviewCount}건</span></h2>
      <p class="lede">RelaxNest를 이용한 고객님들의 후기입니다.</p>
      <div class="grid grid-3" style="margin-top:var(--sp-5)">${cards}</div>
    </div>
  </section>`;
}

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

/* 코스 시간 기본 요금표 — 메인·모든 지역 페이지 공통 */
function pricing(opts = {}) {
  const note =
    opts.note ||
    "방문 지역과 시간대, 이동 거리에 따라 최종 금액은 통화 시 확정됩니다.";
  return `
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
      <p class="price-desc" style="text-align:center;margin-top:var(--sp-4)">${note} <a href="/check/travel-fee/">요금·예약 기준 자세히 보기 →</a></p>
    </div>
  </section>`;
}

/* 롱테일 내부링크 허브 (열 단위 링크 목록) */
function linkColumns(heading, eyebrow, groups) {
  const cols = groups
    .map(
      (g) => `
      <div>
        <h3>${g.title}</h3>
        <ul>${g.links.map((l) => `<li><a href="${l.url}">${l.text}</a></li>`).join("")}</ul>
      </div>`
    )
    .join("");
  return `
  <section class="section section--tight">
    <div class="wrap">
      ${eyebrow ? `<span class="eyebrow">${eyebrow}</span>` : ""}
      <h2>${heading}</h2>
      <div class="link-cols">${cols}</div>
    </div>
  </section>`;
}

module.exports = { breadcrumb, faqBlock, eeatBlock, policyNotice, linkCards, hero, pricing, linkColumns, reviewsBlock };
