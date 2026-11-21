const EXCEL_COLUMNS = ["线路(上/中/下)", "题目描述", "选项A", "选项B", "选项C", "选项D", "正确答案(A/B/C/D或答案文本)"];
const OPTION_KEYS = ["A", "B", "C", "D"];
const RECOMMENDED_PER_LANE = 55;
const RECOMMENDED_TOTAL = RECOMMENDED_PER_LANE * 3;
const RECOMMENDED_WITH_JUNGLE = RECOMMENDED_TOTAL + 20;
const RECORD_STORAGE_KEY = "final-glory-records";
const LAST_PROGRESS_STORAGE_KEY = "final-glory-last-progress";
const BGM_VOLUME_STORAGE_KEY = "final-glory-bgm-volume";
const BGM_TRACK_STORAGE_KEY = "final-glory-bgm-track";
const BGM_SHUFFLE_STORAGE_KEY = "final-glory-bgm-shuffle";
const BGM_LOOP_STORAGE_KEY = "final-glory-bgm-loop";
const DEFAULT_BGM_VOLUME = 35;

const bgmTracks = [
  {
    title: "On My Way",
    artist: "Alan Walker / Sabrina Carpenter / Farruko",
    src: "./assets/on-my-way-bgm.mp3",
  },
  {
    title: "无双的王者",
    artist: "G.E.M. 邓紫棋 / 王者荣耀",
    src: "./assets/wushuang-wangzhe-bgm.mp3",
  },
];

const heroes = [
  {
    id: "algebra",
    name: "代数法师",
    lane: "中",
    image: "./assets/algebra-mage.png",
    desc: "擅长数与代数，连胜后提示消耗更少。",
    skills: ["算", "式", "解"],
  },
  {
    id: "geometry",
    name: "几何剑客",
    lane: "上",
    image: "./assets/geometry-swordsman.png",
    desc: "擅长图形几何，受击后有机会少扣生命。",
    skills: ["形", "角", "面"],
  },
  {
    id: "application",
    name: "应用射手",
    lane: "下",
    image: "./assets/application-archer.png",
    desc: "擅长综合应用，连胜通关更容易获得星星。",
    skills: ["读", "列", "答"],
  },
];

const ranks = ["青铜", "白银", "黄金", "铂金", "钻石", "星耀", "最强王者", "荣耀王者", "百星王者", "国服韩信"];

const laneMeta = {
  上: { label: "上路 · 图形几何", short: "图形几何", accent: "#58b9ff" },
  中: { label: "中路 · 数与代数", short: "数与代数", accent: "#ff6d5f" },
  下: { label: "下路 · 综合应用", short: "综合应用", accent: "#ffcf58" },
  野: { label: "易错点野区", short: "错题挑战", accent: "#a47dff" },
};

const objectiveDefs = [
  { id: "top-minion", lane: "上", type: "minion", name: "上路兵线", required: 5, x: 31, y: 25, icon: "兵" },
  { id: "top-tower-1", lane: "上", type: "tower", name: "上路一塔", required: 15, x: 47, y: 25, icon: "塔" },
  { id: "top-tower-2", lane: "上", type: "tower", name: "上路二塔", required: 15, x: 66, y: 24, icon: "塔" },
  { id: "top-crystal", lane: "上", type: "crystal", name: "上路水晶", required: 20, x: 84, y: 23, icon: "晶" },
  { id: "mid-minion", lane: "中", type: "minion", name: "中路兵线", required: 5, x: 26, y: 50, icon: "兵" },
  { id: "mid-tower-1", lane: "中", type: "tower", name: "中路一塔", required: 15, x: 39, y: 50, icon: "塔" },
  { id: "mid-tower-2", lane: "中", type: "tower", name: "中路二塔", required: 15, x: 59, y: 50, icon: "塔" },
  { id: "mid-crystal", lane: "中", type: "crystal", name: "中路水晶", required: 20, x: 79, y: 50, icon: "晶" },
  { id: "bot-minion", lane: "下", type: "minion", name: "下路兵线", required: 5, x: 35, y: 76, icon: "兵" },
  { id: "bot-tower-1", lane: "下", type: "tower", name: "下路一塔", required: 15, x: 52, y: 75, icon: "塔" },
  { id: "bot-tower-2", lane: "下", type: "tower", name: "下路二塔", required: 15, x: 66, y: 72, icon: "塔" },
  { id: "bot-crystal", lane: "下", type: "crystal", name: "下路水晶", required: 20, x: 84, y: 76, icon: "晶" },
  { id: "jungle-dragon", lane: "野", type: "dragon", name: "易错点野区", required: 20, x: 55, y: 40, icon: "龙" },
];

const sampleQuestions = [
  {
    lane: "上",
    prompt: "一个长方形长 8 厘米，宽 5 厘米，求周长。",
    options: ["8+5", "8×5", "(8+5)×2", "8×2+5"],
    answer: "C",
  },
  {
    lane: "上",
    prompt: "一个正方形边长 6 厘米，求面积。",
    options: ["6+6", "6×4", "6×6", "6÷2"],
    answer: "C",
  },
  {
    lane: "上",
    prompt: "三角形有一个角是 90°，另一个角是 35°，第三个角是多少？",
    options: ["45°", "55°", "65°", "125°"],
    answer: "B",
  },
  {
    lane: "中",
    prompt: "计算 48÷6+7。",
    options: ["13", "14", "15", "16"],
    answer: "C",
  },
  {
    lane: "中",
    prompt: "小明有 x 支铅笔，又买了 5 支，现在有 17 支。x 是多少？",
    options: ["3", "12", "22", "85"],
    answer: "B",
  },
  {
    lane: "中",
    prompt: "计算 125×8。",
    options: ["100", "800", "900", "1000"],
    answer: "D",
  },
  {
    lane: "下",
    prompt: "一本书 96 页，小红 4 天看完，平均每天看多少页？",
    options: ["24 页", "92 页", "100 页", "384 页"],
    answer: "A",
  },
  {
    lane: "下",
    prompt: "3 个同样的篮球一共 135 元，一个篮球多少元？",
    options: ["132 元", "138 元", "45 元", "405 元"],
    answer: "C",
  },
  {
    lane: "下",
    prompt: "一辆车 2 小时行 120 千米，平均每小时行多少千米？",
    options: ["60 千米/时", "118 千米/时", "122 千米/时", "240 千米/时"],
    answer: "A",
  },
];

