/* ============================================================
 * 绿循 GreenCycle · AI 智能垃圾分类与资源回收系统
 * 分类流程：文本预处理 → 同义词归一化 → 规则优先匹配 → 多项式朴素贝叶斯
 * 所有计算均在浏览器端完成，无任何后端与 API 依赖。
 * ============================================================ */

const CATEGORIES = {
  recyclable: {
    name: "可回收物", en: "RECYCLABLE WASTE", icon: "♻", color: "#60a5fa",
    desc: "适宜回收与资源化利用的废弃物。保持清洁干燥、减少杂质，是提升再生品质的关键一步。",
    disposal: "清空内容物并尽量沥干；纸箱可压扁投放，玻璃等易碎物请妥善包裹，具体以当地收运要求为准。",
    route: "回收分拣 → 再生加工 → 再生原料 / 再生产品",
    examples: ["塑料瓶", "纸箱", "报纸", "玻璃瓶", "金属罐", "旧衣物", "书本", "牛奶盒"]
  },
  kitchen: {
    name: "厨余垃圾", en: "FOOD WASTE", icon: "❀", color: "#34d399",
    desc: "易腐烂的有机质废弃物，可通过厌氧消化与堆肥回归土地，转化为沼气与土壤改良材料。",
    disposal: "沥干水分，去除塑料袋、餐具等包装杂质；骨壳类请以所在地细则为准。",
    route: "分类收运 → 厌氧消化 / 堆肥 → 沼气、土壤改良材料",
    examples: ["剩饭剩菜", "果皮", "菜叶", "茶渣", "蛋壳", "水果果核", "鱼骨", "过期食品"]
  },
  hazardous: {
    name: "有害垃圾", en: "HAZARDOUS WASTE", icon: "!", color: "#fb7185",
    desc: "对人体健康或生态环境存在直接、潜在危害的废弃物，须单独收集并交由专业机构安全处置。",
    disposal: "轻拿轻放，避免破损泄漏；切勿与普通垃圾混投，请交由规范的有害垃圾收集点。",
    route: "专门收集 → 分类暂存 → 规范无害化处置",
    examples: ["废电池", "过期药品", "废灯管", "废油漆桶", "杀虫剂", "温度计", "废胶片", "指甲油"]
  },
  other: {
    name: "其他垃圾", en: "RESIDUAL WASTE", icon: "+", color: "#94a3b8",
    desc: "不属于可回收物、厨余垃圾与有害垃圾的生活废弃物，通常进入末端无害化处理。",
    disposal: "尽量沥干水分；尖锐物品请妥善包裹，避免收运过程中划伤作业人员。",
    route: "分类收运 → 焚烧发电 / 卫生填埋等末端处理",
    examples: ["污染纸巾", "尿不湿", "烟蒂", "陶瓷碎片", "尘土", "一次性奶茶杯", "一次性餐具", "大骨头"]
  }
};

// 同义词映射：口语表达 → 知识库标准名称
const SYNONYMS = {
  "矿泉水瓶": "塑料瓶", "饮料瓶": "塑料瓶", "矿泉水瓶子": "塑料瓶", "pet瓶": "塑料瓶",
  "快递盒": "纸箱", "快递包装箱": "纸箱", "纸皮箱": "纸箱", "瓦楞纸箱": "纸箱",
  "易拉罐": "金属罐", "啤酒瓶": "玻璃瓶", "旧报纸": "报纸", "废旧衣服": "旧衣物",
  "电动车电池": "废电池", "纽扣电池": "废电池", "手机电池": "废电池", "充电电池": "废电池", "铅酸电池": "废电池",
  "过期药": "过期药品", "药片": "过期药品", "剩菜": "剩饭剩菜", "剩饭": "剩饭剩菜",
  "果核": "水果果核", "苹果核": "水果果核", "香蕉皮": "果皮", "橘子皮": "果皮", "西瓜皮": "果皮",
  "菜梗": "菜叶", "茶叶": "茶渣", "奶茶杯": "一次性奶茶杯",
  "用过的纸巾": "污染纸巾", "厕纸": "污染纸巾", "卫生纸": "污染纸巾", "湿纸巾": "污染纸巾",
  "尿布": "尿不湿", "纸尿裤": "尿不湿", "烟头": "烟蒂",
  "灯泡": "废灯管", "荧光灯": "废灯管", "节能灯": "废灯管", "油漆桶": "废油漆桶",
  "瓷碗": "陶瓷碎片", "碎瓷片": "陶瓷碎片", "外卖盒": "一次性餐具", "一次性筷子": "一次性餐具"
};

