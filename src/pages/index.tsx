import React, { useState } from "react";
import Image from "next/image";
import acaimage from "../assets/acaimage.jpg";

const classes = {
  page: "relative min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,var(--color-hero-1)_0%,var(--color-hero-2)_45%,var(--color-hero-3)_100%)] pt-24 font-manrope text-[var(--color-secondary)]",
  header:
    "fixed inset-x-0 top-0 z-10 flex flex-wrap items-center justify-between gap-5 border-b border-[rgba(var(--color-border-rgb)/0.08)] bg-[rgba(var(--color-parchment-rgb)/0.9)] px-8 py-6 backdrop-blur-[14px] lg:flex-nowrap lg:gap-0 lg:px-16 lg:py-7",
  nav: "flex w-full items-center justify-between gap-7 text-[0.75rem] uppercase tracking-[0.12em] text-[var(--color-secondary)]/80 md:w-auto md:justify-start md:text-[0.95rem]",
  menuButton:
    "flex items-center gap-2 rounded-full border border-[rgba(var(--color-primary-rgb)/20)] px-3 py-2 text-[0.7rem] uppercase tracking-[0.18em] transition duration-300 hover:bg-[var(--color-primary)]/10 md:text-[0.8rem]",
  menuPanel:
    "absolute right-0 mt-3 w-44 origin-top-right rounded-2xl border border-[rgba(var(--color-primary-rgb)/10)] bg-[rgba(var(--color-cream-rgb)/0.98)] p-3 text-left text-[0.75rem] uppercase tracking-[0.14em] text-[var(--color-primary)]/80 shadow-[0_18px_40px_rgba(var(--color-primary-rgb)/0.12)] transition duration-200 ease-out",
  menuItem: "block rounded-lg px-3 py-2 hover:bg-[var(--color-primary)]/10",
  outlineButton:
    "rounded-full border border-[rgba(var(--color-primary-rgb)/30)] bg-[transparent] px-5 py-3 text-[0.75rem] uppercase tracking-[0.14em] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-primary)]/10",
  mainSection:
    "relative grid items-center gap-16 px-8 pb-[140px] pt-[170px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.6fr)] lg:px-16",
  mainGlow:
    "aca-pulse absolute -right-[120px] -top-[120px] h-[420px] w-[420px] bg-[radial-gradient(circle,rgba(var(--color-accent-rgb)/0.45),transparent_70%)] blur-[40px]",
  primaryButton:
    "rounded-full bg-[var(--color-primary)] px-[26px] py-[14px] text-[0.9rem] text-[var(--color-parchment)] shadow-[0_12px_24px_rgba(var(--color-primary-rgb)/0.2)] transition duration-300 hover:-translate-y-0.5",
  secondaryButton:
    "rounded-full border border-[rgba(var(--color-primary-rgb)/30)] bg-[transparent] px-[26px] py-[14px] text-[0.9rem] text-[var(--color-secondary)] transition duration-300 hover:-translate-y-0.5",
  statLabel:
    "block text-[0.7rem] uppercase tracking-[0.18em] text-[var(--color-primary)]/55",
  featureCard:
    "aca-float relative w-full max-w-[480px] overflow-hidden rounded-[28px] border border-[rgba(var(--color-primary-rgb)/10)] bg-[rgba(var(--color-cream-alt-rgb)/0.8)] p-8 shadow-[0_30px_60px_rgba(var(--color-primary-rgb)/0.12)] lg:max-w-none",
  driftRing:
    "aca-drift absolute h-[120px] w-[120px] rounded-full border border-[rgba(var(--color-primary-rgb)/10)]",
  leaf: "aca-leaf absolute h-[120px] w-[120px] rounded-[70%_30%_60%_40%] bg-[linear-gradient(120deg,rgba(var(--color-accent-rgb)/0.35),rgba(var(--color-primary-rgb)/0.1))] blur-[0.5px] opacity-60",
  section:
    "grid gap-16 px-7 py-[90px] md:px-16 md:py-[110px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
  sectionEyebrow:
    "text-[0.75rem] uppercase tracking-[0.22em] text-[var(--color-primary)]/60",
  sectionEyebrowLight:
    "text-[0.75rem] uppercase tracking-[0.22em] text-[var(--color-parchment)]/70",
  goalCard:
    "aca-rise rounded-[24px] border border-[rgba(var(--color-primary-rgb)/12)] bg-[rgba(var(--color-cream-rgb)/0.9)] p-6 shadow-[0_18px_40px_rgba(var(--color-primary-rgb)/0.1)]",
  timelineCard:
    "relative rounded-[24px] border border-[rgba(var(--color-primary-rgb)/12)] bg-[rgba(var(--color-cream-rgb)/0.92)] p-6 shadow-[0_18px_40px_rgba(var(--color-primary-rgb)/0.1)]",
  activityCard:
    "rounded-[22px] border border-[rgba(var(--color-primary-rgb)/10)] bg-[var(--color-collection)] p-6 shadow-[0_18px_36px_rgba(var(--color-primary-rgb)/0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_40px_rgba(var(--color-primary-rgb)/0.12)]",
  contactPanel:
    "flex flex-col gap-8 rounded-[28px] bg-[var(--color-primary)] p-10 text-[var(--color-parchment)] shadow-[0_30px_60px_rgba(var(--color-primary-rgb)/0.3)] lg:flex-row lg:items-center lg:justify-between",
  contactButton:
    "rounded-full bg-[var(--color-parchment)] px-[26px] py-[14px] text-[0.9rem] text-[var(--color-primary)] shadow-[0_12px_24px_rgba(var(--color-black-rgb)/0.15)] transition duration-300 hover:-translate-y-0.5",
  footer:
    "grid gap-8 border-t border-[rgba(var(--color-primary-rgb)/10)] px-7 pb-[80px] pt-[60px] md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)] md:px-16",
};