const state = {
  heroes,
  selectedHeroId: heroes[0].id,
  selectedObjectiveId: null,
  questionBank: sampleQuestions,
  wrongBook: [],
  questionQueues: {},
  lastQuestionByPool: {},
  objectiveProgress: {},
  maxHp: 100,
  hp: 100,
  revives: 1,
  hints: 1,
  coins: 0,
  rankIndex: 0,
  stars: 0,
  currentQuestion: null,
  currentQuestionStart: 0,
  questionLocked: false,
  questionFinished: false,
  totalAnswered: 0,
  totalCorrect: 0,
  completedQuestions: 0,
  totalSeconds: 0,
  streak: 0,
  audioEnabled: true,
  audioContext: null,
  bgmPlaying: false,
  bgmVolume: getStoredBgmVolume(),
  bgmTrackIndex: getStoredBgmTrackIndex(),
  bgmShuffle: getStoredFlag(BGM_SHUFFLE_STORAGE_KEY, false),
  bgmLoop: getStoredFlag(BGM_LOOP_STORAGE_KEY, true),
  records: JSON.parse(localStorage.getItem(RECORD_STORAGE_KEY) || "[]"),
};

objectiveDefs.forEach((objective) => {
  state.objectiveProgress[objective.id] = 0;
});

const el = {
  heroList: document.getElementById("heroList"),
  heroToken: document.getElementById("heroToken"),
  heroTokenImg: document.getElementById("heroTokenImg"),
  nodeLayer: document.getElementById("nodeLayer"),
  selectedTargetText: document.getElementById("selectedTargetText"),
  challengeButton: document.getElementById("challengeButton"),
  battleFeedback: document.getElementById("battleFeedback"),
  downloadTemplate: document.getElementById("downloadTemplate"),
  importWorkbook: document.getElementById("importWorkbook"),
  libraryStatus: document.getElementById("libraryStatus"),
  targetType: document.getElementById("targetType"),
  targetName: document.getElementById("targetName"),
  objectiveProgressText: document.getElementById("objectiveProgressText"),
  objectiveProgressFill: document.getElementById("objectiveProgressFill"),
  questionCounter: document.getElementById("questionCounter"),
  questionTitle: document.getElementById("questionTitle"),
  questionDescription: document.getElementById("questionDescription"),
  comboSteps: document.getElementById("comboSteps"),
  hintButton: document.getElementById("hintButton"),
  nextQuestion: document.getElementById("nextQuestion"),
  maxHp: document.getElementById("maxHp"),
  applyHp: document.getElementById("applyHp"),
  hpFill: document.getElementById("hpFill"),
  hpText: document.getElementById("hpText"),
  shieldText: document.getElementById("shieldText"),
  coinText: document.getElementById("coinText"),
  topCoins: document.getElementById("topCoins"),
  playerName: document.getElementById("playerName"),
  saveRecord: document.getElementById("saveRecord"),
  exportRecords: document.getElementById("exportRecords"),
  lastSavedText: document.getElementById("lastSavedText"),
  rankBadge: document.getElementById("rankBadge"),
  rankStars: document.getElementById("rankStars"),
  topRank: document.getElementById("topRank"),
  topStars: document.getElementById("topStars"),
  soundToggle: document.getElementById("soundToggle"),
  soundState: document.getElementById("soundState"),
  bgmAudio: document.getElementById("bgmAudio"),
  bgmToggle: document.getElementById("bgmToggle"),
  bgmState: document.getElementById("bgmState"),
  bgmTrackName: document.getElementById("bgmTrackName"),
  bgmTrackMeta: document.getElementById("bgmTrackMeta"),
  bgmPrev: document.getElementById("bgmPrev"),
  bgmNext: document.getElementById("bgmNext"),
  bgmShuffle: document.getElementById("bgmShuffle"),
  bgmLoop: document.getElementById("bgmLoop"),
  bgmVolume: document.getElementById("bgmVolume"),
  bgmVolumeText: document.getElementById("bgmVolumeText"),
  accuracyText: document.getElementById("accuracyText"),
  speedText: document.getElementById("speedText"),
  streakText: document.getElementById("streakText"),
  recordList: document.getElementById("recordList"),
  toastStack: document.getElementById("toastStack"),
  quizModal: document.getElementById("quizModal"),
  quizBackdrop: document.getElementById("quizBackdrop"),
  modalClose: document.getElementById("modalClose"),
  modalTargetType: document.getElementById("modalTargetType"),
  modalTargetName: document.getElementById("modalTargetName"),
  modalProgressText: document.getElementById("modalProgressText"),
  modalCoins: document.getElementById("modalCoins"),
  modalHp: document.getElementById("modalHp"),
  modalQuestionTitle: document.getElementById("modalQuestionTitle"),
  modalQuestionText: document.getElementById("modalQuestionText"),
  modalOptions: document.getElementById("modalOptions"),
  modalFeedback: document.getElementById("modalFeedback"),
  modalHint: document.getElementById("modalHint"),
  modalNext: document.getElementById("modalNext"),
};

function init() {
  resetQuestionQueues();
  renderHeroes();
  renderNodes();
  bindEvents();
  selectHero(state.selectedHeroId, true);
  setupBgm();
  updateHud();
  updateTargetPanel();
  renderRecords();
}

function bindEvents() {
  el.downloadTemplate.addEventListener("click", downloadTemplate);
  el.importWorkbook.addEventListener("change", importWorkbook);
  el.challengeButton.addEventListener("click", startChallenge);
  el.hintButton.addEventListener("click", useHint);
  el.nextQuestion.addEventListener("click", startChallenge);
  el.applyHp.addEventListener("click", applyHp);
  el.saveRecord.addEventListener("click", saveRecord);
  el.exportRecords.addEventListener("click", exportRecords);
  el.soundToggle.addEventListener("click", toggleSound);
  el.bgmToggle.addEventListener("click", toggleBgm);
  el.bgmPrev.addEventListener("click", () => prevBgmTrack(true));
  el.bgmNext.addEventListener("click", () => nextBgmTrack(true));
  el.bgmShuffle.addEventListener("click", toggleBgmShuffle);
  el.bgmLoop.addEventListener("click", toggleBgmLoop);
  el.bgmVolume.addEventListener("input", changeBgmVolume);
  el.modalClose.addEventListener("click", closeQuizModal);
  el.quizBackdrop.addEventListener("click", closeQuizModal);
  el.modalHint.addEventListener("click", useHint);
  el.modalNext.addEventListener("click", loadQuestion);
}

