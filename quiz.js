// HealthQuest - quiz.js (Phase 4)
// Uses QUIZ_QUESTIONS (quiz-data.js), ACADEMY (academy-data.js)
// and player, addXP, showToast (game.js).

var Quiz = (function () {

  var XP_PER_CORRECT = { easy: 4, medium: 6, hard: 8 };
  var COMPLETE_BONUS = 10;
  var TIME_LIMIT = { easy: 30, medium: 25, hard: 20 };
  var MAX_QUESTIONS = 10;

  var state = {
    view: 'setup',        // setup, question or results
    topic: 'all',
    difficulty: 'mixed',
    timed: true,
    questions: [],
    index: 0,
    score: 0,
    earned: 0,
    answered: false,
    selected: -1,
    timedOut: false,
    timeLeft: 0,
    timeMax: 0,
    results: null
  };

  var timer = null;

  function root() { return document.getElementById('quizRoot'); }

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

  function capitalise(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  // ----- Choosing the questions -----
  function getPool() {
    return QUIZ_QUESTIONS.filter(function (q) {
      var topicOk = state.topic === 'all' || q.topic === state.topic;
      var diffOk = state.difficulty === 'mixed' || q.difficulty === state.difficulty;
      return topicOk && diffOk;
    });
  }

  // Shuffles the answer options (not for True/False) and remembers the right one
  function prepare(q) {
    var opts = q.options.map(function (text, i) {
      return { text: text, correct: i === q.answer };
    });
    if (q.type !== 'tf') { opts = shuffle(opts); }
    var correctIndex = 0;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].correct) { correctIndex = i; }
    }
    return {
      text: q.q, type: q.type, difficulty: q.difficulty, topic: q.topic,
      options: opts, correctIndex: correctIndex, explanation: q.explanation
    };
  }

  // ----- Timer -----
  function stopTimer() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  function updateTimerDisplay() {
    var text = document.getElementById('quizTimeText');
    var fill = document.getElementById('quizTimeFill');
    var left = Math.max(0, state.timeLeft);
    if (text) { text.textContent = left + 's'; }
    if (fill) {
      fill.style.width = (left / state.timeMax * 100) + '%';
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

  // ----- Quiz flow -----
  function startQuiz() {
    var pool = getPool();
    if (pool.length === 0) {
      showToast('No questions for that choice yet.');
      return;
    }
    state.questions = shuffle(pool).slice(0, MAX_QUESTIONS).map(prepare);
    state.index = 0;
    state.score = 0;
    state.earned = 0;
    state.results = null;
    state.view = 'question';
    beginQuestion();
  }

  function beginQuestion() {
    var q = state.questions[state.index];
    state.answered = false;
    state.selected = -1;
    state.timedOut = false;
    if (state.timed) {
      state.timeMax = TIME_LIMIT[q.difficulty];
      state.timeLeft = state.timeMax;
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
    var q = state.questions[state.index];
    if (i === q.correctIndex) {
      state.score += 1;
      state.earned += XP_PER_CORRECT[q.difficulty];
    }
    render();
  }

  function nextQuestion() {
    state.index += 1;
    if (state.index >= state.questions.length) {
      finishQuiz();
    } else {
      beginQuestion();
    }
  }

  function finishQuiz() {
    stopTimer();
    var total = state.questions.length;
    var pct = Math.round((state.score / total) * 100);

    player.quizzes += 1;
    player.totalAnswered += total;
    player.totalCorrect += state.score;
    if (pct > player.quizBest) { player.quizBest = pct; }

    var xp = state.earned + COMPLETE_BONUS;
    state.results = { score: state.score, total: total, pct: pct, xp: xp, levelUp: false };
    state.view = 'results';

    var levelledUp = addXP(xp);   // also saves the player
    state.results.levelUp = levelledUp;
    render();
    window.scrollTo(0, 0);
    if (levelledUp) { showToast('Level up! You are now level ' + player.level + '.'); }
  }

  function quitQuiz() {
    stopTimer();
    state.view = 'setup';
    render();
    window.scrollTo(0, 0);
  }

  // ----- Screen 1: setup -----
  function chipGroup(box, title, options, current, onPick) {
    box.appendChild(make('h3', 'section-heading', title));
    var wrap = make('div', 'chips-wrap');
    options.forEach(function (opt) {
      var btn = make('button', 'chip-btn' + (opt.value === current ? ' selected' : ''), opt.label);
      btn.addEventListener('click', function () { onPick(opt.value); });
      wrap.appendChild(btn);
    });
    box.appendChild(wrap);
  }

  function renderSetup(box) {
    var head = make('div', 'ac-head');
    head.appendChild(make('h2', null, 'Medical Quiz'));
    head.appendChild(make('p', null, 'Test your knowledge. Earn XP for every correct answer.'));
    box.appendChild(head);

    var accuracy = player.totalAnswered > 0
      ? Math.round((player.totalCorrect / player.totalAnswered) * 100) + '%' : '-';
    var best = player.quizzes > 0 ? player.quizBest + '%' : '-';

    var stats = make('div', 'stats-row');
    [[player.quizzes, 'Quizzes played'], [best, 'Best score'], [accuracy, 'Accuracy']].forEach(function (item) {
      var s = make('div', 'stat-box');
      s.appendChild(make('b', null, String(item[0])));
      s.appendChild(make('span', null, item[1]));
      stats.appendChild(s);
    });
    box.appendChild(stats);

    var topicOptions = [{ value: 'all', label: 'All topics' }];
    ACADEMY.forEach(function (cat) {
      topicOptions.push({ value: cat.id, label: cat.title });
    });
    chipGroup(box, 'Topic', topicOptions, state.topic, function (v) { state.topic = v; render(); });

    chipGroup(box, 'Difficulty', [
      { value: 'mixed', label: 'Mixed' },
      { value: 'easy', label: 'Easy' },
      { value: 'medium', label: 'Medium' },
      { value: 'hard', label: 'Hard' }
    ], state.difficulty, function (v) { state.difficulty = v; render(); });

    chipGroup(box, 'Mode', [
      { value: true, label: 'Timed' },
      { value: false, label: 'Relaxed (no timer)' }
    ], state.timed, function (v) { state.timed = v; render(); });

    var count = Math.min(MAX_QUESTIONS, getPool().length);
    var btn = make('button', 'btn-primary wide', count > 0 ? 'Start quiz (' + count + ' questions)' : 'No questions available');
    btn.addEventListener('click', startQuiz);
    box.appendChild(btn);

    box.appendChild(make('p', 'source-note', 'For education only. Quiz answers are not a guide for diagnosing or treating real patients.'));
  }

  // ----- Screen 2: question -----
  function renderQuestion(box) {
    var q = state.questions[state.index];

    var top = make('div', 'quiz-top');
    top.appendChild(make('span', null, 'Question ' + (state.index + 1) + ' / ' + state.questions.length));
    top.appendChild(make('span', 'quiz-score', 'Score: ' + state.score));
    box.appendChild(top);

    if (state.timed) {
      var wrap = make('div', 'timer-wrap');
      var bar = make('div', 'timer-bar');
      var fill = make('div', 'timer-fill');
      fill.id = 'quizTimeFill';
      bar.appendChild(fill);
      var label = make('span', 'timer-text');
      label.id = 'quizTimeText';
      wrap.appendChild(bar);
      wrap.appendChild(label);
      box.appendChild(wrap);
      updateTimerDisplay();
    }

    var meta = make('div', 'quiz-meta');
    meta.appendChild(make('span', 'badge', q.type === 'tf' ? 'True or False' : 'Multiple choice'));
    meta.appendChild(make('span', 'badge', capitalise(q.difficulty)));
    box.appendChild(meta);

    box.appendChild(make('h2', 'quiz-q', q.text));

    q.options.forEach(function (opt, i) {
      var cls = 'opt';
      if (state.answered) {
        if (i === q.correctIndex) { cls += ' correct'; }
        else if (i === state.selected) { cls += ' wrong'; }
      }
      var prefix = q.type === 'tf' ? '' : String.fromCharCode(65 + i) + '.  ';
      var btn = make('button', cls, prefix + opt.text);
      btn.disabled = state.answered;
      btn.addEventListener('click', function () { chooseAnswer(i); });
      box.appendChild(btn);
    });

    if (state.answered) {
      var wasCorrect = state.selected === q.correctIndex;
      var fb = make('div', 'feedback ' + (wasCorrect ? 'ok' : 'bad'));
      var title = wasCorrect ? 'Correct!' : (state.timedOut ? "Time's up!" : 'Not quite.');
      fb.appendChild(make('h3', null, title));
      if (!wasCorrect) {
        fb.appendChild(make('p', 'fb-answer', 'Correct answer: ' + q.options[q.correctIndex].text));
      }
      fb.appendChild(make('p', null, q.explanation));
      box.appendChild(fb);

      var isLast = state.index >= state.questions.length - 1;
      var next = make('button', 'btn-primary wide', isLast ? 'See results' : 'Next question');
      next.addEventListener('click', nextQuestion);
      box.appendChild(next);
    }

    var quit = make('button', 'back-btn quit-btn', 'Quit quiz (no XP is earned)');
    quit.addEventListener('click', quitQuiz);
    box.appendChild(quit);
  }

  // ----- Screen 3: results -----
  function renderResults(box) {
    var r = state.results;
    if (!r) { quitQuiz(); return; }

    var card = make('div', 'results-card');
    card.appendChild(make('p', 'results-label', 'Quiz complete'));
    card.appendChild(make('div', 'results-score', r.score + ' / ' + r.total));
    card.appendChild(make('p', 'results-pct', r.pct + '%'));

    var message;
    if (r.pct >= 80) { message = 'Excellent work!'; }
    else if (r.pct >= 50) { message = 'Good effort. Keep practising.'; }
    else { message = 'Keep studying. Review the Health Academy lessons and try again.'; }
    card.appendChild(make('p', 'results-msg', message));
    box.appendChild(card);

    var xpCard = make('div', 'tip-card');
    xpCard.appendChild(make('p', null, 'You earned +' + r.xp + ' XP' + (r.levelUp ? ' and reached level ' + player.level + '!' : '.')));
    xpCard.appendChild(make('small', null, 'Correct answers earn XP by difficulty, plus a completion bonus of ' + COMPLETE_BONUS + ' XP.'));
    box.appendChild(xpCard);

    var again = make('button', 'btn-primary wide', 'Play again');
    again.addEventListener('click', startQuiz);
    box.appendChild(again);

    var change = make('button', 'btn-outline wide', 'Change settings');
    change.addEventListener('click', quitQuiz);
    box.appendChild(change);
  }

  // ----- Draw the right screen -----
  function render() {
    var box = root();
    if (!box || typeof player === 'undefined' || typeof QUIZ_QUESTIONS === 'undefined') { return; }
    box.innerHTML = '';
    if (state.view === 'question' && state.questions.length > 0) { renderQuestion(box); }
    else if (state.view === 'results') { renderResults(box); }
    else { state.view = 'setup'; renderSetup(box); }
  }

  return { render: render };
})();