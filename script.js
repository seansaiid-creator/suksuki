/* ===== 쑥쑥이 공통 스크립트 ===== */

const K = {
  TYPE:       'sk_type',
  BABY_NAME:  'sk_baby_name',
  BABY_BIRTH: 'sk_baby_birth',
  BABY_GENDER:'sk_baby_gender',
  MOM_NAME:   'sk_mom_name',
  DUE_DATE:   'sk_due_date',
  DAD_CONTACT:'sk_dad_contact',
};

// ===== 개월수 계산 =====
function calcMonths(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const now   = new Date();
  const m = (now.getFullYear() - birth.getFullYear()) * 12
           + (now.getMonth() - birth.getMonth());
  return Math.max(0, m);
}

// ===== D-day 계산 =====
function calcDday(dueDate) {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0,0,0,0);
  due.setHours(0,0,0,0);
  return Math.max(0, Math.round((due - now) / 86400000));
}

// ===== 날짜 포맷 =====
function fmtDate(d) {
  if (!d) return '';
  const dt = new Date(d);
  return dt.getFullYear() + '년 ' + (dt.getMonth()+1) + '월 ' + dt.getDate() + '일';
}

// ===== 이번달 챙겨야 할 것 =====
function getThisMonthTasks(months) {
  var tasks = {
    0:  ['💉 B형간염 1차 접종', '🏥 신생아 청각선별검사', '👁️ 신생아 안과검진'],
    1:  ['💉 BCG 접종 (4주 이내)', '💉 B형간염 2차 접종', '🏥 1개월 영유아 검진'],
    2:  ['💉 DTaP 1차 / 폴리오 1차 / Hib 1차', '💉 PCV 1차 (폐렴구균)', '💉 로타바이러스 1차'],
    4:  ['💉 DTaP 2차 / 폴리오 2차 / Hib 2차', '💉 PCV 2차', '💉 로타바이러스 2차'],
    6:  ['💉 DTaP 3차 / Hib 3차 / PCV 3차', '💉 B형간염 3차 접종', '💉 인플루엔자 접종 (10월~)'],
    9:  ['🏥 9개월 영유아 검진', '📏 성장 발달 확인 (기기/잡고서기)'],
    12: ['💉 MMR 1차 / 수두 접종', '💉 일본뇌염 1차', '🏥 12개월 영유아 검진', '🍽️ 이유식→유아식 전환 시작'],
    15: ['💉 DTaP 4차 / Hib 4차 / PCV 4차', '💉 A형간염 1차', '🏥 18개월 전 영유아 검진'],
    18: ['🏥 18개월 영유아 검진', '🗣️ 단어 10개 이상 말하는지 확인', '💉 A형간염 2차 (6개월 후)'],
    24: ['🏥 24개월 영유아 검진', '🗣️ 두 단어 문장 사용 확인', '🦷 치과 첫 방문 권장'],
    36: ['🏥 36개월 영유아 검진', '💉 일본뇌염 추가', '🧠 인지발달 & 사회성 체크'],
    48: ['🏥 48개월 영유아 검진', '👁️ 시력검사 권장', '🦷 치과 정기검진'],
    54: ['💉 DTaP 5차 / 폴리오 4차', '💉 MMR 2차', '🏥 54개월 영유아 검진'],
    60: ['🏥 60개월 영유아 검진', '🎒 초등학교 입학 준비 시작', '💉 취학 전 예방접종 확인'],
  };
  var keys = Object.keys(tasks).map(Number).sort(function(a,b){ return a-b; });
  var matched = keys[0];
  for (var i=0; i<keys.length; i++) { if (months >= keys[i]) matched = keys[i]; }
  return tasks[matched] || ['📋 현재 개월수에 맞는 정보를 확인해보세요'];
}

// ===== 탭 전환 =====
function switchTab(type) {
  var panelBaby     = document.getElementById('panel-baby');
  var panelPregnant = document.getElementById('panel-pregnant');
  var tabBaby       = document.getElementById('tab-btn-baby');
  var tabPregnant   = document.getElementById('tab-btn-pregnant');
  if (panelBaby)     panelBaby.classList.toggle('hidden', type !== 'baby');
  if (panelPregnant) panelPregnant.classList.toggle('hidden', type !== 'pregnant');
  if (tabBaby)       tabBaby.classList.toggle('active', type === 'baby');
  if (tabPregnant)   tabPregnant.classList.toggle('active', type === 'pregnant');
}