// 标准词条 → 类别（优先直接命中）
const EXACT = {
  "塑料瓶": "recyclable", "纸箱": "recyclable", "报纸": "recyclable", "玻璃瓶": "recyclable",
  "金属罐": "recyclable", "旧衣物": "recyclable", "书本": "recyclable", "纸张": "recyclable",
  "塑料玩具": "recyclable", "牛奶盒": "recyclable", "快递纸箱": "recyclable", "纸袋": "recyclable",
  "废旧家电": "recyclable", "易拉罐": "recyclable", "玻璃罐": "recyclable", "杂志": "recyclable",
  "废电池": "hazardous", "过期药品": "hazardous", "废灯管": "hazardous", "废油漆桶": "hazardous",
  "杀虫剂": "hazardous", "温度计": "hazardous", "废胶片": "hazardous", "指甲油": "hazardous",
  "水银": "hazardous", "农药": "hazardous", "废机油": "hazardous", "染发剂": "hazardous",
  "剩饭剩菜": "kitchen", "果皮": "kitchen", "菜叶": "kitchen", "茶渣": "kitchen", "蛋壳": "kitchen",
  "水果果核": "kitchen", "咖啡渣": "kitchen", "鱼骨": "kitchen", "虾壳": "kitchen", "过期食品": "kitchen",
  "玉米芯": "kitchen", "瓜子壳": "kitchen", "花生壳": "kitchen",
  "污染纸巾": "other", "尿不湿": "other", "烟蒂": "other", "陶瓷碎片": "other", "尘土": "other",
  "一次性奶茶杯": "other", "一次性餐具": "other", "大骨头": "other", "贝壳": "other", "镜子": "other",
  "口香糖": "other", "牙签": "other"
};

// 安全优先规则：高环境风险物品优先判定，避免被普通关键词稀释
const SAFETY_RULES = [
  [/电池|药品|药片|药水|药膏|荧光灯|节能灯|灯管|油漆|涂料|农药|杀虫剂|消毒剂|温度计|水银|指甲油|洗甲水|机油|胶片|染发剂|试剂/, "hazardous"],
  [/果皮|菜叶|剩饭|剩菜|茶渣|咖啡渣|蛋壳|鱼骨|虾壳|果核|瓜子壳|花生壳|菜根|豆渣|汤渣|过期食品|玉米芯/, "kitchen"],
  [/塑料瓶|纸箱|快递|报纸|书本|杂志|玻璃瓶|金属罐|易拉罐|旧衣物|牛奶盒|纸袋|家电|玩具/, "recyclable"],
  [/纸巾|尿不湿|卫生巾|烟蒂|烟头|陶瓷|瓷片|尘土|牙签|口香糖|奶茶杯|一次性餐具|大骨头|贝壳|镜子/, "other"]
];

