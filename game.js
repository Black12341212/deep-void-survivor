// ============================================
// Deep Void Survivor v6.0 — Глубже Бездны
// ============================================

// ============================================
// Input Manager
// ============================================

class InputManager {
    constructor(canvas) {
        this.keys = {};
        this.justPressed = {};
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseDown = false;
        this.mouseJustClicked = false;

        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.key.toLowerCase()]) {
                this.justPressed[e.key.toLowerCase()] = true;
            }
            this.keys[e.key.toLowerCase()] = true;
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
        });
        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { this.mouseDown = true; this.mouseJustClicked = true; }
        });
        canvas.addEventListener('mouseup', (e) => {
            if (e.button === 0) this.mouseDown = false;
        });
        canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    isPressed(key) { return this.keys[key.toLowerCase()] === true; }
    isJustPressed(key) { return this.justPressed[key.toLowerCase()] === true; }
    isShiftPressed() { return this.keys['shift'] === true; }
    isJustShiftPressed() { return this.justPressed['shift'] === true; }
    clearJustPressed() { this.justPressed = {}; this.mouseJustClicked = false; }
}
// ============================================
// Sound Engine — .mp3 file loader
// ============================================

class SoundEngine {
    constructor() {
        this.enabled = true;
        this.sounds = {};
        this.music = {};
        this.volume = 0.25;
        this.basePath = 'sounds/';
        this.loaded = false;
        this.musicNode = null;
        this.musicGain = null;
        this.musicCtx = null;
    }
    init() {
        return; // Sound loading disabled
        if (this.loaded) return;
        const sfxPaths = {
            'playerShoot':'sfx/player/player-shoot.mp3','playerShootTriple':'sfx/player/player-shoot-triple.mp3',
            'playerHit':'sfx/player/player-hit.mp3','playerDeath':'sfx/player/player-death.mp3',
            'dash':'sfx/player/player-dash.mp3','enemyHit':'sfx/enemy/enemy-hit.mp3',
            'enemyDeath':'sfx/enemy/enemy-death.mp3','minibossAppear':'sfx/enemy/miniboss-appear.mp3',
            'eliteAppear':'sfx/enemy/elite-appear.mp3','blinkTeleport':'sfx/enemy/blink-teleport.mp3',
            'swarmBuzz':'sfx/enemy/swarm-buzz.mp3','cloneSplit':'sfx/enemy/clone-split.mp3',
            'ghostPhase':'sfx/enemy/ghost-phase.mp3','bossAppear':'sfx/enemy/boss-appear.mp3',
            'explosion':'sfx/combat/explosion.mp3','combo':'sfx/combat/combo.mp3',
            'comboHigh':'sfx/combat/combo-high.mp3','laserWarning':'sfx/hazards/laser-warning.mp3',
            'puddlePlace':'sfx/hazards/puddle-place.mp3','slowDebuff':'sfx/hazards/slow-debuff.mp3',
            'menuClick':'sfx/ui/menu-click.mp3','upgradeSelect':'sfx/ui/upgrade-select.mp3',
            'shieldActivate':'sfx/ui/shield-activate.mp3','prestige':'sfx/ui/prestige.mp3',
            'tooltipShow':'sfx/ui/tooltip-show.mp3','pauseOpen':'sfx/ui/pause-open.mp3',
            'statReveal':'sfx/ui/stat-reveal.mp3','achievementUnlock':'sfx/ui/achievement-unlock.mp3',
            'achievementScreenOpen':'sfx/ui/achievement-screen-open.mp3',
            'cosmeticUnlock':'sfx/ui/cosmetic-unlock.mp3','skillTreeOpen':'sfx/ui/skill-tree-open.mp3',
            'skillUnlock':'sfx/ui/skill-unlock.mp3','skillConfirm':'sfx/ui/skill-confirm.mp3',
            'recordNew':'sfx/ui/record-new.mp3','waveStart':'sfx/ui/wave-start.mp3','modifierInversion':'sfx/modifiers/modifier-inversion.mp3',
            'modifierFog':'sfx/modifiers/modifier-fog.mp3','modifierRicochet':'sfx/modifiers/modifier-ricochet.mp3',
            'modifierGrowth':'sfx/modifiers/modifier-growth.mp3','modifierChaos':'sfx/modifiers/modifier-chaos.mp3',
            'artifactDrop':'sfx/artifacts/artifact-drop.mp3','artifactPickup':'sfx/artifacts/artifact-pickup.mp3',
            'stasisBlock':'sfx/artifacts/stasis-block.mp3','echoShot':'sfx/artifacts/echo-shot.mp3',
            'crystalDash':'sfx/artifacts/crystal-dash.mp3','challengeStart':'sfx/challenges/challenge-start.mp3',
            'challengeComplete':'sfx/challenges/challenge-complete.mp3',
            'challengeFail':'sfx/challenges/challenge-fail.mp3',
            'phantomAppear':'sfx/enemy/phantom-appear.mp3','phantomWhoosh':'sfx/enemy/phantom-whoosh.mp3',
            'lancerCharge':'sfx/enemy/lancer-charge.mp3','lancerHit':'sfx/enemy/lancer-hit.mp3',
            'summonerSpawn':'sfx/enemy/summoner-spawn.mp3','summonerSignal':'sfx/enemy/summoner-signal.mp3',
            'warlockTeleport':'sfx/enemy/warlock-teleport.mp3','warlockDebuff':'sfx/enemy/warlock-debuff.mp3',
            'sporeDeath':'sfx/enemy/spore-death.mp3','merchantOpen':'sfx/ui/merchant-open.mp3',
            'merchantBuy':'sfx/ui/merchant-buy.mp3','weaponSwitch':'sfx/ui/weapon-switch.mp3',
            'ionShot':'sfx/player/ion-shot.mp3','pulsarBeep':'sfx/hazards/pulsar-beep.mp3',
        };
        for (const [id, file] of Object.entries(sfxPaths)) {
            const a = new Audio(this.basePath + file);
            a.volume = this.volume;
            a.preload = 'auto';
            this.sounds[id] = a;
        }
        const musicPaths = {
            'calm':'music/calm-loop.mp3','tense':'music/tense-loop.mp3',
            'danger':'music/danger-loop.mp3','boss':'music/boss-loop.mp3',
        };
        for (const [id, file] of Object.entries(musicPaths)) {
            const a = new Audio(this.basePath + file);
            a.loop = true;
            a.volume = 0;
            a.preload = 'auto';
            this.music[id] = a;
        }
        this.loaded = true;
    }
    setVolume(v) {
        this.volume = v;
        for (const a of Object.values(this.sounds)) a.volume = v;
    }
    play(id) {
        if (!this.enabled || !this.sounds[id]) return;
        const a = this.sounds[id];
        a.currentTime = 0;
        a.volume = this.volume;
        try { a.play().catch(() => {}); } catch(e) {}
    }
    playMusic(mood) {
        for (const [id, a] of Object.entries(this.music)) {
            if (id === mood) {
                if (a.paused) { a.currentTime = 0; a.volume = this.volume * 0.5; try { a.play().catch(() => {}); } catch(e) {} }
            } else {
                if (!a.paused) { a.volume = 0; a.pause(); a.currentTime = 0; }
            }
        }
    }
    stopMusic() {
        for (const a of Object.values(this.music)) { a.pause(); a.currentTime = 0; }
    }
    setSFXVolume(v) { this.volume = v; for (const a of Object.values(this.sounds)) a.volume = v; }
    setMusicVolume(v) { for (const a of Object.values(this.music)) { if (!a.paused) a.volume = v * 0.5; } }
}
// ============================================
// Music Engine — .mp3 loop crossfader
// ============================================

class MusicEngine {
    constructor(soundEngine) {
        this.sound = soundEngine;
        this.running = false;
        this.currentMood = 'calm';
    }
    start() {
        this.running = true;
        this.setMood(1);
    }
    setMood(wave) {
        if (!this.running) return;
        let mood;
        if (wave <= 3) mood = 'calm';
        else if (wave <= 6) mood = 'tense';
        else if (wave <= 9) mood = 'danger';
        else mood = 'boss';
        if (mood === this.currentMood) return;
        this.currentMood = mood;
        this.sound.playMusic(mood);
    }
    stop() {
        this.running = false;
        this.sound.stopMusic();
    }
}
// ============================================
// Achievement System
// ============================================

const ACHIEVEMENTS = [
    { id:'flawless', name:'Безупречно', desc:'Пройти волну без урона', icon:'💎', cosmeticColor:'#44ffff', cosmeticType:'playerColor' },
    { id:'comboMaster', name:'Комбо-мастер', desc:'20-комбо 5 раз за игру', icon:'🔥', cosmeticColor:'#ff4400', cosmeticType:'particleStyle' },
    { id:'surgeon', name:'Хирург', desc:'Убить босса за <30 сек', icon:'🔪', cosmeticColor:'#ff44ff', cosmeticType:'projectileShape' },
    { id:'steel', name:'Стальной', desc:'Выиграть с 1 HP', icon:'🛡', cosmeticColor:'#cccccc', cosmeticType:'playerOutline' },
    { id:'hellRush', name:'Адский напор', desc:'Убить 100 врагов за одну волну', icon:'🔥', cosmeticColor:'#ff2200', cosmeticType:'deathEffect' },
    { id:'speedrunner', name:'Скоростной', desc:'Закончить волну за <15с', icon:'⏱', cosmeticColor:'#00ddff', cosmeticType:'projectileShape' },
    { id:'tankAch', name:'Танк', desc:'Выдержать 5+ урона за волну без смерти', icon:'🛡', cosmeticColor:'#88ff44', cosmeticType:'playerOutline' },
    { id:'sniperStreak', name:'Снайпер без промаха', desc:'10 попаданий подряд', icon:'🎯', cosmeticColor:'#ffdd00', cosmeticType:'projectileShape' },
    { id:'genocide', name:'Геноцид', desc:'500 убийств за одну игру', icon:'💀', cosmeticColor:'#ff0000', cosmeticType:'deathEffect' },
    { id:'deepDiver', name:'Глубоководный', desc:'Дойти до волны 25', icon:'🌊', cosmeticColor:'#0044ff', cosmeticType:'arenaTheme' },
    { id:'legend', name:'Легенда', desc:'Престиж 50', icon:'🏆', cosmeticColor:'#ffdd00', cosmeticType:'playerColor' },
    { id:'abyssWalker', name:'Ходок Бездны', desc:'Дойти до волны 50', icon:'🕳', cosmeticColor:'#4400cc', cosmeticType:'playerColor' },
    { id:'voidImmortal', name:'Бессмертный Бездны', desc:'Дойти до волны 100', icon:'♾', cosmeticColor:'#aa00ff', cosmeticType:'deathEffect' }
];

// ============================================
// Wave Modifier System
// ============================================

const WAVE_MODIFIERS = [
    { id:'inversion', name:'Инверсия', desc:'WASD инвертированы', icon:'🔄', color:'#ff44ff', scoreBonus:0.5 },
    { id:'fog', name:'Туман', desc:'Видимость 200px', icon:'🌫', color:'#888888', scoreBonus:0.5 },
    { id:'ricochetWalls', name:'Рикошет-стены', desc:'Пули врагов отскакивают от стен', icon:'🧊', color:'#44aaff', scoreBonus:0.5 },
    { id:'fortify', name:'Укрепление', desc:'Враги получают -50% урона', icon:'🛡', color:'#44aaff', scoreBonus:0.5 },
    { id:'chaos', name:'Хаос', desc:'Все враги +1 элитный мод', icon:'⚡', color:'#ffaa00', scoreBonus:0.5 }
];

// ============================================
// Artifact Definitions
// ============================================

const ARTIFACT_DEFS = [
    { id:'crystalTime', name:'Кристалл времени', desc:'Кулдаун дэша -50%', icon:'⏰', color:'#44ddff', apply(p) { p.dashCooldownMax *= 0.5; } },
    { id:'fangAbyss', name:'Клык Бездны', desc:'+25% урона, -1 HP макс', icon:'🦷', color:'#ff4488', apply(p) { p.damage *= 1.25; p.maxHp = Math.max(1, p.maxHp - 1); p.hp = Math.min(p.hp, p.maxHp); } },
    { id:'echo', name:'Эхо', desc:'3-й выстрел копия сзади', icon:'👁', color:'#aa88ff', apply(p) { p.echoArtifact = true; p.echoCounter = 0; } },
    { id:'stasis', name:'Стазис', desc:'Раз в 10с авто-блок', icon:'🛡', color:'#ffdd00', apply(p) { p.stasisArtifact = true; p.stasisCooldown = 0; } },
    { id:'vortex', name:'Воронка', desc:'Враги в r150: 1 ур/сек', icon:'🌀', color:'#44ffaa', apply(p) { p.vortexArtifact = true; p.vortexRadius = 150; } },
    { id:'chainLightning', name:'Цепная молния', desc:'Пули отскакивают к врагу (-50% урон)', icon:'⚡', color:'#88ccff', apply(p) { p.chainLightning = true; } },
    { id:'presight', name:'Предвидение', desc:'+1 карточка апгрейда (3→4)', icon:'🔮', color:'#cc44ff', apply(p) { p.extraUpgradeChoice = true; } },
    { id:'crystalHeart', name:'Хрустальное сердце', desc:'+2 HP, -1 слот артефакта', icon:'💎', color:'#4488ff', apply(p) { p.maxHp += 2; p.hp += 2; p.maxArtifactSlots = Math.max(1, (p.maxArtifactSlots || 2) - 1); } },
    { id:'slowing', name:'Разлом времени', desc:'Пули замедляют врагов', icon:'⏳', color:'#44dd88', apply(p) { p.slowOnHit = true; } }
];

// ============================================
// Weapon Definitions
// ============================================

const WEAPON_DEFS = {
    auto: { name:'Автомат', icon:'🔫', desc:'Стабильный DPS', shootRate:0.3, damageMul:1, projectileCount:1, spread:0, projectileSpeed:500, projectileSize:4, aoeRadius:0 },
    shotgun: { name:'Дробовик', icon:'💥', desc:'6 пуль узким конусом', shootRate:2.0, damageMul:0.6, projectileCount:6, spread:0.3, projectileSpeed:450, projectileSize:3, aoeRadius:0 },
    machinegun: { name:'Пулемёт', icon:'🔥', desc:'×2 скорость, ×0.4 урон', shootRate:0.15, damageMul:0.4, projectileCount:1, spread:0.08, projectileSpeed:520, projectileSize:3, aoeRadius:0 },
    rocket: { name:'Ракетница', icon:'🚀', desc:'AOE 60px, ×2 урон', shootRate:1.0, damageMul:2, projectileCount:1, spread:0, projectileSpeed:350, projectileSize:6, aoeRadius:60 },
    ion: { name:'Ионный луч', icon:'🔱', desc:'Pierce +2, замедляет врагов', shootRate:0.45, damageMul:1.1, projectileCount:1, spread:0, projectileSpeed:700, projectileSize:5, aoeRadius:0, ion:true }
};

// ============================================
// Merchant Items
// ============================================

const MERCHANT_ITEMS = [
    { id:'m_heal', name:'❤ Лечение', desc:'+2 HP', icon:'❤', cost:50, apply(p) { p.hp=Math.min(p.hp+2,p.maxHp); } },
    { id:'m_damage', name:'⚔ Урон +20%', desc:'Урон x1.2', icon:'⚔', cost:80, apply(p) { p.damage*=1.2; } },
    { id:'m_speed', name:'👢 Скорость +15%', desc:'Скорость x1.15', icon:'👢', cost:60, apply(p) { p.speed*=1.15; p.baseSpeed=p.speed; } },
    { id:'m_crit', name:'🎯 Крит +10%', desc:'+10% крит', icon:'🎯', cost:100, apply(p) { p.critChance=(p.critChance||0)+0.1; } },
    { id:'m_pierce', name:'🔀 Пробивание', desc:'+1 pierce', icon:'🔀', cost:90, apply(p) { p.pierceCount++; } },
    { id:'m_maxhp', name:'💖 Макс HP +2', desc:'+2 максимальное HP', icon:'💖', cost:70, apply(p) { p.maxHp+=2; p.hp+=2; } },
    { id:'m_dash', name:'💨 Быстрый дэш', desc:'-30% кулдаун дэша', icon:'💨', cost:110, apply(p) { p.dashCooldownMax*=0.7; } },
    { id:'m_shield', name:'🛡 Щит', desc:'3с инвинсивность', icon:'🛡', cost:120, apply(p) { p.invincibleDuration+=0.5; } }
];

// ============================================
// Prestige Skill Tree
// ============================================

const SKILL_TREE = {
    survival: [
        { id:'surv1', name:'+1 HP', cost:1, apply(p) { p.maxHp++; p.hp++; } },
        { id:'surv2', name:'+10% скорость', cost:1, apply(p) { p.speed *= 1.1; p.baseSpeed = p.speed; } },
        { id:'surv3', name:'+0.5с инвинс', cost:2, apply(p) { p.invincibleDuration += 0.5; } },
        { id:'surv4', name:'+2 HP', cost:2, apply(p) { p.maxHp += 2; p.hp += 2; } },
        { id:'surv5', name:'+20% скорость', cost:3, apply(p) { p.speed *= 1.2; p.baseSpeed = p.speed; } }
    ],
    damage: [
        { id:'dmg1', name:'+15% урон', cost:1, apply(p) { p.damage *= 1.15; } },
        { id:'dmg2', name:'+5% крит', cost:1, apply(p) { p.critChance = (p.critChance||0)+0.05; } },
        { id:'dmg3', name:'+1 pierce', cost:2, apply(p) { p.pierceCount++; } },
        { id:'dmg4', name:'+30% урон', cost:2, apply(p) { p.damage *= 1.3; } },
        { id:'dmg5', name:'+10% крит', cost:3, apply(p) { p.critChance = (p.critChance||0)+0.1; } }
    ],
    support: [
        { id:'sup1', name:'+1 дрон', cost:1, apply(p) { p.droneLevel++; } },
        { id:'sup2', name:'+30px магнит', cost:1, apply(p) { if(p.magnet) p.magnetRadius += 30; } },
        { id:'sup3', name:'-1с дэш', cost:2, apply(p) { p.dashCooldownMax = Math.max(1, p.dashCooldownMax - 1); } },
        { id:'sup4', name:'+1 pierce', cost:2, apply(p) { p.pierceCount++; } },
        { id:'sup5', name:'-2с дэш', cost:3, apply(p) { p.dashCooldownMax = Math.max(0.5, p.dashCooldownMax - 2); } }
    ]
};

// ============================================
// Challenge Mode Definitions
// ============================================

const CHALLENGES = [
    { id:'glass', name:'Стеклянный игрок', desc:'1 HP, x3 урон', icon:'🪟', reward:'50 очков', apply(p) { p.maxHp=1; p.hp=1; p.damage*=3; } },
    { id:'zombie', name:'Зомби-волна', desc:'Враги медленные, x3 HP, не убивают при контакте', icon:'🧟', reward:'🧟 Zombiefied косметика', zombieMode:true },
    { id:'melee', name:'Ближний бой', desc:'Только Phase Walk + Thorns', icon:'⚔', reward:'100 очков', apply(p) { p.noShooting=true; p.phaseWalk=true; p.phaseDamage=3; p.phaseCooldownMax=1; p.thorns=true; } },
    { id:'minimalist', name:'Минималист', desc:'Только 3 апгрейда', icon:'📉', reward:'📉 Minimalist Trail косметика', maxUpgrades:3 }
];

// ============================================
// Elite Modifier Pool (4 original + 4 new)
// ============================================

const ELITE_MODIFIERS = ['explosive','regenerating','frenzied','shielded','enraged','ghost','ice','splitter'];

const ELITE_MOD_ICONS = { explosive:'💥', regenerating:'❤', frenzied:'⚡', shielded:'🛡', enraged:'😡', ghost:'👻', ice:'❄', splitter:'🔀' };

const ARENA_THEMES = ['default','cyber','void','inferno','ice'];
const DEATH_EFFECTS = ['explosion','shatter','dissolve'];

// ============================================
// Codex (v6.0) — enemy bestiary data
// ============================================

const ENEMY_CODE = [
    { type:'swarm', name:'Рой', icon:'🟢', desc:'Слабый, но быстрый. Появляется роями с 4-й волны', hp:1, speed:200, score:5 },
    { type:'fast', name:'Гончий', icon:'🟠', desc:'Быстрый одиночка с 3-й волны', hp:1, speed:180, score:15 },
    { type:'shooter', name:'Стрелок', icon:'🟣', desc:'Держит дистанцию и стреляет', hp:3, speed:50, score:25 },
    { type:'sludger', name:'Топляк', icon:'🟤', desc:'Оставляет лужи замедления', hp:2, speed:60, score:20 },
    { type:'blinker', name:'Мерцатель', icon:'🟡', desc:'Телепортируется к игроку и стреляет', hp:1, speed:0, score:20 },
    { type:'tank', name:'Танк', icon:'🟢', desc:'Медленный, контакт 2 урона. Злится при HP<3', hp:8, speed:40, score:30 },
    { type:'phantom', name:'Фантом', icon:'🟪', desc:'Невидим, телепортируется с 8-й волны', hp:2, speed:70, score:35 },
    { type:'lancer', name:'Копейщик', icon:'🔴', desc:'Разбегается и таранит (3 урона)', hp:4, speed:100, score:30 },
    { type:'summoner', name:'Призыватель', icon:'🟥', desc:'Призывает рои по 2 штуки', hp:5, speed:40, score:40 },
    { type:'warlock', name:'Чернокнижник', icon:'🟨', desc:'Телепортирует союзников к вам и ослабляет', hp:6, speed:60, score:50 },
    { type:'spore', name:'Спора', icon:'🟩', desc:'При смерти оставляет облако замедления', hp:1, speed:40, score:12 },
    { type:'revenant', name:'Ревенант', icon:'🟦', desc:'Воскресает один раз с 50% HP', hp:5, speed:70, score:45 },
    { type:'conductor', name:'Дирижёр', icon:'🟧', desc:'Буффает союзников в радиусе 150px', hp:7, speed:55, score:55 },
    { type:'mimic_king', name:'Король мимиков', icon:'🟨', desc:'Спавнит поддельные сферы-мимиков', hp:15, speed:50, score:80 },
    { type:'pulsar', name:'Пульсар', icon:'🔴', desc:'Неподвижен. Заряжается 3с и взрывается вокруг себя', hp:4, speed:0, score:25 },
    { type:'miniboss', name:'Мини-босс', icon:'💜', desc:'Каждые 5 волн. Тройной выстрел', hp:40, speed:70, score:200 },
    { type:'miniboss_wave', name:'Волновой мини-босс', icon:'🟠', desc:'Волна 15+: кольцевой залп', hp:80, speed:60, score:300 },
    { type:'miniboss_mirror', name:'Мини-босс-двойник', icon:'🔵', desc:'Волна 25+: копирует ваши движения', hp:120, speed:55, score:400 },
    { type:'miniboss_crystal', name:'Кристальный мини-босс', icon:'🩵', desc:'Волна 35+: разделяется на 4 стрелков', hp:200, speed:45, score:500 },
    { type:'boss', name:'БОСС', icon:'💖', desc:'Каждые 10 волн. Тройной выстрел', hp:120, speed:50, score:500 }
];
// ============================================
// Upgrade definitions
// ============================================

const UPGRADE_POOL = [
    { id:'overcharge', name:'⚡ Перегрузка', desc:'Урон x2, стрельба -40%', strong:'Танки, босс', weak:'Толпа', icon:'#ff4444', apply(p) { p.damage*=2; p.fireRateMul=(p.fireRateMul||1)*1.67; p.projectileSize=Math.min(p.projectileSize+1,10); } },
    { id:'barrage', name:'🔥 Шквал', desc:'Стрельба x2, урон -50%, 5-й промах', strong:'Толпа', weak:'Босс', icon:'#ff8800', apply(p) { p.fireRateMul=(p.fireRateMul||1)*0.5; p.damage*=0.5; p.barrageStacks=(p.barrageStacks||0)+1; } },
    { id:'marksman', name:'🎯 Снайпер', desc:'x4 урон, пробивает 2, 1 пуля', strong:'Линии', weak:'Толпа', icon:'#ffdd00', apply(p) { p.marksman=true; p.tripleShot=false; p.damage*=4; p.pierceCount=(p.pierceCount||0)+2; p.projectileSpeed*=1.3; } },
    { id:'phaseWalk', name:'💨 Эфирный шаг', desc:'Фантомы при движении', strong:'Урон при бегстве', weak:'Стоя на месте', icon:'#88ccff', apply(p) { p.phaseWalk=true; p.phaseCooldownMax=Math.max(1,3-(p.phaseWalkStacks||0)); p.phaseWalkStacks=(p.phaseWalkStacks||0)+1; p.phaseDamage=(p.phaseDamage||0)+2; } },
    { id:'ricochet', name:'🛡 Рикошет', desc:'Пули отскакивают от стен', strong:'Враги у краёв', weak:'Медленные пули', icon:'#44ffaa', apply(p) { p.ricochetCount=(p.ricochetCount||0)+1; p.projectileSpeed*=0.85; } },
    { id:'ironSkin', name:'🛡 Железная воля', desc:'При 1 HP: смертельный удар не убивает (30с кд)', strong:'Выживаемость', weak:'Раз в 30с', icon:'#ff4488', apply(p) { p.ironWill=true; p.ironWillCd=0; } },
    { id:'magnet', name:'🧲 Магнит', desc:'Сферы: 5 = 1 HP', strong:'Агрессивный', weak:'Нет убийств', icon:'#ccaa00', apply(p) { p.magnet=true; p.spheresPerHeal=Math.max(3,5-(p.magnetStacks||0)); p.magnetRadius=80+(p.magnetStacks||0)*20; p.magnetStacks=(p.magnetStacks||0)+1; } },
    { id:'graviton', name:'🌀 Гравитон', desc:'Пули притягивают врагов', strong:'Контроль', weak:'Медленные пули', icon:'#aa44ff', apply(p) { p.graviton=true; p.gravitonRadius=(p.gravitonRadius||60)+20; p.gravitonForce=(p.gravitonForce||50)+25; p.projectileSpeed*=0.9; } },
    { id:'vampirism', name:'🩸 Вампиризм', desc:'15% шанс +1 HP при убийстве', strong:'Затяжные бои', weak:'Редкие убийства', icon:'#cc2244', apply(p) { p.vampirism=true; } },
    { id:'timeWarp', name:'⏳ Временной разрыв', desc:'HP<25% замедление 2с', strong:'Спасение', weak:'Раз в 15с', icon:'#44ddff', apply(p) { p.timeWarp=true; } },
    { id:'explosiveBullets', name:'💥 Взрывные пули', desc:'AOE 40px, 50% урона', strong:'Толпы', weak:'Меньше урона', icon:'#ff8800', apply(p) { p.explosiveBullets=(p.explosiveBullets||0)+1; } },
    { id:'thorns', name:'🌵 Шипы', desc:'1 урон атакующим', strong:'Ближний бой', weak:'Стрелки', icon:'#44cc44', apply(p) { p.thorns=true; } },
    { id:'drone', name:'🤖 Дрон', desc:'Дрон стреляет 0.5 урона', strong:'DPS', weak:'Слабый', icon:'#88aaff', apply(p) { p.droneLevel=(p.droneLevel||0)+1; } },
    { id:'ghostShot', name:'👻 Призрачный выстрел', desc:'Сквозь врагов, урон -20%', strong:'Линии', weak:'Меньше DPS', icon:'#aa88ff', apply(p) { p.ghostShot=true; p.damage*=0.8; } }
];

// ============================================
// Active Ability Pool (v4.0)
// ============================================

const ABILITY_POOL = [
    {
        id:'nova', name:'💥 Нова', desc:'Взрыв вокруг игрока: 3 урона, отбрасывает на r120', cooldown:8, icon:'💥', color:'#ff6600',
        execute(game) {
            const px=game.player.x,py=game.player.y,radius=120;
            game.spawnParticles(px,py,'#ff6600',20,2);game.spawnRing(px,py,'#ff6600',radius);game.triggerShake(8);game.sound.play('explosion');
            for(const e of game.enemies){if(!e.alive)continue;const dx=e.x-px,dy=e.y-py,dist=Math.sqrt(dx*dx+dy*dy);if(dist<radius){e.takeDamage(3);const ang=Math.atan2(dy,dx);e.x+=Math.cos(ang)*100;e.y+=Math.sin(ang)*100;if(!e.alive)game.onEnemyKilled(e);}}
            for(const m of game.mimics||[]){if(!m.alive||m.activated)continue;const dx=m.x-px,dy=m.y-py;if(Math.sqrt(dx*dx+dy*dy)<radius){m.activate();}}
        }
    },
    {
        id:'graviton_well', name:'🌀 Гравитонная яма', desc:'Втягивает всех врагов на 2с, после — взрыв', cooldown:12, icon:'🌀', color:'#4488ff',
        execute(game) {
            game.abilityVortex={x:game.player.x,y:game.player.y,timer:2.0,radius:150,pullForce:200,exploded:false,active:true};
            game.sound.play('explosion');
        }
    },
    {
        id:'phase_shift', name:'👻 Фазовый сдвиг', desc:'2с неуязвимости + x2 скорость + сквозь врагов', cooldown:10, icon:'👻', color:'#88ccff',
        execute(game) {
            game.player.phaseShifted=true;game.player.phaseShiftTimer=2.0;game.player.baseSpeed*=2;
            game.sound.play('shieldActivate');game.spawnParticles(game.player.x,game.player.y,'#88ccff',12);
        }
    },
    {
        id:'auto_turret', name:'🔱 Авто-турель', desc:'HP 5, 1 урон/0.5с, живёт 8с', cooldown:20, icon:'🔱', color:'#44ff44',
        execute(game) {
            game.turrets.push({x:game.player.x,y:game.player.y,hp:5,maxHp:5,fireRate:0.5,fireTimer:0,damage:1,range:200,life:8.0,radius:12,alive:true,color:'#44ff44'});
            game.sound.play('shieldActivate');
        }
    },
    {
        id:'chronosphere', name:'⏳ Хроносфера', desc:'Замораживает всех врагов на 2с', cooldown:18, icon:'⏳', color:'#44ddff',
        execute(game) {
            for(const e of game.enemies){if(!e.alive)continue;e.frozen=true;e.frozenTimer=2.0;e.speed=0;}
            for(const m of game.mimics||[]){if(!m.alive||m.activated)continue;m.frozen=true;m.frozenTimer=2.0;}
            game.spawnRing(game.player.x,game.player.y,'#44ddff',Math.max(game.width,game.height)/2);
            game.sound.play('slowDebuff');
        }
    },
    {
        id:'blood_summon', name:'🔥 Кровавый призыв', desc:'3 призрачных копии взрываются у врагов', cooldown:10, icon:'🔥', color:'#ff4444',
        execute(game) {
            for(let i=0;i<3;i++){const angle=(Math.PI*2/3)*i+Math.random()*0.5;game.summonedGhosts.push({x:game.player.x+Math.cos(angle)*30,y:game.player.y+Math.sin(angle)*30,speed:200,damage:3,radius:10,life:4.0,alive:true,color:'#ff4444',targetEnemy:null});}
            game.sound.play('explosion');
        }
    }
];

// ============================================
// Arena Events (v4.0)
// ============================================

