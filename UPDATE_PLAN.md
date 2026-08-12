# 🎮 Deep Void Survivor — План обновления v6.0 «Глубже Бездны»

> Дата: 2026-08-01
> Статус: РЕАЛИЗОВАНО
> Версии: desktop (мастер) и mobile (пересобрана из десктопной + мобильный слой)

---

## ✅ СДЕЛАНО В v6.0

### 1. 🔊 Звук: WAV → MP3 + новые эффекты
- Все 57 звуков переконвертированы из WAV (248 МБ) в MP3 (12.3 МБ, 66 файлов, 112k/96k).
- Новые звуки (9): `wave-start`, `merchant-open`, `merchant-buy`, `weapon-switch`, `warlock-teleport`, `warlock-debuff`, `spore-death`, `pulsar-beep`, `ion-shot`.
- В `SoundEngine` все пути переведены на `.mp3`, добавлены ключи `ionShot`, `pulsarBeep` и остальные.

### 2. 👾 Новый враг «Пульсар» (вместо «Глашатая»)
- Неподвижная «бомба»: радиус 14, HP 4, цвет `#ff3355`, очки 25.
- Цикл 3 сек: телеграфное кольцо (заряд), затем взрыв 90px с уроном 1 по игроку.
- Исключён из контактного урона и телепорта колдуна.
- Спавн с 10-й волны (2.5% шанс в составе волн).

### 3. ⚔️ Новое оружие «Ионный луч» (🔱)
- Pierce +2, замедляет врагов на 1.2с (×0.5 скорости), свой звук `ionShot`.
- Фикс баланса: overcharge/barrage теперь работают через `fireRateMul` вместо `shootRate`; минимальный интервал выстрела 0.08с.

### 4. 💎 Новый артефакт «Разлом времени» (⏳)
- `slowOnHit`: все пули замедляют врагов.

### 5. ⚡ Новая руна «Скорострельность»
- `fireRateMul × 0.85` (+15% скорострельность).

### 6. 🔗 3 новых комбо
- **Жажда** (vampirism + magnet): сферы лечат 2 HP вместо 1.
- **Грави-взрыв** (graviton + explosiveBullets): взрывы притягивают врагов.
- **Временной снайпер** (timeWarp + marksman): урон ×2 пока активен time warp.

### 7. 📖 Кодекс Бездны (меню, клавиша K)
- 8 вкладок: Враги (бестиарий 20), Оружие, Апгрейды, Артефакты, Руны, Комбо, Моды, Статистика.
- Вкладка «Статистика»: общая статистика + история 10 последних забегов.

### 8. ✦ Асцензия (глубина)
- После волны 50 и престижа 50/50 доступно «Восхождение» на экране престижа (клавиша 3 / кнопка).
- Сброс престижа → +1 глубина: враги +10% HP, +3% скорости, +20% очков за волну; игрок +15% урона за уровень.
- Глубина отображается в меню и в истории забегов.

### 9. 🏆 Достижения
- «Ходок Бездны» (волна 50, цвет игрока `#4400cc`).
- «Бессмертный Бездны» (волна 100, эффект смерти `#aa00ff`).

### 10. ⚙️ Настройки и качество жизни
- Тумблер «Тряска экрана» (screen shake) в настройках.
- Вибрация на мобильных при уроне (гейтится тумблером тряски).
- Общая статистика и история забегов в localStorage (`dvs_totalStats`, `dvs_runHistory`).
- Фикс: руна «Жажда» корректно включала вампиризм.

### 11. 📱 Мобильная версия
- Полностью пересобрана из десктопной v6.0 (все фичи v5/v6 доступны: руны, эхо, темы арены, кодекс, асцензия).
- Перенесён мобильный слой: джойстик, тач-прицел, авто-огонь, двойной тап/свайп — рывок, кнопки (⚡ рывок, 🔫 оружие, Q/R способности, ⏸ пауза), portrait-предупреждение.
- `sw.js` обновлён: `dvs-v6.0`, все ассеты `.mp3`.

---

## 📁 Итоговая структура звуков (66 файлов на версию)

```
sounds/
  music/            calm, tense, danger, boss  (.mp3)
  sfx/player/       shoot, triple, hit, death, dash, ion-shot
  sfx/enemy/        hit, death, miniboss-appear, elite-appear, blink-teleport,
                    swarm-buzz, clone-split, ghost-phase, boss-appear,
                    phantom-appear, phantom-whoosh, lancer-charge, lancer-hit,
                    summoner-spawn, summoner-signal, warlock-teleport,
                    warlock-debuff, spore-death
  sfx/combat/       explosion, combo, combo-high
  sfx/hazards/      laser-warning, puddle-place, slow-debuff, pulsar-beep
  sfx/ui/           menu-click, upgrade-select, shield-activate, prestige,
                    tooltip-show, pause-open, stat-reveal, achievement-unlock,
                    achievement-screen-open, cosmetic-unlock, skill-tree-open,
                    skill-unlock, skill-confirm, record-new, wave-start,
                    merchant-open, merchant-buy, weapon-switch
  sfx/modifiers/    inversion, fog, ricochet, growth, chaos
  sfx/artifacts/    drop, pickup, stasis-block, echo-shot, crystal-dash
  sfx/challenges/   start, complete, fail
```

---

## 🔮 Планы на будущее (v7.0+)
- Пресеты билдов и автоматическая сборка комбо.
- Кооперативный режим (локальный 2p).
- Новые волны с уникальными «мини-боссами абиссала».
- Синтез звукового движка: пространственный звук при 3D.
