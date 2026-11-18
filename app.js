const CATEGORIES = {
  recyclable: {name:"可回收物", en:"RECYCLABLE", icon:"↻", color:"#4b86c9", desc:"适宜回收利用和资源化利用的生活废弃物。建议保持清洁、干燥，减少杂质，提高再生利用质量。", disposal:"清空内容物，尽量保持干燥；纸箱可压扁，玻璃等易碎物品应妥善包装后按当地要求投放。", route:"回收分拣 → 再生加工 → 再生原料或再生产品"},
  kitchen: {name:"厨余垃圾", en:"FOOD WASTE", icon:"❀", color:"#4c9a70", desc:"易腐烂、含有机质的生活废弃物，可通过厌氧消化、堆肥等方式实现资源化利用。", disposal:"尽量沥干水分，去除塑料袋、餐具等包装杂质；具体骨头、贝壳等类别请参考当地细则。", route:"分类收运 → 厌氧消化 / 堆肥 → 沼气、土壤改良材料等"},
  hazardous: {name:"有害垃圾", en:"HAZARDOUS", icon:"!", color:"#d36e63", desc:"对人体健康或自然环境造成直接或潜在危害的废弃物，需要分类收集和安全处置。", disposal:"轻拿轻放，避免破损、泄漏；不要与普通生活垃圾混投，应交至规范的有害垃圾收集点。", route:"专门收集 → 分类暂存 → 规范无害化处置"},
  other: {name:"其他垃圾", en:"RESIDUAL", icon:"＋", color:"#7e9187", desc:"除可回收物、有害垃圾、厨余垃圾以外的其他生活废弃物。", disposal:"尽量沥干水分；尖锐物品应妥善包裹，避免收运过程中划伤工作人员。", route:"分类收运 → 焚烧 / 卫生填埋等末端处理"}
};

// 同义词映射：将口语表达归一到知识库中的标准名称。
const SYNONYMS = {"矿泉水瓶":"塑料瓶","饮料瓶":"塑料瓶","快递盒":"纸箱","快递包装箱":"纸箱","纸皮箱":"纸箱","易拉罐":"金属罐","啤酒瓶":"玻璃瓶","旧报纸":"报纸","废旧衣服":"旧衣物","电动车电池":"废电池","纽扣电池":"废电池","手机电池":"废电池","过期药":"过期药品","剩菜":"剩饭剩菜","剩饭":"剩饭剩菜","果核":"水果果核","苹果核":"水果果核","香蕉皮":"果皮","橘子皮":"果皮","菜梗":"菜叶","茶叶":"茶渣","奶茶杯":"一次性奶茶杯","用过的纸巾":"污染纸巾","厕纸":"污染纸巾","尿布":"尿不湿","烟头":"烟蒂","灯泡":"废灯管","荧光灯":"废灯管","油漆桶":"废油漆桶"};

const EXACT = {
  "塑料瓶":"recyclable","纸箱":"recyclable","报纸":"recyclable","玻璃瓶":"recyclable","金属罐":"recyclable","旧衣物":"recyclable","书本":"recyclable","纸张":"recyclable","塑料玩具":"recyclable","易拉罐":"recyclable","废旧家电":"recyclable","牛奶盒":"recyclable","快递纸箱":"recyclable","纸袋":"recyclable",
  "废电池":"hazardous","过期药品":"hazardous","废灯管":"hazardous","废油漆桶":"hazardous","杀虫剂":"hazardous","温度计":"hazardous","废胶片":"hazardous","指甲油":"hazardous",
  "剩饭剩菜":"kitchen","果皮":"kitchen","菜叶":"kitchen","茶渣":"kitchen","蛋壳":"kitchen","水果果核":"kitchen","咖啡渣":"kitchen","鱼骨":"kitchen","虾壳":"kitchen","过期食品":"kitchen",
  "污染纸巾":"other","尿不湿":"other","烟蒂":"other","陶瓷碎片":"other","尘土":"other","一次性奶茶杯":"other","一次性餐具":"other","大骨头":"other","贝壳":"other","镜子":"other"
};

