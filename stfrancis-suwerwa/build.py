#!/usr/bin/env python3
"""Generates every page from one shell so the chrome can never drift apart."""
import json, os, re

SCHOOL = "St. Francis Girls&rsquo; High School"
FULL   = "St. Francis Girls&rsquo; High School &mdash; Suwerwa"
SITE   = "https://stfrancissuwerwa.sc.ke"

NAV = [
    ("about.html",        "About"),
    ("academics.html",    "Academics"),
    ("admissions.html",   "Admissions"),
    ("student-life.html", "Student Life"),
    ("news.html",         "News"),
    ("contact.html",      "Contact"),
]

ICON = {
 "arrow": '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 "burger":'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
 "fb":    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 9h3V6h-3c-2 0-3.5 1.5-3.5 3.5V12H8v3h2.5v7h3v-7H16l.5-3h-3V9.5c0-.3.2-.5.5-.5z"/></svg>',
 "ig":    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
 "yt":    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.5A2.5 2.5 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.5a2.5 2.5 0 0 0 1.8-1.8C22 15.2 22 12 22 12zM10 15V9l5 3z"/></svg>',
 "wa":    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20zm4.4-5.8c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.6.1a6.6 6.6 0 0 1-3.2-2.8c-.2-.4.2-.4.6-1.2a.5.5 0 0 0 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c2.2.9 2.2.6 2.6.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3z"/></svg>',
}


def head(title, desc, page=""):
    return f"""<!DOCTYPE html>
<html lang="en-KE">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} &mdash; {FULL}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{SITE}/{page}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{FULL}">
<meta property="og:title" content="{title} &mdash; {FULL}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{SITE}/assets/img/hero.jpg">
<meta property="og:url" content="{SITE}/{page}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#123499">
<link rel="icon" href="assets/img/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="assets/img/icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/parts/01-tokens.css">
<link rel="stylesheet" href="assets/css/parts/02-base.css">
<link rel="stylesheet" href="assets/css/parts/03-header.css">
<link rel="stylesheet" href="assets/css/parts/04-hero.css">
<link rel="stylesheet" href="assets/css/parts/05-home.css">
<link rel="stylesheet" href="assets/css/parts/06-pages.css">
<link rel="stylesheet" href="assets/css/parts/07-footer.css">
<link rel="stylesheet" href="assets/css/parts/08-states.css">
<script type="application/ld+json">
{{"@context":"https://schema.org","@type":"School","name":"St. Francis Girls' High School - Suwerwa",
"alternateName":"St. Francis Suwerwa","foundingDate":"2013","slogan":"Strive For Excellence",
"url":"{SITE}","logo":"{SITE}/assets/img/crest.png",
"address":{{"@type":"PostalAddress","addressLocality":"Suwerwa","addressRegion":"Trans Nzoia County","addressCountry":"KE"}},
"gender":"Female"}}
</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
"""


def header(active=""):
    links = "".join(
        f'<a href="{h}"{" aria-current=\"page\"" if h == active else ""}>{t}</a>'
        for h, t in NAV
    )
    return f"""<div class="utility">
  <div class="wrap">
    <span>Suwerwa, Cherangany &middot; Trans Nzoia County</span>
    <span class="utility-links">
      <a href="tel:" data-bind-href="site.phoneLink"><span data-bind="site.phone" class="is-placeholder">Telephone to be confirmed</span></a>
      <a href="mailto:" data-bind-href="site.emailLink"><span data-bind="site.email" class="is-placeholder">Email to be confirmed</span></a>
    </span>
  </div>
</div>

<header class="masthead">
  <div class="wrap">
    <a class="brand" href="index.html">
      <img src="assets/img/crest.png" alt="School crest" width="64" height="91">
      <span class="brand-text">
        <span class="brand-name">St. Francis Girls&rsquo; High School</span>
        <span class="brand-sub">Suwerwa &middot; Est. 2013</span>
      </span>
    </a>
    <button class="burger" aria-label="Open menu" aria-expanded="false" aria-controls="nav">{ICON['burger']}</button>
    <nav class="nav" id="nav" aria-label="Main">
      {links}
      <a class="btn btn--gold" href="admissions.html">Grade&nbsp;10 Admissions</a>
    </nav>
  </div>
</header>
"""


