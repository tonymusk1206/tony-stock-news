let mockData = null; // Global data object received from python backend

document.addEventListener("DOMContentLoaded", () => {
    updateTime();
    fetchMarketData();
});

async function fetchMarketData() {
    const mainContent = document.querySelector('.main-content');
    const originalContent = mainContent.innerHTML;
    
    // 로딩 UI 표시
    mainContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: white;">
            <div class="pulse-dot" style="width: 50px; height: 50px; box-shadow: 0 0 20px var(--accent-brand); background: var(--accent-brand); animation-duration: 1.5s; margin-bottom: 2rem;"></div>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);">통합 실시간 시장 데이터 로딩 중</h2>
            <p style="color: var(--text-secondary); margin-top: 10px;">Yahoo Finance 실시간 서버와 통신 중입니다. (최대 10초 소요 가능)</p>
        </div>
    `;
    
    try {
        const res = await fetch('/api/market-data');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        
        mockData = await res.json();
        
        if (mockData.error) throw new Error(mockData.error);
        
        // 원본 UI 레이아웃 복원
        mainContent.innerHTML = originalContent;
        
        // 컴포넌트 데이터 렌더링
        renderMarkets();
        renderSectors();
        renderCompanies();
        renderNews();
        renderQuotes();
        renderYoutube();
        
        document.getElementById('base-date-display').innerText = '상태: 백엔드 연결 확인됨';
    } catch (err) {
        console.error(err);
        mainContent.innerHTML = `
            <div style="padding: 3rem; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; border-radius: 16px; text-align: center; color: #fca5a5;">
                <h2 style="margin-bottom: 1rem;">백엔드 데이터 통신 실패</h2>
                <p>파이썬 서버(app.py)가 5000번 포트에서 가동 중인지 확인해 주세요. <br>상세 오류: ${err.message}</p>
            </div>
        `;
    }
}

function updateTime() {
    const timeDisplay = document.getElementById('time-display');
    if (!timeDisplay) return;

    setInterval(() => {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('ko-KR');
    }, 1000);
}