// ===== 성별 선택 =====
var selectedGender = '';
function selectGender(g) {
  selectedGender = g;
  var boy  = document.getElementById('btn-boy');
  var girl = document.getElementById('btn-girl');
  if (boy)  boy.classList.toggle('selected', g === 'boy');
  if (girl) girl.classList.toggle('selected', g === 'girl');
}

// ===== 아이 정보 저장 =====
function saveBabyInfo() {
  var birthEl = document.getElementById('baby-birth');
  var nameEl  = document.getElementById('baby-name');
  if (!birthEl || !birthEl.value) { showToast('아이 생년월일을 입력해주세요 🍼'); return; }
  localStorage.setItem(K.TYPE, 'baby');
  localStorage.setItem(K.BABY_NAME, (nameEl && nameEl.value.trim()) || '우리아이');
  localStorage.setItem(K.BABY_BIRTH, birthEl.value);
  localStorage.setItem(K.BABY_GENDER, selectedGender);
  showDashboard();
}

// ===== 임신 정보 저장 =====
function savePregnantInfo() {
  var dueEl = document.getElementById('due-date');
  var momEl = document.getElementById('mom-name');
  var dadEl = document.getElementById('dad-contact');
  if (!dueEl || !dueEl.value) { showToast('출산 예정일을 입력해주세요 🤰'); return; }
  localStorage.setItem(K.TYPE, 'pregnant');
  localStorage.setItem(K.MOM_NAME, (momEl && momEl.value.trim()) || '예비맘');
  localStorage.setItem(K.DUE_DATE, dueEl.value);
  localStorage.setItem(K.DAD_CONTACT, (dadEl && dadEl.value.trim()) || '');
  window.location.href = 'dday.html';
}

// ===== 대시보드 표시 =====
function showDashboard() {
  var type = localStorage.getItem(K.TYPE);
  if (!type) return;

  var onboarding = document.getElementById('view-onboarding');
  var dashboard  = document.getElementById('view-dashboard');
  if (!onboarding || !dashboard) return;

  if (type === 'baby') {
    var name   = localStorage.getItem(K.BABY_NAME) || '우리아이';
    var birth  = localStorage.getItem(K.BABY_BIRTH);
    var gender = localStorage.getItem(K.BABY_GENDER);
    var months = calcMonths(birth);
    var gIcon  = gender === 'boy' ? ' 👦' : gender === 'girl' ? ' 👧' : '';

    var dashName   = document.getElementById('dash-name');
    var dashMonths = document.getElementById('dash-months');
    if (dashName)   dashName.textContent   = name + gIcon;
    if (dashMonths) dashMonths.textContent = '현재 ' + months + '개월 (' + fmtDate(birth) + ')';

    var tasks  = getThisMonthTasks(months);
    var listEl = document.getElementById('this-month-list');
    if (listEl) {
      listEl.innerHTML = tasks.map(function(t) {
        return '<div class="this-month-item">' + t + '</div>';
      }).join('');
    }
    onboarding.classList.add('hidden');
    dashboard.classList.remove('hidden');

  } else if (type === 'pregnant') {
    var momName = localStorage.getItem(K.MOM_NAME) || '예비맘';
    var dueDate = localStorage.getItem(K.DUE_DATE);
    var dday    = calcDday(dueDate);

    // D-day 히어로 표시
    var ddayHero = document.getElementById('dday-hero-home');
    var ddayNum  = document.getElementById('dday-home-number');
    var ddayDate = document.getElementById('dday-home-date');
    var ddayWeek = document.getElementById('dday-home-week');
    if (ddayHero) ddayHero.classList.remove('hidden');
    if (ddayNum)  ddayNum.textContent  = 'D-' + dday;
    if (ddayDate) ddayDate.textContent = fmtDate(dueDate) + ' 출산 예정';

    // 임신 주수 계산 (40주 기준)
    var daysLeft    = dday;
    var daysElapsed = 280 - daysLeft;
    var week        = Math.max(1, Math.min(40, Math.floor(daysElapsed / 7)));
    if (ddayWeek) ddayWeek.textContent = '임신 ' + week + '주차';

    // 카드는 엄마 이름으로 표시
    var dashLabel = document.getElementById('dash-label');
    var dashName2   = document.getElementById('dash-name');
    var dashMonths2 = document.getElementById('dash-months');
    if (dashLabel)  dashLabel.textContent  = '예비맘';
    if (dashName2)   dashName2.textContent   = momName + ' 🤰';
    if (dashMonths2) dashMonths2.textContent = '출산 D-' + dday + ' (' + fmtDate(dueDate) + ')';

    var listEl2 = document.getElementById('this-month-list');
    if (listEl2) {
      var pregTasks = [
        '💉 출생 후 예방접종 미리 보기',
        '💰 임신 중 받을 수 있는 지원금 확인',
        '🍳 출생 후 이유식 레시피 미리 보기',
      ];
      listEl2.innerHTML = pregTasks.map(function(t) {
        return '<div class="this-month-item">' + t + '</div>';
      }).join('');
    }
    onboarding.classList.add('hidden');
    dashboard.classList.remove('hidden');
  }
}

