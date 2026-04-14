// --- Menú radial de armas ---
export class RadialMenu {
  constructor() {
    this._visible  = false;
    this._selected = 0;
    this._weapons  = [
      { id: 'shotgun',  label: 'ESCOPETA', icon: '🔫' },
      { id: 'lasso',    label: 'LAZO',     icon: '🪢' },
      { id: 'food',     label: 'COMIDA',   icon: '🥩' },
      { id: 'montura',  label: 'MONTURA',  icon: '🏇' },
    ];
    this._mouseX = 0;
    this._mouseY = 0;
    this._el     = null;
    this._canvas = null;
    this._labelEl = null;
    this._build();

    document.addEventListener('mousemove', (e) => {
      this._mouseX = e.clientX;
      this._mouseY = e.clientY;
      if (this._visible) { this._updateSelection(); this._draw(); }
    });
  }

  _build() {
    this._el = document.createElement('div');
    this._el.id = 'radial-menu';
    this._el.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;pointer-events:none;';

    this._canvas = document.createElement('canvas');
    this._canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    this._el.appendChild(this._canvas);

    this._labelEl = document.createElement('div');
    this._labelEl.style.cssText = [
      'position:absolute', 'left:50%', 'top:calc(50% + 140px)',
      'transform:translateX(-50%)',
      'color:#f0c040', 'font:bold 22px sans-serif',
      'text-shadow:0 2px 8px #000', 'letter-spacing:3px',
      'text-align:center', 'pointer-events:none',
    ].join(';');
    this._el.appendChild(this._labelEl);

    // Weapon indicator (bottom-left HUD)
    this._hudEl = document.createElement('div');
    this._hudEl.id = 'weapon-hud';
    this._hudEl.style.cssText = [
      'position:fixed', 'bottom:18px', 'left:120px',
      'z-index:100',
      'color:#fff', 'font:bold 16px sans-serif',
      'text-shadow:0 0 6px #000', 'background:rgba(0,0,0,0.45)',
      'padding:6px 14px', 'border-radius:8px',
      'border:1px solid rgba(255,255,255,0.2)',
      'letter-spacing:1px',
    ].join(';');
    this._hudEl.textContent = '🔫 ESCOPETA';

    document.body.appendChild(this._el);
    document.body.appendChild(this._hudEl);
  }

  show(currentWeaponId) {
    this._visible  = true;
    this._el.style.display = 'block';
    this._selected = this._weapons.findIndex(w => w.id === currentWeaponId);
    if (this._selected < 0) this._selected = 0;
    this._draw();
  }

  hide() {
    this._visible = false;
    this._el.style.display = 'none';
  }

  getSelected() { return this._weapons[this._selected]?.id ?? 'shotgun'; }

  setHUD(weaponId) {
    const w = this._weapons.find(w => w.id === weaponId);
    if (w && this._hudEl) this._hudEl.textContent = `${w.icon} ${w.label}`;
  }

  _updateSelection() {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = this._mouseX - cx;
    const dy = this._mouseY - cy;
    if (Math.sqrt(dx * dx + dy * dy) < 45) return; // dead-zone
    let angle = Math.atan2(dy, dx);
    angle = (angle + Math.PI * 2) % (Math.PI * 2);
    const n = this._weapons.length;
    // offset so first item is at top
    let a = angle + Math.PI / 2;
    a = (a + Math.PI * 2) % (Math.PI * 2);
    this._selected = Math.floor(a / (Math.PI * 2 / n)) % n;
  }

  _draw() {
    const canvas = this._canvas;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark overlay
    ctx.fillStyle = 'rgba(0,0,0,0.50)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width  / 2;
    const cy = canvas.height / 2;
    const R_OUT = 130;
    const R_IN  = 46;
    const n = this._weapons.length;
    const GAP = 0.04;  // gap between slices in radians

    for (let i = 0; i < n; i++) {
      const midAngle   = -Math.PI / 2 + (i + 0.5) / n * Math.PI * 2;
      const startAngle = -Math.PI / 2 + i / n * Math.PI * 2 + GAP;
      const endAngle   = -Math.PI / 2 + (i + 1) / n * Math.PI * 2 - GAP;
      const sel = i === this._selected;

      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(startAngle) * R_IN, cy + Math.sin(startAngle) * R_IN);
      ctx.arc(cx, cy, R_OUT, startAngle, endAngle);
      ctx.arc(cx, cy, R_IN,  endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle   = sel ? 'rgba(200,160,50,0.88)' : 'rgba(35,25,15,0.80)';
      ctx.fill();
      ctx.strokeStyle = sel ? '#f0c040' : '#7a5a28';
      ctx.lineWidth   = sel ? 3 : 1.5;
      ctx.stroke();

      // Icon + label
      const ir = (R_IN + R_OUT) / 2;
      const ix = cx + Math.cos(midAngle) * ir;
      const iy = cy + Math.sin(midAngle) * ir;
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.font         = sel ? 'bold 28px sans-serif' : '22px sans-serif';
      ctx.fillStyle    = sel ? '#fff' : '#bbb';
      ctx.fillText(this._weapons[i].icon, ix, iy - 12);
      ctx.font         = sel ? 'bold 13px sans-serif' : '11px sans-serif';
      ctx.fillText(this._weapons[i].label, ix, iy + 14);
    }

    // Inner circle
    ctx.beginPath();
    ctx.arc(cx, cy, R_IN, 0, Math.PI * 2);
    ctx.fillStyle   = 'rgba(15,10,5,0.92)';
    ctx.fill();
    ctx.strokeStyle = '#7a5a28';
    ctx.lineWidth   = 2;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#f0c040';
    ctx.fill();

    this._labelEl.textContent = this._weapons[this._selected]?.label ?? '';
  }
}