function renderHeroes() {
  el.heroList.innerHTML = "";
  state.heroes.forEach((hero) => {
    const button = document.createElement("button");
    button.className = "hero-card";
    button.type = "button";
    button.dataset.heroId = hero.id;
    button.innerHTML = `
      <img src="${hero.image}" alt="${hero.name}" />
      <div>
        <h3>${hero.name}</h3>
        <p>${hero.desc}</p>
        <div class="skill-row">${hero.skills.map((skill) => `<i>${skill}</i>`).join("")}</div>
      </div>
    `;
    button.addEventListener("click", () => selectHero(hero.id));
    el.heroList.appendChild(button);
  });
}

function renderNodes() {
  el.nodeLayer.innerHTML = "";
  objectiveDefs.forEach((objective) => {
    const button = document.createElement("button");
    button.className = "map-node";
    if (isObjectiveCleared(objective)) button.classList.add("is-cleared");
    button.type = "button";
    button.dataset.objectiveId = objective.id;
    button.style.left = `${objective.x}%`;
    button.style.top = `${objective.y}%`;
    button.style.borderColor = `${laneMeta[objective.lane].accent}aa`;
    button.innerHTML = `
      <span class="node-icon">${objective.icon}</span>
      <strong>${objective.name}</strong>
      <span>${progressLabel(objective)}</span>
    `;
    button.addEventListener("click", () => selectObjective(objective.id));
    el.nodeLayer.appendChild(button);
  });
}

function selectHero(heroId, silent = false) {
  state.selectedHeroId = heroId;
  const hero = getHero();
  el.heroTokenImg.src = hero.image;
  document.querySelectorAll(".hero-card").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.heroId === heroId);
  });
  const title = "英雄已出征";
  const message = `${hero.name} 已准备好。点击地图上的小兵、塔、水晶或野区会弹出题目。`;
  if (silent) setFeedbackPanel(title, message);
  else {
    playSound("select");
    feedback(title, message, "gold");
  }
}

function selectObjective(objectiveId) {
  playSound("select");
  const objective = getObjective(objectiveId);
  state.selectedObjectiveId = objectiveId;
  state.currentQuestion = null;
  state.questionFinished = false;
  state.questionLocked = false;
  el.challengeButton.disabled = isObjectiveCleared(objective);
  el.nextQuestion.disabled = true;

  document.querySelectorAll(".map-node").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.objectiveId === objectiveId);
  });

  moveHeroToken(objective.x, objective.y);
  updateTargetPanel();
  renderQuestionIdle(objective);

  if (isObjectiveCleared(objective)) {
    feedback("目标已完成", `${objective.name} 已经被攻破，可以换一个目标。`, "gold");
    return;
  }

  setFeedbackPanel("目标锁定", `${getHero().name} 已到达 ${objective.name}，题目弹窗正在打开。`);
  window.setTimeout(startChallenge, 260);
}

function moveHeroToken(x, y) {
  el.heroToken.classList.add("is-moving");
  el.heroToken.style.left = `${x}%`;
  el.heroToken.style.top = `${y}%`;
  window.setTimeout(() => el.heroToken.classList.remove("is-moving"), 620);
}

function startChallenge() {
  playSound("open");
  if (!state.selectedObjectiveId) {
    feedback("还没有目标", "请先点击地图上的小兵、塔、水晶或野区。", "bad");
    return;
  }
  const objective = getObjective(state.selectedObjectiveId);
  if (isObjectiveCleared(objective)) {
    feedback("目标已完成", `${objective.name} 已经被攻破，可以换一个目标。`, "gold");
    return;
  }
  openQuizModal();
  loadQuestion();
}

function openQuizModal() {
  el.quizModal.classList.remove("is-hidden");
  updateModalStatus();
}

function closeQuizModal() {
  el.quizModal.classList.add("is-hidden");
}

function loadQuestion() {
  const objective = getObjective(state.selectedObjectiveId);
  const nextQuestion = drawQuestion(objective);
  if (!nextQuestion) {
    feedback("题库为空", "请先导入包含对应线路的 Excel 题库。", "bad");
    closeQuizModal();
    return;
  }
  state.currentQuestion = nextQuestion;
  state.questionFinished = false;
  state.questionLocked = false;
  state.currentQuestionStart = Date.now();
  el.nextQuestion.disabled = true;
  el.modalNext.disabled = true;
  el.modalNext.textContent = "下一题";
  renderQuestion();
  updateTargetPanel();
  updateModalStatus();
}

function getQuestionPool(objective) {
  if (objective.type === "dragon") return state.wrongBook.length ? state.wrongBook : state.questionBank;
  const exactLane = state.questionBank.filter((question) => question.lane === objective.lane);
  return exactLane.length ? exactLane : state.questionBank;
}

function getQuestionPoolKey(objective) {
  if (objective.type === "dragon") return state.wrongBook.length ? "错题" : "全题";
  return objective.lane;
}

function drawQuestion(objective) {
  const pool = uniqueQuestions(getQuestionPool(objective));
  if (!pool.length) return null;
  const poolKey = getQuestionPoolKey(objective);
  const ids = pool.map(questionId);
  const signature = ids.join("||");
  const existingQueue = state.questionQueues[poolKey];

  if (!existingQueue || existingQueue.signature !== signature || existingQueue.items.length === 0) {
    const shuffled = shuffle(ids);
    const lastId = state.lastQuestionByPool[poolKey];
    if (lastId && shuffled.length > 1 && shuffled[0] === lastId) {
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
    }
    state.questionQueues[poolKey] = { signature, items: shuffled };
  }

  const id = state.questionQueues[poolKey].items.shift();
  state.lastQuestionByPool[poolKey] = id;
  return pool.find((question) => questionId(question) === id) || pool[0];
}

function renderQuestionIdle(objective) {
  el.questionCounter.textContent = objective ? "弹窗答题" : "未开始";
  el.questionTitle.textContent = objective ? `${objective.name} 挑战` : "准备出征";
  el.questionDescription.textContent = objective
    ? `${objective.name} 需要答对 ${objective.required} 道题。答题会在屏幕中间弹窗显示。`
    : "选择一个英雄，再点击地图上的兵线、塔、水晶或野区，题目会在屏幕中间弹出。";
  el.comboSteps.innerHTML = "";
}

