// HealthQuest - academy.js (Phase 3)
// Shows the Health Academy. Uses data from academy-data.js
// and the player, addXP, savePlayer and showToast functions from game.js.

var Academy = (function () {

  var LESSON_XP = 20;
  var state = { view: 'categories', catId: null, lessonId: null };

  function root() { return document.getElementById('academyRoot'); }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function findCategory(id) {
    for (var i = 0; i < ACADEMY.length; i++) {
      if (ACADEMY[i].id === id) { return ACADEMY[i]; }
    }
    return null;
  }

  function findLesson(cat, id) {
    for (var i = 0; i < cat.lessons.length; i++) {
      if (cat.lessons[i].id === id) { return cat.lessons[i]; }
    }
    return null;
  }

  function isDone(lessonId) {
    return player.completedLessons.indexOf(lessonId) !== -1;
  }

  function countDone(cat) {
    var n = 0;
    for (var i = 0; i < cat.lessons.length; i++) {
      if (isDone(cat.lessons[i].id)) { n++; }
    }
    return n;
  }

  function progressBar(done, total) {
    var bar = make('div', 'mini-bar');
    var fill = make('div', 'mini-fill');
    fill.style.width = (total ? (done / total) * 100 : 0) + '%';
    bar.appendChild(fill);
    return bar;
  }

  function go(view, catId, lessonId) {
    state.view = view;
    state.catId = catId || null;
    state.lessonId = lessonId || null;
    render();
    window.scrollTo(0, 0);
  }

  // ----- View 1: list of topics -----
  function renderCategories(box) {
    var totalAll = 0;
    var doneAll = 0;
    for (var i = 0; i < ACADEMY.length; i++) {
      totalAll += ACADEMY[i].lessons.length;
      doneAll += countDone(ACADEMY[i]);
    }

    var head = make('div', 'ac-head');
    head.appendChild(make('h2', null, 'Health Academy'));
    head.appendChild(make('p', null, 'Short lessons for healthcare students and practitioners. Complete a lesson to earn ' + LESSON_XP + ' XP.'));
    head.appendChild(progressBar(doneAll, totalAll));
    head.appendChild(make('small', null, doneAll + ' of ' + totalAll + ' lessons completed'));
    box.appendChild(head);

    ACADEMY.forEach(function (cat) {
      var card = make('button', 'cat-card');
      card.appendChild(make('span', 'cat-icon', cat.icon));

      var info = make('div', 'cat-info');
      info.appendChild(make('strong', null, cat.title));
      info.appendChild(make('small', null, cat.blurb));
      info.appendChild(progressBar(countDone(cat), cat.lessons.length));
      info.appendChild(make('small', 'cat-count', countDone(cat) + ' / ' + cat.lessons.length + ' lessons'));
      card.appendChild(info);

      card.addEventListener('click', function () { go('lessons', cat.id); });
      box.appendChild(card);
    });
  }

  // ----- View 2: lessons in one topic -----
  function renderLessons(box) {
    var cat = findCategory(state.catId);
    if (!cat) { go('categories'); return; }

    var back = make('button', 'back-btn', '\u2190 All topics');
    back.addEventListener('click', function () { go('categories'); });
    box.appendChild(back);

    var head = make('div', 'ac-head');
    head.appendChild(make('h2', null, cat.title));
    head.appendChild(make('p', null, cat.blurb));
    box.appendChild(head);

    cat.lessons.forEach(function (lesson) {
      var row = make('button', 'lesson-row');
      var info = make('div', 'lesson-row-info');
      info.appendChild(make('strong', null, lesson.title));
      info.appendChild(make('small', null, lesson.minutes + ' min read'));
      row.appendChild(info);
      row.appendChild(make('span', isDone(lesson.id) ? 'done-tag' : 'todo-tag', isDone(lesson.id) ? 'Completed' : '+' + LESSON_XP + ' XP'));
      row.addEventListener('click', function () { go('lesson', cat.id, lesson.id); });
      box.appendChild(row);
    });
  }

  // ----- View 3: reading a lesson -----
  function renderLesson(box) {
    var cat = findCategory(state.catId);
    var lesson = cat ? findLesson(cat, state.lessonId) : null;
    if (!cat || !lesson) { go('categories'); return; }

    var back = make('button', 'back-btn', '\u2190 ' + cat.title);
    back.addEventListener('click', function () { go('lessons', cat.id); });
    box.appendChild(back);

    box.appendChild(make('h2', 'lesson-title', lesson.title));
    box.appendChild(make('p', 'lesson-meta', lesson.minutes + ' min read'));

    var body = make('div', 'lesson-body');
    lesson.paragraphs.forEach(function (text) {
      body.appendChild(make('p', null, text));
    });
    box.appendChild(body);

    var pointsCard = make('div', 'points-card');
    pointsCard.appendChild(make('h3', null, 'Key points'));
    var list = make('ul');
    lesson.points.forEach(function (text) {
      list.appendChild(make('li', null, text));
    });
    pointsCard.appendChild(list);
    box.appendChild(pointsCard);

    box.appendChild(make('p', 'source-note', 'Source: ' + lesson.source));
    box.appendChild(make('p', 'source-note', 'For education only. This is not a guide for diagnosing or treating real patients.'));

    var btn = make('button', 'wide');
    if (isDone(lesson.id)) {
      btn.className = 'btn-outline wide';
      btn.textContent = 'Completed';
      btn.disabled = true;
    } else {
      btn.className = 'btn-primary wide';
      btn.textContent = 'Mark as complete (+' + LESSON_XP + ' XP)';
      btn.addEventListener('click', function () { completeLesson(lesson.id); });
    }
    box.appendChild(btn);
  }

  function completeLesson(lessonId) {
    if (isDone(lessonId)) { return; }
    player.completedLessons.push(lessonId);
    savePlayer();
    var levelledUp = addXP(LESSON_XP);
    if (levelledUp) {
      showToast('Lesson complete! Level up: you are now level ' + player.level + '.');
    } else {
      showToast('Lesson complete! +' + LESSON_XP + ' XP');
    }
  }

  // ----- Draw the right view -----
  function render() {
    var box = root();
    if (!box || typeof player === 'undefined') { return; }
    box.innerHTML = '';
    if (state.view === 'lessons') { renderLessons(box); }
    else if (state.view === 'lesson') { renderLesson(box); }
    else { renderCategories(box); }
  }

  // Lets any button with data-go="screenname" open that screen
  function init() {
    var links = document.querySelectorAll('[data-go]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        go('categories');
        showScreen(this.getAttribute('data-go'));
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return { render: render };
})();