// 朴素贝叶斯训练语料（小规模教学样例）
const TRAINING = {
  recyclable: [
    "塑料瓶 饮料瓶 矿泉水瓶 PET瓶 塑料包装瓶", "纸箱 快递纸箱 纸盒 瓦楞纸板 包装箱",
    "报纸 旧报纸 杂志 书本 书籍 纸张", "玻璃瓶 酒瓶 玻璃罐 碎玻璃瓶",
    "金属罐 易拉罐 铝罐 铁罐 金属制品", "旧衣物 衣服 纺织品 布料 废旧衣服",
    "塑料玩具 塑料盆 塑料桶 塑料制品", "牛奶盒 饮料盒 利乐包装 纸铝塑复合包装",
    "纸袋 纸质包装 信封 卡纸", "废旧家电 电风扇 电饭锅 小型电器",
    "干净塑料袋 塑料包装膜", "金属锅 铁锅 铝制品", "旧书 本子 练习册",
    "干净玻璃杯 玻璃器皿", "硬纸板 纸板箱"
  ],
  kitchen: [
    "剩饭剩菜 米饭 面条 菜肴 食物残渣", "果皮 苹果皮 香蕉皮 橘子皮 西瓜皮",
    "菜叶 菜根 菜梗 蔬菜残余", "茶渣 茶叶渣 咖啡渣 咖啡粉",
    "蛋壳 鸡蛋壳 鸭蛋壳", "水果果核 苹果核 桃核 果肉",
    "鱼骨 鱼内脏 虾壳 蟹壳", "过期食品 面包 蛋糕 熟食",
    "玉米芯 甘蔗渣 植物残余", "豆渣 豆腐渣 面包屑", "瓜子壳 花生壳",
    "鸡骨 小型禽类骨头", "食物汤渣 中药渣", "腐烂蔬菜 腐烂水果", "剩余面包 馒头"
  ],
  hazardous: [
    "废电池 纽扣电池 充电电池 铅酸电池", "过期药品 药片 药水 药膏",
    "废灯管 荧光灯管 节能灯", "废油漆桶 油漆 涂料 桶",
    "杀虫剂 消毒剂 化学药剂", "温度计 水银温度计 汞",
    "废胶片 感光材料 相纸", "指甲油 洗甲水 染发剂",
    "废矿物油 废机油", "过期农药 农药瓶", "含汞灯泡 含汞物品",
    "化学试剂 实验室废液", "废弃化妆品 化学品容器", "电动车废旧电池", "废弃药瓶 药物包装"
  ],
  other: [
    "污染纸巾 湿纸巾 卫生纸 厕纸", "尿不湿 纸尿裤 卫生巾", "烟蒂 烟头 烟灰",
    "陶瓷碎片 瓷碗 瓷片", "尘土 灰尘 扫地灰", "一次性奶茶杯 奶茶杯 一次性纸杯",
    "一次性餐具 一次性筷子 外卖餐盒", "大骨头 猪骨 牛骨", "贝壳 蛤蜊壳 牡蛎壳",
    "镜子 镜片", "毛发 宠物毛发", "胶带 胶布 透明胶", "口香糖 牙签",
    "破损陶瓷 花盆碎片", "复合材质脏污包装"
  ]
};

const QUIZ = [
  { q: "喝完并简单冲洗、沥干的塑料矿泉水瓶，通常属于？", a: "recyclable", why: "清洁、干燥的塑料饮料瓶具有回收利用价值，属于可回收物。" },
  { q: "家中已经过期的药片，应该投放到？", a: "hazardous", why: "过期药品可能含有药理活性成分，应作为有害垃圾规范收集。" },
  { q: "吃完橘子后留下的橘子皮，通常属于？", a: "kitchen", why: "橘子皮属于易腐有机质，可纳入厨余垃圾分类。" },
  { q: "被油污严重污染、难以回收的纸巾，通常属于？", a: "other", why: "污染纸巾纤维回收价值低，通常按其他垃圾处理。" },
  { q: "废旧纽扣电池应该如何分类？", a: "hazardous", why: "应按所在地规定交至有害垃圾收集点，不宜混入普通垃圾。" },
  { q: "吃剩的米饭和蔬菜残渣，通常属于？", a: "kitchen", why: "剩饭剩菜属于典型易腐性厨余垃圾。" },
  { q: "干净的旧报纸和杂志，通常属于？", a: "recyclable", why: "纸类在保持干燥、清洁的情况下可回收再生利用。" },
  { q: "破碎的陶瓷碗碟，通常属于？", a: "other", why: "陶瓷碎片通常不属于可回收物，应按其他垃圾或当地专项规定处理。" },
  { q: "用过的口罩（非疫情期间普通使用），一般按哪类处理？", a: "other", why: "普通使用后口罩通常按其他垃圾处理，医疗废物另按专门规定。" },
  { q: "喝剩的奶茶、咖啡残渣连同杯子，处理方式是？", a: "other", why: "一次性奶茶杯多为复合材质且常有残液，通常按其他垃圾处理，残留饮品可倒掉。" }
];

