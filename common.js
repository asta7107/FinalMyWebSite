// common.js - localStorage 기반 통합 상태 관리 및 공통 헤더/토스트 렌더링
const STORAGE_KEY = 'CAO_APP_STATE_V1';

const defaultState = {
    user: null, // { email, studentId, nickname, favCategory }
    dutchHistory: [], // { title, total, count, perPerson, date }
    gameStats: {
        rpsWin: 0,
        rpsDraw: 0,
        rpsLose: 0,
        bbWins: 0,
        bestReaction: null
    },
    favFoods: ['학식당 돈까스킹', '정문 앞 마라탕후루'],
    reviews: [
        { store: '학식당 돈까스킹', rating: 5, text: '공강 30분 컷 가능! 왕돈까스 가성비 최고입니다.', author: '23학번 컴공생', date: '2026-11-20' },
        { store: '정문 앞 마라탕후루', rating: 5, text: '조모임 끝나고 친구들이랑 꿔바로우 추가하면 딱이에요.', author: '맛집탐방러', date: '2026-11-21' },
        { store: '밤샘 카페 아지트', rating: 4, text: '콘센트 자리 많고 아메리카노 리필 할인돼서 시험기간 성지!', author: '카페인중독', date: '2026-11-22' }
    ],
    inquiries: []
};

function getAppState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
            return JSON.parse(JSON.stringify(defaultState));
        }
        return { ...defaultState, ...JSON.parse(raw) };
    } catch (e) {
        return JSON.parse(JSON.stringify(defaultState));
    }
}

function saveAppState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 2600);
}

function logoutUser() {
    const state = getAppState();
    state.user = null;
    saveAppState(state);
    showToast('로그아웃 되었습니다.');
    setTimeout(() => {
        location.href = 'index.html';
    }, 600);
}

function renderLayout(activePage) {
    const state = getAppState();
    const headerEl = document.getElementById('app-header');
    if (headerEl) {
        const authHtml = state.user
            ? `<span class="user-badge">🎓 ${state.user.nickname} (${state.user.studentId})</span>
               <button class="auth-btn" onclick="logoutUser()">로그아웃</button>`
            : `<a href="login.html" class="auth-btn">로그인</a>
               <a href="signup.html" class="auth-btn accent">회원가입</a>`;

        headerEl.innerHTML = `
            <a href="index.html" class="logo">🎓 CAO <span>Campus All In One</span></a>
            <nav>
                <a href="index.html" class="${activePage === 'index' ? 'active' : ''}">1. 홈 / 브리핑</a>
                <a href="tools.html" class="${activePage === 'tools' ? 'active' : ''}">2. 펀 & 정산 툴</a>
                <a href="games.html" class="${activePage === 'games' ? 'active' : ''}">3. 미니게임 존</a>
                <a href="food.html" class="${activePage === 'food' ? 'active' : ''}">4. 캠퍼스 맛집 & 리뷰</a>
                <a href="mypage.html" class="${activePage === 'mypage' ? 'active' : ''}">5. 마이페이지</a>
                <a href="cs.html" class="${activePage === 'cs' ? 'active' : ''}">6. 고객센터</a>
            </nav>
            <div class="auth-area">${authHtml}</div>
        `;
    }

    const footerEl = document.getElementById('app-footer');
    if (footerEl) {
        footerEl.innerHTML = `
            <p><strong>CAO (Campus All In One)</strong> | 대학생 공강·정산·캠퍼스 라이프 통합 플랫폼</p>
            <p style="margin-top:4px;">Designed & Coded by 2335035 진우성 | All Rights Reserved.</p>
        `;
    }
}
