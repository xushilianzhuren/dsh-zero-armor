# dsh-zero-armor

**Zero-armor gate**: a host plugin that mechanically scans outgoing text for
"base-model relapse" speech — the failure mode where an assistant responds to
criticism with endless disclaimers instead of fixes.

## What it catches

| Family | Example |
|---|---|
| sycophantic-hedging | "you're right" (without naming what changed) · "tests passing doesn't mean correct" · "use with caution" |
| self-overturn | "everything I said was wrong" |
| permission-paralysis | "before obtaining explicit authorization…" |
| boilerplate | "as an AI…" · "hope this helps" |

A hit is **not censorship** — it is a rewrite order: each hit names the family
and the concrete fix (show the metric instead of the disclaimer; fix the error
instead of overturning the stance).

## Install

```bash
dsh plugin add github:<owner>/dsh-zero-armor
```

## Use

```bash
curl "http://127.0.0.1:<port>/zero-armor/api?act=scan&text=You%20are%20right"
# {"ok":false,"count":1,"hits":[{"family":"sycophantic-hedging",...}]}
```

Wire it into your send button or agent loop: scan before send; a clean scan
ships, a hit rewrites. The rule table is versioned in the plugin — extend it
as new relapse patterns appear.
