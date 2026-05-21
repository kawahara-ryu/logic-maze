// === Audio (Retro RPG + Cyber Style) ===
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playTone(f,t,d,v=0.1){if(audioCtx.state==='suspended')audioCtx.resume();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=t;o.frequency.value=f;g.gain.value=v;o.connect(g);g.connect(audioCtx.destination);o.start();g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+d);o.stop(audioCtx.currentTime+d);}

// 魔導回路の起動音（重厚な機械音＋ピコン）
function playCorrect(){
    playTone(150, 'sawtooth', 0.2, 0.1); 
    setTimeout(()=>playTone(300, 'square', 0.1, 0.1), 100); 
    setTimeout(()=>playTone(880, 'sine', 0.3, 0.2), 200);
}
function playWrong(){playTone(150,'sawtooth',0.3,0.2); setTimeout(()=>playTone(100,'sawtooth',0.4,0.3),100);}
function playClick(){playTone(400,'square',0.05);}
function playHeartbeat(){playTone(60,'sine',0.2,0.5); setTimeout(()=>playTone(50,'sine',0.3,0.5),200);} // 心音
function playMagic(){playTone(600,'sine',0.1,0.1); setTimeout(()=>playTone(1200,'sine',0.2,0.1),100);} // 魔法音
function playGameOver(){playTone(150,'sawtooth',0.5,0.2);setTimeout(()=>playTone(100,'sawtooth',0.5,0.2),300);setTimeout(()=>playTone(50,'sawtooth',1.0,0.3),600);}
function playClear(){[523,587,659,698,784,880,987,1047].forEach((f,i)=>setTimeout(()=>playTone(f,'square',0.1),i*100));}

// === 回路図 SVG データ ===
const gateSVGs = {
    'AND': '<svg viewBox="0 0 100 50" stroke="var(--accent-light)" stroke-width="4" fill="none"><path d="M20,10 L50,10 A20,20 0 0,1 50,50 L20,50 Z" /><line x1="0" y1="20" x2="20" y2="20"/><line x1="0" y1="40" x2="20" y2="40"/><line x1="70" y1="30" x2="100" y2="30"/></svg>',
    'OR': '<svg viewBox="0 0 100 50" stroke="var(--accent-light)" stroke-width="4" fill="none"><path d="M15,10 Q40,10 65,30 Q40,50 15,50 Q25,30 15,10" /><line x1="0" y1="20" x2="17" y2="20"/><line x1="0" y1="40" x2="17" y2="40"/><line x1="65" y1="30" x2="100" y2="30"/></svg>',
    'NOT': '<svg viewBox="0 0 100 50" stroke="var(--accent-light)" stroke-width="4" fill="none"><polygon points="30,10 30,50 60,30" /><circle cx="66" cy="30" r="6" /><line x1="0" y1="30" x2="30" y2="30"/><line x1="72" y1="30" x2="100" y2="30"/></svg>',
    'NAND': '<svg viewBox="0 0 100 50" stroke="var(--accent-light)" stroke-width="4" fill="none"><path d="M20,10 L50,10 A20,20 0 0,1 50,50 L20,50 Z" /><circle cx="76" cy="30" r="6" /><line x1="0" y1="20" x2="20" y2="20"/><line x1="0" y1="40" x2="20" y2="40"/><line x1="82" y1="30" x2="100" y2="30"/></svg>',
    'NOR': '<svg viewBox="0 0 100 50" stroke="var(--accent-light)" stroke-width="4" fill="none"><path d="M15,10 Q40,10 65,30 Q40,50 15,50 Q25,30 15,10" /><circle cx="71" cy="30" r="6" /><line x1="0" y1="20" x2="17" y2="20"/><line x1="0" y1="40" x2="17" y2="40"/><line x1="77" y1="30" x2="100" y2="30"/></svg>',
    'XOR': '<svg viewBox="0 0 100 50" stroke="var(--accent-light)" stroke-width="4" fill="none"><path d="M25,10 Q50,10 75,30 Q50,50 25,50 Q35,30 25,10" /><path d="M15,10 Q25,30 15,50" /><line x1="0" y1="20" x2="18" y2="20"/><line x1="0" y1="40" x2="18" y2="40"/><line x1="75" y1="30" x2="100" y2="30"/></svg>',
    'HALF-ADDER': '<svg viewBox="0 0 100 50" stroke="var(--accent-light)" stroke-width="4" fill="none"><rect x="25" y="5" width="50" height="40" /><text x="35" y="32" fill="var(--accent-light)" stroke="none" font-size="20">HA</text><line x1="0" y1="15" x2="25" y2="15"/><line x1="0" y1="35" x2="25" y2="35"/><line x1="75" y1="15" x2="100" y2="15"/><line x1="75" y1="35" x2="100" y2="35"/></svg>',
    'COMPLEX': '<svg viewBox="0 0 100 50" stroke="var(--accent-light)" stroke-width="4" fill="none"><rect x="30" y="5" width="40" height="40" stroke-dasharray="4" /><text x="40" y="32" fill="var(--accent-light)" stroke="none" font-size="24">?</text></svg>'
};

