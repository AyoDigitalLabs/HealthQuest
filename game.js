// HealthQuest - game.js (Phase 2)

var STORAGE_KEY = 'healthquest_player';
var DAILY_BONUS_XP = 10;

// ----- Default player data -----
var defaultPlayer = {
  name: '',
  level: 1,
  xp: 0,
  xpToNext: 100,
  totalXp: 0,
  streak: 0,
  bestStreak: 0,
  lastVisit: '',
  activeDays: [],
  quizzes: 0,
  badges: 0,
  completedLessons: [],
  quizBest: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  scenariosPlayed: 0,
  scenarioBest: {}
};

var player = JSON.parse(JSON.stringify(defaultPlayer));

// Health tips (general public-health education)
var tips = [
  'Washing hands with soap and clean water helps prevent diarrhoea and many respiratory infections.',
  'Sleeping under an insecticide-treated net helps protect against malaria.',
  'Exclusive breastfeeding is recommended for the first six months of a baby\'s life.',
  'Oral rehydration solution (ORS) replaces the water and salts lost during diarrhoea.',
  'Regular blood pressure checks help detect hypertension early, often before symptoms appear.',
  'Safe drinking water and proper sanitation reduce the spread of cholera and typhoid.',
  'Routine childhood immunisation protects children from serious diseases such as measles and polio.',
  'Attending antenatal care visits helps keep mothers and babies healthy during pregnancy.'
];

// ----- Saving and loading -----
function loadPlayer() {
  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) { return; }
    var data = JSON.parse(saved);
    if (!data || typeof data !== 'object') { return; }
    for (var key in defaultPlayer) {
      if (data.hasOwnProperty(key) && typeof data[key] === typeof defaultPlayer[key]) {
        player[key] = data[key];
      }
    }
    if (!Array.isArray(player.activeDays)) { player.activeDays = []; }
    if (!Array.isArray(player.completedLessons)) { player.completedLessons = []; }
    if (!player.scenarioBest || typeof player.scenarioBest !== 'object') { player.scenarioBest = {}; }
  } catch (e) {
    console.log('Could not load saved data:', e);
  }
}

function savePlayer() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  } catch (e) {
    console.log('Could not save data:', e);
  }
}

// ----- Date helpers -----
function dateString(d) {
  var m = d.getMonth() + 1;
  var day = d.getDate();
  return d.getFullYear() + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
}

function daysAgo(n) {
  var d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ----- XP and levels -----
function xpNeeded(level) {
  return 100 + (level - 1) * 50;
}

// Adds XP and returns true if the player levelled up
function addXP(amount) {
  var levelledUp = false;
  player.xp += amount;
  player.totalXp += amount;
  while (player.xp >= player.xpToNext) {
    player.xp -= player.xpToNext;
    player.level += 1;
    player.xpToNext = xpNeeded(player.level);
    levelledUp = true;
  }
  savePlayer();
  updateAllUI();
  return levelledUp;
}

// ----- Toast message -----
var toastTimer = null;
function showToast(message) {
  var toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove('show');
  }, 2600);
}

// ----- Updating the screen -----
function updateTopBar() {
  document.getElementById('levelChip').textContent = 'Lv ' + player.level;
  document.getElementById('streakChip').textContent = 'Streak: ' + player.streak;
  document.getElementById('xpText').textContent = player.xp + ' / ' + player.xpToNext + ' XP';
  var percent = Math.min(100, (player.xp / player.xpToNext) * 100);
  document.getElementById('xpFill').style.width = percent + '%';
}

function updateWeekStrip() {
  var strip = document.getElementById('weekStrip');
  strip.innerHTML = '';
  var letters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  var count = 0;

  for (var i = 6; i >= 0; i--) {
    var d = daysAgo(i);
    var isActive = player.activeDays.indexOf(dateString(d)) !== -1;
    if (isActive) { count++; }

    var day = document.createElement('div');
    day.className = 'week-day' + (isActive ? ' active' : '') + (i === 0 ? ' today' : '');

    var dot = document.createElement('div');
    dot.className = 'week-dot';
    dot.textContent = isActive ? '\u2713' : '';

    var label = document.createElement('span');
    label.textContent = letters[d.getDay()];

    day.appendChild(dot);
    day.appendChild(label);
    strip.appendChild(day);
  }

  document.getElementById('weekNote').textContent =
    'You were active on ' + count + ' of the last 7 days.';
}

function updateDashboard() {
  var greet = document.getElementById('greetText');
  if (player.name) {
    greet.textContent = 'Welcome back, ' + player.name;
  } else {
    greet.textContent = 'Welcome, Future Healthcare Hero';
  }

  document.getElementById('statTotalXp').textContent = player.totalXp;
  document.getElementById('statBestStreak').textContent = player.bestStreak;
  document.getElementById('statQuizzes').textContent = player.quizzes;

  var tipIndex = Math.floor(Date.now() / 86400000) % tips.length;
  document.getElementById('tipText').textContent = tips[tipIndex];

  updateWeekStrip();
}

function updateProfile() {
  var name = player.name ? player.name : 'Player';
  document.getElementById('profName').textContent = name;
  document.getElementById('profAvatar').textContent = name.charAt(0).toUpperCase();
  document.getElementById('profLevel').textContent = 'Level ' + player.level;
  document.getElementById('profXp').textContent = player.totalXp;
  document.getElementById('profStreak').textContent = player.streak;
  document.getElementById('profBadges').textContent = player.badges;
}

