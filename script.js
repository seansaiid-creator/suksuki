// ===== 로컬스토리지 키 =====
const KEYS = {
  TYPE: 'suksuki_type',        // 'baby' or 'pregnant'
  BABY_NAME: 'suksuki_baby_name',
  BABY_BIRTH: 'suksuki_baby_birth',
  BABY_GENDER: 'suksuki_baby_gender',
  MOM_NAME: 'suksuki_mom_name',
  DUE_DATE: 'suksuki_due_date',
  DAD_CONTACT: 'suksuki_dad_contact',
};

// ===== 페이지 로드 시 =====
document.addEventListener('DOMContentLoaded', () => {
  // 날짜 입력 최대/최소값 설정
  const today = new Date().toISOString().split('T')[0];
  const babyBirthInput = document.getElementById('baby-birth');
  const dueDateInput = document.getElementById('due-date');
  if (babyBirthInput) babyBirthInput.max = today;
  if (dueDateInput) dueDateInput.min = today;

  // 저장된 정보 불러오기
  loadSavedInfo();
});

// ===== 탭 전환 =====
function switchTab(type, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + type).classList.add('active');
}

// ===== 성별 선택 =====
let selectedGender = '';

function selectGender(gender) {
  selectedGender = gender;
  document.getElementById('btn-boy').classList.remove('selected');
  document.getElementById('btn-girl').classList.remove('selected');
  document.getElementById('btn-' + gender).classList.add('selected');
}

// ===== 아이 정보 저장 =====
function saveBabyInfo() {
  const name = document.getElementById('baby-name').value.trim();
  const birth = document.getElementById('baby-birth').value;

  if (!birth) {
    alert('아이 생년월일을 입력해주세요 🍼');
    return;
  }

  localStorage.setItem(KEYS.TYPE, 'baby');
  localStorage.setItem(KEYS.BABY_NAME, name || '우리아이');
  localStorage.setItem(KEYS.BABY_BIRTH, birth);
  localStorage.setItem(KEYS.BABY_GENDER, selectedGender);

  showCurrentInfo();
  scrollToCurrentInfo();
}

// ===== 임신 정보 저장 =====
function savePregnantInfo() {
  const momName = document.getElementById('mom-name').value.trim();
  const dueDate = document.getElementById('due-date').value;
  const dadContact = document.getElementById('dad-contact').value.trim();

  if (!dueDate) {
    alert('출산 예정일을 입력해주세요 🤰');
    return;
  }

  localStorage.setItem(KEYS.TYPE, 'pregnant');
  localStorage.setItem(KEYS.MOM_NAME, momName || '예비맘');
  localStorage.setItem(KEYS.DUE_DATE, dueDate);
  localStorage.setItem(KEYS.DAD_CONTACT, dadContact);

  // D-day 페이지로 이동
  window.location.href = 'dday.html';
}

// ===== 저장된 정보 불러오기 =====
function loadSavedInfo() {
  const type = localStorage.getItem(KEYS.TYPE);
  if (!type) return;

  showCurrentInfo();
}

// ===== 현재 아이 정보 표시 =====
function showCurrentInfo() {
  const type = localStorage.getItem(KEYS.TYPE);
  const currentSection = document.getElementById('current-info');
  const setupSection = document.getElementById('setup');

  if (!currentSection) return;

  if (type === 'baby') {
    const name = localStorage.getItem(KEYS.BABY_NAME) || '우리아이';
    const birth = localStorage.getItem(KEYS.BABY_BIRTH);
    const months = calcMonths(birth);

    document.getElementById('display-name').textContent = name;
    document.getElementById('display-months').textContent =
      `현재 ${months}개월 (${formatBirth(birth)})`;

    currentSection.style.display = 'block';
    if (setupSection) setupSection.style.display = 'none';

  } else if (type === 'pregnant') {
    const momName = localStorage.getItem(KEYS.MOM_NAME) || '예비맘';
    const dueDate = localStorage.getItem(KEYS.DUE_DATE);
    const dday = calcDday(dueDate);

    document.getElementById('display-name').textContent = momName;
    document.getElementById('display-months').textContent =
      `출산 D-${dday} (${formatBirth(dueDate)})`;

    currentSection.style.display = 'block';
    if (setupSection) setupSection.style.display = 'none';
  }
}

