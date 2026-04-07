// --- Survival stats (local only, not synced) ---

let _hunger = 100;
let _thirst  = 100;

const HUNGER_RATE = 100 / (15 * 60);  // full depletion in 15 real minutes
const THIRST_RATE = 100 / (10 * 60);  // full depletion in 10 real minutes
const SPRINT_MULT = 2.2;
const MOUNT_MULT  = 1.4;  // slower drain on horseback (you're not walking)

export function updateSurvival(dt, isSprinting, isMounted) {
  let mult = 1.0;
  if (isMounted) mult = MOUNT_MULT;
  if (isSprinting) mult = SPRINT_MULT;
  _hunger = Math.max(0, _hunger - HUNGER_RATE * mult * dt);
  _thirst = Math.max(0, _thirst - THIRST_RATE * mult * dt);
}

export function getHunger() { return Math.round(_hunger); }
export function getThirst()  { return Math.round(_thirst); }
