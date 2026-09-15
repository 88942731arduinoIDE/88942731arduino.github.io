let previousFollowers = null;
let increaseCount = 0;
let history = [];
let isFirstLoad = true;

// 時刻を更新
function updateTime() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('ja-JP');
    document.getElementById('currentTime').textContent = timeStr;
}

// Scratchのフォロワー数を取得
async function fetchFollowers() {
    try {
        // 直接 JSONP を使ってアクセス（CORSなし）
        const username = '88942731arduinoIDE';
        const apiUrl = `https://api.scratch.mit.edu/users/${username}`;
        
        // 1. allorigins（JSON形式で返してくれる）
        try {
            const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(apiUrl)}`);
            if (response.ok) {
                const text = await response.text();
                const data = JSON.parse(text);
                if (data.followers !== undefined) {
                    console.log('✅ フォロワー数取得成功:', data.followers);
                    return data.followers;
                }
            }
        } catch (e) {
            console.log('allorigins失敗');
        }
        
        // 2. JSONPlaceholder CORS を試す
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts/1`);
            // 実際のScratch APIを試す（同一オリジンなら動く場合もある）
            const scratchResponse = await fetch(apiUrl, {
                mode: 'no-cors'
            });
            if (scratchResponse.ok) {
                const data = await scratchResponse.json();
                if (data.followers !== undefined) {
                    console.log('✅ Scratch API直接取得成功:', data.followers);
                    return data.followers;
                }
            }
        } catch (e) {
            console.log('直接取得失敗');
        }
        
        return null;
    } catch (error) {
        console.error('エラー:', error);
        return null;
    }
}

// フォロワー数を更新
async function updateFollowers() {
    const currentFollowers = await fetchFollowers();
    
    if (currentFollowers === null) {
        document.getElementById('followerCount').textContent = 'エラー（ネット接続確認）';
        document.getElementById('lastUpdate').textContent = 'APIに接続できません';
        console.warn('API接続失敗 - リトライ中...');
        return;
    }
    
    document.getElementById('followerCount').textContent = currentFollowers;
    
    const now = new Date();
    document.getElementById('lastUpdate').textContent = `最終更新: ${now.toLocaleTimeString('ja-JP')}`;
    
    // 初回チェック（フォロワー数を記録するだけ）
    if (isFirstLoad) {
        previousFollowers = currentFollowers;
        isFirstLoad = false;
        console.log('初期フォロワー数:', currentFollowers);
        return;
    }
    
    // 2回目以降：フォロワーが増えたかチェック
    if (currentFollowers > previousFollowers) {
        const increase = currentFollowers - previousFollowers;
        increaseCount += increase;
        document.getElementById('increaseCount').textContent = increaseCount;
        
        console.log(`🎉 フォロワー増加！ ${previousFollowers} → ${currentFollowers} (+${increase})`);
        
        // 派手に祝う
        celebrate();
        
        // 履歴に追加
        addToHistory(previousFollowers, currentFollowers, now);
        
        previousFollowers = currentFollowers;
    }
}

// 派手に祝う関数
function celebrate() {
    // フラッシュ効果
    flashScreen();
    
    // テキスト表示
    showCelebrationText();
    
    // 紙吹雪
    createConfetti();
    
    // キラキラエフェクト
    createSparkles();
}

// フラッシュ効果
function flashScreen() {
    const body = document.body;
    body.classList.add('flash');
    setTimeout(() => {
        body.classList.remove('flash');
    }, 500);
}

// 祝いテキスト表示
function showCelebrationText() {
    const celebrationText = document.getElementById('celebrationText');
    celebrationText.textContent = '🎉 フォロワー増えた！🎉';
    
    // アニメーションをリセット
    celebrationText.style.animation = 'none';
    setTimeout(() => {
        celebrationText.style.animation = 'celebrationPop 1.5s ease-out forwards';
    }, 10);
}

// 紙吹雪を作成
function createConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd93d', '#ff8c42', '#a8d8ea'];
    
    // 紙吹雪を��成
    for (let i = 0; i < 100; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 3,
            size: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2,
            rotationVel: (Math.random() - 0.5) * 0.1
        });
    }
    
    // アニメーション
    let frame = 0;
    const maxFrames = 100;
    
    function animate() {
        if (frame >= maxFrames) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach(piece => {
            if (piece.y < canvas.height) {
                piece.y += piece.vy;
                piece.x += piece.vx;
                piece.vy += 0.1; // 重力
                piece.rotation += piece.rotationVel;
                
                ctx.save();
                ctx.translate(piece.x, piece.y);
                ctx.rotate(piece.rotation);
                ctx.fillStyle = piece.color;
                ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
                ctx.restore();
            }
        });
        
        frame++;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// キラキラエフェクトを作成
function createSparkles() {
    const sparklesContainer = document.getElementById('sparkles');
    const sparkleEmojis = ['✨', '💫', '⭐', '🌟', '💥'];
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkleEmojis[Math.floor(Math.random() * sparkleEmojis.length)];
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const tx = (Math.random() - 0.5) * 200;
        const ty = (Math.random() - 0.5) * 200;
        
        sparkle.style.left = startX + 'px';
        sparkle.style.top = startY + 'px';
        sparkle.style.setProperty('--tx', tx + 'px');
        sparkle.style.setProperty('--ty', ty + 'px');
        
        sparklesContainer.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }
}

// 履歴に追加
function addToHistory(before, after, timestamp) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    historyItem.innerHTML = `
        <span class="time">${timestamp.toLocaleTimeString('ja-JP')}</span>
        <span> - ${before} → ${after} (+${after - before})</span>
    `;
    
    const historyList = document.getElementById('historyList');
    
    // 「まだ増加がありません」を削除
    const noData = historyList.querySelector('.no-data');
    if (noData) noData.remove();
    
    historyList.insertBefore(historyItem, historyList.firstChild);
    
    // 最大20件まで保持
    while (historyList.children.length > 20) {
        historyList.removeChild(historyList.lastChild);
    }
}

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 初期化と定期更新
console.log('🎮 Scratch フォロワーカウンター 起動...');
updateTime();
updateFollowers();

// 1秒ごとに更新
setInterval(updateFollowers, 1000);

// 時刻を毎秒更新
setInterval(updateTime, 1000);
