const VOCAB_BANK = [
  ["apple", "苹果"], ["banana", "香蕉"], ["orange", "橙子"], ["grape", "葡萄"],
  ["watermelon", "西瓜"], ["pear", "梨"], ["peach", "桃子"], ["strawberry", "草莓"],
  ["cat", "猫"], ["dog", "狗"], ["bird", "鸟"], ["fish", "鱼"], ["rabbit", "兔子"],
  ["tiger", "老虎"], ["elephant", "大象"], ["monkey", "猴子"], ["book", "书"],
  ["pen", "钢笔"], ["pencil", "铅笔"], ["ruler", "尺子"], ["bag", "书包"],
  ["desk", "课桌"], ["chair", "椅子"], ["school", "学校"], ["teacher", "老师"],
  ["student", "学生"], ["friend", "朋友"], ["family", "家庭"], ["father", "爸爸"],
  ["mother", "妈妈"], ["brother", "兄弟"], ["sister", "姐妹"], ["red", "红色"],
  ["blue", "蓝色"], ["green", "绿色"], ["yellow", "黄色"], ["black", "黑色"],
  ["white", "白色"], ["one", "一"], ["two", "二"], ["three", "三"], ["four", "四"],
  ["five", "五"], ["six", "六"], ["seven", "七"], ["eight", "八"], ["nine", "九"],
  ["ten", "十"], ["run", "跑"], ["jump", "跳"], ["read", "读"], ["write", "写"],
  ["sing", "唱歌"], ["dance", "跳舞"], ["eat", "吃"], ["drink", "喝"],
  ["happy", "高兴的"], ["sad", "难过的"], ["big", "大的"], ["small", "小的"],
  ["long", "长的"], ["short", "短的"], ["hot", "热的"], ["cold", "冷的"],
  ["sunny", "晴朗的"], ["rainy", "下雨的"], ["morning", "早晨"], ["afternoon", "下午"],
  ["evening", "晚上"], ["home", "家"], ["park", "公园"], ["water", "水"],
  ["milk", "牛奶"], ["rice", "米饭"], ["bread", "面包"]
];

const DEFAULT_QUESTIONS = VOCAB_BANK.flatMap(([en, zh]) => ([
  { prompt: `"${en}" 的中文是？`, answer: zh, wrongOptions: [] },
  { prompt: `"${zh}" 的英文是？`, answer: en, wrongOptions: [] }
]));

let questionBank = normalizeQuestions(DEFAULT_QUESTIONS);

window.alert = (message) => {
  console.warn(message);
  const preview = document.getElementById("bankPreview");
  if (preview && !preview.closest("[hidden]")) {
    preview.value = String(message || "");
  }
};

const state = {
  scoreDelta: 0,
  leftCorrect: 0,
  rightCorrect: 0,
  winLimit: 6,
  startedAt: Date.now(),
  gameOver: false,
  timerId: null,
  bgmPlaying: false,
  left: { current: null, locked: false, recent: [] },
  right: { current: null, locked: false, recent: [] }
};