function renderQuestion() {
  const question = state.currentQuestion;
  const objective = getObjective(state.selectedObjectiveId);
  el.questionCounter.textContent = `第 ${state.completedQuestions + 1} 题`;
  el.questionTitle.textContent = `${laneMeta[question.lane]?.short || "数学"}选择题`;
  el.questionDescription.textContent = question.prompt;
  el.comboSteps.innerHTML = '<div class="side-note">题目已在屏幕中间弹出，学生看中间即可作答。</div>';

  el.modalQuestionTitle.textContent = `${laneMeta[question.lane]?.short || "数学"}选择题`;
  el.modalQuestionText.textContent = question.prompt;
  el.modalOptions.innerHTML = "";

  question.options.forEach((option, index) => {
    const key = OPTION_KEYS[index];
    const button = document.createElement("button");
    button.className = "modal-option";
    button.type = "button";
    button.dataset.key = key;
    button.innerHTML = `<span>${key}</span><strong>${escapeHtml(option)}</strong>`;
    button.addEventListener("click", () => answerQuestion(key, button));
    el.modalOptions.appendChild(button);
  });

  setModalFeedback("准备开战", `${typeLabel(objective.type)}会根据你的选择立刻反馈。`, "");
  updateTargetPanel(objective);
}

function answerQuestion(optionKey, button) {
  if (state.questionLocked || state.questionFinished || !state.currentQuestion) return;
  const objective = getObjective(state.selectedObjectiveId);
  const correctKey = answerKeyFor(state.currentQuestion);
  const isCorrect = optionKey === correctKey;
  state.questionLocked = true;
  state.totalAnswered += 1;

  if (isCorrect) {
    playSound("correct");
    button.classList.add("is-correct");
    state.totalCorrect += 1;
    state.streak += 1;
    completeQuestion(objective);
    return;
  }

  playSound("wrong");
  button.classList.add("is-wrong");
  const correctButton = el.modalOptions.querySelector(`[data-key="${correctKey}"]`);
  if (correctButton) correctButton.classList.add("is-correct");
  state.streak = 0;
  state.wrongBook.unshift(state.currentQuestion);
  state.wrongBook = uniqueQuestions(state.wrongBook).slice(0, 60);
  takeDamage(objective);
  setModalFeedback("被反击了", `正确答案是 ${correctKey}。${enemyName(objective)} 反击，你可以点“下一题”继续。`, "bad");
  finishCurrentQuestion(false);
}

function completeQuestion(objective) {
  const seconds = Math.max(1, Math.round((Date.now() - state.currentQuestionStart) / 1000));
  const earnedCoins = coinReward(objective);
  playSound("coin");
  state.coins += earnedCoins;
  state.completedQuestions += 1;
  state.totalSeconds += seconds;
  state.objectiveProgress[objective.id] = Math.min(objective.required, state.objectiveProgress[objective.id] + 1);

  setModalFeedback("答对了", `+${earnedCoins} 金币！${objective.name} 进度 +1，本题用时 ${seconds} 秒。`, "good");
  feedback("金币到账", `答对奖励 +${earnedCoins} 金币，当前金币 ${state.coins}。`, "gold");
  showCoinBurst(earnedCoins);

  if (isObjectiveCleared(objective)) {
    clearObjective(objective);
    finishCurrentQuestion(true, true);
  } else {
    finishCurrentQuestion(true);
  }

  renderNodes();
  updateTargetPanel();
  updateHud();
  updateModalStatus();
}

function finishCurrentQuestion(correct, cleared = false) {
  state.questionFinished = true;
  state.questionLocked = false;
  el.modalOptions.querySelectorAll("button").forEach((button) => {
    button.disabled = true;
  });
  el.nextQuestion.disabled = cleared;
  el.modalNext.disabled = cleared;
  el.modalNext.textContent = cleared ? "目标已攻破" : "下一题";
  if (!correct) {
    updateHud();
    updateModalStatus();
  }
}

function clearObjective(objective) {
  playSound(objective.type === "crystal" ? "rank" : "clear");
  const reward = rewardFor(objective);
  addStars(reward.stars);
  if (objective.type === "dragon") {
    if (Math.random() > 0.5) {
      state.revives += 1;
      setModalFeedback("野区奖励", `${objective.name} 已击败，获得复活甲 1 件。`, "gold");
    } else {
      state.hints += 1;
      setModalFeedback("野区奖励", `${objective.name} 已击败，获得名刀 1 把，可查看提示。`, "gold");
    }
  } else {
    setModalFeedback("目标攻破", `${objective.name} 被打破，获得 ${reward.stars} 颗星。${reward.note}`, "gold");
  }

  if (getHero().id === "application" && state.streak >= 6 && objective.type !== "dragon") {
    addStars(1);
    feedback("应用射手连胜奖励", "连续答对 6 题以上，额外获得 1 颗星。", "gold");
  }

  const node = document.querySelector(`[data-objective-id="${objective.id}"]`);
  if (node) node.classList.add("is-broken");
}

function rewardFor(objective) {
  if (objective.type === "crystal") return { stars: 2, note: "水晶破碎，直接升段！" };
  if (objective.type === "tower") return { stars: 1, note: "再拿一颗星就能升段。" };
  if (objective.type === "dragon") return { stars: 1, note: "野区会额外给装备。" };
  return { stars: 1, note: "小兵清掉，推进更顺。" };
}

function coinReward(objective) {
  return { minion: 10, tower: 15, crystal: 25, dragon: 20 }[objective.type] || 10;
}

function addStars(count) {
  let remaining = count;
  while (remaining > 0 && state.rankIndex < ranks.length - 1) {
    state.stars += 1;
    if (state.stars >= 2) {
      state.stars = 0;
      state.rankIndex += 1;
      feedback("段位提升", `恭喜升到 ${ranks[state.rankIndex]}！每个段位只需要 2 颗星。`, "gold");
    }
    remaining -= 1;
  }
  if (state.rankIndex === ranks.length - 1) state.stars = Math.min(state.stars, 2);
}

function takeDamage(objective) {
  const baseDamage = { minion: 6, tower: 12, crystal: 16, dragon: 14 }[objective.type] || 8;
  const hero = getHero();
  const reduced = hero.id === "geometry" && Math.random() > 0.55;
  const damage = reduced ? Math.ceil(baseDamage * 0.65) : baseDamage;
  state.hp = Math.max(0, state.hp - damage);

  if (state.hp <= 0) {
    if (state.revives > 0) {
      state.revives -= 1;
      state.hp = Math.ceil(state.maxHp * 0.6);
      feedback("复活甲触发", `生命值归零，复活甲自动生效，恢复到 ${state.hp} 点。`, "gold");
    } else {
      state.hp = state.maxHp;
      state.streak = 0;
      feedback("回泉水", "生命值归零，本轮被击退，生命值已重置，可以继续挑战。", "bad");
    }
  } else {
    feedback("受到攻击", `${enemyName(objective)} 反击造成 ${damage} 点伤害。`, "bad");
  }
}