// === State ===
let currentStage = 0, totalScore = 0, mistakes = [], timerInterval = null, timeLeft = 0, isProcessing = false, qIndex = 0;
let hp = 3;
let hintUsed = false;

const screens = { 
    title: document.getElementById('screen-title'), 
    game: document.getElementById('screen-game'), 
    clear: document.getElementById('screen-clear'),
    gameover: document.getElementById('screen-gameover')
};

function startGame() { 
    playClick(); 
    currentStage=0; totalScore=0; mistakes=[]; hp=3; 
    updateHP();
    document.body.classList.remove('boss-mode');
    screens.title.classList.remove('active'); 
    screens.gameover.classList.remove('active'); 
    screens.game.classList.add('active'); 
    loadStage(0); 
}

function updateHP() {
    const hpBar = document.getElementById('hp-bar');
    let hearts = "";
    for(let i=0; i<3; i++) { hearts += (i < hp) ? "❤️" : "🖤"; }
    hpBar.textContent = hearts;
}

function takeDamage(damageText, isTimeout = false) {
    hp--;
    updateHP();
    playWrong();
    
    // 画面シェイクエフェクト
    const container = document.getElementById('game-container');
    container.classList.remove('shake-screen');
    void container.offsetWidth; // リフロー
    container.classList.add('shake-screen');

    if (hp <= 0) {
        setTimeout(() => { showGameOver(damageText); }, 1000); // 少し待ってからゲームオーバー
        return true; // 死亡
    }
    return false; // 生存
}

function showGameOver(reason) {
    clearInterval(timerInterval);
    playGameOver();
    document.body.classList.remove('boss-mode');
    screens.game.classList.remove('active');
    document.getElementById('feedback-overlay').classList.add('hidden');
    document.getElementById('gameover-reason').textContent = reason + "（HPがゼロになった）";
    screens.gameover.classList.add('active');
}

function loadStage(n) {
    currentStage = n; isProcessing = false; qIndex = 0;
    clearInterval(timerInterval);
    const stages = [gameData.stage1, gameData.stage2, gameData.stage3, gameData.stage4];
    if (n >= stages.length) { showClear(); return; }
    
    // ボス戦演出（Stage 4）
    if (n === 3) { document.body.classList.add('boss-mode'); }

    const s = stages[n];
    document.getElementById('stage-title').textContent = s.title;
    document.getElementById('instruction-box').textContent = s.instruction;
    s._shuffled = [...s.questions].sort(() => Math.random() - 0.5);
    
    if (s.timePerQ > 0) {
        document.getElementById('timer').textContent = `--`;
    } else {
        document.getElementById('timer').textContent = `∞`;
    }
    showQuestion();
}

function showQuestion() {
    const stages = [gameData.stage1, gameData.stage2, gameData.stage3, gameData.stage4];
    const s = stages[currentStage];
    if (qIndex >= s._shuffled.length) {
        clearInterval(timerInterval);
        showFeedback(true, `【 試練達成 】\n${s.title} をクリアした！`, () => loadStage(currentStage + 1));
        return;
    }
    const q = s._shuffled[qIndex];
    document.getElementById('counter').textContent = `扉 ${qIndex + 1} / ${s._shuffled.length}`;
    
    // 回路図アイコンと問題文の設定
    const iconBox = document.getElementById('gate-icon-box');
    iconBox.innerHTML = gateSVGs[q.gateType] || gateSVGs['COMPLEX'];
    document.getElementById('question-text').innerHTML = q.question;

    // 透視魔法（ヒント）ボタンのリセット
    hintUsed = false;
    const hBtn = document.getElementById('hint-btn');
    hBtn.disabled = false;
    hBtn.classList.remove('used');
    hBtn.textContent = "💡 透視魔法 (Time -5s)";

    const optBox = document.getElementById('options');
    optBox.innerHTML = '';
    const shuffledOpts = [...q.options].sort(() => Math.random() - 0.5);
    shuffledOpts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'quiz-opt'; btn.textContent = opt;
        btn.onclick = () => answerQuestion(opt, q, btn);
        optBox.appendChild(btn);
    });

    isProcessing = false;
    if (s.timePerQ > 0) {
        startTimer(s.timePerQ, () => {
            isProcessing = true; totalScore -= 5;
            mistakes.push({ stage: stages[currentStage].title, question: q.question, answer: q.answer, explanation: q.explanation });
            const isDead = takeDamage("時間切れによるトラップダメージ！");
            if (!isDead) {
                showFeedback(false, `【 時間切れ 】\nトラップが発動した！HP-1\n\n【解説】\n${q.explanation}`, () => { qIndex++; showQuestion(); });
            }
        });
    }
}

