// 육아 가이드 페이지 로직
document.addEventListener('DOMContentLoaded', () => {
    setupTabs('trimester-tabs', 'pregnancy');
    setupTabs('age-tabs', 'baby');
});

/**
 * 탭 전환 설정
 * @param {string} tabContainerClass 탭 버튼들을 포함하는 컨테이너 클래스
 * @param {string} sectionId 해당 섹션 ID
 */
function setupTabs(tabContainerClass, sectionId) {
    const container = document.querySelector(`#${sectionId} .${tabContainerClass}`);
    if (!container) return;

    const buttons = container.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll(`#${sectionId} .tab-content`);

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab');

            // 버튼 활성화 상태 변경
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 콘텐츠 전환
            contents.forEach(content => {
                if (content.id === targetId) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });
        });
    });
}
