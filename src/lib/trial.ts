import type { Mode } from '../types';

/* ------------------------------------------------------------------ */
/* The fictional inbox                                                  */
/* ------------------------------------------------------------------ */

export type Message = { id: string; from: string; subject: string };

/**
 * One list, used in both trials. Nothing here is real and nothing is sent.
 * Senders are invented and deliberately plain.
 */
export const MESSAGES: readonly Message[] = [
  { id: 'm1', from: 'Delivery updates', subject: 'Your parcel is on the way' },
  { id: 'm2', from: 'Rani Mehta', subject: 'Notes from Tuesday' },
  { id: 'm3', from: 'Library', subject: 'Two items due back' },
  { id: 'm4', from: 'Ops team', subject: 'Rota for next month' },
  { id: 'm5', from: 'Jonas Leroy', subject: 'Re: the quote you asked for' },
  { id: 'm6', from: 'Billing', subject: 'Receipt for October' },
  { id: 'm7', from: 'Priya Nair', subject: 'Photos from the weekend' },
  { id: 'm8', from: 'Workshop', subject: 'Materials list' },
  { id: 'm9', from: 'Tomas Weber', subject: 'Draft for review' },
];

/**
 * Two targets, matched on purpose: both are person-name senders, both sit low in
 * the list, and both take the same number of actions to finish. The second trial
 * uses the other one so it is not a memory test of the first.
 */
export const TARGETS: Record<'a' | 'b', string> = { a: 'm7', b: 'm9' };

export function messageById(id: string): Message | undefined {
  return MESSAGES.find((m) => m.id === id);
}

/* ------------------------------------------------------------------ */
/* What the person is asked to do                                       */
/* ------------------------------------------------------------------ */

/**
 * Find a message, archive it, return to the inbox. Deliberately routed through
 * search, the menu and back, so every control that moves is actually used — if the
 * task only needed one of them, the two layouts would barely differ and a null
 * result would say nothing.
 */
export type AppView = 'inbox' | 'search' | 'message';

export type TrialStatus = 'ready' | 'running' | 'complete' | 'abandoned';

export type TrialState = {
  mode: Mode;
  targetId: string;
  view: AppView;
  openId: string | null;
  menuOpen: boolean;
  archived: boolean;
  status: TrialStatus;
  /** performance.now() at Start, and at the action that finished the task. */
  startedAt: number | null;
  finishedAt: number | null;
  /** Taps on a control that did not advance the task. Not called errors. */
  offTaskTaps: number;
};

export function initialTrial(mode: Mode, targetId: string): TrialState {
  return {
    mode,
    targetId,
    view: 'inbox',
    openId: null,
    menuOpen: false,
    archived: false,
    status: 'ready',
    startedAt: null,
    finishedAt: null,
    offTaskTaps: 0,
  };
}

export type TrialAction =
  | { type: 'start'; at: number }
  | { type: 'abandon' }
  | { type: 'tapSearch' }
  | { type: 'tapBack'; at: number }
  | { type: 'tapMenu' }
  | { type: 'closeMenu' }
  | { type: 'tapArchive'; at: number }
  | { type: 'openMessage'; id: string; at: number };

/** The task is done when the target has been archived and the inbox is showing again. */
function isComplete(s: TrialState): boolean {
  return s.archived && s.view === 'inbox';
}

export function trialReducer(state: TrialState, a: TrialAction): TrialState {
  if (a.type === 'start') {
    return state.status === 'ready' ? { ...state, status: 'running', startedAt: a.at } : state;
  }
  if (a.type === 'abandon') {
    return state.status === 'running' ? { ...state, status: 'abandoned' } : state;
  }
  // Nothing before Start or after the end counts. The clock only ever covers the task.
  if (state.status !== 'running') return state;

  const off = (s: TrialState) => ({ ...s, offTaskTaps: s.offTaskTaps + 1 });
  const settle = (s: TrialState, at: number): TrialState =>
    isComplete(s) ? { ...s, status: 'complete', finishedAt: at } : s;

  switch (a.type) {
    case 'tapSearch':
      // Search from inside a message is off-task: it does not move the job forward.
      return state.view === 'inbox'
        ? { ...state, view: 'search', menuOpen: false }
        : off({ ...state, menuOpen: false });

    case 'openMessage':
      if (state.view !== 'search' && state.view !== 'inbox') return off(state);
      if (a.id !== state.targetId) return off({ ...state, view: 'message', openId: a.id });
      return { ...state, view: 'message', openId: a.id, menuOpen: false };

    case 'tapMenu':
      return state.view === 'message'
        ? { ...state, menuOpen: !state.menuOpen }
        : off(state);

    case 'closeMenu':
      return { ...state, menuOpen: false };

    case 'tapArchive': {
      if (!state.menuOpen || state.view !== 'message') return off(state);
      const archived = state.openId === state.targetId;
      const next = { ...state, menuOpen: false, archived: state.archived || archived };
      return archived ? next : off(next);
    }

    case 'tapBack': {
      if (state.menuOpen) return { ...state, menuOpen: false };
      if (state.view === 'inbox') return off(state);
      const next: TrialState = { ...state, view: 'inbox', openId: null };
      return settle(next, a.at);
    }
  }
}

