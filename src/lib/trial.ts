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
 * Four targets, one per trial, matched on purpose: all person-name senders, all
 * reached the same way, all taking the same three actions. A trial never reuses an
 * earlier target, so no run is a memory test of a previous one.
 */
export const TARGETS: readonly string[] = ['m2', 'm5', 'm7', 'm9'];

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

export type TrialPosition = 1 | 2 | 3 | 4;

export type TrialResult = {
  mode: Mode;
  /** Where this trial fell in the order, which is what order effects attach to. */
  position: TrialPosition;
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

/**
 * ABBA, so practice cancels inside one person instead of needing five of them.
 *
 * The first complete run showed why: Original ran first, snerta second, snerta came
 * out 43% quicker — which is also exactly what a second attempt at any task looks
 * like. In one session "second" and "snerta" were the same column of data.
 *
 * Here each layout takes positions that average to 2.5, so whatever practice is
 * worth, both layouts get the same share of it.
 */
export function trialPlan(firstMode: Mode): { mode: Mode; position: TrialPosition; targetId: string }[] {
  const other: Mode = firstMode === 'standard' ? 'kab' : 'standard';
  const order: Mode[] = [firstMode, other, other, firstMode];
  return order.map((mode, i) => ({
    mode,
    position: (i + 1) as TrialPosition,
    targetId: TARGETS[i],
  }));
}

/** Everything recorded for one layout across its runs. */
export type ModeSummary = {
  mode: Mode;
  /** Completed runs only. */
  runs: TrialResult[];
  /** Median of the completed durations. */
  durationMs: number | null;
  /** Mean of the ratings that were given. */
  comfort: number | null;
  offTaskTaps: number;
  /** Mean position in the order. Equal across layouts is what balance means. */
  meanPosition: number | null;
};

function summarise(mode: Mode, results: readonly TrialResult[]): ModeSummary {
  const runs = results.filter((r) => r.mode === mode && r.completed);
  const times = runs.map((r) => r.durationMs).filter((v): v is number => v !== null);
  const comforts: number[] = runs.map((r) => r.comfort).filter((v): v is Comfort => v !== null);
  return {
    mode,
    runs,
    durationMs: times.length ? median(times) : null,
    comfort: comforts.length ? comforts.reduce((a, b) => a + b, 0) / comforts.length : null,
    offTaskTaps: runs.reduce((n, r) => n + r.offTaskTaps, 0),
    meanPosition: runs.length ? runs.reduce((n, r) => n + r.position, 0) / runs.length : null,
  };
}

function median(v: number[]): number {
  const s = [...v].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

export type Comparison = {
  standard: ModeSummary;
  kab: ModeSummary;
  /** snerta minus Original. Positive means snerta took longer. */
  durationDeltaMs: number | null;
  /** snerta minus Original. Negative means snerta felt less comfortable. */
  comfortDelta: number | null;
  /** Which layout ran first. */
  firstMode: Mode;
  /**
   * True only when both layouts ran the same number of times at the same average
   * position. When false, practice is still mixed into the difference and the
   * comparison has to say so rather than quietly reporting a number.
   */
  balanced: boolean;
  completedCount: number;
};

/**
 * Built only from completed trials, and never from a layout with none. An
 * unbalanced set still produces a comparison, flagged as such, because hiding it
 * would be worse than showing it with the caveat attached.
 */
export function compare(results: readonly TrialResult[]): Comparison | null {
  const standard = summarise('standard', results);
  const kab = summarise('kab', results);
  if (standard.runs.length === 0 || kab.runs.length === 0) return null;
  if (standard.durationMs === null || kab.durationMs === null) return null;
  const first = [...results].sort((a, b) => a.position - b.position)[0];
  return {
    standard,
    kab,
    durationDeltaMs: kab.durationMs - standard.durationMs,
    comfortDelta:
      standard.comfort !== null && kab.comfort !== null
        ? Math.round((kab.comfort - standard.comfort) * 10) / 10
        : null,
    firstMode: first.mode,
    balanced:
      standard.runs.length === kab.runs.length &&
      standard.meanPosition !== null &&
      kab.meanPosition !== null &&
      Math.abs(standard.meanPosition - kab.meanPosition) < 0.001,
    completedCount: standard.runs.length + kab.runs.length,
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
  if (Math.abs(delta) < 0.05) return 'You rated both layouts equally comfortable.';
  const n = Math.abs(delta) % 1 === 0 ? Math.abs(delta).toString() : Math.abs(delta).toFixed(1);
  const unit = Math.abs(delta) === 1 ? 'point' : 'points';
  return delta > 0
    ? `You rated snerta ${n} ${unit} more comfortable.`
    : `You rated snerta ${n} ${unit} less comfortable.`;
}

export const COMFORT_TEXT: Record<Comfort, string> = {
  1: 'Very uncomfortable',
  2: 'Uncomfortable',
  3: 'Neither',
  4: 'Comfortable',
  5: 'Very comfortable',
};