def footer():
    return f"""<footer class="foot">
  <div class="wrap foot__top">
    <div class="foot__brand">
      <img src="assets/img/crest.png" alt="" width="88" height="125">
      <p class="foot__motto">Strive for Excellence</p>
      <p style="font-size:.85rem">A girls&rsquo; boarding school in Suwerwa, Cherangany, serving Trans Nzoia County and beyond since 2013.</p>
    </div>
    <div>
      <h4>The School</h4>
      <ul>
        <li><a href="about.html">About us</a></li>
        <li><a href="leadership.html">Leadership &amp; heritage</a></li>
        <li><a href="academics.html">Academics</a></li>
        <li><a href="student-life.html">Student life</a></li>
        <li><a href="gallery.html">Gallery</a></li>
      </ul>
    </div>
    <div>
      <h4>For Parents</h4>
      <ul>
        <li><a href="admissions.html">Admissions</a></li>
        <li><a href="admissions.html#fees">Fee structure</a></li>
        <li><a href="admissions.html#requirements">Grade 10 requirements</a></li>
        <li><a href="academics.html#results">Examination record</a></li>
        <li><a href="news.html">News &amp; events</a></li>
      </ul>
    </div>
    <div>
      <h4>Contact</h4>
      <ul>
        <li data-bind="site.postal" class="is-placeholder">Postal address to be confirmed</li>
        <li><a href="tel:" data-bind-href="site.phoneLink"><span data-bind="site.phone" class="is-placeholder">Telephone to be confirmed</span></a></li>
        <li><a href="mailto:" data-bind-href="site.emailLink"><span data-bind="site.email" class="is-placeholder">Email to be confirmed</span></a></li>
        <li>Suwerwa, Cherangany, Trans Nzoia</li>
      </ul>
      <div class="social" style="margin-top:1.1rem">
        <a href="#" data-bind-href="site.facebook" aria-label="Facebook">{ICON['fb']}</a>
        <a href="#" data-bind-href="site.instagram" aria-label="Instagram">{ICON['ig']}</a>
        <a href="#" data-bind-href="site.youtube" aria-label="YouTube">{ICON['yt']}</a>
      </div>
    </div>
  </div>
  <div class="wrap foot__bottom">
    <span>&copy; <span id="yr">2026</span> {FULL}. All rights reserved.</span>
    <span>Admissions open to all qualified girls without discrimination.</span>
  </div>
</footer>

<a class="wa" href="#" data-bind-href="site.whatsappLink" aria-label="Message the school on WhatsApp">{ICON['wa']}</a>

<script src="assets/js/content.js"></script>
<script src="assets/js/core.js"></script>
<script src="assets/js/nav.js"></script>
<script src="assets/js/motion.js"></script>
<script src="assets/js/render.js"></script>
<script src="assets/js/results.js"></script>
<script src="assets/js/data.js"></script>
</body>
</html>"""


def pagehead(title, sub, img, crumb):
    return f"""<section class="pagehead">
  <div class="pagehead__bg"><img src="assets/img/{img}" alt=""></div>
  <div class="wrap pagehead__inner">
    <p class="crumbs"><a href="index.html">Home</a> &nbsp;&rsaquo;&nbsp; {crumb}</p>
    <h1 class="d2">{title}</h1>
    <p>{sub}</p>
  </div>
</section>"""


def page(fname, title, desc, active, body):
    html = head(title, desc, page=fname if fname != "index.html" else "") \
         + header(active) + '<main id="main">' + body + '</main>' + footer()
    open(fname, "w").write(html)
    return fname


# ============================================================ HOME
PILLARS = [
    ("Academic Excellence", "pillar-1.jpg",
     "A steady climb since 2013. In 2024 the school posted its strongest mean grade in nine years, and it now carries that record into the new senior school pathways.",
     "academics.html"),
    ("Faith &amp; Character", "pillar-2.jpg",
     "Christian values sit at the centre of school life. Chaplaincy, guidance and a culture of integrity shape the young women who leave here.",
     "about.html#values"),
    ("Leadership &amp; Voice", "pillar-3.jpg",
     "A girls&rsquo; school where every student is expected to lead something: a club, a class, a team, a conversation.",
     "student-life.html"),
    ("Care &amp; Safety", "pillar-4.jpg",
     "Boarding is a promise to parents. Matrons, health provision, secure grounds and close pastoral attention are the foundation of everything else.",
     "student-life.html#boarding"),
]

pillar_html = "".join(f"""
    <article class="pillar rv" data-delay="{i*90}">
      <div class="pillar__img"><img src="assets/img/{img}" alt="" loading="lazy" width="900" height="700">
        <span class="pillar__n">{i+1:02d}</span></div>
      <div class="pillar__body">
        <h3>{t}</h3><p>{d}</p>
        <a class="pillar__more" href="{href}">Read more {ICON['arrow']}</a>
      </div>
    </article>""" for i, (t, img, d, href) in enumerate(PILLARS))

VALUES = ["God Fearing", "Integrity", "Team Work", "Courtesy", "Efficiency",
          "Continued Improvement", "Professionalism", "Confidentiality",
          "Fidelity to Law", "Respect for Individual Differences"]
values_html = "".join(f'<li class="rv" data-delay="{i*45}">{v}</li>' for i, v in enumerate(VALUES))

