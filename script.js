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
  const now = new Date();
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
  return `${dt.getFullYear()}년 ${dt.getMonth()+1}월 ${dt.getDate()}일`;
}

// ===== 이번달 챙겨야 할 것 (개월수 기반) =====
function getThisMonthTasks(months) {
  const tasks = {
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

  // 가장 가까운 월령 찾기
  const keys = Object.keys(tasks).map(Number).sort((a,b) => a-b);
  let matched = keys[0];
  for (const k of keys) {
    if (months >= k) matched = k;
  }
  return tasks[matched] || ['📋 현재 개월수에 맞는 정보를 확인해보세요'];
}

// ===== 탭 전환 =====
function switchTab(type) {
  document.getElementById('panel-baby').classList.toggle('hidden', type !== 'baby');
  document.getElementById('panel-pregnant').classList.toggle('hidden', type !== 'pregnant');
  document.getElementById('tab-btn-baby').classList.toggle('active', type === 'baby');
  document.getElementById('tab-btn-pregnant').classList.toggle('active', type === 'pregnant');
}

// ===== 성별 선택 =====
let selectedGender = '';
function selectGender(g) {
  selectedGender = g;
  document.getElementById('btn-boy').classList.toggle('selected', g === 'boy');
  document.getElementById('btn-girl').classList.toggle('selected', g === 'girl');
}

// ===== 아이 정보 저장 =====
function saveBabyInfo() {
  const birth = document.getElementById('baby-birth').value;
  if (!birth) { showToast('아이 생년월일을 입력해주세요 🍼'); return; }
  const name = document.getElementById('baby-name').value.trim() || '우리아이';
  localStorage.setItem(K.TYPE, 'baby');
  localStorage.setItem(K.BABY_NAME, name);
  localStorage.setItem(K.BABY_BIRTH, birth);
  localStorage.setItem(K.BABY_GENDER, selectedGender);
  showDashboard();
}

// ===== 임신 정보 저장 =====
function savePregnantInfo() {
  const due = document.getElementById('due-date').value;
  if (!due) { showToast('출산 예정일을 입력해주세요 🤰'); return; }
  const momName = document.getElementById('mom-name').value.trim() || '예비맘';
  const dadContact = document.getElementById('dad-contact').value.trim();
  localStorage.setItem(K.TYPE, 'pregnant');
  localStorage.setItem(K.MOM_NAME, momName);
  localStorage.setItem(K.DUE_DATE, due);
  localStorage.setItem(K.DAD_CONTACT, dadContact);
  window.location.href = 'dday.html';
}

// ===== 대시보드 표시 =====
function showDashboard() {
  const type = localStorage.getItem(K.TYPE);
  if (!type) return;

  const onboarding = document.getElementById('view-onboarding');
  const dashboard  = document.getElementById('view-dashboard');
  if (!onboarding || !dashboard) return;

  if (type === 'baby') {
    const name   = localStorage.getItem(K.BABY_NAME) || '우리아이';
    const birth  = localStorage.getItem(K.BABY_BIRTH);
    const gender = localStorage.getItem(K.BABY_GENDER);
    const months = calcMonths(birth);
    const gIcon  = gender === 'boy' ? ' 👦' : gender === 'girl' ? ' 👧' : '';

    document.getElementById('dash-name').textContent   = name + gIcon;
    document.getElementById('dash-months').textContent = `현재 ${months}개월 (${fmtDate(birth)})`;

    // 이번 달 할 것
    const tasks = getThisMonthTasks(months);
    const listEl = document.getElementById('this-month-list');
    if (listEl) {
      listEl.innerHTML = tasks.map(t =>
        `<div class="this-month-item">${t}</div>`
      ).join('');
    }

    onboarding.classList.add('hidden');
    dashboard.classList.remove('hidden');

  } else if (type === 'pregnant') {
    window.location.href = 'dday.html';
  }
}

// ===== 정보 초기화 =====
function resetInfo() {
  Object.values(K).forEach(k => localStorage.removeItem(k));
  const onboarding = document.getElementById('view-onboarding');
  const dashboard  = document.getElementById('view-dashboard');
  if (onboarding) onboarding.classList.remove('hidden');
  if (dashboard)  dashboard.classList.add('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== 카카오톡 공유 =====
function shareKakao() {
  const url = 'https://suksuki.com';
  if (window.Kakao?.isInitialized?.()) {
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
  const url = location.origin || 'https://suksuki.com';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => showToast('링크가 복사됐어요! 🔗'));
  } else {
    const el = document.createElement('textarea');
    el.value = url;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('링크가 복사됐어요! 🔗');
  }
}

// ===== 토스트 메시지 =====
function showToast(msg, duration = 2500) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.add('hidden'), duration);
}

// ===== 인스타 D-day 카드 생성 & 공유 =====
function shareInstagram(dday, name) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080; canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // 배경
  const grad = ctx.createLinearGradient(0, 0, 1080, 1080);
  grad.addColorStop(0, '#1A3C34');
  grad.addColorStop(1, '#2C7A6F');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1080);

  // 장식 원
  ctx.beginPath(); ctx.arc(950, 150, 320, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
  ctx.beginPath(); ctx.arc(100, 950, 200, 0, Math.PI*2);
  ctx.fillStyle = 'rgba(244,162,97,0.1)'; ctx.fill();

  // 로고
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌱 쑥쑥이', 540, 280);

  // D-day 숫자
  ctx.fillStyle = '#F4A261';
  ctx.font = 'bold 200px sans-serif';
  ctx.fillText(`D-${dday}`, 540, 560);

  // 이름
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText(`${name || '우리 아이'} 출산까지`, 540, 660);

  // 날짜
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '36px sans-serif';
  ctx.fillText(new Date().toLocaleDateString('ko-KR'), 540, 740);

  // URL
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '28px sans-serif';
  ctx.fillText('suksuki.com', 540, 900);

  // 다운로드
  const link = document.createElement('a');
  link.download = `suksuki_dday_${dday}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  // 모바일이면 인스타 앱 열기 시도
  if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
    setTimeout(() => { window.location.href = 'instagram://'; }, 800);
  }
  showToast('이미지 저장됐어요! 인스타에 올려주세요 📸', 3000);
}

// ===== 페이지 공유 버튼 (각 페이지에서 사용) =====
function shareCurrentPage(title, desc) {
  if (navigator.share) {
    navigator.share({
      title: title || '쑥쑥이',
      text: desc || '우리 아이 성장 파트너 쑥쑥이',
      url: location.href,
    }).catch(() => copyLink());
  } else {
    copyLink();
  }
}

// ===== 전역 노출 =====
window.suksuki = { calcMonths, calcDday, fmtDate, getThisMonthTasks, showToast, shareInstagram, shareCurrentPage, shareKakao, copyLink, K };

// ===== 페이지 로드 =====
document.addEventListener('DOMContentLoaded', () => {
  // 날짜 입력 범위 설정
  const today = new Date().toISOString().split('T')[0];
  const babyBirth = document.getElementById('baby-birth');
  const dueDate   = document.getElementById('due-date');
  if (babyBirth) babyBirth.max = today;
  if (dueDate)   dueDate.min   = today;

  // 저장된 정보 있으면 대시보드 표시
  if (localStorage.getItem(K.TYPE)) showDashboard();
});
