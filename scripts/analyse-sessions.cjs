#!/usr/bin/env node
/**
 * Reads every session export in a folder and prints what they add up to.
 *
 *   node scripts/analyse-sessions.cjs [folder]        # default: docs/sessions
 *   node scripts/analyse-sessions.cjs --csv > out.csv # one row per trial
 *
 * Deliberately dumb statistics. With five people there is nothing to test, so this
 * counts directions and prints the spread instead of producing a p-value that would
 * only look like evidence. It also refuses to pool sessions whose trials were not
 * balanced, and says which ones it dropped and why.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const csv = args.includes('--csv');
const dir = args.find((a) => !a.startsWith('--')) || 'docs/sessions';

const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .sort();

if (files.length === 0) {
  console.error(`No .json exports in ${dir}`);
  process.exit(1);
}

const sessions = files.map((f) => ({ file: f, data: JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }));

/* ------------------------------------------------------------------ */
/* One row per trial, for anyone who would rather use a spreadsheet    */
/* ------------------------------------------------------------------ */

if (csv) {
  const cols = [
    'file', 'schemaVersion', 'build', 'hand', 'evidence', 'position', 'mode',
    'targetId', 'durationMs', 'comfort', 'offTaskTaps', 'completed',
  ];
  console.log(cols.join(','));
  for (const { file, data } of sessions) {
    for (const t of data.trials ?? []) {
      console.log([
        file, data.schemaVersion, data.build, data.hand, data.evidence,
        t.position, t.mode, t.targetId, t.durationMs ?? '', t.comfort ?? '',
        t.offTaskTaps, t.completed,
      ].join(','));
    }
  }
  process.exit(0);
}

/* ------------------------------------------------------------------ */
/* Per session                                                          */
/* ------------------------------------------------------------------ */