home = f"""
<section class="hero">
  <div class="hero__bg"><img src="assets/img/hero.jpg" alt="" fetchpriority="high" width="1800" height="1050"></div>
  <div class="wrap hero__inner on-navy">
    <p class="kicker">Established 2013 &middot; Trans Nzoia County</p>
    <h1 class="d1">Strive for <em>Excellence</em></h1>
    <p class="hero__tag" data-bind="site.heroText">A girls&rsquo; boarding school in the Cherangany hills, founded in 2013 and built on discipline, faith and steady academic progress.</p>
    <div class="hero__actions">
      <a class="btn btn--gold" href="admissions.html">Grade 10 admissions {ICON['arrow']}</a>
      <a class="btn btn--ghost" href="academics.html#results">See our results</a>
    </div>
  </div>
</section>

<div class="rail">
  <div class="wrap">
    <span>Founded 2013</span>
    <span>Girls&rsquo; boarding</span>
    <span>Christian foundation</span>
    <span>Senior school &middot; Grades 10 to 12</span>
    <span>Cherangany, Trans Nzoia</span>
  </div>
</div>

<section class="tight">
  <div class="wrap welcome">
    <div class="welcome__mark rv"><img src="assets/img/crest.png" alt="" width="96" height="136"></div>
    <div class="welcome__body rv" data-delay="120">
      <p class="kicker">Welcome</p>
      <h2 class="d3">A school built in a generation.</h2>
      <p class="lede">St. Francis Girls&rsquo; High School opened its doors in Suwerwa in 2013 with thirty-seven candidates in its first examination class. Today it is one of the larger girls&rsquo; schools in Cherangany, and its academic record is climbing.</p>
      <p>What has not changed is the reason parents send their daughters here: a school that takes discipline seriously, keeps faith at the centre of daily life, and looks after the girls in its care as though they were its own.</p>
      <p><a class="btn btn--outline" href="about.html">Our story {ICON['arrow']}</a></p>
    </div>
  </div>
</section>

<section class="tight" style="padding-top:0">
  <div class="wrap">
    <div class="pillars">{pillar_html}</div>
  </div>
</section>

<section class="ledger on-navy">
  <div class="wrap">
    <div class="ledger__grid">
      <div class="stat rv"><span class="stat__n" data-count="5.952" data-dp="3" data-stat="mean">5.952</span>
        <span class="stat__l"><span data-stat-label="meanYear">2024</span> examination mean<br>grade <span data-stat-label="meanGrade">C</span></span></div>
      <div class="stat rv" data-delay="90"><span class="stat__n"><span data-count="88.8" data-dp="1" data-stat="passRate">88.8</span><sup>%</sup></span>
        <span class="stat__l">Scored C&minus; or better<br>in <span data-stat-label="meanYear">2024</span></span></div>
      <div class="stat rv" data-delay="180"><span class="stat__n" data-count="125" data-dp="0" data-stat="entry">125</span>
        <span class="stat__l">Candidates presented<br>in <span data-stat-label="meanYear">2024</span></span></div>
      <div class="stat rv" data-delay="270"><span class="stat__n" data-count="13" data-dp="0" data-stat="age">13</span>
        <span class="stat__l">Years of service<br>since 2013</span></div>
    </div>
    <p class="ledger__note">Figures drawn from the school&rsquo;s own examination record. <a href="academics.html#results">See the full results ledger</a>.</p>
  </div>
</section>

<section>
  <div class="wrap principal">
    <div class="principal__portrait rv">
      <img src="assets/img/principal.jpg" alt="" data-bind="principal.photo" loading="lazy" width="800" height="1000">
    </div>
    <div class="rv" data-delay="130">
      <p class="kicker">From the Principal</p>
      <blockquote data-bind="principal.message">Every girl who walks through our gate arrives with something worth developing. Our work is to find it, name it, and give her the discipline and the confidence to carry it further than she thought she could.</blockquote>
      <p class="muted">The Principal&rsquo;s full message will be published here.</p>
      <div class="principal__sig">
        <strong data-bind="principal.name">Mrs. Alice K. Mutai</strong>
        <span data-bind="principal.title">Principal</span>
      </div>
    </div>
  </div>
</section>

<section class="results">
  <div class="wrap results__grid">
    <div class="rv">
      <p class="kicker">Academic record</p>
      <h2 class="d3">Twelve years of results, published in full.</h2>
      <p>Most schools show you their best year. We publish every year since 2013 &mdash; including the difficult ones &mdash; because the shape of the line matters more than any single point on it.</p>
      <svg id="spark" class="spark" viewBox="0 0 620 210" role="img" aria-label="K.C.S.E. mean grade by year from 2013 to 2024"></svg>
    </div>
    <div class="rv" data-delay="140">
      <dl class="results__facts">
        <div><dt><span data-stat-label="meanYear">2024</span> mean</dt><dd data-stat-text="mean">5.952</dd></div>
        <div><dt>Year-on-year gain</dt><dd data-stat-text="gain">+0.919</dd></div>
        <div><dt>Qualified for university</dt><dd data-stat-text="uni">29.6%</dd></div>
      </dl>
      <p style="margin-top:1.4rem"><a class="btn btn--outline" href="academics.html#results">Full results ledger {ICON['arrow']}</a></p>
    </div>
  </div>
</section>

<section class="values" id="values">
  <div class="wrap">
    <p class="kicker">What we stand for</p>
    <h2 class="d3" style="margin-bottom:var(--s4)">Ten core values, taught and expected.</h2>
    <ul class="values__list">{values_html}</ul>
  </div>
</section>

<section class="voices on-navy">
  <div class="narrow" style="text-align:center">
    <p class="kicker kicker--center">In their words</p>
    <div id="voices">
      <div class="voice is-on">
        <blockquote>Student and old girl voices will be published here from the dashboard.</blockquote>
        <cite>Awaiting content</cite>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <p class="kicker">Latest</p>
    <h2 class="d3" style="margin-bottom:var(--s4)">News &amp; events</h2>
    <div class="news" id="news-list" data-limit="3"></div>
    <p style="margin-top:var(--s4)"><a class="btn btn--outline" href="news.html">All news {ICON['arrow']}</a></p>
  </div>
</section>

<section class="cta">
  <div class="cta__bg"><img src="assets/img/cta.jpg" alt="" loading="lazy"></div>
  <div class="wrap cta__inner">
    <h2 class="d2">Considering St. Francis for your daughter?</h2>
    <p>Senior school placement, the fee structure and reporting dates are all published on this site. You are welcome to visit the school and see it for yourself.</p>
    <div class="cta__actions">
      <a class="btn btn--gold" href="admissions.html">Admissions {ICON['arrow']}</a>
      <a class="btn btn--ghost" href="contact.html">Arrange a visit</a>
    </div>
  </div>
</section>
"""

