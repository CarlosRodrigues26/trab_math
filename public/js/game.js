const TOTAL_QUESTIONS_PER_MATCH = 10;
const POINTS_PER_CORRECT = 100;

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

function validateQuestionBank(questions) {
  if (!Array.isArray(questions) || questions.length < 30) {
    throw new Error("Banco de questoes invalido: e necessario ter ao menos 30 questoes.");
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
      throw new Error(`Questao ${q.id} possui gabarito invalido.`);
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

  state.selectedQuestions = shuffleArray(PA_QUESTIONS).slice(0, TOTAL_QUESTIONS_PER_MATCH);
}

function buildResultReview() {
  ui.resultReviewList.innerHTML = "";

  state.answerLog.forEach((entry, idx) => {
    const card = document.createElement("article");
    card.className = "review-card";

    const statusClass = entry.isCorrect ? "ok" : "error";
    const statusText = entry.isCorrect ? "Voce acertou esta carta" : "Voce errou esta carta";

    const selectedText = entry.question.options[entry.selectedIndex];
    const correctText = entry.question.options[entry.question.correctIndex];

    card.innerHTML = `
      <h4>Carta ${idx + 1} - ${entry.question.difficulty}</h4>
      <p class="review-row"><strong>Enunciado:</strong> ${entry.question.statement}</p>
      <span class="review-status ${statusClass}">${statusText}</span>
      <p class="review-row"><strong>Sua resposta:</strong> ${selectedText}</p>
      <p class="review-row"><strong>Resposta correta:</strong> ${correctText}</p>
      ${
        entry.isCorrect
          ? ""
          : `<p class="review-why-wrong">Voce escolheu uma alternativa diferente da correta. Compare sua escolha com o calculo oficial para identificar onde o raciocinio se desviou.</p>`
      }
      <div class="review-explanation"><strong>Resolucao:</strong>\n${entry.question.explanation}</div>
    `;

    ui.resultReviewList.appendChild(card);
  });
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
      "Excelente! Voce recuperou esta carta da sequencia. Veja o raciocinio para reforcar seu aprendizado:";
  } else {
    const correctText = question.options[question.correctIndex];
    ui.feedbackMessage.textContent = `A alternativa correta era: ${correctText}. Analise a resolucao abaixo para aprender com o erro.`;
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
    ui.feedbackMessage.textContent = "Selecione uma opcao para confirmar sua resposta.";
    ui.explanationText.textContent = "";
    return;
  }

  state.answeredCurrentQuestion = true;

  const isCorrect = state.selectedOptionIndex === question.correctIndex;

  state.answerLog.push({
    question,
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
}

function motivationByScore(score) {
  if (score === 500) {
    return "Desempenho maximo! Voce recuperou todas as cartas da Sequencia Mestra com excelencia.";
  }

  if (score >= 300) {
    return "Otimo trabalho! Sua estrategia matematica esta forte. Continue praticando para pontuacao maxima.";
  }

  return "Boa jornada! Cada tentativa fortalece seu raciocinio. Revise as explicacoes e tente novamente.";
}

function openResultScreen() {
  const totalAnswered = state.correctCount + state.errorCount;
  const hitRate = totalAnswered > 0 ? Math.round((state.correctCount / totalAnswered) * 100) : 0;

  ui.progressBar.style.width = "100%";
  ui.resultStory.textContent =
    "Voce chegou ao cofre central e reuniu as cartas perdidas da progressao. A Sequencia Mestra foi restaurada!";
  ui.resultScore.textContent = `${state.score}`;
  ui.resultCorrect.textContent = `${state.correctCount}`;
  ui.resultErrors.textContent = `${state.errorCount}`;
  ui.resultRate.textContent = `${hitRate}%`;
  ui.resultMotivation.textContent = motivationByScore(state.score);
  buildResultReview();

  showScreen("result");
}

function startGame() {
  resetMatchState();
  renderCurrentQuestion();
  showScreen("game");
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
    showScreen("home");
  } catch (error) {
    alert(`Erro ao iniciar o jogo: ${error.message}`);
    console.error(error);
  }
}

bootstrap();