const ARENA_EVENTS = [
    {
        id:'gravity_storm', name:'🌀 Гравитационный шторм', desc:'Вспышки притяжения каждые 3с (r150, сила 80)', icon:'🌀', color:'#4488ff',
        tickTimer:0, tickInterval:3.0,
        effect(game,dt) {
            this.tickTimer-=dt;
            if(this.tickTimer<=0){this.tickTimer=this.tickInterval;const pullRadius=150;for(const e of game.enemies){if(!e.alive)continue;const dx=e.x-game.player.x,dy=e.y-game.player.y,dist=Math.sqrt(dx*dx+dy*dy);if(dist<pullRadius&&dist>0){e.x-=(dx/dist)*80*0.1;e.y-=(dy/dist)*80*0.1;}}game.spawnRing(game.player.x,game.player.y,'#4488ff',pullRadius);}
        }
    },
    {
        id:'dead_zone', name:'💀 Мёртвая зона', desc:'2-3 опасные зоны — 1 урон/сек', icon:'💀', color:'#ff2222',
        effect(game,dt) {
            if(!this.deadZones){this.deadZones=[];const count=2+Math.floor(Math.random()*2);for(let i=0;i<count;i++){this.deadZones.push({x:150+Math.random()*(game.width-300),y:150+Math.random()*(game.height-300),radius:60,pulse:0,dmgTimer:0});}}
            for(const dz of this.deadZones){dz.pulse+=dt*3;const dx=game.player.x-dz.x,dy=game.player.y-dz.y;if(Math.sqrt(dx*dx+dy*dy)<dz.radius+game.player.size/2){if(!dz.dmgTimer||dz.dmgTimer<=0){game.player.takeDamage(1);dz.dmgTimer=1.0;game.spawnParticles(game.player.x,game.player.y,'#ff2222',6);game.vibrate(40);}if(dz.dmgTimer>0)dz.dmgTimer-=dt;}}
        }
    },
    {
        id:'energy_rain', name:'⚡ Энергетический дождь', desc:'Случайные лазеры каждые 2с', icon:'⚡', color:'#ffff00',
        tickTimer:0, tickInterval:2.0,
        effect(game,dt) {
            this.tickTimer-=dt;
            if(this.tickTimer<=0){this.tickTimer=this.tickInterval;const horizontal=Math.random()<0.5;const x=100+Math.random()*(game.width-200);const y=100+Math.random()*(game.height-200);const lb=new LaserBeam(game.width,game.height);if(horizontal){lb.horizontal=true;lb.y=y;lb.x1=0;lb.x2=game.width;delete lb.x;}else{lb.horizontal=false;lb.x=x;lb.y1=0;lb.y2=game.height;delete lb.y;}game.laserBeams.push(lb);}
        }
    },
    {
        id:'portals', name:'🌀 Порталы', desc:'2 портала — враги телепортируются', icon:'🌀', color:'#aa44ff',
        effect(game,dt) {
            if(!this.portals){this.portals=[{x:60,y:game.height/2,radius:30},{x:game.width-60,y:game.height/2,radius:30}];}
            for(const e of game.enemies){if(e._portalCooldown>0)e._portalCooldown-=dt;}
            for(const e of game.enemies){if(!e.alive||e._portalCooldown>0)continue;for(const p of this.portals){const dx=e.x-p.x,dy=e.y-p.y;if(Math.sqrt(dx*dx+dy*dy)<p.radius+e.radius){const other=p===this.portals[0]?this.portals[1]:this.portals[0];e.x=other.x+(Math.random()-0.5)*40;e.y=other.y+(Math.random()-0.5)*40;e._portalCooldown=2.0;game.spawnParticles(e.x,e.y,'#aa44ff',6);break;}}}
        }
    },
    {
        id:'blood_moon', name:'🩸 Кровавая луна', desc:'Враги +50% HP, но оставляют лечение', icon:'🩸', color:'#ff0066',
        init(game) { for(const e of game.enemies){if(!e.alive)continue;e.maxHp=Math.ceil(e.maxHp*1.5);e.hp=e.maxHp;} },
        effect(game,dt) {}
    }
];

// ============================================
// Rune System (v5.0)
// ============================================

const RUNE_DEFS = [
    { id:'rune_power', name:'⚡ Сила', desc:'+20% урон', icon:'⚡', color:'#ff4444', apply(p) { p.damage*=1.2; } },
    { id:'rune_vita', name:'❤ Жизнь', desc:'+2 HP, +10% реген', icon:'❤', color:'#44ff44', apply(p) { p.maxHp+=2;p.hp+=2;p.regenRate=(p.regenRate||0)+0.1; } },
    { id:'rune_swift', name:'💨 Скорость', desc:'+15% скорость, -30% кулдаун дэша', icon:'💨', color:'#44ddff', apply(p) { p.speed*=1.15;p.baseSpeed=p.speed;p.dashCooldownMax*=0.7; } },
    { id:'rune_fortune', name:'🍀 Удача', desc:'+15% крит, +30% к урону критов', icon:'🍀', color:'#ffdd00', apply(p) { p.critChance=(p.critChance||0)+0.15;p.critMultiplier=(p.critMultiplier||1.5)+0.3; } },
    { id:'rune_ward', name:'🛡 Защита', desc:'0.5с инвинс после удара', icon:'🛡', color:'#aa88ff', apply(p) { p.invincibleDuration+=0.5; } },
    { id:'rune_feast', name:'🩸 Пир', desc:'+25% вампиризм, -10% макс HP', icon:'🩸', color:'#cc2244', apply(p) { p.vampirism=true;p.vampirismChance=(p.vampirismChance||0.15)+0.25;p.maxHp=Math.max(1,p.maxHp-1);p.hp=Math.min(p.hp,p.maxHp); } },
    { id:'rune_haste', name:'⚡ Скорострельность', desc:'+15% скорострельность', icon:'⚡', color:'#ffdd44', apply(p) { p.fireRateMul=(p.fireRateMul||1)*0.85; } }
];

const MAX_ACTIVE_RUNES = 3;

// ============================================
// Echo System (v5.0) — temporary bonuses every 5 waves
// ============================================

const ECHO_DEFS = [
    { id:'echo_adrenaline', name:'⚡ Адреналин', desc:'+40% скорость на 2 волны', icon:'⚡', duration:2, apply(p){p.speed*=1.4;p.baseSpeed*=1.4;} },
    { id:'echo_glass', name:'🪟 Стеклянные пули', desc:'x2 урон, -50% HP на 2 волны', icon:'🪟', duration:2, apply(p){p.damage*=2;p.hp=Math.max(1,Math.floor(p.hp/2));} },
    { id:'echo_shield', name:'🛡 Щит', desc:'Невосприимчивость на 2 волны', icon:'🛡', duration:2, apply(p){p.invincible=true;p.invincibleTimer=999;} },
    { id:'echo_multi', name:'🔀 Залп', desc:'+2 projectiles на 2 волны', icon:'🔀', duration:2, apply(p){p.extraProjectiles=(p.extraProjectiles||0)+2;} },
    { id:'echo_magnet', name:'🧲 Магнит', desc:'Радиус магнита x3 на 2 волны', icon:'🧲', duration:2, apply(p){if(p.magnet)p.magnetRadius*=3;} },
    { id:'echo_crit', name:'🎯 Критический', desc:'+50% крит на 2 волны', icon:'🎯', duration:2, apply(p){p.critChance=(p.critChance||0)+0.5;} }
];

// ============================================
// Combo Abilities (v5.0) — unlocked by upgrading specific combos
// ============================================

const COMBO_DEFS = [
    { id:'combo_firestorm', name:'🔥 Огненный шторм', requires:['overcharge','explosiveBullets'], desc:'Взрывные пули: +50% радиус и +50% урон', apply(p){p.comboFirestorm=true;} },
    { id:'combo_ghostblade', name:'👻 Призрачный клинок', requires:['marksman','ghostShot'], desc:'Призрачный снайпер: x2 урон сквозь стены', apply(p){p.comboGhostblade=true;} },
    { id:'combo_thornshield', name:'🌵 Шипощит', requires:['thorns','phaseWalk'], desc:'Фазовые шипы: 3 урона при касании +反弹', apply(p){p.comboThornshield=true;} },
    { id:'combo_timewalker', name:'⏳ Временной охотник', requires:['timeWarp','ricochet'], desc:'При HP<25%: рикошет x3 + замедление', apply(p){p.comboTimewalker=true;} },
    { id:'combo_dronearmy', name:'🤖 Армия дронов', requires:['drone','barrage'], desc:'Дроны стреляют шквалом', apply(p){p.comboDroneArmy=true;} },
    { id:'combo_vampmagnet', name:'🩸 Жажда', requires:['vampirism','magnet'], desc:'Сферы лечат 2 HP вместо 1', apply(p){p.comboVampMagnet=true;} },
    { id:'combo_gravplode', name:'🌀 Грави-взрыв', requires:['graviton','explosiveBullets'], desc:'Взрывы притягивают врагов к центру', apply(p){p.comboGravPlode=true;} },
    { id:'combo_chronoblade', name:'⏳ Временной снайпер', requires:['timeWarp','marksman'], desc:'При замедлении времени: пули x2 урон', apply(p){p.comboChronoblade=true;} }
];

// ============================================
// SporeCloud — left by dead Spore enemies
// ============================================

class SporeCloud {
    constructor(x,y) { this.x=x; this.y=y; this.radius=60; this.life=5; this.active=true; this.phase=0; }
    update(dt) { this.life-=dt; if(this.life<=0){this.active=false;return;} this.phase+=dt*2; }
    draw(ctx) { const a=Math.min(1,this.life/2)*0.35; const p=Math.sin(this.phase)*5; const r=this.radius+p; ctx.globalAlpha=a; ctx.fillStyle='#44aa22'; ctx.shadowColor='#44aa22'; ctx.shadowBlur=12; ctx.beginPath(); ctx.arc(this.x,this.y,r,0,Math.PI*2); ctx.fill(); ctx.shadowBlur=0; ctx.strokeStyle='#66cc44'; ctx.lineWidth=1; ctx.globalAlpha=a*0.6; ctx.beginPath(); ctx.arc(this.x,this.y,r+3,0,Math.PI*2); ctx.stroke(); ctx.globalAlpha=1; }
}

// ============================================
// Puddle
// ============================================