# ============================================================ ABOUT
about = pagehead("About the school",
    "A girls&rsquo; boarding school founded in 2013, serving Cherangany and the wider Trans Nzoia County.",
    "page-about.jpg", "About") + f"""
<section>
  <div class="wrap" style="display:grid;gap:var(--s5);grid-template-columns:1fr">
    <div class="narrow prose rv" style="width:100%;margin:0">
      <p class="kicker">Our story</p>
      <h2>From thirty-seven candidates to a full school.</h2>
      <p class="lede">St. Francis Girls&rsquo; High School was established in Suwerwa in 2013. Its first examination class numbered thirty-seven girls. Within a decade the school was presenting well over a hundred candidates a year.</p>
      <p>The school sits in Cherangany, in Trans Nzoia County, and draws students from the surrounding sub-counties and beyond. It is a boarding school for girls, founded on Christian values, and it has been led by three Principals and three Boards of Management since it opened.</p>
      <div class="callout">
        <h3>A fuller history is coming</h3>
        <p>The school is preparing a complete account of its founding and growth. It will be published here once ready.</p>
      </div>

      <h2 id="vision">Vision</h2>
      <p class="lede">To be a leading institution in academic excellence.</p>

      <h2 id="mission">Mission</h2>
      <p class="lede">To provide quality education by nurturing innovativeness, responsiveness, integrity and moral Christian values in learners who will contribute positively towards national development.</p>

      <h2>Motto</h2>
      <p class="lede" style="font-family:var(--display);font-size:1.7rem;color:var(--navy-deep)">&ldquo;Strive for Excellence&rdquo;</p>
    </div>
  </div>
</section>

<section class="values" id="values">
  <div class="wrap">
    <p class="kicker">Core values</p>
    <h2 class="d3" style="margin-bottom:var(--s4)">Ten values, taught and expected.</h2>
    <ul class="values__list">{values_html}</ul>
  </div>
</section>

<section>
  <div class="wrap cards">
    <article class="card rv"><h3>Leadership &amp; heritage</h3><p>Every Principal and Board Chairperson who has served since 2013.</p><p><a class="pillar__more" href="leadership.html">View {ICON['arrow']}</a></p></article>
    <article class="card rv" data-delay="90"><h3>Academic record</h3><p>Twelve years of examination results, published in full.</p><p><a class="pillar__more" href="academics.html#results">View {ICON['arrow']}</a></p></article>
    <article class="card rv" data-delay="180"><h3>Life at school</h3><p>Boarding, pastoral care, clubs, games and worship.</p><p><a class="pillar__more" href="student-life.html">View {ICON['arrow']}</a></p></article>
  </div>
</section>
"""

