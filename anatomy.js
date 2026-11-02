// HealthQuest - anatomy.js (Phase 6)
// Uses ANATOMY (anatomy-data.js) and player, addXP, savePlayer, showToast (game.js).

var Anatomy = (function () {

  var XP_PER_CORRECT = 5;
  var COMPLETE_BONUS = 10;
  var LEARN_XP = 2;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  var MODES = {
    tap:  { title: 'Tap Challenge',  desc: 'You are given a name. Tap that structure on the diagram.' },
    name: { title: 'Name It',        desc: 'A structure is highlighted. Choose the correct name.' },
    job:  { title: 'Function Match', desc: 'Read what a structure does and pick which one it is.' }
  };

  var state = {
    view: 'menu',          // menu, learn, round or result
    diagramId: 'organs',
    mode: 'tap',
    learnId: null,
    ids: [],
    index: 0,
    correct: 0,
    answered: false,
    picked: null,
    options: [],
    results: null
  };

  function root() { return document.getElementById('anatomyRoot'); }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function svgEl(tag, attrs, className) {
    var el = document.createElementNS(SVG_NS, tag);
    for (var key in attrs) { el.setAttribute(key, attrs[key]); }
    if (className) { el.setAttribute('class', className); }
    return el;
  }

  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function findDiagram(id) {
    for (var i = 0; i < ANATOMY.length; i++) {
      if (ANATOMY[i].id === id) { return ANATOMY[i]; }
    }
    return ANATOMY[0];
  }

  function findPart(diagram, id) {
    for (var i = 0; i < diagram.parts.length; i++) {
      if (diagram.parts[i].id === id) { return diagram.parts[i]; }
    }
    return null;
  }

  function totalParts() {
    var n = 0;
    ANATOMY.forEach(function (d) { n += d.parts.length; });
    return n;
  }

  // ----- Drawing a diagram -----
  function makeShape(s) {
    if (s.t === 'ellipse') {
      return svgEl('ellipse', { cx: s.cx, cy: s.cy, rx: s.rx, ry: s.ry });
    }
    if (s.t === 'rect') {
      return svgEl('rect', { x: s.x, y: s.y, width: s.w, height: s.h, rx: s.r || 0 });
    }
    return svgEl('path', { d: s.d });
  }

  function buildSvg(diagram, opts) {
    var svg = svgEl('svg', { viewBox: diagram.viewBox, role: 'img' }, 'anat-svg');
    svg.appendChild(svgEl('path', { d: diagram.outline }, 'anat-outline'));

    diagram.parts.forEach(function (part) {
      var cls = 'anat-part';
      if (opts.selectedId === part.id) { cls += ' selected'; }
      if (opts.targetId === part.id) { cls += ' target'; }
      if (opts.correctId === part.id) { cls += ' correct'; }
      if (opts.wrongId === part.id) { cls += ' wrong'; }
      if (opts.clickable) { cls += ' clickable'; }

      var g = svgEl('g', {}, cls);
      part.shapes.forEach(function (s) {
        var el = makeShape(s);
        if (s.deco) { el.setAttribute('class', 'anat-deco'); }
        g.appendChild(el);
      });
      if (opts.clickable) {
        g.addEventListener('click', function () { opts.onTap(part.id); });
      }
      svg.appendChild(g);
    });
    return svg;
  }

  function levelToast(levelledUp, text) {
    if (levelledUp) { showToast('Level up! You are now level ' + player.level + '.'); }
    else if (text) { showToast(text); }
  }

  // ----- Navigation -----
  function backToMenu() {
    state.view = 'menu';
    render();
    window.scrollTo(0, 0);
  }

  function openLearn() {
    state.view = 'learn';
    state.learnId = null;
    render();
    window.scrollTo(0, 0);
  }

  // ----- Learn mode -----
  function learnPart(partId) {
    state.learnId = partId;
    var key = state.diagramId + ':' + partId;
    if (player.anatomySeen.indexOf(key) === -1) {
      player.anatomySeen.push(key);
      savePlayer();
      var levelledUp = addXP(LEARN_XP);   // also redraws the screen
      levelToast(levelledUp, '+' + LEARN_XP + ' XP for exploring something new');
    } else {
      render();
    }
  }

  function renderLearn(box) {
    var d = findDiagram(state.diagramId);

    var back = make('button', 'back-btn', '\u2190 Anatomy menu');
    back.addEventListener('click', backToMenu);
    box.appendChild(back);

    box.appendChild(make('h2', 'lesson-title', 'Learn: ' + d.title));
    box.appendChild(make('p', 'sim-note', 'Tap a structure on the diagram, or tap its name below.'));

    box.appendChild(buildSvg(d, { clickable: true, onTap: learnPart, selectedId: state.learnId }));
    box.appendChild(make('p', 'source-note anat-note', d.note));

    var wrap = make('div', 'chips-wrap');
    d.parts.forEach(function (part) {
      var seen = player.anatomySeen.indexOf(d.id + ':' + part.id) !== -1;
      var cls = 'chip-btn' + (state.learnId === part.id ? ' selected' : '');
      var btn = make('button', cls, (seen ? '\u2713 ' : '') + part.name);
      btn.addEventListener('click', function () { learnPart(part.id); });
      wrap.appendChild(btn);
    });
    box.appendChild(wrap);

    var info = make('div', 'pfile anat-info');
    var part = state.learnId ? findPart(d, state.learnId) : null;
    if (part) {
      info.appendChild(make('strong', 'pfile-name', part.name));
      info.appendChild(make('small', 'pfile-setting', part.system));
      info.appendChild(make('h4', null, 'Where it is'));
      info.appendChild(make('p', null, part.where));
      info.appendChild(make('h4', null, 'What it does'));
      info.appendChild(make('p', null, part.job));
    } else {
      info.appendChild(make('p', null, 'Choose a structure to see where it is and what it does.'));
    }
    box.appendChild(info);
  }

  // ----- Challenges -----
  function startChallenge(mode) {
    var d = findDiagram(state.diagramId);
    state.mode = mode;
    state.ids = shuffle(d.parts.map(function (p) { return p.id; }));
    state.index = 0;
    state.correct = 0;
    state.results = null;
    state.view = 'round';
    beginRound();
  }

  function beginRound() {
    var d = findDiagram(state.diagramId);
    var correctId = state.ids[state.index];
    state.answered = false;
    state.picked = null;

    var others = shuffle(d.parts.map(function (p) { return p.id; }).filter(function (id) {
      return id !== correctId;
    })).slice(0, 3);
    state.options = shuffle([correctId].concat(others));

    render();
    window.scrollTo(0, 0);
  }

  function choose(partId) {
    if (state.answered) { return; }
    state.answered = true;
    state.picked = partId;
    if (partId === state.ids[state.index]) { state.correct += 1; }
    render();
  }

  function nextRound() {
    state.index += 1;
    if (state.index >= state.ids.length) { finishChallenge(); }
    else { beginRound(); }
  }

  function finishChallenge() {
    var total = state.ids.length;
    var key = state.diagramId + '-' + state.mode;

    player.anatomyPlayed += 1;
    var oldBest = player.anatomyBest[key];
    if (oldBest === undefined || state.correct > oldBest) {
      player.anatomyBest[key] = state.correct;
    }

    var xp = state.correct * XP_PER_CORRECT + COMPLETE_BONUS;
    state.results = { correct: state.correct, total: total, xp: xp, levelUp: false };
    state.view = 'result';

    var levelledUp = addXP(xp);   // also saves the player
    state.results.levelUp = levelledUp;
    render();
    window.scrollTo(0, 0);
    levelToast(levelledUp, '');
  }

  function renderRound(box) {
    var d = findDiagram(state.diagramId);
    var cid = state.ids[state.index];
    var part = findPart(d, cid);
    if (!part) { backToMenu(); return; }
    var wasCorrect = state.picked === cid;

    var top = make('div', 'quiz-top');
    top.appendChild(make('span', null, MODES[state.mode].title + ' \u00B7 ' + (state.index + 1) + ' / ' + state.ids.length));
    top.appendChild(make('span', 'quiz-score', 'Correct: ' + state.correct));
    box.appendChild(top);

    // Question
    if (state.mode === 'tap') {
      box.appendChild(make('h2', 'quiz-q', 'Tap the ' + part.name + ' on the diagram.'));
    } else if (state.mode === 'name') {
      box.appendChild(make('h2', 'quiz-q', 'What is the highlighted structure?'));
    } else {
      box.appendChild(make('h2', 'quiz-q', 'Which structure does this describe?'));
      box.appendChild(make('div', 'update-card', part.job));
    }

    // Diagram
    var showDiagram = state.mode !== 'job' || state.answered;
    if (showDiagram) {
      var opts = { clickable: false };
      if (state.mode === 'tap') {
        opts.clickable = !state.answered;
        opts.onTap = choose;
        if (state.answered) {
          opts.correctId = cid;
          if (!wasCorrect) { opts.wrongId = state.picked; }
        }
      } else if (state.answered) {
        opts.correctId = cid;
      } else {
        opts.targetId = cid;
      }
      box.appendChild(buildSvg(d, opts));
      box.appendChild(make('p', 'source-note anat-note', d.note));
    }

    // Answer options (Name It and Function Match)
    if (state.mode !== 'tap') {
      state.options.forEach(function (id) {
        var optPart = findPart(d, id);
        var cls = 'opt';
        if (state.answered) {
          if (id === cid) { cls += ' correct'; }
          else if (id === state.picked) { cls += ' wrong'; }
        }
        var btn = make('button', cls, optPart.name);
        btn.disabled = state.answered;
        btn.addEventListener('click', function () { choose(id); });
        box.appendChild(btn);
      });
    }

    // Feedback
    if (state.answered) {
      var fb = make('div', 'feedback ' + (wasCorrect ? 'ok' : 'bad'));
      fb.appendChild(make('h3', null, wasCorrect ? 'Correct!' : 'Not quite.'));
      if (!wasCorrect) {
        var pickedPart = findPart(d, state.picked);
        if (state.mode === 'tap' && pickedPart) {
          fb.appendChild(make('p', 'fb-answer', 'You tapped the ' + pickedPart.name + '. The ' + part.name + ' is shown in green.'));
        } else {
          fb.appendChild(make('p', 'fb-answer', 'Correct answer: ' + part.name));
        }
      }
      fb.appendChild(make('p', null, part.name + ' (' + part.system + '). ' + part.where + ' ' + part.job));
      box.appendChild(fb);

      var isLast = state.index >= state.ids.length - 1;
      var next = make('button', 'btn-primary wide', isLast ? 'See results' : 'Next');
      next.addEventListener('click', nextRound);
      box.appendChild(next);
    }

    var quit = make('button', 'back-btn quit-btn', 'Leave challenge (no XP is earned)');
    quit.addEventListener('click', backToMenu);
    box.appendChild(quit);
  }

  function renderResult(box) {
    var r = state.results;
    if (!r) { backToMenu(); return; }
    var d = findDiagram(state.diagramId);

    var card = make('div', 'results-card');
    card.appendChild(make('p', 'results-label', MODES[state.mode].title + ': ' + d.title));
    card.appendChild(make('div', 'results-score', r.correct + ' / ' + r.total));
    card.appendChild(make('p', 'results-pct', 'correct'));
    var msg = r.correct === r.total ? 'Perfect score! Excellent anatomy knowledge!'
      : (r.correct >= r.total / 2 ? 'Good effort. Try Learn mode, then play again.'
      : 'Keep learning. Use Learn mode to explore each structure, then try again.');
    card.appendChild(make('p', 'results-msg', msg));
    box.appendChild(card);

    var xpCard = make('div', 'tip-card');
    xpCard.appendChild(make('p', null, 'You earned +' + r.xp + ' XP' + (r.levelUp ? ' and reached level ' + player.level + '!' : '.')));
    xpCard.appendChild(make('small', null, XP_PER_CORRECT + ' XP per correct answer, plus a completion bonus of ' + COMPLETE_BONUS + ' XP.'));
    box.appendChild(xpCard);

    var again = make('button', 'btn-primary wide', 'Play again');
    again.addEventListener('click', function () { startChallenge(state.mode); });
    box.appendChild(again);

    var back = make('button', 'btn-outline wide', 'Back to Anatomy menu');
    back.addEventListener('click', backToMenu);
    box.appendChild(back);
  }

  // ----- Menu -----
  function renderMenu(box) {
    var head = make('div', 'ac-head');
    head.appendChild(make('h2', null, 'Anatomy Challenge'));
    head.appendChild(make('p', null, 'Explore the body, then test yourself. Diagrams are simplified and not to scale.'));
    box.appendChild(head);

    var stats = make('div', 'stats-row two');
    [[player.anatomySeen.length + ' / ' + totalParts(), 'Structures explored'],
     [String(player.anatomyPlayed), 'Challenges played']].forEach(function (item) {
      var s = make('div', 'stat-box');
      s.appendChild(make('b', null, item[0]));
      s.appendChild(make('span', null, item[1]));
      stats.appendChild(s);
    });
    box.appendChild(stats);

    box.appendChild(make('h3', 'section-heading', 'Diagram'));
    var wrap = make('div', 'chips-wrap');
    ANATOMY.forEach(function (d) {
      var btn = make('button', 'chip-btn' + (d.id === state.diagramId ? ' selected' : ''), d.title);
      btn.addEventListener('click', function () { state.diagramId = d.id; render(); });
      wrap.appendChild(btn);
    });
    box.appendChild(wrap);

    var d = findDiagram(state.diagramId);
    box.appendChild(make('h3', 'section-heading', 'Choose an activity'));

    function modeCard(title, desc, tagText, tagClass, onClick) {
      var card = make('button', 'case-card');
      var info = make('div', 'case-info');
      info.appendChild(make('strong', null, title));
      info.appendChild(make('small', null, desc));
      card.appendChild(info);
      card.appendChild(make('span', tagClass, tagText));
      card.addEventListener('click', onClick);
      box.appendChild(card);
    }

    modeCard('Learn and explore', 'Tap structures to see where they are and what they do.', '+' + LEARN_XP + ' XP each', 'todo-tag', openLearn);

    ['tap', 'name', 'job'].forEach(function (mode) {
      var best = player.anatomyBest[d.id + '-' + mode];
      modeCard(MODES[mode].title, MODES[mode].desc,
        best !== undefined ? 'Best: ' + best + '/' + d.parts.length : 'New',
        best !== undefined ? 'done-tag' : 'todo-tag',
        function () { startChallenge(mode); });
    });

    box.appendChild(make('p', 'source-note', 'For education only. Use a full anatomy atlas or textbook for detailed study.'));
  }

  // ----- Draw the right screen -----
  function render() {
    var box = root();
    if (!box || typeof player === 'undefined' || typeof ANATOMY === 'undefined') { return; }
    box.innerHTML = '';
    if (state.view === 'learn') { renderLearn(box); }
    else if (state.view === 'round') { renderRound(box); }
    else if (state.view === 'result') { renderResult(box); }
    else { state.view = 'menu'; renderMenu(box); }
  }

  return { render: render };
})();