function useHint() {
  playSound("hint");
  if (!state.currentQuestion || state.questionFinished) {
    feedback("暂时不能提示", "先开始一道题，提示会指出当前题目的正确选项。", "bad");
    return;
  }
  if (state.hints <= 0) {
    feedback("名刀不足", "去易错点野区挑战，有机会获得查看提示次数。", "bad");
    return;
  }
  const freeHint = getHero().id === "algebra" && state.streak >= 2;
  if (!freeHint) state.hints -= 1;
  const key = answerKeyFor(state.currentQuestion);
  const answerText = answerTextFor(state.currentQuestion);
  updateHud();
  updateModalStatus();
  setModalFeedback("名刀提示", `正确答案是 ${key}：${answerText}。${freeHint ? "代数法师连胜加成，本次不消耗名刀。" : ""}`, "gold");
}

function applyHp() {
  playSound("select");
  const value = Number(el.maxHp.value);
  if (!Number.isFinite(value) || value < 30) {
    feedback("生命值太低", "生命值至少设置为 30。", "bad");
    return;
  }
  state.maxHp = Math.min(300, Math.round(value));
  state.hp = state.maxHp;
  el.maxHp.value = state.maxHp;
  updateHud();
  updateModalStatus();
  feedback("生命值已更新", `主角最大生命值改为 ${state.maxHp}。`, "good");
}

function downloadTemplate() {
  const rows = sampleQuestions.map((question) => ({
    [EXCEL_COLUMNS[0]]: question.lane,
    [EXCEL_COLUMNS[1]]: question.prompt,
    [EXCEL_COLUMNS[2]]: question.options[0],
    [EXCEL_COLUMNS[3]]: question.options[1],
    [EXCEL_COLUMNS[4]]: question.options[2],
    [EXCEL_COLUMNS[5]]: question.options[3],
    [EXCEL_COLUMNS[6]]: question.answer,
  }));
  const worksheet = XLSX.utils.json_to_sheet(rows, { header: EXCEL_COLUMNS });
  worksheet["!cols"] = [{ wch: 14 }, { wch: 48 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 22 }, { wch: 28 }];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "题库模板");
  XLSX.writeFile(workbook, "期末荣耀选择题模板.xlsx");
  playSound("clear");
  feedback("模板已生成", "已下载普通四选一 .xlsx 模板。保留线路列，填写 A-D 选项和正确答案即可。", "good");
}

function importWorkbook(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    try {
      const workbook = XLSX.read(loadEvent.target.result, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      const parsed = rows.map(parseQuestionRow).filter(Boolean);
      if (!parsed.length) {
        feedback("导入失败", "没有识别到有效选择题，请检查线路、四个选项和正确答案。", "bad");
        return;
      }
      state.questionBank = parsed;
      state.wrongBook = [];
      resetQuestionQueues();
      resetChallengeOnly();
      const counts = laneCounts(parsed);
      el.libraryStatus.textContent = `已载入 ${parsed.length} 题`;
      playSound("clear");
      feedback("题库已导入", `成功载入 ${parsed.length} 道题：上${counts.上}/中${counts.中}/下${counts.下}。${questionCountAdvice(counts)}`, "good");
    } catch (error) {
      feedback("导入失败", `Excel 解析失败：${error.message}`, "bad");
    } finally {
      event.target.value = "";
    }
  };
  reader.readAsArrayBuffer(file);
}

function parseQuestionRow(row) {
  const lane = String(row[EXCEL_COLUMNS[0]] || row["线路"] || "").trim();
  const prompt = String(row[EXCEL_COLUMNS[1]] || row["题目"] || row["题目描述"] || "").trim();
  const options = [row[EXCEL_COLUMNS[2]] || row["A"] || row["选项A"], row[EXCEL_COLUMNS[3]] || row["B"] || row["选项B"], row[EXCEL_COLUMNS[4]] || row["C"] || row["选项C"], row[EXCEL_COLUMNS[5]] || row["D"] || row["选项D"]].map((value) =>
    String(value || "").trim(),
  );
  const rawAnswer = String(row[EXCEL_COLUMNS[6]] || row["正确答案"] || row["答案"] || "").trim();
  if (!["上", "中", "下"].includes(lane) || !prompt || options.some((option) => !option) || !rawAnswer) return null;
  const answer = normalizeAnswer(rawAnswer, options);
  if (!answer) return null;
  return { lane, prompt, options, answer };
}

function normalizeAnswer(answer, options) {
  const upper = answer.toUpperCase();
  if (OPTION_KEYS.includes(upper)) return upper;
  const optionIndex = options.findIndex((option) => normalize(option) === normalize(answer));
  return optionIndex >= 0 ? OPTION_KEYS[optionIndex] : "";
}

function resetChallengeOnly() {
  closeQuizModal();
  state.selectedObjectiveId = null;
  state.currentQuestion = null;
  state.questionFinished = false;
  state.questionLocked = false;
  state.totalAnswered = 0;
  state.totalCorrect = 0;
  state.completedQuestions = 0;
  state.totalSeconds = 0;
  state.streak = 0;
  objectiveDefs.forEach((objective) => {
    state.objectiveProgress[objective.id] = 0;
  });
  renderNodes();
  renderQuestionIdle();
  updateTargetPanel();
  updateHud();
  updateModalStatus();
}

function resetQuestionQueues() {
  state.questionQueues = {};
  state.lastQuestionByPool = {};
}

function laneCounts(questions) {
  return questions.reduce(
    (counts, question) => {
      if (counts[question.lane] !== undefined) counts[question.lane] += 1;
      return counts;
    },
    { 上: 0, 中: 0, 下: 0 },
  );
}

function questionCountAdvice(counts) {
  const missing = ["上", "中", "下"].filter((lane) => counts[lane] < RECOMMENDED_PER_LANE);
  if (!missing.length) return `已达到每路 ${RECOMMENDED_PER_LANE} 题，三路共 ${RECOMMENDED_TOTAL} 题的推荐量。`;
  const shortText = missing.map((lane) => `${lane}路还差 ${RECOMMENDED_PER_LANE - counts[lane]} 题`).join("，");
  return `建议每路 ${RECOMMENDED_PER_LANE} 题、三路共 ${RECOMMENDED_TOTAL} 题；若野区也要独立错题池，总计 ${RECOMMENDED_WITH_JUNGLE} 题。${shortText}。`;
}