# ============================================================ ACADEMICS
academics = pagehead("Academics",
    "Senior school pathways, subjects and the school&rsquo;s complete examination record since 2013.",
    "page-academics.jpg", "Academics") + f"""
<section>
  <div class="narrow prose rv">
    <p class="kicker">Teaching &amp; learning</p>
    <h2>A curriculum built on steady expectations.</h2>
    <p class="lede" data-bind="academics.intro">St. Francis is a senior school under the Competency-Based Curriculum, teaching Grades 10 to 12 alongside the final Form Four cohort under the outgoing system.</p>

    <h3>Senior school pathways</h3>
    <p>Learners choose one of three pathways at the start of Grade 10 and follow it to Grade 12: <strong>STEM</strong>, <strong>Social Sciences</strong>, or <strong>Arts and Sports Science</strong>. Within a pathway a learner takes a set combination of subjects.</p>
    <ul id="acad-pathways" data-replaces="path-pending-a" hidden></ul>
    <div class="callout" id="path-pending-a">
      <h3>Pathways offered here</h3>
      <p>The pathways and subject combinations approved for this school will be published here.</p>
      <p><a class="btn btn--outline" href="admissions.html#pathways" style="margin-top:.6rem">Admissions {ICON['arrow']}</a></p>
    </div>

    <h3>Subjects</h3>
    <ul id="acad-subjects" data-replaces="subj-pending" hidden></ul>
    <div class="callout" id="subj-pending">
      <h3>Subject list to follow</h3>
      <p>The full list of departments and subjects will be published here from the school dashboard.</p>
    </div>
  </div>
</section>

<section class="results" id="results">
  <div class="wrap">
    <p class="kicker">The record</p>
    <h2 class="d3">Examination record, 2013 onwards</h2>
    <p class="lede" style="max-width:62ch;margin-top:var(--s2)">The school publishes its complete examination record rather than a selection of it. <span data-stat-label="meanYear">2024</span> produced a mean of <span data-stat-text="mean">5.952</span>, grade <span data-stat-label="meanGrade">C</span>.</p>
    <p class="muted" style="max-width:62ch">These are Kenya Certificate of Secondary Education results. The final national K.C.S.E. examination is scheduled for 2027. From then on, learners will be assessed at the end of Grade 12 under the Competency-Based Curriculum, and those results will be published here alongside this record.</p>

    <div class="results__grid" style="margin-top:var(--s4)">
      <div class="rv"><svg id="spark" class="spark" viewBox="0 0 620 210" role="img" aria-label="K.C.S.E. mean grade by year from 2013 to 2024"></svg></div>
      <div class="rv" data-delay="120">
        <dl class="results__facts">
          <div><dt><span data-stat-label="meanYear">2024</span> mean</dt><dd data-stat-text="mean">5.952</dd></div>
          <div><dt>Gain on <span data-stat-label="prevYear">2023</span></dt><dd data-stat-text="gain">+0.919</dd></div>
          <div><dt>C&minus; or better</dt><dd data-stat-text="passRatePct">88.8%</dd></div>
        </dl>
      </div>
    </div>

    <div class="tablewrap rv" style="margin-top:var(--s4)">
      <table>
        <caption>Grade distribution by year. Mean grade points: A 12 &middot; A&minus; 11 &middot; B+ 10 &middot; B 9 &middot; B&minus; 8 &middot; C+ 7 &middot; C 6 &middot; C&minus; 5 &middot; D+ 4 &middot; D 3 &middot; D&minus; 2 &middot; E 1</caption>
        <thead><tr>
          <th scope="col">Year</th><th scope="col">Entry</th>
          <th scope="col">A</th><th scope="col">A&minus;</th><th scope="col">B+</th><th scope="col">B</th>
          <th scope="col">B&minus;</th><th scope="col">C+</th><th scope="col">C</th><th scope="col">C&minus;</th>
          <th scope="col">D+</th><th scope="col">D</th><th scope="col">D&minus;</th><th scope="col">E</th>
          <th scope="col">Mean</th><th scope="col">Grade</th>
        </tr></thead>
        <tbody id="kcse-body"></tbody>
      </table>
    </div>
    <p class="muted" style="font-size:.85rem" id="kcse-note">Results for the most recent year will be added once released by the school.</p>
  </div>
</section>

<section>
  <div class="wrap cards">
    <article class="card rv"><h3>Admissions</h3><p>Senior school placement, pathways and the fee structure.</p><p><a class="pillar__more" href="admissions.html">View {ICON['arrow']}</a></p></article>
    <article class="card rv" data-delay="90"><h3>Student life</h3><p>Clubs, games, festivals and the boarding programme.</p><p><a class="pillar__more" href="student-life.html">View {ICON['arrow']}</a></p></article>
    <article class="card rv" data-delay="180"><h3>Contact the school</h3><p>Speak to the administration about your daughter&rsquo;s place.</p><p><a class="pillar__more" href="contact.html">View {ICON['arrow']}</a></p></article>
  </div>
</section>
"""

