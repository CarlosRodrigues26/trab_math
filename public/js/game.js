const TOTAL_QUESTIONS_PER_MATCH = 10;
const POINTS_PER_CORRECT = 100;
const STORAGE_KEY = "pa_desafio_save_v1";

const screens = {
  home: document.getElementById("home-screen"),
  tutorial: document.getElementById("tutorial-screen"),
  game: document.getElementById("game-screen"),
  result: document.getElementById("result-screen")
};

const ui = {
  startBtn: document.getElementById("start-btn"),
  howToPlayBtn: document.getElementById("how-to-play-btn"),
  backHomeFromTutorialBtn: document.getElementById("back-home-from-tutorial"),
  startFromTutorialBtn: document.getElementById("start-from-tutorial"),
  confirmAnswerBtn: document.getElementById("confirm-answer-btn"),
  nextQuestionBtn: document.getElementById("next-question-btn"),
  playAgainBtn: document.getElementById("play-again-btn"),
  backHomeBtn: document.getElementById("back-home-btn"),
  hudQuestion: document.getElementById("hud-question"),
  hudScore: document.getElementById("hud-score"),
  hudCorrect: document.getElementById("hud-correct"),
  hudErrors: document.getElementById("hud-errors"),
  progressBar: document.getElementById("progress-bar"),
  difficultyBadge: document.getElementById("difficulty-badge"),
  questionIndex: document.getElementById("question-index"),
  questionTitle: document.getElementById("question-title"),
  optionsContainer: document.getElementById("options-container"),
  feedbackPanel: document.getElementById("feedback-panel"),
  feedbackTitle: document.getElementById("feedback-title"),
  feedbackMessage: document.getElementById("feedback-message"),
  explanationText: document.getElementById("explanation-text"),
  resultStory: document.getElementById("result-story"),
  resultScore: document.getElementById("result-score"),
  resultCorrect: document.getElementById("result-correct"),
  resultErrors: document.getElementById("result-errors"),
  resultRate: document.getElementById("result-rate"),
  resultMotivation: document.getElementById("result-motivation"),
  resultReviewList: document.getElementById("result-review-list"),
  resultJourneySummary: document.getElementById("result-journey-summary"),
  questionCard: document.getElementById("question-card")
};

const state = {
  selectedQuestions: [],
  currentIndex: 0,
  selectedOptionIndex: null,
  answeredCurrentQuestion: false,
  score: 0,
  correctCount: 0,
  errorCount: 0,
  answerLog: [],
  musicStarted: false,
  melodyTimer: null,
  musicStep: 0,
  musicMode: "none"
};

function showScreen(screenName) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[screenName].classList.add("active");
  ensureMusicForScreen(screenName);
  saveGameState(screenName);
}

function getQuestionById(questionId) {
  return PA_QUESTIONS.find((q) => q.id === questionId);
}

function getPersistedScreen(defaultScreen = "home") {
  const activeId = document.querySelector(".screen.active")?.id;
  if (activeId === "home-screen") return "home";
  if (activeId === "tutorial-screen") return "tutorial";
  if (activeId === "game-screen") return "game";
  if (activeId === "result-screen") return "result";
  return defaultScreen;
}

function saveGameState(explicitScreen) {
  try {
    const payload = {
      screen: explicitScreen || getPersistedScreen(),
      selectedQuestions: state.selectedQuestions.map((q) => ({
        id: q.id,
        options: [...q.options],
        correctIndex: q.correctIndex
      })),
      selectedQuestionIds: state.selectedQuestions.map((q) => q.id),
      currentIndex: state.currentIndex,
      score: state.score,
      correctCount: state.correctCount,
      errorCount: state.errorCount,
      answerLog: state.answerLog.map((entry) => ({
        questionId: entry.questionId,
        selectedIndex: entry.selectedIndex,
        isCorrect: entry.isCorrect
      }))
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn("Nao foi possivel salvar o estado do jogo.", error);
  }
}

function loadSavedState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Nao foi possivel carregar estado salvo.", error);
    return null;
  }
}