// ===== 정보 수정 (기존값 채워서 폼으로 복귀) =====
function resetInfo() {
  var type       = localStorage.getItem(K.TYPE);
  var babyName   = localStorage.getItem(K.BABY_NAME);
  var babyBirth  = localStorage.getItem(K.BABY_BIRTH);
  var babyGender = localStorage.getItem(K.BABY_GENDER);
  var momName    = localStorage.getItem(K.MOM_NAME);
  var dueDate    = localStorage.getItem(K.DUE_DATE);
  var dadContact = localStorage.getItem(K.DAD_CONTACT);

  Object.values(K).forEach(function(k) { localStorage.removeItem(k); });

  var onboarding = document.getElementById('view-onboarding');
  var dashboard  = document.getElementById('view-dashboard');
  if (onboarding) onboarding.classList.remove('hidden');
  if (dashboard)  dashboard.classList.add('hidden');

  setTimeout(function() {
    if (type === 'baby') {
      switchTab('baby');
      var nameEl  = document.getElementById('baby-name');
      var birthEl = document.getElementById('baby-birth');
      if (nameEl  && babyName && babyName !== '우리아이') nameEl.value  = babyName;
      if (birthEl && babyBirth) birthEl.value = babyBirth;
      if (babyGender) selectGender(babyGender);
    } else if (type === 'pregnant') {
      switchTab('pregnant');
      var momEl = document.getElementById('mom-name');
      var dueEl = document.getElementById('due-date');
      var dadEl = document.getElementById('dad-contact');
      if (momEl && momName && momName !== '예비맘') momEl.value = momName;
      if (dueEl && dueDate)    dueEl.value = dueDate;
      if (dadEl && dadContact) dadEl.value = dadContact;
    }
  }, 100);

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 카카오톡 공유 =====
function shareKakao() {
  var url = 'https://suksuki.com';
  if (window.Kakao && window.Kakao.isInitialized && window.Kakao.isInitialized()) {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '쑥쑥이 - 우리 아이 성장 파트너',
        description: '임신부터 취학 전까지, 예방접종·발달정보·이유식·지원금을 한 곳에서!',
        imageUrl: url + '/images/og-image.png',
        link: { mobileWebUrl: url, webUrl: url },
      },
      buttons: [{ title: '쑥쑥이 보러가기', link: { mobileWebUrl: url, webUrl: url } }],
    });
  } else {
    copyLink();
    showToast('링크 복사됐어요! 카카오톡에 붙여넣기 해주세요 💬');
  }
}

// ===== 링크 복사 =====
function copyLink() {
  var url = location.origin || 'https://suksuki.com';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function() { showToast('링크가 복사됐어요! 🔗'); });
  } else {
    var el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('링크가 복사됐어요! 🔗');
  }
}

