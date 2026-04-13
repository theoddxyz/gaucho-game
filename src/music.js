/**
 * src/music.js — MIDI background music player
 * Usa @tonejs/midi para parsear y Web Audio API para sintetizar.
 * Sintetiza GM instruments con osciladores y envolventes ADSR.
 */
import { Midi } from '@tonejs/midi';

const TRACKS = [
  '/music/horse_no_name.mid',
  '/music/spanish_caravan.mid',
  '/music/riders_on_storm.mid',
];

// ── MIDI note → frecuencia Hz ─────────────────────────────────────────────────
function _freq(n) { return 440 * Math.pow(2, (n - 69) / 12); }

// ── Clasificar instrumento GM por programa ────────────────────────────────────
function _gmType(prog) {
  if (prog < 8)  return 'piano';
  if (prog < 16) return 'mallet';
  if (prog < 24) return 'organ';
  if (prog < 32) return 'guitar';
  if (prog < 40) return 'bass';
  if (prog < 48) return 'strings';
  if (prog < 56) return 'ensemble';
  if (prog < 64) return 'brass';
  if (prog < 80) return 'reed';
  return 'pad';
}

// ── ADSR + timbre por familia GM ──────────────────────────────────────────────
const SYNTH = {
  piano:    { a: 0.004, d: 0.12, s: 0.25, r: 0.55, type: 'triangle', gain: 0.26, lp: 4800 },
  mallet:   { a: 0.002, d: 0.09, s: 0.15, r: 0.40, type: 'sine',     gain: 0.22, lp: 6000 },
  organ:    { a: 0.015, d: 0.0,  s: 1.0,  r: 0.08, type: 'sawtooth', gain: 0.14, lp: 1800 },
  guitar:   { a: 0.001, d: 0.08, s: 0.08, r: 0.90, type: 'triangle', gain: 0.28, lp: 5500 },
  bass:     { a: 0.004, d: 0.07, s: 0.55, r: 0.28, type: 'sine',     gain: 0.38, lp: 800  },
  strings:  { a: 0.14,  d: 0.0,  s: 0.90, r: 0.50, type: 'sawtooth', gain: 0.16, lp: 1400 },
  ensemble: { a: 0.10,  d: 0.0,  s: 0.85, r: 0.45, type: 'sawtooth', gain: 0.16, lp: 1600 },
  brass:    { a: 0.045, d: 0.04, s: 0.75, r: 0.22, type: 'sawtooth', gain: 0.18, lp: 2200 },
  reed:     { a: 0.030, d: 0.03, s: 0.80, r: 0.22, type: 'sawtooth', gain: 0.18, lp: 2800 },
  pad:      { a: 0.20,  d: 0.0,  s: 1.0,  r: 0.70, type: 'sine',     gain: 0.12, lp: 1200 },
};

// ── Percusión: notas GM estándar ──────────────────────────────────────────────
const DRUM_MAP = {
  35: { type: 'kick'  }, 36: { type: 'kick'  },
  38: { type: 'snare' }, 40: { type: 'snare' },
  37: { type: 'snare' },
  42: { type: 'hihat_c' }, 44: { type: 'hihat_c' },
  46: { type: 'hihat_o' },
  49: { type: 'crash' }, 51: { type: 'ride' }, 57: { type: 'crash' },
  48: { type: 'tom' }, 45: { type: 'tom' }, 43: { type: 'tom' }, 41: { type: 'tom' },
};

// ─────────────────────────────────────────────────────────────────────────────
export class MusicPlayer {
  constructor(audioCtx, masterOut) {
    this._ctx   = audioCtx;
    this._gain  = audioCtx.createGain();
    this._gain.gain.value = 0.48;
    this._gain.connect(masterOut);

    this._playing   = false;
    this._notes     = [];
    this._startTime = 0;
    this._schedIdx  = 0;
    this._timer     = null;
    this._endTime   = 0;
    this._cache     = new Map();   // url → Midi
    this._noiseCache = null;       // reutilizar el buffer de ruido blanco
  }

  // ── API pública ─────────────────────────────────────────────────────────────
  async start() {
    if (this._playing) this.stop(false);
    const url  = TRACKS[Math.floor(Math.random() * TRACKS.length)];
    const midi = await this._loadMidi(url);
    if (!midi) return;

    this._notes = this._flattenNotes(midi);
    if (!this._notes.length) return;

    this._endTime   = this._notes.at(-1).time + 5;
    this._startTime = this._ctx.currentTime + 0.15;
    this._schedIdx  = 0;
    this._playing   = true;
    this._tick();
  }

