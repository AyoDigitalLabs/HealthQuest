// HealthQuest - daily.js (Phase 7)
// Daily Challenge: 3 questions (easy, medium, hard), the same for everyone on a given day.
// Uses QUIZ_QUESTIONS (quiz-data.js) and player, addXP, savePlayer, showToast,
// showScreen, dateString (game.js).

var Daily = (function () {

  var PER_CORRECT = 8;
  var COMPLETE_BONUS = 10;
  var STREAK_BONUS_PER_DAY = 2;
  var STREAK_BONUS_MAX_DAYS = 7;

  var state = {
    view: 'intro',        // intro, question or result
    questions: [],
    index: 0,
    correct: 0,
    answered: false,
    selected: -1,
    result: null
  };

  function root() { return document.getElementById('dailyRoot'); }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function today() { return dateString(new Date()); }

  // ----- Same questions for everyone on the same day -----
  function hashString(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffleWith(list, rng) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function buildQuestions() {
    var rng = mulberry32(hashString('hq-' + today()));
    var picked = [];
    ['easy', 'medium', 'hard'].forEach(function (diff) {
      var pool = QUIZ_QUESTIONS.filter(function (q) { return q.difficulty === diff; });
      if (pool.length === 0) { return; }
      var q = pool[Math.floor(rng() * pool.length)];
      var opts = q.options.map(function (text, i) {
        return { text: text, correct: i === q.answer };
      });
      if (q.type !== 'tf') { opts = shuffleWith(opts, rng); }
      var correctIndex = 0;
      opts.forEach(function (o, i) { if (o.correct) { correctIndex = i; } });
      picked.push({ text: q.q, type: q.type, difficulty: q.difficulty,
                    options: opts, correctIndex: correctIndex, explanation: q.explanation });
    });
    return picked;
  }

  // ----- Flow -----
  function startChallenge() {
    state.questions = buildQuestions();
    if (state.questions.length === 0) {
      showToast('No daily questions available yet.');
      return;
    }
    state.index = 0;
    state.correct = 0;
    state.answered = false;
    state.selected = -1;
    state.result = null;
    state.view = 'question';
    render();
    window.scrollTo(0, 0);
  }

  function choose(i) {
    if (state.answered) { return; }
    state.answered = true;
    state.selected = i;
    if (i === state.questions[state.index].correctIndex) { state.correct += 1; }
    render();
  }

  function next() {
    state.index += 1;
    state.answered = false;
    state.selected = -1;
    if (state.index >= state.questions.length) { finish(); }
    else { render(); window.scrollTo(0, 0); }
  }

  function finish() {
    var streakDays = Math.min(player.streak, STREAK_BONUS_MAX_DAYS);
    var streakBonus = streakDays * STREAK_BONUS_PER_DAY;
    var xp = state.correct * PER_CORRECT + COMPLETE_BONUS + streakBonus;

    player.dailyLast = today();
    player.dailyCompleted += 1;
    player.dailyScore = state.correct;

    state.result = {
      correct: state.correct,
      total: state.questions.length,
      xp: xp,
      streakBonus: streakBonus,
      levelUp: false
    };
    state.view = 'result';

    var levelledUp = addXP(xp);   // also saves, redraws and checks badges
    state.result.levelUp = levelledUp;
    render();
    window.scrollTo(0, 0);
    if (levelledUp) { showToast('Level up! You are now level ' + player.level + '.'); }
  }

  // ----- Screens -----
  function statsRow(box) {
    var stats = make('div', 'stats-row two');
    [[String(player.streak), 'Day streak'], [String(player.dailyCompleted), 'Challenges completed']].forEach(function (item) {
      var s = make('div', 'stat-box');
      s.appendChild(make('b', null, item[0]));
      s.appendChild(make('span', null, item[1]));
      stats.appendChild(s);
    });
    box.appendChild(stats);
  }

  function renderIntro(box) {
    var head = make('div', 'ac-head');
    head.appendChild(make('h2', null, 'Daily Challenge'));
    head.appendChild(make('p', null, 'Three new questions every day: one easy, one medium and one hard. You can earn the rewards once per day.'));
    box.appendChild(head);

    statsRow(box);

    var info = make('div', 'tip-card');
    info.appendChild(make('p', null, 'Rewards: ' + PER_CORRECT + ' XP per correct answer, +' + COMPLETE_BONUS + ' XP for finishing, and +' + STREAK_BONUS_PER_DAY + ' XP for each day of your streak (up to ' + STREAK_BONUS_MAX_DAYS + ' days).'));
    box.appendChild(info);

    var start = make('button', 'btn-primary wide', "Start today's challenge");
    start.addEventListener('click', startChallenge);
    box.appendChild(start);
  }

  function renderQuestion(box) {
    var q = state.questions[state.index];

    var top = make('div', 'quiz-top');
    top.appendChild(make('span', null, 'Daily Challenge \u00B7 ' + (state.index + 1) + ' / ' + state.questions.length));
    top.appendChild(make('span', 'quiz-score', 'Correct: ' + state.correct));
    box.appendChild(top);

    var meta = make('div', 'quiz-meta');
    meta.appendChild(make('span', 'badge', q.type === 'tf' ? 'True or False' : 'Multiple choice'));
    meta.appendChild(make('span', 'badge', q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)));
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
      btn.addEventListener('click', function () { choose(i); });
      box.appendChild(btn);
    });

    if (state.answered) {
      var wasCorrect = state.selected === q.correctIndex;
      var fb = make('div', 'feedback ' + (wasCorrect ? 'ok' : 'bad'));
      fb.appendChild(make('h3', null, wasCorrect ? 'Correct!' : 'Not quite.'));
      if (!wasCorrect) {
        fb.appendChild(make('p', 'fb-answer', 'Correct answer: ' + q.options[q.correctIndex].text));
      }
      fb.appendChild(make('p', null, q.explanation));
      box.appendChild(fb);

      var isLast = state.index >= state.questions.length - 1;
      var nextBtn = make('button', 'btn-primary wide', isLast ? 'Finish challenge' : 'Next question');
      nextBtn.addEventListener('click', next);
      box.appendChild(nextBtn);
    }
  }

  function renderResult(box) {
    var r = state.result;

    var card = make('div', 'results-card');
    card.appendChild(make('p', 'results-label', "Today's challenge complete"));
    card.appendChild(make('div', 'results-score', r.correct + ' / ' + r.total));
    card.appendChild(make('p', 'results-pct', 'correct'));
    card.appendChild(make('p', 'results-msg', r.correct === r.total ? 'Perfect! See you tomorrow.' : 'Nice work. New questions arrive tomorrow.'));
    box.appendChild(card);

    var xpCard = make('div', 'tip-card');
    xpCard.appendChild(make('p', null, 'You earned +' + r.xp + ' XP' + (r.levelUp ? ' and reached level ' + player.level + '!' : '.')));
    xpCard.appendChild(make('small', null, r.correct + ' correct x ' + PER_CORRECT + ' XP, +' + COMPLETE_BONUS + ' XP for finishing, +' + r.streakBonus + ' XP streak bonus.'));
    box.appendChild(xpCard);

    var home = make('button', 'btn-primary wide', 'Back to Home');
    home.addEventListener('click', function () { showScreen('home'); });
    box.appendChild(home);
  }

  function renderDone(box) {
    var card = make('div', 'results-card');
    card.appendChild(make('p', 'results-label', 'Daily Challenge complete \u2713'));
    card.appendChild(make('div', 'results-score', player.dailyScore + ' / 3'));
    card.appendChild(make('p', 'results-msg', 'You have finished today\'s challenge. Come back tomorrow for three new questions and to keep your streak going.'));
    box.appendChild(card);

    statsRow(box);

    var home = make('button', 'btn-primary wide', 'Back to Home');
    home.addEventListener('click', function () { showScreen('home'); });
    box.appendChild(home);
  }

  // Updates the button on the home screen
  function updateHomeButton() {
    var btn = document.getElementById('dailyBtn');
    if (!btn || typeof player === 'undefined') { return; }
    btn.textContent = player.dailyLast === today()
      ? 'Daily Challenge complete \u2713'
      : "Start Today's Challenge";
  }

  function render() {
    updateHomeButton();
    var box = root();
    if (!box || typeof player === 'undefined' || typeof QUIZ_QUESTIONS === 'undefined') { return; }
    box.innerHTML = '';

    if (state.view === 'question' && state.questions.length > 0) { renderQuestion(box); }
    else if (state.view === 'result' && state.result) { renderResult(box); }
    else if (player.dailyLast === today()) { renderDone(box); }
    else { state.view = 'intro'; renderIntro(box); }
  }

  return { render: render };
})();