const CATEGORY_KEYS = ["recyclable", "kitchen", "hazardous", "other"];
const STORAGE_KEY = "greencycle-history-v1";
let historyItems = safeParse(localStorage.getItem(STORAGE_KEY), []);
let quizState = { questions: [], index: 0, score: 0, selected: null, answered: false };

function safeParse(str, fallback) {
  try { return JSON.parse(str) || fallback; } catch (e) { return fallback; }
}
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- 文本处理与分类算法 ---------- */
function normalizeText(input) {
  let value = String(input).trim().toLowerCase().replace(/[，。！？、；：,.!?;:（）()【】\[\]\s]/g, "");
  for (const [from, to] of Object.entries(SYNONYMS)) {
    if (value.includes(from)) value = value.split(from).join(to);
  }
  return value;
}
function tokenize(text) {
  const s = String(text).replace(/[^\u4e00-\u9fa5a-z0-9]/g, "");
  const tokens = [];
  for (let i = 0; i < s.length; i++) {
    tokens.push(s[i]);
    if (i < s.length - 1 && /[\u4e00-\u9fa5]/.test(s[i]) && /[\u4e00-\u9fa5]/.test(s[i + 1])) {
      tokens.push(s.slice(i, i + 2));
    }
  }
  return tokens;
}
function trainNaiveBayes() {
  const model = {};
  let totalDocs = 0;
  for (const key of CATEGORY_KEYS) {
    const docs = TRAINING[key];
    totalDocs += docs.length;
    const counts = {};
    let total = 0;
    docs.forEach(doc => tokenize(doc).forEach(t => { counts[t] = (counts[t] || 0) + 1; total++; }));
    model[key] = { counts, total, docs: docs.length };
  }
  const vocabulary = new Set();
  Object.values(model).forEach(m => Object.keys(m.counts).forEach(t => vocabulary.add(t)));
  return { model, vocabulary, totalDocs };
}
const NB = trainNaiveBayes();