function getStoredBgmVolume() {
  const savedValue = localStorage.getItem(BGM_VOLUME_STORAGE_KEY);
  if (savedValue === null || savedValue === "") return DEFAULT_BGM_VOLUME;
  const savedVolume = Number(savedValue);
  if (!Number.isFinite(savedVolume)) return DEFAULT_BGM_VOLUME;
  return Math.max(0, Math.min(100, Math.round(savedVolume)));
}

function getStoredBgmTrackIndex() {
  const savedIndex = Number(localStorage.getItem(BGM_TRACK_STORAGE_KEY));
  if (!Number.isInteger(savedIndex) || savedIndex < 0 || savedIndex >= bgmTracks.length) return 0;
  return savedIndex;
}

function getStoredFlag(key, defaultValue) {
  const savedValue = localStorage.getItem(key);
  if (savedValue === null) return defaultValue;
  return savedValue === "true";
}

function toggleSound() {
  state.audioEnabled = !state.audioEnabled;
  updateHud();
  if (state.audioEnabled) playSound("select");
  setFeedbackPanel("音效设置", `音效已${state.audioEnabled ? "开启" : "关闭"}。`);
}

function setupBgm() {
  el.bgmAudio.volume = state.bgmVolume / 100;
  setBgmTrack(state.bgmTrackIndex, { autoplay: false });
  el.bgmAudio.addEventListener("play", () => {
    state.bgmPlaying = true;
    updateHud();
  });
  el.bgmAudio.addEventListener("pause", () => {
    state.bgmPlaying = false;
    updateHud();
  });
  el.bgmAudio.addEventListener("error", () => {
    state.bgmPlaying = false;
    updateHud();
    feedback("BGM 未加载", `没有读取到 ${currentBgmTrack().title}，请确认音乐文件还在 assets 文件夹里。`, "bad");
  });
  el.bgmAudio.addEventListener("ended", handleBgmEnded);
}

async function toggleBgm() {
  if (el.bgmAudio.paused) {
    await playBgm("BGM 已播放");
    return;
  }
  el.bgmAudio.pause();
  feedback("BGM 已暂停", "背景音乐已暂停，答题音效不受影响。", "gold");
}

function currentBgmTrack() {
  return bgmTracks[state.bgmTrackIndex] || bgmTracks[0];
}

function setBgmTrack(index, { autoplay = false, announce = false } = {}) {
  const nextIndex = wrapTrackIndex(index);
  state.bgmTrackIndex = nextIndex;
  localStorage.setItem(BGM_TRACK_STORAGE_KEY, String(nextIndex));
  const track = currentBgmTrack();
  if (el.bgmAudio.getAttribute("src") !== track.src) {
    el.bgmAudio.src = track.src;
    el.bgmAudio.load();
  }
  updateHud();
  if (autoplay) {
    playBgm("BGM 已切换");
  } else if (announce) {
    feedback("BGM 已切换", `当前音乐：${track.title}。`, "gold");
  }
}

function wrapTrackIndex(index) {
  const trackCount = bgmTracks.length;
  return ((index % trackCount) + trackCount) % trackCount;
}

async function playBgm(title = "BGM 已播放") {
  const track = currentBgmTrack();
  try {
    el.bgmAudio.volume = state.bgmVolume / 100;
    await el.bgmAudio.play();
    playSound("select");
    feedback(title, `正在播放：${track.title}。`, "good");
  } catch (error) {
    state.bgmPlaying = false;
    updateHud();
    feedback("BGM 播放失败", "浏览器没有允许播放音乐，请再点一次 BGM 播放按钮。", "bad");
  }
}

function nextBgmTrack(manual = false) {
  const shouldPlay = manual || state.bgmPlaying;
  setBgmTrack(getNextTrackIndex(manual), { autoplay: shouldPlay, announce: !shouldPlay });
  if (!shouldPlay) playSound("select");
}

function prevBgmTrack(manual = false) {
  const shouldPlay = manual || state.bgmPlaying;
  setBgmTrack(state.bgmTrackIndex - 1, { autoplay: shouldPlay, announce: !shouldPlay });
  if (!shouldPlay) playSound("select");
}

function getNextTrackIndex(manual = false) {
  if (state.bgmShuffle && bgmTracks.length > 1) {
    let nextIndex = state.bgmTrackIndex;
    while (nextIndex === state.bgmTrackIndex) {
      nextIndex = Math.floor(Math.random() * bgmTracks.length);
    }
    return nextIndex;
  }
  if (!manual && !state.bgmLoop && state.bgmTrackIndex >= bgmTracks.length - 1) {
    return state.bgmTrackIndex;
  }
  return wrapTrackIndex(state.bgmTrackIndex + 1);
}

function handleBgmEnded() {
  const shouldStopAtEnd = !state.bgmShuffle && !state.bgmLoop && state.bgmTrackIndex >= bgmTracks.length - 1;
  if (shouldStopAtEnd) {
    state.bgmPlaying = false;
    updateHud();
    feedback("BGM 播放完毕", "歌单已经播放到最后一首。", "gold");
    return;
  }
  setBgmTrack(getNextTrackIndex(false), { autoplay: true });
}

function toggleBgmShuffle() {
  state.bgmShuffle = !state.bgmShuffle;
  localStorage.setItem(BGM_SHUFFLE_STORAGE_KEY, String(state.bgmShuffle));
  updateHud();
  feedback("随机播放", `随机播放已${state.bgmShuffle ? "开启" : "关闭"}。`, "gold");
}

function toggleBgmLoop() {
  state.bgmLoop = !state.bgmLoop;
  localStorage.setItem(BGM_LOOP_STORAGE_KEY, String(state.bgmLoop));
  updateHud();
  feedback("循环播放", `歌单循环已${state.bgmLoop ? "开启" : "关闭"}。`, "gold");
}

function changeBgmVolume() {
  const volume = Math.max(0, Math.min(100, Number(el.bgmVolume.value) || 0));
  state.bgmVolume = volume;
  el.bgmAudio.volume = volume / 100;
  localStorage.setItem(BGM_VOLUME_STORAGE_KEY, String(volume));
  updateHud();
}