function restoreGameStateFromStorage() {
  const saved = loadSavedState();
  if (!saved || !saved.screen) {
    return false;
  }

  if (saved.screen === "home" || saved.screen === "tutorial") {
    showScreen(saved.screen);
    return true;
  }

  let mappedQuestions = [];
  const savedQuestions = Array.isArray(saved.selectedQuestions) ? saved.selectedQuestions : [];

  if (savedQuestions.length === TOTAL_QUESTIONS_PER_MATCH) {
    mappedQuestions = savedQuestions
      .map((savedQuestion) => {
        const baseQuestion = getQuestionById(savedQuestion.id);
        if (!baseQuestion) {
          return null;
        }

        const optionsAreValid = Array.isArray(savedQuestion.options) && savedQuestion.options.length === 4;
        const validCorrectIndex = Number.isInteger(savedQuestion.correctIndex)
          && savedQuestion.correctIndex >= 0
          && savedQuestion.correctIndex <= 3;

        return {
          ...baseQuestion,
          options: optionsAreValid ? [...savedQuestion.options] : [...baseQuestion.options],
          correctIndex: validCorrectIndex ? savedQuestion.correctIndex : baseQuestion.correctIndex
        };
      })
      .filter(Boolean);
  } else {
    const questionIds = Array.isArray(saved.selectedQuestionIds) ? saved.selectedQuestionIds : [];
    if (questionIds.length !== TOTAL_QUESTIONS_PER_MATCH) {
      showScreen("home");
      return true;
    }

    mappedQuestions = questionIds.map((id) => getQuestionById(id)).filter(Boolean);
  }

  if (mappedQuestions.length !== TOTAL_QUESTIONS_PER_MATCH) {
    showScreen("home");
    return true;
  }

  state.selectedQuestions = mappedQuestions;
  state.currentIndex = Math.min(Math.max(saved.currentIndex || 0, 0), TOTAL_QUESTIONS_PER_MATCH - 1);
  state.score = saved.score || 0;
  state.correctCount = saved.correctCount || 0;
  state.errorCount = saved.errorCount || 0;
  state.answerLog = (saved.answerLog || [])
    .map((entry) => ({
      questionId: entry.questionId,
      selectedIndex: entry.selectedIndex,
      isCorrect: entry.isCorrect
    }))
    .filter((entry) => Number.isInteger(entry.questionId));

  if (saved.screen === "game") {
    renderCurrentQuestion();
    showScreen("game");
    return true;
  }

  openResultScreen();
  return true;
}

function playTone({ frequency = 460, duration = 0.07, type = "sine", volume = 0.035 } = {}) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  if (!window.__paAudioCtx) {
    window.__paAudioCtx = new AudioCtx();
  }

  const ctx = window.__paAudioCtx;

  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const now = ctx.currentTime;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.01);
}

function playSuccessSound() {
  const notes = [660, 820, 980];
  notes.forEach((frequency, idx) => {
    window.setTimeout(() => {
      playTone({
        frequency,
        duration: 0.2,
        type: "triangle",
        volume: 0.1
      });
    }, idx * 120);
  });
}

function playErrorSound() {
  const notes = [320, 240, 180];
  notes.forEach((frequency, idx) => {
    window.setTimeout(() => {
      playTone({
        frequency,
        duration: 0.23,
        type: "sawtooth",
        volume: 0.095
      });
    }, idx * 130);
  });
}

function playChord(notes, duration = 0.26, volume = 0.013) {
  notes.forEach((frequency) => {
    playTone({
      frequency,
      duration,
      type: "triangle",
      volume
    });
  });
}

function stopBackgroundMusic() {
  if (state.melodyTimer) {
    window.clearInterval(state.melodyTimer);
    state.melodyTimer = null;
  }
}