const HomePage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className={classes.page} id="top">
      <header className={classes.header}>
        <a className="flex items-center gap-4" href="#top">
          <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-[rgba(var(--color-primary-rgb)/30)]">
            <Image
              src={acaimage}
              alt="Aju Tea Culture logo"
              priority
              className="h-full w-full object-cover"
            />
          </span>
          <div>
            <div className="font-cinzel text-[1.1rem] uppercase tracking-[0.08em]">
              Asian Culture Association
            </div>
          </div>
        </a>
        <nav className={classes.nav}>
          <a href="#story">협회소개</a>
          <a href="#rituals">연혁</a>
          <a href="#collection">활동소식</a>
          <a href="#events">이벤트</a>
          <div className="relative">
            <button
              type="button"
              className={classes.menuButton}
              aria-expanded={menuOpen}
              aria-controls="nav-collapsible-menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              메뉴
              <span className="text-[0.7rem]">{menuOpen ? "−" : "+"}</span>
            </button>
            <div
              id="nav-collapsible-menu"
              className={`${classes.menuPanel} ${
                menuOpen
                  ? "pointer-events-auto scale-100 opacity-100 translate-y-0"
                  : "pointer-events-none scale-95 opacity-0 -translate-y-2"
              }`}
            >
              <a className={classes.menuItem} href="#story">
                민간자격
              </a>
              <a className={classes.menuItem} href="#rituals">
                연혁
              </a>
              <a className={classes.menuItem} href="#collection">
                프로그램
              </a>
              <a className={classes.menuItem} href="#events">
                소식
              </a>
            </div>
          </div>
        </nav>
        <button className={classes.outlineButton} type="button">
          가입/문의
        </button>
      </header>

      <main>
        <section className={classes.mainSection}>
          <div className={classes.mainGlow} aria-hidden="true" />
          <div>
            <p className={classes.sectionEyebrow}>아주문화협회</p>
            <h1 className="mt-3 font-cinzel text-[clamp(2.6rem,4vw,4.6rem)] leading-[1.1] text-[var(--color-secondary)]">
              아시아 문화를 잇는 새로운 물결, ACA
            </h1>
            <p className="mb-7 mt-6 max-w-[520px] text-[1.1rem] text-[var(--color-primary)]/80">
              우리는 문화 교류를 통해 더 넓은 세상을 만듭니다. 아주문화협회와
              함께 아시아의 깊이를 경험하세요.
            </p>
            {/* <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <button className={classes.primaryButton} type="button">
                Book a Ceremony
              </button>
              <button className={classes.secondaryButton} type="button">
                Explore the Archive
              </button>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <span className={classes.statLabel}>다음 협회 연수/모임</span>
                <span className="text-[0.95rem]">February 18, 2026</span>
              </div>
              <div>
                <span className={classes.statLabel}>위치</span>
                <span className="text-[0.95rem]">South Korea</span>
              </div>
            </div> */}
          </div>
          {/* <div className={classes.featureCard}>
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <span
                className={`${classes.driftRing} right-[10px] top-[-20px]`}
              />
              <span
                className={`${classes.driftRing} -right-[40px] top-[40px] h-[160px] w-[160px] [animation-delay:1.2s]`}
              />
              <span
                className={`${classes.driftRing} right-[30px] top-[120px] h-[100px] w-[100px] [animation-delay:2.4s]`}
              />
            </div>
            <div className="relative z-10">
              <p className="mb-3 font-cinzel text-[1.3rem]">연수 소개</p>
              <p className="mb-6 text-[var(--color-primary)]/75">
                소개글소개글소개글소개글소개글소개글소개글소개글소개글소개글소개글소개글소개글소개글소개글소개글
              </p>
              <div className="flex justify-between text-[0.85rem] uppercase tracking-[0.12em]">
                <span>02/17</span>
              </div>
            </div>
          </div> */}
          <div
            className={`${classes.leaf} bottom-10 left-[30px]`}
            aria-hidden="true"
          />
          <div
            className={`${classes.leaf} right-[35%] top-[90px] [animation-delay:2s]`}
            aria-hidden="true"
          />
          <div
            className={`${classes.leaf} bottom-[120px] right-[120px] [animation-delay:4s]`}
            aria-hidden="true"
          />
        </section>

        <section id="story" className={classes.section}>
          <div>
            <p className={classes.sectionEyebrow}>Our Story</p>
            <h2 className="mt-3 font-cinzel text-[2rem]">이사장 인사말</h2>
            <p className="mt-4 text-[1rem] leading-relaxed text-[var(--color-primary)]/80 tracking-widest">
              안녕하십니까. 이번 이사장 선거를 통해 저에게 큰 책임과 사명을
              맡겨주신 모든 회원 여러분께 깊은 감사의 인사를 드립니다.
              아주문화협회는 그동안 다양한 문화적 실천과 교류 속에서 특별한
              공동체로 자리매김해 왔습니다. 저는 이 소중한 기반 위에, 더욱
              생동감 있고 의미 있는 변화를 더하고자 합니다. 회원 한 분 한 분의
              활동이 존중받고, 협회가 실질적인 교류와 나눔의 장이 되도록
              하겠습니다. 일방적인 운영이 아닌, 함께 고민하고 함께 만들어가는
              협회를 지향하겠습니다.
            </p>
            <p className="mt-4 text-[var(--color-primary)]/70">
              - 아주문화협회 이사장 올림 -
            </p>
          </div>
          <div className="grid gap-6">
            <div className="flex justify-between">
              <h2 className="mt-3 font-cinzel text-[2rem]"> 아문협의 목표</h2>
              <button>더보기</button>
            </div>
            <div className={classes.goalCard}>
              <h3 className="font-cinzel text-[1.1rem]">
                개인의 가치 실현과 행복 추구
              </h3>
            </div>
            <div className={`${classes.goalCard} [animation-delay:1.5s]`}>
              <h3 className="font-cinzel text-[1.1rem]">
                민족문화를 전파하며 계승 발전
              </h3>
            </div>
            <div className={`${classes.goalCard} [animation-delay:3s]`}>
              <h3 className="font-cinzel text-[1.1rem]">
                아시아 각 민족 문화 이해 및 전문 연구
              </h3>
            </div>
          </div>
        </section>

        <section
          id="rituals"
          className="bg-[linear-gradient(140deg,rgba(var(--color-primary-rgb)/0.05),transparent_60%)] px-7 py-[90px] md:px-16 md:py-[110px]"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-6">
            <p className={classes.sectionEyebrow}>Association Timeline</p>
            <h2 className="font-cinzel text-[2rem]">걸어온 길</h2>
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-4 text-[0.75rem] uppercase tracking-[0.22em] text-[var(--color-primary)]/60">
              <span>2005</span>
              <div className="h-px flex-1 bg-black/20" />
              <span>Present</span>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-4">
              <article className={classes.timelineCard}>
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-[1.1rem] text-[var(--color-primary)]/70">
                    2005 ~ 2015
                  </span>
                  <span className="h-px flex-1 bg-[var(--color-primary)]/20" />
                </div>
                <h1 className="mt-2 font-bold text-[var(--color-primary)]">
                  형성기
                </h1>
                <p className="mt-2 text-[var(--color-primary)]/70">
                  중국 북경 차문화 연구 공간 오픈, 소수민족 철학 및 도자기 문화
                  조사
                </p>
              </article>

              <article className={classes.timelineCard}>
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-[1.1rem] text-[var(--color-primary)]/70">
                    2015 ~ 2020
                  </span>
                  <span className="h-px flex-1 bg-[var(--color-primary)]/20" />
                </div>
                <h1 className="mt-2 font-bold text-[var(--color-primary)]">
                  발전기
                </h1>
                <p className="mt-2 text-[var(--color-primary)]/70">
                  동남아시아(라오스, 베트남 등) 문화 조사, 국제 네트워크 구축
                </p>
              </article>

              <article className={classes.timelineCard}>
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-[1.1rem] text-[var(--color-primary)]/70">
                    2020 ~ 2022
                  </span>
                  <span className="h-px flex-1 bg-[var(--color-primary)]/20" />
                </div>
                <h1 className="mt-2 font-bold text-[var(--color-primary)]">
                  공백기 및 전환
                </h1>
                <p className="mt-2 text-[var(--color-primary)]/70">
                  소그룹 및 동아리 모임 활성화, 디지털 전환 및 문화 보존 의지
                  확립
                </p>
              </article>
              <article className={classes.timelineCard}>
                <div className="flex items-center gap-3">
                  <span className="font-cinzel text-[1.1rem] text-[var(--color-primary)]/70">
                    2023 ~ 현재
                  </span>
                  <span className="h-px flex-1 bg-[var(--color-primary)]/20" />
                </div>
                <h1 className="mt-2 font-bold text-[var(--color-primary)]">
                  새로운 도약
                </h1>
                <p className="mt-2 text-[var(--color-primary)]/70">
                  2023 비영리단체 신설, 2024 민간자격증 과정 개설, 2025 서울
                  오피스 확장
                </p>
              </article>
            </div>
          </div>
        </section>

        <section
          id="collection"
          className="px-7 py-[90px] md:px-16 md:py-[110px]"
        >
          <div className="mb-10">
            <p className={classes.sectionEyebrow}>ACA</p>
            <h2 className="mt-3 font-cinzel text-[2rem]">주요 활동소식</h2>
          </div>
          <div className="grid grid-cols-1 gap-[22px] md:grid-cols-2 lg:grid-cols-4">
            <article className={classes.activityCard}>
              <h3 className="font-cinzel text-[1.1rem]">자격증 및 교육</h3>
              <p className="mt-2 text-[var(--color-primary)]/70">
                중국차문화지도사 1급/2급 원데이 클래스 및 민간자격증 발급 과정을
                운영합니다.
              </p>
            </article>
            <article className={classes.activityCard}>
              <h3 className="font-cinzel text-[1.1rem]">국제 교류</h3>
              <p className="mt-2 text-[var(--color-primary)]/70">
                한국, 중국, 일본 등 아시아 각지에서 이어지는 교류 모임과 문화
                탐방을 진행합니다.
              </p>
            </article>
            <article className={classes.activityCard}>
              <h3 className="font-cinzel text-[1.1rem]">문화 체험</h3>
              <p className="mt-2 text-[var(--color-primary)]/70">
                차문화, 자수, 킨츠키, 향, 염색 등 다양한 아시아 전통 문화를 직접
                체험합니다.
              </p>
            </article>
          </div>
        </section>

        <section
          id="events"
          className="relative px-7 pb-40 pt-[90px] md:px-16 md:pt-[110px]"
        >
          <div className={classes.contactPanel}>
            <div>
              <h2 className="mt-3 font-cinzel text-[2rem]">
                아주문화협회와 함께하세요
              </h2>
              <p className="mt-3 text-[var(--color-parchment)]/85">
                📧 이메일 asian05@naver.com
              </p>
              <p className="mt-3 text-[var(--color-parchment)]/85">
                📷 인스타그램 @asianc2005
              </p>
              <p className="mt-3 text-[var(--color-parchment)]/85">
                📍 사무실 경기도 광주시 곤지암읍
              </p>
            </div>
            <button className={classes.contactButton} type="button">
              문의
            </button>
          </div>
        </section>  
      </main>

      <footer className={classes.footer}>
        <div>
          <div className="font-cinzel text-[1.1rem] uppercase tracking-[0.08em]">
            아주문화협회 (Asian Cultural Association)
          </div>
          <p className="mt-3 text-[var(--color-primary)]/70">
            경기도 광주시 곤지암읍
          </p>
          <p className="text-xs mt-9 text-[var(--color-primary)]/80">
            © 2026 Asian Cultural Association. All Rights Reserved.
          </p>
          <p className="text-xs mt-3 text-[var(--color-primary)]/80">
            Designed & Built by Tae Hyung Kim
          </p>    
        </div>
        <div className="flex flex-col gap-3 text-[0.9rem]">
          <a href="#story">협회소개</a> 
          <a href="#rituals">교육안내</a>
          <a href="#collection">활동소식</a>
          <a href="#events">이벤트</a>
        </div>
        <div className="flex flex-col gap-3 text-[0.9rem]">
          <span>asian05@naver.com</span>
          <span>+1 (123) 444-5555</span>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;