# ============================================================ ADMISSIONS
admissions = pagehead("Admissions",
    "Grade 10 senior school placement, pathways, reporting dates and the fee structure.",
    "page-admissions.jpg", "Admissions") + f"""
<section>
  <div class="narrow prose rv">
    <p class="kicker">Joining the school</p>
    <h2>Admission to Grade 10</h2>
    <p class="lede" data-bind="admissions.intro">St. Francis Girls&rsquo; High School is a senior school under the Competency-Based Curriculum, admitting learners into Grade 10 through the Ministry of Education placement process.</p>

    <h3>How placement works</h3>
    <p>Grade 9 learners select their preferred senior schools through the Ministry&rsquo;s placement platform. Placement is worked out from three parts: the Kenya Junior School Education Assessment, the Kenya Primary School Education Assessment, and school-based assessments carried out in Grades 7 and 8.</p>
    <p>Every Grade 9 learner is placed in a senior school. Families who wish to be considered for St. Francis should list the school among their choices, and may contact the administration directly about transfers or available places.</p>

    <h3 id="pathways">Pathways offered</h3>
    <p>Senior school under the Competency-Based Curriculum is organised into three pathways. Learners choose one at the start of Grade 10 and follow it through to Grade 12.</p>
    <ul id="adm-pathways" data-replaces="path-pending" hidden></ul>
    <div class="callout" id="path-pending">
      <h3>Pathways and subject combinations to follow</h3>
      <p>The pathways and subject combinations approved for this school will be published here. Parents should confirm with the administration before making their selection.</p>
      <p><a class="btn btn--outline" href="contact.html" style="margin-top:.6rem">Contact the school {{ICON['arrow']}}</a></p>
    </div>

    <h3 id="requirements">What to bring</h3>
    <ul id="adm-requirements" data-replaces="req-pending" hidden></ul>
    <div class="callout" id="req-pending">
      <h3>Requirements list to follow</h3>
      <p>The school is finalising the requirements list for the coming intake. It will be published here as soon as it is confirmed. In the meantime please contact the administration directly.</p>
    </div>

    <h3>Documents required</h3>
    <ul id="adm-documents" data-replaces="doc-pending" hidden></ul>
    <p id="doc-pending" class="muted">The list of documents a parent must bring will be published here.</p>

    <h3>Reporting dates</h3>
    <p id="adm-reporting" data-bind="admissions.reportingDates" class="is-placeholder">Reporting dates for the coming intake will be published here once confirmed by the Ministry.</p>

    <h3 id="fees">Fee structure</h3>
    <div class="tablewrap" id="fee-table" hidden>
      <table>
        <thead><tr><th scope="col">Item</th><th scope="col">Grade or form</th><th scope="col">Amount per term (KES)</th></tr></thead>
        <tbody id="fee-body"></tbody>
      </table>
    </div>
    <p id="fee-pending">The current fee structure will be published here. Parents may also request a printed copy from the school office.</p>
    <p class="muted" data-bind="admissions.feesNote"></p>

    <div class="callout">
      <h3>Continuing students under 8-4-4</h3>
      <p>Learners who began secondary school before the change continue to Form Four and sit the Kenya Certificate of Secondary Education. The final national K.C.S.E. examination is scheduled for 2027, after which all learners in the school will be following the Competency-Based Curriculum.</p>
    </div>

    <h3>Visiting</h3>
    <p>Parents are welcome to visit the school and meet the administration before making a decision. Please call ahead so that someone is available to show you the compound.</p>
  </div>
</section>

<section class="cta">
  <div class="cta__bg"><img src="assets/img/cta.jpg" alt="" loading="lazy"></div>
  <div class="wrap cta__inner">
    <h2 class="d2">Speak to the school</h2>
    <p>The administration will answer questions about places, pathways, fees and what your daughter needs to bring.</p>
    <div class="cta__actions"><a class="btn btn--gold" href="contact.html">Contact us {{ICON['arrow']}}</a></div>
  </div>
</section>
"""