function startGameMusic() {
  stopBackgroundMusic();
  state.musicMode = "game";

  const progression = [
    [261.63, 329.63, 392.0],
    [293.66, 369.99, 440.0],
    [329.63, 415.3, 493.88],
    [293.66, 392.0, 440.0]
  ];

  const leadScale = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0];
  const rhythmMask = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1];
  const stepMs = 180;

  const playStep = () => {
    const step = state.musicStep;
    const bar = Math.floor(step / 16) % progression.length;
    const local = step % 16;
    const chord = progression[bar];

    if (local % 4 === 0) {
      playChord(chord, 0.24, 0.0038);
    }

    if (local === 0 || local === 8) {
      playTone({ frequency: chord[0] / 2, duration: 0.22, type: "sine", volume: 0.012 });
    }

    if (rhythmMask[local]) {
      const leadIndex = (local + bar * 2 + (local > 10 ? 1 : 0)) % leadScale.length;
      playTone({
        frequency: leadScale[leadIndex],
        duration: 0.16,
        type: "square",
        volume: 0.008
      });
    }

    if (local % 2 === 1) {
      playTone({ frequency: 1200, duration: 0.03, type: "triangle", volume: 0.0025 });
    }

    state.musicStep += 1;
  };

  playStep();
  state.melodyTimer = window.setInterval(playStep, stepMs);
}

function startHomeMusic() {
  stopBackgroundMusic();
  state.musicMode = "home";

  const calmNotes = [349.23, 392.0, 440.0, 392.0, 369.99, 329.63, 293.66, 329.63];
  let step = 0;

  const playStep = () => {
    const base = calmNotes[step % calmNotes.length];

    playTone({ frequency: base, duration: 0.38, type: "sine", volume: 0.012 });
    playTone({ frequency: base * 1.5, duration: 0.24, type: "triangle", volume: 0.007 });
    playTone({ frequency: base / 2, duration: 0.4, type: "sine", volume: 0.0045 });

    step += 1;
  };

  playStep();
  state.melodyTimer = window.setInterval(playStep, 520);
}

function ensureMusicForScreen(screenName) {
  if (!state.musicStarted) {
    return;
  }

  if (screenName === "game") {
    if (state.musicMode !== "game") {
      startGameMusic();
    }
    return;
  }

  if (state.musicMode !== "home") {
    startHomeMusic();
  }
}

function activateMusicIfNeeded() {
  if (state.musicStarted) {
    return;
  }

  state.musicStarted = true;
  const activeScreenName = document.querySelector(".screen.active")?.id || "home-screen";

  if (activeScreenName === "game-screen") {
    startGameMusic();
    return;
  }

  startHomeMusic();
}

function initButtonSounds() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) {
      return;
    }

    activateMusicIfNeeded();

    if (button.classList.contains("option-btn")) {
      playTone({ frequency: 560, duration: 0.12, type: "triangle", volume: 0.055 });
      return;
    }

    playTone({ frequency: 470, duration: 0.14, type: "sine", volume: 0.06 });
  });
}

function shuffleArray(items) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

function buildBalancedCorrectIndexes(totalQuestions, optionCount = 4) {
  const indexes = [];
  const baseCount = Math.floor(totalQuestions / optionCount);
  const remainder = totalQuestions % optionCount;

  for (let optionIndex = 0; optionIndex < optionCount; optionIndex += 1) {
    for (let count = 0; count < baseCount; count += 1) {
      indexes.push(optionIndex);
    }
  }

  const extraIndexes = shuffleArray(Array.from({ length: optionCount }, (_, i) => i)).slice(0, remainder);
  indexes.push(...extraIndexes);

  return shuffleArray(indexes);
}

function prepareQuestionForMatch(question, targetCorrectIndex) {
  const correctOption = question.options[question.correctIndex];
  const wrongOptions = shuffleArray(question.options.filter((_, idx) => idx !== question.correctIndex));
  const randomizedOptions = [];
  let wrongPointer = 0;

  for (let idx = 0; idx < question.options.length; idx += 1) {
    if (idx === targetCorrectIndex) {
      randomizedOptions.push(correctOption);
    } else {
      randomizedOptions.push(wrongOptions[wrongPointer]);
      wrongPointer += 1;
    }
  }

  return {
    ...question,
    options: randomizedOptions,
    correctIndex: targetCorrectIndex
  };
}

function validateQuestionBank(questions) {
  if (!Array.isArray(questions) || questions.length < 30) {
    throw new Error("Banco de questões inválido: e necessário ter ao menos 30 questões.");
  }

  const ids = new Set();
  questions.forEach((q) => {
    if (ids.has(q.id)) {
      throw new Error(`ID de questao duplicado detectado: ${q.id}`);
    }
    ids.add(q.id);

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      throw new Error(`Questao ${q.id} precisa ter exatamente 4 alternativas.`);
    }

    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3) {
      throw new Error(`Questao ${q.id} possui gabarito inválido.`);
    }
  });
}