const els = {
  tugScene: document.getElementById("tugScene"),
  blueTeam: document.getElementById("blueTeam"),
  redTeam: document.getElementById("redTeam"),
  leftPrompt: document.getElementById("leftPrompt"),
  rightPrompt: document.getElementById("rightPrompt"),
  leftOptions: document.getElementById("leftOptions"),
  rightOptions: document.getElementById("rightOptions"),
  leftFeedback: document.getElementById("leftFeedback"),
  rightFeedback: document.getElementById("rightFeedback"),
  leftCorrect: document.getElementById("leftCorrect"),
  rightCorrect: document.getElementById("rightCorrect"),
  blueScore: document.getElementById("blueScore"),
  redScore: document.getElementById("redScore"),
  timer: document.getElementById("timer"),
  deltaMarker: document.getElementById("deltaMarker"),
  deltaText: document.getElementById("deltaText"),
  resultBanner: document.getElementById("resultBanner"),
  resultText: document.getElementById("resultText"),
  winLimitSelect: document.getElementById("winLimitSelect"),
  resetBtn: document.getElementById("resetBtn"),
  playAgainBtn: document.getElementById("playAgainBtn"),
  fullscreenBtn: document.getElementById("fullscreenBtn"),
  audioBtn: document.getElementById("audioBtn"),
  bankBtn: document.getElementById("bankBtn"),
  bankModal: document.getElementById("bankModal"),
  closeBankBtn: document.getElementById("closeBankBtn"),
  templateXlsxBtn: document.getElementById("templateXlsxBtn"),
  importBankBtn: document.getElementById("importBankBtn"),
  importBankInput: document.getElementById("importBankInput"),
  bankPreview: document.getElementById("bankPreview"),
  bankCount: document.getElementById("bankCount"),
  bgmAudio: document.getElementById("bgmAudio"),
  correctSound: document.getElementById("correctSound"),
  wrongSound: document.getElementById("wrongSound"),
  pullSound: document.getElementById("pullSound"),
  winSound: document.getElementById("winSound"),
  clickSound: document.getElementById("clickSound")
};

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickFirst(row, names) {
  for (const name of names) {
    if (row[name] !== undefined && String(row[name]).trim() !== "") return String(row[name]).trim();
  }
  return "";
}

function normalizeQuestions(rows) {
  const raw = rows.map((row) => {
    const prompt = pickFirst(row, ["题目", "问题", "prompt", "question"]);
    const answer = pickFirst(row, ["正确答案", "答案", "answer", "correct"]);
    const wrongOptions = [
      pickFirst(row, ["错误选项1", "干扰项1", "选项A", "wrong1"]),
      pickFirst(row, ["错误选项2", "干扰项2", "选项B", "wrong2"]),
      pickFirst(row, ["错误选项3", "干扰项3", "选项C", "wrong3"])
    ].filter(Boolean);
    return { prompt, answer, wrongOptions };
  }).filter((row) => row.prompt && row.answer);

  if (raw.length < 4) {
    throw new Error("题库至少需要 4 道题，才能让两个队伍岔开出题并生成干扰选项。");
  }

  const allAnswers = [...new Set(raw.map((row) => row.answer))];
  return raw.map((row, index) => {
    const fallbackWrong = shuffle(allAnswers.filter((answer) => answer !== row.answer));
    const wrongOptions = [...new Set([...row.wrongOptions, ...fallbackWrong])]
      .filter((option) => option !== row.answer)
      .slice(0, 3);

    if (wrongOptions.length < 3) {
      throw new Error("题库答案需要更丰富，或在模板里填写 3 个错误选项。");
    }

    return {
      id: `${index}-${row.prompt}-${row.answer}`,
      prompt: row.prompt,
      answer: row.answer,
      wrongOptions
    };
  });
}

function buildOptions(question) {
  return shuffle([question.answer, ...shuffle(question.wrongOptions).slice(0, 3)]);
}

function pickQuestion(side) {
  const otherSide = side === "left" ? "right" : "left";
  const otherId = state[otherSide].current?.id;
  const recent = new Set(state[side].recent);
  const strictPool = questionBank.filter((question) => question.id !== otherId && !recent.has(question.id));
  const loosePool = questionBank.filter((question) => question.id !== otherId);
  const pool = strictPool.length ? strictPool : (loosePool.length ? loosePool : questionBank);
  const question = randomItem(pool);
  state[side].recent = [question.id, ...state[side].recent.filter((id) => id !== question.id)].slice(0, 4);
  return { ...question, options: buildOptions(question) };
}

function textWeight(text) {
  return Array.from(String(text)).reduce((sum, char) => {
    return sum + (/[\u4e00-\u9fff]/.test(char) ? 2 : 1);
  }, 0);
}