function playSound(kind) {
  if (!state.audioEnabled) return;
  const context = ensureAudioContext();
  if (!context) return;
  const now = context.currentTime;
  const patterns = {
    select: [
      [523, 0, 0.06, "sine", 0.08],
      [784, 0.055, 0.08, "sine", 0.06],
    ],
    open: [
      [392, 0, 0.08, "triangle", 0.07],
      [587, 0.08, 0.1, "triangle", 0.07],
    ],
    correct: [
      [659, 0, 0.08, "sine", 0.08],
      [880, 0.07, 0.08, "sine", 0.08],
      [1175, 0.14, 0.12, "sine", 0.07],
    ],
    coin: [
      [1047, 0, 0.06, "square", 0.04],
      [1319, 0.06, 0.07, "square", 0.04],
      [1568, 0.12, 0.09, "square", 0.035],
    ],
    wrong: [
      [247, 0, 0.12, "sawtooth", 0.08],
      [196, 0.1, 0.14, "sawtooth", 0.07],
    ],
    clear: [
      [523, 0, 0.08, "triangle", 0.08],
      [659, 0.08, 0.08, "triangle", 0.08],
      [988, 0.16, 0.16, "triangle", 0.07],
    ],
    rank: [
      [523, 0, 0.09, "sine", 0.09],
      [659, 0.09, 0.09, "sine", 0.09],
      [784, 0.18, 0.09, "sine", 0.09],
      [1047, 0.27, 0.2, "sine", 0.08],
    ],
    hint: [
      [988, 0, 0.05, "sine", 0.045],
      [1319, 0.07, 0.06, "sine", 0.045],
    ],
  };
  (patterns[kind] || patterns.select).forEach(([frequency, delay, duration, type, volume]) => {
    playTone(context, now + delay, frequency, duration, type, volume);
  });
}

function ensureAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!state.audioContext) state.audioContext = new AudioContext();
  if (state.audioContext.state === "suspended") state.audioContext.resume();
  return state.audioContext;
}

function playTone(context, startAt, frequency, duration, type, volume) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  gain.gain.setValueAtTime(0.0001, startAt);
  gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration + 0.02);
}

function saveRecord() {
  const participant = el.playerName.value.trim();
  if (!participant) {
    feedback("还没有名称", "输入学生姓名或班级名称后，就能把当前挑战数据保存到本地。", "bad");
    return;
  }
  const record = buildRecord(participant);
  state.records.unshift(record);
  state.records = state.records.slice(0, 120);
  persistRecords();
  localStorage.setItem(LAST_PROGRESS_STORAGE_KEY, JSON.stringify(record));
  renderRecords();
  updateLastSaved(record);
  playSound("clear");
  feedback("本地记录已保存", `${participant}：${record.rank} ${record.stars}/2 星，${record.coins} 金币，正确率 ${record.accuracy}%。`, "good");
}

function buildRecord(participant) {
  const currentObjective = getObjective(state.selectedObjectiveId);
  const now = Date.now();
  return {
    id: `${now}-${Math.random().toString(16).slice(2)}`,
    participant,
    rank: ranks[state.rankIndex],
    stars: state.stars,
    coins: state.coins,
    hp: state.hp,
    maxHp: state.maxHp,
    revives: state.revives,
    hints: state.hints,
    accuracy: accuracy(),
    speed: avgSpeed(),
    totalAnswered: state.totalAnswered,
    totalCorrect: state.totalCorrect,
    completedQuestions: state.completedQuestions,
    streak: state.streak,
    selectedHero: getHero().name,
    currentTarget: currentObjective ? currentObjective.name : "未选择",
    progressSummary: progressSummary(),
    time: now,
    savedAt: new Date(now).toLocaleString("zh-CN"),
  };
}

function persistRecords() {
  localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(state.records));
}

function renderRecords() {
  if (!state.records.length) {
    el.recordList.innerHTML = "<li>暂无记录，完成挑战后输入姓名或班级。</li>";
    updateLastSaved(null);
    return;
  }
  el.recordList.innerHTML = state.records
    .slice(0, 8)
    .map((record) => `<li>${escapeHtml(record.participant || record.name || "未命名")} · ${record.rank} · ${record.stars}/2 星 · ${record.coins || 0} 金币</li>`)
    .join("");
  updateLastSaved(state.records[0]);
}

function updateLastSaved(record) {
  if (!record) {
    el.lastSavedText.textContent = "记录会保存在当前浏览器本地。";
    return;
  }
  el.lastSavedText.textContent = `最近保存：${record.savedAt || new Date(record.time).toLocaleString("zh-CN")}`;
}

function exportRecords() {
  if (!state.records.length) {
    feedback("暂无记录", "先输入姓名或班级名称并保存一次记录，再导出本地记录。", "bad");
    return;
  }
  const rows = state.records.map((record, index) => ({
    序号: index + 1,
    姓名或班级: record.participant || record.name || "",
    保存时间: record.savedAt || new Date(record.time).toLocaleString("zh-CN"),
    段位: record.rank,
    星星: `${record.stars}/2`,
    金币: record.coins || 0,
    生命值: `${record.hp ?? ""}/${record.maxHp ?? ""}`,
    正确率: `${record.accuracy || 0}%`,
    平均速度: `${record.speed || 0} 秒/题`,
    已答题数: record.totalAnswered || 0,
    答对题数: record.totalCorrect || 0,
    完成题数: record.completedQuestions || 0,
    当前连胜: record.streak || 0,
    英雄: record.selectedHero || "",
    当前目标: record.currentTarget || "",
    推进进度: record.progressSummary || "",
  }));
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 6 },
    { wch: 18 },
    { wch: 22 },
    { wch: 12 },
    { wch: 8 },
    { wch: 8 },
    { wch: 12 },
    { wch: 10 },
    { wch: 14 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 10 },
    { wch: 14 },
    { wch: 14 },
    { wch: 70 },
  ];
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "本地挑战记录");
  XLSX.writeFile(workbook, "期末荣耀本地挑战记录.xlsx");
  playSound("clear");
  feedback("记录已导出", "已导出本地挑战记录 Excel 文件。", "good");
}

function progressSummary() {
  return objectiveDefs.map((objective) => `${objective.name}${state.objectiveProgress[objective.id] || 0}/${objective.required}`).join("；");
}