function resetMatchState() {
  state.currentIndex = 0;
  state.selectedOptionIndex = null;
  state.answeredCurrentQuestion = false;
  state.score = 0;
  state.correctCount = 0;
  state.errorCount = 0;
  state.answerLog = [];
  state.musicStep = 0;

  const pickedQuestions = shuffleArray(PA_QUESTIONS).slice(0, TOTAL_QUESTIONS_PER_MATCH);
  const balancedCorrectIndexes = buildBalancedCorrectIndexes(TOTAL_QUESTIONS_PER_MATCH, 4);

  state.selectedQuestions = pickedQuestions.map((question, index) =>
    prepareQuestionForMatch(question, balancedCorrectIndexes[index])
  );
}

function getQuestionFromCurrentMatch(questionId) {
  return state.selectedQuestions.find((question) => question.id === questionId) || getQuestionById(questionId);
}

function buildResultReview() {
  ui.resultReviewList.innerHTML = "";

  state.answerLog.forEach((entry, idx) => {
    const question = getQuestionFromCurrentMatch(entry.questionId);
    if (!question) {
      return;
    }

    const card = document.createElement("article");
    card.className = "review-card";

    const statusClass = entry.isCorrect ? "ok" : "error";
    const statusText = entry.isCorrect ? "Carta recuperada com sucesso" : "Carta nao recuperada";

    const selectedText = question.options[entry.selectedIndex] ?? "Sem resposta";
    const correctText = question.options[question.correctIndex];

    const correctAnswerRow = entry.isCorrect
      ? `<p class="review-row"><strong>Resposta correta:</strong> ${correctText}</p>`
      : "";

    const explanationBlock = entry.isCorrect
      ? `<div class="review-explanation"><strong>Resolução:</strong>\n${question.explanation}</div>`
      : `<p class="review-why-wrong">Voce nao recuperou esta carta nesta tentativa. Tente novamente para desbloquear essa carta na proxima jornada.</p>`;

    card.innerHTML = `
      <h4>Carta ${idx + 1} - ${question.difficulty}</h4>
      <p class="review-row"><strong>Enunciado:</strong> ${question.statement}</p>
      <span class="review-status ${statusClass}">${statusText}</span>
      <p class="review-row"><strong>Sua resposta:</strong> ${selectedText}</p>
      ${correctAnswerRow}
      ${explanationBlock}
    `;

    ui.resultReviewList.appendChild(card);
  });
}

function buildJourneySummary() {
  const recovered = state.answerLog
    .map((entry, idx) => ({ ...entry, cardNumber: idx + 1 }))
    .filter((entry) => entry.isCorrect)
    .map((entry) => entry.cardNumber);

  const missing = state.answerLog
    .map((entry, idx) => ({ ...entry, cardNumber: idx + 1 }))
    .filter((entry) => !entry.isCorrect)
    .map((entry) => entry.cardNumber);

  const recoveredText = recovered.length ? recovered.join(", ") : "nenhuma";
  const missingText = missing.length ? missing.join(", ") : "nenhuma";

  ui.resultJourneySummary.textContent =
    `Parabens, voce coletou as cartas ${recoveredText}. ` +
    `As cartas ${missingText} ainda nao foram recuperadas. ` +
    `Jogue novamente para recuperar todas as cartas sagradas da matematica.`;
}

function populateBackgroundSymbols() {
  const container = document.querySelector(".bg-symbols");
  if (!container) {
    return;
  }

  const symbolPool = [
    "Σ",
    "π",
    "Δ",
    "√",
    "∞",
    "+",
    "-",
    "×",
    "÷",
    "=",
    "a1",
    "a_n",
    "S_n",
    "r",
    "n",
    "PA",
    "2n",
    "n+1",
    "x",
    "y"
  ];

  const isMobile = window.innerWidth < 700;
  const total = isMobile ? 70 : 110;
  container.innerHTML = "";
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < total; i += 1) {
    const symbol = document.createElement("span");
    symbol.textContent = symbolPool[Math.floor(Math.random() * symbolPool.length)];
    symbol.style.left = `${Math.random() * 100}%`;
    symbol.style.top = `${Math.random() * 100}%`;
    symbol.style.fontSize = `${0.95 + Math.random() * 1.35}rem`;
    symbol.style.animationDuration = `${8 + Math.random() * 8}s`;
    symbol.style.animationDelay = `${Math.random() * 2}s`;
    symbol.style.opacity = `${0.3 + Math.random() * 0.25}`;
    fragment.appendChild(symbol);
  }

  container.appendChild(fragment);
}