// ===== 정보 수정 =====
function editInfo() {
  localStorage.removeItem(KEYS.TYPE);
  localStorage.removeItem(KEYS.BABY_NAME);
  localStorage.removeItem(KEYS.BABY_BIRTH);
  localStorage.removeItem(KEYS.BABY_GENDER);
  localStorage.removeItem(KEYS.MOM_NAME);
  localStorage.removeItem(KEYS.DUE_DATE);
  localStorage.removeItem(KEYS.DAD_CONTACT);

  document.getElementById('current-info').style.display = 'none';
  document.getElementById('setup').style.display = 'block';
  scrollToSetup();
}

// ===== 개월수 계산 =====
function calcMonths(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12
    + (now.getMonth() - birth.getMonth());
  return Math.max(0, months);
}

// ===== D-day 계산 =====
function calcDday(dueDate) {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const now = new Date();
  const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

// ===== 날짜 포맷 =====
function formatBirth(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일`;
}

// ===== 스크롤 =====
function scrollToSetup() {
  document.getElementById('setup')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function scrollToCurrentInfo() {
  document.getElementById('current-info')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== 카카오톡 공유 =====
function shareKakao() {
  const url = encodeURIComponent(window.location.origin);
  const text = encodeURIComponent('임신부터 취학 전까지 육아 정보를 한 곳에서! 쑥쑥이 🌱');

  // 카카오톡 SDK가 있으면 사용, 없으면 URL 복사로 대체
  if (window.Kakao && window.Kakao.isInitialized()) {
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '쑥쑥이 - 우리 아이 성장 파트너',
        description: '임신부터 취학 전까지, 예방접종·발달정보·이유식·지원금을 한 곳에서!',
        imageUrl: 'https://suksuki.com/images/og-image.png',
        link: { mobileWebUrl: 'https://suksuki.com', webUrl: 'https://suksuki.com' },
      },
      buttons: [{
        title: '쑥쑥이 보러가기',
        link: { mobileWebUrl: 'https://suksuki.com', webUrl: 'https://suksuki.com' },
      }],
    });
  } else {
    // 카카오 SDK 없으면 링크 복사
    copyLink();
    alert('링크가 복사됐어요! 카카오톡에서 붙여넣기 해주세요 💬');
  }
}

// ===== 링크 복사 =====
function copyLink() {
  const url = window.location.origin || 'https://suksuki.com';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('링크가 복사됐어요! 🔗');
    });
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
function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    background: #1E293B; color: #fff; padding: 12px 24px;
    border-radius: 100px; font-size: 14px; font-weight: 600;
    z-index: 9999; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    animation: fadeInUp 0.3s ease;
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateX(-50%) translateY(10px); }
      to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===== 인스타그램 공유용 D-day 카드 이미지 생성 =====
function generateDdayCard(dday, name) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  // 배경
  const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
  gradient.addColorStop(0, '#1A3C34');
  gradient.addColorStop(1, '#2C7A6F');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 1080);

  // 원형 장식
  ctx.beginPath();
  ctx.arc(900, 200, 300, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.fill();

  // 텍스트
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = 'bold 40px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌱 쑥쑥이', 540, 300);

  ctx.fillStyle = '#F4A261';
  ctx.font = 'bold 80px sans-serif';
  ctx.fillText(`D - ${dday}`, 540, 480);

  ctx.fillStyle = '#fff';
  ctx.font = 'bold 50px sans-serif';
  ctx.fillText(`${name || '우리 아이'} 출산까지`, 540, 580);

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '32px sans-serif';
  ctx.fillText('suksuki.com', 540, 800);

  return canvas.toDataURL('image/png');
}

// ===== 인스타그램 공유 =====
function shareInstagram(dday, name) {
  const imageData = generateDdayCard(dday, name);

  // 이미지 다운로드
  const link = document.createElement('a');
  link.download = `suksuki_dday_${dday}.png`;
  link.href = imageData;
  link.click();

  // 인스타 앱 열기 (모바일)
  setTimeout(() => {
    window.location.href = 'instagram://';
  }, 1000);

  showToast('이미지 저장됐어요! 인스타에 올려주세요 📸');
}

// ===== 전역에서 사용할 유틸 =====
window.suksuki = {
  calcMonths,
  calcDday,
  formatBirth,
  KEYS,
  showToast,
  shareInstagram,
  shareKakao,
  copyLink,
};