class Puddle {
    constructor(x,y) { this.x=x; this.y=y; this.radius=0; this.maxRadius=40; this.life=5; this.active=true; this.pulsePhase=0; }
    update(dt) { this.life-=dt; if(this.life<=0){this.active=false;return;} if(this.radius<this.maxRadius){this.radius+=this.maxRadius*dt*2;if(this.radius>this.maxRadius)this.radius=this.maxRadius;} this.pulsePhase+=dt*3; }
    draw(ctx) { const a=Math.min(1,this.life/1.5)*0.6;const p=Math.sin(this.pulsePhase)*3;const r=this.radius+p; ctx.globalAlpha=a;ctx.fillStyle='#1a1a2e';ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#44ff44';ctx.lineWidth=1;ctx.globalAlpha=a*0.5;ctx.beginPath();ctx.arc(this.x,this.y,r+4,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1; }
}

// ============================================
// EnergySphere
// ============================================

class EnergySphere {
    constructor(x,y) { this.x=x; this.y=y; this.radius=6; this.life=8; this.alive=true; this.bobPhase=Math.random()*Math.PI*2; }
    update(dt,px,py,mr) { this.life-=dt;if(this.life<=0){this.alive=false;return;} this.bobPhase+=dt*4;const dx=px-this.x,dy=py-this.y,d=Math.sqrt(dx*dx+dy*dy);if(d<mr&&d>5){const s=250;this.x+=(dx/d)*s*dt;this.y+=(dy/d)*s*dt;} }
    draw(ctx) { const b=Math.sin(this.bobPhase)*2;const a=Math.min(1,this.life/2);const sm=window.__spriteMgr;const used=sm?sm.draw(ctx,'energy_sphere',this.x,this.y+b,this.radius*3,{alpha:a}):false;if(!used){ctx.globalAlpha=a;ctx.fillStyle='#ffdd00';ctx.shadowColor='#ffdd00';ctx.shadowBlur=6;ctx.beginPath();ctx.arc(this.x,this.y+b,this.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;} }
}

// ============================================
// ArtifactDrop
// ============================================

class ArtifactDrop {
    constructor(x,y,def) { this.x=x; this.y=y; this.def=def; this.radius=16; this.life=15; this.alive=true; this.phase=0; }
    update(dt) { this.life-=dt;if(this.life<=0){this.alive=false;} this.phase+=dt*3; }
    draw(ctx) { const a=Math.min(1,this.life/3);const pulse=Math.sin(this.phase)*3;const sm=window.__spriteMgr;const used=sm?sm.draw(ctx,'artifact',this.x,this.y,this.radius*2+pulse,{alpha:a,tint:this.def.color,tintAlpha:0.2}):false;if(!used){ctx.globalAlpha=a;ctx.fillStyle=this.def.color;ctx.shadowColor=this.def.color;ctx.shadowBlur=15;ctx.beginPath();ctx.arc(this.x,this.y,this.radius+pulse,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.font='16px Courier New';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(this.def.icon,this.x,this.y);ctx.textBaseline='alphabetic';ctx.globalAlpha=1;} }
}

// ============================================
// Mimic — disguised pickup enemy (v4.0)
// ============================================

class Mimic {
    constructor(x,y,disguisedAs) {
        this.x=x;this.y=y;this.disguisedAs=disguisedAs;
        this.radius=disguisedAs==='sphere'?8:14;
        this.hp=4;this.maxHp=4;this.damage=1;this.alive=true;this.activated=false;
        this.warningTimer=0;this.warningDuration=0.3;this.warningActive=false;
        this.miniMimics=[];this.speed=0;this.color='#ff2222';
        this.pulsePhase=Math.random()*Math.PI*2;this.score=20;
    }
    activate() {
        if(this.activated)return;this.activated=true;this.warningActive=true;this.warningTimer=this.warningDuration;
    }
    update(dt,playerX,playerY,arenaW,arenaH) {
        if(!this.alive)return;
        this.pulsePhase+=dt*3;
        if(!this.activated){
            const dx=playerX-this.x,dy=playerY-this.y;
            if(Math.sqrt(dx*dx+dy*dy)<60)this.activate();
            return;
        }
        if(this.warningActive){this.warningTimer-=dt;if(this.warningTimer<=0){this.warningActive=false;this.spawnMiniMimics();}return;}
        for(const mm of this.miniMimics){if(!mm.alive)continue;const dx=playerX-mm.x,dy=playerY-mm.y,d=Math.sqrt(dx*dx+dy*dy);if(d>0){mm.x+=(dx/d)*mm.speed*dt;mm.y+=(dy/d)*mm.speed*dt;}mm.life-=dt;if(mm.life<=0)mm.alive=false;mm.x=Math.max(mm.radius,Math.min(arenaW-mm.radius,mm.x));mm.y=Math.max(mm.radius,Math.min(arenaH-mm.radius,mm.y));}
        this.miniMimics=this.miniMimics.filter(m=>m.alive);
        if(this.miniMimics.length===0&&!this.warningActive){this.alive=false;}
    }
    spawnMiniMimics() {
        for(let i=0;i<4;i++){const a=(i/4)*Math.PI*2+Math.random()*0.3;this.miniMimics.push({x:this.x+Math.cos(a)*20,y:this.y+Math.sin(a)*20,speed:200,damage:1,radius:8,life:6.0,alive:true,color:'#ff4444'});}
    }
    takeDamage(amount) {
        if(!this.activated){this.activate();}this.hp-=amount;this.hitFlash=0.15;if(this.hp<=0)this.alive=false;
    }
    draw(ctx) {
        if(!this.alive)return;
        if(!this.activated){
            if(this.disguisedAs==='sphere'){
                const sm=window.__spriteMgr;const used=sm?sm.draw(ctx,'energy_sphere',this.x,this.y,this.radius*3,{alpha:1}):false;
                if(!used){ctx.fillStyle='#ffdd00';ctx.shadowColor='#ffdd00';ctx.shadowBlur=6;ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}
            } else {
                const sm=window.__spriteMgr;const used=sm?sm.draw(ctx,'artifact',this.x,this.y,this.radius*2,{alpha:1,tint:'#cc44ff',tintAlpha:0.2}):false;
                if(!used){ctx.fillStyle='#cc44ff';ctx.shadowColor='#cc44ff';ctx.shadowBlur=15;ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.font='14px Courier New';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('✦',this.x,this.y);ctx.textBaseline='alphabetic';}
            }
            return;
        }
        if(this.warningActive){
            const flash=Math.sin(this.pulsePhase*20)>0;
            ctx.fillStyle=flash?'#ff0000':'#ff6600';ctx.shadowColor='#ff0000';ctx.shadowBlur=12;
            ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
            ctx.strokeStyle='#ff2222';ctx.lineWidth=2;ctx.stroke();return;
        }
        ctx.fillStyle=this.color;ctx.shadowColor='#ff0000';ctx.shadowBlur=10;
        ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
        ctx.strokeStyle='#ff4444';ctx.lineWidth=2;ctx.stroke();
        const bw=this.radius*2;const bh=4;const bx=this.x-bw/2;const by=this.y-this.radius-10;
        ctx.fillStyle='#333';ctx.fillRect(bx,by,bw,bh);
        ctx.fillStyle=this.hp/this.maxHp>0.5?'#ff4444':'#ff0000';ctx.fillRect(bx,by,bw*(this.hp/this.maxHp),bh);
        for(const mm of this.miniMimics){if(!mm.alive)continue;ctx.fillStyle=mm.color;ctx.shadowColor='#ff0000';ctx.shadowBlur=6;ctx.beginPath();ctx.arc(mm.x,mm.y,mm.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#ff8888';ctx.beginPath();ctx.arc(mm.x,mm.y,mm.radius*0.4,0,Math.PI*2);ctx.fill();}
    }
}
// ============================================
// Projectile
// ============================================

class Projectile {
    constructor(x,y,dirX,dirY,speed,damage,radius) {
        this.x=x;this.y=y;this.dirX=dirX;this.dirY=dirY;this.speed=speed;this.damage=damage;
        this.radius=radius||4;this.alive=true;this.ricochetLeft=0;this.pierceLeft=0;
        this.isEnemy=false;this.hitEnemies=new Set();
        this.gravitonRadius=0;this.gravitonForce=0;
        this.explosive=false;this.explosiveRadius=0;this.explosiveDamage=0;this.ghost=false;
        this.slowOnHit=false;
    }
    update(dt,arenaW,arenaH,enemies) {
        if(this.gravitonRadius>0&&enemies){for(const e of enemies){if(!e.alive)continue;const dx=this.x-e.x,dy=this.y-e.y,d=Math.sqrt(dx*dx+dy*dy);if(d<this.gravitonRadius&&d>5){const f=this.gravitonForce*(1-d/this.gravitonRadius);e.x+=(dx/d)*f*dt;e.y+=(dy/d)*f*dt;}}}
        this.x+=this.dirX*this.speed*dt;this.y+=this.dirY*this.speed*dt;
        if(this.ricochetLeft>0){
            let b=false;
            if(this.x<this.radius){this.dirX=Math.abs(this.dirX);this.x=this.radius;b=true;}
            if(this.x>arenaW-this.radius){this.dirX=-Math.abs(this.dirX);this.x=arenaW-this.radius;b=true;}
            if(this.y<this.radius){this.dirY=Math.abs(this.dirY);this.y=this.radius;b=true;}
            if(this.y>arenaH-this.radius){this.dirY=-Math.abs(this.dirY);this.y=arenaH-this.radius;b=true;}
            if(b)this.ricochetLeft--;
        } else {
            if(this.x<-this.radius||this.x>arenaW+this.radius||this.y<-this.radius||this.y>arenaH+this.radius)this.alive=false;
        }
    }
    draw(ctx) {
        const sm=window.__spriteMgr;
        const sz=this.radius*3;
        let sid='proj_player';
        if(this.isEnemy)sid='proj_enemy';
        else if(this.ghost)sid='proj_ghost';
        const used=sm?sm.draw(ctx,sid,this.x,this.y,sz):false;
        if(!used){
            if(this.isEnemy){ctx.fillStyle='#ff4444';ctx.shadowColor='#ff4444';}
            else if(this.ghost){ctx.fillStyle='#aa88ff';ctx.shadowColor='#aa88ff';ctx.globalAlpha=0.7;}
            else{ctx.fillStyle='#ffdd00';ctx.shadowColor='#ffdd00';}
            ctx.shadowBlur=8;ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;
        }
    }
}
// ============================================
// Enemy — with 8 elite modifiers + wave mods
// ============================================

class Enemy {
    constructor(x,y,type,wave,waveMod) {
        this.x=x;this.y=y;this.type=type;this.shootCooldown=0;this.alive=true;this.hitFlash=0;
        this.isElite=false;this.eliteModifier=null;this.shieldedHits=0;this.regenTimer=0;
        this.ghostTimer=0;this.ghostPhaseActive=false;
        this.growthScale=1;this.waveMod=waveMod||null;
        switch(type){
            case'swarm':this.radius=6;this.speed=200;this.hp=1;this.maxHp=1;this.color='#66aa44';this.score=5;this.contactDamage=0.5;break;
            case'fast':this.radius=10;this.speed=180;this.hp=1;this.maxHp=1;this.color='#ff8800';this.score=15;break;
            case'shooter':this.radius=14;this.speed=50;this.hp=3;this.maxHp=3;this.color='#aa44ff';this.score=25;this.preferredDist=200;this.shootRate=2;this.shootCooldown=this.shootRate;this.projectileSpeed=200;break;
            case'sludger':this.radius=18;this.speed=60;this.hp=2;this.maxHp=2;this.color='#2a2a3a';this.score=20;this.puddleCooldown=3;this.puddleTimer=2;break;
            case'blinker':this.radius=12;this.speed=0;this.hp=1;this.maxHp=1;this.color='#dddd44';this.score=20;this.blinkTimer=2.5;this.blinkCooldown=2.5;this.visible=true;this.fadeTimer=0;this.teleportTarget=null;this.teleportIndicator=null;this.shootRate=2;this.shootCooldown=1.5;this.projectileSpeed=180;break;
            case'tank':this.radius=24;this.speed=40;this.hp=8;this.maxHp=8;this.color='#22aa44';this.score=30;this.enraged=false;this.justEnraged=false;this.contactDamage=2;break;
            case'miniboss':this.radius=28;this.speed=70;this.hp=40;this.maxHp=40;this.color='#cc22ff';this.score=200;this.preferredDist=220;this.shootRate=1.5;this.shootCooldown=this.shootRate;this.projectileSpeed=250;this.tripleShot=true;break;
            case'boss':this.radius=40;this.speed=50;this.hp=120;this.maxHp=120;this.color='#ff0066';this.score=500;this.preferredDist=250;this.shootRate=1.0;this.shootCooldown=this.shootRate;this.projectileSpeed=280;this.tripleShot=true;this.bossPhase=0;break;
            case'phantom':this.radius=16;this.speed=70;this.hp=2;this.maxHp=2;this.color='#8844cc';this.score=35;this.phaseTimer=0;this.phaseInterval=3;this.visible=true;this.visibleTimer=2.5;this.invisibleTimer=0;this.teleportCooldown=0;this.teleportIndicator=null;this.teleportTarget=null;break;
            case'lancer':this.radius=14;this.speed=100;this.hp=4;this.maxHp=4;this.color='#cc4444';this.score=30;this.chargeState='idle';this.chargeTimer=0;this.chargeDirX=0;this.chargeDirY=0;this.chargeSpeed=400;this.chargeDuration=0;this.prepIndicator=null;break;
            case'summoner':this.radius=18;this.speed=40;this.hp=5;this.maxHp=5;this.color='#cc88ff';this.score=40;this.summonCooldown=5;this.summonTimer=3;this.shootRate=2.5;this.shootCooldown=2;this.projectileSpeed=180;this.preferredDist=280;this.summonsLeft=3;break;
            case'warlock':this.radius=16;this.speed=60;this.hp=6;this.maxHp=6;this.color='#8844ff';this.score=50;this.preferredDist=250;this.teleportAllyCooldown=5;this.teleportAllyTimer=3;this.debuffCooldown=8;this.debuffTimer=5;break;
            case'spore':this.radius=10;this.speed=40;this.hp=1;this.maxHp=1;this.color='#44aa22';this.score=12;break;
            case'miniboss_wave':this.radius=32;this.speed=60;this.hp=80;this.maxHp=80;this.color='#ff6600';this.score=300;this.preferredDist=200;this.shootRate=3;this.shootCooldown=1.5;this.projectileSpeed=220;this.ringBlastCooldown=3;this.ringBlastTimer=0;this.tripleShot=false;break;
            case'miniboss_mirror':this.radius=34;this.speed=55;this.hp=120;this.maxHp=120;this.color='#00ccff';this.score=400;this.preferredDist=200;this.mirrorTimer=0;this.mirrorInterval=4;this.tripleShot=true;this.shootRate=1.2;this.shootCooldown=1;this.projectileSpeed=250;break;
            case'miniboss_crystal':this.radius=36;this.speed=45;this.hp=200;this.maxHp=200;this.color='#44ffff';this.score=500;this.preferredDist=180;this.splitAt=0.5;this.hasSplit=false;this.tripleShot=true;this.shootRate=1.0;this.shootCooldown=0.5;this.projectileSpeed=260;break;
            case'revenant':this.radius=14;this.speed=70;this.hp=5;this.maxHp=5;this.color='#9944aa';this.score=45;this.resurrected=false;this.resurrectTimer=0;this.resurrecting=false;this.resurrectDelay=1.5;break;
            case'conductor':this.radius=16;this.speed=55;this.hp=7;this.maxHp=7;this.color='#ffaa00';this.score=55;this.linkRadius=150;this.linkBonus=0.3;this.buffTimer=0;this.buffInterval=4;this.shootRate=2.5;this.shootCooldown=2;this.projectileSpeed=200;this.preferredDist=240;break;
            case'mimic_king':this.radius=20;this.speed=50;this.hp=15;this.maxHp=15;this.color='#aa8844';this.score=80;this.mimicSpawnCooldown=6;this.mimicSpawnTimer=4;this.preferredDist=200;this.mimicKingActive=true;break;
            case'pulsar':this.radius=14;this.speed=0;this.hp=4;this.maxHp=4;this.color='#ff3355';this.score=25;this.pulsarCycle=3.0;this.pulsarTimer=2.0;this.pulsarRadius=90;this.contactDamage=0;break;
            default:this.radius=16;this.speed=80;this.hp=2;this.maxHp=2;this.color='#ff2222';this.score=10;break;
        }
        this.slowTimer=0;
        // Wave modifier: fortify (-50% damage taken)
        if(this.waveMod==='fortify'&&type!=='miniboss'&&type!=='boss'){
            this.fortified=true;
        }
        // Zombie challenge mode: x3 HP, -50% speed
        if(window._zombieMode&&type!=='miniboss'&&type!=='boss'){
            this.maxHp=Math.round(this.maxHp*3);this.hp=this.maxHp;this.speed*=0.5;
            this.contactDamage=0;this.zombieInfected=false;
        }
        // Wave modifier: chaos — add random elite
        if(this.waveMod==='chaos'&&type!=='miniboss'&&type!=='boss'){
            this.isElite=true;this.eliteModifier=ELITE_MODIFIERS[Math.floor(Math.random()*4)];
            this.maxHp=Math.round(this.maxHp*1.5);this.hp=this.maxHp;this.score=Math.round(this.score*2);
            if(this.eliteModifier==='shielded')this.shieldedHits=1;
            if(this.eliteModifier==='frenzied'){this.speed*=2;this.hp=Math.max(1,Math.floor(this.maxHp*0.5));this.maxHp=this.hp;}
        }
        // Elite check (wave 4+, not miniboss/boss)
            if(!this.isElite&&wave>=4&&type!=='miniboss'&&type!=='boss'&&Math.random()<Math.min(0.3,0.1+wave*0.02)){
            this.isElite=true;this.eliteModifier=ELITE_MODIFIERS[Math.floor(Math.random()*ELITE_MODIFIERS.length)];
            this.maxHp=Math.round(this.maxHp*1.5);this.hp=this.maxHp;this.score=Math.round(this.score*2);
            if(this.eliteModifier==='shielded')this.shieldedHits=1;
            if(this.eliteModifier==='frenzied'){this.speed*=2;this.hp=Math.max(1,Math.floor(this.maxHp*0.5));this.maxHp=this.hp;}
        }
        this.baseSpeed=this.speed;
        // v6.0: Ascension depth scaling
        if(window._ascension>0&&type!=='swarm'){
            const asc=window._ascension;
            this.maxHp=Math.max(this.maxHp,Math.round(this.maxHp*(1+0.1*asc)));
            this.hp=this.maxHp;
            this.speed*=1+0.03*asc;this.baseSpeed=this.speed;
            this.score=Math.round(this.score*(1+0.2*asc));
        }
    }
    update(dt,playerX,playerY,arenaW,arenaH,puddles,enemies) {
        const dx=playerX-this.x,dy=playerY-this.y,len=Math.sqrt(dx*dx+dy*dy);
        // Slow debuff (ion beam / Разлом времени)
        if(this.slowTimer>0){this.slowTimer-=dt;this.speed=this.baseSpeed*0.5;}
        else if(this.speed!==this.baseSpeed&&!this.frozen){this.speed=this.baseSpeed;}
        // Frozen check (Chronosphere)
        if(this.frozen){this.frozenTimer-=dt;if(this.frozenTimer<=0){this.frozen=false;this.speed=this.baseSpeed||100;}else{return;}}
        // Fortify modifier (handled in takeDamage — -50% damage taken)
        // Regenerating elite
        if(this.isElite&&this.eliteModifier==='regenerating'){this.regenTimer+=dt;if(this.regenTimer>=3&&this.hp<this.maxHp){this.hp=Math.min(this.hp+1,this.maxHp);this.regenTimer=0;}}
        // Ghost elite — periodic invulnerability
        if(this.isElite&&this.eliteModifier==='ghost'){this.ghostTimer+=dt;if(this.ghostTimer>=5&&!this.ghostPhaseActive){this.ghostPhaseActive=true;this.ghostTimer=0;}if(this.ghostPhaseActive){this.ghostTimer+=dt;if(this.ghostTimer>=1){this.ghostPhaseActive=false;this.ghostTimer=0;}}}
        if(this.hitFlash>0)this.hitFlash-=dt;
        if(this.type==='swarm'){if(len>0){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}return;}
        if(this.type==='spore'){if(len>0){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}return;}
        // Revenant: resurrect once at 50% HP after 1.5s
        if(this.type==='revenant'){
            if(this.resurrecting){this.resurrectTimer-=dt;if(this.resurrectTimer<=0){this.resurrecting=false;this.resurrected=true;this.hp=Math.round(this.maxHp*0.5);this.maxHp=this.hp;this.speed*=1.2;this.color='#cc66ee';this.spawnParticles&&this.spawnParticles(this.x,this.y,'#cc66ee',8);}}else if(len>0){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}return;
        }
        // Conductor: buffs nearby allies + shoots
        if(this.type==='conductor'){
            this.buffTimer+=dt;this.shootCooldown-=dt;
            if(this.buffTimer>=this.buffInterval){this.buffTimer=0;for(const e of enemies){if(!e.alive||e===this)continue;const ex=e.x-this.x,ey=e.y-this.y;if(Math.sqrt(ex*ex+ey*ey)<this.linkRadius){e.speed*=1.2;e.baseSpeed*=1.2;if(e.projectileDamage)e.projectileDamage*=1.3;}}}
            if(len>0){if(len<this.preferredDist-30){this.x-=(dx/len)*this.speed*dt;this.y-=(dy/len)*this.speed*dt;}else if(len>this.preferredDist+30){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
            return;
        }
        // Mimic King: stays at distance, spawns fake pickup mimics
        if(this.type==='mimic_king'){
            this.mimicSpawnTimer-=dt;
            if(this.mimicSpawnTimer<=0){
                this.mimicSpawnTimer=this.mimicSpawnCooldown;
                // Signal to game to spawn a mimic at this position
                this._spawnMimic=true;
            }
            if(len>0){if(len<this.preferredDist-30){this.x-=(dx/len)*this.speed*dt;this.y-=(dy/len)*this.speed*dt;}else if(len>this.preferredDist+30){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
            return;
        }
        // Pulsar: stationary bomb, explodes every cycle
        if(this.type==='pulsar'){
            this.pulsarTimer-=dt;
            if(this.pulsarTimer<=0){this.pulsarTimer=this.pulsarCycle;this._pulsarExplode=true;}
            return;
        }
        if(this.type==='shooter'||this.type==='miniboss'||this.type==='boss'||this.type==='miniboss_mirror'){
            this.shootCooldown-=dt;
            if(this.type==='miniboss_mirror'){
                // Mirror mechanic: move mirrored from player relative to arena center
                this.mirrorTimer+=dt;
                const arenaCenterX=arenaW/2,arenaCenterY=arenaH/2;
                const mirrorTargetX=arenaCenterX-(playerX-arenaCenterX);
                const mirrorTargetY=arenaCenterY-(playerY-arenaCenterY);
                const mdx=mirrorTargetX-this.x,mdy=mirrorTargetY-this.y,md=Math.sqrt(mdx*mdx+mdy*mdy);
                if(md>5){this.x+=(mdx/md)*this.speed*dt;this.y+=(mdy/md)*this.speed*dt;}
            } else if(len>0){if(len<this.preferredDist-30){this.x-=(dx/len)*this.speed*dt;this.y-=(dy/len)*this.speed*dt;}else if(len>this.preferredDist+30){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
            if(this.type==='boss'){this.bossPhase+=dt;}
        }
        // Mini-boss special behaviors
        if(this.type==='miniboss_wave'){
            this.ringBlastTimer+=dt;
            if(!this._ringBlastFired&&this.ringBlastTimer>=3){this._ringBlastFired=true;}
        }
        if(this.type==='miniboss_crystal'&&!this.hasSplit&&this.hp<=this.maxHp*this.splitAt){this.hasSplit=true;this._shouldSplit=true;}
        else if(this.type==='warlock'){
            this.shootCooldown-=dt;this.teleportAllyTimer-=dt;this.debuffTimer-=dt;
            if(len>0){if(len<this.preferredDist-40){this.x-=(dx/len)*this.speed*dt;this.y-=(dy/len)*this.speed*dt;}else if(len>this.preferredDist+40){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
        }
        else if(this.type==='sludger'){this.puddleTimer-=dt;if(len>0){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
        else if(this.type==='tank'){if(!this.enraged&&this.hp<3){this.enraged=true;this.justEnraged=true;this.speed=160;this.baseSpeed=160;this.color='#882222';}if(len>0){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
        else if(this.type==='blinker'){
            this.shootCooldown-=dt;this.blinkTimer-=dt;
            if(this.blinkTimer<=0.5&&!this.teleportIndicator){const a=Math.random()*Math.PI*2;const d=80+Math.random()*70;this.teleportTarget={x:playerX+Math.cos(a)*d,y:playerY+Math.sin(a)*d};this.teleportTarget.x=Math.max(this.radius,Math.min(arenaW-this.radius,this.teleportTarget.x));this.teleportTarget.y=Math.max(this.radius,Math.min(arenaH-this.radius,this.teleportTarget.y));this.teleportIndicator={...this.teleportTarget,phase:0};}
            if(this.teleportIndicator)this.teleportIndicator.phase+=dt*10;
            if(this.blinkTimer<=0){if(this.teleportTarget){this.x=this.teleportTarget.x;this.y=this.teleportTarget.y;this.teleportTarget=null;this.teleportIndicator=null;}this.blinkTimer=this.blinkCooldown;this.visible=true;this.fadeTimer=0;}
            return;
        }
        else if(this.type==='phantom'){
            this.phaseTimer+=dt;this.teleportCooldown-=dt;
            if(this.visible){
                this.visibleTimer-=dt;
                if(this.visibleTimer<=0){this.visible=false;this.invisibleTimer=1.5;this.teleportCooldown=0.5;}
                else{if(len>0){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
            } else {
                this.invisibleTimer-=dt;
                if(this.invisibleTimer<=0){
                    if(this.teleportCooldown<=0){
                        const a=Math.random()*Math.PI*2;const d=60+Math.random()*100;
                        this.teleportTarget={x:playerX+Math.cos(a)*d,y:playerY+Math.sin(a)*d};
                        this.teleportTarget.x=Math.max(this.radius,Math.min(arenaW-this.radius,this.teleportTarget.x));
                        this.teleportTarget.y=Math.max(this.radius,Math.min(arenaH-this.radius,this.teleportTarget.y));
                        this.teleportIndicator={...this.teleportTarget,phase:0};
                    }
                }
                if(this.teleportIndicator)this.teleportIndicator.phase+=dt*12;
                if(this.invisibleTimer<=-0.5&&this.teleportTarget){
                    this.x=this.teleportTarget.x;this.y=this.teleportTarget.y;
                    this.visible=true;this.visibleTimer=2.5;
                    this.teleportTarget=null;this.teleportIndicator=null;
                    this.teleportCooldown=2;
                }
            }
            return;
        }
        else if(this.type==='lancer'){
            if(this.chargeState==='idle'){
                this.chargeTimer+=dt;
                if(this.chargeTimer>=2&&len>0){
                    this.chargeState='prep';
                    this.chargeDirX=dx/len;this.chargeDirY=dy/len;
                    this.prepIndicator={x:this.x,y:this.y,dirX:this.chargeDirX,dirY:this.chargeDirY,phase:0};
                    this.chargeTimer=0;
                } else {if(len>0){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
            } else if(this.chargeState==='prep'){
                this.prepIndicator.phase+=dt*8;this.chargeTimer+=dt;
                if(this.chargeTimer>=0.6){this.chargeState='charge';this.chargeDuration=0.4;this.chargeTimer=0;this.prepIndicator=null;}
            } else if(this.chargeState==='charge'){
                this.chargeDuration-=dt;
                this.x+=this.chargeDirX*this.chargeSpeed*dt;this.y+=this.chargeDirY*this.chargeSpeed*dt;
                this.x=Math.max(this.radius,Math.min(arenaW-this.radius,this.x));
                this.y=Math.max(this.radius,Math.min(arenaH-this.radius,this.y));
                if(this.chargeDuration<=0){this.chargeState='rest';this.chargeTimer=0;}
            } else if(this.chargeState==='rest'){
                this.chargeTimer+=dt;
                if(len>0){this.x+=(dx/len)*this.speed*0.5*dt;this.y+=(dy/len)*this.speed*0.5*dt;}
                if(this.chargeTimer>=1.5){this.chargeState='idle';this.chargeTimer=0;}
            }
            return;
        }
        else if(this.type==='summoner'){
            this.shootCooldown-=dt;this.summonTimer-=dt;
            if(len>0){if(len<this.preferredDist-40){this.x-=(dx/len)*this.speed*dt;this.y-=(dy/len)*this.speed*dt;}else if(len>this.preferredDist+40){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
        }
        else{if(len>0){this.x+=(dx/len)*this.speed*dt;this.y+=(dy/len)*this.speed*dt;}}
    }
    tryShoot(playerX,playerY) {
        if(this.type==='shooter'||this.type==='miniboss'||this.type==='boss'){
            if(this.shootCooldown>0)return null;this.shootCooldown=this.shootRate;
            const dx=playerX-this.x,dy=playerY-this.y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return null;
            const projectiles=[];
            if(this.tripleShot){const s=0.25;for(const o of[-s,0,s]){const rx=(dx/len)*Math.cos(o)-(dy/len)*Math.sin(o);const ry=(dx/len)*Math.sin(o)+(dy/len)*Math.cos(o);const p=new Projectile(this.x,this.y,rx,ry,this.projectileSpeed,1,6);p.isEnemy=true;projectiles.push(p);}}
            else{const p=new Projectile(this.x,this.y,dx/len,dy/len,this.projectileSpeed,1,5);p.isEnemy=true;projectiles.push(p);}
            if(this.waveMod==='ricochetWalls'){projectiles.forEach(p=>p.ricochetLeft=2);}
            return projectiles;
        }
        // Miniboss wave 15: ring blast
        if(this.type==='miniboss_wave'&&this._ringBlastFired){
            this._ringBlastFired=false;this.ringBlastTimer=0;
            const projectiles=[];
            for(let i=0;i<12;i++){const a=(i/12)*Math.PI*2;const p=new Projectile(this.x,this.y,Math.cos(a),Math.sin(a),200,1.5,5);p.isEnemy=true;projectiles.push(p);}
            return projectiles;
        }
        if(this.type==='blinker'&&this.visible){if(this.shootCooldown>0)return null;this.shootCooldown=this.shootRate;const dx=playerX-this.x,dy=playerY-this.y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return null;const p=new Projectile(this.x,this.y,dx/len,dy/len,this.projectileSpeed,1,5);p.isEnemy=true;if(this.waveMod==='ricochetWalls')p.ricochetLeft=2;return[p];}
        if(this.type==='summoner'){if(this.shootCooldown>0)return null;this.shootCooldown=this.shootRate;const dx=playerX-this.x,dy=playerY-this.y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return null;const projectiles=[];for(let i=-1;i<=1;i++){const angle=Math.atan2(dy,dx)+i*0.3;const p=new Projectile(this.x,this.y,Math.cos(angle),Math.sin(angle),this.projectileSpeed,1,5);p.isEnemy=true;if(this.waveMod==='ricochetWalls')p.ricochetLeft=2;projectiles.push(p);}return projectiles;}
        if(this.type==='warlock'){if(this.shootCooldown>0)return null;this.shootCooldown=2.0;const dx=playerX-this.x,dy=playerY-this.y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return null;const projectiles=[];const p=new Projectile(this.x,this.y,dx/len,dy/len,180,0.8,5);p.isEnemy=true;projectiles.push(p);return projectiles;}
        if(this.type==='conductor'){if(this.shootCooldown>0)return null;this.shootCooldown=this.shootRate;const dx=playerX-this.x,dy=playerY-this.y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return null;const projectiles=[];for(let i=-1;i<=1;i++){const angle=Math.atan2(dy,dx)+i*0.2;const p=new Projectile(this.x,this.y,Math.cos(angle),Math.sin(angle),this.projectileSpeed,1,5);p.isEnemy=true;projectiles.push(p);}return projectiles;}
        return null;
    }
    tryPlacePuddle(puddles) { if(this.type!=='sludger')return null;if(this.puddleTimer>0)return null;this.puddleTimer=this.puddleCooldown;return new Puddle(this.x,this.y); }
    trySummon(enemies,wave) {
        if(this.type!=='summoner')return null;
        if(this.summonsLeft<=0||this.summonTimer>0)return null;
        this.summonTimer=this.summonCooldown;this.summonsLeft--;
        const newEnemies=[];
        for(let i=0;i<2;i++){
            const a=Math.random()*Math.PI*2;const d=30+Math.random()*30;
            const ne=new Enemy(this.x+Math.cos(a)*d,this.y+Math.sin(a)*d,'swarm',wave);
            ne.maxHp=1;ne.hp=1;newEnemies.push(ne);
        }
        return newEnemies;
    }
    tryTeleportAlly(enemies,playerX,playerY) {
        if(this.type!=='warlock'||this.teleportAllyTimer>0)return null;
        this.teleportAllyTimer=this.teleportAllyCooldown;
        let closest=null,minDist=Infinity;
        for(const e of enemies){
            if(!e.alive||e===this||e.type==='warlock'||e.type==='miniboss'||e.type==='boss'||e.type==='miniboss_wave'||e.type==='miniboss_mirror'||e.type==='miniboss_crystal'||e.type==='pulsar')continue;
            const d=Math.sqrt((e.x-playerX)*(e.x-playerX)+(e.y-playerY)*(e.y-playerY));
            if(d>200&&d<minDist){minDist=d;closest=e;}
        }
        if(closest){const a=Math.random()*Math.PI*2;const d=30+Math.random()*40;closest.x=playerX+Math.cos(a)*d;closest.y=playerY+Math.sin(a)*d;return closest;}
        return null;
    }
    tryApplyWeakness(player) {
        if(this.type!=='warlock'||this.debuffTimer>0)return false;
        this.debuffTimer=this.debuffCooldown;
        const dist=Math.sqrt((player.x-this.x)*(player.x-this.x)+(player.y-this.y)*(player.y-this.y));
        if(dist<200){player.applyWeakness(3);return true;}
        return false;
    }
    onDeathSpore() { return this.type==='spore'?new SporeCloud(this.x,this.y):null; }
    trySplit(enemies,wave,waveMod) {
        if(this.type!=='miniboss_crystal'||!this._shouldSplit)return null;
        this._shouldSplit=false;
        const newEnemies=[];
        for(let i=0;i<4;i++){const a=(i/4)*Math.PI*2+Math.random()*0.3;const ne=new Enemy(this.x+Math.cos(a)*40,this.y+Math.sin(a)*40,'shooter',wave,waveMod);ne.hp=Math.round(ne.maxHp*0.7);ne.maxHp=ne.hp;ne.isElite=true;ne.eliteModifier='frenzied';ne.speed*=2;ne.baseSpeed=ne.speed;ne.score*=2;newEnemies.push(ne);}
        return newEnemies;
    }
    applyEndlessScaling(wave) {
        if(wave<=10)return;
        const scale=Math.pow(1.15,wave-10);
        this.maxHp=Math.round(this.maxHp*scale);this.hp=this.maxHp;
        this.score=Math.round(this.score*(1+0.1*(wave-10)));
    }
    takeDamage(amount) {
        if(this.isElite&&this.eliteModifier==='ghost'&&this.ghostPhaseActive)return;
        if(this.isElite&&this.eliteModifier==='shielded'&&this.shieldedHits>0){this.shieldedHits--;this.hitFlash=0.15;return;}
        if(this.fortified)amount=Math.max(1,Math.floor(amount*0.5));
        this.hp-=amount;this.hitFlash=0.1;
        // Revenant: resurrect once instead of dying
        if(this.hp<=0&&this.type==='revenant'&&!this.resurrected&&!this.resurrecting){
            this.resurrecting=true;this.resurrectTimer=this.resurrectDelay;this.hp=1;this.color='#442266';return;
        }
        if(this.hp<=0)this.alive=false;
    }
    getSpriteName() {
        const map = {
            swarm:'enemy_swarm', fast:'enemy_fast', crawler:'enemy_crawler',
            shooter:'enemy_shooter', sludger:'enemy_sludger', blinker:'enemy_blinker',
            tank:'enemy_tank', phantom:'enemy_phantom', lancer:'enemy_lancer',
            summoner:'enemy_summoner', miniboss:'enemy_miniboss', boss:'enemy_boss',
            warlock:'enemy_summoner', spore:'enemy_swarm', revenant:'enemy_crawler',
            conductor:'enemy_shooter', mimic_king:'enemy_tank', pulsar:'enemy_swarm',
            miniboss_wave:'enemy_miniboss', miniboss_mirror:'enemy_miniboss', miniboss_crystal:'enemy_miniboss'
        };
        return map[this.type] || 'enemy_crawler';
    }
    draw(ctx) {
        const scale=this.growthScale||1;
        const r=this.radius*scale;
        if(this.type==='blinker'&&this.teleportIndicator){const ind=this.teleportIndicator;const blink=Math.sin(ind.phase)>0;if(blink){ctx.strokeStyle='#ffff44';ctx.lineWidth=2;ctx.globalAlpha=0.6;ctx.beginPath();ctx.arc(ind.x,ind.y,r+4,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}}
        if(this.type==='blinker'&&!this.visible)return;
        if(this.type==='phantom'&&!this.visible){
            if(this.teleportIndicator){const ind=this.teleportIndicator;const blink=Math.sin(ind.phase)>0;if(blink){ctx.strokeStyle='#aa66ff';ctx.lineWidth=2;ctx.globalAlpha=0.5;ctx.beginPath();ctx.arc(ind.x,ind.y,r+6,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}}
            return;
        }
        let alpha=1;
        if(this.isElite&&this.eliteModifier==='ghost'&&this.ghostPhaseActive){alpha=0.2+Math.sin(Date.now()*0.02)*0.2;}
        let tint=null;
        if(this.hitFlash>0){tint='#ffffff';}else if(this.isElite&&this.eliteModifier==='ice'){tint='#88ccff';}
        const sm=window.__spriteMgr;
        const sid=this.getSpriteName();
        const usedSprite=sm?sm.draw(ctx,sid,this.x,this.y,r*2,{alpha,tint,tintAlpha:0.4,hitFlash:this.hitFlash>0}):false;
        if(!usedSprite){
            ctx.globalAlpha=alpha;
            ctx.fillStyle=this.hitFlash>0?'#ffffff':this.color;
            if(this.isElite&&this.eliteModifier==='ice'){ctx.fillStyle='#88ccff';}
            ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fill();
            ctx.strokeStyle='rgba(0,0,0,0.5)';ctx.lineWidth=2;ctx.stroke();
            ctx.globalAlpha=1;
            if(this.type==='swarm'){ctx.fillStyle='rgba(150,255,100,0.4)';ctx.beginPath();ctx.arc(this.x,this.y,r*0.5,0,Math.PI*2);ctx.fill();}
            if(this.type==='shooter'||this.type==='miniboss'||this.type==='boss'||this.type==='miniboss_wave'||this.type==='miniboss_mirror'||this.type==='miniboss_crystal'){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(this.x,this.y,r*0.45,0,Math.PI*2);ctx.fill();ctx.fillStyle=this.type==='miniboss'?'#440088':this.type==='boss'?'#880022':this.type==='miniboss_wave'?'#884400':this.type==='miniboss_mirror'?'#004488':this.type==='miniboss_crystal'?'#008888':'#220044';ctx.beginPath();ctx.arc(this.x,this.y,r*0.2,0,Math.PI*2);ctx.fill();}
            if(this.type==='sludger'){ctx.fillStyle='#44ff44';ctx.globalAlpha=0.3;ctx.beginPath();ctx.arc(this.x,this.y,r*0.4,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
            if(this.type==='summoner'){
                ctx.fillStyle='#cc88ff';ctx.shadowColor='#aa44ff';ctx.shadowBlur=12;
                ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
                for(let i=0;i<3;i++){const a=(i/3)*Math.PI*2+Date.now()*0.002;const sx=this.x+Math.cos(a)*r*0.6;const sy=this.y+Math.sin(a)*r*0.6;ctx.fillStyle='#ff88ff';ctx.beginPath();ctx.arc(sx,sy,3,0,Math.PI*2);ctx.fill();}
                ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(this.x,this.y,r*0.35,0,Math.PI*2);ctx.fill();
                ctx.fillStyle='#660066';ctx.beginPath();ctx.arc(this.x,this.y,r*0.15,0,Math.PI*2);ctx.fill();
            }
            if(this.type==='warlock'){
                ctx.fillStyle='#8844ff';ctx.shadowColor='#8844ff';ctx.shadowBlur=12;
                ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
                for(let i=0;i<4;i++){const a=(i/4)*Math.PI*2+Date.now()*0.003;const sx=this.x+Math.cos(a)*r*0.7;const sy=this.y+Math.sin(a)*r*0.7;ctx.fillStyle='#dd88ff';ctx.beginPath();ctx.arc(sx,sy,2.5,0,Math.PI*2);ctx.fill();}
                ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(this.x,this.y,r*0.3,0,Math.PI*2);ctx.fill();
                ctx.fillStyle='#440088';ctx.beginPath();ctx.arc(this.x,this.y,r*0.12,0,Math.PI*2);ctx.fill();
                if(this.debuffTimer<2){ctx.strokeStyle='#ff4444';ctx.lineWidth=2;ctx.globalAlpha=0.5+Math.sin(Date.now()*0.01)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
            }
            if(this.type==='spore'){
                ctx.fillStyle='rgba(68,170,34,0.4)';ctx.beginPath();ctx.arc(this.x,this.y,r*0.5,0,Math.PI*2);ctx.fill();
                for(let i=0;i<3;i++){const a=(i/3)*Math.PI*2+Date.now()*0.004;const sx=this.x+Math.cos(a)*r*0.4;const sy=this.y+Math.sin(a)*r*0.4;ctx.fillStyle='#88cc44';ctx.globalAlpha=0.6;ctx.beginPath();ctx.arc(sx,sy,2,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
            }
        }
        if(this.type==='tank'){ctx.strokeStyle=this.enraged?'#ff4444':'#44ff44';ctx.lineWidth=3;const rr=r*0.7;ctx.beginPath();ctx.moveTo(this.x-rr,this.y-rr);ctx.lineTo(this.x+rr,this.y+rr);ctx.moveTo(this.x+rr,this.y-rr);ctx.lineTo(this.x-rr,this.y+rr);ctx.stroke();if(this.enraged){ctx.strokeStyle='#ff0000';ctx.lineWidth=2;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.008)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}}
        if(this.type==='pulsar'){
            const cycle=Math.max(0,Math.min(1,this.pulsarTimer/this.pulsarCycle));
            const flashing=cycle<0.35&&Math.sin(Date.now()*0.02)>0;
            ctx.strokeStyle=flashing?'#ff4444':'#ff3355';ctx.lineWidth=flashing?3:2;
            ctx.globalAlpha=flashing?0.9:0.3+cycle*0.5;
            ctx.beginPath();ctx.arc(this.x,this.y,this.pulsarRadius,0,Math.PI*2);ctx.stroke();
            ctx.globalAlpha=1;
            ctx.fillStyle=flashing?'#ff6666':'#ff3355';ctx.shadowColor='#ff3355';ctx.shadowBlur=12;
            ctx.beginPath();ctx.arc(this.x,this.y,r*0.55,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
            ctx.strokeStyle='#ff8888';ctx.lineWidth=1;ctx.globalAlpha=0.8;
            ctx.beginPath();ctx.arc(this.x,this.y,this.pulsarRadius*cycle,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
        }
        if(this.type==='blinker'){ctx.strokeStyle='#ffff44';ctx.lineWidth=2;for(let i=0;i<4;i++){const a=(i/4)*Math.PI*2;ctx.beginPath();ctx.moveTo(this.x+Math.cos(a)*r*0.3,this.y+Math.sin(a)*r*0.3);ctx.lineTo(this.x+Math.cos(a)*r*0.9,this.y+Math.sin(a)*r*0.9);ctx.stroke();}}
        if(this.type==='phantom'&&this.visible){
            ctx.strokeStyle='#dd88ff';ctx.lineWidth=2;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.008)*0.2;
            for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2+Date.now()*0.003;ctx.beginPath();ctx.arc(this.x+Math.cos(a)*r*0.5,this.y+Math.sin(a)*r*0.5,3,0,Math.PI*2);ctx.stroke();}
            ctx.globalAlpha=1;
        }
        if(this.type==='lancer'){
            if(this.chargeState==='prep'&&this.prepIndicator){
                ctx.strokeStyle='#ff4444';ctx.lineWidth=2;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.015)*0.3;
                ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.x+this.chargeDirX*80,this.y+this.chargeDirY*80);ctx.stroke();
                ctx.globalAlpha=1;
            }
            if(this.chargeState==='charge'){
                ctx.shadowColor='#ff4444';ctx.shadowBlur=15;
                for(let i=0;i<3;i++){const t=i/3;const ox=-this.chargeDirX*r*0.5*t;const oy=-this.chargeDirY*r*0.5*t;ctx.globalAlpha=0.3*(1-t);ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(this.x+ox,this.y+oy,r*0.7,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
                ctx.shadowBlur=0;
            }
            if(this.chargeState==='rest'){ctx.globalAlpha=0.5;ctx.fillStyle='#884444';ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
        }
        if(this.type==='miniboss'){ctx.strokeStyle='#ff00ff';ctx.lineWidth=3;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.005)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,r+6,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
        if(this.type==='boss'){ctx.strokeStyle='#ff0066';ctx.lineWidth=4;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.003)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,r+10,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
        if(this.type==='miniboss_wave'){ctx.strokeStyle='#ff6600';ctx.lineWidth=3;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.004)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
        if(this.type==='miniboss_mirror'){ctx.strokeStyle='#00ccff';ctx.lineWidth=3;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.004)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
        if(this.type==='miniboss_crystal'){ctx.strokeStyle='#44ffff';ctx.lineWidth=3;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.004)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,r+8,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
        if(this.isElite){ctx.strokeStyle='#ffdd00';ctx.lineWidth=3;ctx.shadowColor='#ffdd00';ctx.shadowBlur=10;ctx.globalAlpha=0.6+Math.sin(Date.now()*0.005)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,r+4,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;ctx.font='8px Courier New';ctx.textAlign='center';ctx.fillStyle='#ffdd00';ctx.fillText(ELITE_MOD_ICONS[this.eliteModifier]||'E',this.x,this.y-r-8);}
        const showBar=this.hp<this.maxHp||this.type==='miniboss'||this.type==='boss'||this.type==='miniboss_wave'||this.type==='miniboss_mirror'||this.type==='miniboss_crystal'||this.isElite||this.type==='summoner';
        if(showBar){const bw=r*2;const bh=this.type==='boss'?8:this.type==='miniboss'?6:4;const bx=this.x-bw/2;const by=this.y-r-10;ctx.fillStyle='#333';ctx.fillRect(bx,by,bw,bh);const ratio=this.hp/this.maxHp;ctx.fillStyle=ratio>0.5?'#44ff44':ratio>0.25?'#ffaa00':'#ff2222';ctx.fillRect(bx,by,bw*ratio,bh);}
    }
}
// ============================================
// Player
// ============================================

class Player {
    constructor(x,y,arenaW,arenaH) {
        this.x=x;this.y=y;this.size=32;this.speed=250;
        this.shootCooldown=0;this.shootRate=0.3;this.projectileSpeed=500;this.damage=1;
        this.fireRateMul=1;this.slowOnHit=false;
        this.projectileSize=4;this.tripleShot=false;
        this.maxHp=3;this.hp=this.maxHp;this.alive=true;
        this.invincible=false;this.invincibleTimer=0;this.invincibleDuration=1.5;this.blinkInterval=0.1;
        this.shieldOnWaveStart=false;this.arenaWidth=arenaW;this.arenaHeight=arenaH;
        this.marksman=false;this.pierceCount=0;this.barrageStacks=0;
        this.phaseWalk=false;this.phaseWalkStacks=0;this.phaseCooldownMax=3;this.phaseCooldown=0;this.phaseDamage=2;
        this.ricochetCount=0;this.magnet=false;this.magnetStacks=0;this.spheresPerHeal=5;this.magnetRadius=80;this.sphereCount=0;
        this.graviton=false;this.gravitonRadius=60;this.gravitonForce=50;
        this.vampirism=false;this.timeWarp=false;this.timeWarpCooldown=0;
        this.explosiveBullets=0;this.thorns=false;this.droneLevel=0;this.ghostShot=false;
        this.dashCooldown=0;this.dashCooldownMax=3;this.dashTimer=0;this.dashDuration=0.2;this.dashing=false;this.dashDirX=0;this.dashDirY=0;this.dashSpeed=600;
        this.combo=0;this.comboMultiplier=1;this.comboTimer=0;
        this.slowed=false;this.slowTimer=0;this.baseSpeed=this.speed;
        this.noShooting=false;this.critChance=0;
        // Artifacts
        this.echoArtifact=false;this.echoCounter=0;
        this.stasisArtifact=false;this.stasisCooldown=0;
        this.vortexArtifact=false;this.vortexRadius=150;
        this.chainLightning=false;this.extraUpgradeChoice=false;
        this.maxArtifactSlots=2;
        // Warlock debuff
        this.weaknessTimer=0;this.weaknessActive=false;
        // Weapon system
        this.currentWeapon='auto';
        this.weaponShootCooldown=0;
        // Spore cloud debuff
        this.sporeSlow=false;this.sporeSlowTimer=0;
        // Cosmetics
        this.playerColor=null;this.particleStyle=null;this.projectileShape=null;this.playerOutline=null;
        // v4.0
        this.phaseShifted=false;this.phaseShiftTimer=0;
        // Zombie infection
        this.zombieInfection=false;this.zombieInfectionTimer=0;this.zombieInfectionDmg=0;this.zombieInfectionTick=0;
        // Rage mode (v5.0)
        this.rageMode=false;this.rageTimer=0;this.rageTriggered=false;
        // v6.0
        this.timeWarpEmpowered=false;this.timeWarpEmpoweredTimer=0;
        this.comboVampMagnet=false;this.comboGravPlode=false;this.comboChronoblade=false;
    }
    update(dt,input) {
        if(this.slowed){this.slowTimer-=dt;if(this.slowTimer<=0)this.slowed=false;}
        if(this.sporeSlow){this.sporeSlowTimer-=dt;if(this.sporeSlowTimer<=0)this.sporeSlow=false;}
        if(this.weaknessTimer>0){this.weaknessTimer-=dt;if(this.weaknessTimer<=0)this.weaknessActive=false;}
        if(this.combo>0){this.comboTimer-=dt;if(this.comboTimer<=0){this.combo=0;this.comboMultiplier=1;}}
        if(this.timeWarpCooldown>0)this.timeWarpCooldown-=dt;
        if(this.dashCooldown>0)this.dashCooldown-=dt;
        if(this.stasisArtifact&&this.stasisCooldown>0)this.stasisCooldown-=dt;
        if(this.dashing){this.dashTimer-=dt;if(this.dashTimer<=0){this.dashing=false;this.invincible=false;}else{this.x+=this.dashDirX*this.dashSpeed*dt;this.y+=this.dashDirY*this.dashSpeed*dt;this.clampPosition();return null;}}
        if(!this.dashing&&input.isJustShiftPressed()&&this.dashCooldown<=0&&this.alive){
            const mx=input.mouseX-this.x,my=input.mouseY-this.y,len=Math.sqrt(mx*mx+my*my);
            if(len>5){this.dashDirX=mx/len;this.dashDirY=my/len;}else{this.dashDirX=0;this.dashDirY=0;}
            this.dashing=true;this.dashTimer=this.dashDuration;this.dashCooldown=this.dashCooldownMax;this.invincible=true;
            return{type:'dash'};
        }
        let dx=0,dy=0;
        if(input.isPressed('w')||input.isPressed('ц'))dy-=1;
        if(input.isPressed('s')||input.isPressed('ы'))dy+=1;
        if(input.isPressed('a')||input.isPressed('ф'))dx-=1;
        if(input.isPressed('d')||input.isPressed('в'))dx+=1;
        // Inversion modifier
        if(this._inverted){dx=-dx;dy=-dy;}
        if(dx!==0&&dy!==0){const len=Math.sqrt(dx*dx+dy*dy);dx/=len;dy/=len;}
        const currentSpeed=this.slowed?this.speed*0.5:this.speed;
        const prevX=this.x,prevY=this.y;
        this.x+=dx*currentSpeed*dt;this.y+=dy*currentSpeed*dt;this.clampPosition();
        if(this.phaseWalk&&this.alive){this.phaseCooldown-=dt;const moved=Math.abs(this.x-prevX)>0.5||Math.abs(this.y-prevY)>0.5;if(moved&&this.phaseCooldown<=0){this.phaseCooldown=this.phaseCooldownMax;return{type:'phasePhantom',x:prevX,y:prevY,damage:this.phaseDamage};}}
        if(this.shootCooldown>0)this.shootCooldown-=dt;
        if(this.invincible){this.invincibleTimer-=dt;if(this.invincibleTimer<=0)this.invincible=false;}
        // Iron Will cooldown
        if(this.ironWill&&this.ironWillCd>0)this.ironWillCd-=dt;
        // Rage mode timer
        if(this.rageMode){this.rageTimer-=dt;if(this.rageTimer<=0){this.rageMode=false;this.damage/=2;this.speed/=1.3;this.baseSpeed/=1.3;}}
        // v6.0: Chronoblade empowered timer
        if(this.timeWarpEmpowered){this.timeWarpEmpoweredTimer-=dt;if(this.timeWarpEmpoweredTimer<=0)this.timeWarpEmpowered=false;}
        // Zombie infection: +1 dmg/sec for 3s
        if(this.zombieInfection){
            this.zombieInfectionTimer-=dt;this.zombieInfectionTick+=dt;
            if(this.zombieInfectionTick>=1){this.zombieInfectionTick-=1;this.hp=Math.max(0,this.hp-this.zombieInfectionDmg);if(this.hp<=0){this.alive=false;}}
            if(this.zombieInfectionTimer<=0)this.zombieInfection=false;
        }
        return null;
    }
    addCombo(){this.combo++;this.comboTimer=2;if(this.combo>=20)this.comboMultiplier=5;else if(this.combo>=10)this.comboMultiplier=3;else if(this.combo>=5)this.comboMultiplier=2;else this.comboMultiplier=1;}
    resetCombo(){this.combo=0;this.comboMultiplier=1;this.comboTimer=0;}
    applySlow(d){this.slowed=true;this.slowTimer=d;}
    applyWeakness(d){this.weaknessTimer=d;this.weaknessActive=true;}
    activateShield(){this.invincible=true;this.invincibleTimer=3;}
    tryStasisBlock() {
        if(!this.stasisArtifact||this.stasisCooldown>0)return false;
        this.stasisCooldown=10;return true;
    }
    takeDamage(amount) {
        if(this.invincible||!this.alive)return false;
        if(this.tryStasisBlock())return false;
        // Iron Will: at 1 HP, prevent lethal hit (30s cooldown)
        if(this.ironWill&&this.hp<=1&&this.ironWillCd<=0){this.ironWillCd=30;this.hp=1;this.invincible=true;this.invincibleTimer=this.invincibleDuration+0.5;this.resetCombo();return false;}
        this.hp-=amount;this.invincible=true;this.invincibleTimer=this.invincibleDuration;this.resetCombo();
        // Rage mode: activate when HP drops below 30%
        if(!this.rageMode&&this.hp>0&&this.hp<=this.maxHp*0.3&&!this.rageTriggered){this.rageMode=true;this.rageTimer=5;this.rageTriggered=true;this.damage*=2;this.speed*=1.3;this.baseSpeed*=1.3;}
        if(this.hp<=0){this.hp=0;this.alive=false;}
        return true;
    }
    shoot(input) {
        if(this.shootCooldown>0||!input.mouseDown||!this.alive||this.noShooting)return[];
        const w=WEAPON_DEFS[this.currentWeapon]||WEAPON_DEFS.auto;
        let effectiveShootRate=(this.sporeSlow?w.shootRate*1.3:w.shootRate)*(this.fireRateMul||1);
        effectiveShootRate=Math.max(0.08,effectiveShootRate);
        this.shootCooldown=effectiveShootRate;
        const dx=input.mouseX-this.x,dy=input.mouseY-this.y,len=Math.sqrt(dx*dx+dy*dy);if(len===0)return[];
        const dirX=dx/len,dirY=dy/len;const projs=[];
        let dmg=this.damage*w.damageMul;
        if(this.weaknessActive)dmg*=0.75;
        if(this.timeWarpEmpowered)dmg*=2;
        if(this.barrageStacks>0){const m=7-this.barrageStacks;if(m>0){this._shotCount=(this._shotCount||0)+1;if(this._shotCount%m===0)return[];}}
        const mkP=(rx,ry,d,rad)=>{const p=new Projectile(this.x,this.y,rx,ry,w.projectileSpeed||this.projectileSpeed,d||dmg,rad||w.projectileSize||this.projectileSize);p.ricochetLeft=this.ricochetCount;if(this.graviton){p.gravitonRadius=this.gravitonRadius;p.gravitonForce=this.gravitonForce;}if(w.aoeRadius>0){p.explosive=true;p.explosiveRadius=w.aoeRadius;p.explosiveDamage=d*0.6;}if(this.explosiveBullets>0&&!p.explosive){p.explosive=true;p.explosiveRadius=40;p.explosiveDamage=d*0.5;}if(this.chainLightning)p.chainLightning=true;if(w.ion){p.slowOnHit=true;p.pierceLeft=(this.pierceCount||0)+2;}if(this.slowOnHit)p.slowOnHit=true;if(this.ghostShot){p.ghost=true;p.pierceLeft=999;}else if(!w.ion){p.pierceLeft=this.pierceCount;}return p;};
        const spread=w.spread||0;const count=w.projectileCount||1;
        if(this.marksman){const p=mkP(dirX,dirY,dmg*2);projs.push(p);}
        else if(count>1){for(let i=0;i<count;i++){const a=-spread/2+(spread/(count-1||1))*i;const rx=dirX*Math.cos(a)-dirY*Math.sin(a);const ry=dirX*Math.sin(a)+dirY*Math.cos(a);projs.push(mkP(rx,ry));}}
        else if(this.tripleShot){const s=0.2;for(const o of[-s,0,s]){projs.push(mkP(dirX*Math.cos(o)-dirY*Math.sin(o),dirX*Math.sin(o)+dirY*Math.cos(o)));}}
        else{projs.push(mkP(dirX,dirY));}
        if(this.echoArtifact){this.echoCounter++;if(this.echoCounter>=3){this.echoCounter=0;const ep=mkP(-dirX,-dirY,dmg*0.7);projs.push(ep);}}
        return projs;
    }
    clampPosition(){const h=this.size/2;this.x=Math.max(h,Math.min(this.arenaWidth-h,this.x));this.y=Math.max(h,Math.min(this.arenaHeight-h,this.y));}
    draw(ctx) {
        if(!this.alive)return;
        if(this.invincible&&!this.dashing){const bp=Math.floor(this.invincibleTimer/this.blinkInterval);if(bp%2===0)return;}
        const half=this.size/2;
        if(this.dashing){
            ctx.fillStyle='#88ddff';ctx.shadowColor='#88ddff';ctx.shadowBlur=20;ctx.fillRect(this.x-half,this.y-half,this.size,this.size);ctx.shadowBlur=0;ctx.globalAlpha=0.3;ctx.fillStyle='#88ddff';ctx.fillRect(this.x-half-this.dashDirX*15,this.y-half-this.dashDirY*15,this.size,this.size);ctx.globalAlpha=0.15;ctx.fillRect(this.x-half-this.dashDirX*30,this.y-half-this.dashDirY*30,this.size,this.size);ctx.globalAlpha=1;
            const sm=window.__spriteMgr;if(sm){sm.draw(ctx,'player',this.x,this.y,this.size,{alpha:0.6});sm.draw(ctx,'player_weapon',this.x,this.y,this.size,{alpha:0.6});}
            return;
        }
        const sm=window.__spriteMgr;
        const color=this.playerColor||'#2288ff';
        let tint=null;
        if(!this.invincible&&color!=='#2288ff'){tint=color;}

        const usedSprite=sm?sm.draw(ctx,'player',this.x,this.y,this.size,{tint,hitFlash:this.invincible}):false;

        if(!usedSprite){
            ctx.fillStyle=this.invincible?'#ff6666':color;
            ctx.fillRect(this.x-half,this.y-half,this.size,this.size);
            if(this.playerOutline){ctx.strokeStyle=this.playerOutline;ctx.lineWidth=3;ctx.strokeRect(this.x-half,this.y-half,this.size,this.size);}
            else{ctx.strokeStyle='#ffffff';ctx.lineWidth=2;ctx.strokeRect(this.x-half,this.y-half,this.size,this.size);}
            ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fillRect(this.x-half+4,this.y-half+4,8,8);
        } else {
            if(this.playerOutline){ctx.strokeStyle=this.playerOutline;ctx.lineWidth=3;ctx.strokeRect(this.x-half-1,this.y-half-1,this.size+2,this.size+2);}
            sm.draw(ctx,'player_weapon',this.x+this.size*0.25,this.y-this.size*0.15,this.size*0.6);
        }
        if(this.slowed){ctx.strokeStyle='#44ff44';ctx.lineWidth=2;ctx.globalAlpha=0.5+Math.sin(Date.now()*0.01)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,this.size*0.8,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
        if(this.sporeSlow){ctx.strokeStyle='#44aa22';ctx.lineWidth=2;ctx.globalAlpha=0.5+Math.sin(Date.now()*0.012)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,this.size*0.85,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
        if(this.weaknessActive){ctx.strokeStyle='#ff4444';ctx.lineWidth=1;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.015)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,this.size*0.9,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
        if(this.stasisArtifact&&this.stasisCooldown<=0){ctx.strokeStyle='#ffdd00';ctx.lineWidth=1;ctx.globalAlpha=0.4+Math.sin(Date.now()*0.005)*0.3;ctx.beginPath();ctx.arc(this.x,this.y,this.size*0.9,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
        if(this.dashCooldown>0){ctx.strokeStyle='rgba(136,221,255,0.4)';ctx.lineWidth=2;ctx.globalAlpha=0.5;ctx.beginPath();ctx.arc(this.x,this.y+half+8,5,0,Math.PI*2*(1-this.dashCooldown/this.dashCooldownMax));ctx.stroke();ctx.globalAlpha=1;}
    }
}
// ============================================
// Drone
// ============================================

class Drone {
    constructor(player){this.player=player;this.x=player.x;this.y=player.y;this.radius=8;this.angle=0;this.orbitDist=40;this.shootCooldown=0;this.shootRate=1.5;this.damage=0.5;this.alive=true;}
    update(dt,enemies){this.angle+=dt*2;this.x=this.player.x+Math.cos(this.angle)*this.orbitDist;this.y=this.player.y+Math.sin(this.angle)*this.orbitDist;if(!this.player.alive){this.alive=false;return null;}this.shootCooldown-=dt;if(this.shootCooldown<=0&&enemies.length>0){let closest=null,minDist=Infinity;for(const e of enemies){if(!e.alive)continue;const dx=e.x-this.x,dy=e.y-this.y,d=Math.sqrt(dx*dx+dy*dy);if(d<minDist){minDist=d;closest=e;}}if(closest&&minDist<400){this.shootCooldown=this.shootRate;const dx=closest.x-this.x,dy=closest.y-this.y,len=Math.sqrt(dx*dx+dy*dy);if(len>0)return new Projectile(this.x,this.y,dx/len,dy/len,300,this.damage,3);}}return null;}
    draw(ctx){const sm=window.__spriteMgr;const used=sm?sm.draw(ctx,'enemy_fast',this.x,this.y,this.radius*2,{tint:'#88aaff',tintAlpha:0.3}):false;if(!used){ctx.fillStyle='#88aaff';ctx.shadowColor='#88aaff';ctx.shadowBlur=8;ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(this.x,this.y,this.radius*0.4,0,Math.PI*2);ctx.fill();}ctx.strokeStyle='rgba(136,170,255,0.15)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(this.x,this.y);ctx.lineTo(this.player.x,this.player.y);ctx.stroke();}
}

// ============================================
// SpaceRift + LaserBeam (hazards)
// ============================================

class SpaceRift {
    constructor(x,y){this.x=x;this.y=y;this.radius=25;this.alive=true;this.life=6;this.pulsePhase=Math.random()*Math.PI*2;this.damageTimer=0;}
    update(dt){this.life-=dt;if(this.life<=0){this.alive=false;return;}this.pulsePhase+=dt*3;}
    draw(ctx){const a=Math.min(1,this.life/2)*0.8;const p=Math.sin(this.pulsePhase)*4;const r=this.radius+p;ctx.globalAlpha=a;ctx.fillStyle='#440066';ctx.shadowColor='#7700aa';ctx.shadowBlur=15;ctx.beginPath();ctx.arc(this.x,this.y,r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#220033';ctx.shadowBlur=0;ctx.beginPath();ctx.arc(this.x,this.y,r*0.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#aa44ff';ctx.lineWidth=2;ctx.globalAlpha=a*0.6;ctx.beginPath();ctx.arc(this.x,this.y,r+5,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.globalAlpha=1;}
}

class LaserBeam {
    constructor(arenaW,arenaH){this.alive=true;this.life=3;this.warningTime=1;this.active=false;this.width=6;this.horizontal=Math.random()<0.5;if(this.horizontal){this.y=50+Math.random()*(arenaH-100);this.x1=0;this.x2=arenaW;}else{this.x=50+Math.random()*(arenaW-100);this.y1=0;this.y2=arenaH;}}
    update(dt){this.life-=dt;if(this.life<=0){this.alive=false;return;}if(this.life<this.warningTime)this.active=true;}
    checkCollision(player){if(!this.active||!player.alive)return false;const h=player.size/2;if(this.horizontal){if(Math.abs(player.y-this.y)<this.width+h)return true;}else{if(Math.abs(player.x-this.x)<this.width+h)return true;}return false;}
    draw(ctx){if(!this.active){const a=0.2+Math.sin(Date.now()*0.01)*0.15;ctx.globalAlpha=a;ctx.strokeStyle='#ff4444';ctx.lineWidth=3;ctx.setLineDash([8,8]);ctx.beginPath();if(this.horizontal){ctx.moveTo(this.x1,this.y);ctx.lineTo(this.x2,this.y);}else{ctx.moveTo(this.x,this.y1);ctx.lineTo(this.x,this.y2);}ctx.stroke();ctx.setLineDash([]);ctx.globalAlpha=1;}else{ctx.shadowColor='#ff2222';ctx.shadowBlur=20;ctx.strokeStyle='#ff4444';ctx.lineWidth=this.width;ctx.beginPath();if(this.horizontal){ctx.moveTo(this.x1,this.y);ctx.lineTo(this.x2,this.y);}else{ctx.moveTo(this.x,this.y1);ctx.lineTo(this.x,this.y2);}ctx.stroke();ctx.strokeStyle='#ff8888';ctx.lineWidth=this.width*0.3;ctx.beginPath();if(this.horizontal){ctx.moveTo(this.x1,this.y);ctx.lineTo(this.x2,this.y);}else{ctx.moveTo(this.x,this.y1);ctx.lineTo(this.x,this.y2);}ctx.stroke();ctx.shadowBlur=0;}}
}

// ============================================
// PhasePhantom
// ============================================

class PhasePhantom {
    constructor(x,y,damage){this.x=x;this.y=y;this.damage=damage;this.radius=50;this.life=1.5;this.alive=true;this.triggered=false;}
    update(dt){this.life-=dt;if(this.life<=0)this.alive=false;}
    draw(ctx){const a=(this.life/1.5)*0.3;ctx.globalAlpha=a;ctx.fillStyle='#88ccff';ctx.beginPath();ctx.arc(this.x,this.y,this.radius*(1-this.life/1.5*0.3),0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
}

// ============================================
// Particle + RingParticle
// ============================================

class Particle {
    constructor(x,y,color,speedMul){this.x=x;this.y=y;const a=Math.random()*Math.PI*2;const s=(50+Math.random()*150)*(speedMul||1);this.vx=Math.cos(a)*s;this.vy=Math.sin(a)*s;this.radius=2+Math.random()*3;this.color=color;this.life=0.3+Math.random()*0.4;this.maxLife=this.life;this.alive=true;}
    update(dt){this.x+=this.vx*dt;this.y+=this.vy*dt;this.life-=dt;if(this.life<=0)this.alive=false;}
    draw(ctx){ctx.globalAlpha=this.life/this.maxLife;ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
}

class RingParticle {
    constructor(x,y,color,maxRadius){this.x=x;this.y=y;this.color=color;this.radius=0;this.maxRadius=maxRadius||50;this.life=0.4;this.maxLife=0.4;this.alive=true;}
    update(dt){this.life-=dt;if(this.life<=0){this.alive=false;return;}this.radius=this.maxRadius*(1-this.life/this.maxLife);}
    draw(ctx){const a=this.life/this.maxLife;ctx.globalAlpha=a;ctx.strokeStyle=this.color;ctx.lineWidth=3*(this.life/this.maxLife);ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;}
}

// ============================================
// ArenaBackground
// ============================================

class ArenaBackground {
    constructor(w,h){this.width=w;this.height=h;this.stars=[];for(let i=0;i<50;i++){this.stars.push({x:Math.random()*w,y:Math.random()*h,size:0.5+Math.random()*1.5,speed:10+Math.random()*30,alpha:0.2+Math.random()*0.6});}this.wave=1;this.gridColor='rgba(255,255,255,0.03)';this.bgColor='#111';this.starsVisible=false;this.pulseIntensity=0;this.theme='default';this.hexParticles=[];}
    setTheme(t){this.theme=t;if(t==='cyber'){this.bgColor='#0a0f1a';}else if(t==='void'){this.bgColor='#050510';}else if(t==='inferno'){this.bgColor='#1a0500';}else if(t==='ice'){this.bgColor='#0a1520';}else{this.bgColor='#111';}}
    setWave(w){this.wave=w;if(w<=2){this.gridColor='rgba(255,255,255,0.03)';this.starsVisible=false;this.pulseIntensity=0;}else if(w<=4){this.gridColor=this.theme==='cyber'?'rgba(0,200,255,0.05)':'rgba(100,150,255,0.04)';this.starsVisible=true;this.pulseIntensity=0;}else if(w<=6){this.gridColor=this.theme==='void'?'rgba(100,0,255,0.06)':'rgba(200,100,255,0.04)';this.starsVisible=true;this.pulseIntensity=0.1;}else if(w<=8){this.gridColor=this.theme==='inferno'?'rgba(255,80,0,0.07)':'rgba(255,100,100,0.05)';this.starsVisible=true;this.pulseIntensity=0.2;}else{this.gridColor=this.theme==='ice'?'rgba(100,200,255,0.08)':'rgba(255,50,50,0.06)';this.starsVisible=true;this.pulseIntensity=0.35;}}
    update(dt){if(this.starsVisible){for(const s of this.stars){s.y-=s.speed*dt;if(s.y<-5){s.y=this.height+5;s.x=Math.random()*this.width;}}}if(this.theme==='cyber'||this.theme==='ice'){if(Math.random()<0.02)this.hexParticles.push({x:Math.random()*this.width,y:this.height+10,speed:20+Math.random()*30,size:2+Math.random()*3,alpha:0.3+Math.random()*0.3,life:8+Math.random()*4});for(const h of this.hexParticles){h.y-=h.speed*dt;h.life-=dt;h.alpha*=0.998;}this.hexParticles=this.hexParticles.filter(h=>h.life>0&&h.y>-10);}}
    draw(ctx){ctx.fillStyle=this.bgColor;ctx.fillRect(0,0,this.width,this.height);if(this.theme==='inferno'){const p=Math.sin(Date.now()*0.001)*0.15;ctx.fillStyle=`rgba(255,60,0,${Math.abs(p)*0.08})`;ctx.fillRect(0,0,this.width,this.height);}if(this.theme==='void'){const p=Math.sin(Date.now()*0.0005)*0.1;ctx.fillStyle=`rgba(100,0,255,${Math.abs(p)*0.06})`;ctx.fillRect(0,0,this.width,this.height);}if(this.pulseIntensity>0){const p=Math.sin(Date.now()*0.002)*this.pulseIntensity;ctx.fillStyle=`rgba(255,0,0,${Math.abs(p)*0.1})`;ctx.fillRect(0,0,this.width,this.height);}const gs=40;ctx.strokeStyle=this.gridColor;ctx.lineWidth=1;for(let x=0;x<=this.width;x+=gs){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,this.height);ctx.stroke();}for(let y=0;y<=this.height;y+=gs){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(this.width,y);ctx.stroke();}if(this.starsVisible){for(const s of this.stars){ctx.globalAlpha=s.alpha;ctx.fillStyle=this.theme==='cyber'?'#00ccff':this.theme==='ice'?'#aaccee':'#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.size,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}if(this.hexParticles.length>0){for(const h of this.hexParticles){ctx.globalAlpha=h.alpha;ctx.fillStyle=this.theme==='cyber'?'#00ccff':'#aaccee';ctx.beginPath();ctx.arc(h.x,h.y,h.size,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1;}}
}
// ============================================
// Wave Manager — with bosses every 5 waves + modifiers
// ============================================

class WaveManager {
    constructor(){this.wave=0;this.enemiesRemaining=0;this.spawnQueue=[];this.spawnTimer=0;this.spawnInterval=0.8;this.announcing=false;this.announceTimer=0;this.isMinibossWave=false;this.isBossWave=false;        this.currentModifier=null;this.endlessMode=false;this.waveStartTime=0;}
    startNextWave(arenaW,arenaH){
        this.wave++;this.spawnQueue=[];this.spawnTimer=0;this.isMinibossWave=false;this.isBossWave=false;
        this.waveStartTime=0;this.announcing=true;this.announceTimer=2;
        // Boss every 10 waves (10,20,30...)
        if(this.wave>0&&this.wave%10===0){
            this.isBossWave=true;
            this.enemiesRemaining=6;
            this.spawnQueue=['shooter','shooter','shooter','tank','tank'];
            if(this.wave>=20){this.spawnQueue.push('phantom','lancer','summoner');this.enemiesRemaining+=3;}
            this.spawnInterval=0.5;this.announcing=true;this.announceTimer=3;
            return;
        }
        // Miniboss every 10 waves offset (5,15,25...)
        if(this.wave%10===5){
            this.isMinibossWave=true;
            this.spawnQueue=['shooter','shooter','blinker','blinker'];
            if(this.wave>=15){this.spawnQueue.push('phantom','lancer');this.enemiesRemaining+=2;}
            this.enemiesRemaining=this.spawnQueue.length+1;
            this.spawnInterval=0.6;this.announcing=true;this.announceTimer=2.5;
            return;
        }
        const baseCount=3;let count=baseCount+Math.floor(this.wave*1.5);
        // Double enemies daily modifier
        if(window._dailyDoubleEnemies)count=Math.round(count*2);
        this.enemiesRemaining=count;
        for(let i=0;i<count;i++){
            let type='crawler';const r=Math.random();
            if(this.wave>=4&&r<0.10)type='swarm';
            else if(this.wave>=6&&r<0.18)type='blinker';
            else if(this.wave>=5&&r<0.28)type='shooter';
            else if(this.wave>=7&&r<0.36)type='tank';
            else if(this.wave>=4&&r<0.48)type='sludger';
            else if(this.wave>=3&&r<0.62)type='fast';
            else if(this.wave>=8&&r<0.68)type='phantom';
            else if(this.wave>=9&&r<0.74)type='lancer';
            else if(this.wave>=10&&r<0.79)type='summoner';
            else if(this.wave>=11&&r<0.83)type='warlock';
            else if(this.wave>=10&&r<0.855)type='pulsar';
            else if(this.wave>=13&&r<0.87)type='spore';
            else if(this.wave>=12&&r<0.90)type='revenant';
            else if(this.wave>=14&&r<0.93)type='conductor';
            else if(this.wave>=16&&r<0.96)type='mimic_king';
            this.spawnQueue.push(type);
        }
        this.spawnInterval=Math.max(0.3,0.8-this.wave*0.04);this.announcing=true;this.announceTimer=2;
        // Assign wave modifier (every other wave, not boss/miniboss waves)
        if(this.wave>1&&this.wave%2===0&&!this.isBossWave){
            this.currentModifier=WAVE_MODIFIERS[Math.floor(Math.random()*WAVE_MODIFIERS.length)];
        } else if(!this.isBossWave) {
            this.currentModifier=null;
        }
    }
    update(dt,arenaW,arenaH){
        if(this.announcing){this.announceTimer-=dt;if(this.announceTimer<=0)this.announcing=false;return[];}
        if(this.spawnQueue.length===0)return[];
        this.spawnTimer+=dt;const ne=[];
        if(this.spawnTimer>=this.spawnInterval){
            this.spawnTimer=0;const type=this.spawnQueue.shift();
            if(type&&type.startsWith('swarm_delayed')){const side=Math.floor(Math.random()*4);let x,y;switch(side){case 0:x=Math.random()*arenaW;y=-25;break;case 1:x=arenaW+25;y=Math.random()*arenaH;break;case 2:x=Math.random()*arenaW;y=arenaH+25;break;case 3:x=-25;y=Math.random()*arenaH;break;}ne.push(new Enemy(x,y,'swarm',this.wave,this.currentModifier?this.currentModifier.id:null));return ne;}
            const side=Math.floor(Math.random()*4);let x,y;
            switch(side){case 0:x=Math.random()*arenaW;y=-25;break;case 1:x=arenaW+25;y=Math.random()*arenaH;break;case 2:x=Math.random()*arenaW;y=arenaH+25;break;case 3:x=-25;y=Math.random()*arenaH;break;}
            ne.push(new Enemy(x,y,type,this.wave,this.currentModifier?this.currentModifier.id:null));
            if(type==='swarm'){const gs=4+Math.floor(Math.random()*5);for(let j=1;j<gs;j++){this.spawnQueue.push('swarm_delayed_'+j);this.enemiesRemaining++;}}
        }
        return ne;
    }
    spawnBoss(arenaW,arenaH){return new Enemy(arenaW/2,-50,'boss',this.wave,this.currentModifier?this.currentModifier.id:null);}
    spawnMiniboss(arenaW,arenaH){
        let type='miniboss';
        if(this.wave===35||this.wave>35&&(this.wave-35)%20===0)type='miniboss_crystal';
        else if(this.wave===25||this.wave>25&&(this.wave-25)%20===0)type='miniboss_mirror';
        else if(this.wave===15||this.wave>15&&(this.wave-15)%20===0)type='miniboss_wave';
        const mb=new Enemy(arenaW/2,-40,type,this.wave,this.currentModifier?this.currentModifier.id:null);
        if(this.endlessMode&&this.wave>10)mb.applyEndlessScaling(this.wave);
        return mb;
    }
    onEnemyDied(){this.enemiesRemaining--;}
    isWaveCleared(){return this.spawnQueue.length===0&&this.enemiesRemaining<=0&&!this.announcing;}
}
// ============================================
// Deep Void Survivor v4.0 — Main Game Class
// ============================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 800; this.height = 600;
        this.canvas.width = this.width; this.canvas.height = this.height;
        this.input = new InputManager(this.canvas);
        this.sound = new SoundEngine();
        this.spriteMgr = new SpriteManager();
        this.spriteMgr.init();
        window.__spriteMgr = this.spriteMgr;
        this.background = new ArenaBackground(this.width, this.height);
        this.state = 'menu'; this.score = 0;
        this.particles = []; this.waveManager = new WaveManager();
        this.upgradeChoices = []; this.activeUpgrades = [];
        this.puddles = []; this.energySpheres = [];
        this.phasePhantoms = []; this.drones = []; this.gameTime = 0;
        this.enemiesKilledTotal = 0; this.damageTaken = 0;
        this.minibossSpawned = false; this.bossSpawned = false;
        this.screenShake = 0;
        this.timeWarpActive = false; this.timeWarpTimer = 0; this.timeWarpFactor = 0.3;
        this.spaceRifts = []; this.laserBeams = []; this.hazardTimer = 0;
        this.music = new MusicEngine(this.sound);
        this.mouseWasDownOnEnter = false;
        this.bestWave = parseInt(localStorage.getItem('dvs_bestWave') || '0');
        this.prestigeLevel = parseInt(localStorage.getItem('dvs_prestige') || '0');
        this.prestigePoints = parseInt(localStorage.getItem('dvs_prestigePoints') || '0');
        this.unlockedSkills = JSON.parse(localStorage.getItem('dvs_unlockedSkills') || '[]');
        this.activeRunes = JSON.parse(localStorage.getItem('dvs_activeRunes') || '[]');
        this.runeInventory = JSON.parse(localStorage.getItem('dvs_runeInventory') || '[]');
        this.unlockedAchievements = JSON.parse(localStorage.getItem('dvs_achievements') || '[]');
        this.selectedCosmetics = JSON.parse(localStorage.getItem('dvs_cosmetics') || '{}');
        this.highScores = JSON.parse(localStorage.getItem('dvs_highScores') || '[]');
        this.sfxVolume = parseFloat(localStorage.getItem('dvs_sfxVolume') || '0.25');
        this.musicVolumeSetting = parseFloat(localStorage.getItem('dvs_musicVolume') || '0.125');
        this.canvasResolution = parseInt(localStorage.getItem('dvs_resolution') || '1');
        this.selectedArenaTheme = localStorage.getItem('dvs_arenaTheme') || 'default';
        this.selectedDeathEffect = localStorage.getItem('dvs_deathEffect') || 'explosion';
        this.autoFire = JSON.parse(localStorage.getItem('dvs_autoFire') || 'false');
        this.showHitboxes = JSON.parse(localStorage.getItem('dvs_showHitboxes') || 'false');
        this.screenShakeEnabled = JSON.parse(localStorage.getItem('dvs_screenShake') || 'true');
        this.ascensionLevel = parseInt(localStorage.getItem('dvs_ascension') || '0');
        this.totalStats = JSON.parse(localStorage.getItem('dvs_totalStats') || '{"runs":0,"kills":0,"damageTaken":0,"timePlayed":0,"waves":0}');
        this.runHistory = JSON.parse(localStorage.getItem('dvs_runHistory') || '[]');
        if (this.selectedCosmetics.weapon) this.selectedCosmetics.weapon = this.selectedCosmetics.weapon;
        this.applyResolution();
        this.dailyChallenge = false; this.dailyModifier = ''; this.dailyBestScore = 0;
        this.player = null; this.projectiles = []; this.enemies = []; this.enemyProjectiles = [];
        this.artifacts = []; this.artifactSlots = 0;
        this.showPrestigeScreen = false; this.showVictoryScreen = false; this.showDailyScreen = false;
        this.showAchievements = false; this.showSkillTree = false; this.showChallengeSelect = false;
        this.showPause = false; this.showStats = false; this.showSettings = false; this.showMerchant = false;
        this.showCodex = false; this.codexTab = 'enemies';
        this.activeChallenge = null;
        this.runStats = { damagePerShot: 0, accuracy: 0, shotsFired: 0, shotsHit: 0, favoriteUpgrade: '', damageTaken: 0 };
        this.combo20Count = 0; this.bossKillTime = 0; this.bossSpawnTime = 0;
        this.waveDamageTaken = 0; this.flawlessWaves = 0;
        this.selectedTab = 'survival';
        this.lastTime = 0; this.deltaTime = 0;
        this.dailySeed = this.getDailySeed();
        this.endlessMode = false; this.endlessModeOffered = false;
        this.merchantItems = []; this.merchantScore = 0;
        this.sporeClouds = [];
        this.chainArcs = [];
        this.particlesEnabled = true;
        // v4.0 Active Abilities
        this.abilities = [null, null]; this.abilityCooldowns = [0, 0];
        this.turrets = []; this.abilityVortex = null;
        this.timeReversalActive = false; this.timeReversalTimer = 0;
        this.timeReversalSnapshots = []; this.timeReversalRecordTimer = 0;
        this.summonedGhosts = [];
        this.mimics = [];
        this.currentArenaEvent = null;
        this.eventAnnouncementTimer = 0;
        this.waveEnemiesKilled = 0; this.waveStartTime = 0; this.consecutiveHits = 0;
        this.sfxVolume = 0.25; this.musicVolumeSetting = 0.125; this.canvasResolution = 1;
        this.selectedArenaTheme = 'default'; this.selectedDeathEffect = 'explosion';
    }
    getDailySeed() { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate(); }
    getDailyChallengeModifier() {
        const seed = this.dailySeed; let hash = 0;
        for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0; }
        const mods = ['sniper','double_enemies','no_healing'];
        return mods[Math.abs(hash) % mods.length];
    }
    applyResolution() {
        const scales = [0.75, 1, 1.25];
        const s = scales[this.canvasResolution] || 1;
        this.width = Math.floor(800 * s); this.height = Math.floor(600 * s);
        this.canvas.width = this.width; this.canvas.height = this.height;
        if (this.player) { this.player.arenaW = this.width; this.player.arenaH = this.height; }
    }
    saveProgress() {
        localStorage.setItem('dvs_prestige', String(this.prestigeLevel));
        localStorage.setItem('dvs_prestigePoints', String(this.prestigePoints));
        localStorage.setItem('dvs_unlockedSkills', JSON.stringify(this.unlockedSkills));
        localStorage.setItem('dvs_activeRunes', JSON.stringify(this.activeRunes));
        localStorage.setItem('dvs_runeInventory', JSON.stringify(this.runeInventory));
        localStorage.setItem('dvs_achievements', JSON.stringify(this.unlockedAchievements));
        localStorage.setItem('dvs_cosmetics', JSON.stringify(this.selectedCosmetics));
        localStorage.setItem('dvs_highScores', JSON.stringify(this.highScores));
        localStorage.setItem('dvs_sfxVolume', String(this.sfxVolume));
        localStorage.setItem('dvs_musicVolume', String(this.musicVolumeSetting));
        localStorage.setItem('dvs_resolution', String(this.canvasResolution));
        localStorage.setItem('dvs_arenaTheme', this.selectedArenaTheme);
        localStorage.setItem('dvs_autoFire', JSON.stringify(this.autoFire));
        localStorage.setItem('dvs_showHitboxes', JSON.stringify(this.showHitboxes));
        localStorage.setItem('dvs_deathEffect', this.selectedDeathEffect);
        localStorage.setItem('dvs_autoFire', JSON.stringify(this.autoFire));
        localStorage.setItem('dvs_showHitboxes', JSON.stringify(this.showHitboxes));
        localStorage.setItem('dvs_screenShake', JSON.stringify(this.screenShakeEnabled));
        localStorage.setItem('dvs_ascension', String(this.ascensionLevel));
        localStorage.setItem('dvs_totalStats', JSON.stringify(this.totalStats));
        localStorage.setItem('dvs_runHistory', JSON.stringify(this.runHistory));
    }
    initGame() {
        this.player = new Player(this.width/2, this.height/2, this.width, this.height);
        this.projectiles=[];this.enemies=[];this.enemyProjectiles=[];
        this.particles=[];this.puddles=[];this.energySpheres=[];
        this.phasePhantoms=[];this.drones=[];this.spaceRifts=[];this.laserBeams=[];
        this.artifacts=[];this.artifactSlots=0;
        this.score=0;this.gameTime=0;this.enemiesKilledTotal=0;this.damageTaken=0;
        this.activeUpgrades=[];this.minibossSpawned=false;this.bossSpawned=false;
        this.timeWarpActive=false;this.timeWarpTimer=0;
        this.combo20Count=0;this.bossKillTime=0;this.bossSpawnTime=0;
        this.waveDamageTaken=0;this.flawlessWaves=0;
        this.runStats={damagePerShot:0,accuracy:0,shotsFired:0,shotsHit:0,favoriteUpgrade:'',damageTaken:0};
        this.sporeClouds=[];this.merchantItems=[];
        this.endlessMode=false;this.endlessModeOffered=false;
        this.waveEnemiesKilled=0;this.waveStartTime=0;this.consecutiveHits=0;
        this.abilities=[null,null];this.abilityCooldowns=[0,0];
        this.turrets=[];this.abilityVortex=null;
        this.timeReversalActive=false;this.timeReversalTimer=0;this.timeReversalSnapshots=[];this.timeReversalRecordTimer=0;
        this.summonedGhosts=[];this.mimics=[];
        this.currentArenaEvent=null;this.eventAnnouncementTimer=0;
        this.showEchoSelect=false;this.echoChoices=[];this.echoWavesRemaining=0;
        // Apply arena biome theme
        this.background.setTheme(this.selectedArenaTheme||'default');
        // Apply prestige skills
        for(const sid of this.unlockedSkills){for(const branch of Object.values(SKILL_TREE)){const skill=branch.find(s=>s.id===sid);if(skill)skill.apply(this.player);}}
        // Apply active runes
        for(const rid of this.activeRunes){const rune=RUNE_DEFS.find(r=>r.id===rid);if(rune)rune.apply(this.player);}
        // Apply prestige level bonus
        if(this.prestigeLevel>0)this.player.damage*=(1+this.prestigeLevel*0.05);
        // v6.0: Apply ascension depth bonus (player power + enemy scaling)
        window._ascension=this.ascensionLevel;
        if(this.ascensionLevel>0){this.player.damage*=Math.pow(1.15,this.ascensionLevel);}
        // Apply selected cosmetics
        if(this.selectedCosmetics.playerColor)this.player.playerColor=this.selectedCosmetics.playerColor;
        if(this.selectedCosmetics.particleStyle)this.player.particleStyle=this.selectedCosmetics.particleStyle;
        if(this.selectedCosmetics.projectileShape)this.player.projectileShape=this.selectedCosmetics.projectileShape;
        if(this.selectedCosmetics.playerOutline)this.player.playerOutline=this.selectedCosmetics.playerOutline;
        // Daily challenge
        this.dailyChallenge=true;this.dailyModifier=this.getDailyChallengeModifier();
        const stored=localStorage.getItem('dvs_daily_'+this.dailySeed);this.dailyBestScore=stored?parseInt(stored):0;
        window._dailyDoubleEnemies=this.dailyModifier==='double_enemies';
        if(this.dailyModifier==='sniper'){this.player.marksman=true;this.player.tripleShot=false;this.player.damage*=4;this.player.pierceCount=2;this.player.projectileSpeed*=1.3;}
        this.state='playing';
        this.waveManager=new WaveManager();
        this.waveManager.endlessMode=this.endlessMode;
        this.waveManager.startNextWave(this.width,this.height);
        this.background.setWave(1);
        this.screenShake=0;
        this.music.stop();this.music.start();this.music.setMood(1);
    }
    startChallenge(challenge) {
        this.activeChallenge=challenge;
        this.initGame();
        if(challenge.apply)challenge.apply(this.player);
        window._zombieMode=!!challenge.zombieMode;
        this.sound.play('challengeStart');
    }
    loop(timestamp) {
        this.deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (this.deltaTime > 0.1) this.deltaTime = 0.1;
        try {
        if (this.showPause) {
            if (this.input.isJustPressed('escape') || this.input.isJustPressed('enter')) { this.showPause = false; }
            else if (this.input.isJustPressed('q')) { this.showPause = false; this.state = 'menu'; this.music.stop(); this.sound.play('menuClick'); }
            else { this.draw(); this.input.clearJustPressed(); requestAnimationFrame((t) => this.loop(t)); return; }
            this.input.clearJustPressed();
            this.draw();
            requestAnimationFrame((t) => this.loop(t)); return;
        }
        if (this.showSettings) {
            this.updateSettings();
            this.draw();
            this.input.clearJustPressed();
            requestAnimationFrame((t) => this.loop(t)); return;
        }
        if (this.showMerchant) {
            this.updateMerchant();
            this.draw();
            this.input.clearJustPressed();
            requestAnimationFrame((t) => this.loop(t)); return;
        }
        if (this.showEchoSelect) {
            this.updateEchoSelect();
            this.draw();
            this.input.clearJustPressed();
            requestAnimationFrame((t) => this.loop(t)); return;
        }
        if (this.state === 'playing' && this.input.isJustPressed('escape')) { this.showPause = true; this.sound.play('pauseOpen'); this.input.clearJustPressed(); this.draw(); requestAnimationFrame((t) => this.loop(t)); return; }
        let effectiveDt = this.deltaTime;
        if (this.timeWarpActive) { this.timeWarpTimer -= this.deltaTime; effectiveDt *= this.timeWarpFactor; if (this.timeWarpTimer <= 0) this.timeWarpActive = false; }
        this.update(effectiveDt);
        this.draw();
        this.input.clearJustPressed();
        requestAnimationFrame((t) => this.loop(t));
        } catch(e) { console.error('Game loop error:', e); this.input.clearJustPressed(); requestAnimationFrame((t) => this.loop(t)); }
    }
    update(dt) {
        // Menu
        if (this.state === 'menu') {
            this.background.update(dt);
            if (this.showAchievements || this.showSkillTree || this.showChallengeSelect || this.showSettings || this.showCodex) {
                this.updateMenuScreens();
                return;
            }
            if (this.input.isJustPressed('enter')) {
                this.sound.play('menuClick'); this.initGame();
            }
            if (this.input.mouseJustClicked) {
                const mx = this.input.mouseX, my = this.input.mouseY;
                const bx = this.width/2-140, bw = 280;
                if (mx >= bx && mx <= bx+bw && my >= 400 && my <= 435) { this.sound.play('menuClick'); this.initGame(); }
                else if (mx >= bx && mx <= bx+bw && my >= 445 && my <= 480) { this.showAchievements = true; this.sound.play('achievementScreenOpen'); }
                else if (mx >= bx && mx <= bx+bw && my >= 490 && my <= 525) { this.showSkillTree = true; this.sound.play('skillTreeOpen'); }
                else if (mx >= bx && mx <= bx+bw && my >= 535 && my <= 570) { this.showChallengeSelect = true; this.sound.play('menuClick'); }
                else if (mx >= bx && mx <= bx+bw && my >= 580 && my <= 615) { this.showSettings = true; this.sound.play('menuClick'); }
                else if (mx >= bx && mx <= bx+bw && my >= 625 && my <= 660) { this.showCodex = true; this.codexTab = 'enemies'; this.sound.play('tooltipShow'); }
            }
            if (this.input.isJustPressed('a')) { this.showAchievements = true; this.sound.play('achievementScreenOpen'); }
            if (this.input.isJustPressed('t')) { this.showSkillTree = true; this.sound.play('skillTreeOpen'); }
            if (this.input.isJustPressed('c')) { this.showChallengeSelect = true; }
            if (this.input.isJustPressed('o')) { this.showSettings = true; }
            if (this.input.isJustPressed('k')) { this.showCodex = true; this.codexTab = 'enemies'; this.sound.play('tooltipShow'); }
            return;
        }
        if (this.state === 'gameover') {
            if (this.input.isJustPressed('r') || this.input.isJustPressed('enter') || this.input.mouseJustClicked) this.initGame();
            if (this.input.isJustPressed('escape')) this.state = 'menu';
            this.updateParticles(dt);
            return;
        }
        if (this.state === 'upgrade') { this.updateUpgradeScreen(); this.updateParticles(dt); return; }
        if (this.state === 'prestige') { this.updatePrestigeScreen(); this.updateParticles(dt); return; }
        if (this.state === 'victory') {
            this.updateVictoryScreen();
            if (this.input.isJustPressed('r') || this.input.isJustPressed('enter')) {
                if (this.endlessModeOffered && !this.endlessMode) {
                    this.continueEndless();
                } else { this.initGame(); }
            }
            if (this.input.isJustPressed('escape')) this.state = 'menu';
            this.updateParticles(dt);
            return;
        }
        // === Playing ===
        this.gameTime += dt;
        this.waveStartTime += dt;
        this.background.update(dt);
        this.background.setWave(this.waveManager.wave);
        // Weapon cycling (E key)
        if(this.input.isJustPressed('e')){
            const wKeys=Object.keys(WEAPON_DEFS);
            const idx=wKeys.indexOf(this.player.currentWeapon);
            this.player.currentWeapon=wKeys[(idx+1)%wKeys.length];
            this.sound.play('weaponSwitch');
        }
        // v4.0: Ability activation (Q/R keys)
        for(let ai=0;ai<2;ai++){
            const key=ai===0?'q':'r';
            if(this.input.isJustPressed(key)&&this.abilities[ai]&&this.abilityCooldowns[ai]<=0&&this.player.alive){
                this.abilities[ai].execute(this);
                this.abilityCooldowns[ai]=this.abilities[ai].cooldown;
            }
        }
        // v4.0: Tick ability cooldowns
        for(let ai=0;ai<2;ai++){if(this.abilityCooldowns[ai]>0)this.abilityCooldowns[ai]-=dt;}
        // v4.0: Phase shift timer
        if(this.player.phaseShifted){
            this.player.phaseShiftTimer-=dt;
            if(this.player.phaseShiftTimer<=0){this.player.phaseShifted=false;this.player.invincible=false;this.player.baseSpeed/=2;}
            else{this.player.invincible=true;}
        }
        // Apply wave modifier effects to player
        this.player._inverted = !!(this.waveManager.currentModifier && this.waveManager.currentModifier.id === 'inversion');
        // Player
        const pr = this.player.update(dt, this.input);
        if (pr) {
            if (pr.type === 'phasePhantom') this.phasePhantoms.push(new PhasePhantom(pr.x, pr.y, pr.damage));
            else if (pr.type === 'dash') this.sound.play('dash');
        }
        // Time Warp
        if (this.player.timeWarp && this.player.hp <= this.player.maxHp * 0.25 && this.player.timeWarpCooldown <= 0 && this.player.alive) {
            this.timeWarpActive = true; this.timeWarpTimer = 2; this.player.timeWarpCooldown = 15;
            if (this.player.comboChronoblade) { this.player.timeWarpEmpowered = true; this.player.timeWarpEmpoweredTimer = 2.5; }
            this.sound.play('upgradeSelect');
        }
        // Shooting
        // Auto-fire: simulate mouse held when enemies are in range
        if(this.autoFire&&this.player.alive&&!this.input.mouseDown){
            let closestEnemy=null,minDist=Infinity;
            for(const e of this.enemies){if(!e.alive)continue;const dx=e.x-this.player.x,dy=e.y-this.player.y,d=Math.sqrt(dx*dx+dy*dy);if(d<minDist){minDist=d;closestEnemy=e;}}
            if(closestEnemy&&minDist<400){this.input.mouseDown=true;}
        }
        const np = this.player.shoot(this.input);
        if (np.length > 0) { this.projectiles.push(...np); this.sound.play(this.player.currentWeapon==='ion'?'ionShot':(this.player.tripleShot ? 'playerShootTriple' : 'playerShoot')); this.runStats.shotsFired += np.length; }
        this.projectiles.forEach(p => p.update(dt, this.width, this.height, this.enemies));
        this.projectiles = this.projectiles.filter(p => p.alive);
        this.enemies.forEach(e => e.update(dt, this.player.x, this.player.y, this.width, this.height, this.puddles, this.enemies));
        // Mimic King: spawn mimics when flagged
        for(const e of this.enemies){
            if(e.type==='mimic_king'&&e._spawnMimic){
                e._spawnMimic=false;
                const fakeColors=['#ffdd00','#44ff44','#ff4444'];
                const mfx=e.x+(Math.random()-0.5)*80,mfy=e.y+(Math.random()-0.5)*80;
                const m=new Mimic(mfx,mfy,'sphere');m.color=fakeColors[Math.floor(Math.random()*fakeColors.length)];m.score=0;
                this.mimics.push(m);this.sound.play('mimicAppear');
            }
        }
        // Pulsar: explode when charged
        for(const e of this.enemies){
            if(e.type==='pulsar'&&e.alive&&e._pulsarExplode){
                e._pulsarExplode=false;
                this.spawnParticles(e.x,e.y,'#ff3355',18,1.5);
                this.spawnRing(e.x,e.y,'#ff3355',e.pulsarRadius);
                this.sound.play('pulsarBeep');
                this.triggerShake(6);
                if(this.player.alive){
                    const dx=this.player.x-e.x,dy=this.player.y-e.y;
                    if(Math.sqrt(dx*dx+dy*dy)<e.pulsarRadius+this.player.size/2){
                        const dmg=this.player.takeDamage(1);
                        if(dmg){this.damageTaken++;this.waveDamageTaken++;this.spawnParticles(this.player.x,this.player.y,'#ff4444',8);this.sound.play('playerHit');this.triggerShake(6);this.vibrate(60);if(!this.player.alive)this.onPlayerDeath();}
                    }
                }
            }
        }
        for (const e of this.enemies) { const shots = e.tryShoot(this.player.x, this.player.y); if (shots) { this.enemyProjectiles.push(...shots); if(e.type==='summoner')this.sound.play('summonerSignal'); } }
        for (const e of this.enemies) { if (e.type === 'tank' && e.justEnraged) { e.justEnraged = false; this.sound.play('minibossAppear'); this.triggerShake(5); this.spawnRing(e.x, e.y, '#ff0000', 60); } }
        for (const e of this.enemies) { if (e.type === 'lancer' && e.chargeState === 'prep' && !e._chargeSoundPlayed) { e._chargeSoundPlayed = true; this.sound.play('lancerCharge'); } if (e.type === 'lancer' && e.chargeState !== 'prep') e._chargeSoundPlayed = false; if (e.type === 'lancer' && e.chargeState === 'rest' && !e._hitSoundPlayed) { e._hitSoundPlayed = true; this.sound.play('lancerHit'); } if (e.type === 'lancer' && e.chargeState === 'idle') e._hitSoundPlayed = false; }
        for (const e of this.enemies) { if (e.type === 'phantom' && e.visible && !e._phantomSoundPlayed) { e._phantomSoundPlayed = true; this.sound.play('phantomAppear'); } if (e.type === 'phantom' && !e.visible) { if(!e._phantomWhooshPlayed){e._phantomWhooshPlayed=true;this.sound.play('phantomWhoosh');} } if (e.type === 'phantom' && e.visible) e._phantomWhooshPlayed = false; }
        for (const e of this.enemies) {
            if (e.type === 'summoner' && e.alive) {
                const summoned = e.trySummon(this.enemies, this.waveManager.wave);
                if (summoned) { this.enemies.push(...summoned); this.waveManager.enemiesRemaining += summoned.length; this.sound.play('summonerSpawn'); this.spawnParticles(e.x, e.y, '#cc88ff', 8); }
            }
        }
        for (const e of this.enemies) { if (this.puddles.length < 10) { const pl = e.tryPlacePuddle(this.puddles); if (pl) { this.puddles.push(pl); this.sound.play('puddlePlace'); } } }
        // Warlock: teleport ally to player + apply weakness
        for (const e of this.enemies) {
            if (e.type === 'warlock' && e.alive) {
                const teleported = e.tryTeleportAlly(this.enemies, this.player.x, this.player.y);
                if (teleported) { this.sound.play('warlockTeleport'); this.spawnParticles(teleported.x, teleported.y, '#8844ff', 8); }
                if (e.tryApplyWeakness(this.player)) { this.sound.play('warlockDebuff'); this.spawnParticles(this.player.x, this.player.y, '#ff4444', 6); }
            }
        }
        // Crystal boss split
        for (const e of this.enemies) {
            if (e.alive && e.type === 'miniboss_crystal') {
                const splits = e.trySplit(this.enemies, this.waveManager.wave, this.waveManager.currentModifier ? this.waveManager.currentModifier.id : null);
                if (splits) { this.enemies.push(...splits); this.waveManager.enemiesRemaining += splits.length; this.sound.play('cloneSplit'); this.triggerShake(10); this.spawnRing(e.x, e.y, '#44ffff', 80); }
            }
        }
        this.enemyProjectiles.forEach(p => p.update(dt, this.width, this.height));
        this.enemyProjectiles = this.enemyProjectiles.filter(p => p.alive);
        this.puddles.forEach(p => p.update(dt)); this.puddles = this.puddles.filter(p => p.active);
        this.sporeClouds.forEach(c => c.update(dt)); this.sporeClouds = this.sporeClouds.filter(c => c.active);
        for(const a of this.chainArcs) a.timer -= dt; this.chainArcs = this.chainArcs.filter(a => a.timer > 0);
        this.phasePhantoms.forEach(p => p.update(dt)); this.phasePhantoms = this.phasePhantoms.filter(p => p.alive);
        this.energySpheres.forEach(s => s.update(dt, this.player.x, this.player.y, this.player.magnetRadius));
        this.energySpheres = this.energySpheres.filter(s => s.alive);
        this.artifacts.forEach(a => a.update(dt)); this.artifacts = this.artifacts.filter(a => a.alive);
        for (const d of this.drones) { const shot = d.update(dt, this.enemies); if (shot) this.projectiles.push(shot); }
        this.drones = this.drones.filter(d => d.alive);
        // Vortex artifact: damage nearby enemies
        if(this.player.vortexArtifact&&this.player.alive){
            for(const e of this.enemies){if(!e.alive)continue;const dx=e.x-this.player.x,dy=e.y-this.player.y,d=Math.sqrt(dx*dx+dy*dy);if(d<this.player.vortexRadius){e.takeDamage(1*dt);if(!e.alive)this.onEnemyKilled(e);}}
        }
        // Spore cloud effects on player
        this.player.sporeSlow=false;
        for(const cloud of this.sporeClouds){
            if(!cloud.active)continue;
            const dx=this.player.x-cloud.x,dy=this.player.y-cloud.y,d=Math.sqrt(dx*dx+dy*dy);
            if(d<cloud.radius&&this.player.alive){this.player.sporeSlow=true;this.player.sporeSlowTimer=0.5;}
        }
        // Hazards (wave 7+)
        if (this.waveManager.wave >= 7 && !this.waveManager.announcing) {
            this.hazardTimer += dt;
            if (this.hazardTimer >= 4 && this.spaceRifts.length < 3) { this.hazardTimer = 0; this.spaceRifts.push(new SpaceRift(50 + Math.random() * (this.width - 100), 50 + Math.random() * (this.height - 100))); this.sound.play('laserWarning'); }
            if (this.laserBeams.length === 0 && Math.random() < 0.005) this.laserBeams.push(new LaserBeam(this.width, this.height));
        }
        for (const rift of this.spaceRifts) {
            rift.update(dt);
            const dx = this.player.x - rift.x, dy = this.player.y - rift.y, dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < rift.radius + this.player.size / 2 && this.player.alive) {
                rift.damageTimer -= dt;
                if (rift.damageTimer <= 0) { const dmg = this.player.takeDamage(1); if (dmg) { this.damageTaken++; this.waveDamageTaken++; this.spawnParticles(this.player.x, this.player.y, '#aa44ff', 6); this.sound.play('playerHit'); this.triggerShake(4); this.vibrate(50); if (!this.player.alive) this.onPlayerDeath(); } rift.damageTimer = 1; }
            }
        }
        this.spaceRifts = this.spaceRifts.filter(r => r.alive);
        for (const laser of this.laserBeams) {
            laser.update(dt);
            if (laser.checkCollision(this.player)) { const dmg = this.player.takeDamage(1); if (dmg) { this.damageTaken++; this.waveDamageTaken++; this.spawnParticles(this.player.x, this.player.y, '#ff4444', 6); this.sound.play('playerHit'); this.triggerShake(6); this.vibrate(50); if (!this.player.alive) this.onPlayerDeath(); } }
        }
        this.laserBeams = this.laserBeams.filter(l => l.alive);
        // v4.0: Turret update
        for(const t of this.turrets){
            if(!t.alive)continue;t.fireTimer+=dt;t.life-=dt;
            if(t.life<=0){t.alive=false;continue;}
            if(t.fireTimer>=t.fireRate){t.fireTimer=0;let closest=null,minD=Infinity;for(const e of this.enemies){if(!e.alive)continue;const dx=e.x-t.x,dy=e.y-t.y,d=Math.sqrt(dx*dx+dy*dy);if(d<t.range&&d<minD){minD=d;closest=e;}}
                if(closest){const dx=closest.x-t.x,dy=closest.y-t.y,len=Math.sqrt(dx*dx+dy*dy);if(len>0){const p=new Projectile(t.x,t.y,dx/len,dy/len,350,t.damage,3);this.projectiles.push(p);this.spawnParticles(t.x,t.y,'#44ff44',2);}}}
        }
        this.turrets=this.turrets.filter(t=>t.alive);
        // v4.0: Vortex update (graviton well ability)
        if(this.abilityVortex&&this.abilityVortex.active){
            const v=this.abilityVortex;v.timer-=dt;
            if(v.timer>0){for(const e of this.enemies){if(!e.alive)continue;const dx=v.x-e.x,dy=v.y-e.y,d=Math.sqrt(dx*dx+dy*dy);if(d<v.radius&&d>0){e.x+=(dx/d)*v.pullForce*dt;e.y+=(dy/d)*v.pullForce*dt;}}
                for(const m of this.mimics){if(!m.alive||m.activated)continue;const dx=v.x-m.x,dy=v.y-m.y,d=Math.sqrt(dx*dx+dy*dy);if(d<v.radius&&d>0){m.x+=(dx/d)*v.pullForce*dt;m.y+=(dy/d)*v.pullForce*dt;}}}
            else if(!v.exploded){v.exploded=true;
                for(const e of this.enemies){if(!e.alive)continue;const dx=e.x-v.x,dy=e.y-v.y,d=Math.sqrt(dx*dx+dy*dy);if(d<v.radius){e.takeDamage(4);if(!e.alive)this.onEnemyKilled(e);}}
                for(const m of this.mimics){if(!m.alive||!m.activated||m.warningActive)continue;const dx=m.x-v.x,dy=m.y-v.y,d=Math.sqrt(dx*dx+dy*dy);if(d<v.radius){m.takeDamage(4);if(!m.alive)this.onEnemyKilled({x:m.x,y:m.y,color:m.color,radius:m.radius,score:m.score,type:'mimic',isElite:false,eliteModifier:null,onDeathSpore:()=>null});}}
                this.spawnParticles(v.x,v.y,'#4488ff',25,2);this.spawnRing(v.x,v.y,'#4488ff',v.radius);this.triggerShake(10);this.sound.play('explosion');v.active=false;}
        }
        // v4.0: Time reversal update
        if(this.timeReversalActive){
            this.timeReversalTimer-=dt;this.timeReversalRecordTimer+=dt;
            if(this.timeReversalRecordTimer>=0.05){this.timeReversalRecordTimer=0;
                for(const s of this.timeReversalSnapshots){if(s.type==='enemy'&&s.ref.alive){s.positions.push({x:s.ref.x,y:s.ref.y});if(s.positions.length>30)s.positions.shift();}}
            }
            if(this.timeReversalTimer<=0){
                this.timeReversalActive=false;
                for(const s of this.timeReversalSnapshots){
                    if(s.type==='enemy'&&s.ref.alive&&s.positions.length>0){const pos=s.positions[s.positions.length-1];s.ref.x=pos.x;s.ref.y=pos.y;}
                    if(s.type==='eproj'&&s.ref.alive){s.ref.alive=false;}
                }
                this.spawnParticles(this.player.x,this.player.y,'#44ddff',15,1.5);this.sound.play('slowDebuff');
            }
        }
        // v4.0: Summoned ghosts update
        for(const g of this.summonedGhosts){
            if(!g.alive)continue;g.life-=dt;if(g.life<=0){g.alive=false;continue;}
            if(!g.targetEnemy||!g.targetEnemy.alive){let closest=null,minD=Infinity;for(const e of this.enemies){if(!e.alive)continue;const dx=e.x-g.x,dy=e.y-g.y,d=Math.sqrt(dx*dx+dy*dy);if(d<minD){minD=d;closest=e;}}g.targetEnemy=closest;}
            if(g.targetEnemy&&g.targetEnemy.alive){const dx=g.targetEnemy.x-g.x,dy=g.targetEnemy.y-g.y,d=Math.sqrt(dx*dx+dy*dy);if(d>0){g.x+=(dx/d)*g.speed*dt;g.y+=(dy/d)*g.speed*dt;}
                if(d<g.radius+g.targetEnemy.radius){g.targetEnemy.takeDamage(g.damage);this.spawnParticles(g.x,g.y,g.color,12,1.5);this.sound.play('explosion');this.triggerShake(5);if(!g.targetEnemy.alive)this.onEnemyKilled(g.targetEnemy);g.alive=false;}}
        }
        this.summonedGhosts=this.summonedGhosts.filter(g=>g.alive);
        // v4.0: Arena event update
        if(this.currentArenaEvent&&!this.waveManager.announcing){
            this.currentArenaEvent.effect(this,dt);
        }
        if(this.eventAnnouncementTimer>0)this.eventAnnouncementTimer-=dt;
        // v4.0: Mimic update
        for(const m of this.mimics){m.update(dt,this.player.x,this.player.y,this.width,this.height);}
        this.mimics=this.mimics.filter(m=>m.alive);
        // v4.0: Mimic player collision (activated mimics and mini-mimics only)
        if(this.player.alive){
            for(const m of this.mimics){
                if(!m.activated||m.warningActive)continue;
                if(!m.alive)continue;
                const dx=this.player.x-m.x,dy=this.player.y-m.y,d=Math.sqrt(dx*dx+dy*dy);
                if(d<m.radius+this.player.size/2){
                    const dmg=m.takeDamage?m.damage:1;
                    if(this.player.thorns){m.takeDamage(1);this.spawnParticles(m.x,m.y,'#44cc44',4);}
                    const damaged=this.player.takeDamage(m.damage);
                    if(damaged){this.damageTaken++;this.waveDamageTaken++;this.spawnParticles(this.player.x,this.player.y,'#ff4444',8);this.sound.play('playerHit');this.triggerShake(6);this.vibrate(50);if(!this.player.alive)this.onPlayerDeath();}
                    if(!m.alive)this.onEnemyKilled({x:m.x,y:m.y,color:m.color,radius:m.radius,score:m.score,type:'mimic',isElite:false,eliteModifier:null,onDeathSpore:()=>null});
                }
                for(const mm of m.miniMimics){
                    if(!mm.alive)continue;
                    const dx2=this.player.x-mm.x,dy2=this.player.y-mm.y,d2=Math.sqrt(dx2*dx2+dy2*dy2);
                    if(d2<mm.radius+this.player.size/2){
                        const damaged=this.player.takeDamage(mm.damage);
                        if(damaged){this.damageTaken++;this.waveDamageTaken++;this.spawnParticles(this.player.x,this.player.y,'#ff4444',6);this.sound.play('playerHit');this.triggerShake(4);this.vibrate(40);if(!this.player.alive)this.onPlayerDeath();}
                        mm.alive=false;this.spawnParticles(mm.x,mm.y,'#ff4444',6);
                    }
                }
            }
        }
        for(const e of this.enemies) { if (e.type === 'swarm' && e.alive && Math.random() < 0.02) this.sound.play('swarmBuzz'); }
        this.checkProjectileEnemyCollisions();
        this.checkEnemyPlayerCollisions();
        this.checkEnemyProjectilePlayerCollisions();
        this.checkPuddlePlayerCollisions();
        this.checkPhasePhantomCollisions();
        this.checkEnergySphereCollisions();
        this.checkArtifactPickup();
        const before = this.enemies.length;
        this.enemies = this.enemies.filter(e => e.alive);
        const killed = before - this.enemies.length;
        for (let i = 0; i < killed; i++) { this.waveManager.onEnemyDied(); this.enemiesKilledTotal++; }
        const ne = this.waveManager.update(dt, this.width, this.height);
        this.enemies.push(...ne);
        // Boss spawn
        if (this.waveManager.isBossWave && !this.bossSpawned && !this.waveManager.announcing) {
            this.enemies.push(this.waveManager.spawnBoss(this.width, this.height));
            this.bossSpawned = true; this.bossSpawnTime = this.gameTime;
            this.sound.play('bossAppear'); this.triggerShake(20);
            this.spawnRing(this.width / 2, this.height / 2, '#ff0066', 150);
        }
        // Miniboss spawn
        if (this.waveManager.isMinibossWave && !this.minibossSpawned && !this.waveManager.announcing) {
            this.enemies.push(this.waveManager.spawnMiniboss(this.width, this.height));
            this.minibossSpawned = true;
            this.sound.play('minibossAppear'); this.triggerShake(12);
            this.spawnRing(this.width / 2, this.height / 2, '#ff00ff', 120);
        }
        if (this.waveManager.isWaveCleared()) this.onWaveCleared();
        this.updateParticles(dt);
    }
    onWaveCleared() {
        // Safety check: on boss/miniboss waves, verify the boss is actually dead
        if (this.waveManager.isBossWave && this.enemies.some(e => e.type === 'boss' && e.alive)) return;
        if (this.waveManager.isMinibossWave && this.enemies.some(e => (e.type==='miniboss'||e.type==='miniboss_wave'||e.type==='miniboss_mirror'||e.type==='miniboss_crystal') && e.alive)) return;
        // Flawless wave check
        if (this.waveDamageTaken === 0) this.flawlessWaves++;
        // Speed runner check
        if (this.waveStartTime < 15) { /* speedrunner tracked in checkAchievements */ }
        this.waveDamageTaken = 0;
        this.waveEnemiesKilled = 0;
        this.waveStartTime = 0;
        // Artifact drop chance (respect maxArtifactSlots from crystalHeart)
        const maxArtSlots = this.player.maxArtifactSlots || 2;
        if (this.waveManager.wave >= 2 && Math.random() < 0.25 && this.artifactSlots < maxArtSlots) {
            const def = ARTIFACT_DEFS[Math.floor(Math.random() * ARTIFACT_DEFS.length)];
            const ax = 100 + Math.random() * (this.width - 200);
            const ay = 100 + Math.random() * (this.height - 200);
            this.artifacts.push(new ArtifactDrop(ax, ay, def));
            this.sound.play('artifactDrop');
        }
        // Boss wave cleared = victory (offer endless mode) or continue in endless
        if (this.waveManager.isBossWave) {
            this.bossKillTime = this.gameTime - this.bossSpawnTime;
            if (this.endlessMode) {
                // In endless mode, just go to upgrade after boss
                this.state = 'upgrade';
                const upgradeCount = this.player.extraUpgradeChoice ? 4 : 3;
                this.upgradeChoices = this.getRandomUpgrades(upgradeCount);
                this.mouseWasDownOnEnter = this.input.mouseDown;
                this.sound.play('challengeComplete');
            } else {
                this.endlessModeOffered = true;
                this.state = 'victory';
                this.sound.play('challengeComplete');
                this.saveScore();
            }
            return;
        }
        // Miniboss wave cleared = prestige
        if (this.waveManager.isMinibossWave) { this.state = 'prestige'; return; }
        // Merchant every 3rd wave
        if (this.waveManager.wave % 3 === 0 && this.waveManager.wave > 1) {
            this.showMerchantScreen();
            return;
        }
        this.state = 'upgrade';
        const upgradeCount = this.player.extraUpgradeChoice ? 4 : 3;
        this.upgradeChoices = this.getRandomUpgrades(upgradeCount);
        this.mouseWasDownOnEnter = this.input.mouseDown;
    }
    getRandomUpgrades(count) {
        const result=[];
        const hasAbilitySlot=this.abilities[0]===null||this.abilities[1]===null;
        const shuffledPassives=[...UPGRADE_POOL].sort(()=>Math.random()-0.5);
        const shuffledAbilities=hasAbilitySlot?ABILITY_POOL.filter(a=>!this.abilities.some(ab=>ab&&ab.id===a.id)).sort(()=>Math.random()-0.5):[];
        let pi=0,ai=0;
        for(let i=0;i<count;i++){
            if(hasAbilitySlot&&ai<shuffledAbilities.length&&Math.random()<0.4){
                const a=shuffledAbilities[ai++];
                const occupiedSlot=this.abilities[0]!==null?1:(this.abilities[1]!==null?0:(Math.random()<0.5?0:1));
                result.push({id:a.id,name:a.name,desc:a.desc+`\nКулдаун: ${a.cooldown}с | Клавиша: ${occupiedSlot===0?'Q':'R'}`,icon:a.color,abilityRef:a,isAbility:true,abilitySlot:occupiedSlot});
            } else if(pi<shuffledPassives.length){
                result.push(shuffledPassives[pi++]);
            } else if(shuffledAbilities.length>0&&ai<shuffledAbilities.length){
                const a=shuffledAbilities[ai++];
                result.push({id:a.id,name:a.name,desc:a.desc+`\nКулдаун: ${a.cooldown}с | Клавиша: ${this.abilities[0]===null?'Q':'R'}`,icon:a.color,abilityRef:a,isAbility:true,abilitySlot:this.abilities[0]===null?0:1});
            }
        }
        return result;
    }
    updateUpgradeScreen() {
        for (let i = 0; i < this.upgradeChoices.length; i++) { if (this.input.isJustPressed(String(i + 1))) { this.applyUpgrade(this.upgradeChoices[i]); return; } }
        if (this.mouseWasDownOnEnter) { if (!this.input.mouseDown) this.mouseWasDownOnEnter = false; return; }
        if (this.input.mouseJustClicked) {
            const cw = 200, ch = 280, gap = 15;
            const tw = this.upgradeChoices.length * cw + (this.upgradeChoices.length - 1) * gap;
            const sx = (this.width - tw) / 2, cy = 130;
            for (let i = 0; i < this.upgradeChoices.length; i++) {
                const cx = sx + i * (cw + gap);
                if (this.input.mouseX >= cx && this.input.mouseX <= cx + cw && this.input.mouseY >= cy && this.input.mouseY <= cy + ch) {
                    this.applyUpgrade(this.upgradeChoices[i]); return;
                }
            }
        }
    }
    applyUpgrade(upgrade) {
        if (this.dailyModifier === 'no_healing' && upgrade.id === 'magnet') return;
        if (this.activeChallenge && this.activeChallenge.maxUpgrades && this.activeUpgrades.length >= this.activeChallenge.maxUpgrades) return;
        if (upgrade.isAbility) {
            const slot = upgrade.abilitySlot !== undefined ? upgrade.abilitySlot : (this.abilities[0] === null ? 0 : 1);
            this.abilities[slot] = upgrade.abilityRef;
            this.abilityCooldowns[slot] = 0;
            this.sound.play('upgradeSelect');
            this.activeUpgrades.push(upgrade.id);
        } else {
            upgrade.apply(this.player);
            this.activeUpgrades.push(upgrade.id);
            this.sound.play('upgradeSelect');
            if (upgrade.id === 'drone') this.drones.push(new Drone(this.player));
            if (this.player.shieldOnWaveStart) { this.player.activateShield(); this.sound.play('shieldActivate'); }
        }
        // Check for combo abilities
        for(const combo of COMBO_DEFS){
            if(!this.activeUpgrades.includes(combo.id)&&combo.requires.every(r=>this.activeUpgrades.includes(r))){
                this.activeUpgrades.push(combo.id);combo.apply(this.player);
                this.sound.play('achievementScreenOpen');
            }
        }
        this.state = 'playing';
        this.minibossSpawned = false; this.bossSpawned = false;
        // Clear leftover enemies from premature wave clear
        this.enemies = this.enemies.filter(e => !e.alive);
        this.enemyProjectiles = [];
        // v4.0: Clear active ability states on wave transition
        this.timeReversalActive = false; this.timeReversalSnapshots = [];
        this.abilityVortex = null;
        this.waveManager.startNextWave(this.width, this.height);
        this.waveStartTime = 0; this.waveEnemiesKilled = 0;
        // Echo: count down waves remaining
        if(this.echoWavesRemaining>0){this.echoWavesRemaining--;if(this.echoWavesRemaining<=0){/* echo expired */}}
        this.sound.play('waveStart');
        this.music.setMood(this.waveManager.wave);
        this.background.setWave(this.waveManager.wave);
        // Arena event: 50% chance starting wave 2
        this.currentArenaEvent = null;
        if (this.waveManager.wave >= 2 && Math.random() < 0.5) {
            this.currentArenaEvent = ARENA_EVENTS[Math.floor(Math.random() * ARENA_EVENTS.length)];
            this.currentArenaEvent.tickTimer = this.currentArenaEvent.tickInterval || 0;
            if (this.currentArenaEvent.init) this.currentArenaEvent.init(this);
            this.eventAnnouncementTimer = 2.0;
            this.sound.play('explosion');
        }
        // Echo: offer temporary bonus every 5 waves post-prestige
        if(this.prestigeLevel>0&&this.waveManager.wave%5===0&&!this.showEchoSelect){
            const pool=[...ECHO_DEFS].sort(()=>Math.random()-0.5);
            this.echoChoices=pool.slice(0,3);this.showEchoSelect=true;
        }
    }
    updatePrestigeScreen() {
        if (this.input.isJustPressed('1') || this.input.isJustPressed('enter')) this.doPrestige();
        if (this.input.isJustPressed('2') || this.input.isJustPressed('escape')) this.skipPrestige();
        if (this.input.isJustPressed('3') && this.prestigeLevel >= 50) this.doAscension();
        if (this.input.mouseJustClicked) {
            const mx = this.input.mouseX, my = this.input.mouseY;
            if (my >= 310 && my <= 340) this.doPrestige();
            else if (my >= 340 && my <= 370) this.skipPrestige();
            else if (my >= 400 && my <= 430 && this.prestigeLevel >= 50) this.doAscension();
        }
    }
    doPrestige() {
        this.prestigeLevel = Math.min(50, this.prestigeLevel + 1);
        this.prestigePoints++;
        // Award a random rune if not all collected
        const unowned=RUNE_DEFS.filter(r=>!this.runeInventory.includes(r.id));
        if(unowned.length>0){const rune=unowned[Math.floor(Math.random()*unowned.length)];this.runeInventory.push(rune.id);this.sound.play('achievementScreenOpen');}
        this.sound.play('prestige'); this.triggerShake(10);
        this.saveScore(); this.saveProgress();
        this.state = 'upgrade';
        this.upgradeChoices = this.getRandomUpgrades(3);
        this.mouseWasDownOnEnter = this.input.mouseDown;
    }
    // v6.0: Ascension — reset prestige to 0 for +1 depth (permanent scaling)
    doAscension() {
        if (this.prestigeLevel < 50) return;
        this.ascensionLevel++;
        this.prestigeLevel = 0;
        this.prestigePoints = 0;
        this.unlockedSkills = [];
        this.sound.play('prestige'); this.triggerShake(25);
        this.spawnParticles(this.width/2, this.height/2, '#aa00ff', 30, 2);
        this.saveScore(); this.saveProgress();
        this.state = 'upgrade';
        this.upgradeChoices = this.getRandomUpgrades(3);
        this.mouseWasDownOnEnter = this.input.mouseDown;
    }
    continueEndless() {
        this.endlessMode = true;
        this.endlessModeOffered = false;
        this.waveManager.endlessMode = true;
        this.state = 'playing';
        this.minibossSpawned = false; this.bossSpawned = false;
        this.enemies = this.enemies.filter(e => !e.alive);
        this.enemyProjectiles = [];
        this.timeReversalActive = false; this.timeReversalSnapshots = [];
        this.abilityVortex = null;
        // Endless mode: permanent stats boost
        this.player.maxHp+=3;this.player.hp+=3;this.player.damage*=1.15;
        this.waveManager.startNextWave(this.width, this.height);
        this.sound.play('upgradeSelect');
        this.music.setMood(this.waveManager.wave);
    }
    showMerchantScreen() {
        this.showMerchant = true;
        this.merchantItems = [];
        const available = [...MERCHANT_ITEMS].sort(() => Math.random() - 0.5).filter(item => this.dailyModifier !== 'no_healing' || (item.id !== 'm_heal' && item.id !== 'm_maxhp'));
        for (let i = 0; i < Math.min(3, available.length); i++) this.merchantItems.push(available[i]);
        this.sound.play('merchantOpen');
    }
    updateMerchant() {
        if (this.input.isJustPressed('escape') || this.input.isJustPressed('enter')) {
            this.showMerchant = false;
            this.state = 'upgrade';
            const upgradeCount = this.player.extraUpgradeChoice ? 4 : 3;
            this.upgradeChoices = this.getRandomUpgrades(upgradeCount);
            this.mouseWasDownOnEnter = this.input.mouseDown;
            return;
        }
        if (this.input.mouseJustClicked) {
            const mx = this.input.mouseX, my = this.input.mouseY;
            for (let i = 0; i < this.merchantItems.length; i++) {
                const cy = 180 + i * 80;
                const bx = this.width / 2 - 180, bw = 360;
                if (mx >= bx && mx <= bx + bw && my >= cy && my <= cy + 65) {
                    const item = this.merchantItems[i];
                    if (this.merchantScore >= item.cost) {
                        this.merchantScore -= item.cost;
                        item.apply(this.player);
                        this.sound.play('merchantBuy');
                        this.spawnParticles(this.width / 2, this.height / 2, '#ffdd00', 12);
                        this.merchantItems.splice(i, 1);
                    }
                    return;
                }
            }
        }
    }
    updateEchoSelect() {
        if (this.input.isJustPressed('escape') || this.input.isJustPressed('enter')) {
            this.showEchoSelect = false; return;
        }
        if (this.input.mouseJustClicked) {
            const mx = this.input.mouseX, my = this.input.mouseY;
            for (let i = 0; i < this.echoChoices.length; i++) {
                const cy = 200 + i * 80;
                const bx = this.width / 2 - 180, bw = 360;
                if (mx >= bx && mx <= bx + bw && my >= cy && my <= cy + 65) {
                    this.echoChoices[i].apply(this.player);
                    this.echoWavesRemaining = this.echoChoices[i].duration;
                    this.showEchoSelect = false;
                    this.sound.play('skillUnlock');
                    this.spawnParticles(this.width/2, this.height/2, '#ffdd00', 12);
                    return;
                }
            }
        }
    }
    drawEchoSelect() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 28px Courier New';
        ctx.fillText('⚡ ЭХО', this.width/2, 100);
        ctx.fillStyle = '#aaa'; ctx.font = '14px Courier New';
        ctx.fillText('Выбери бонус на 2 волны', this.width/2, 130);
        const mx = this.input.mouseX, my = this.input.mouseY;
        for (let i = 0; i < this.echoChoices.length; i++) {
            const echo = this.echoChoices[i];
            const cy = 200 + i * 80;
            const bx = this.width / 2 - 180, bw = 360;
            const hov = mx >= bx && mx <= bx + bw && my >= cy && my <= cy + 65;
            ctx.fillStyle = hov ? 'rgba(255,221,0,0.25)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(bx, cy, bw, 65);
            ctx.strokeStyle = hov ? '#ffdd00' : '#444';
            ctx.lineWidth = hov ? 2 : 1;
            ctx.strokeRect(bx, cy, bw, 65);
            ctx.textAlign = 'left'; ctx.font = 'bold 14px Courier New';
            ctx.fillStyle = '#fff';
            ctx.fillText(`${echo.icon} ${echo.name}`, bx + 15, cy + 25);
            ctx.font = '11px Courier New'; ctx.fillStyle = '#aaa';
            ctx.fillText(echo.desc, bx + 15, cy + 48);
            ctx.textAlign = 'right'; ctx.font = '10px Courier New';
            ctx.fillStyle = '#ffdd00';
            ctx.fillText('2 волны', bx + bw - 15, cy + 25);
        }
        ctx.textAlign = 'center'; ctx.fillStyle = '#666'; ctx.font = '13px Courier New';
        ctx.fillText('Esc/Enter — пропустить', this.width/2, this.height - 30);
    }
    updateVictoryScreen() {
        if (this.input.isJustPressed('escape')) this.state = 'menu';
        if (this.input.mouseJustClicked) {
            const mx = this.input.mouseX, my = this.input.mouseY;
            const bx = this.width / 2 - 180, bw = 360;
            if (this.endlessModeOffered) {
                if (mx >= bx && mx <= bx + bw && my >= 340 && my <= 375) { this.continueEndless(); return; }
                if (mx >= bx && mx <= bx + bw && my >= 390 && my <= 425) { this.initGame(); return; }
            } else {
                if (mx >= bx && mx <= bx + bw && my >= 340 && my <= 375) { this.initGame(); return; }
            }
        }
    }
    updateSettings() {
        if (this.input.isJustPressed('escape') || this.input.isJustPressed('enter')) {
            this.showSettings = false;
            this.saveProgress();
            return;
        }
        if (this.input.mouseJustClicked) {
            const mx = this.input.mouseX, my = this.input.mouseY;
            const cx = this.width / 2;
            // SFX volume: 200-370
            if (my >= 170 && my <= 195) {
                const ratio = Math.max(0, Math.min(1, (mx - 200) / 170));
                this.sfxVolume = ratio;
                this.sound.setSFXVolume(ratio);
                this.saveProgress();
            }
            // Music volume: 220-390
            if (my >= 220 && my <= 245) {
                const ratio = Math.max(0, Math.min(1, (mx - 200) / 170));
                this.musicVolumeSetting = ratio;
                this.sound.setMusicVolume(ratio);
                this.saveProgress();
            }
            // Particles toggle
            if (mx >= cx - 80 && mx <= cx + 80 && my >= 280 && my <= 310) {
                this.particlesEnabled = !this.particlesEnabled;
                this.saveProgress();
            }
            // Resolution buttons
            for (let i = 0; i < 3; i++) {
                const bx = cx - 200 + i * 140;
                if (mx >= bx && mx <= bx + 120 && my >= 340 && my <= 370) {
                    this.canvasResolution = i;
                    this.applyResolution();
                    this.saveProgress();
                }
            }
            // Arena themes
            for (let i = 0; i < 4; i++) {
                const bx = cx - 250 + i * 130;
                if (mx >= bx && mx <= bx + 115 && my >= 400 && my <= 430) {
                    this.selectedArenaTheme = ARENA_THEMES[i];
                    this.selectedCosmetics.arenaTheme = ARENA_THEMES[i];
                    this.saveProgress();
                }
            }
            // Death effects
            for (let i = 0; i < 3; i++) {
                const bx = cx - 195 + i * 130;
                if (mx >= bx && mx <= bx + 115 && my >= 460 && my <= 490) {
                    this.selectedDeathEffect = DEATH_EFFECTS[i];
                    this.selectedCosmetics.deathEffect = DEATH_EFFECTS[i];
                    this.saveProgress();
                }
            }
            // Weapon selection
            const wKeys = Object.keys(WEAPON_DEFS);
            for (let i = 0; i < wKeys.length; i++) {
                const bx = cx - 310 + i * 160;
                if (mx >= bx && mx <= bx + 140 && my >= 520 && my <= 550) {
                    this.selectedCosmetics.weapon = wKeys[i];
                    if (this.player) this.player.currentWeapon = wKeys[i];
                    this.sound.play('weaponSwitch');
                    this.saveProgress();
                }
            }
            // Auto-fire toggle
            if (mx >= cx - 80 && mx <= cx + 80 && my >= 570 && my <= 598) {
                this.autoFire = !this.autoFire;
                this.saveProgress();
            }
            // Screen-shake toggle
            if (mx >= cx + 80 && mx <= cx + 240 && my >= 570 && my <= 598) {
                this.screenShakeEnabled = !this.screenShakeEnabled;
                this.saveProgress();
            }
            // Hit-box toggle
            if (mx >= cx - 80 && mx <= cx + 80 && my >= 605 && my <= 633) {
                this.showHitboxes = !this.showHitboxes;
                this.saveProgress();
            }
            // Reset progress
            if (mx >= cx - 80 && mx <= cx + 80 && my >= 645 && my <= 673) {
                if (this._resetConfirm) {
                    localStorage.clear();
                    location.reload();
                } else {
                    this._resetConfirm = true;
                    setTimeout(() => { this._resetConfirm = false; }, 3000);
                }
            }
        }
    }
    skipPrestige() {
        this.saveScore();
        this.state = 'upgrade';
        this.upgradeChoices = this.getRandomUpgrades(3);
        this.mouseWasDownOnEnter = this.input.mouseDown;
    }
    saveScore() {
        const entry = { score: this.score, wave: this.waveManager.wave, kills: this.enemiesKilledTotal, time: Math.floor(this.gameTime), date: new Date().toLocaleDateString(), ascension: this.ascensionLevel };
        this.highScores.push(entry);
        this.highScores.sort((a, b) => b.score - a.score);
        this.highScores = this.highScores.slice(0, 10);
        if (this.waveManager.wave > this.bestWave) { this.bestWave = this.waveManager.wave; localStorage.setItem('dvs_bestWave', String(this.bestWave)); }
        if (this.score > this.dailyBestScore) { this.dailyBestScore = this.score; localStorage.setItem('dvs_daily_' + this.dailySeed, String(this.score)); }
        // v6.0: Total stats + run history
        this.totalStats.runs=(this.totalStats.runs||0)+1;
        this.totalStats.kills=(this.totalStats.kills||0)+this.enemiesKilledTotal;
        this.totalStats.damageTaken=(this.totalStats.damageTaken||0)+Math.round(this.damageTaken);
        this.totalStats.timePlayed=(this.totalStats.timePlayed||0)+Math.floor(this.gameTime);
        this.totalStats.waves=(this.totalStats.waves||0)+this.waveManager.wave;
        this.runHistory.unshift(entry);
        this.runHistory=this.runHistory.slice(0,10);
        this.saveProgress();
        // Check achievements
        this.checkAchievements();
    }
    checkAchievements() {
        const unlock = (id) => { if (!this.unlockedAchievements.includes(id)) { this.unlockedAchievements.push(id); this.sound.play('achievementUnlock'); this.saveProgress(); } };
        if (this.flawlessWaves > 0) unlock('flawless');
        if (this.combo20Count >= 5) unlock('comboMaster');
        if (this.bossKillTime > 0 && this.bossKillTime < 30) unlock('surgeon');
        if (this.player && this.player.hp <= 1 && this.state !== 'menu') unlock('steel');
        if (this.waveEnemiesKilled >= 100) unlock('hellRush');
        if (this.waveStartTime > 0 && this.waveStartTime < 15) unlock('speedrunner');
        if (this.waveDamageTaken === 0 && this.waveManager.wave > 1) { /* already tracked */ }
        if (this.player && this.player.hp >= this.player.maxHp && this.damageTaken > 0) unlock('tankAch');
        if (this.consecutiveHits >= 10) unlock('sniperStreak');
        if (this.enemiesKilledTotal >= 500) unlock('genocide');
        if (this.waveManager.wave >= 25) unlock('deepDiver');
        if (this.waveManager.wave >= 50) unlock('abyssWalker');
        if (this.waveManager.wave >= 100) unlock('voidImmortal');
        if (this.prestigeLevel >= 50) unlock('legend');
    }
    updateMenuScreens() {
        if (this.input.isJustPressed('escape') || this.input.isJustPressed('enter')) {
            this.showAchievements = false; this.showSkillTree = false; this.showChallengeSelect = false; this.showSettings = false; this.showCodex = false;
            this.sound.play('menuClick'); return;
        }
        if (this.showCodex && this.input.mouseJustClicked) {
            const mx = this.input.mouseX, my = this.input.mouseY;
            const tabs = ['enemies','weapons','upgrades','artifacts','runes','combos','mods','stats'];
            const tabY = 78, tabW = 95, tabH = 26;
            for (let i = 0; i < tabs.length; i++) {
                const tx = this.width/2 - 380 + i * tabW;
                if (mx >= tx && mx <= tx + tabW && my >= tabY && my <= tabY + tabH) {
                    if (this.codexTab !== tabs[i]) { this.codexTab = tabs[i]; this.sound.play('tooltipShow'); }
                    return;
                }
            }
            return;
        }
        if (this.showSkillTree && this.input.mouseJustClicked) {
            const mx = this.input.mouseX, my = this.input.mouseY;
            // Tab buttons
            const tabs = ['survival', 'damage', 'support', 'runes'];
            const tabY = 100;
            for (let i = 0; i < tabs.length; i++) {
                const tx = 140 + i * 140;
                if (mx >= tx && mx <= tx + 120 && my >= tabY && my <= tabY + 30) { this.selectedTab = tabs[i]; this.sound.play('tooltipShow'); return; }
            }
            // Runes tab click
            if(this.selectedTab==='runes'){
                for(let i=0;i<RUNE_DEFS.length;i++){
                    const rune=RUNE_DEFS[i];
                    const row=Math.floor(i/3),col=i%3;
                    const nx=this.width/2-210+col*150,ny=170+row*130;
                    if(mx>=nx&&mx<=nx+130&&my>=ny&&my<=ny+110){
                        if(!this.runeInventory.includes(rune.id))return;
                        const idx=this.activeRunes.indexOf(rune.id);
                        if(idx>=0){this.activeRunes.splice(idx,1);this.sound.play('skillUnlock');}
                        else if(this.activeRunes.length<MAX_ACTIVE_RUNES){this.activeRunes.push(rune.id);this.sound.play('skillUnlock');}
                        else{this.sound.play('playerHit');}
                        this.saveProgress();return;
                    }
                }
                return;
            }
            // Skill nodes
            const skills = SKILL_TREE[this.selectedTab];
            if (skills) {
                for (let i = 0; i < skills.length; i++) {
                    const ny = 160 + i * 70;
                    const nx = this.width / 2 - 120;
                    if (mx >= nx && mx <= nx + 240 && my >= ny && my <= ny + 55) {
                        const skill = skills[i];
                        if (!this.unlockedSkills.includes(skill.id) && this.prestigePoints >= skill.cost) {
                            this.unlockedSkills.push(skill.id);
                            this.prestigePoints -= skill.cost;
                            this.sound.play('skillUnlock');
                            this.saveProgress();
                        }
                        return;
                    }
                }
            }
        }
        if (this.showChallengeSelect && this.input.mouseJustClicked) {
            const mx = this.input.mouseX, my = this.input.mouseY;
            for (let i = 0; i < CHALLENGES.length; i++) {
                const cy = 160 + i * 80;
                if (mx >= 200 && mx <= 600 && my >= cy && my <= cy + 65) {
                    this.sound.init(); this.sound.play('challengeStart');
                    this.showChallengeSelect = false;
                    this.startChallenge(CHALLENGES[i]);
                    return;
                }
            }
        }
    }
    checkProjectileEnemyCollisions() {
        for (const proj of this.projectiles) {
            if (!proj.alive) continue;
            for (const enemy of this.enemies) {
                if (!enemy.alive || proj.hitEnemies.has(enemy)) continue;
                if (enemy.type === 'phantom' && !enemy.visible) continue;
                const dx = proj.x - enemy.x, dy = proj.y - enemy.y, dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < proj.radius + enemy.radius) {
                    let dmg = proj.damage;
                    // Crit
                    if (this.player.critChance && Math.random() < this.player.critChance) dmg *= 2;
                    enemy.takeDamage(dmg);
                    // Ion beam / Разлом времени: slow the enemy
                    if (proj.slowOnHit) { enemy.slowTimer = 1.2; }
                    this.sound.play('enemyHit');
                    this.spawnParticles(proj.x, proj.y, '#ffdd00', 5);
                    this.runStats.shotsHit++;
                    if (proj.explosive) this.triggerExplosion(proj.x, proj.y, proj.explosiveRadius, proj.explosiveDamage);
                    if (proj.ghost) { proj.hitEnemies.add(enemy); }
                    else if (proj.pierceLeft > 0) { proj.hitEnemies.add(enemy); proj.pierceLeft--; }
                    else { proj.alive = false; }
                    if (!enemy.alive) {
                        if (enemy.isElite && enemy.eliteModifier === 'explosive') { this.triggerExplosion(enemy.x, enemy.y, 60, 2); this.sound.play('explosion'); }
                        if (enemy.isElite && enemy.eliteModifier === 'enraged') { for(const e of this.enemies){if(!e.alive||e===enemy)continue;const dx=e.x-enemy.x,dy=e.y-enemy.y;if(Math.sqrt(dx*dx+dy*dy)<120){e.speed*=1.3;e.baseSpeed*=1.3;e.projectileDamage=(e.projectileDamage||1)*1.3;this.spawnParticles(e.x,e.y,'#ff4400',4);}} this.spawnParticles(enemy.x,enemy.y,'#ff4400',10); }
                        if (enemy.isElite && enemy.eliteModifier === 'splitter') { for (let i = 0; i < 3; i++) { const ne = new Enemy(enemy.x + (Math.random()-0.5)*40, enemy.y + (Math.random()-0.5)*40, 'swarm', this.waveManager.wave); this.enemies.push(ne); this.waveManager.enemiesRemaining++; } this.sound.play('cloneSplit'); }
                        this.onEnemyKilled(enemy);
                    }
                    // Chain lightning: bounce to nearest enemy
                    if (proj.chainLightning && proj.alive) {
                        let nearestEnemy = null, nearestDist = 200;
                        for (const ne of this.enemies) {
                            if (!ne.alive || ne === enemy || proj.hitEnemies.has(ne)) continue;
                            const ndx = ne.x - enemy.x, ndy = ne.y - enemy.y, nd = Math.sqrt(ndx*ndx+ndy*ndy);
                            if (nd < nearestDist) { nearestDist = nd; nearestEnemy = ne; }
                        }
                        if (nearestEnemy) {
                            const ndx = nearestEnemy.x - enemy.x, ndy = nearestEnemy.y - enemy.y, ndl = Math.sqrt(ndx*ndx+ndy*ndy);
                            if (ndl > 0) {
                                const chainP = new Projectile(enemy.x, enemy.y, ndx/ndl, ndy/ndl, 600, proj.damage * 0.5, 3);
                                chainP.isEnemy = false; chainP.hitEnemies = new Set([enemy]);
                                chainP.chainLightning = false; chainP.ricochetLeft = 0; chainP.pierceLeft = 0;
                                this.projectiles.push(chainP);
                                this.chainArcs.push({ x1: enemy.x, y1: enemy.y, x2: nearestEnemy.x, y2: nearestEnemy.y, timer: 0.25 });
                                this.spawnParticles(enemy.x, enemy.y, '#88ccff', 4);
                            }
                        }
                    }
                    if (!proj.alive) break;
                }
            }
        }
        // v4.0: Projectile vs mimic/mini-mimic collisions
        for (const proj of this.projectiles) {
            if (!proj.alive) continue;
            for (const m of this.mimics) {
                if (!m.alive) continue;
                if (m.activated && !m.warningActive) {
                    const dx = proj.x - m.x, dy = proj.y - m.y;
                    if (Math.sqrt(dx*dx+dy*dy) < proj.radius + m.radius) {
                        m.takeDamage(proj.damage);
                        this.sound.play('enemyHit');
                        this.spawnParticles(proj.x, proj.y, '#ff4444', 5);
                        proj.alive = false;
                        if (!m.alive) { this.onEnemyKilled({x:m.x,y:m.y,color:m.color,radius:m.radius,score:m.score,type:'mimic',isElite:false,eliteModifier:null,onDeathSpore:()=>null}); }
                        break;
                    }
                }
                for (const mm of m.miniMimics) {
                    if (!mm.alive) continue;
                    const dx = proj.x - mm.x, dy = proj.y - mm.y;
                    if (Math.sqrt(dx*dx+dy*dy) < proj.radius + mm.radius) {
                        mm.alive = false;
                        this.sound.play('enemyHit');
                        this.spawnParticles(mm.x, mm.y, '#ff4444', 4);
                        if (!proj.ghost) proj.alive = false;
                        break;
                    }
                }
            }
        }
    }
    triggerExplosion(x, y, radius, damage) {
        this.spawnParticles(x, y, '#ff8800', 15, 1.5); this.spawnRing(x, y, '#ff6600', radius); this.triggerShake(5);
        // v6.0: Грави-взрыв — pull enemies to center before damage
        if (this.player.comboGravPlode) {
            for (const e of this.enemies) {
                if (!e.alive) continue;
                const dx = e.x-x, dy = e.y-y, dist = Math.sqrt(dx*dx+dy*dy);
                if (dist < radius && dist > 5) { e.x += (dx/dist)*120; e.y += (dy/dist)*120; }
            }
        }
        for (const e of this.enemies) { if (!e.alive) continue; const dx = e.x-x, dy = e.y-y, dist = Math.sqrt(dx*dx+dy*dy); if (dist < radius) { e.takeDamage(damage); if (!e.alive) this.onEnemyKilled(e); } }
        // v4.0: Explosions also hit mimics
        for (const m of this.mimics) { if (!m.alive || !m.activated || m.warningActive) continue; const dx = m.x-x, dy = m.y-y; if (Math.sqrt(dx*dx+dy*dy) < radius) { m.takeDamage(damage); if (!m.alive) this.onEnemyKilled({x:m.x,y:m.y,color:m.color,radius:m.radius,score:m.score,type:'mimic',isElite:false,eliteModifier:null,onDeathSpore:()=>null}); } }
    }
    onEnemyKilled(enemy) {
        this.spawnParticles(enemy.x, enemy.y, enemy.color, 12);
        this.spawnRing(enemy.x, enemy.y, enemy.color, enemy.radius * 3);
        this.player.addCombo();
        if (this.player.combo >= 20) this.combo20Count++;
        let comboScore = Math.floor(enemy.score * this.player.comboMultiplier);
        if (this.waveManager.currentModifier) comboScore = Math.floor(comboScore * (1 + this.waveManager.currentModifier.scoreBonus));
        this.score += comboScore;
        this.merchantScore += Math.floor(enemy.score * 0.5);
        this.waveEnemiesKilled++;
        this.consecutiveHits++;
        this.sound.play(enemy.type === 'boss' || enemy.type === 'miniboss' || enemy.type === 'miniboss_wave' || enemy.type === 'miniboss_mirror' || enemy.type === 'miniboss_crystal' ? 'comboHigh' : 'combo');
        this.triggerShake(enemy.type === 'boss' ? 30 : enemy.type.startsWith('miniboss') ? 20 : enemy.type === 'tank' ? 6 : 3);
        if (enemy.type === 'boss') { this.bossKillTime = this.gameTime - this.bossSpawnTime; this.sound.play('enemyDeath'); }
        // Spore death: create spore cloud
        const cloud = enemy.onDeathSpore();
        if (cloud) { this.sporeClouds.push(cloud); this.sound.play('sporeDeath'); this.spawnParticles(enemy.x, enemy.y, '#44aa22', 8); }
        const vchance = this.player.vampirismChance || (this.player.vampirism ? 0.15 : 0);
        if (vchance > 0 && Math.random() < vchance && this.dailyModifier !== 'no_healing') { this.player.hp = Math.min(this.player.hp + 1, this.player.maxHp); this.spawnParticles(this.player.x, this.player.y, '#ff4444', 6); }        // v4.0: Mimic spawn chance (wave 6+, ~5% for sphere, ~3% for artifact)
        if (this.waveManager.wave >= 6 && !enemy.type.startsWith('miniboss') && enemy.type !== 'boss') {
            if (this.player.magnet && Math.random() < 0.05) {
                this.mimics.push(new Mimic(enemy.x, enemy.y, 'sphere'));
            } else if (Math.random() < 0.03) {
                this.mimics.push(new Mimic(enemy.x, enemy.y, 'artifact'));
            }
        }
        // v4.0: Blood moon healing spheres
        if (this.currentArenaEvent && this.currentArenaEvent.id === 'blood_moon') {
            this.energySpheres.push(new EnergySphere(enemy.x + (Math.random()-0.5)*20, enemy.y + (Math.random()-0.5)*20));
            if (Math.random() < 0.5) this.energySpheres.push(new EnergySphere(enemy.x + (Math.random()-0.5)*20, enemy.y + (Math.random()-0.5)*20));
        }
        if (this.player.magnet) this.energySpheres.push(new EnergySphere(enemy.x, enemy.y));
    }
    checkEnemyPlayerCollisions() {
        if (!this.player.alive) return;
        const half = this.player.size / 2;
        for (const enemy of this.enemies) {
            if (!enemy.alive || enemy.type === 'sludger' || enemy.type === 'pulsar') continue;
            if (enemy.type === 'phantom' && !enemy.visible) continue;
            const cx = Math.max(this.player.x-half, Math.min(enemy.x, this.player.x+half));
            const cy = Math.max(this.player.y-half, Math.min(enemy.y, this.player.y+half));
            const dx = enemy.x-cx, dy = enemy.y-cy, dist = Math.sqrt(dx*dx+dy*dy);
            let dmg = (enemy.type==='miniboss'||enemy.type==='tank'||enemy.type==='boss') ? 2 : (enemy.type==='swarm' ? 0.5 : 1);
            if (enemy.type === 'lancer' && enemy.chargeState === 'charge') dmg = 3;
            // Zombie mode: no contact damage, apply infection instead
            if(window._zombieMode && enemy.zombieInfected !== undefined && dist < enemy.radius){
                if(!this.player.zombieInfection){
                    this.player.zombieInfection=true;this.player.zombieInfectionTimer=3;this.player.zombieInfectionDmg=1;
                    this.spawnParticles(this.player.x,this.player.y,'#44aa22',6);this.sound.play('slowDebuff');
                }
                const pl = Math.sqrt(dx*dx+dy*dy);
                if (pl > 0) { enemy.x += (dx/pl)*60; enemy.y += (dy/pl)*60; }
                continue;
            }
            if (dist < enemy.radius) {
                if (this.player.thorns && dmg >= 1) { enemy.takeDamage(1); this.spawnParticles(enemy.x, enemy.y, '#44cc44', 4); }
                // Ice elite: slow player
                if (enemy.isElite && enemy.eliteModifier === 'ice') this.player.applySlow(3);
                const damaged = this.player.takeDamage(dmg);
                if (damaged) {
                    this.damageTaken += dmg; this.waveDamageTaken += dmg;
                    const px = enemy.x-this.player.x, py = enemy.y-this.player.y, pl = Math.sqrt(px*px+py*py);
                    if (pl > 0) { enemy.x += (px/pl)*60; enemy.y += (py/pl)*60; }
                    this.spawnParticles(this.player.x, this.player.y, '#ff4444', 8);
                    this.spawnRing(this.player.x, this.player.y, '#ff4444', 40);
                    this.sound.play('playerHit'); this.triggerShake(8); this.vibrate(50);
                    if (!this.player.alive) this.onPlayerDeath();
                }
                if (!enemy.alive) this.onEnemyKilled(enemy);
            }
        }
    }
    checkEnemyProjectilePlayerCollisions() {
        if (!this.player.alive) return;
        const half = this.player.size / 2;
        for (const proj of this.enemyProjectiles) {
            if (!proj.alive) continue;
            const cx = Math.max(this.player.x-half, Math.min(proj.x, this.player.x+half));
            const cy = Math.max(this.player.y-half, Math.min(proj.y, this.player.y+half));
            const dx = proj.x-cx, dy = proj.y-cy, dist = Math.sqrt(dx*dx+dy*dy);
            if (dist < proj.radius) {
                proj.alive = false;
                const damaged = this.player.takeDamage(1);
                if (damaged) { this.damageTaken++; this.waveDamageTaken++; this.spawnParticles(this.player.x, this.player.y, '#ff4444', 8); this.sound.play('playerHit'); this.triggerShake(6); this.vibrate(50); if (!this.player.alive) this.onPlayerDeath(); }
            }
        }
    }
    checkPuddlePlayerCollisions() {
        if (!this.player.alive) return;
        for (const puddle of this.puddles) { const dx = this.player.x-puddle.x, dy = this.player.y-puddle.y; if (Math.sqrt(dx*dx+dy*dy) < puddle.radius+this.player.size/2) { if (!this.player.slowed) { this.player.applySlow(2); this.sound.play('slowDebuff'); } } }
    }
    checkPhasePhantomCollisions() {
        for (const ph of this.phasePhantoms) { if (ph.triggered) continue; for (const e of this.enemies) { if (!e.alive) continue; const dx = ph.x-e.x, dy = ph.y-e.y; if (Math.sqrt(dx*dx+dy*dy) < ph.radius+e.radius) { e.takeDamage(ph.damage); ph.triggered=true; ph.alive=false; this.spawnParticles(ph.x, ph.y, '#88ccff', 10, 1.5); if (!e.alive) this.onEnemyKilled(e); break; } } }
    }
    checkEnergySphereCollisions() {
        if (!this.player.alive) return;
        for (const s of this.energySpheres) { if (!s.alive) continue; const dx = this.player.x-s.x, dy = this.player.y-s.y; if (Math.sqrt(dx*dx+dy*dy) < this.player.size/2+s.radius) { s.alive=false; this.player.sphereCount++; this.spawnParticles(s.x, s.y, '#ffdd00', 4); if (this.player.sphereCount >= this.player.spheresPerHeal) { this.player.sphereCount=0; if(this.dailyModifier!=='no_healing'){this.player.hp=Math.min(this.player.hp+(this.player.comboVampMagnet?2:1), this.player.maxHp); this.spawnParticles(this.player.x, this.player.y, '#44ff44', 8);} } } }
    }
    checkArtifactPickup() {
        if (!this.player.alive) return;
        const maxArtSlots = this.player.maxArtifactSlots || 2;
        if (this.artifactSlots >= maxArtSlots) return;
        for (const a of this.artifacts) { if (!a.alive) continue; const dx = this.player.x-a.x, dy = this.player.y-a.y; if (Math.sqrt(dx*dx+dy*dy) < this.player.size/2+a.radius) { a.alive=false; this.artifactSlots++; a.def.apply(this.player); this.sound.play('artifactPickup'); this.spawnParticles(a.x, a.y, a.def.color, 12); } }
    }
    onPlayerDeath() {
        this.state = 'gameover';
        this.spawnParticles(this.player.x, this.player.y, '#2288ff', 20);
        this.spawnParticles(this.player.x, this.player.y, '#ffffff', 10);
        this.spawnRing(this.player.x, this.player.y, '#2288ff', 80);
        this.sound.play('playerDeath'); this.triggerShake(15); this.vibrate(200);
        this.music.stop(); this.saveScore();
    }
    triggerShake(i) { if(!this.screenShakeEnabled) return; this.screenShake = Math.max(this.screenShake, i); }
    vibrate(ms) { if(!this.screenShakeEnabled||!navigator.vibrate) return; try { navigator.vibrate(ms); } catch(e) {} }
    spawnParticles(x,y,color,count,speedMul) { for(let i=0;i<count;i++) this.particles.push(new Particle(x,y,color,speedMul)); }
    spawnRing(x,y,color,maxR) { this.particles.push(new RingParticle(x,y,color,maxR)); }
    updateParticles(dt) { this.particles.forEach(p=>p.update(dt)); this.particles=this.particles.filter(p=>p.alive); }
    draw() {
        const ctx = this.ctx;
        if (this.state === 'menu') { this.drawMenu(); return; }
        ctx.clearRect(0, 0, this.width, this.height);
        let sx = 0, sy = 0;
        if (this.screenShake > 0.5) { sx = (Math.random()-0.5)*this.screenShake; sy = (Math.random()-0.5)*this.screenShake; this.screenShake *= 0.88; } else { this.screenShake = 0; }
        ctx.save(); ctx.translate(sx, sy);
        this.background.draw(ctx);
        this.spaceRifts.forEach(r => r.draw(ctx));
        this.laserBeams.forEach(l => l.draw(ctx));
        this.puddles.forEach(p => p.draw(ctx));
        this.sporeClouds.forEach(c => c.draw(ctx));
        this.energySpheres.forEach(s => s.draw(ctx));
        this.artifacts.forEach(a => a.draw(ctx));
        this.projectiles.forEach(p => p.draw(ctx));
        // Chain lightning arcs
        for(const a of this.chainArcs){
            ctx.save(); ctx.globalAlpha = Math.min(1, a.timer * 4); ctx.strokeStyle = '#88ccff'; ctx.lineWidth = 2;
            ctx.shadowColor = '#88ccff'; ctx.shadowBlur = 8;
            ctx.beginPath(); ctx.moveTo(a.x1, a.y1);
            const steps = 6;
            for(let i=1; i<steps; i++){
                const t = i/steps;
                const mx = a.x1+(a.x2-a.x1)*t + (Math.random()-0.5)*12;
                const my = a.y1+(a.y2-a.y1)*t + (Math.random()-0.5)*12;
                ctx.lineTo(mx, my);
            }
            ctx.lineTo(a.x2, a.y2); ctx.stroke(); ctx.restore();
        }
        this.enemyProjectiles.forEach(p => p.draw(ctx));
        this.phasePhantoms.forEach(p => p.draw(ctx));
        this.enemies.forEach(e => e.draw(ctx));
        // Hitbox visualization
        if(this.showHitboxes){
            ctx.strokeStyle='rgba(255,0,0,0.6)';ctx.lineWidth=1;
            for(const e of this.enemies){if(!e.alive)continue;ctx.beginPath();ctx.arc(e.x,e.y,e.radius,0,Math.PI*2);ctx.stroke();}
            ctx.strokeStyle='rgba(0,255,0,0.6)';
            if(this.player.alive){ctx.beginPath();ctx.arc(this.player.x,this.player.y,this.player.size/2,0,Math.PI*2);ctx.stroke();}
        }
        // v4.0: Draw mimics
        this.mimics.forEach(m => m.draw(ctx));
        // v4.0: Draw turrets
        for(const t of this.turrets){
            if(!t.alive)continue;
            ctx.fillStyle=t.color;ctx.shadowColor='#44ff44';ctx.shadowBlur=10;
            ctx.beginPath();ctx.arc(t.x,t.y,t.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
            ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(t.x,t.y,t.radius*0.4,0,Math.PI*2);ctx.fill();
            const bw=t.radius*2;const bh=3;const bx=t.x-bw/2;const by=t.y-t.radius-8;
            ctx.fillStyle='#333';ctx.fillRect(bx,by,bw,bh);
            ctx.fillStyle=t.hp/t.maxHp>0.5?'#44ff44':'#ff4444';ctx.fillRect(bx,by,bw*(t.hp/t.maxHp),bh);
            ctx.strokeStyle='rgba(68,255,68,0.3)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(t.x,t.y,t.range,0,Math.PI*2);ctx.stroke();
        }
        // v4.0: Draw summoned ghosts
        for(const g of this.summonedGhosts){
            if(!g.alive)continue;
            ctx.globalAlpha=0.6+Math.sin(Date.now()*0.01)*0.2;ctx.fillStyle=g.color;ctx.shadowColor=g.color;ctx.shadowBlur=8;
            ctx.beginPath();ctx.arc(g.x,g.y,g.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.globalAlpha=1;
        }
        // v4.0: Draw vortex
        if(this.abilityVortex&&this.abilityVortex.active){
            const v=this.abilityVortex;const a=Math.min(1,v.timer/2)*0.4;
            ctx.globalAlpha=a;ctx.strokeStyle='#4488ff';ctx.lineWidth=3;ctx.shadowColor='#4488ff';ctx.shadowBlur=15;
            ctx.beginPath();ctx.arc(v.x,v.y,v.radius*(1-v.timer/2*0.3),0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
            ctx.globalAlpha=a*0.3;ctx.fillStyle='#4488ff';ctx.beginPath();ctx.arc(v.x,v.y,v.radius*0.3,0,Math.PI*2);ctx.fill();
            ctx.globalAlpha=1;
        }
        // v4.0: Draw arena event dead zones / portals
        if(this.currentArenaEvent){
            if(this.currentArenaEvent.deadZones){
                for(const dz of this.currentArenaEvent.deadZones){
                    const a=0.2+Math.sin(dz.pulse)*0.1;ctx.globalAlpha=a;ctx.fillStyle='#ff2222';ctx.shadowColor='#ff0000';ctx.shadowBlur=10;
                    ctx.beginPath();ctx.arc(dz.x,dz.y,dz.radius,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
                    ctx.strokeStyle='#ff4444';ctx.lineWidth=2;ctx.globalAlpha=a*0.6;ctx.beginPath();ctx.arc(dz.x,dz.y,dz.radius+3,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
                }
            }
            if(this.currentArenaEvent.portals){
                for(const p of this.currentArenaEvent.portals){
                    const pulse=Math.sin(Date.now()*0.005)*5;ctx.globalAlpha=0.5;ctx.fillStyle='#aa44ff';ctx.shadowColor='#aa44ff';ctx.shadowBlur=15;
                    ctx.beginPath();ctx.arc(p.x,p.y,p.radius+pulse,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
                    ctx.strokeStyle='#cc88ff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,p.radius+pulse+4,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
                }
            }
        }
        this.particles.forEach(p => p.draw(ctx));
        this.drones.forEach(d => d.draw(ctx));
        this.player.draw(ctx);
        if (this.waveManager.currentModifier && this.waveManager.currentModifier.id === 'fog' && this.player) {
            ctx.save();
            ctx.globalCompositeOperation = 'destination-in';
            const grad = ctx.createRadialGradient(this.player.x, this.player.y, 80, this.player.x, this.player.y, 220);
            grad.addColorStop(0, 'rgba(255,255,255,1)');
            grad.addColorStop(0.6, 'rgba(255,255,255,0.8)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, this.width, this.height);
            ctx.restore();
        }
        this.drawHUD();
        if (this.waveManager.announcing) this.drawWaveAnnouncement();
        // v4.0: Arena event announcement
        if(this.eventAnnouncementTimer>0&&this.currentArenaEvent){
            const a=Math.min(1,this.eventAnnouncementTimer/0.5);ctx.globalAlpha=a;ctx.textAlign='center';
            ctx.fillStyle=this.currentArenaEvent.color;ctx.font='bold 24px Courier New';
            ctx.fillText(this.currentArenaEvent.icon+' '+this.currentArenaEvent.name,this.width/2,this.height/2+50);
            ctx.font='14px Courier New';ctx.fillStyle='#fff';
            ctx.fillText(this.currentArenaEvent.desc,this.width/2,this.height/2+75);
            ctx.globalAlpha=1;
        }
        if (this.state === 'upgrade') this.drawUpgradeScreen();
        if (this.state === 'gameover') this.drawGameOver();
        if (this.state === 'prestige') this.drawPrestigeScreen();
        if (this.state === 'victory') this.drawVictoryScreen();
        if (this.showMerchant) this.drawMerchantScreen();
        if (this.showEchoSelect) this.drawEchoSelect();
        ctx.restore();
        if (this.showPause) this.drawPause();
    }
    drawMenu() {
        const ctx = this.ctx;
        this.background.draw(ctx);
        ctx.textAlign = 'center';
        ctx.shadowColor = '#2288ff'; ctx.shadowBlur = 20;
        ctx.fillStyle = '#fff'; ctx.font = 'bold 42px Courier New'; ctx.fillText('DEEP VOID', this.width/2, 100);
        ctx.font = 'bold 38px Courier New'; ctx.fillStyle = '#ffdd00'; ctx.shadowColor = '#ffdd00'; ctx.fillText('SURVIVOR', this.width/2, 148); ctx.shadowBlur = 0;
        ctx.fillStyle = '#888'; ctx.font = '14px Courier New'; ctx.fillText('v6.0 — Глубже Бездны', this.width/2, 178);
        if (this.prestigeLevel > 0 || this.ascensionLevel > 0) {
            let meta='';
            if(this.prestigeLevel>0)meta=`Престиж: ${this.prestigeLevel}/50 (+${Math.min(this.prestigeLevel*5, 250)}% урона) | Очки: ${this.prestigePoints}`;
            if(this.ascensionLevel>0)meta+=(meta?' | ':'')+`✦ Глубина: ${this.ascensionLevel}`;
            ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 14px Courier New'; ctx.fillText(meta, this.width/2, 205);
        } else if(this.ascensionLevel>0){
            ctx.fillStyle = '#aa00ff'; ctx.font = 'bold 14px Courier New'; ctx.fillText(`✦ Глубина: ${this.ascensionLevel}`, this.width/2, 205);
        }
        // Controls
        ctx.fillStyle = '#aaa'; ctx.font = '15px Courier New';
        ['WASD — движение','Мышь — прицел','ЛКМ — стрельба','Shift — рывок','Q/R — способности','Esc — пауза','1-3 — выбор апгрейда'].forEach((c,i) => ctx.fillText(c, this.width/2, 245+i*20));
        // Buttons
        const btns = [
            { y: 400, label: 'НАЧАТЬ ИГРУ', key: 'Enter/Клик' },
            { y: 445, label: 'Достижения [A]', key: '' },
            { y: 490, label: 'Дерево навыков [T]', key: '' },
            { y: 535, label: 'Испытания [C]', key: '' },
            { y: 580, label: 'Настройки [O]', key: '' },
            { y: 625, label: 'Кодекс Бездны [K]', key: '' },
        ];
        const mx = this.input.mouseX, my = this.input.mouseY;
        for (const btn of btns) {
            const bx = this.width/2-140, bw = 280, bh = 35;
            const hov = mx >= bx && mx <= bx+bw && my >= btn.y && my <= btn.y+bh;
            ctx.fillStyle = hov ? 'rgba(34,136,255,0.3)' : 'rgba(34,136,255,0.12)';
            ctx.fillRect(bx, btn.y, bw, bh);
            ctx.strokeStyle = hov ? '#2288ff' : 'rgba(34,136,255,0.3)'; ctx.lineWidth = hov ? 2 : 1;
            ctx.strokeRect(bx, btn.y, bw, bh);
            ctx.fillStyle = '#fff'; ctx.font = 'bold 16px Courier New'; ctx.textAlign = 'center';
            ctx.fillText(btn.label, this.width/2, btn.y+24);
        }
        if (this.bestWave > 0) { ctx.fillStyle = '#ffdd00'; ctx.font = '14px Courier New'; ctx.textAlign = 'center'; ctx.fillText(`Рекорд: Волна ${this.bestWave}`, this.width/2, 668); }
        ctx.fillStyle = '#444'; ctx.font = '11px Courier New'; ctx.fillText('v6.0 | Глубже Бездны | Canvas + .mp3 Audio', this.width/2, 688);
        if (this.showAchievements) this.drawAchievementsOverlay();
        if (this.showSkillTree) this.drawSkillTreeOverlay();
        if (this.showChallengeSelect) this.drawChallengeSelectOverlay();
        if (this.showSettings) this.drawSettingsOverlay();
        if (this.showCodex) this.drawCodexOverlay();
    }
    drawHUD() {
        const ctx = this.ctx;
        // HP
        const bx=16,by=16,bw=160,bh=20;
        ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(bx-2,by-2,bw+4,bh+4);
        ctx.fillStyle='#333';ctx.fillRect(bx,by,bw,bh);
        const r=this.player.hp/this.player.maxHp;ctx.fillStyle=r>0.5?'#44ff44':r>0.25?'#ffaa00':'#ff2222';ctx.fillRect(bx,by,bw*r,bh);
        ctx.fillStyle='#fff';ctx.font='13px Courier New';ctx.textAlign='center';ctx.fillText(`HP: ${this.player.hp}/${this.player.maxHp}`,bx+bw/2,by+15);
        // Score
        ctx.textAlign='right';ctx.font='bold 20px Courier New';ctx.fillStyle='#ffdd00';ctx.fillText(`Score: ${this.score}`,this.width-16,34);
        // Combo
        if(this.player.combo>0){ctx.textAlign='center';ctx.font=`bold ${14+this.player.comboMultiplier*3}px Courier New`;ctx.fillStyle=this.player.comboMultiplier>=5?'#ff4444':this.player.comboMultiplier>=3?'#ff8800':'#ffdd00';ctx.fillText(`x${this.player.comboMultiplier} (${this.player.combo})`,this.width/2,70);}
        // Wave
        ctx.textAlign='center';ctx.font='bold 22px Courier New';ctx.fillStyle='#fff';ctx.fillText(`Волна ${this.waveManager.wave}`,this.width/2,34);
        // Modifier
        if(this.waveManager.currentModifier){ctx.font='bold 13px Courier New';ctx.fillStyle=this.waveManager.currentModifier.color;ctx.fillText(`${this.waveManager.currentModifier.icon} ${this.waveManager.currentModifier.name}: ${this.waveManager.currentModifier.desc}`,this.width/2,55);}
        this.drawActiveUpgradesIcons(ctx);
        if(this.player.magnet){ctx.textAlign='left';ctx.font='12px Courier New';ctx.fillStyle='#ccaa00';ctx.fillText(`Сферы: ${this.player.sphereCount}/${this.player.spheresPerHeal}`,16,this.height-50);}
        if(this.player.slowed){ctx.textAlign='center';ctx.font='bold 14px Courier New';ctx.fillStyle='#44ff44';ctx.fillText('ЗАМЕДЛЕН!',this.width/2,60);}
        if(this.dailyChallenge){ctx.textAlign='right';ctx.font='11px Courier New';ctx.fillStyle='#aa88ff';let mt='';switch(this.dailyModifier){case'sniper':mt='🎯 Только Снайпер';break;case'double_enemies':mt='👥 x2 Врагов';break;case'no_healing':mt='🚫 Нет лечения';break;}ctx.fillText(mt,this.width-16,60);}
        if(this.timeWarpActive){ctx.textAlign='center';ctx.font='bold 18px Courier New';ctx.fillStyle='#44ddff';ctx.globalAlpha=0.6+Math.sin(Date.now()*0.01)*0.3;ctx.fillText('⏳ ЗАМЕДЛЕНИЕ ВРЕМЕНИ',this.width/2,this.height/2-40);ctx.globalAlpha=1;}
        if(this.player.dashCooldown>0){ctx.textAlign='left';ctx.font='11px Courier New';ctx.fillStyle='rgba(136,221,255,0.6)';ctx.fillText(`Рывок: ${this.player.dashCooldown.toFixed(1)}c`,16,85);}
        else{ctx.textAlign='left';ctx.font='11px Courier New';ctx.fillStyle='rgba(136,221,255,0.9)';ctx.fillText('Рывок: Готов',16,85);}
        // v4.0: Ability HUD
        const abilityX=16,abilityStartY=100,abilitySize=32,abilityGap=8;
        for(let ai=0;ai<2;ai++){
            const ay=abilityStartY+ai*(abilitySize+abilityGap);
            const key=ai===0?'Q':'R';
            const ability=this.abilities[ai];
            const cd=this.abilityCooldowns[ai];
            if(ability){
                ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(abilityX-2,ay-2,abilitySize+4,abilitySize+4);
                ctx.fillStyle=ability.color;ctx.globalAlpha=0.25;ctx.fillRect(abilityX,ay,abilitySize,abilitySize);ctx.globalAlpha=1;
                ctx.strokeStyle=cd>0?'#666':'#fff';ctx.lineWidth=cd>0?1:2;ctx.strokeRect(abilityX,ay,abilitySize,abilitySize);
                ctx.font='18px Courier New';ctx.textAlign='center';ctx.textBaseline='middle';
                ctx.fillText(ability.icon,abilityX+abilitySize/2,ay+abilitySize/2);ctx.textBaseline='alphabetic';
                // Cooldown overlay
                if(cd>0){
                    const ratio=cd/ability.cooldown;
                    ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(abilityX,ay,abilitySize,abilitySize*ratio);
                    ctx.font='bold 10px Courier New';ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText(`${cd.toFixed(1)}`,abilityX+abilitySize/2,ay+abilitySize/2+4);
                }
                // Key hint
                ctx.font='bold 10px Courier New';ctx.textAlign='left';ctx.fillStyle='#aaa';ctx.fillText(key,abilityX+abilitySize+4,ay+12);
            } else {
                ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(abilityX-2,ay-2,abilitySize+4,abilitySize+4);
                ctx.strokeStyle='#444';ctx.lineWidth=1;ctx.strokeRect(abilityX,ay,abilitySize,abilitySize);
                ctx.font='bold 14px Courier New';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#444';
                ctx.fillText('+',abilityX+abilitySize/2,ay+abilitySize/2);ctx.textBaseline='alphabetic';
                ctx.font='bold 10px Courier New';ctx.textAlign='left';ctx.fillStyle='#555';ctx.fillText(key,abilityX+abilitySize+4,ay+12);
            }
        }
        // v4.0: Arena event HUD
        if(this.currentArenaEvent){const ev=this.currentArenaEvent;const evPulse=0.7+Math.sin(Date.now()*0.005)*0.3;ctx.textAlign='right';ctx.font='bold 13px Courier New';ctx.globalAlpha=evPulse;ctx.fillStyle=ev.color;ctx.fillText(`${ev.icon} ${ev.name}`,this.width-16,85);ctx.globalAlpha=1;}
        // v4.0: Phase shift indicator
        if(this.player.phaseShifted){ctx.textAlign='left';ctx.font='bold 11px Courier New';ctx.fillStyle='#88ccff';ctx.globalAlpha=0.7+Math.sin(Date.now()*0.01)*0.3;ctx.fillText(`👻 ФАЗОВЫЙ СДВИГ: ${this.player.phaseShiftTimer.toFixed(1)}c`,16,this.height-80);ctx.globalAlpha=1;}
        // Weapon display
        const curWeapon = WEAPON_DEFS[this.player.currentWeapon];
        if(curWeapon){ctx.textAlign='left';ctx.font='11px Courier New';ctx.fillStyle='#ffdd00';ctx.fillText(`Оружие: ${curWeapon.icon} ${curWeapon.name}`,16,180);}
        // Artifact slots
        if(this.artifactSlots>0){ctx.textAlign='left';ctx.font='11px Courier New';ctx.fillStyle='#aa88ff';ctx.fillText(`Артефакты: ${this.artifactSlots}/2`,16,this.height-65);}
        // Challenge mode indicator
        if(this.activeChallenge){ctx.textAlign='right';ctx.font='bold 12px Courier New';ctx.fillStyle='#ff8800';ctx.fillText(`${this.activeChallenge.icon} ${this.activeChallenge.name}`,this.width-16,this.height-50);}
        // Endless mode indicator
        if(this.endlessMode){ctx.textAlign='center';ctx.font='bold 13px Courier New';ctx.fillStyle='#ff4488';ctx.fillText('∞ БЕСКОНЕЧНЫЙ РЕЖИМ',this.width/2,this.height-10);}
        // Merchant score
        if(this.merchantScore>0){ctx.textAlign='right';ctx.font='11px Courier New';ctx.fillStyle='#ffdd00';ctx.fillText(`🛒 ${this.merchantScore}`,this.width-16,52);}
    }
    drawActiveUpgradesIcons(ctx) {
        if(this.activeUpgrades.length===0)return;
        const counts={};this.activeUpgrades.forEach(id=>{counts[id]=(counts[id]||0)+1;});
        const sz=16,gap=4;let x=16;const y=this.height-26;
        for(const[id,count]of Object.entries(counts)){
            const u=UPGRADE_POOL.find(u=>u.id===id);if(!u)continue;
            ctx.fillStyle=u.icon;ctx.fillRect(x,y,sz,sz);ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1;ctx.strokeRect(x,y,sz,sz);
            if(count>1){ctx.fillStyle='#fff';ctx.font='bold 9px Courier New';ctx.textAlign='center';ctx.fillText(`${count}`,x+sz/2,y+sz+9);}
            x+=sz+gap;
        }
    }
    drawWaveAnnouncement() {
        const ctx=this.ctx;const a=Math.min(1,this.waveManager.announceTimer);ctx.globalAlpha=a;ctx.textAlign='center';
        if(this.waveManager.isBossWave){ctx.fillStyle='#ff0066';ctx.font='bold 40px Courier New';ctx.fillText('БОСС',this.width/2,this.height/2-20);ctx.fillStyle='#ffdd00';ctx.font='16px Courier New';ctx.fillText('Босс! Волна '+this.waveManager.wave+(this.endlessMode?' [БЕСКОНЕЧНЫЙ РЕЖИМ]':''),this.width/2,this.height/2+15);}
        else if(this.waveManager.isMinibossWave){ctx.fillStyle='#ff00ff';ctx.font='bold 36px Courier New';ctx.fillText('МИНИ-БОСС',this.width/2,this.height/2-20);ctx.fillStyle='#ffdd00';ctx.font='16px Courier New';let desc='Усиленный враг — Престиж после победы!';if(this.waveManager.wave===15)desc='Волна энергии — Кольцевой залп!';else if(this.waveManager.wave===25)desc='Двойник — Копирует движения!';else if(this.waveManager.wave===35)desc='Кристалл — Разделяется на 4!';ctx.fillText(desc,this.width/2,this.height/2+15);}
        else{ctx.fillStyle='#fff';ctx.font='bold 40px Courier New';ctx.fillText(`Волна ${this.waveManager.wave}`,this.width/2,this.height/2-10);ctx.font='18px Courier New';ctx.fillStyle='#ffdd00';ctx.fillText('Приготовься!',this.width/2,this.height/2+25);}
        ctx.globalAlpha=1;
    }
    drawUpgradeScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffdd00';
        ctx.font = 'bold 36px Courier New';
        ctx.fillText('УЛУЧШЕНИЯ', this.width/2, 100);
        const choices = this.upgradeChoices;
        const cw = 200, ch = 280, gap = 15;
        const tw = choices.length * cw + (choices.length - 1) * gap;
        const sx = (this.width - tw) / 2, cy = 130;
        const mx = this.input.mouseX, my = this.input.mouseY;
        for (let i = 0; i < choices.length; i++) {
            const cx = sx + i * (cw + gap);
            const hov = mx >= cx && mx <= cx + cw && my >= cy && my <= cy + ch;
            const u = choices[i];
            const emoji = u.name.split(' ')[0];
            const accentColor = u.icon;
            ctx.fillStyle = hov ? 'rgba(34,136,255,0.25)' : 'rgba(34,136,255,0.1)';
            ctx.fillRect(cx, cy, cw, ch);
            ctx.fillStyle = accentColor; ctx.globalAlpha = 0.15;
            ctx.fillRect(cx, cy, cw, 5); ctx.globalAlpha = 1;
            if (u.isAbility) { ctx.globalAlpha = 0.12; ctx.fillStyle = accentColor; ctx.fillRect(cx, cy, cw, ch); ctx.globalAlpha = 1; }
            ctx.strokeStyle = hov ? accentColor : 'rgba(34,136,255,0.3)';
            ctx.lineWidth = hov ? 2 : 1;
            ctx.strokeRect(cx, cy, cw, ch);
            ctx.font = 'bold 36px Courier New'; ctx.fillStyle = accentColor;
            ctx.fillText(emoji, cx + cw/2, cy + 50);
            ctx.font = 'bold 14px Courier New'; ctx.fillStyle = '#fff';
            ctx.fillText(u.name, cx + cw/2, cy + 80);
            ctx.font = '11px Courier New'; ctx.fillStyle = '#aaa';
            const descLines = u.desc.split('\n');
            for (let dl = 0; dl < descLines.length; dl++) {
                ctx.fillText(descLines[dl], cx + cw/2, cy + 100 + dl * 14);
            }
            if (u.detail) {
                ctx.fillStyle = '#88cc44'; ctx.font = '10px Courier New';
                ctx.fillText(u.detail, cx + cw/2, cy + 100 + descLines.length * 14);
            }
            ctx.fillStyle = u.isAbility ? accentColor : '#2288ff'; ctx.font = u.isAbility ? 'bold 11px Courier New' : '12px Courier New';
            ctx.fillText(u.isAbility ? 'СПОСОБНОСТЬ' : `[${i + 1}]`, cx + cw/2, cy + ch - 15);
        }
        ctx.fillStyle = '#666'; ctx.font = '12px Courier New';
        ctx.fillText('Нажми 1-' + choices.length + ' или кликни', this.width/2, this.height - 30);
    }
    drawPrestigeScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 36px Courier New';
        ctx.fillText('МИНИ-БОСС ПОБЕЖДЁН!', this.width/2, 150);
        ctx.fillStyle = '#fff'; ctx.font = '16px Courier New';
        ctx.fillText('Мини-босс каждые 5 волн (5, 15, 25...)', this.width/2, 190);
        ctx.fillText(`Престиж: ${this.prestigeLevel} → ${Math.min(50, this.prestigeLevel + 1)}`, this.width/2, 230);
        ctx.fillText(`Бонус: +${Math.min((this.prestigeLevel + 1) * 5, 250)}% урон`, this.width/2, 260);
        ctx.fillStyle = '#2288ff'; ctx.font = 'bold 18px Courier New';
        ctx.fillText('[1] Престиж и продолжить', this.width/2, 320);
        ctx.fillStyle = '#888'; ctx.font = '14px Courier New';
        ctx.fillText('[2] Пропустить и продолжить', this.width/2, 350);
        if (this.prestigeLevel >= 50) {
            ctx.fillStyle = '#aa00ff'; ctx.font = 'bold 18px Courier New';
            ctx.fillText('[3] ✦ ВОСХОЖДЕНИЕ — Глубина ' + (this.ascensionLevel + 1), this.width/2, 415);
            ctx.fillStyle = '#cc88ff'; ctx.font = '13px Courier New';
            ctx.fillText('Сброс престижа: враги +10% HP/волна, +20% очков, +15% урона', this.width/2, 440);
        }
    }
    drawGameOver() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ff2222'; ctx.font = 'bold 42px Courier New';
        ctx.fillText('ПОРАЖЕНИЕ', this.width/2, 140);
        ctx.fillStyle = '#fff'; ctx.font = '18px Courier New';
        ctx.fillText(`Счёт: ${this.score}`, this.width/2, 190);
        ctx.fillText(`Волна: ${this.waveManager.wave}`, this.width/2, 220);
        ctx.fillText(`Врагов убито: ${this.enemiesKilledTotal}`, this.width/2, 250);
        const mins=Math.floor(this.gameTime/60);const secs=Math.floor(this.gameTime%60);ctx.fillText(`Время: ${mins}:${String(secs).padStart(2,'0')}`, this.width/2, 280);
        const acc=this.runStats.shotsFired>0?Math.round(this.runStats.shotsHit/this.runStats.shotsFired*100):0;
        ctx.fillStyle='#88aacc';ctx.font='14px Courier New';
        ctx.fillText(`Точность: ${acc}%  |  Урон/выстрел: ${Math.round(this.runStats.damagePerShot)}  |  Урон получен: ${Math.round(this.runStats.damageTaken)}`, this.width/2, 310);
        if(this.runStats.favoriteUpgrade){ctx.fillText(`Любимый апгрейд: ${this.runStats.favoriteUpgrade}`, this.width/2, 330);}
        ctx.fillStyle = '#ffdd00'; ctx.font = '16px Courier New';
        ctx.fillText('Кликни чтобы продолжить', this.width/2, 370);
    }
    drawVictoryScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 42px Courier New';
        ctx.fillText('ПОБЕДА!', this.width/2, 140);
        ctx.fillStyle = '#fff'; ctx.font = '18px Courier New';
        ctx.fillText(`Счёт: ${this.score}`, this.width/2, 190);
        ctx.fillText(`Время убийства босса: ${this.bossKillTime.toFixed(1)}с`, this.width/2, 220);
        ctx.fillText(`Врагов: ${this.enemiesKilledTotal}`, this.width/2, 250);
        const acc=this.runStats.shotsFired>0?Math.round(this.runStats.shotsHit/this.runStats.shotsFired*100):0;
        ctx.fillStyle='#88aacc';ctx.font='14px Courier New';
        ctx.fillText(`Точность: ${acc}%  |  Урон/выстрел: ${Math.round(this.runStats.damagePerShot)}  |  Урон получен: ${Math.round(this.runStats.damageTaken)}`, this.width/2, 280);
        if(this.runStats.favoriteUpgrade){ctx.fillText(`Любимый апгрейд: ${this.runStats.favoriteUpgrade}`, this.width/2, 300);}
        const bx = this.width/2 - 180, bw = 360;
        const mx = this.input.mouseX, my = this.input.mouseY;
        if (this.endlessModeOffered) {
            const hov1 = mx >= bx && mx <= bx+bw && my >= 340 && my <= 375;
            ctx.fillStyle = hov1 ? 'rgba(255,221,0,0.3)' : 'rgba(255,221,0,0.1)';
            ctx.fillRect(bx, 340, bw, 35);
            ctx.strokeStyle = hov1 ? '#ffdd00' : 'rgba(255,221,0,0.3)';
            ctx.lineWidth = hov1 ? 2 : 1;
            ctx.strokeRect(bx, 340, bw, 35);
            ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 16px Courier New';
            ctx.fillText('⚔ Продолжить в бесконечном режиме', this.width/2, 363);
            ctx.fillStyle = '#888'; ctx.font = '12px Courier New';
            ctx.fillText('Волны 11+: HP×1.15, +1% элитный шанс', this.width/2, 390);
            const hov2 = mx >= bx && mx <= bx+bw && my >= 390 && my <= 425;
            ctx.fillStyle = hov2 ? 'rgba(34,136,255,0.3)' : 'rgba(34,136,255,0.1)';
            ctx.fillRect(bx, 390, bw, 35);
            ctx.strokeStyle = hov2 ? '#2288ff' : 'rgba(34,136,255,0.3)';
            ctx.lineWidth = hov2 ? 2 : 1;
            ctx.strokeRect(bx, 390, bw, 35);
            ctx.fillStyle = '#2288ff'; ctx.font = 'bold 14px Courier New';
            ctx.fillText('Начать заново', this.width/2, 413);
        } else {
            const hov1 = mx >= bx && mx <= bx+bw && my >= 340 && my <= 375;
            ctx.fillStyle = hov1 ? 'rgba(255,221,0,0.3)' : 'rgba(255,221,0,0.1)';
            ctx.fillRect(bx, 340, bw, 35);
            ctx.strokeStyle = hov1 ? '#ffdd00' : 'rgba(255,221,0,0.3)';
            ctx.lineWidth = hov1 ? 2 : 1;
            ctx.strokeRect(bx, 340, bw, 35);
            ctx.fillStyle = '#ffdd00'; ctx.font = '14px Courier New';
            ctx.fillText('Кликни чтобы продолжить', this.width/2, 363);
        }
    }
    drawPause() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#fff'; ctx.font = 'bold 40px Courier New';
        ctx.fillText('ПАУЗА', this.width/2, this.height/2 - 20);
        ctx.fillStyle = '#aaa'; ctx.font = '16px Courier New';
        ctx.fillText('Esc — продолжить | Q — в меню', this.width/2, this.height/2 + 20);
        ctx.fillText(`Престиж: ${this.prestigeLevel} | Рекорд: ${this.bestWave}`, this.width/2, this.height/2 + 50);
    }
    drawAchievementsOverlay() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.9)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 28px Courier New';
        ctx.fillText('ДОСТИЖЕНИЯ', this.width/2, 60);
        const all = ACHIEVEMENTS;
        const cols = 3, pw = 240, ph = 50, gap = 10;
        const sx = (this.width - (cols * pw + (cols - 1) * gap)) / 2;
        for (let i = 0; i < all.length; i++) {
            const col = i % cols, row = Math.floor(i / cols);
            const ax = sx + col * (pw + gap), ay = 90 + row * (ph + gap);
            const unlocked = this.unlockedAchievements.includes(all[i].id);
            ctx.fillStyle = unlocked ? 'rgba(34,136,255,0.15)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(ax, ay, pw, ph);
            ctx.strokeStyle = unlocked ? '#2288ff' : '#333';
            ctx.lineWidth = 1; ctx.strokeRect(ax, ay, pw, ph);
            ctx.textAlign = 'left'; ctx.font = '12px Courier New';
            ctx.fillStyle = unlocked ? '#fff' : '#555';
            ctx.fillText(`${all[i].icon} ${all[i].name}`, ax + 8, ay + 20);
            ctx.font = '10px Courier New'; ctx.fillStyle = unlocked ? '#aaa' : '#444';
            ctx.fillText(all[i].desc, ax + 8, ay + 38);
        }
        ctx.textAlign = 'center'; ctx.fillStyle = '#666'; ctx.font = '13px Courier New';
        ctx.fillText('Esc/Enter/Клик — назад', this.width/2, this.height - 30);
    }
    drawSkillTreeOverlay() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.92)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 28px Courier New';
        ctx.fillText('ДЕРЕВО НАВЫКОВ', this.width/2, 50);
        ctx.font = '14px Courier New'; ctx.fillStyle = '#fff';
        ctx.fillText(`Очки престижа: ${this.prestigePoints}`, this.width/2, 78);
        // Tabs
        const tabs = ['survival', 'damage', 'support', 'runes'];
        const tabLabels = ['Выживание', 'Урон', 'Поддержка', 'Руны'];
        const tabY = 100;
        for (let i = 0; i < tabs.length; i++) {
            const tx = 140 + i * 140;
            const sel = this.selectedTab === tabs[i];
            ctx.fillStyle = sel ? 'rgba(34,136,255,0.3)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(tx, tabY, 120, 30);
            ctx.strokeStyle = sel ? '#2288ff' : '#444'; ctx.lineWidth = sel ? 2 : 1;
            ctx.strokeRect(tx, tabY, 120, 30);
            ctx.fillStyle = sel ? '#fff' : '#888'; ctx.font = 'bold 13px Courier New'; ctx.textAlign = 'center';
            ctx.fillText(tabLabels[i], tx + 60, tabY + 21);
        }
        // Runes tab
        if(this.selectedTab==='runes'){
            ctx.textAlign='center';ctx.fillStyle='#aaa';ctx.font='13px Courier New';
            ctx.fillText(`Активные: ${this.activeRunes.length}/${MAX_ACTIVE_RUNES}`, this.width/2, 150);
            for(let i=0;i<RUNE_DEFS.length;i++){
                const rune=RUNE_DEFS[i];
                const row=Math.floor(i/3),col=i%3;
                const nx=this.width/2-210+col*150,ny=170+row*130;
                const owned=this.runeInventory.includes(rune.id);
                const active=this.activeRunes.includes(rune.id);
                ctx.fillStyle=active?'rgba(34,200,34,0.2)':owned?'rgba(100,100,100,0.2)':'rgba(30,30,30,0.5)';
                ctx.fillRect(nx,ny,130,110);
                ctx.strokeStyle=active?'#44cc44':owned?'#888':'#333';ctx.lineWidth=active?2:1;
                ctx.strokeRect(nx,ny,130,110);
                ctx.textAlign='center';ctx.font='24px Courier New';
                ctx.fillStyle=owned?'#fff':'#444';ctx.fillText(rune.icon,nx+65,ny+35);
                ctx.font='bold 11px Courier New';
                ctx.fillStyle=active?'#44cc44':owned?'#fff':'#555';ctx.fillText(rune.name,nx+65,ny+55);
                ctx.font='10px Courier New';ctx.fillStyle=owned?'#aaa':'#444';ctx.fillText(rune.desc,nx+65,ny+75);
                if(owned){ctx.font='10px Courier New';ctx.fillStyle=active?'#ff8800':'#666';
                    ctx.fillText(active?'[клик: снять]':'[клик: надеть]',nx+65,ny+98);}
            }
        }
        // Skills
        const skills = SKILL_TREE[this.selectedTab] || [];
        for (let i = 0; i < skills.length; i++) {
            const ny = 160 + i * 70;
            const nx = this.width / 2 - 120;
            const unlocked = this.unlockedSkills.includes(skills[i].id);
            const canBuy = !unlocked && this.prestigePoints >= skills[i].cost;
            ctx.fillStyle = unlocked ? 'rgba(34,200,34,0.15)' : canBuy ? 'rgba(34,136,255,0.15)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(nx, ny, 240, 55);
            ctx.strokeStyle = unlocked ? '#44cc44' : canBuy ? '#2288ff' : '#444';
            ctx.lineWidth = unlocked ? 2 : 1;
            ctx.strokeRect(nx, ny, 240, 55);
            ctx.textAlign = 'left'; ctx.font = 'bold 13px Courier New';
            ctx.fillStyle = unlocked ? '#44cc44' : canBuy ? '#fff' : '#555';
            ctx.fillText(`${skills[i].icon} ${skills[i].name}`, nx + 10, ny + 22);
            ctx.font = '11px Courier New'; ctx.fillStyle = unlocked ? '#888' : canBuy ? '#aaa' : '#444';
            ctx.fillText(skills[i].desc, nx + 10, ny + 40);
            if (!unlocked) {
                ctx.textAlign = 'right'; ctx.font = '11px Courier New';
                ctx.fillStyle = canBuy ? '#ffdd00' : '#ff4444';
                ctx.fillText(`${skills[i].cost} оч.`, nx + 230, ny + 22);
            }
        }
        ctx.textAlign = 'center'; ctx.fillStyle = '#666'; ctx.font = '13px Courier New';
        ctx.fillText('Esc/Enter/Клик — назад', this.width/2, this.height - 30);
    }
    drawChallengeSelectOverlay() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.92)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 28px Courier New';
        ctx.fillText('ИСПЫТАНИЯ', this.width/2, 60);
        const mx = this.input.mouseX, my = this.input.mouseY;
        for (let i = 0; i < CHALLENGES.length; i++) {
            const ch = CHALLENGES[i];
            const cy = 120 + i * 80;
            const hov = mx >= 200 && mx <= 600 && my >= cy && my <= cy + 65;
            ctx.fillStyle = hov ? 'rgba(255,136,0,0.2)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(200, cy, 400, 65);
            ctx.strokeStyle = hov ? '#ff8800' : '#444';
            ctx.lineWidth = hov ? 2 : 1;
            ctx.strokeRect(200, cy, 400, 65);
            ctx.textAlign = 'left'; ctx.font = 'bold 14px Courier New';
            ctx.fillStyle = '#fff';
            ctx.fillText(`${ch.icon} ${ch.name}`, 215, cy + 24);
            ctx.font = '11px Courier New'; ctx.fillStyle = '#aaa';
            ctx.fillText(ch.desc, 215, cy + 44);
            // Reward
            ctx.textAlign = 'right'; ctx.font = '10px Courier New';
            ctx.fillStyle = '#ffdd00';
            ctx.fillText(ch.reward, 585, cy + 24);
        }
        ctx.textAlign = 'center'; ctx.fillStyle = '#666'; ctx.font = '13px Courier New';
        ctx.fillText('Esc/Enter/Клик — назад', this.width/2, this.height - 30);
    }
    drawSettingsOverlay() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.92)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 28px Courier New';
        ctx.fillText('НАСТРОЙКИ', this.width/2, 50);
        const cx = this.width / 2;
        // SFX Volume
        ctx.fillStyle = '#fff'; ctx.font = '14px Courier New'; ctx.textAlign = 'left';
        ctx.fillText('Громкость SFX:', 200, 168);
        ctx.fillStyle = '#333'; ctx.fillRect(200, 175, 170, 15);
        ctx.fillStyle = '#44aaff'; ctx.fillRect(200, 175, 170 * this.sfxVolume, 15);
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1; ctx.strokeRect(200, 175, 170, 15);
        ctx.textAlign = 'right'; ctx.fillStyle = '#aaa'; ctx.fillText(`${Math.round(this.sfxVolume*100)}%`, 380, 168);
        // Music Volume
        ctx.textAlign = 'left'; ctx.fillStyle = '#fff'; ctx.font = '14px Courier New';
        ctx.fillText('Громкость музыки:', 200, 218);
        ctx.fillStyle = '#333'; ctx.fillRect(200, 225, 170, 15);
        ctx.fillStyle = '#aa44ff'; ctx.fillRect(200, 225, 170 * this.musicVolumeSetting, 15);
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1; ctx.strokeRect(200, 225, 170, 15);
        ctx.textAlign = 'right'; ctx.fillStyle = '#aaa'; ctx.fillText(`${Math.round(this.musicVolumeSetting*100)}%`, 380, 218);
        // Particles toggle
        ctx.textAlign = 'center';
        ctx.fillStyle = this.particlesEnabled ? '#44ff44' : '#ff4444';
        ctx.fillRect(cx - 80, 280, 160, 30);
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1; ctx.strokeRect(cx - 80, 280, 160, 30);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 13px Courier New';
        ctx.fillText(`Частицы: ${this.particlesEnabled?'ВКЛ':'ВЫКЛ'}`, cx, 300);
        // Resolution
        ctx.fillStyle = '#fff'; ctx.font = '14px Courier New';
        ctx.fillText('Разрешение:', cx, 335);
        const resLabels = ['×0.75 (600×450)', '×1.0 (800×600)', '×1.25 (1000×750)'];
        for (let i = 0; i < 3; i++) {
            const bx = cx - 200 + i * 140;
            const sel = this.canvasResolution === i;
            ctx.fillStyle = sel ? 'rgba(34,136,255,0.3)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(bx, 340, 120, 30);
            ctx.strokeStyle = sel ? '#2288ff' : '#444'; ctx.lineWidth = sel ? 2 : 1;
            ctx.strokeRect(bx, 340, 120, 30);
            ctx.fillStyle = sel ? '#fff' : '#888'; ctx.font = '10px Courier New';
            ctx.fillText(resLabels[i], bx + 60, 359);
        }
        // Arena themes
        ctx.fillStyle = '#fff'; ctx.font = '14px Courier New';
        ctx.fillText('Тема арены:', cx, 395);
        const themeLabels = ['Обычная', 'Кибер-панк', 'Космос', 'Ад'];
        for (let i = 0; i < 4; i++) {
            const bx = cx - 250 + i * 130;
            const sel = this.selectedArenaTheme === ARENA_THEMES[i];
            ctx.fillStyle = sel ? 'rgba(255,221,0,0.3)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(bx, 400, 115, 30);
            ctx.strokeStyle = sel ? '#ffdd00' : '#444'; ctx.lineWidth = sel ? 2 : 1;
            ctx.strokeRect(bx, 400, 115, 30);
            ctx.fillStyle = sel ? '#fff' : '#888'; ctx.font = '12px Courier New';
            ctx.fillText(themeLabels[i], bx + 57, 419);
        }
        // Death effects
        ctx.fillStyle = '#fff'; ctx.font = '14px Courier New';
        ctx.fillText('Эффект смерти врагов:', cx, 455);
        const deathLabels = ['Взрыв', 'Кристаллы', 'Призраки'];
        for (let i = 0; i < 3; i++) {
            const bx = cx - 195 + i * 130;
            const sel = this.selectedDeathEffect === DEATH_EFFECTS[i];
            ctx.fillStyle = sel ? 'rgba(255,68,0,0.3)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(bx, 460, 115, 30);
            ctx.strokeStyle = sel ? '#ff4400' : '#444'; ctx.lineWidth = sel ? 2 : 1;
            ctx.strokeRect(bx, 460, 115, 30);
            ctx.fillStyle = sel ? '#fff' : '#888'; ctx.font = '12px Courier New';
            ctx.fillText(deathLabels[i], bx + 57, 479);
        }
        // Weapon selection
        ctx.fillStyle = '#fff'; ctx.font = '14px Courier New';
        ctx.fillText('Оружие:', cx, 515);
        const wKeys = Object.keys(WEAPON_DEFS);
        for (let i = 0; i < wKeys.length; i++) {
            const w = WEAPON_DEFS[wKeys[i]];
            const bx = cx - 310 + i * 160;
            const sel = this.selectedCosmetics.weapon === wKeys[i];
            ctx.fillStyle = sel ? 'rgba(255,221,0,0.3)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(bx, 520, 140, 30);
            ctx.strokeStyle = sel ? '#ffdd00' : '#444'; ctx.lineWidth = sel ? 2 : 1;
            ctx.strokeRect(bx, 520, 140, 30);
            ctx.fillStyle = sel ? '#fff' : '#888'; ctx.font = '12px Courier New';
            ctx.fillText(`${w.icon} ${w.name}`, bx + 70, 539);
        }
        ctx.fillStyle = '#666'; ctx.font = '13px Courier New'; ctx.textAlign = 'center';
        // Auto-fire toggle
        ctx.fillStyle = this.autoFire ? '#44ff44' : '#ff4444';
        ctx.fillRect(cx - 80, 570, 160, 28);
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1; ctx.strokeRect(cx - 80, 570, 160, 28);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Courier New';
        ctx.fillText(`Авто-огонь: ${this.autoFire?'ВКЛ':'ВЫКЛ'}`, cx, 589);
        // Screen-shake toggle
        ctx.fillStyle = this.screenShakeEnabled ? '#44ff44' : '#ff4444';
        ctx.fillRect(cx + 80, 570, 160, 28);
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1; ctx.strokeRect(cx + 80, 570, 160, 28);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Courier New';
        ctx.fillText(`Тряска: ${this.screenShakeEnabled?'ВКЛ':'ВЫКЛ'}`, cx + 160, 589);
        // Hit-box toggle
        ctx.fillStyle = this.showHitboxes ? '#44ff44' : '#ff4444';
        ctx.fillRect(cx - 80, 605, 160, 28);
        ctx.strokeStyle = '#666'; ctx.lineWidth = 1; ctx.strokeRect(cx - 80, 605, 160, 28);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Courier New';
        ctx.fillText(`Хит-боксы: ${this.showHitboxes?'ВКЛ':'ВЫКЛ'}`, cx, 624);
        // Reset progress
        ctx.fillStyle = '#ff2222';
        ctx.fillRect(cx - 80, 645, 160, 28);
        ctx.strokeStyle = '#ff4444'; ctx.lineWidth = 1; ctx.strokeRect(cx - 80, 645, 160, 28);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Courier New';
        ctx.fillText('Сбросить прогресс', cx, 664);
        ctx.fillStyle = '#666'; ctx.font = '13px Courier New'; ctx.textAlign = 'center';
        ctx.fillText('Esc/Enter — назад', this.width/2, this.height - 30);
    }
    getCodexItems(tab) {
        if(tab==='enemies')return ENEMY_CODE.map(e=>({name:`${e.icon} ${e.name}`,desc:`${e.desc} | HP ${e.hp} | Скорость ${e.speed} | Очки ${e.score}`}));
        if(tab==='weapons')return Object.values(WEAPON_DEFS).map(w=>({name:`${w.icon} ${w.name}`,desc:w.desc}));
        if(tab==='upgrades')return UPGRADE_POOL.map(u=>({name:u.name,desc:`${u.desc}. Сильно против: ${u.strong} | Слабо: ${u.weak}`}));
        if(tab==='artifacts')return ARTIFACT_DEFS.map(a=>({name:`${a.icon} ${a.name}`,desc:a.desc}));
        if(tab==='runes')return RUNE_DEFS.map(r=>({name:`${r.icon} ${r.name}`,desc:r.desc}));
        if(tab==='combos')return COMBO_DEFS.map(c=>{
            const reqs=c.requires.map(id=>{const u=UPGRADE_POOL.find(u=>u.id===id);return u?u.name.split(' ').slice(1).join(' '):id;}).join(' + ');
            return{name:c.name,desc:`${c.desc}. Нужно: ${reqs}`};
        });
        if(tab==='mods'){
            const names={explosive:'Взрывной',regenerating:'Регенерация',frenzied:'Неистовый',shielded:'Щит',enraged:'Взбешённый',ghost:'Призрак',ice:'Лёд',splitter:'Расщепление'};
            const items=WAVE_MODIFIERS.map(m=>({name:`${m.icon} ${m.name}`,desc:`${m.desc} (+${m.scoreBonus*100}% очков)`}));
            for(const e of ELITE_MODIFIERS){items.push({name:`${ELITE_MOD_ICONS[e]||'★'} Элита: ${names[e]||e}`,desc:'Элитный мод врага (волна 4+)'});}
            return items;
        }
        return [];
    }
    drawCodexStats(ctx) {
        const s=this.totalStats||{};
        const mins=Math.floor((s.timePlayed||0)/60);
        ctx.textAlign='left';ctx.font='bold 15px Courier New';ctx.fillStyle='#ffdd00';
        ctx.fillText('ОБЩАЯ СТАТИСТИКА',60,120);
        ctx.font='13px Courier New';ctx.fillStyle='#fff';
        const lines=[
            `Забегов: ${s.runs||0}`,
            `Врагов убито: ${s.kills||0}`,
            `Урона получено: ${s.damageTaken||0}`,
            `Времени в игре: ${mins} мин`,
            `Волн пройдено: ${s.waves||0}`,
            `Лучшая волна: ${this.bestWave}`,
            `Престиж: ${this.prestigeLevel} | Глубина: ${this.ascensionLevel}`,
            `Достижений: ${this.unlockedAchievements.length}/${ACHIEVEMENTS.length}`,
        ];
        lines.forEach((l,i)=>ctx.fillText(l,60,148+i*22));
        ctx.font='bold 15px Courier New';ctx.fillStyle='#ffdd00';
        ctx.fillText('ИСТОРИЯ ЗАБЕГОВ (10)',60,340);
        if(this.runHistory.length===0){ctx.font='13px Courier New';ctx.fillStyle='#888';ctx.fillText('Пока нет забегов — сыграй!',60,365);return;}
        ctx.font='11px Courier New';ctx.fillStyle='#aaa';
        ctx.fillText('#  волна  счёт      убийства  время  глубина  дата',60,362);
        for(let i=0;i<this.runHistory.length;i++){
            const r=this.runHistory[i];
            const m=Math.floor((r.time||0)/60),sec=(r.time||0)%60;
            ctx.fillStyle='#ddd';
            ctx.fillText(`${String(i+1).padStart(2,'0')}  ${String(r.wave||0).padStart(5)}  ${String(r.score||0).padStart(8)}  ${String(r.kills||0).padStart(8)}  ${String(m).padStart(2)}:${String(sec).padStart(2)}  ${String(r.ascension||0).padStart(4)}  ${r.date||''}`,60,378+i*17);
        }
    }
    drawCodexOverlay() {
        const ctx=this.ctx;
        ctx.fillStyle='rgba(0,0,0,0.92)';ctx.fillRect(0,0,this.width,this.height);
        ctx.textAlign='center';
        ctx.fillStyle='#aa00ff';ctx.font='bold 28px Courier New';
        ctx.fillText('✦ КОДЕКС БЕЗДНЫ',this.width/2,45);
        const tabs=[['enemies','Враги'],['weapons','Оружие'],['upgrades','Апгрейды'],['artifacts','Артефакты'],['runes','Руны'],['combos','Комбо'],['mods','Моды'],['stats','Статистика']];
        const tabY=78,tabW=95,tabH=26;
        for(let i=0;i<tabs.length;i++){
            const tx=this.width/2-380+i*tabW;
            const sel=this.codexTab===tabs[i][0];
            ctx.fillStyle=sel?'rgba(170,0,255,0.3)':'rgba(50,50,50,0.5)';
            ctx.fillRect(tx,tabY,tabW,tabH);
            ctx.strokeStyle=sel?'#aa00ff':'#444';ctx.lineWidth=sel?2:1;
            ctx.strokeRect(tx,tabY,tabW,tabH);
            ctx.fillStyle=sel?'#fff':'#888';ctx.font='bold 11px Courier New';ctx.textAlign='center';
            ctx.fillText(tabs[i][1],tx+tabW/2,tabY+18);
        }
        if(this.codexTab==='stats'){this.drawCodexStats(ctx);ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='13px Courier New';ctx.fillText('Esc/Enter/Клик — назад',this.width/2,this.height-20);return;}
        const items=this.getCodexItems(this.codexTab);
        const cols=this.codexTab==='enemies'?4:3;
        const gap=8,cardW=this.codexTab==='enemies'?185:245,cardH=48;
        const sx=(this.width-(cols*cardW+(cols-1)*gap))/2;
        for(let i=0;i<items.length;i++){
            const col=i%cols,row=Math.floor(i/cols);
            const ax=sx+col*(cardW+gap),ay=120+row*(cardH+gap);
            ctx.fillStyle='rgba(30,30,40,0.6)';
            ctx.fillRect(ax,ay,cardW,cardH);
            ctx.strokeStyle='#555';ctx.lineWidth=1;ctx.strokeRect(ax,ay,cardW,cardH);
            ctx.textAlign='left';ctx.font='bold 12px Courier New';ctx.fillStyle='#fff';
            ctx.fillText(items[i].name,ax+8,ay+18);
            ctx.font='10px Courier New';ctx.fillStyle='#aaa';
            const desc=items[i].desc||'';
            const chars=Math.max(8,Math.floor((cardW-16)/6.3));
            let l1=desc,l2='';
            if(desc.length>chars){l1=desc.slice(0,chars);l2=desc.slice(chars,chars*2);}
            ctx.fillText(l1,ax+8,ay+33);
            if(l2)ctx.fillText(l2,ax+8,ay+44);
        }
        ctx.textAlign='center';ctx.fillStyle='#666';ctx.font='13px Courier New';
        ctx.fillText('Esc/Enter/Клик — назад',this.width/2,this.height-20);
    }
    drawMerchantScreen() {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(0,0,0,0.88)';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffdd00'; ctx.font = 'bold 32px Courier New';
        ctx.fillText('🛒 ТОРГОВЕЦ', this.width/2, 100);
        ctx.fillStyle = '#fff'; ctx.font = '16px Courier New';
        ctx.fillText(`Очки: ${this.merchantScore}`, this.width/2, 135);
        for (let i = 0; i < this.merchantItems.length; i++) {
            const item = this.merchantItems[i];
            const cy = 180 + i * 80;
            const bx = this.width / 2 - 180, bw = 360;
            const mx = this.input.mouseX, my = this.input.mouseY;
            const hov = mx >= bx && mx <= bx + bw && my >= cy && my <= cy + 65;
            const canBuy = this.merchantScore >= item.cost;
            ctx.fillStyle = hov ? 'rgba(255,221,0,0.2)' : 'rgba(50,50,50,0.5)';
            ctx.fillRect(bx, cy, bw, 65);
            ctx.strokeStyle = canBuy ? (hov ? '#ffdd00' : '#666') : '#333';
            ctx.lineWidth = hov ? 2 : 1;
            ctx.strokeRect(bx, cy, bw, 65);
            ctx.textAlign = 'left'; ctx.font = 'bold 16px Courier New';
            ctx.fillStyle = canBuy ? '#fff' : '#555';
            ctx.fillText(`${item.icon} ${item.name}`, bx + 15, cy + 25);
            ctx.font = '12px Courier New'; ctx.fillStyle = canBuy ? '#aaa' : '#444';
            ctx.fillText(item.desc, bx + 15, cy + 45);
            ctx.textAlign = 'right'; ctx.font = 'bold 14px Courier New';
            ctx.fillStyle = canBuy ? '#ffdd00' : '#ff4444';
            ctx.fillText(`${item.cost} оч.`, bx + bw - 15, cy + 30);
        }
        ctx.textAlign = 'center'; ctx.fillStyle = '#888'; ctx.font = '13px Courier New';
        ctx.fillText('Esc/Enter — пропустить | Кликни для покупки', this.width/2, this.height - 30);
    }
    boot() {
        this.sound.init();
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.loop(t));
    }
}
const game = new Game();
game.boot();