function bindPerformanceGuards() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopBackgroundMusic();
      return;
    }

    if (state.musicStarted) {
      ensureMusicForScreen(document.querySelector(".screen.active")?.id === "game-screen" ? "game" : "home");
    }
  });
}

function updateHUD() {
  ui.hudQuestion.textContent = `${state.currentIndex + 1}/${TOTAL_QUESTIONS_PER_MATCH}`;
  ui.hudScore.textContent = `${state.score}`;
  ui.hudCorrect.textContent = `${state.correctCount}`;
  ui.hudErrors.textContent = `${state.errorCount}`;

  const progressPercent = (state.currentIndex / TOTAL_QUESTIONS_PER_MATCH) * 100;
  ui.progressBar.style.width = `${progressPercent}%`;
}

function clearFeedback() {
  ui.feedbackPanel.classList.add("hidden");
  ui.feedbackTitle.textContent = "";
  ui.feedbackMessage.textContent = "";
  ui.explanationText.textContent = "";
}

function renderCurrentQuestion() {
  const question = state.selectedQuestions[state.currentIndex];
  state.selectedOptionIndex = null;
  state.answeredCurrentQuestion = false;

  updateHUD();
  clearFeedback();
  ui.nextQuestionBtn.classList.add("hidden");
  ui.confirmAnswerBtn.disabled = false;

  const normalizedDifficulty = String(question.difficulty || "").toLowerCase();
  ui.difficultyBadge.classList.remove("difficulty-easy", "difficulty-medium", "difficulty-hard");
  if (normalizedDifficulty.includes("fac")) {
    ui.difficultyBadge.classList.add("difficulty-easy");
  } else if (normalizedDifficulty.includes("med")) {
    ui.difficultyBadge.classList.add("difficulty-medium");
  } else {
    ui.difficultyBadge.classList.add("difficulty-hard");
  }

  ui.difficultyBadge.textContent = `Nivel: ${question.difficulty}`;
  ui.questionIndex.textContent = `Carta ${state.currentIndex + 1} de ${TOTAL_QUESTIONS_PER_MATCH}`;
  ui.questionTitle.textContent = question.statement;

  ui.optionsContainer.innerHTML = "";
  ui.questionCard.classList.remove("card-enter");

  window.requestAnimationFrame(() => {
    ui.questionCard.classList.add("card-enter");
  });

  question.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = `${String.fromCharCode(65 + index)}) ${option}`;
    button.dataset.index = String(index);

    button.addEventListener("click", () => {
      if (state.answeredCurrentQuestion) {
        return;
      }

      state.selectedOptionIndex = index;
      document.querySelectorAll(".option-btn").forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
    });

    ui.optionsContainer.appendChild(button);
  });
}

function highlightAnswers(correctIndex, selectedIndex) {
  const optionButtons = [...document.querySelectorAll(".option-btn")];

  optionButtons.forEach((button, index) => {
    button.disabled = true;
    button.classList.remove("selected");

    if (index === correctIndex) {
      button.classList.add("correct");
      return;
    }

    if (index === selectedIndex && selectedIndex !== correctIndex) {
      button.classList.add("wrong");
    }
  });
}

function showFeedback({ isCorrect, question }) {
  if (isCorrect) {
    playSuccessSound();
  } else {
    playErrorSound();
  }

  ui.feedbackPanel.classList.remove("hidden");
  ui.feedbackTitle.textContent = isCorrect ? "Resposta correta!" : "Resposta incorreta!";

  if (isCorrect) {
    ui.feedbackMessage.textContent =
      "Excelente! Você recuperou esta carta da sequência. Veja o raciocínio para reforcar seu aprendizado:";
  } else {
    const correctText = question.options[question.correctIndex];
    ui.feedbackMessage.textContent = `A alternativa correta era: ${correctText}. Analise a resolução abaixo para aprender com o erro.`;
  }

  ui.explanationText.textContent = question.explanation;
}

