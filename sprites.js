// ============================================
// Sprite Manager — loads & draws DCSS sprite sheets
// ============================================

const SPRITE_MAP = {
    player:         { file: 'sprites/player.png',        size: 32 },
    player_armor:   { file: 'sprites/player_armor.png',  size: 32 },
    player_weapon:  { file: 'sprites/player_weapon.png', size: 32 },
    enemy_swarm:    { file: 'sprites/enemy_swarm.png',   size: 32 },
    enemy_fast:     { file: 'sprites/enemy_fast.png',    size: 32 },
    enemy_crawler:  { file: 'sprites/enemy_crawler.png', size: 32 },
    enemy_shooter:  { file: 'sprites/enemy_shooter.png', size: 32 },
    enemy_sludger:  { file: 'sprites/enemy_sludger.png', size: 32 },
    enemy_blinker:  { file: 'sprites/enemy_blinker.png', size: 32 },
    enemy_tank:     { file: 'sprites/enemy_tank.png',    size: 32 },
    enemy_phantom:  { file: 'sprites/enemy_phantom.png', size: 32 },
    enemy_lancer:   { file: 'sprites/enemy_lancer.png',  size: 32 },
    enemy_summoner: { file: 'sprites/enemy_summoner.png',size: 32 },
    enemy_miniboss: { file: 'sprites/enemy_miniboss.png',size: 32 },
    enemy_boss:     { file: 'sprites/enemy_boss.png',    size: 32 },
    proj_player:    { file: 'sprites/proj_player.png',   size: 32 },
    proj_enemy:     { file: 'sprites/proj_enemy.png',    size: 32 },
    proj_ghost:     { file: 'sprites/proj_ghost.png',    size: 32 },
    energy_sphere:  { file: 'sprites/energy_sphere.png', size: 32 },
    artifact:       { file: 'sprites/artifact.png',      size: 32 },
    effect_flame:   { file: 'sprites/effect_flame.png',  size: 32 },
};

class SpriteManager {
    constructor() {
        this.images = {};
    }

    init() {
        for (const [id, cfg] of Object.entries(SPRITE_MAP)) {
            const img = new Image();
            const entry = { img, cfg, ready: false };
            img.onload = () => { entry.ready = true; };
            img.onerror = () => { entry.ready = true; };
            img.src = cfg.file;
            this.images[id] = entry;
        }
    }

    isReady(id) {
        const entry = this.images[id];
        if (!entry) return false;
        if (entry.ready) return true;
        if (entry.img.complete && entry.img.naturalWidth > 0) {
            entry.ready = true;
            return true;
        }
        return false;
    }

    draw(ctx, id, x, y, targetSize, options) {
        const entry = this.images[id];
        if (!entry || !this.isReady(id)) return false;

        const s = targetSize || entry.cfg.size;
        const sw = entry.cfg.size;

        ctx.save();

        let alpha = 1;
        if (options && options.alpha != null) alpha = options.alpha;
        ctx.globalAlpha = alpha;

        const hx = x - s / 2;
        const hy = y - s / 2;

        // Tint via color overlay (source-atop only affects drawn pixels)
        if (options && options.tint) {
            ctx.drawImage(entry.img, hx, hy, s, s);
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = options.tint;
            ctx.globalAlpha = (options.tintAlpha != null ? options.tintAlpha : 0.4);
            ctx.fillRect(hx, hy, s, s);
            ctx.globalCompositeOperation = 'source-over';
        } else if (options && options.hitFlash) {
            ctx.drawImage(entry.img, hx, hy, s, s);
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.6;
            ctx.fillRect(hx, hy, s, s);
            ctx.globalCompositeOperation = 'source-over';
        } else {
            ctx.drawImage(entry.img, hx, hy, s, s);
        }

        ctx.restore();
        return true;
    }
}
