// DOM 元素
const moonPhaseElement = document.getElementById('moon-phase');
const userProfileForm = document.getElementById('user-profile-form');
const zodiacSignElement = document.getElementById('zodiac-sign');
const birthdayElement = document.getElementById('birthday');

// 初始化应用
async function initApp() {
    try {
        // 加载月相数据
        const moonPhase = getMoonPhase();
        updateMoonPhaseDisplay(moonPhase);

        // 加载用户资料
        const userProfile = await getUserProfile();
        updateUserProfileDisplay(userProfile);
    } catch (error) {
        console.error('Error initializing app:', error);
    }
}

// 更新月相显示
function updateMoonPhaseDisplay(moonPhase) {
    if (moonPhaseElement) {
        moonPhaseElement.innerHTML = `
            <div class="moon-phase-info">
                <h3>当前月相</h3>
                <p>${moonPhase.phase}</p>
                <p>月龄：${moonPhase.age}</p>
                <p>亮度：${moonPhase.illumination}</p>
                <p>可见时间：${moonPhase.visibility}</p>
            </div>
        `;
    }
}

// 更新用户资料显示
function updateUserProfileDisplay(profile) {
    if (zodiacSignElement) {
        zodiacSignElement.textContent = profile.zodiac || '未设置';
    }
    if (birthdayElement) {
        birthdayElement.textContent = profile.birthday || '未设置';
    }
}

// 处理用户资料表单提交
if (userProfileForm) {
    userProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(userProfileForm);
        const userData = {
            birthday: formData.get('birthday'),
            zodiac: formData.get('zodiac')
        };

        try {
            await updateUserProfile(userData);
            alert('用户资料更新成功！');
        } catch (error) {
            console.error('Error updating user profile:', error);
            alert('更新失败，请重试');
        }
    });
}

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp); 