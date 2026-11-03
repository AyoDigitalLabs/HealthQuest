// HealthQuest - achievements.js (Phase 7)
// Badges are checked after every XP gain. Uses player, addXP, savePlayer, showToast (game.js).

var Achievements = (function () {

  var BONUS_XP = 15;
  var checking = false;

  function totalLessons() {
    var n = 0;
    ACADEMY.forEach(function (c) { n += c.lessons.length; });
    return n;
  }

  function totalParts() {
    var n = 0;
    ANATOMY.forEach(function (d) { n += d.parts.length; });
    return n;
  }

  // Each badge has a test that returns true when it should be unlocked.
  var LIST = [
    { id: 'start', icon: 'GO', name: 'Getting Started', desc: 'Earn your first 10 XP.',
      test: function (p) { return p.totalXp >= 10; } },
    { id: 'lesson1', icon: 'L', name: 'First Lesson', desc: 'Complete 1 Academy lesson.',
      test: function (p) { return p.completedLessons.length >= 1; } },
    { id: 'lesson5', icon: 'L5', name: 'Dedicated Student', desc: 'Complete 5 Academy lessons.',
      test: function (p) { return p.completedLessons.length >= 5; } },
    { id: 'lessonAll', icon: '\u2605', name: 'Academy Graduate', desc: 'Complete every Academy lesson.',
      test: function (p) { return p.completedLessons.length >= totalLessons(); } },
    { id: 'quiz1', icon: 'Q', name: 'Quiz Starter', desc: 'Finish a quiz.',
      test: function (p) { return p.quizzes >= 1; } },
    { id: 'quiz5', icon: 'Q5', name: 'Quiz Regular', desc: 'Finish 5 quizzes.',
      test: function (p) { return p.quizzes >= 5; } },
    { id: 'quizPerfect', icon: '100', name: 'Perfect Score', desc: 'Score 100% in a quiz.',
      test: function (p) { return p.quizBest >= 100; } },
    { id: 'case1', icon: 'C', name: 'First Patient', desc: 'Finish a Patient Simulator case.',
      test: function (p) { return p.scenariosPlayed >= 1; } },
    { id: 'emergency', icon: 'ER', name: 'Emergency Responder', desc: 'Finish an Emergency Room case.',
      test: function (p) {
        return p.scenarioBest['sc-bleeding'] !== undefined || p.scenarioBest['sc-cpr'] !== undefined;
      } },
    { id: 'anat8', icon: 'A', name: 'Anatomy Explorer', desc: 'Explore 8 body structures.',
      test: function (p) { return p.anatomySeen.length >= 8; } },
    { id: 'anatAll', icon: '\u2605', name: 'Anatomy Master', desc: 'Explore every body structure.',
      test: function (p) { return p.anatomySeen.length >= totalParts(); } },
    { id: 'streak3', icon: 'S3', name: 'On a Roll', desc: 'Reach a 3-day streak.',
      test: function (p) { return p.bestStreak >= 3; } },
    { id: 'streak7', icon: 'S7', name: 'Week Warrior', desc: 'Reach a 7-day streak.',
      test: function (p) { return p.bestStreak >= 7; } },
    { id: 'lvl5', icon: 'Lv5', name: 'Rising Star', desc: 'Reach level 5.',
      test: function (p) { return p.level >= 5; } },
    { id: 'lvl10', icon: 'Lv10', name: 'Seasoned Pro', desc: 'Reach level 10.',
      test: function (p) { return p.level >= 10; } },
    { id: 'daily1', icon: 'D', name: 'Daily Challenger', desc: 'Complete a Daily Challenge.',
      test: function (p) { return p.dailyCompleted >= 1; } },
    { id: 'daily7', icon: 'D7', name: 'Daily Devotee', desc: 'Complete 7 Daily Challenges.',
      test: function (p) { return p.dailyCompleted >= 7; } }
  ];

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  // Looks for newly earned badges and rewards them
  function check() {
    if (checking || typeof player === 'undefined') { return; }
    checking = true;

    var unlocked = [];
    var changed = true;
    var guard = 0;

    while (changed && guard < 10) {
      changed = false;
      guard += 1;
      LIST.forEach(function (b) {
        if (player.badgesUnlocked.indexOf(b.id) === -1 && b.test(player)) {
          player.badgesUnlocked.push(b.id);
          unlocked.push(b);
          changed = true;
          addXP(BONUS_XP);   // the "checking" flag stops this from re-running the check
        }
      });
    }

    player.badges = player.badgesUnlocked.length;
    savePlayer();
    checking = false;

    if (unlocked.length > 0) {
      var names = unlocked.map(function (b) { return b.name; }).join(', ');
      var xp = unlocked.length * BONUS_XP;
      // Wait so the previous message can be read first
      setTimeout(function () {
        showToast('Badge unlocked: ' + names + ' (+' + xp + ' XP)');
      }, 2800);
    }
  }

  function render() {
    var box = document.getElementById('achRoot');
    if (!box || typeof player === 'undefined') { return; }
    box.innerHTML = '';

    box.appendChild(make('p', 'sim-note',
      player.badgesUnlocked.length + ' of ' + LIST.length + ' badges unlocked. Each badge earns +' + BONUS_XP + ' XP.'));

    var grid = make('div', 'ach-grid');
    LIST.forEach(function (b) {
      var got = player.badgesUnlocked.indexOf(b.id) !== -1;
      var item = make('div', 'ach-item' + (got ? ' got' : ''));
      item.appendChild(make('div', 'ach-icon', got ? b.icon : '?'));
      item.appendChild(make('strong', null, b.name));
      item.appendChild(make('small', null, b.desc));
      grid.appendChild(item);
    });
    box.appendChild(grid);
  }

  return { check: check, render: render };
})();