function applyTextDensity(element, text, type) {
  const weight = textWeight(text);
  if (type === "prompt") {
    element.classList.remove("prompt-long", "prompt-very-long", "prompt-tiny");
    if (weight >= 54) element.classList.add("prompt-tiny");
    else if (weight >= 38) element.classList.add("prompt-very-long");
    else if (weight >= 26) element.classList.add("prompt-long");
    return;
  }

  element.classList.remove("long-text", "extra-long-text", "compact-text", "micro-text");
  if (weight >= 36) element.classList.add("micro-text");
  else if (weight >= 26) element.classList.add("compact-text");
  else if (weight >= 18) element.classList.add("extra-long-text");
  else if (weight >= 12) element.classList.add("long-text");
}

function markPromptLength(promptEl, side, text) {
  const panel = promptEl.closest(".team-panel");
  const weight = textWeight(text);
  panel?.classList.remove("has-long-prompt", "has-very-long-prompt");
  if (weight >= 38) panel?.classList.add("has-very-long-prompt");
  else if (weight >= 26) panel?.classList.add("has-long-prompt");

  window.requestAnimationFrame(() => fitPromptText(promptEl));
}

function fitPromptText(promptEl) {
  let size = parseFloat(getComputedStyle(promptEl).fontSize);
  let guard = 0;
  while (
    guard < 18 &&
    size > 14 &&
    (promptEl.scrollHeight > promptEl.clientHeight + 1 || promptEl.scrollWidth > promptEl.clientWidth + 1)
  ) {
    size -= 1.4;
    promptEl.style.fontSize = `${size}px`;
    promptEl.style.lineHeight = size < 18 ? "1.04" : "1.08";
    guard += 1;
  }
}

function renderQuestion(side) {
  const sideState = state[side];
  sideState.current = pickQuestion(side);
  const promptEl = side === "left" ? els.leftPrompt : els.rightPrompt;
  const optionsEl = side === "left" ? els.leftOptions : els.rightOptions;
  const feedbackEl = side === "left" ? els.leftFeedback : els.rightFeedback;

  promptEl.textContent = sideState.current.prompt;
  promptEl.style.fontSize = "";
  promptEl.style.lineHeight = "";
  applyTextDensity(promptEl, sideState.current.prompt, "prompt");
  markPromptLength(promptEl, side, sideState.current.prompt);
  feedbackEl.textContent = side === "left" ? "点中正确答案就向左拉" : "点中正确答案就向右拉";
  optionsEl.innerHTML = "";

  sideState.current.options.forEach((optionText) => {
    const button = document.createElement("button");
    button.className = "option-btn";
    button.type = "button";
    button.textContent = optionText;
    applyTextDensity(button, optionText, "option");
    button.addEventListener("pointerup", (event) => {
      event.preventDefault();
      handleAnswer(side, optionText, button);
    });
    optionsEl.appendChild(button);
  });
}

function handleAnswer(side, selected, button) {
  if (state.gameOver || state[side].locked) return;

  const current = state[side].current;
  if (!current) return;

  playSound(els.clickSound, 0.18);

  if (selected !== current.answer) {
    playSound(els.wrongSound, 0.42);
    button.classList.remove("wrong-flash");
    void button.offsetWidth;
    button.classList.add("wrong-flash");
    setFeedback(side, "答错了，题目不换，继续想");
    window.setTimeout(() => button.classList.remove("wrong-flash"), 900);
    return;
  }

  state[side].locked = true;
  button.classList.add("correct-flash");
  playSound(els.correctSound, 0.42);
  window.setTimeout(() => playSound(els.pullSound, 0.34), 70);

  if (side === "left") {
    state.scoreDelta += 1;
    state.leftCorrect += 1;
    triggerPull("left");
    setFeedback("left", "正确，蓝队发力");
  } else {
    state.scoreDelta -= 1;
    state.rightCorrect += 1;
    triggerPull("right");
    setFeedback("right", "正确，红队发力");
  }

  updateScoreboard();
  updateScenePosition();

  if (Math.abs(state.scoreDelta) >= state.winLimit) {
    finishGame(state.scoreDelta > 0 ? "left" : "right");
    return;
  }

  window.setTimeout(() => {
    state[side].locked = false;
    renderQuestion(side);
  }, 360);
}