  fadeIn(dur = 2.5) {
    const t = this._ctx.currentTime;
    this._gain.gain.cancelScheduledValues(t);
    this._gain.gain.setValueAtTime(0.0001, t);
    this._gain.gain.linearRampToValueAtTime(0.48, t + dur);
  }

  stop(fade = true) {
    this._playing = false;
    if (this._timer) { clearTimeout(this._timer); this._timer = null; }
    if (fade) {
      const t = this._ctx.currentTime;
      this._gain.gain.cancelScheduledValues(t);
      this._gain.gain.linearRampToValueAtTime(0.0001, t + 1.8);
    }
  }

  setVolume(v) { this._gain.gain.value = Math.max(0, Math.min(1, v)); }

  // ── Parseo MIDI → lista plana de notas ──────────────────────────────────────
  _flattenNotes(midi) {
    const list = [];
    for (const track of midi.tracks) {
      const isDrum = track.instrument?.percussion ?? false;
      const prog   = track.instrument?.number ?? 0;
      const type   = isDrum ? 'drum' : _gmType(prog);
      const syn    = SYNTH[type] ?? SYNTH.piano;

      for (const note of track.notes) {
        if (note.midi < 0 || note.midi > 127) continue;
        list.push({
          time: note.time,
          dur:  Math.max(0.04, Math.min(note.duration, 4.0)),
          midi: note.midi,
          vel:  note.velocity,  // 0-1
          type,
          syn: isDrum ? null : syn,
          drum: isDrum ? (DRUM_MAP[note.midi] ?? null) : null,
        });
      }
    }
    list.sort((a, b) => a.time - b.time);
    return list;
  }

  // ── Scheduler: lookahead de 1.2s ────────────────────────────────────────────
  _tick() {
    if (!this._playing) return;
    const now     = this._ctx.currentTime;
    const songPos = now - this._startTime;
    const ahead   = 1.2;

    while (this._schedIdx < this._notes.length) {
      const n = this._notes[this._schedIdx];
      if (n.time > songPos + ahead) break;
      const noteStart = this._startTime + n.time;
      if (noteStart > now - 0.05) {
        n.drum ? this._playDrum(n.drum, n.vel, noteStart)
               : this._playNote(n, noteStart);
      }
      this._schedIdx++;
    }

    if (songPos >= this._endTime) {
      // Termina la canción: elegir otra
      this._timer = setTimeout(() => this.start(), 800);
      return;
    }

    this._timer = setTimeout(() => this._tick(), 100);
  }

  // ── Sintetizar una nota melódica ─────────────────────────────────────────────
  _playNote(n, t) {
    const c   = this._ctx;
    const syn = n.syn;
    const f   = _freq(n.midi);
    const dur = n.dur;

    // Oscilador principal
    const osc = c.createOscillator();
    osc.type  = syn.type;
    osc.frequency.value = f;

    const lp  = c.createBiquadFilter();
    lp.type   = 'lowpass';
    lp.frequency.value = syn.lp;

    const g   = c.createGain();
    const pk  = syn.gain * n.vel;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(pk,         t + syn.a);
    g.gain.linearRampToValueAtTime(pk * syn.s, t + syn.a + syn.d + 0.001);
    const noteOff = t + dur;
    g.gain.setValueAtTime(pk * syn.s, noteOff);
    g.gain.linearRampToValueAtTime(0.0001,     noteOff + syn.r);

    osc.connect(lp); lp.connect(g); g.connect(this._gain);
    osc.start(t); osc.stop(noteOff + syn.r + 0.06);

    // Armónico extra para guitar (simula pluck)
    if (n.type === 'guitar') {
      const harm = c.createOscillator();
      harm.type  = 'sine';
      harm.frequency.value = f * 2;
      const gh = c.createGain();
      gh.gain.setValueAtTime(0.0001, t);
      gh.gain.linearRampToValueAtTime(pk * 0.18, t + 0.001);
      gh.gain.exponentialRampToValueAtTime(0.0001, t + Math.min(dur * 0.45, 0.35));
      harm.connect(gh); gh.connect(this._gain);
      harm.start(t); harm.stop(t + Math.min(dur * 0.5, 0.4));
    }

    // Segundo oscilador ligeramente desafinado para strings / pad (chorus)
    if (n.type === 'strings' || n.type === 'ensemble' || n.type === 'pad') {
      const osc2 = c.createOscillator();
      osc2.type  = syn.type;
      osc2.frequency.value = f;
      osc2.detune.value = 7 + (Math.random() - 0.5) * 3;
      const lp2 = c.createBiquadFilter(); lp2.type='lowpass'; lp2.frequency.value = syn.lp;
      const g2  = c.createGain();
      g2.gain.setValueAtTime(0.0001, t);
      g2.gain.linearRampToValueAtTime(pk * 0.45, t + syn.a);
      g2.gain.linearRampToValueAtTime(pk * syn.s * 0.45, t + syn.a + syn.d + 0.001);
      g2.gain.setValueAtTime(pk * syn.s * 0.45, noteOff);
      g2.gain.linearRampToValueAtTime(0.0001, noteOff + syn.r);
      osc2.connect(lp2); lp2.connect(g2); g2.connect(this._gain);
      osc2.start(t); osc2.stop(noteOff + syn.r + 0.06);
    }
  }