const TRAINING = {
  recyclable: [
    "塑料瓶 饮料瓶 矿泉水瓶 PET瓶 塑料包装瓶","纸箱 快递纸箱 纸盒 瓦楞纸板 包装箱","报纸 旧报纸 杂志 书本 书籍 纸张","玻璃瓶 酒瓶 玻璃罐 碎玻璃瓶","金属罐 易拉罐 铝罐 铁罐 金属制品","旧衣物 衣服 纺织品 布料 废旧衣服","塑料玩具 塑料盆 塑料桶 塑料制品","牛奶盒 饮料盒 利乐包装 纸铝塑复合包装","纸袋 纸质包装 信封 卡纸","废旧家电 电风扇 电饭锅 小型电器","干净塑料袋 塑料包装膜","金属锅 铁锅 铝制品","旧书 本子 练习册","干净玻璃杯 玻璃器皿","硬纸板 纸板箱"
  ],
  kitchen: [
    "剩饭剩菜 米饭 面条 菜肴 食物残渣","果皮 苹果皮 香蕉皮 橘子皮 西瓜皮","菜叶 菜根 菜梗 蔬菜残余","茶渣 茶叶渣 咖啡渣 咖啡粉","蛋壳 鸡蛋壳 鸭蛋壳","水果果核 苹果核 桃核 果肉","鱼骨 鱼内脏 虾壳 蟹壳","过期食品 面包 蛋糕 熟食","玉米芯 甘蔗渣 植物残余","豆渣 豆腐渣 面包屑","瓜子壳 花生壳","鸡骨 小型禽类骨头","食物汤渣 中药渣","腐烂蔬菜 腐烂水果","剩余面包 馒头"
  ],
  hazardous: [
    "废电池 纽扣电池 充电电池 铅酸电池","过期药品 药片 药水 药膏","废灯管 荧光灯管 节能灯","废油漆桶 油漆 涂料 桶","杀虫剂 消毒剂 化学药剂","温度计 水银温度计 汞","废胶片 感光材料 相纸","指甲油 洗甲水 染发剂","废矿物油 废机油","过期农药 农药瓶","含汞灯泡 含汞物品","化学试剂 实验室废液","废弃化妆品 化学品容器","电动车废旧电池","废弃药瓶 药物包装"
  ],
  other: [
    "污染纸巾 湿纸巾 卫生纸 厕纸","尿不湿 纸尿裤 卫生巾","烟蒂 烟头 烟灰","陶瓷碎片 瓷碗 瓷片","尘土 灰尘 扫地灰","一次性奶茶杯 奶茶杯 一次性纸杯","一次性餐具 一次性筷子 外卖餐盒","大骨头 猪骨 牛骨","贝壳 蛤蜊壳 牡蛎壳","镜子 镜片","毛发 宠物毛发","胶带 胶布 透明胶","口香糖 牙签","破损陶瓷 花盆碎片","复合材质脏污包装"
  ]
};

const QUIZ = [
  {q:"喝完并简单冲洗、沥干的塑料矿泉水瓶，通常属于？",a:"recyclable",why:"清洁、干燥的塑料饮料瓶具有回收利用价值，属于可回收物。"},
  {q:"家中已经过期的药片，应该投放到？",a:"hazardous",why:"过期药品可能含有药理活性成分，应作为有害垃圾规范收集。"},
  {q:"吃完橘子后留下的橘子皮，通常属于？",a:"kitchen",why:"橘子皮属于易腐有机质，可纳入厨余垃圾分类。"},
  {q:"被油污严重污染、难以回收的纸巾，通常属于？",a:"other",why:"污染纸巾纤维回收价值低，通常按其他垃圾处理。"},
  {q:"废旧纽扣电池应该如何分类？",a:"hazardous",why:"废旧纽扣电池应按所在地规定交至有害垃圾收集点，不宜混入普通垃圾。"},
  {q:"吃剩的米饭和蔬菜残渣，通常属于？",a:"kitchen",why:"剩饭剩菜属于典型易腐性厨余垃圾。"},
  {q:"干净的旧报纸和杂志，通常属于？",a:"recyclable",why:"纸类在保持干燥、清洁的情况下可回收再生利用。"},
  {q:"破碎的陶瓷碗碟，通常属于？",a:"other",why:"陶瓷碎片通常不属于生活垃圾可回收物，应按其他垃圾或当地专项规定处理。"}
];

const CATEGORY_KEYS = ["recyclable","kitchen","hazardous","other"];
const STORAGE_KEY = "green-cycle-history-v1";
let historyItems = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let quizState = {questions:[],index:0,score:0,selected:null,answered:false};