function classify(text) {
  const raw = String(text).trim();
  if (!raw) return null;
  const normalized = normalizeText(raw);

  // 1) 标准词条与同义词归一化后直接匹配
  for (const term of Object.keys(EXACT)) {
    if (normalized === term || normalized.includes(term)) {
      return { key: EXACT[term], confidence: 0.99, method: "标准词条与规则库匹配", matched: [term] };
    }
  }
  // 2) 关键词规则优先匹配（环境风险优先）
  for (const [regex, key] of SAFETY_RULES) {
    const match = normalized.match(regex);
    if (match) return { key, confidence: 0.91, method: "关键词规则优先匹配", matched: [match[0]] };
  }
  // 3) 多项式朴素贝叶斯文本分类
  const tokens = tokenize(normalized);
  const scores = {};
  for (const key of CATEGORY_KEYS) {
    const m = NB.model[key];
    let score = Math.log(m.docs / NB.totalDocs);
    tokens.forEach(t => { score += Math.log(((m.counts[t] || 0) + 1) / (m.total + NB.vocabulary.size)); });
    scores[key] = score;
  }
  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const max = sorted[0][1];
  const exps = sorted.map(x => Math.exp(x[1] - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  const confidence = exps[0] / sum;
  const key = sorted[0][0];
  const matched = tokens.filter(t => NB.model[key].counts[t]).slice(0, 5);
  return {
    key,
    confidence: Math.max(0.35, Math.min(0.88, confidence)),
    method: "多项式朴素贝叶斯文本分类",
    matched: matched.length ? matched : ["语义特征综合"]
  };
}

/* ---------- 结果渲染 ---------- */
function renderResult(result, query) {
  const data = CATEGORIES[result.key];
  const area = document.getElementById("resultArea");
  const pct = Math.round(result.confidence * 100);
  area.className = "";
  area.innerHTML = `<div class="result-card">
    <div class="result-head">
      <div class="result-icon" style="background:${data.color}1a;color:${data.color}">${data.icon}</div>
      <div class="result-title"><small>AI 判定 · ${data.en}</small><strong>${escapeHtml(data.name)}</strong></div>
      <span class="confidence">匹配置信度 ${pct}%</span>
    </div>
    <p class="result-desc">“${escapeHtml(query)}”建议归入<b style="color:${data.color}">${data.name}</b>。${data.desc}</p>
    <div class="result-box"><b>投放建议</b><p>${data.disposal}</p></div>
    <div class="result-box"><b>后续处理方向</b><p>${data.route}</p></div>
    <div class="match-tags"><span>方法：${result.method}</span>${result.matched.map(x => `<span>依据：${escapeHtml(x)}</span>`).join("")}</div>
  </div>`;
}
function doClassify(value) {
  const input = document.getElementById("wasteInput");
  const query = (value !== undefined ? value : input.value).trim();
  if (!query) {
    document.getElementById("inputHint").textContent = "请先输入一个具体的物品名称，再开始智能识别。";
    input.focus();
    return;
  }
  const result = classify(query);
  renderResult(result, query);
  historyItems.unshift({ query, key: result.key, at: new Date().toISOString() });
  historyItems = historyItems.slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historyItems));
  renderHistory();
  updateMetrics();
  document.getElementById("inputHint").textContent = "识别完成。若物品由多种材料组成，建议拆分查询，并以所在地分类目录为准。";
}
function updateMetrics() {
  const el = document.getElementById("heroKnowledge");
  if (el) el.textContent = Object.keys(EXACT).length + "+";
}
function renderHistory() {
  const list = document.getElementById("historyList");
  if (!list) return;
  if (!historyItems.length) {
    list.innerHTML = '<p class="history-empty">还没有查询记录，试试上面的物品吧。</p>';
    return;
  }
  list.innerHTML = historyItems.slice(0, 12).map(item => {
    const c = CATEGORIES[item.key] || CATEGORIES.other;
    return `<div class="history-item" data-query="${escapeHtml(item.query)}">
      <span class="h-dot" style="background:${c.color}"></span>
      <span>${escapeHtml(item.query)}</span>
      <span class="h-key">${c.name}</span>
    </div>`;
  }).join("");
  list.querySelectorAll(".history-item").forEach(el => {
    el.addEventListener("click", () => {
      document.getElementById("wasteInput").value = el.dataset.query;
      doClassify(el.dataset.query);
      document.getElementById("classify").scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ---------- 四分类指南 ---------- */
function renderGuide() {
  const grid = document.getElementById("guideGrid");
  grid.innerHTML = CATEGORY_KEYS.map(key => {
    const c = CATEGORIES[key];
    return `<article class="guide-card" style="--gc:${c.color}">
      <div class="guide-icon">${c.icon}</div>
      <h3>${c.name}</h3>
      <div class="guide-en">${c.en}</div>
      <p class="g-desc">${c.desc}</p>
      <div class="g-sub">常见例子</div>
      <div class="g-examples">${c.examples.map(e => `<span>${e}</span>`).join("")}</div>
      <p class="g-tip"><b>投放提示：</b>${c.disposal}</p>
    </article>`;
  }).join("");
}

/* ---------- 知识挑战 ---------- */
function startQuiz() {
  const shuffled = [...QUIZ].sort(() => Math.random() - 0.5);
  quizState = { questions: shuffled.slice(0, 5), index: 0, score: 0, selected: null, answered: false };
  renderQuestion();
}
function renderQuestion() {
  quizState.selected = null;
  quizState.answered = false;
  const q = quizState.questions[quizState.index];
  const main = document.getElementById("quizMain");
  document.getElementById("quizProgress").style.width = (quizState.index / 5 * 100) + "%";
  document.getElementById("quizStep").textContent = `已完成 ${quizState.index} / 5 题`;
  const opts = [...CATEGORY_KEYS].sort(() => Math.random() - 0.5);
  main.innerHTML = `<div class="quiz-question">
    <div class="q-count">QUESTION ${String(quizState.index + 1).padStart(2, "0")} / 05</div>
    <h3>${q.q}</h3>
    <div class="quiz-options">${opts.map(k => `<button class="quiz-option" data-key="${k}">${CATEGORIES[k].icon}　${CATEGORIES[k].name}</button>`).join("")}</div>
    <div id="quizFeedback"></div>
    <div class="quiz-actions"><span style="font-size:11px;color:#93a095">当前得分：${quizState.score} 分</span>
      <button class="button button-primary" id="quizNext" disabled>确认答案 →</button></div>
  </div>`;
  main.querySelectorAll(".quiz-option").forEach(btn => btn.addEventListener("click", () => selectAnswer(btn.dataset.key)));
  document.getElementById("quizNext").addEventListener("click", nextQuestion);
}
function selectAnswer(key) {
  if (quizState.answered) return;
  quizState.selected = key;
  quizState.answered = true;
  const q = quizState.questions[quizState.index];
  const correct = key === q.a;
  if (correct) quizState.score += 20;
  document.querySelectorAll(".quiz-option").forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.key === q.a) btn.classList.add("selected");
    if (btn.dataset.key === key && !correct) btn.style.borderColor = "#d68b73";
  });
  const feedback = document.getElementById("quizFeedback");
  feedback.className = "quiz-feedback " + (correct ? "correct" : "wrong");
  feedback.innerHTML = `<strong>${correct ? "回答正确 ✓" : "再记牢这个知识点"}</strong><br>正确分类：${CATEGORIES[q.a].name}。${q.why}`;
  const next = document.getElementById("quizNext");
  next.disabled = false;
  next.textContent = quizState.index === 4 ? "查看成绩 →" : "下一题 →";
}
function nextQuestion() {
  quizState.index++;
  if (quizState.index >= 5) { renderQuizEnd(); return; }
  renderQuestion();
}
function renderQuizEnd() {
  document.getElementById("quizProgress").style.width = "100%";
  document.getElementById("quizStep").textContent = "挑战完成 · 5 / 5 题";
  document.getElementById("quizMain").innerHTML = `<div class="quiz-start">
    <div class="quiz-start-icon">✧</div>
    <h3>本次得分：${quizState.score} / 100</h3>
    <p>${quizState.score === 100 ? "满分！你已经是垃圾分类达人了。" : quizState.score >= 80 ? "太棒了！分类知识已经相当扎实。" : quizState.score >= 60 ? "不错！再巩固一下易混淆的类别会更稳。" : "继续加油！回到分类指南复习后，再来挑战一次。"}</p>
    <button class="button button-primary" id="restartQuiz">再挑战一次 →</button>
  </div>`;
  document.getElementById("restartQuiz").addEventListener("click", startQuiz);
}

/* ---------- 导航与初始化 ---------- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  toggle.addEventListener("click", () => links.classList.toggle("open"));
  links.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));

  const sections = [...document.querySelectorAll("section[id]")];
  const navAnchors = [...links.querySelectorAll("a")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    sections.forEach(s => observer.observe(s));
  }
}

let __initialized = false;
function init() {
  if (__initialized) return;
  __initialized = true;
  document.getElementById("classifyBtn").addEventListener("click", () => doClassify());
  document.getElementById("wasteInput").addEventListener("keydown", e => { if (e.key === "Enter") doClassify(); });
  document.querySelectorAll(".chip").forEach(btn => btn.addEventListener("click", () => {
    document.getElementById("wasteInput").value = btn.dataset.example;
    doClassify(btn.dataset.example);
  }));
  document.getElementById("clearHistory").addEventListener("click", () => {
    historyItems = [];
    localStorage.removeItem(STORAGE_KEY);
    renderHistory();
  });
  document.getElementById("startQuiz").addEventListener("click", startQuiz);
  renderGuide();
  renderHistory();
  updateMetrics();
  initNav();
}

document.addEventListener("DOMContentLoaded", init);
