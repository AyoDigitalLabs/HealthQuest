// HealthQuest - simulator.js (Phase 5)
// Uses SIM_SCENARIOS (sim-data.js) and player, addXP, showToast (game.js).

var Simulator = (function () {

  var XP_PER_STEP = { easy: 6, medium: 8, hard: 10 };
  var COMPLETE_BONUS = 10;
  var EMERGENCY_SECONDS = 25;

  var state = {
    view: 'list',        // list, case, step or result
    tab: 'clinic',       // clinic or emergency
    id: null,
    steps: [],
    stepIndex: 0,
    correct: 0,
    earned: 0,
    answered: false,
    selected: -1,
    timedOut: false,
    updates: [],
    timeLeft: 0,
    results: null
  };

  var timer = null;

  function root() { return document.getElementById('simRoot'); }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function capitalise(word) { return word.charAt(0).toUpperCase() + word.slice(1); }

  function findScenario(id) {
    for (var i = 0; i < SIM_SCENARIOS.length; i++) {
      if (SIM_SCENARIOS[i].id === id) { return SIM_SCENARIOS[i]; }
    }
    return null;
  }

  // ----- Timer (emergency cases only) -----
  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function updateTimerDisplay() {
    var text = document.getElementById('simTimeText');
    var fill = document.getElementById('simTimeFill');
    var left = Math.max(0, state.timeLeft);
    if (text) { text.textContent = left + 's'; }
    if (fill) {
      fill.style.width = (left / EMERGENCY_SECONDS * 100) + '%';
      fill.classList.toggle('low', left <= 5);
    }
  }

  function timeUp() {
    stopTimer();
    if (state.answered) { return; }
    state.answered = true;
    state.timedOut = true;
    state.selected = -1;
    render();
  }

  function startTimer() {
    stopTimer();
    timer = setInterval(function () {
      state.timeLeft -= 1;
      updateTimerDisplay();
      if (state.timeLeft <= 0) { timeUp(); }
    }, 1000);
  }

  // ----- Case flow -----
  function prepareSteps(sc) {
    return sc.steps.map(function (s) {
      var opts = s.options.map(function (text, i) {
        return { text: text, correct: i === s.answer };
      });
      opts = shuffle(opts);
      var correctIndex = 0;
      for (var i = 0; i < opts.length; i++) {
        if (opts[i].correct) { correctIndex = i; }
      }
      return { prompt: s.prompt, options: opts, correctIndex: correctIndex,
               explanation: s.explanation, newInfo: s.newInfo || '' };
    });
  }

  function openCase(id) {
    stopTimer();
    state.id = id;
    state.view = 'case';
    render();
    window.scrollTo(0, 0);
  }

  function backToList() {
    stopTimer();
    state.view = 'list';
    render();
    window.scrollTo(0, 0);
  }

  function startCase() {
    var sc = findScenario(state.id);
    if (!sc) { backToList(); return; }
    state.steps = prepareSteps(sc);
    state.stepIndex = 0;
    state.correct = 0;
    state.earned = 0;
    state.updates = [];
    state.results = null;
    state.view = 'step';
    beginStep();
  }

  function beginStep() {
    var sc = findScenario(state.id);
    state.answered = false;
    state.selected = -1;
    state.timedOut = false;
    if (sc.type === 'emergency') {
      state.timeLeft = EMERGENCY_SECONDS;
      startTimer();
    } else {
      stopTimer();
    }
    render();
    window.scrollTo(0, 0);
  }

  function chooseAnswer(i) {
    if (state.answered) { return; }
    stopTimer();
    state.answered = true;
    state.selected = i;
    var sc = findScenario(state.id);
    var step = state.steps[state.stepIndex];
    if (i === step.correctIndex) {
      state.correct += 1;
      state.earned += XP_PER_STEP[sc.difficulty];
    }
    render();
  }

  function nextStep() {
    var step = state.steps[state.stepIndex];
    if (step.newInfo) { state.updates.push(step.newInfo); }
    state.stepIndex += 1;
    if (state.stepIndex >= state.steps.length) {
      finishCase();
    } else {
      beginStep();
    }
  }

  function finishCase() {
    stopTimer();
    var sc = findScenario(state.id);
    var total = state.steps.length;

    player.scenariosPlayed += 1;
    var oldBest = player.scenarioBest[sc.id];
    if (oldBest === undefined || state.correct > oldBest) {
      player.scenarioBest[sc.id] = state.correct;
    }

    var xp = state.earned + COMPLETE_BONUS;
    state.results = { correct: state.correct, total: total, xp: xp, levelUp: false };
    state.view = 'result';

    var levelledUp = addXP(xp);   // also saves the player
    state.results.levelUp = levelledUp;
    render();
    window.scrollTo(0, 0);
    if (levelledUp) { showToast('Level up! You are now level ' + player.level + '.'); }
  }

  // ----- Patient file -----
  function patientFile(box, sc, compact) {
    var card = make('div', 'pfile');

    var head = make('div', 'pfile-head');
    head.appendChild(make('strong', 'pfile-name', sc.patient.name));
    head.appendChild(make('span', 'pfile-meta', sc.patient.age + ' \u00B7 ' + sc.patient.sex));
    card.appendChild(head);
    card.appendChild(make('small', 'pfile-setting', sc.patient.setting));

    card.appendChild(make('h4', null, 'Presenting complaint'));
    card.appendChild(make('p', null, sc.complaint));

    if (!compact) {
      card.appendChild(make('h4', null, 'History'));
      card.appendChild(make('p', null, sc.history));

      card.appendChild(make('h4', null, 'Symptoms'));
      var list = make('ul', 'symp-list');
      sc.symptoms.forEach(function (s) { list.appendChild(make('li', null, s)); });
      card.appendChild(list);
    }

    card.appendChild(make('h4', null, 'Observations and vital signs'));
    var grid = make('div', 'vitals');
    sc.vitals.forEach(function (v) {
      var cell = make('div', 'vital');
      cell.appendChild(make('span', null, v.label));
      cell.appendChild(make('b', null, v.value));
      grid.appendChild(cell);
    });
    card.appendChild(grid);

    box.appendChild(card);
  }

  // ----- Screen 1: list of cases -----
  function renderList(box) {
    var head = make('div', 'ac-head');
    head.appendChild(make('h2', null, 'Patient Simulator'));
    head.appendChild(make('p', null, 'Assess fictional patients and make decisions. These cases are for education only and do not replace clinical training.'));
    box.appendChild(head);

    var wrap = make('div', 'chips-wrap');
    [['clinic', 'Clinic cases'], ['emergency', 'Emergency Room']].forEach(function (t) {
      var btn = make('button', 'chip-btn' + (state.tab === t[0] ? ' selected' : ''), t[1]);
      btn.addEventListener('click', function () { state.tab = t[0]; render(); });
      wrap.appendChild(btn);
    });
    box.appendChild(wrap);

    if (state.tab === 'emergency') {
      box.appendChild(make('p', 'sim-note', 'Emergency Room cases are timed: ' + EMERGENCY_SECONDS + ' seconds per decision.'));
    }

    SIM_SCENARIOS.forEach(function (sc) {
      if (sc.type !== state.tab) { return; }
      var card = make('button', 'case-card');
      var info = make('div', 'case-info');
      info.appendChild(make('strong', null, sc.title));
      info.appendChild(make('small', null, sc.patient.name + ', ' + sc.patient.age + ' \u00B7 ' + sc.steps.length + ' decisions'));
      var tags = make('div', 'quiz-meta');
      tags.appendChild(make('span', 'badge', capitalise(sc.difficulty)));
      info.appendChild(tags);
      card.appendChild(info);

      var best = player.scenarioBest[sc.id];
      card.appendChild(make('span', best !== undefined ? 'done-tag' : 'todo-tag',
        best !== undefined ? 'Best: ' + best + '/' + sc.steps.length : 'New'));

      card.addEventListener('click', function () { openCase(sc.id); });
      box.appendChild(card);
    });

    box.appendChild(make('p', 'source-note', 'All patients are fictional. Never use HealthQuest to diagnose or treat real patients.'));
  }

  // ----- Screen 2: meet the patient -----
  function renderCase(box) {
    var sc = findScenario(state.id);
    if (!sc) { backToList(); return; }

    var back = make('button', 'back-btn', '\u2190 All cases');
    back.addEventListener('click', backToList);
    box.appendChild(back);

    box.appendChild(make('h2', 'lesson-title', sc.title));
    var tags = make('div', 'quiz-meta');
    tags.appendChild(make('span', 'badge', sc.type === 'emergency' ? 'Emergency Room' : 'Clinic case'));
    tags.appendChild(make('span', 'badge', capitalise(sc.difficulty)));
    box.appendChild(tags);

    patientFile(box, sc, false);

    if (sc.type === 'emergency') {
      box.appendChild(make('p', 'sim-note', 'Timed case: you have ' + EMERGENCY_SECONDS + ' seconds for each decision.'));
    }

    var begin = make('button', 'btn-primary wide', 'Begin assessment');
    begin.addEventListener('click', startCase);
    box.appendChild(begin);
  }

  // ----- Screen 3: decisions -----
  function renderStep(box) {
    var sc = findScenario(state.id);
    var step = state.steps[state.stepIndex];
    if (!sc || !step) { backToList(); return; }

    var top = make('div', 'quiz-top');
    top.appendChild(make('span', null, 'Decision ' + (state.stepIndex + 1) + ' / ' + state.steps.length));
    top.appendChild(make('span', 'quiz-score', 'Correct: ' + state.correct));
    box.appendChild(top);

    if (sc.type === 'emergency') {
      var wrap = make('div', 'timer-wrap');
      var bar = make('div', 'timer-bar');
      var fill = make('div', 'timer-fill');
      fill.id = 'simTimeFill';
      bar.appendChild(fill);
      var label = make('span', 'timer-text');
      label.id = 'simTimeText';
      wrap.appendChild(bar);
      wrap.appendChild(label);
      box.appendChild(wrap);
      updateTimerDisplay();
    }

    patientFile(box, sc, true);

    state.updates.forEach(function (text) {
      var u = make('div', 'update-card');
      u.appendChild(make('b', null, 'Update: '));
      u.appendChild(document.createTextNode(text));
      box.appendChild(u);
    });

    box.appendChild(make('h2', 'quiz-q', step.prompt));

    step.options.forEach(function (opt, i) {
      var cls = 'opt';
      if (state.answered) {
        if (i === step.correctIndex) { cls += ' correct'; }
        else if (i === state.selected) { cls += ' wrong'; }
      }
      var btn = make('button', cls, String.fromCharCode(65 + i) + '.  ' + opt.text);
      btn.disabled = state.answered;
      btn.addEventListener('click', function () { chooseAnswer(i); });
      box.appendChild(btn);
    });

    if (state.answered) {
      var wasCorrect = state.selected === step.correctIndex;
      var fb = make('div', 'feedback ' + (wasCorrect ? 'ok' : 'bad'));
      fb.appendChild(make('h3', null, wasCorrect ? 'Good decision!' : (state.timedOut ? "Time's up!" : 'Not the best choice.')));
      if (!wasCorrect) {
        fb.appendChild(make('p', 'fb-answer', 'Best answer: ' + step.options[step.correctIndex].text));
      }
      fb.appendChild(make('p', null, step.explanation));
      box.appendChild(fb);

      var isLast = state.stepIndex >= state.steps.length - 1;
      var next = make('button', 'btn-primary wide', isLast ? 'See case results' : 'Continue');
      next.addEventListener('click', nextStep);
      box.appendChild(next);
    }

    var quit = make('button', 'back-btn quit-btn', 'Leave case (no XP is earned)');
    quit.addEventListener('click', backToList);
    box.appendChild(quit);
  }

  // ----- Screen 4: results -----
  function renderResult(box) {
    var sc = findScenario(state.id);
    var r = state.results;
    if (!sc || !r) { backToList(); return; }

    var card = make('div', 'results-card');
    card.appendChild(make('p', 'results-label', 'Case complete: ' + sc.title));
    card.appendChild(make('div', 'results-score', r.correct + ' / ' + r.total));
    card.appendChild(make('p', 'results-pct', 'decisions correct'));
    var msg = r.correct === r.total ? 'Excellent clinical reasoning!'
      : (r.correct >= r.total / 2 ? 'Good effort. Review the explanations and try again.'
      : 'Keep learning. Review the related Academy lessons and try again.');
    card.appendChild(make('p', 'results-msg', msg));
    box.appendChild(card);

    var xpCard = make('div', 'tip-card');
    xpCard.appendChild(make('p', null, 'You earned +' + r.xp + ' XP' + (r.levelUp ? ' and reached level ' + player.level + '!' : '.')));
    xpCard.appendChild(make('small', null, 'XP is earned for each correct decision, plus a completion bonus of ' + COMPLETE_BONUS + ' XP.'));
    box.appendChild(xpCard);

    var points = make('div', 'points-card');
    points.appendChild(make('h3', null, 'Key lessons from this case'));
    var list = make('ul');
    sc.summary.forEach(function (t) { list.appendChild(make('li', null, t)); });
    points.appendChild(list);
    box.appendChild(points);

    box.appendChild(make('p', 'source-note', 'Source: ' + sc.source));
    box.appendChild(make('p', 'source-note', 'This is a fictional educational simulation. It is not a guide for diagnosing or treating real patients.'));

    var again = make('button', 'btn-primary wide', 'Try this case again');
    again.addEventListener('click', startCase);
    box.appendChild(again);

    var back = make('button', 'btn-outline wide', 'Back to cases');
    back.addEventListener('click', backToList);
    box.appendChild(back);
  }

  // ----- Draw the right screen -----
  function render() {
    var box = root();
    if (!box || typeof player === 'undefined' || typeof SIM_SCENARIOS === 'undefined') { return; }
    box.innerHTML = '';
    if (state.view === 'case') { renderCase(box); }
    else if (state.view === 'step' && state.steps.length > 0) { renderStep(box); }
    else if (state.view === 'result') { renderResult(box); }
    else { state.view = 'list'; renderList(box); }
  }

  // Home cards with data-sim="clinic" or "emergency" open the right list
  function init() {
    var links = document.querySelectorAll('[data-sim]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        stopTimer();
        state.tab = this.getAttribute('data-sim');
        state.view = 'list';
        render();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return { render: render };
})();