  // ── Sintetizar percusión ──────────────────────────────────────────────────────
  _playDrum(drum, vel, t) {
    const c = this._ctx;
    const v = vel * 0.55;

    if (drum.type === 'kick') {
      const o = c.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(75, t); o.frequency.exponentialRampToValueAtTime(30, t + 0.12);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.75, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 200;
      o.connect(lp); lp.connect(g); g.connect(this._gain);
      o.start(t); o.stop(t + 0.20);

    } else if (drum.type === 'snare') {
      // Ruido
      const nb = this._getNoiseBuf(0.20);
      if (nb) {
        const src = c.createBufferSource(); src.buffer = nb;
        const bp  = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800; bp.Q.value = 0.8;
        const g   = c.createGain();
        g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.45, t + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        src.connect(bp); bp.connect(g); g.connect(this._gain); src.start(t);
      }
      // Body tonal
      const o = c.createOscillator(); o.type='triangle'; o.frequency.value = 185;
      const go = c.createGain();
      go.gain.setValueAtTime(0.0001,t); go.gain.linearRampToValueAtTime(v*0.20,t+0.002);
      go.gain.exponentialRampToValueAtTime(0.0001,t+0.06);
      o.connect(go); go.connect(this._gain); o.start(t); o.stop(t+0.07);

    } else if (drum.type === 'hihat_c' || drum.type === 'hihat_o') {
      const dur = drum.type === 'hihat_o' ? 0.28 : 0.055;
      const nb  = this._getNoiseBuf(dur);
      if (nb) {
        const src = c.createBufferSource(); src.buffer = nb;
        const hp  = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 9000;
        const g   = c.createGain();
        g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*0.20,t+0.001);
        g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
        src.connect(hp); hp.connect(g); g.connect(this._gain); src.start(t);
      }

    } else if (drum.type === 'crash' || drum.type === 'ride') {
      const dur = drum.type === 'crash' ? 0.9 : 0.45;
      const nb  = this._getNoiseBuf(Math.min(dur, 0.6));
      if (nb) {
        const src = c.createBufferSource(); src.buffer = nb;
        const hp  = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5500;
        const g   = c.createGain();
        g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*0.22,t+0.002);
        g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
        src.connect(hp); hp.connect(g); g.connect(this._gain); src.start(t);
      }

    } else if (drum.type === 'tom') {
      const o = c.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(140,t); o.frequency.exponentialRampToValueAtTime(55,t+0.12);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001,t); g.gain.linearRampToValueAtTime(v*0.38,t+0.003);
      g.gain.exponentialRampToValueAtTime(0.0001,t+0.16);
      o.connect(g); g.connect(this._gain); o.start(t); o.stop(t+0.18);
    }
  }

  // Buffer de ruido blanco reutilizable ─────────────────────────────────────────
  _getNoiseBuf(maxDur) {
    const c = this._ctx;
    const len = Math.floor(c.sampleRate * Math.min(maxDur, 1.0));
    if (this._noiseCache && this._noiseCache.length >= len) return this._noiseCache;
    const buf = c.createBuffer(1, Math.floor(c.sampleRate * 1.0), c.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this._noiseCache = buf;
    return buf;
  }

  // ── Cargar y cachear MIDI ─────────────────────────────────────────────────────
  async _loadMidi(url) {
    if (this._cache.has(url)) return this._cache.get(url);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.status);
      const ab  = await res.arrayBuffer();
      const mid = new Midi(ab);
      this._cache.set(url, mid);
      console.log(`[MUSIC] Loaded ${url} — ${mid.tracks.length} tracks, ${mid.duration.toFixed(1)}s`);
      return mid;
    } catch (e) {
      console.warn('[MUSIC] Failed to load', url, e.message);
      return null;
    }
  }
}