function normalizeText(input){
  let value = input.trim().toLowerCase().replace(/[，。！？、；：,.!?;:（）()【】\[\]\s]/g,"");
  for(const [from,to] of Object.entries(SYNONYMS)){ if(value.includes(from)) value=value.replaceAll(from,to); }
  return value;
}
function tokenize(text){
  const s = text.replace(/[^\u4e00-\u9fa5a-z0-9]/g,"");
  const tokens = [];
  for(let i=0;i<s.length;i++){
    tokens.push(s[i]);
    if(i<s.length-1 && /[\u4e00-\u9fa5]/.test(s[i]) && /[\u4e00-\u9fa5]/.test(s[i+1])) tokens.push(s.slice(i,i+2));
  }
  return tokens;
}
function trainNaiveBayes(){
  const model = {};
  let totalDocs=0;
  for(const key of CATEGORY_KEYS){
    const docs=TRAINING[key]; totalDocs+=docs.length;
    const counts={}; let total=0;
    docs.forEach(doc=>tokenize(doc).forEach(t=>{counts[t]=(counts[t]||0)+1;total++;}));
    model[key]={counts,total,docs:docs.length};
  }
  const vocabulary=new Set();
  Object.values(model).forEach(m=>Object.keys(m.counts).forEach(t=>vocabulary.add(t)));
  return {model,vocabulary,totalDocs};
}
const NB = trainNaiveBayes();

function classify(text){
  const raw=text.trim();
  if(!raw) return null;
  const normalized=normalizeText(raw);
  const exactKey=Object.keys(EXACT).find(k=>normalized===k || normalized.includes(k));
  if(exactKey){
    const key=EXACT[exactKey];
    return {key,confidence:0.99,method:"标准词条与规则库匹配",matched:[exactKey],standard:exactKey};
  }
  // 高优先级安全规则，避免有害物品被普通关键词稀释。
  const safetyRules=[
    [/电池|药品|药片|药水|荧光灯|节能灯|油漆|农药|杀虫剂|温度计|水银|指甲油|洗甲水|机油/,"hazardous"],
    [/果皮|菜叶|剩饭|剩菜|茶渣|咖啡渣|蛋壳|鱼骨|虾壳|果核|瓜子壳|花生壳/,"kitchen"],
    [/纸箱|报纸|书本|塑料瓶|玻璃瓶|金属罐|易拉罐|旧衣物|牛奶盒/,"recyclable"],
    [/纸巾|尿不湿|卫生巾|烟蒂|烟头|陶瓷|尘土|牙签|口香糖/,"other"]
  ];
  for(const [regex,key] of safetyRules){
    const match=normalized.match(regex);
    if(match) return {key,confidence:0.91,method:"关键词规则优先匹配",matched:[match[0]],standard:raw};
  }
  const tokens=tokenize(normalized);
  const scores={};
  for(const key of CATEGORY_KEYS){
    const m=NB.model[key];
    let score=Math.log(m.docs/NB.totalDocs);
    tokens.forEach(t=>{score+=Math.log(((m.counts[t]||0)+1)/(m.total+NB.vocabulary.size));});
    scores[key]=score;
  }
  const sorted=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const max=sorted[0][1], exps=sorted.map(x=>Math.exp(x[1]-max)), sum=exps.reduce((a,b)=>a+b,0);
  const confidence=exps[0]/sum;
  const key=sorted[0][0];
  const matched=tokens.filter(t=>NB.model[key].counts[t]).slice(0,5);
  return {key,confidence:Math.max(.35,Math.min(.88,confidence)),method:"多项式朴素贝叶斯文本分类",matched:matched.length?matched:["语义相似度"],standard:raw};
}

