/* ============ CONFIG ============ */
const CONFIG = {
  github:   "sudarshan200417",   // from your resume
  leetcode: "sudarshan_sinha",   // from your resume
  gfg:      "sudarshan2eay8",    // from your latest resume (an older one says "sudarshan2eay" - keep the one that opens your profile)
  trailhead: "npgjtzo8kzc103qoqt" // your Trailblazer ID from your resume
};
/* Optional: URL of a JSON endpoint you control (see README) that returns { points, badges }.
   Leave empty to show the numbers in TRAILHEAD_MANUAL. */
const TRAILHEAD_API = "";   // e.g. "https://your-worker.workers.dev/?id="
/* Last-known numbers, shown when a live fetch fails. Type your real current numbers here (or leave null). */
const SNAPSHOT_LABEL = "saved";
const SNAPSHOT = {
  gh:  null,  // e.g. { repos: 12, followers: 8, following: 15 }
  lc:  null,  // e.g. { total: 120, easy: 70, med: 45, hard: 5, rank: 250000 }
  gfg: null   // e.g. { solved: 100, score: 350 }
};
const TRAILHEAD_MANUAL = { points: "25,000+", badges: "20+" };  // update by hand as you earn more

/* ---------- Track switcher ---------- */
const COPY = {
  software: ["apps people can rely on.",
    "Flutter developer with a published Google Play app (500+ downloads), Firebase-backed products and 200+ DSA problems solved. Final-year Integrated MCA student."],
  security: ["automation that cuts alert fatigue.",
    "Cybersecurity and Forensics student who built a SOC workflow with Wazuh, TheHive and Shuffle that reduced manual triage time by about 60%."],
  salesforce: ["Salesforce orgs that stay secure.",
    "Hands-on Salesforce administrator: data modeling, access control, Flow automation and reports, with 25,000+ Trailhead points."]
};

/* Resume downloaded by each portfolio track. Keep the PDFs in assets/ beside this file. */
const RESUMES = {
  software: { file: "assets/Sudarshan_Sinha_Software_AI_Resume.pdf", name: "Sudarshan_Sinha_Software_AI_Resume.pdf" },
  security: { file: "assets/Sudarshan_Sinha_Security_Sales_Resume.pdf", name: "Sudarshan_Sinha_Security_Sales_Resume.pdf" },
  salesforce: { file: "assets/Sudarshan_Sinha_Salesforce_Admin_Resume.pdf", name: "Sudarshan_Sinha_Salesforce_Admin_Resume.pdf" }
};
const root = document.documentElement;
const cards = document.querySelectorAll("#projGrid .card");
const resumeLink = document.querySelector('.cta .btn.primary[download]');

function updateResume(t){
  const resume = RESUMES[t];
  if(!resume || !resumeLink) return;
  resumeLink.href = resume.file;
  resumeLink.setAttribute("download", resume.name);
  resumeLink.setAttribute("aria-label", `Download ${t} resume`);
}

function setTrack(t){
  root.dataset.track = t;
  document.getElementById("heroWord").textContent = COPY[t][0];
  document.getElementById("heroSub").textContent = COPY[t][1];
  document.querySelectorAll(".tracks button").forEach(b => b.setAttribute("aria-pressed", b.dataset.track === t));
  cards.forEach(c => {
    const match = c.dataset.tags.split(" ").includes(t);
    c.classList.toggle("hit", match);
    c.classList.toggle("dim", !match);
  });
  updateResume(t);
}
document.querySelectorAll(".tracks button").forEach(b => b.addEventListener("click", () => setTrack(b.dataset.track)));
setTrack("software");

/* ---------- Theme toggle ---------- */
const themeBtn = document.getElementById("theme");
themeBtn.addEventListener("click", () => {
  const dark = root.dataset.theme === "dark" ||
    (!root.dataset.theme && matchMedia("(prefers-color-scheme: dark)").matches);
  root.dataset.theme = dark ? "light" : "dark";
  themeBtn.textContent = dark ? "Dark mode" : "Light mode";
});