function updateAllUI() {
  updateTopBar();
  updateDashboard();
  updateProfile();
  if (window.Academy) { Academy.render(); }
  if (window.Quiz) { Quiz.render(); }
  if (window.Simulator) { Simulator.render(); }
}

// ----- Screen switching -----
function showScreen(name) {
  var screens = document.querySelectorAll('.screen');
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.remove('active');
  }
  var target = document.getElementById('screen-' + name);
  if (target) { target.classList.add('active'); }

  var buttons = document.querySelectorAll('.nav-btn');
  for (var j = 0; j < buttons.length; j++) {
    var isActive = buttons[j].getAttribute('data-screen') === name;
    buttons[j].classList.toggle('active', isActive);
  }
  window.scrollTo(0, 0);
}

// ----- Name popup -----
var nameCallback = null;

function openNameModal(isEditing, callback) {
  nameCallback = callback || null;
  var modal = document.getElementById('nameModal');
  var input = document.getElementById('nameInput');
  document.getElementById('modalTitle').textContent =
    isEditing ? 'Change your player name' : 'Choose your player name';
  document.getElementById('nameCancel').classList.toggle('hidden', !isEditing);
  input.value = isEditing ? player.name : '';
  modal.classList.remove('hidden');
  setTimeout(function () { input.focus(); }, 100);
}

function closeNameModal() {
  document.getElementById('nameModal').classList.add('hidden');
}

function saveName() {
  var input = document.getElementById('nameInput');
  var value = input.value.trim();
  if (value.length < 2) {
    showToast('Please enter at least 2 characters.');
    return;
  }
  player.name = value;
  savePlayer();
  updateAllUI();
  closeNameModal();
  if (nameCallback) {
    var cb = nameCallback;
    nameCallback = null;
    cb();
  }
}

// ----- Daily check-in (streak + bonus XP) -----
function runDailyCheckIn() {
  var today = dateString(new Date());
  var status = document.getElementById('dailyStatus');

  if (player.lastVisit === today) {
    status.textContent = 'Daily bonus claimed today. Come back tomorrow to keep your streak.';
    return;
  }

  var yesterday = dateString(daysAgo(1));
  if (player.lastVisit === yesterday) {
    player.streak += 1;
  } else {
    player.streak = 1;
  }
  if (player.streak > player.bestStreak) { player.bestStreak = player.streak; }

  player.lastVisit = today;
  if (player.activeDays.indexOf(today) === -1) { player.activeDays.push(today); }
  if (player.activeDays.length > 30) { player.activeDays = player.activeDays.slice(-30); }

  var levelledUp = addXP(DAILY_BONUS_XP);
  status.textContent = 'Daily bonus: +' + DAILY_BONUS_XP + ' XP claimed. Streak: ' + player.streak + ' day(s).';

  if (levelledUp) {
    showToast('Level up! You are now level ' + player.level + '.');
  } else {
    showToast('Daily bonus: +' + DAILY_BONUS_XP + ' XP. Streak: ' + player.streak + '.');
  }
}

// ----- Start the app -----
function startApp() {
  loadPlayer();
  updateAllUI();

  // Bottom navigation
  var navButtons = document.querySelectorAll('.nav-btn');
  for (var i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener('click', function () {
      showScreen(this.getAttribute('data-screen'));
    });
  }

  // Cards and buttons that show a "coming soon" message
  var msgItems = document.querySelectorAll('[data-msg]');
  for (var k = 0; k < msgItems.length; k++) {
    msgItems[k].addEventListener('click', function () {
      showToast(this.getAttribute('data-msg'));
    });
  }

  // Name popup buttons
  document.getElementById('nameSave').addEventListener('click', saveName);
  document.getElementById('nameCancel').addEventListener('click', closeNameModal);
  document.getElementById('nameInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { saveName(); }
  });

  // Profile buttons
  document.getElementById('editNameBtn').addEventListener('click', function () {
    openNameModal(true, null);
  });

  document.getElementById('testXpBtn').addEventListener('click', function () {
    var levelledUp = addXP(40);
    if (levelledUp) {
      showToast('Level up! You are now level ' + player.level + '.');
    } else {
      showToast('+40 XP added.');
    }
  });

  // Reset button opens our own confirmation popup
  document.getElementById('resetBtn').addEventListener('click', function () {
    document.getElementById('resetModal').classList.remove('hidden');
  });

  document.getElementById('resetCancel').addEventListener('click', function () {
    document.getElementById('resetModal').classList.add('hidden');
  });

  document.getElementById('resetConfirm').addEventListener('click', function () {
    document.getElementById('resetModal').classList.add('hidden');
    player = JSON.parse(JSON.stringify(defaultPlayer));
    savePlayer();
    updateAllUI();
    document.getElementById('dailyStatus').textContent = '';
    showScreen('home');
    openNameModal(false, runDailyCheckIn);
  });

  // Hide the splash screen after 2.2 seconds, then start the dashboard
  setTimeout(function () {
    var splash = document.getElementById('splash');
    var app = document.getElementById('app');
    app.classList.remove('hidden');
    splash.classList.add('fade-out');
    setTimeout(function () { splash.style.display = 'none'; }, 500);

    if (!player.name) {
      openNameModal(false, runDailyCheckIn);
    } else {
      runDailyCheckIn();
    }
  }, 2200);
}

document.addEventListener('DOMContentLoaded', startApp);