function setFeedback(side, text) {
  const feedbackEl = side === "left" ? els.leftFeedback : els.rightFeedback;
  feedbackEl.textContent = text;
}

function triggerPull(side) {
  const cluster = side === "left" ? els.blueTeam : els.redTeam;
  cluster.classList.remove("pulling");
  void cluster.offsetWidth;
  cluster.classList.add("pulling");
  window.setTimeout(() => cluster.classList.remove("pulling"), 560);
}

function updateScoreboard() {
  els.leftCorrect.textContent = state.leftCorrect;
  els.rightCorrect.textContent = state.rightCorrect;
  els.blueScore.textContent = state.leftCorrect;
  els.redScore.textContent = state.rightCorrect;
  els.deltaText.textContent = `${Math.abs(state.scoreDelta)} / ${state.winLimit}`;
}

function updateScenePosition() {
  const step = Math.min(42, Math.max(30, els.tugScene.clientWidth * 0.045));
  const offset = -state.scoreDelta * step;
  els.tugScene.style.setProperty("--scene-offset", `${offset}px`);

  const markerPercent = 50 - (state.scoreDelta / state.winLimit) * 46;
  els.deltaMarker.style.left = `${Math.max(4, Math.min(96, markerPercent))}%`;
}

function finishGame(winner) {
  state.gameOver = true;
  state.left.locked = true;
  state.right.locked = true;
  els.resultBanner.hidden = false;
  els.resultBanner.classList.toggle("red-win", winner === "right");
  els.resultText.textContent = winner === "left" ? "蓝队获胜" : "红队获胜";
  setFeedback("left", winner === "left" ? "蓝队赢了" : "本局结束");
  setFeedback("right", winner === "right" ? "红队赢了" : "本局结束");
  playSound(els.winSound, 0.45);
}

function resetGame() {
  state.scoreDelta = 0;
  state.leftCorrect = 0;
  state.rightCorrect = 0;
  state.winLimit = Number(els.winLimitSelect.value);
  state.startedAt = Date.now();
  state.gameOver = false;
  state.left.locked = false;
  state.right.locked = false;
  state.left.recent = [];
  state.right.recent = [];
  els.resultBanner.hidden = true;
  els.resultBanner.classList.remove("red-win");
  updateScoreboard();
  updateScenePosition();
  renderQuestion("left");
  renderQuestion("right");
}