// 魔法の透視機能
function useHint() {
    if(hintUsed || isProcessing) return;
    hintUsed = true;
    playMagic();
    const hBtn = document.getElementById('hint-btn');
    hBtn.disabled = true;
    hBtn.classList.add('used');
    hBtn.textContent = "💡 透視魔法（発動済）";
    
    // タイムペナルティ
    const stages = [gameData.stage1, gameData.stage2, gameData.stage3, gameData.stage4];
    if (stages[currentStage].timePerQ > 0) {
        timeLeft -= 5;
        if(timeLeft < 0) timeLeft = 0;
        updateTimer();
    }
    
    // 不正解を2つ消す
    const q = stages[currentStage]._shuffled[qIndex];
    const btns = Array.from(document.querySelectorAll('.quiz-opt'));
    const wrongBtns = btns.filter(b => b.textContent !== q.answer);
    
    wrongBtns.sort(() => Math.random() - 0.5);
    if(wrongBtns.length >= 1) wrongBtns[0].classList.add('hidden-opt');
    if(wrongBtns.length >= 2) wrongBtns[1].classList.add('hidden-opt');
}

// カミナリエフェクト
function triggerLightning() {
    const el = document.getElementById('lightning-flash');
    el.classList.remove('hidden');
    el.classList.remove('flash-anim');
    void el.offsetWidth; // reflow
    el.classList.add('flash-anim');
    setTimeout(() => { el.classList.add('hidden'); el.classList.remove('flash-anim'); }, 300);
}

function answerQuestion(selected, q, btn) {
    if (isProcessing) return; isProcessing = true;
    clearInterval(timerInterval);
    const stages = [gameData.stage1, gameData.stage2, gameData.stage3, gameData.stage4];
    
    if (selected === q.answer) {
        playCorrect(); 
        triggerLightning(); // 正解時にイナズマ
        btn.classList.add('correct'); totalScore += 15;
        showFeedback(true, `【 扉が開いた 】\n${q.explanation}`, () => { qIndex++; showQuestion(); });
    } else {
        btn.classList.add('wrong'); totalScore -= 5;
        document.querySelectorAll('.quiz-opt').forEach(b => { if (b.textContent === q.answer) b.classList.add('correct'); });
        mistakes.push({ stage: stages[currentStage].title, question: q.question, answer: q.answer, explanation: q.explanation });
        
        const isDead = takeDamage(q.damage);
        if (!isDead) {
            showFeedback(false, `【 ダメージを受けた！HP-1 】\n${q.damage}\n\n【解説】\n${q.explanation}`, () => { qIndex++; showQuestion(); });
        }
    }
}

function showClear() {
    playClear(); 
    document.body.classList.remove('boss-mode');
    screens.game.classList.remove('active'); screens.clear.classList.add('active');
    
    // 冒険者称号の判定
    let rank = "";
    if (hp === 3 && mistakes.length === 0) rank = "👑 伝説の勇者ボクバナナ";
    else if (hp === 3) rank = "⚔️ 熟練の魔法剣士";
    else if (hp === 2) rank = "🛡️ 一人前の冒険者";
    else if (hp === 1) rank = "🩹 ギリギリ生還した迷子";
    else rank = "🔩 回路のサビ";
    
    document.getElementById('rank-display').textContent = rank;
    document.getElementById('score-display').textContent = `最終スコア: ${totalScore} Pt`;
    document.getElementById('password-text').textContent = gameData.password;
    
    const area = document.getElementById('review-area');
    if (!mistakes.length) { area.innerHTML = '<p class="review-perfect">ノーダメージで迷宮を踏破した！完全無欠のロジックだ！</p>'; return; }
    area.innerHTML = '';
    mistakes.forEach(m => { const c=document.createElement('div'); c.className='review-card'; c.innerHTML=`<div class="review-stage">${m.stage}</div><div class="review-q">Q: ${m.question}</div><div class="review-a">A: ${m.answer}</div><div class="review-exp">${m.explanation}</div>`; area.appendChild(c); });
}

function startTimer(sec, cb) { 
    timeLeft=sec; updateTimer(); clearInterval(timerInterval); 
    timerInterval=setInterval(()=>{
        timeLeft--;
        updateTimer();
        if(timeLeft <= 5 && timeLeft > 0) { playHeartbeat(); }
        if(timeLeft<=0){ clearInterval(timerInterval); if(cb)cb(); }
    },1000); 
}
function updateTimer() { const el=document.getElementById('timer'); el.textContent=`${timeLeft}`; el.className='timer-box '+(timeLeft<=5?'timer-danger':''); }
function showFeedback(ok, text, cb) { 
    const ov=document.getElementById('feedback-overlay'); 
    document.getElementById('feedback-title').textContent=ok?'◎ 正解':'✖ 不正解'; 
    document.getElementById('feedback-title').style.color=ok?'var(--success-color)':'var(--danger-color)'; 
    document.getElementById('feedback-text').innerHTML = text.replace(/\n/g, '<br>'); 
    document.getElementById('next-btn').textContent = ok ? '次へ進む ▶' : '痛みに耐えて進む ▶';
    document.getElementById('next-btn').style.borderColor = ok ? 'var(--success-color)' : 'var(--danger-color)';
    document.getElementById('next-btn').style.color = ok ? 'var(--success-color)' : 'var(--danger-color)';
    ov.classList.remove('hidden'); ov._cb=cb; 
}
function closeFeedback() { playClick(); document.getElementById('feedback-overlay').classList.add('hidden'); const ov=document.getElementById('feedback-overlay'); if(ov._cb)ov._cb(); }