function updateHud() {
  const hpPercent = Math.max(0, Math.min(100, (state.hp / state.maxHp) * 100));
  el.hpFill.style.width = `${hpPercent}%`;
  el.hpText.textContent = `${state.hp} / ${state.maxHp}`;
  el.shieldText.textContent = `复活甲 ${state.revives} · 名刀 ${state.hints}`;
  el.coinText.textContent = state.coins;
  el.topCoins.textContent = state.coins;
  el.rankBadge.textContent = ranks[state.rankIndex];
  el.topRank.textContent = ranks[state.rankIndex];
  el.topStars.textContent = `${state.stars}/2`;
  el.soundToggle.setAttribute("aria-pressed", String(state.audioEnabled));
  el.soundState.textContent = state.audioEnabled ? "开" : "关";
  const track = currentBgmTrack();
  el.bgmToggle.setAttribute("aria-pressed", String(state.bgmPlaying));
  el.bgmState.textContent = state.bgmPlaying ? "暂停" : "播放";
  el.bgmTrackName.textContent = track.title;
  el.bgmTrackMeta.textContent = `${state.bgmTrackIndex + 1}/${bgmTracks.length} · ${track.artist}`;
  el.bgmPrev.disabled = bgmTracks.length < 2;
  el.bgmNext.disabled = bgmTracks.length < 2;
  el.bgmShuffle.disabled = bgmTracks.length < 2;
  el.bgmShuffle.setAttribute("aria-pressed", String(state.bgmShuffle));
  el.bgmLoop.setAttribute("aria-pressed", String(state.bgmLoop));
  el.bgmVolume.value = String(state.bgmVolume);
  el.bgmVolumeText.textContent = `${state.bgmVolume}%`;
  el.rankStars.textContent = "★".repeat(state.stars) + "☆".repeat(2 - state.stars);
  el.accuracyText.textContent = `${accuracy()}%`;
  el.speedText.textContent = `${avgSpeed()} 秒/题`;
  el.streakText.textContent = state.streak;
}

function updateTargetPanel() {
  const objective = getObjective(state.selectedObjectiveId);
  if (!objective) {
    el.selectedTargetText.textContent = "点击小兵、塔、水晶或野区，会在屏幕中间弹出题目";
    el.targetType.textContent = "暂无目标";
    el.targetName.textContent = "先选择地图节点";
    el.objectiveProgressText.textContent = "0 / 0";
    el.objectiveProgressFill.style.width = "0%";
    el.challengeButton.textContent = "打开挑战";
    el.challengeButton.disabled = true;
    el.nextQuestion.disabled = true;
    return;
  }
  const progress = state.objectiveProgress[objective.id];
  const done = isObjectiveCleared(objective);
  el.selectedTargetText.textContent = `${getHero().name} 位于 ${objective.name}`;
  el.targetType.textContent = `${laneMeta[objective.lane].label} · ${typeLabel(objective.type)}`;
  el.targetName.textContent = objective.name;
  el.objectiveProgressText.textContent = `${progress} / ${objective.required}`;
  el.objectiveProgressFill.style.width = `${Math.round((progress / objective.required) * 100)}%`;
  el.challengeButton.textContent = done ? "已攻破" : "打开挑战";
  el.challengeButton.disabled = done;
}

function updateModalStatus() {
  const objective = getObjective(state.selectedObjectiveId);
  el.modalCoins.textContent = state.coins;
  el.modalHp.textContent = `${state.hp} / ${state.maxHp}`;
  if (!objective) {
    el.modalTargetType.textContent = "暂无目标";
    el.modalTargetName.textContent = "先选择地图节点";
    el.modalProgressText.textContent = "0 / 0";
    return;
  }
  el.modalTargetType.textContent = `${laneMeta[objective.lane].label} · ${typeLabel(objective.type)}`;
  el.modalTargetName.textContent = objective.name;
  el.modalProgressText.textContent = `${state.objectiveProgress[objective.id]} / ${objective.required}`;
}

function setModalFeedback(title, message, tone = "") {
  el.modalFeedback.className = `modal-feedback ${tone}`;
  el.modalFeedback.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
}

function showCoinBurst(amount) {
  const burst = document.createElement("div");
  burst.className = "coin-burst";
  burst.textContent = `+${amount} 金币`;
  document.querySelector(".quiz-window").appendChild(burst);
  window.setTimeout(() => burst.remove(), 1100);
}

function progressLabel(objective) {
  const progress = state.objectiveProgress[objective.id] || 0;
  return `${progress}/${objective.required}`;
}

function isObjectiveCleared(objective) {
  return state.objectiveProgress[objective.id] >= objective.required;
}

function answerKeyFor(question) {
  return normalizeAnswer(question.answer, question.options);
}

function answerTextFor(question) {
  const index = OPTION_KEYS.indexOf(answerKeyFor(question));
  return question.options[index] || "";
}

function getHero() {
  return state.heroes.find((hero) => hero.id === state.selectedHeroId) || state.heroes[0];
}

function getObjective(objectiveId) {
  return objectiveDefs.find((objective) => objective.id === objectiveId) || null;
}

function typeLabel(type) {
  return { minion: "兵线", tower: "防御塔", crystal: "终极水晶", dragon: "大龙/野区" }[type] || "目标";
}

function enemyName(objective) {
  return { minion: "小兵", tower: "防御塔", crystal: "水晶", dragon: "野怪" }[objective.type] || "目标";
}

function accuracy() {
  if (!state.totalAnswered) return 0;
  return Math.round((state.totalCorrect / state.totalAnswered) * 100);
}

function avgSpeed() {
  if (!state.completedQuestions) return 0;
  return Math.round(state.totalSeconds / state.completedQuestions);
}

function feedback(title, message, tone = "") {
  setFeedbackPanel(title, message);
  const toast = document.createElement("div");
  toast.className = `toast ${tone}`;
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
  el.toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 3400);
}

function setFeedbackPanel(title, message) {
  el.battleFeedback.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(message)}</span>`;
}

function normalize(value) {
  return String(value).replace(/\s+/g, "").toLowerCase();
}

function questionId(question) {
  return `${question.lane}::${question.prompt}::${question.options.join("|")}::${question.answer}`;
}

function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function uniqueQuestions(questions) {
  const seen = new Set();
  return questions.filter((question) => {
    const key = `${question.lane}:${question.prompt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

init();

/* --- 全屏切换（行为与「学习拔河」一致） --- */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    const root = document.documentElement;
    const req = root.requestFullscreen || root.webkitRequestFullscreen;
    if (req) req.call(root);
  } else {
    const exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (exit) exit.call(document);
  }
}

(function bindFullscreenToggle() {
  const btn = document.getElementById("fullscreenToggle");
  if (!btn) return;
  btn.addEventListener("click", toggleFullscreen);
})();