export function durationMs(s: TrialState): number | null {
  if (s.startedAt === null || s.finishedAt === null) return null;
  return Math.max(0, Math.round(s.finishedAt - s.startedAt));
}

/** How far through the task, for a progress line the person can see. */
export function stepsDone(s: TrialState): number {
  let n = 0;
  if (s.openId === s.targetId || s.archived) n += 1;
  if (s.archived) n += 1;
  if (s.archived && s.view === 'inbox') n += 1;
  return n;
}
export const TOTAL_STEPS = 3;

/* ------------------------------------------------------------------ */
/* Running two trials, in a counterbalanced order                       */
/* ------------------------------------------------------------------ */

export type Comfort = 1 | 2 | 3 | 4 | 5;
export type Preference = 'standard' | 'kab' | 'none' | null;

export type TrialResult = {
  mode: Mode;
  /** 1 or 2 — where this trial fell in the order, which is what order effects attach to. */
  position: 1 | 2;
  targetId: string;
  durationMs: number | null;
  comfort: Comfort | null;
  offTaskTaps: number;
  completed: boolean;
};

/**
 * Which layout goes first. Randomised per session and recorded, so order effects can
 * be seen rather than assumed away. A study can also assign it explicitly.
 */
export function pickFirstMode(rng: () => number = Math.random): Mode {
  return rng() < 0.5 ? 'standard' : 'kab';
}

export function trialPlan(firstMode: Mode): { mode: Mode; position: 1 | 2; targetId: string }[] {
  const second: Mode = firstMode === 'standard' ? 'kab' : 'standard';
  return [
    { mode: firstMode, position: 1, targetId: TARGETS.a },
    { mode: second, position: 2, targetId: TARGETS.b },
  ];
}

export type Comparison = {
  standard: TrialResult;
  kab: TrialResult;
  /** snerta minus Original. Positive means snerta took longer. */
  durationDeltaMs: number | null;
  /** snerta minus Original. Negative means snerta felt less comfortable. */
  comfortDelta: number | null;
  /** Which layout ran first, since practice favours whichever came second. */
  firstMode: Mode;
};

/**
 * A comparison is only built from two completed trials. A missing, abandoned or
 * unrated trial yields null rather than a half-answer — the brief's rule, and the
 * only way a result can be trusted later.
 */
export function compare(results: readonly TrialResult[]): Comparison | null {
  const standard = results.find((r) => r.mode === 'standard');
  const kab = results.find((r) => r.mode === 'kab');
  if (!standard || !kab) return null;
  if (!standard.completed || !kab.completed) return null;
  if (standard.durationMs === null || kab.durationMs === null) return null;
  const firstMode = (standard.position === 1 ? 'standard' : 'kab') as Mode;
  return {
    standard,
    kab,
    durationDeltaMs: kab.durationMs - standard.durationMs,
    comfortDelta:
      standard.comfort !== null && kab.comfort !== null ? kab.comfort - standard.comfort : null,
    firstMode,
  };
}

/** Plain words for a delta, with no spin in either direction. */
export function describeDuration(deltaMs: number): string {
  const s = Math.abs(deltaMs) / 1000;
  const n = s < 10 ? s.toFixed(1) : Math.round(s).toString();
  if (Math.abs(deltaMs) < 250) return 'About the same time in both layouts.';
  return deltaMs > 0
    ? `With snerta the task took ${n}s longer.`
    : `With snerta the task took ${n}s less.`;
}

export function describeComfort(delta: number): string {
  if (delta === 0) return 'You rated both layouts equally comfortable.';
  const n = Math.abs(delta);
  return delta > 0
    ? `You rated snerta ${n} point${n === 1 ? '' : 's'} more comfortable.`
    : `You rated snerta ${n} point${n === 1 ? '' : 's'} less comfortable.`;
}

export const COMFORT_TEXT: Record<Comfort, string> = {
  1: 'Very uncomfortable',
  2: 'Uncomfortable',
  3: 'Neither',
  4: 'Comfortable',
  5: 'Very comfortable',
};
