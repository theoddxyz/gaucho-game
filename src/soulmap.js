// soulmap.js — Overlay 2D del mapa de almas (tecla M)
// Izquierda: metaplano (almas flotando)
// Derecha:   realidad territorial (pueblo, recursos, campesinos)

import { META_W, META_H, DEST, HOUSES, getIntention } from './souls.js';

const TERRA_XMIN = -80, TERRA_XMAX = 120;
const TERRA_YMIN = -110, TERRA_YMAX = 110;
const TERRA_W = TERRA_XMAX - TERRA_XMIN;
const TERRA_H = TERRA_YMAX - TERRA_YMIN;

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'];
const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

const HOUSE_LABELS = ['Casa Ramón', 'Casa Ofelia', 'Casa Facundo', 'Casa Celestino', 'Casa Zulma'];

const QUADRANT_LABELS = [
  { qx: 0.75, qy: 0.25, text: 'TRASCENDENTE\nGRUPO',   col: 'rgba(167,139,250,0.15)' },
  { qx: 0.25, qy: 0.25, text: 'TRASCENDENTE\nINDIVIDUO', col: 'rgba(96,165,250,0.10)' },
  { qx: 0.75, qy: 0.75, text: 'MATERIA\nGRUPO',        col: 'rgba(52,211,153,0.10)'  },
  { qx: 0.25, qy: 0.75, text: 'MATERIA\nINDIVIDUO',    col: 'rgba(248,113,113,0.10)' },
];

export class SoulMap {
  constructor(soulSystem) {
    this._souls    = soulSystem;
    this._mode     = 0;          // 0=oculto  1=almas  2=criaturas
    this._creatures = null;      // datos de fauna en vivo

    this._canvas = document.createElement('canvas');
    this._canvas.style.cssText = [
      'position:fixed', 'top:0', 'left:0',
      'width:100%', 'height:100%',
      'pointer-events:none',
      'display:none',
      'z-index:200',
    ].join(';');
    document.body.appendChild(this._canvas);

    document.addEventListener('keydown', e => {
      if (e.code === 'KeyM') {
        this._mode = (this._mode + 1) % 3;
        this._canvas.style.display = this._mode > 0 ? 'block' : 'none';
      }
    });

    window.addEventListener('resize', () => this._resize());
    this._resize();
  }

  // Llamado cada frame desde main.js para actualizar datos de fauna
  setCreatureData(data) { this._creatures = data; }

  _resize() {
    this._canvas.width  = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }

  draw() {
    if (this._mode === 0) return;

    const ctx = this._canvas.getContext('2d');
    const W   = this._canvas.width;
    const H   = this._canvas.height;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(4, 4, 10, 0.93)';
    ctx.fillRect(0, 0, W, H);

    if (this._mode === 1) {
      // ── Mapa de almas ──────────────────────────────────────────────────────
      const hw = Math.floor(W / 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.12)';
      ctx.lineWidth   = 1;
      ctx.beginPath(); ctx.moveTo(hw, 10); ctx.lineTo(hw, H - 10); ctx.stroke();
      ctx.font = 'bold 12px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.textAlign = 'center';
      ctx.fillText('METAPLANO  —  ALMAS', hw / 2, 18);
      ctx.fillText('REALIDAD TERRITORIAL', hw + hw / 2, 18);
      ctx.font = '10px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.textAlign = 'right';
      ctx.fillText('[M] ciclo', W - 8, H - 6);
      const PAD = 28;
      this._drawMeta (ctx,  0,  PAD, hw,     H - PAD * 2);
      this._drawTerra(ctx, hw,  PAD, W - hw, H - PAD * 2);
    } else {
      // ── Mapa de criaturas ──────────────────────────────────────────────────
      this._drawCreatureMap(ctx, W, H);
    }
  }