function updateTimer() {
  const elapsed = Math.max(0, Math.floor((Date.now() - state.startedAt) / 1000));
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  els.timer.textContent = `${minutes}:${seconds}`;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

function playSound(audio, volume = 0.35) {
  if (!audio) return;
  try {
    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {
    // Some browsers block audio until the first whiteboard tap.
  }
}

async function toggleBgm() {
  if (!state.bgmPlaying) {
    try {
      els.bgmAudio.volume = 0.28;
      await els.bgmAudio.play();
      state.bgmPlaying = true;
      els.audioBtn.textContent = "静音";
    } catch {
      els.audioBtn.textContent = "放入BGM";
      alert("请把本地背景音乐放到 assets/audio/bgm.mp3，然后重新打开游戏。");
    }
  } else {
    els.bgmAudio.pause();
    state.bgmPlaying = false;
    els.audioBtn.textContent = "音乐";
  }
}

function makeTemplateRows() {
  return [
    { 题目: '"apple" 的中文是？', 正确答案: "苹果", 错误选项1: "香蕉", 错误选项2: "学校", 错误选项3: "跑" },
    { 题目: "8 + 7 = ?", 正确答案: "15", 错误选项1: "14", 错误选项2: "16", 错误选项3: "13" },
    { 题目: "“春风又绿江南岸”的下一句是？", 正确答案: "明月何时照我还", 错误选项1: "二月春风似剪刀", 错误选项2: "春眠不觉晓", 错误选项3: "低头思故乡" },
    { 题目: "长方形的面积公式是？", 正确答案: "长×宽", 错误选项1: "边长×边长", 错误选项2: "底×高÷2", 错误选项3: "（上底+下底）×高÷2" },
    { 题目: '"高兴的" 的英文是？', 正确答案: "happy", 错误选项1: "sad", 错误选项2: "cold", 错误选项3: "short" },
    { 题目: "下列哪个是量词？", 正确答案: "只", 错误选项1: "跑", 错误选项2: "红", 错误选项3: "学校" }
  ];
}

function downloadTemplateXlsx() {
  if (!window.XLSX) {
    alert("缺少 XLSX 组件，请确认 assets/vendor/xlsx.full.min.js 存在。");
    return;
  }
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(makeTemplateRows(), {
    header: ["题目", "正确答案", "错误选项1", "错误选项2", "错误选项3"]
  });
  sheet["!cols"] = [{ wch: 34 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(workbook, sheet, "题库模板");
  XLSX.writeFile(workbook, "学习拔河题目模板.xlsx");
}

function openBankModal() {
  refreshBankPreview();
  els.bankModal.hidden = false;
}

function closeBankModal() {
  els.bankModal.hidden = true;
}

function refreshBankPreview() {
  els.bankCount.textContent = `${questionBank.length} 道题`;
  els.bankPreview.value = questionBank
    .slice(0, 80)
    .map((question, index) => `${index + 1}. ${question.prompt}\n答案：${question.answer}\n选项：${shuffle([question.answer, ...question.wrongOptions]).join(" / ")}`)
    .join("\n\n");
}

async function importBankFile(file) {
  if (!window.XLSX) {
    throw new Error("缺少 XLSX 组件，请确认 assets/vendor/xlsx.full.min.js 存在。");
  }
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
  questionBank = normalizeQuestions(rows);
  resetGame();
  refreshBankPreview();
}

async function toggleBgmSafe() {
  if (!state.bgmPlaying) {
    try {
      els.bgmAudio.volume = 0.28;
      await els.bgmAudio.play();
      state.bgmPlaying = true;
      els.audioBtn.textContent = "静音";
    } catch {
      state.bgmPlaying = false;
      els.audioBtn.textContent = "缺少BGM";
      window.setTimeout(() => {
        if (!state.bgmPlaying) els.audioBtn.textContent = "音乐";
      }, 1500);
    }
    return;
  }

  els.bgmAudio.pause();
  state.bgmPlaying = false;
  els.audioBtn.textContent = "音乐";
}

function installWhiteboardGuards() {
  const stop = (event) => event.preventDefault();
  ["contextmenu", "selectstart", "dragstart", "auxclick"].forEach((eventName) => {
    document.addEventListener(eventName, stop, { capture: true });
  });

  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const blocked =
      key === "f12" ||
      (event.ctrlKey && ["u", "s", "p", "o"].includes(key)) ||
      (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(key));
    if (blocked) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, { capture: true });
}

els.resetBtn.addEventListener("click", resetGame);
els.playAgainBtn.addEventListener("click", resetGame);
els.winLimitSelect.addEventListener("change", resetGame);
els.fullscreenBtn.addEventListener("click", toggleFullscreen);
els.audioBtn.addEventListener("click", toggleBgmSafe);
els.bankBtn.addEventListener("click", openBankModal);
els.closeBankBtn.addEventListener("click", closeBankModal);
els.templateXlsxBtn.addEventListener("click", downloadTemplateXlsx);
els.importBankBtn.addEventListener("click", () => els.importBankInput.click());
els.importBankInput.addEventListener("change", async () => {
  const [file] = els.importBankInput.files;
  if (!file) return;
  try {
    await importBankFile(file);
    els.bankPreview.value = `${els.bankPreview.value}\n\n导入成功：${file.name}`;
  } catch (error) {
    alert(error.message || "题库导入失败，请检查 Excel 表头和内容。");
  } finally {
    els.importBankInput.value = "";
  }
});
els.bankModal.addEventListener("pointerdown", (event) => {
  if (event.target === els.bankModal) closeBankModal();
});
window.addEventListener("resize", updateScenePosition);

installWhiteboardGuards();
state.timerId = window.setInterval(updateTimer, 500);
resetGame();
updateTimer();