/* ---------- Live stats ---------- */
const $ = id => document.getElementById(id);
function status(id, live, text){
  const el = $(id); el.className = "dot" + (live ? " live" : "");
  el.innerHTML = "<i></i>" + text;
}
function setBig(id, value, label){ $(id).innerHTML = value + "<small>" + label + "</small>"; }
async function getJSON(url){
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 25000);
  try{
    const r = await fetch(url, {signal: ctl.signal});
    if(!r.ok) throw new Error(r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}
/* Try each URL in order and return the first one that works and passes check(). */
async function firstWorking(urls, check){
  for(const u of urls){
    try{ const d = await getJSON(u); const out = check(d); if(out) return out; }catch(e){}
  }
  return null;
}
const num = v => (v === undefined || v === null || v === "" || isNaN(Number(v))) ? null : Number(v);

function showGH(r, live, label){
  setBig("ghRepos", r.repos, "public repos");
  $("ghFollowers").textContent = r.followers;
  $("ghFollowing").textContent = r.following;
  status("ghDot", live, label);
}
async function loadGitHub(){
  try{
    const d = await getJSON("https://api.github.com/users/" + CONFIG.github);
    showGH({repos: d.public_repos, followers: d.followers, following: d.following}, true, "live");
  }catch(e){
    if(SNAPSHOT.gh) showGH(SNAPSHOT.gh, false, SNAPSHOT_LABEL);
    else {
      setBig("ghRepos", "GitHub", "profile");
      $("ghFollowers").closest(".rows").innerHTML = "<span>Live GitHub numbers are unavailable right now.</span>";
      status("ghDot", false, "offline");
    }
  }
}

/* Shown only when the live fetch fails AND SNAPSHOT is empty. Uses facts from your resume, never blank. */
function fallback(which){
  if(which === "lc"){
    setBig("lcSolved", "200+", "DSA problems (LeetCode + GFG)");
    $("lcEasy").closest(".rows").innerHTML = "<span>Live LeetCode numbers are unavailable right now.</span>";
    status("lcDot", false, "offline");
  } else {
    setBig("gfgSolved", "Top 3", "coder in the institute");
    $("gfgScore").closest(".rows").innerHTML = "<span>Live GFG numbers are unavailable right now.</span>";
    status("gfgDot", false, "offline");
  }
}
function showLC(r, live, label){
  setBig("lcSolved", r.total, "solved");
  $("lcEasy").textContent = r.easy; $("lcMed").textContent = r.med; $("lcHard").textContent = r.hard;
  $("lcRank").textContent = r.rank ? "#" + Number(r.rank).toLocaleString() : "-";
  const t = r.total || 1;
  $("lcE").style.width = r.easy / t * 100 + "%";
  $("lcM").style.width = r.med / t * 100 + "%";
  $("lcH").style.width = r.hard / t * 100 + "%";
  status("lcDot", live, label);
}
function showGFG(r, live, label){
  setBig("gfgSolved", r.solved, "problems solved");
  $("gfgScore").textContent = r.score ?? "-";
  status("gfgDot", live, label);
}

async function loadLeetCode(){
  const u = CONFIG.leetcode;
  /* LeetCode has no official public API. Add more mirrors to this list if one goes down. */
  const r = await firstWorking([
    "https://leetcode-api-faisalshohag.vercel.app/" + u,
    "https://leetcode-stats-api.herokuapp.com/" + u,
    "https://alfa-leetcode-api.onrender.com/" + u + "/solved"
  ], d => {
    const total = num(d.totalSolved ?? d.solvedProblem);
    if(total === null) return null;
    return {
      total,
      easy: num(d.easySolved) ?? 0,
      med:  num(d.mediumSolved) ?? 0,
      hard: num(d.hardSolved) ?? 0,
      rank: num(d.ranking)
    };
  });
  if(!r){ SNAPSHOT.lc ? showLC(SNAPSHOT.lc, false, SNAPSHOT_LABEL) : fallback("lc"); return; }
  showLC(r, true, "live");
}

async function loadGFG(){
  const u = CONFIG.gfg;
  /* GeeksforGeeks has no official public API. Add more mirrors to this list if one goes down. */
  const r = await firstWorking([
    "https://geeks-for-geeks-api.vercel.app/" + u,
    "https://geeksforgeeks-api.vercel.app/" + u
  ], d => {
    const info = d.info || d;
    const solved = num(info.totalProblemsSolved ?? info.total_problems_solved);
    if(solved === null) return null;
    return { solved, score: info.codingScore ?? info.coding_score };
  });
  if(!r){ SNAPSHOT.gfg ? showGFG(SNAPSHOT.gfg, false, SNAPSHOT_LABEL) : fallback("gfg"); return; }
  showGFG(r, true, "live");
}

async function loadTrailhead(){
  setBig("thPoints", TRAILHEAD_MANUAL.points, "points");
  $("thBadges").textContent = TRAILHEAD_MANUAL.badges;
  if(!TRAILHEAD_API){ status("thDot", false, "manual"); return; }
  try{
    const d = await getJSON(TRAILHEAD_API + CONFIG.trailhead);
    const pts = num(d.points ?? d.EarnedPointTotal), bdg = num(d.badges ?? d.EarnedBadgeTotal);
    if(pts === null) throw new Error("bad");
    setBig("thPoints", pts.toLocaleString(), "points");
    if(bdg !== null) $("thBadges").textContent = bdg;
    status("thDot", true, "live");
  }catch(e){ status("thDot", false, "manual"); }
}

/* ---------- Profile links: paste your URLs to fill the "View profile" buttons ---------- */
const LINKS = {
  ghLink:  "https://github.com/sudarshan200417",
  lcLink:  "",  // ADD LeetCode profile URL
  gfgLink: "",  // ADD GeeksforGeeks profile URL
  thLink:  ""   // ADD Trailblazer profile URL
};
Object.entries(LINKS).forEach(([id, url]) => { if(url) $(id).href = url; });

loadGitHub(); loadLeetCode(); loadGFG(); loadTrailhead();
