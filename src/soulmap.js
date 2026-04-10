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
    this._souls   = soulSystem;
    this._visible = false;

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
        this._visible = !this._visible;
        this._canvas.style.display = this._visible ? 'block' : 'none';
      }
    });

    window.addEventListener('resize', () => this._resize());
    this._resize();
  }

  _resize() {
    this._canvas.width  = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }

  draw() {
    if (!this._visible) return;

    const ctx = this._canvas.getContext('2d');
    const W   = this._canvas.width;
    const H   = this._canvas.height;
    const hw  = Math.floor(W / 2);

    ctx.clearRect(0, 0, W, H);

    // ── Fondo ─────────────────────────────────────────────────────────────────
    ctx.fillStyle = 'rgba(4, 4, 10, 0.93)';
    ctx.fillRect(0, 0, W, H);

    // ── Divisor central ───────────────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(hw, 10); ctx.lineTo(hw, H - 10); ctx.stroke();

    // ── Títulos ───────────────────────────────────────────────────────────────
    ctx.font      = 'bold 12px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.textAlign = 'center';
    ctx.fillText('METAPLANO  —  ALMAS', hw / 2, 18);
    ctx.fillText('REALIDAD TERRITORIAL', hw + hw / 2, 18);

    // ── Hint ──────────────────────────────────────────────────────────────────
    ctx.font      = '10px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.textAlign = 'right';
    ctx.fillText('[M] cerrar', W - 8, H - 6);

    const PAD = 28;
    this._drawMeta (ctx,  0,  PAD, hw,     H - PAD * 2);
    this._drawTerra(ctx, hw,  PAD, W - hw, H - PAD * 2);
  }

  // ─── Metaplano ────────────────────────────────────────────────────────────
  _drawMeta(ctx, ox, oy, w, h) {
    const { units, guardianPos, time } = this._souls;
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

    // Guardian
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
}