// ===== 토스트 메시지 =====
function showToast(msg, duration) {
  duration = duration || 2500;
  var el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._timer);
  el._timer = setTimeout(function() { el.classList.add('hidden'); }, duration);
}

// ===== 인스타 D-day 카드 생성 & 공유 =====
function shareInstagram(dday, name) {
  try {
    var canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1080;
    var ctx = canvas.getContext('2d');
    var grad = ctx.createLinearGradient(0, 0, 1080, 1080);
    grad.addColorStop(0, '#1A3C34');
    grad.addColorStop(1, '#2C7A6F');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.beginPath(); ctx.arc(950, 150, 320, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = 'bold 44px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('쑥쑥이 suksuki.com', 540, 280);
    ctx.fillStyle = '#F4A261';
    ctx.font = 'bold 200px sans-serif';
    ctx.fillText('D-' + dday, 540, 560);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText((name || '우리 아이') + ' 출산까지', 540, 660);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '36px sans-serif';
    ctx.fillText(new Date().toLocaleDateString('ko-KR'), 540, 740);
    var link = document.createElement('a');
    link.download = 'suksuki_dday_' + dday + '.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
      setTimeout(function() { window.location.href = 'instagram://'; }, 800);
    }
    showToast('이미지 저장됐어요! 다운로드 폴더에서 확인하세요 📸', 3500);
  } catch(e) {
    showToast('이미지 생성 중 오류가 발생했어요 😢');
  }
}

// ===== 페이지 공유 =====
function shareCurrentPage(title, desc) {
  if (navigator.share) {
    navigator.share({
      title: title || '쑥쑥이',
      text:  desc  || '우리 아이 성장 파트너 쑥쑥이',
      url:   location.href,
    }).catch(function() { copyLink(); });
  } else {
    copyLink();
  }
}

// ===== 카카오 인앱브라우저 → 외부 브라우저 이동 =====
// suksuki.com 에서만 동작. 개발/미리보기 환경에서는 실행 안 함
function _openExternalBrowser() {
  try {
    var ua = navigator.userAgent.toLowerCase();
    var isKakao = ua.indexOf('kakaotalk') > -1;
    var host = location.hostname;
    var isSuksukiDomain = host === 'suksuki.com' || host === 'www.suksuki.com';

    if (!isKakao || !isSuksukiDomain) return;

    var currentUrl = location.href;

    if (ua.indexOf('android') > -1) {
      // 안드로이드: 크롬으로 열기 시도, 실패시 기본 브라우저
      var intentUrl = 'intent://' + currentUrl.replace(/^https?:\/\//i, '')
        + '#Intent;scheme=https;action=android.intent.action.VIEW;'
        + 'category=android.intent.category.BROWSABLE;package=com.android.chrome;end';
      location.href = intentUrl;
    } else if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
      // iOS: safari로 열기
      location.href = currentUrl.replace(/^https?:\/\//i, 'safari-https://');
    }
  } catch(e) { /* 무시 */ }
}

// ===== window.suksuki 전역 객체 =====
window.suksuki = {
  K: K,
  calcMonths: calcMonths,
  calcDday: calcDday,
  fmtDate: fmtDate,
  getThisMonthTasks: getThisMonthTasks,
  showToast: showToast,
  shareInstagram: shareInstagram,
  shareCurrentPage: shareCurrentPage,
  shareKakao: shareKakao,
  copyLink: copyLink,
};

// ===== 페이지 초기화 =====
function _suksukiInit() {
  try {
    // 카카오 인앱브라우저 체크 (suksuki.com 에서만)
    _openExternalBrowser();

    var today    = new Date().toISOString().split('T')[0];
    var babyBirth = document.getElementById('baby-birth');
    var dueDate   = document.getElementById('due-date');
    if (babyBirth) babyBirth.max = today;
    if (dueDate)   dueDate.min   = today;
    if (localStorage.getItem(K.TYPE)) showDashboard();
  } catch(e) { /* 무시 */ }
}

// DOM 준비되면 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _suksukiInit);
} else {
  _suksukiInit();
}