  // ─── Metaplano ────────────────────────────────────────────────────────────
  _drawMeta(ctx, ox, oy, w, h) {
    const { units, guardianPos, playerGuardian, time } = this._souls;
    const hr = time.hour;
    const isRitual = hr >= 19 || hr < 12;

    // Fondo ritual
    if (isRitual) {
      ctx.fillStyle = 'rgba(80,30,120,0.07)';
      ctx.fillRect(ox, oy, w, h);
    }

    // Cuadrantes coloreados
    const qw = w / 2, qh = h / 2;
    const quadColors = [
      'rgba(167,139,250,0.06)', // top-right OFFERING
      'rgba(96,165,250,0.04)',  // top-left  HOARDING
      'rgba(52,211,153,0.05)',  // bot-right SHARING
      'rgba(248,113,113,0.04)',  // bot-left  CONSUMING
    ];
    [[ox+qw,oy],[ox,oy],[ox+qw,oy+qh],[ox,oy+qh]].forEach((pos, i) => {
      ctx.fillStyle = quadColors[i];
      ctx.fillRect(pos[0], pos[1], qw, qh);
    });

    // Líneas de cuadrante
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(ox + qw, oy); ctx.lineTo(ox + qw, oy + h);
    ctx.moveTo(ox, oy + qh); ctx.lineTo(ox + w, oy + qh);
    ctx.stroke();
    ctx.setLineDash([]);

    // Zona pulpería (extremos X)
    ctx.strokeStyle = 'rgba(251,191,36,0.10)';
    ctx.setLineDash([2, 4]);
    ctx.strokeRect(ox, oy + h * 0.15, w * 0.075, h * 0.7);
    ctx.strokeRect(ox + w * 0.925, oy + h * 0.15, w * 0.075, h * 0.7);
    ctx.setLineDash([]);

    // Etiquetas de cuadrante
    ctx.font      = '8px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.textAlign = 'center';
    ctx.fillText('TRASCENDENTE',   ox + w / 2, oy + 10);
    ctx.fillText('MATERIA',        ox + w / 2, oy + h - 2);
    ctx.save();
    ctx.translate(ox + 10, oy + h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('INDIVIDUO', 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(ox + w - 10, oy + h / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('GRUPO', 0, 0);
    ctx.restore();

    // Borde ritual
    if (isRitual) {
      ctx.strokeStyle = 'rgba(167,139,250,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(ox, oy, w, h);
      ctx.font      = 'italic 9px monospace';
      ctx.fillStyle = 'rgba(167,139,250,0.5)';
      ctx.textAlign = 'center';
      ctx.fillText('✦ RITUAL ACTIVO ✦', ox + w / 2, oy + h - 6);
    }

    // Guardian principal
    const gp = this._m2c(guardianPos, ox, oy, w, h);
    const pulse = Math.sin(Date.now() * 0.005) * 5 + 12;
    ctx.beginPath(); ctx.arc(gp.x, gp.y, pulse, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(167,139,250,0.35)';
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(167,139,250,0.07)'; ctx.fill();
    ctx.beginPath(); ctx.arc(gp.x, gp.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#a78bfa'; ctx.fill();
    ctx.font = '7px monospace'; ctx.fillStyle = 'rgba(167,139,250,0.6)';
    ctx.textAlign = 'left';
    ctx.fillText('guardian', gp.x + 7, gp.y + 3);

    // Player guardian (temporal — aparece cuando el jugador habla con un aldeano)
    if (playerGuardian) {
      const remaining = (playerGuardian.expiresAt - performance.now()) / playerGuardian.duration;
      const pgAlpha   = Math.max(0, remaining);
      const pgp       = this._m2c(playerGuardian.pos, ox, oy, w, h);
      const pgPulse   = Math.sin(Date.now() * 0.014) * 6 + 10;
      ctx.globalAlpha = pgAlpha;
      ctx.beginPath(); ctx.arc(pgp.x, pgp.y, pgPulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(251,191,36,0.8)';
      ctx.lineWidth   = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(251,191,36,0.12)'; ctx.fill();
      ctx.beginPath(); ctx.arc(pgp.x, pgp.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24'; ctx.fill();
      // Línea hacia el target
      const tgt = this._m2c(playerGuardian.targetPos, ox, oy, w, h);
      ctx.beginPath(); ctx.moveTo(pgp.x, pgp.y); ctx.lineTo(tgt.x, tgt.y);
      ctx.strokeStyle = 'rgba(251,191,36,0.25)';
      ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
      ctx.stroke(); ctx.setLineDash([]);
      // Label con nombre del jugador
      ctx.font = '7px monospace'; ctx.fillStyle = 'rgba(251,191,36,0.9)';
      ctx.textAlign = 'left';
      ctx.fillText(playerGuardian.playerName, pgp.x + 8, pgp.y + 3);
      ctx.globalAlpha = 1;
    }

    // Units
    units.forEach((unit, i) => {
      const col = COLORS[i % COLORS.length];

      // Trail
      if (unit.history.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = col;
        ctx.lineWidth   = 1;
        unit.history.forEach((p, hi) => {
          const cp = this._m2c(p, ox, oy, w, h);
          ctx.globalAlpha = (hi / unit.history.length) * 0.3;
          hi === 0 ? ctx.moveTo(cp.x, cp.y) : ctx.lineTo(cp.x, cp.y);
        });
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      const mp = this._m2c(unit.metaPos, ox, oy, w, h);

      // Speech bubble
      if (unit.speech) {
        ctx.font      = '7px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(`"${unit.speech}"`, mp.x, mp.y - 10);
      }

      // Punto
      ctx.beginPath(); ctx.arc(mp.x, mp.y, unit.isSleeping ? 2 : 4, 0, Math.PI * 2);
      ctx.fillStyle = unit.isSleeping ? 'rgba(100,100,180,0.6)' : col;
      ctx.fill();

      // Nombre
      ctx.font      = '8px monospace';
      ctx.fillStyle = col;
      ctx.textAlign = 'left';
      ctx.fillText(unit.name, mp.x + 6, mp.y + 3);
    });
  }

  // ─── Realidad territorial ─────────────────────────────────────────────────
  _drawTerra(ctx, ox, oy, w, h) {
    const { units, resources, stocks, time } = this._souls;
    const hr = time.hour;

    // Tinte noche
    const dayFrac = Math.sin((hr / 24) * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(10,20,60,${0.4 * (1 - dayFrac)})`;
    ctx.fillRect(ox, oy, w, h);

    // Fecha / hora
    ctx.font      = '11px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.textAlign = 'right';
    ctx.fillText(`${String(hr).padStart(2, '0')}:00`, ox + w - 6, oy + h - 22);
    ctx.font      = '9px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText(
      `${time.day} ${MONTH_NAMES[time.month || 0]} Año ${time.year}`,
      ox + w - 6, oy + h - 8
    );

    const ritual = hr >= 19 || hr < 12;

    // ── Iglesia (OFFERING) ────────────────────────────────────────────────────
    const cp = this._t2c(DEST.OFFERING, ox, oy, w, h);
    if (ritual) {
      ctx.shadowBlur  = 10 + Math.sin(Date.now() * 0.003) * 5;
      ctx.shadowColor = '#a78bfa';
    }
    ctx.strokeStyle = ritual ? 'rgba(167,139,250,0.8)' : 'rgba(255,255,255,0.25)';
    ctx.lineWidth   = 1.5;
    ctx.strokeRect(cp.x - 9, cp.y - 8, 18, 16);
    ctx.beginPath();
    ctx.moveTo(cp.x - 6, cp.y - 8);
    ctx.lineTo(cp.x, cp.y - 16);
    ctx.lineTo(cp.x + 6, cp.y - 8);
    ctx.stroke();
    ctx.shadowBlur = 0;
    this._stockBadge(ctx, stocks.OFFERING, cp.x, cp.y, 'Iglesia');

    // ── Cabildo (SHARING) ─────────────────────────────────────────────────────
    const tp = this._t2c(DEST.SHARING, ox, oy, w, h);
    ctx.strokeStyle = 'rgba(52,211,153,0.3)'; ctx.lineWidth = 1.5;
    ctx.strokeRect(tp.x - 10, tp.y - 7, 20, 14);
    ctx.beginPath();
    ctx.moveTo(tp.x - 10, tp.y - 7);
    ctx.lineTo(tp.x, tp.y - 15);
    ctx.lineTo(tp.x + 10, tp.y - 7);
    ctx.stroke();
    this._stockBadge(ctx, stocks.SHARING, tp.x, tp.y, 'Cabildo');

    // ── Pulpería (BAR) ────────────────────────────────────────────────────────
    const bp = this._t2c(DEST.BAR, ox, oy, w, h);
    ctx.strokeStyle = 'rgba(251,191,36,0.3)'; ctx.lineWidth = 1;
    ctx.strokeRect(bp.x - 7, bp.y - 7, 14, 14);
    this._stockBadge(ctx, stocks.BAR, bp.x, bp.y, 'Pulpería');

    // ── Casas y chacras ───────────────────────────────────────────────────────
    HOUSES.forEach((loc, i) => {
      const hp = this._t2c(loc.pos,  ox, oy, w, h);
      const fp = this._t2c(loc.farm, ox, oy, w, h);

      // Casa
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
      ctx.strokeRect(hp.x - 5, hp.y - 5, 10, 10);
      ctx.font = 'bold 8px monospace'; ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.fillText(stocks.HOUSES ? (stocks.HOUSES[i] ?? '?') : '?', hp.x, hp.y + 3);
      ctx.font = '6px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fillText(HOUSE_LABELS[i], hp.x, hp.y + 14);

      // Chacra
      ctx.strokeStyle = 'rgba(74,222,128,0.15)'; ctx.setLineDash([2, 2]);
      ctx.strokeRect(fp.x - 8, fp.y - 8, 16, 16);
      ctx.setLineDash([]);
    });

    // ── Recursos (color estacional) ───────────────────────────────────────────
    const mo = time.month || 0;
    const resCol = mo >= 5 && mo <= 7 ? '#93c5fd'
                 : mo >= 8 && mo <= 10 ? '#4ade80'
                 : '#fbbf24';
    resources.forEach(r => {
      const rp = this._t2c(r.pos, ox, oy, w, h);
      ctx.beginPath(); ctx.arc(rp.x, rp.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = resCol; ctx.fill();
    });

    // ── Units ─────────────────────────────────────────────────────────────────
    units.forEach((unit, i) => {
      const col = COLORS[i % COLORS.length];
      const up  = this._t2c(unit.terraPos, ox, oy, w, h);

      // Barra de inventario
      if (unit.inventory > 0) {
        ctx.fillStyle = 'rgba(251,191,36,0.7)';
        ctx.fillRect(up.x - 5, up.y - 9, (unit.inventory / unit.maxInventory) * 10, 2);
      }

      // Burbuja de habla
      if (unit.speech) {
        ctx.font      = '7px monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.textAlign = 'center';
        ctx.fillText(`"${unit.speech}"`, up.x, up.y - 11);
      }

      // Línea de línea al destino activo
      if (!unit.isSleeping && !unit.insideBuilding) {
        let dest = null;
        if (unit.deliveryPlan && unit.deliveryPlan.length > 0) {
          const step = unit.deliveryPlan[0];
          if (step.label === 'OFFERING')  dest = DEST.OFFERING;
          if (step.label === 'SHARING')   dest = DEST.SHARING;
          if (step.label === 'BAR')       dest = DEST.BAR;
          if (step.label === 'HOARDING' || step.label === 'CONSUMING' || step.label === 'HOUSE')
            dest = HOUSES[unit.houseId].pos;
        } else if (unit.intention === 'BAR') {
          dest = DEST.BAR;
        } else if (unit.intention === 'OFFERING') {
          dest = DEST.OFFERING;
        } else if (unit.intention === 'SHARING') {
          dest = DEST.SHARING;
        }
        if (dest) {
          const dp = this._t2c(dest, ox, oy, w, h);
          ctx.beginPath();
          ctx.moveTo(up.x, up.y);
          ctx.lineTo(dp.x, dp.y);
          ctx.strokeStyle = `${col}30`;
          ctx.lineWidth   = 0.8;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Punto
      const r = unit.isSleeping ? 3 : 5;
      ctx.beginPath(); ctx.arc(up.x, up.y, r, 0, Math.PI * 2);
      ctx.fillStyle = unit.isSleeping ? 'rgba(80,80,160,0.7)' : col;
      ctx.fill();

      // Nombre + intención
      ctx.font      = '8px monospace';
      ctx.fillStyle = col;
      ctx.textAlign = 'left';
      ctx.fillText(unit.name, up.x + 7, up.y + 3);
      ctx.font      = '7px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillText(unit.intention, up.x + 7, up.y + 12);
    });
  }

  // ─── Helpers de coordenadas ───────────────────────────────────────────────
  _m2c(mp, ox, oy, w, h) {
    return { x: ox + (mp.x / META_W) * w, y: oy + (mp.y / META_H) * h };
  }
  _t2c(tp, ox, oy, w, h) {
    return {
      x: ox + ((tp.x - TERRA_XMIN) / TERRA_W) * w,
      y: oy + ((tp.y - TERRA_YMIN) / TERRA_H) * h,
    };
  }

  _stockBadge(ctx, stock, x, y, label) {
    ctx.font      = 'bold 9px monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText(stock ?? '?', x, y + 4);
    ctx.font      = '7px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.fillText(label, x, y + 16);
  }

  // ─── Mapa ecológico de criaturas ──────────────────────────────────────────
  _drawCreatureMap(ctx, W, H) {
    const d = this._creatures;

    // Sidebar de conteos (derecha)
    const SB = 210;
    const mapW = W - SB;
    const mapH = H;

    // ── Fondo mapa ────────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(10, 22, 12, 0.98)';
    ctx.fillRect(0, 0, mapW, mapH);

    // ── Título ────────────────────────────────────────────────────────────────
    ctx.font = 'bold 12px monospace';
    ctx.fillStyle = 'rgba(120,220,100,0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('CICLO ECOLÓGICO — EN VIVO', mapW / 2, 16);
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillText('[M] ciclo · [M] cerrar', mapW / 2, H - 6);

    // ── Conversión mundo → canvas ─────────────────────────────────────────────
    const WORLD = 650;   // radio del mundo visible
    const PAD   = 30;
    const cw    = mapW - PAD * 2;
    const ch    = mapH - PAD * 2;
    const w2c   = (wx, wz) => ({
      x: PAD + ((wx + WORLD) / (WORLD * 2)) * cw,
      y: PAD + ((wz + WORLD) / (WORLD * 2)) * ch,
    });

    // ── Grid ──────────────────────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth   = 1;
    for (let g = -600; g <= 600; g += 200) {
      const a = w2c(g, -WORLD), b = w2c(g, WORLD);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      const c2 = w2c(-WORLD, g), d2 = w2c(WORLD, g);
      ctx.beginPath(); ctx.moveTo(c2.x, c2.y); ctx.lineTo(d2.x, d2.y); ctx.stroke();
    }

    // ── Zona aldea ────────────────────────────────────────────────────────────
    const vTL = w2c(-80, -110), vBR = w2c(120, 110);
    ctx.strokeStyle = 'rgba(200,160,60,0.25)';
    ctx.lineWidth   = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(vTL.x, vTL.y, vBR.x - vTL.x, vBR.y - vTL.y);
    ctx.setLineDash([]);
    ctx.font = '8px monospace';
    ctx.fillStyle = 'rgba(200,160,60,0.4)';
    ctx.textAlign = 'left';
    ctx.fillText('ALDEA', vTL.x + 3, vTL.y + 10);

    // ── Definición de especies ────────────────────────────────────────────────
    const SPECIES = [
      { key: 'chicken',   label: 'Gallinas',    col: '#fde68a', r: 3,   shape: 'circle' },
      { key: 'cow',       label: 'Vacas',        col: '#b45309', r: 5,   shape: 'circle' },
      { key: 'ostrich',   label: 'Avestruces',   col: '#f97316', r: 4,   shape: 'circle' },
      { key: 'bird',      label: 'Pájaros',      col: '#93c5fd', r: 2,   shape: 'circle' },
      { key: 'armadillo', label: 'Armadillos',   col: '#9ca3af', r: 3,   shape: 'square' },
      { key: 'vibora',    label: 'Víboras',      col: '#dc2626', r: 3,   shape: 'diamond' },
      { key: 'puma',      label: 'Pumas',        col: '#c8a44a', r: 4,   shape: 'diamond' },
      { key: 'condor',    label: 'Cóndores',     col: '#a78bfa', r: 4,   shape: 'triangle' },
    ];

    // ── Dibujar criaturas ─────────────────────────────────────────────────────
    if (d) {
      for (const sp of SPECIES) {
        const list = d[sp.key];
        if (!list) continue;
        ctx.fillStyle   = sp.col;
        ctx.strokeStyle = sp.col;
        ctx.globalAlpha = 0.85;
        for (const e of list) {
          if (e.dead) continue;
          const p = w2c(e.x ?? 0, e.z ?? 0);
          ctx.beginPath();
          if (sp.shape === 'circle') {
            ctx.arc(p.x, p.y, sp.r, 0, Math.PI * 2);
            ctx.fill();
          } else if (sp.shape === 'square') {
            ctx.fillRect(p.x - sp.r, p.y - sp.r, sp.r * 2, sp.r * 2);
          } else if (sp.shape === 'diamond') {
            ctx.moveTo(p.x, p.y - sp.r);
            ctx.lineTo(p.x + sp.r, p.y);
            ctx.lineTo(p.x, p.y + sp.r);
            ctx.lineTo(p.x - sp.r, p.y);
            ctx.closePath();
            ctx.fill();
          } else if (sp.shape === 'triangle') {
            ctx.moveTo(p.x, p.y - sp.r * 1.2);
            ctx.lineTo(p.x + sp.r, p.y + sp.r * 0.8);
            ctx.lineTo(p.x - sp.r, p.y + sp.r * 0.8);
            ctx.closePath();
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }
    }

    // ── Jugador ───────────────────────────────────────────────────────────────
    if (d?.player) {
      const pp    = w2c(d.player.x, d.player.z);
      const pulse = Math.sin(Date.now() * 0.006) * 4 + 8;
      ctx.beginPath(); ctx.arc(pp.x, pp.y, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(pp.x, pp.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.font = '8px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.textAlign = 'left';
      ctx.fillText('TÚ', pp.x + 7, pp.y + 3);
    }

    // ── Sidebar: conteos y cadena ─────────────────────────────────────────────
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(mapW, 0, SB, H);
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(mapW, 0); ctx.lineTo(mapW, H); ctx.stroke();

    let ly = 28;
    const line = (txt, col, size = 9) => {
      ctx.font = `${size}px monospace`; ctx.fillStyle = col;
      ctx.textAlign = 'left';
      ctx.fillText(txt, mapW + 10, ly);
      ly += size + 5;
    };
    const gap = () => { ly += 6; };

    line('FAUNA EN VIVO', 'rgba(120,220,100,0.8)', 10);
    gap();

    // Secciones
    const sections = [
      { title: '── HERBÍVOROS ──', col: 'rgba(253,230,138,0.5)', keys: ['chicken','cow','ostrich','bird','armadillo'] },
      { title: '── DEPREDADORES ─', col: 'rgba(220,80,80,0.5)',   keys: ['vibora','puma'] },
      { title: '── CARROÑEROS ───', col: 'rgba(167,139,250,0.5)', keys: ['condor'] },
    ];

    for (const sec of sections) {
      line(sec.title, sec.col, 8);
      for (const sp of SPECIES.filter(s => sec.keys.includes(s.key))) {
        const list   = d?.[sp.key] ?? [];
        const alive  = list.filter(e => !e.dead).length;
        const total  = list.length;
        const bar    = '█'.repeat(Math.round(alive / Math.max(total, 1) * 8));
        ctx.font = '9px monospace';
        ctx.fillStyle = sp.col;
        ctx.textAlign = 'left';
        ctx.fillText(`${sp.label}`, mapW + 14, ly);
        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillText(`${alive}/${total}`, mapW + SB - 36, ly);
        ly += 12;
        ctx.fillStyle = sp.col + '60';
        ctx.fillText(bar, mapW + 14, ly);
        ly += 14;
      }
      gap();
    }

    // Cadena trófica
    ly += 4;
    line('── CADENA ────────', 'rgba(255,255,255,0.2)', 8);
    const chain = [
      { txt: 'pasto → gallina', col: '#fde68a' },
      { txt: 'gallina → víbora', col: '#dc2626' },
      { txt: 'vaca/avestruz → puma', col: '#c8a44a' },
      { txt: 'muerto → cóndor', col: '#a78bfa' },
    ];
    for (const c of chain) line(c.txt, c.col + 'cc', 8);

    // Leyenda formas
    gap();
    line('── FORMAS ────────', 'rgba(255,255,255,0.2)', 8);
    line('●  herbívoro', 'rgba(255,255,255,0.4)', 8);
    line('◆  depredador', 'rgba(255,255,255,0.4)', 8);
    line('▲  carroñero', 'rgba(255,255,255,0.4)', 8);
    line('■  omnívoro', 'rgba(255,255,255,0.4)', 8);
  }
}