function renderResult(result,query){
  const data=CATEGORIES[result.key];
  const area=document.getElementById("resultArea");
  const pct=Math.round(result.confidence*100);
  area.innerHTML=`<div class="result-card">
    <div class="result-head"><div class="result-icon" style="background:${data.color}18;color:${data.color}">${data.icon}</div>
      <div class="result-title"><small>识别建议 · ${data.en}</small><strong>${escapeHtml(data.name)}</strong></div>
      <span class="confidence">匹配参考值 ${pct}%</span></div>
    <p class="result-desc">“${escapeHtml(query)}”建议归入${data.name}。${data.desc}</p>
    <div class="result-box"><b>♧ 投放建议</b><p>${data.disposal}</p></div>
    <div class="result-box"><b>↗ 后续处理方向</b><p>${data.route}</p></div>
    <div class="match-tags"><span>方法：${result.method}</span>${result.matched.map(x=>`<span>依据：${escapeHtml(x)}</span>`).join("")}</div>
  </div>`;
}
function escapeHtml(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function doClassify(value){
  const input=document.getElementById("wasteInput");
  const query=(value??input.value).trim();
  if(!query){document.getElementById("inputHint").textContent="请先输入一个具体物品名称，再进行分类查询。";input.focus();return;}
  const result=classify(query);
  renderResult(result,query);
  historyItems.unshift({query,key:result.key,at:new Date().toISOString(),method:result.method});
  historyItems=historyItems.slice(0,100);
  localStorage.setItem(STORAGE_KEY,JSON.stringify(historyItems));
  updateMetrics();
  document.getElementById("inputHint").textContent="已完成分类建议。若物品由多种材料组成，请拆分查询，并以所在地分类目录为准。";
}
function updateMetrics(){
  document.getElementById("queryCount").textContent=historyItems.length;
  document.getElementById("knowledgeCount").textContent=Object.keys(EXACT).length+"+";
}
document.getElementById("classifyBtn").addEventListener("click",()=>doClassify());
document.getElementById("wasteInput").addEventListener("keydown",e=>{if(e.key==="Enter")doClassify();});
document.querySelectorAll(".chip").forEach(btn=>btn.addEventListener("click",()=>{document.getElementById("wasteInput").value=btn.dataset.example;doClassify(btn.dataset.example);}));

function startQuiz(){
  const shuffled=[...QUIZ].sort(()=>Math.random()-.5);
  quizState={questions:shuffled.slice(0,5),index:0,score:0,selected:null,answered:false};
  renderQuestion();
}
function renderQuestion(){
  const q=quizState.questions[quizState.index];
  const main=document.getElementById("quizMain");
  document.getElementById("quizProgress").style.width=(quizState.index/5*100)+"%";
  document.getElementById("quizStep").textContent=`已完成 ${quizState.index} / 5 题`;
  const opts=[...CATEGORY_KEYS].sort(()=>Math.random()-.5);
  main.innerHTML=`<div class="quiz-question"><div class="q-count">QUESTION ${String(quizState.index+1).padStart(2,"0")} / 05</div>
    <h3>${q.q}</h3><div class="quiz-options">${opts.map(k=>`<button class="quiz-option" data-key="${k}">${CATEGORIES[k].icon}　${CATEGORIES[k].name}</button>`).join("")}</div>
    <div id="quizFeedback"></div><div class="quiz-actions"><span style="font-size:10px;color:#93a095">当前得分：${quizState.score} 分</span><button class="button button-primary" id="quizNext" disabled>确认答案 →</button></div></div>`;
  main.querySelectorAll(".quiz-option").forEach(btn=>btn.addEventListener("click",()=>selectAnswer(btn.dataset.key)));
  document.getElementById("quizNext").addEventListener("click",nextQuestion);
}
function selectAnswer(key){
  if(quizState.answered)return;
  quizState.selected=key;quizState.answered=true;
  const q=quizState.questions[quizState.index],correct=key===q.a;
  if(correct)quizState.score+=20;
  document.querySelectorAll(".quiz-option").forEach(btn=>{
    btn.disabled=true;
    if(btn.dataset.key===q.a)btn.classList.add("selected");
    if(btn.dataset.key===key && !correct)btn.style.borderColor="#d68b73";
  });
  const feedback=document.getElementById("quizFeedback");
  feedback.className="quiz-feedback "+(correct?"correct":"wrong");
  feedback.innerHTML=`<strong>${correct?"回答正确 ✓":"再记住这个知识点"}</strong><br>正确分类：${CATEGORIES[q.a].name}。${q.why}`;
  document.getElementById("quizNext").disabled=false;
  document.getElementById("quizNext").textContent=quizState.index===4?"查看成绩 →":"下一题 →";
}
function nextQuestion(){
  quizState.index++;
  if(quizState.index>=5){renderQuizEnd();return;}
  renderQuestion();
}
function renderQuizEnd(){
  document.getElementById("quizProgress").style.width="100%";
  document.getElementById("quizStep").textContent="挑战完成 · 5 / 5 题";
  document.getElementById("quizMain").innerHTML=`<div class="quiz-start"><span class="quiz-start-icon">✧</span><h3>本次得分：${quizState.score} / 100</h3><p>${quizState.score>=80?"太棒了！你已经掌握了不少分类知识。":quizState.score>=60?"不错！再复习一下易混淆类别会更好。":"继续加油！回到分类指南巩固知识，再来挑战一次。"}</p><button class="button button-primary" id="restartQuiz">再挑战一次 <span>→</span></button></div>`;
  document.getElementById("restartQuiz").addEventListener("click",startQuiz);
}
document.getElementById("startQuiz").addEventListener("click",startQuiz);
updateMetrics();
