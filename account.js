// HealthQuest - account.js (Phase 8)
// Login screen, account card and cloud sync.
// Uses window.HQCloud (cloud.js) and these items from game.js:
// player, defaultPlayer, savePlayer, updateAllUI, showToast, showScreen,
// openNameModal, closeNameModal, runDailyCheckIn.

var Account = (function () {

  var LS_LINKED = 'hq_linked_uid';   // which account this device's progress belongs to
  var LS_STAMP = 'hq_cloud_stamp';   // version of the cloud save we last synced with
  var LS_DIRTY = 'hq_dirty';         // "1" when this device has changes not yet uploaded
  var SAVE_DELAY = 2500;

  var state = {
    user: null,
    authKnown: false,
    ready: false,
    status: '',
    lastSynced: 0,
    applying: false,
    changes: 0
  };

  var pendingNickname = '';
  var saveTimer = null;
  var retryTimer = null;
  var dialogEl = null;

  var authMode = 'signin';
  var authForm = { nick: '', email: '', pw: '' };
  var authError = '';
  var authInfo = '';
  var authBusy = false;
  var fields = {};

  // ----- Small helpers -----
  function lsGet(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function lsSet(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ } }
  function lsRemove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } }

  function make(tag, className, text) {
    var node = document.createElement(tag);
    if (className) { node.className = className; }
    if (text !== undefined) { node.textContent = text; }
    return node;
  }

  function cloud() { return window.HQCloud || null; }

  function saveLocalQuietly() {
    state.applying = true;
    savePlayer();
    state.applying = false;
  }

  function friendlyError(err) {
    var code = err && err.code ? err.code : '';
    if (code === 'auth/invalid-email') { return 'That email address does not look right.'; }
    if (code === 'auth/email-already-in-use') { return 'An account with this email already exists. Try signing in instead.'; }
    if (code === 'auth/weak-password') { return 'Choose a password with at least 6 characters.'; }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'Wrong email or password.';
    }
    if (code === 'auth/too-many-requests') { return 'Too many attempts. Please wait a few minutes and try again.'; }
    if (code === 'auth/network-request-failed') { return 'No connection. Check your internet and try again.'; }
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') { return 'Google sign-in was cancelled.'; }
    if (code === 'auth/popup-blocked') { return 'Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.'; }
    if (code === 'auth/unauthorized-domain') { return 'This website address is not authorised for sign-in yet.'; }
    return 'Something went wrong. Please try again.';
  }

  // ----- Pop-up windows built in code -----
  function openDialog(build) {
    closeDialog();
    var overlay = make('div', 'modal');
    var box = make('div', 'modal-box');
    overlay.appendChild(box);
    build(box);
    document.body.appendChild(overlay);
    dialogEl = overlay;
  }

  function closeDialog() {
    if (dialogEl && dialogEl.parentNode) { dialogEl.parentNode.removeChild(dialogEl); }
    dialogEl = null;
  }

  // ----- Turning saved data back into a player -----
  function buildPlayerFrom(src) {
    var fresh = JSON.parse(JSON.stringify(defaultPlayer));
    if (src && typeof src === 'object') {
      for (var key in fresh) {
        if (src.hasOwnProperty(key) && typeof src[key] === typeof fresh[key]) { fresh[key] = src[key]; }
      }
    }
    ['activeDays', 'completedLessons', 'anatomySeen', 'badgesUnlocked'].forEach(function (k) {
      if (!Array.isArray(fresh[k])) { fresh[k] = []; }
    });
    ['scenarioBest', 'anatomyBest'].forEach(function (k) {
      if (!fresh[k] || typeof fresh[k] !== 'object' || Array.isArray(fresh[k])) { fresh[k] = {}; }
    });
    return fresh;
  }

  // "Trivial" means almost no progress yet (just the first daily bonus)
  function isTrivial(p) {
    if (!p) { return true; }
    return (p.totalXp || 0) <= 10 && !p.quizzes && !p.scenariosPlayed && !p.anatomyPlayed &&
      !p.dailyCompleted && (!p.completedLessons || p.completedLessons.length === 0) &&
      (!p.anatomySeen || p.anatomySeen.length === 0);
  }

  // ----- Cloud sync -----
  function uploadNow() {
    clearTimeout(saveTimer);
    var c = cloud();
    if (!c || !state.user || !state.ready) { return Promise.resolve(false); }

    var uid = state.user.uid;
    var startChanges = state.changes;
    var stamp = Date.now();
    var data = {
      name: player.name || '',
      progress: JSON.parse(JSON.stringify(player)),
      updatedAt: stamp
    };

    state.status = 'syncing';
    render();

    return c.save(uid, data).then(function () {
      lsSet(LS_STAMP, String(stamp));
      state.lastSynced = Date.now();
      state.status = 'ok';
      if (state.changes === startChanges) {
        lsSet(LS_DIRTY, '0');
      } else {
        clearTimeout(saveTimer);
        saveTimer = setTimeout(uploadNow, SAVE_DELAY);   // more changes happened meanwhile
      }
      render();
      return true;
    }).catch(function (err) {
      console.log('Cloud save failed:', err);
      state.status = 'fail';
      render();
      clearTimeout(retryTimer);
      retryTimer = setTimeout(function () {
        if (lsGet(LS_DIRTY) === '1') { uploadNow(); }
      }, 15000);
      return false;
    });
  }

  // Called by game.js every time progress is saved on the device
  function queueSync() {
    if (state.applying || !state.user || !state.ready) { return; }
    state.changes += 1;
    lsSet(LS_DIRTY, '1');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(uploadNow, SAVE_DELAY);
  }

  function finishLogin() {
    if (!player.name) { openNameModal(false, null); }
    render();
  }

  // Use the account's progress on this device
  function takeCloud(uid, data) {
    var fresh = buildPlayerFrom(data.progress);
    if (!fresh.name && data.name) { fresh.name = data.name; }
    player = fresh;
    saveLocalQuietly();

    lsSet(LS_LINKED, uid);
    lsSet(LS_STAMP, String(data.updatedAt || 0));
    lsSet(LS_DIRTY, '0');
    state.ready = true;
    state.status = 'ok';
    state.lastSynced = Date.now();

    if (player.name) { closeNameModal(); }
    runDailyCheckIn();
    updateAllUI();
    finishLogin();
  }

  // Use this device's progress and upload it to the account
  function keepLocal(uid) {
    if (pendingNickname) { player.name = pendingNickname; }
    pendingNickname = '';
    saveLocalQuietly();

    lsSet(LS_LINKED, uid);
    state.ready = true;
    state.changes += 1;
    lsSet(LS_DIRTY, '1');
    updateAllUI();
    uploadNow();
    finishLogin();
  }

  function askChoice(uid, data) {
    var cp = data.progress || {};
    openDialog(function (box) {
      box.appendChild(make('h2', null, 'Which progress do you want to keep?'));
      box.appendChild(make('p', null, 'We found progress on this device and in your account. Choose one. The other will be replaced.'));
      box.appendChild(make('p', 'choice-line', 'This device: Level ' + (player.level || 1) + ', ' + (player.totalXp || 0) + ' XP'));
      box.appendChild(make('p', 'choice-line', 'Your account: Level ' + (cp.level || 1) + ', ' + (cp.totalXp || 0) + ' XP'));

      var account = make('button', 'btn-primary wide', 'Keep my account progress');
      account.addEventListener('click', function () { closeDialog(); takeCloud(uid, data); });
      box.appendChild(account);

      var device = make('button', 'btn-outline wide', "Keep this device's progress");
      device.addEventListener('click', function () { closeDialog(); keepLocal(uid); });
      box.appendChild(device);
    });
  }

  function decide(uid, data) {
    var linked = lsGet(LS_LINKED) === uid;

    if (!data) {                       // brand new account: upload what this device has
      keepLocal(uid);
      return;
    }
    pendingNickname = '';
    var cloudProgress = data.progress || {};

    if (linked) {                      // this device already belongs to this account
      var localStamp = Number(lsGet(LS_STAMP) || 0);
      var dirty = lsGet(LS_DIRTY) === '1';
      var cloudStamp = Number(data.updatedAt || 0);

      if (cloudStamp === localStamp) {
        state.ready = true;
        state.status = 'ok';
        state.lastSynced = Date.now();
        if (dirty) { uploadNow(); }
        finishLogin();
      } else if (!dirty) {
        takeCloud(uid, data);          // another phone saved newer progress
      } else {
        askChoice(uid, data);          // both changed
      }
      return;
    }

    if (isTrivial(player)) { takeCloud(uid, data); return; }
    if (isTrivial(cloudProgress)) { keepLocal(uid); return; }
    if ((player.totalXp || 0) === (cloudProgress.totalXp || 0)) { takeCloud(uid, data); return; }
    askChoice(uid, data);
  }

  function syncDown(uid) {
    var c = cloud();
    if (!c) { return; }
    state.ready = false;
    state.status = 'syncing';
    render();
    c.load(uid).then(function (data) {
      decide(uid, data);
    }).catch(function (err) {
      console.log('Cloud load failed:', err);
      state.status = 'loadfail';
      render();
    });
  }

  function syncNow() {
    if (!state.user) { return; }
    if (!state.ready) { syncDown(state.user.uid); }
    else { lsSet(LS_DIRTY, '1'); state.changes += 1; uploadNow(); }
  }

  // ----- Signing out -----
  function doSignOut() {
    var needsUpload = state.ready && lsGet(LS_DIRTY) === '1';
    var before = needsUpload ? uploadNow() : Promise.resolve(true);

    before.then(function (ok) {
      if (!ok) {
        showToast('Could not save your latest progress. Check your connection and try again.');
        return null;
      }
      return cloud().signOut().then(function () {
        lsRemove(LS_LINKED);
        lsRemove(LS_STAMP);
        lsRemove(LS_DIRTY);
        state.user = null;
        state.ready = false;
        state.status = '';
        player = JSON.parse(JSON.stringify(defaultPlayer));
        saveLocalQuietly();
        updateAllUI();
        showScreen('home');
        openNameModal(false, runDailyCheckIn);
      });
    }).catch(function () {
      showToast('Could not sign out. Please try again.');
    });
  }

  function confirmSignOut() {
    openDialog(function (box) {
      box.appendChild(make('h2', null, 'Sign out?'));
      box.appendChild(make('p', null, 'Your progress is saved in your account. This device will be cleared so the next player starts fresh.'));
      var actions = make('div', 'modal-actions');
      var cancel = make('button', 'btn-outline', 'Cancel');
      cancel.addEventListener('click', closeDialog);
      var yes = make('button', 'btn-danger', 'Sign out');
      yes.addEventListener('click', function () { closeDialog(); doSignOut(); });
      actions.appendChild(cancel);
      actions.appendChild(yes);
      box.appendChild(actions);
    });
  }

  // ----- Sign-in window -----
  function makeInput(type, placeholder, autocomplete, value, maxLength) {
    var input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.setAttribute('autocomplete', autocomplete);
    input.value = value || '';
    input.className = 'auth-field';
    if (maxLength) { input.maxLength = maxLength; }
    return input;
  }

  function readFields() {
    if (fields.nick) { authForm.nick = fields.nick.value; }
    if (fields.email) { authForm.email = fields.email.value; }
    if (fields.pw) { authForm.pw = fields.pw.value; }
  }

  function submitAuth() {
    if (authBusy) { return; }
    readFields();
    var email = authForm.email.trim();
    var pw = authForm.pw;
    var nick = authForm.nick.trim();
    authInfo = '';

    if (authMode === 'signup' && nick.length < 2) {
      authError = 'Please choose a nickname with at least 2 characters.';
      renderAuth();
      return;
    }
    if (!email || !pw) {
      authError = 'Please enter your email and password.';
      renderAuth();
      return;
    }

    authError = '';
    authBusy = true;
    renderAuth();

    if (authMode === 'signup') { pendingNickname = nick; }
    var request = authMode === 'signup' ? cloud().signUp(email, pw) : cloud().signIn(email, pw);
    request.then(function () {
      authBusy = false;
      authForm.pw = '';
      closeDialog();
    }).catch(function (err) {
      authBusy = false;
      pendingNickname = '';
      authError = friendlyError(err);
      renderAuth();
    });
  }

  function googleSignIn() {
    if (authBusy) { return; }
    readFields();
    authError = '';
    authInfo = '';
    authBusy = true;
    renderAuth();
    cloud().google().then(function () {
      authBusy = false;
      closeDialog();
    }).catch(function (err) {
      authBusy = false;
      authError = friendlyError(err);
      renderAuth();
    });
  }

  function forgotPassword() {
    readFields();
    var email = authForm.email.trim();
    if (!email) {
      authError = 'Type your email above first, then tap "Forgot password?".';
      authInfo = '';
      renderAuth();
      return;
    }
    cloud().resetPassword(email).then(function () {
      authError = '';
      authInfo = 'Password reset email sent. Check your inbox and spam folder.';
      renderAuth();
    }).catch(function (err) {
      authInfo = '';
      authError = friendlyError(err);
      renderAuth();
    });
  }

  function renderAuth() {
    openDialog(function (box) {
      box.className = 'modal-box auth-box';
      box.appendChild(make('h2', null, authMode === 'signin' ? 'Sign in' : 'Create your account'));

      var tabs = make('div', 'chips-wrap auth-tabs');
      [['signin', 'Sign in'], ['signup', 'Create account']].forEach(function (t) {
        var b = make('button', 'chip-btn' + (authMode === t[0] ? ' selected' : ''), t[1]);
        b.addEventListener('click', function () {
          readFields();
          authMode = t[0];
          authError = '';
          authInfo = '';
          renderAuth();
        });
        tabs.appendChild(b);
      });
      box.appendChild(tabs);

      fields = {};
      if (authMode === 'signup') {
        fields.nick = makeInput('text', 'Nickname (shown on the leaderboard)', 'nickname', authForm.nick, 20);
        box.appendChild(fields.nick);
      }
      fields.email = makeInput('email', 'Email address', 'email', authForm.email);
      box.appendChild(fields.email);
      fields.pw = makeInput('password', 'Password (at least 6 characters)',
        authMode === 'signup' ? 'new-password' : 'current-password', authForm.pw);
      fields.pw.addEventListener('keydown', function (e) { if (e.key === 'Enter') { submitAuth(); } });
      box.appendChild(fields.pw);

      if (authError) { box.appendChild(make('p', 'auth-error', authError)); }
      if (authInfo) { box.appendChild(make('p', 'auth-info', authInfo)); }

      var submit = make('button', 'btn-primary wide',
        authBusy ? 'Please wait...' : (authMode === 'signin' ? 'Sign in' : 'Create account'));
      submit.disabled = authBusy;
      submit.addEventListener('click', submitAuth);
      box.appendChild(submit);

      if (authMode === 'signin') {
        var forgot = make('button', 'link-btn', 'Forgot password?');
        forgot.addEventListener('click', forgotPassword);
        box.appendChild(forgot);
      }

      box.appendChild(make('p', 'auth-or', 'or'));

      var google = make('button', 'btn-outline wide', 'Continue with Google');
      google.disabled = authBusy;
      google.addEventListener('click', googleSignIn);
      box.appendChild(google);

      var later = make('button', 'link-btn auth-later', 'Not now, continue as guest');
      later.addEventListener('click', closeDialog);
      box.appendChild(later);

      box.appendChild(make('p', 'auth-note',
        'We store your email and nickname so your progress is saved. Your nickname will be shown on the leaderboard. Do not use your real full name.'));
    });
  }

  function openAuth(mode) {
    if (!cloud()) { showToast('Online accounts are not available right now.'); return; }
    authMode = mode || 'signin';
    authError = '';
    authInfo = '';
    authBusy = false;
    renderAuth();
  }

  // ----- Cards on the screen -----
  function statusText() {
    if (state.status === 'syncing') { return 'Saving...'; }
    if (state.status === 'ok') {
      var time = state.lastSynced
        ? new Date(state.lastSynced).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
      return 'Progress is saved to your account' + (time ? ' (' + time + ')' : '') + '.';
    }
    if (state.status === 'fail') { return 'Could not save yet. We will try again.'; }
    if (state.status === 'loadfail') { return 'Could not load your account data. Check your connection and tap Sync now.'; }
    return '';
  }

  function renderCard() {
    var box = document.getElementById('accountCard');
    if (!box) { return; }
    box.innerHTML = '';
    var card = make('div', 'acct-card');

    if (!cloud()) {
      card.appendChild(make('p', null, 'Online accounts are not available right now. You can keep playing as a guest, and your progress stays on this device.'));
    } else if (!state.authKnown) {
      card.appendChild(make('p', null, 'Checking your account...'));
    } else if (!state.user) {
      card.appendChild(make('p', null, 'You are playing as a guest. Your progress is saved only on this device.'));
      var actions = make('div', 'acct-actions');
      var signIn = make('button', 'btn-primary btn-sm', 'Sign in or create account');
      signIn.addEventListener('click', function () { openAuth('signin'); });
      actions.appendChild(signIn);
      card.appendChild(actions);
    } else {
      card.appendChild(make('p', null, 'Signed in as ' + (state.user.email || 'your account')));
      card.appendChild(make('p', 'acct-status', statusText()));
      var row = make('div', 'acct-actions');
      var sync = make('button', 'btn-outline btn-sm', 'Sync now');
      sync.addEventListener('click', syncNow);
      var out = make('button', 'btn-danger btn-sm', 'Sign out');
      out.addEventListener('click', confirmSignOut);
      row.appendChild(sync);
      row.appendChild(out);
      card.appendChild(row);
    }
    box.appendChild(card);
  }

  function renderBanner() {
    var box = document.getElementById('accountBanner');
    if (!box) { return; }
    box.innerHTML = '';
    if (!cloud() || !state.authKnown || state.user) { return; }

    var card = make('div', 'acct-card acct-banner');
    card.appendChild(make('p', null, 'Playing as a guest. Create a free account to keep your progress on any phone.'));
    var actions = make('div', 'acct-actions');
    var btn = make('button', 'btn-primary btn-sm', 'Sign in or create account');
    btn.addEventListener('click', function () { openAuth('signup'); });
    actions.appendChild(btn);
    card.appendChild(actions);
    box.appendChild(card);
  }

  function render() {
    if (typeof player === 'undefined') { return; }
    renderCard();
    renderBanner();
  }

  // ----- Events from cloud.js -----
  function onAuth(e) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(function () { onAuth(e); }, 0);
      });
      return;
    }
    var user = e.detail.user;
    state.authKnown = true;
    state.user = user;
    state.ready = false;
    render();
    if (user) { syncDown(user.uid); }
  }

  window.addEventListener('hq-auth', onAuth);
  window.addEventListener('hq-cloud-ready', function () {
    if (document.readyState !== 'loading') { render(); }
  });
  window.addEventListener('online', function () {
    if (state.user && state.ready && lsGet(LS_DIRTY) === '1') { uploadNow(); }
  });

  return { render: render, queueSync: queueSync };
})();