const median = (v) => {
  const s = [...v].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
const s1 = (n) => (n === null || n === undefined ? '—' : `${(n / 1000).toFixed(1)}s`);
const f1 = (n) => (n === null || n === undefined ? '—' : Number(n).toFixed(1));

/** Rebuilt here rather than trusted, so an older export still reads correctly. */
function summarise(trials, mode) {
  const runs = (trials ?? []).filter((t) => t.mode === mode && t.completed);
  const times = runs.map((t) => t.durationMs).filter((v) => typeof v === 'number');
  const comforts = runs.map((t) => t.comfort).filter((v) => typeof v === 'number');
  return {
    n: runs.length,
    durationMs: times.length ? median(times) : null,
    spreadMs: times.length > 1 ? Math.max(...times) - Math.min(...times) : null,
    comfort: comforts.length ? mean(comforts) : null,
    offTask: runs.reduce((a, t) => a + (t.offTaskTaps ?? 0), 0),
    meanPosition: runs.length ? mean(runs.map((t) => t.position)) : null,
  };
}

const usable = [];
const dropped = [];

console.log(`\nsnerta — ${sessions.length} session export${sessions.length === 1 ? '' : 's'} in ${dir}\n`);
console.log('Per session');
console.log('-'.repeat(78));

for (const { file, data } of sessions) {
  const trials = data.trials ?? [];
  const std = summarise(trials, 'standard');
  const kab = summarise(trials, 'kab');
  const attempted = trials.length;
  const completed = trials.filter((t) => t.completed).length;

  console.log(`${file}`);
  console.log(
    `  ${data.build} · ${data.hand ?? 'hand not given'} · ${data.evidence}` +
      `${data.calibrationSkipped ? ' · calibration skipped' : ''} · ${data.sampleCount} taps`,
  );

  if (attempted === 0) {
    console.log('  no timed trials — calibration only\n');
    dropped.push({ file, why: 'no timed trials' });
    continue;
  }

  const balanced =
    std.n > 0 &&
    kab.n > 0 &&
    std.n === kab.n &&
    Math.abs((std.meanPosition ?? 0) - (kab.meanPosition ?? 0)) < 0.001;

  console.log(
    `  Original  ${s1(std.durationMs)}  comfort ${f1(std.comfort)}  off-task ${std.offTask}  ` +
      `n=${std.n}  mean position ${f1(std.meanPosition)}`,
  );
  console.log(
    `  snerta    ${s1(kab.durationMs)}  comfort ${f1(kab.comfort)}  off-task ${kab.offTask}  ` +
      `n=${kab.n}  mean position ${f1(kab.meanPosition)}`,
  );

  if (std.n === 0 || kab.n === 0) {
    console.log('  → no comparison: one layout has no completed run\n');
    dropped.push({ file, why: 'a layout with no completed run' });
    continue;
  }

  const spreads = [std.spreadMs, kab.spreadMs].filter((v) => typeof v === 'number');
  const within = spreads.length ? Math.max(...spreads) : null;
  const dDur = kab.durationMs - std.durationMs;
  const insideNoise = within !== null && Math.abs(dDur) < within;
  const dCom = std.comfort !== null && kab.comfort !== null ? kab.comfort - std.comfort : null;
  console.log(
    `  → snerta ${dDur > 0 ? 'slower' : 'quicker'} by ${s1(Math.abs(dDur))}` +
      (dCom === null ? ', comfort not rated in both' : `, comfort ${dCom > 0 ? '+' : ''}${f1(dCom)}`),
  );

  // First-exposure cost: Original arrives pre-learned, snerta does not. If snerta gains
  // more from its first run to its second, that gap is discovery on top of practice.
  const gain = (m) => {
    const r = (trials ?? []).filter((t) => t.mode === m && t.completed).sort((a, b) => a.position - b.position);
    return r.length === 2 && r.every((t) => typeof t.durationMs === 'number')
      ? r[0].durationMs - r[1].durationMs
      : null;
  };
  const gk = gain('kab');
  const gs = gain('standard');
  if (gk !== null && gs !== null) {
    console.log(
      `  run 1 → run 2:  snerta ${gk >= 0 ? 'gained' : 'lost'} ${s1(Math.abs(gk))},` +
        ` Original ${gs >= 0 ? 'gained' : 'lost'} ${s1(Math.abs(gs))}` +
        (gk > gs ? '  (discovery cost on snerta)' : ''),
    );
  }

  if (insideNoise) {
    console.log(
      `  ⚠ inside this person's own variation: they varied by ${s1(within)} across two runs of` +
        ` the same layout, more than the ${s1(Math.abs(dDur))} between layouts. Direction only.`,
    );
  }

  if (!balanced) {
    console.log(
      `  ⚠ not balanced (${attempted} attempted, ${completed} completed) — practice is still ` +
        'mixed into that difference, so it is not pooled below',
    );
    dropped.push({ file, why: `unbalanced run (${completed}/${attempted} completed)` });
  } else {
    usable.push({ file, dDur, dCom, insideNoise, firstExposure: gk !== null && gs !== null ? gk - gs : null, preference: data.preference ?? null });
  }
  console.log();
}

/* ------------------------------------------------------------------ */
/* Pooled                                                               */
/* ------------------------------------------------------------------ */

console.log('Pooled — balanced sessions only');
console.log('-'.repeat(78));

if (usable.length === 0) {
  console.log('Nothing to pool: no session has both layouts run an equal number of times');
  console.log('at an equal average position.\n');
} else {
  const d = usable.map((u) => u.dDur);
  const quicker = d.filter((v) => v < -250).length;
  const slower = d.filter((v) => v > 250).length;
  const same = d.length - quicker - slower;
  console.log(`n = ${usable.length} ${usable.length === 1 ? 'person' : 'people'}`);
  console.log(`Time with snerta:  quicker ${quicker} · about the same ${same} · slower ${slower}`);
  console.log(`  median change ${s1(median(d))}, range ${s1(Math.min(...d))} to ${s1(Math.max(...d))}`);
  const noisy = usable.filter((u) => u.insideNoise).length;
  if (noisy) {
    console.log(
      `  ${noisy} of ${usable.length} had a layout gap smaller than their own run-to-run spread,`,
    );
    console.log('  so for those the direction is all that can be read, not the size.');
  }

  const c = usable.map((u) => u.dCom).filter((v) => typeof v === 'number');
  if (c.length) {
    const up = c.filter((v) => v > 0).length;
    const down = c.filter((v) => v < 0).length;
    console.log(`Comfort with snerta: better ${up} · level ${c.length - up - down} · worse ${down}`);
    console.log(`  median change ${f1(median(c))} points (rated by ${c.length} of ${usable.length})`);
  } else {
    console.log('Comfort: not rated in both layouts by anyone, so nothing to report');
  }

  const fe = usable.map((u) => u.firstExposure).filter((v) => typeof v === 'number');
  if (fe.length) {
    const worse = fe.filter((v) => v > 0).length;
    console.log(
      `First-exposure: snerta improved more from its 1st run to its 2nd in ${worse} of ${fe.length},` +
        ` median ${s1(median(fe))}`,
    );
    console.log('  Original arrives pre-learned; that gap is discovery cost sitting on snerta.');
  }

  const prefs = usable.map((u) => u.preference);
  const count = (v) => prefs.filter((x) => x === v).length;
  console.log(
    `Stated preference: snerta ${count('kab')} · Original ${count('standard')} · ` +
      `none ${count('none')} · not answered ${count(null)}`,
  );
  console.log();
}

if (dropped.length) {
  console.log('Left out of the pool');
  console.log('-'.repeat(78));
  for (const d of dropped) console.log(`${d.file} — ${d.why}`);
  console.log();
}

console.log('What this cannot tell you');
console.log('-'.repeat(78));
console.log(`• ${sessions.length} session${sessions.length === 1 ? '' : 's'} is a direction, not a result. No test here`);
console.log('  would have the power to find a one-second effect, so none is run.');
console.log('• A session run by whoever built snerta is not independent evidence, however');
console.log('  carefully it was recorded. Check how many of the files above are the founder.');
console.log('• Four trials per person spread practice evenly between the layouts. They do');
console.log('  not remove it, and they do nothing about expecting snerta to win.');
console.log('• Four runs cannot resolve a one-second effect in one person: so far the');
console.log('  spread within a single layout has been larger than the gap between them.');
console.log('• Browser-reported touch is not proof a thumb was used; time is not comfort.');
console.log();