function answerCurrentQuestion() {
  if (state.answeredCurrentQuestion) {
    return;
  }

  const question = state.selectedQuestions[state.currentIndex];

  if (state.selectedOptionIndex === null) {
    ui.feedbackPanel.classList.remove("hidden");
    ui.feedbackTitle.textContent = "Escolha uma alternativa";
    ui.feedbackMessage.textContent = "Selecione uma opção para confirmar sua resposta.";
    ui.explanationText.textContent = "";
    return;
  }

  state.answeredCurrentQuestion = true;

  const isCorrect = state.selectedOptionIndex === question.correctIndex;

  state.answerLog.push({
    questionId: question.id,
    selectedIndex: state.selectedOptionIndex,
    isCorrect
  });

  if (isCorrect) {
    state.score += POINTS_PER_CORRECT;
    state.correctCount += 1;
  } else {
    state.errorCount += 1;
  }

  highlightAnswers(question.correctIndex, state.selectedOptionIndex);
  showFeedback({ isCorrect, question });

  ui.confirmAnswerBtn.disabled = true;
  ui.nextQuestionBtn.classList.remove("hidden");
  updateHUD();
  saveGameState("game");
}

function goToNextQuestion() {
  if (!state.answeredCurrentQuestion) {
    return;
  }

  const isLastQuestion = state.currentIndex >= TOTAL_QUESTIONS_PER_MATCH - 1;

  if (isLastQuestion) {
    openResultScreen();
    return;
  }

  state.currentIndex += 1;
  renderCurrentQuestion();
  saveGameState("game");
}

function motivationByScore(score) {
  if (score === 1000) {
    return "Desempenho máximo! Você recuperou todas as cartas da Sequência Mestra com excelência.";
  }

  if (score >= 600) {
    return "Ótimo trabalho! Sua estratégia matemática está forte. Continue praticando para pontuação máxima.";
  }

  return "Boa jornada! Cada tentativa fortalece seu raciocínio. Revise as explicações e tente novamente.";
}

function openResultScreen() {
  const totalAnswered = state.correctCount + state.errorCount;
  const hitRate = totalAnswered > 0 ? Math.round((state.correctCount / totalAnswered) * 100) : 0;

  ui.progressBar.style.width = "100%";
  ui.resultStory.textContent =
    "Você chegou ao cofre central e reuniu as cartas perdidas da progressão. A Sequência Mestra foi restaurada!";
  ui.resultScore.textContent = `${state.score}`;
  ui.resultCorrect.textContent = `${state.correctCount}`;
  ui.resultErrors.textContent = `${state.errorCount}`;
  ui.resultRate.textContent = `${hitRate}%`;
  ui.resultMotivation.textContent = motivationByScore(state.score);
  buildResultReview();
  buildJourneySummary();

  showScreen("result");
  saveGameState("result");
}

function startGame() {
  resetMatchState();
  renderCurrentQuestion();
  showScreen("game");
  saveGameState("game");
}

function bindEvents() {
  ui.startBtn.addEventListener("click", startGame);
  ui.howToPlayBtn.addEventListener("click", () => showScreen("tutorial"));
  ui.backHomeFromTutorialBtn.addEventListener("click", () => showScreen("home"));
  ui.startFromTutorialBtn.addEventListener("click", startGame);
  ui.confirmAnswerBtn.addEventListener("click", answerCurrentQuestion);
  ui.nextQuestionBtn.addEventListener("click", goToNextQuestion);
  ui.playAgainBtn.addEventListener("click", startGame);
  ui.backHomeBtn.addEventListener("click", () => showScreen("home"));
}

function bootstrap() {
  try {
    validateQuestionBank(PA_QUESTIONS);
    populateBackgroundSymbols();
    bindEvents();
    bindPerformanceGuards();
    initButtonSounds();
    if (!restoreGameStateFromStorage()) {
      showScreen("home");
    }
  } catch (error) {
    alert(`Erro ao iniciar o jogo: ${error.message}`);
    console.error(error);
  }
}

bootstrap();