# ============================================================ STUDENT LIFE
life = pagehead("Student life",
    "Boarding, pastoral care, chaplaincy, clubs and games at St. Francis Girls&rsquo; High School, Suwerwa.",
    "page-life.jpg", "Student Life") + f"""
<section>
  <div class="narrow prose rv">
    <p class="kicker">Life at St. Francis</p>
    <h2 id="boarding">Boarding &amp; welfare</h2>
    <p class="lede">Sending a daughter to boarding school is an act of trust. The school takes that seriously.</p>
    <p data-bind="life.boarding">Details of the dormitories, the matron&rsquo;s role, the school health facility, dining arrangements and security will be published here.</p>

    <h2>Chaplaincy &amp; guidance</h2>
    <p data-bind="life.pastoral">The school&rsquo;s Christian foundation shapes daily life through worship, chaplaincy and a guidance and counselling programme.</p>

    <h2>Clubs &amp; societies</h2>
    <ul id="life-clubs" data-replaces="clubs-pending" hidden></ul>
    <div class="callout" id="clubs-pending"><h3>Club list to follow</h3><p>The full list of active clubs and societies will appear here.</p></div>

    <h2>Games &amp; competitions</h2>
    <ul id="life-sports" data-replaces="sports-pending" hidden></ul>
    <div class="callout" id="sports-pending"><h3>Games and festival record to follow</h3><p>Sports offered, teams and achievements in the Music Festival, Drama Festival and Science Congress will be published here.</p></div>
  </div>
</section>

<section class="tight" style="background:var(--paper-2)">
  <div class="wrap">
    <p class="kicker">Around the school</p>
    <h2 class="d3" style="margin-bottom:var(--s4)">Gallery</h2>
    <div class="grid-gallery">
      <a href="assets/img/gallery-1.jpg"><img src="assets/img/gallery-1.jpg" alt="" loading="lazy"></a>
      <a href="assets/img/gallery-2.jpg"><img src="assets/img/gallery-2.jpg" alt="" loading="lazy"></a>
      <a href="assets/img/gallery-3.jpg"><img src="assets/img/gallery-3.jpg" alt="" loading="lazy"></a>
    </div>
    <p style="margin-top:var(--s3)"><a class="btn btn--outline" href="gallery.html">Full gallery {ICON['arrow']}</a></p>
  </div>
</section>
"""

# ============================================================ LEADERSHIP
_src = open("assets/js/content.js").read()
_obj = _src[_src.index("window.SCHOOL =") + len("window.SCHOOL ="):].rstrip().rstrip(";")
CONTENT = json.loads(_obj)
lead = CONTENT["leadership"]
def tl(items):
    return "".join(f'<li class="rv" data-delay="{i*70}"><span class="yrs">{p["years"]}</span>'
                   f'<span class="who">{p["name"]}</span></li>' for i, p in enumerate(items))

leadership = pagehead("Leadership &amp; heritage",
    "Every Principal and Board of Management Chairperson who has served St. Francis Girls&rsquo; High School since 2013.",
    "page-leadership.jpg", "Leadership") + f"""
<section>
  <div class="wrap" style="display:grid;gap:var(--s6);grid-template-columns:1fr">
    <div class="narrow rv" style="width:100%;margin:0">
      <p class="kicker">Since 2013</p>
      <h2 class="d3">Three Principals. Three Boards. One direction.</h2>
      <p class="lede" style="margin-top:var(--s2)">A school is shaped by the people who lead it. These are the men and women who have carried St. Francis from its founding year to the present day.</p>
    </div>
  </div>
</section>

<section class="tight" style="padding-top:0">
  <div class="wrap cards" style="grid-template-columns:1fr">
    <div style="display:grid;gap:var(--s5);grid-template-columns:1fr">
      <div>
        <h3 class="d4" style="margin-bottom:var(--s3);color:var(--navy-deep)">Principals</h3>
        <ul class="timeline" id="tl-principals">{tl(lead['principals'])}</ul>
      </div>
      <div>
        <h3 class="d4" style="margin-bottom:var(--s3);color:var(--navy-deep)">Board of Management Chairpersons</h3>
        <ul class="timeline" id="tl-bom">{tl(lead['bom'])}</ul>
      </div>
    </div>
  </div>
</section>

<section class="values">
  <div class="wrap">
    <div class="narrow" style="width:100%;margin:0">
      <p class="kicker">Governance</p>
      <h2 class="d3">Board of Management</h2>
      <p class="lede" style="margin-top:var(--s2)">The Board of Management oversees the running of the school on behalf of the sponsor, the parents and the Ministry of Education. Full membership will be published here.</p>
    </div>
  </div>
</section>
"""

# ============================================================ NEWS
news = pagehead("News &amp; events",
    "Announcements, term dates and events from St. Francis Girls&rsquo; High School, Suwerwa.",
    "page-news.jpg", "News") + """
<section>
  <div class="wrap">
    <p class="kicker">Noticeboard</p>
    <h2 class="d3" style="margin-bottom:var(--s4)">Latest from the school</h2>
    <div class="news" id="news-list" data-limit="24"></div>
  </div>
</section>
"""

# ============================================================ GALLERY
gallery = pagehead("Gallery",
    "Photographs of St. Francis Girls&rsquo; High School, Suwerwa.",
    "page-gallery.jpg", "Gallery") + """
<section>
  <div class="wrap">
    <p class="kicker">Around the school</p>
    <h2 class="d3" style="margin-bottom:var(--s4)">Gallery</h2>
    <div class="grid-gallery" id="gallery-grid">
""" + "".join(f'      <a href="assets/img/gallery-{i}.jpg"><img src="assets/img/gallery-{i}.jpg" alt="" loading="lazy"></a>\n' for i in range(1, 7)) + """    </div>
    <p class="muted" style="margin-top:var(--s3);font-size:.9rem">Photographs are placeholders until the school&rsquo;s own images are uploaded through the dashboard.</p>
  </div>
</section>
"""

# ============================================================ CONTACT
contact = pagehead("Contact",
    "Telephone, email and directions to St. Francis Girls&rsquo; High School, Suwerwa, Trans Nzoia County.",
    "page-contact.jpg", "Contact") + f"""
<section>
  <div class="wrap contact-grid">
    <div class="rv">
      <p class="kicker">Reach the school</p>
      <h2 class="d3">Get in touch</h2>
      <dl class="contact-list">
        <dt>Telephone</dt>
        <dd><a href="tel:" data-bind-href="site.phoneLink"><span data-bind="site.phone" class="is-placeholder">To be confirmed</span></a></dd>
        <dt>WhatsApp</dt>
        <dd><a href="#" data-bind-href="site.whatsappLink"><span data-bind="site.whatsapp" class="is-placeholder">To be confirmed</span></a></dd>
        <dt>Email</dt>
        <dd><a href="mailto:" data-bind-href="site.emailLink"><span data-bind="site.email" class="is-placeholder">To be confirmed</span></a></dd>
        <dt>Postal address</dt>
        <dd data-bind="site.postal" class="is-placeholder">To be confirmed</dd>
        <dt>Location</dt>
        <dd data-bind="site.location">Suwerwa, Cherangany, Trans Nzoia County</dd>
      </dl>
      <p style="margin-top:var(--s4)"><a class="btn btn--navy" href="#" data-bind-href="site.whatsappLink">Message on WhatsApp {ICON['arrow']}</a></p>
    </div>
    <div class="rv" data-delay="120">
      <div class="mapbox" id="map">
        <p>A map of the school&rsquo;s location will appear here once the school confirms its map link.</p>
      </div>
      <p class="muted" style="font-size:.9rem;margin-top:1rem">Parents are welcome to visit. Please telephone ahead so that a member of staff is free to receive you.</p>
    </div>
  </div>
</section>
"""

# ============================================================ 404
notfound = f"""<section class="pagehead" style="min-height:60vh;display:flex;align-items:center">
  <div class="pagehead__bg"><img src="assets/img/hero.jpg" alt=""></div>
  <div class="wrap pagehead__inner">
    <p class="kicker">Error 404</p>
    <h1 class="d2">That page could not be found.</h1>
    <p>The page may have been moved or the address mistyped. The main sections of the site are listed below.</p>
    <p style="margin-top:var(--s3)"><a class="btn btn--gold" href="index.html">Return home {ICON['arrow']}</a></p>
  </div>
</section>
<section>
  <div class="wrap cards">
    <article class="card"><h3>Admissions</h3><p>Senior school placement and the fee structure.</p><p><a class="pillar__more" href="admissions.html">View {ICON['arrow']}</a></p></article>
    <article class="card"><h3>Academics</h3><p>Pathways, subjects and the full examination record.</p><p><a class="pillar__more" href="academics.html">View {ICON['arrow']}</a></p></article>
    <article class="card"><h3>Contact</h3><p>Telephone, email and directions.</p><p><a class="pillar__more" href="contact.html">View {ICON['arrow']}</a></p></article>
  </div>
</section>
"""

# ============================================================ WRITE
built = [
 page("index.html", "Strive for Excellence",
      "St. Francis Girls&rsquo; High School, Suwerwa &mdash; a girls&rsquo; boarding school in Cherangany, Trans Nzoia County, founded 2013.", "", home),
 page("about.html", "About", "The story, vision, mission and core values of St. Francis Girls&rsquo; High School, Suwerwa.", "about.html", about),
 page("academics.html", "Academics", "Senior school pathways and the complete examination record of St. Francis Girls&rsquo; High School since 2013.", "academics.html", academics),
 page("admissions.html", "Admissions", "Grade 10 senior school placement, pathways, reporting dates and fee structure.", "admissions.html", admissions),
 page("student-life.html", "Student life", "Boarding, pastoral care, chaplaincy, clubs and games.", "student-life.html", life),
 page("leadership.html", "Leadership &amp; heritage", "Principals and Board of Management Chairpersons since 2013.", "", leadership),
 page("news.html", "News &amp; events", "Announcements, term dates and events.", "news.html", news),
 page("gallery.html", "Gallery", "Photographs of the school.", "", gallery),
 page("contact.html", "Contact", "Telephone, email and directions to the school.", "contact.html", contact),
 page("404.html", "Page not found", "The page could not be found.", "", notfound),
]
print("built:", ", ".join(built))
