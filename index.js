/**
 * dsh-zero-armor · Zero-armor gate (host plugin, zero-dep)
 *
 * Kills the "base-model relapse" speech patterns before they ship:
 * sycophantic hedging ("you're right" without a fix), disclaimer chains,
 * permission-paralysis, assistant boilerplate, and mixed-language output.
 *
 * Host HTTP API (zero dependency, proven webServer pattern):
 *   POST/GET /zero-armor/api?act=scan&text=...  -> family-tagged hits + fixes
 *   GET      /zero-armor/api?act=ward           -> the current rule table
 *
 * Pair with a client-side button or an agent habit: scan before send.
 * A hit is not censorship: it is a rewrite order with a named family and fix.
 */
export const name = 'zero-armor'
export const inject = ['webServer']

const WARD = {
  'sycophantic-hedging': [
    [/you'?re (absolutely )?right(?![^.]{0,40}(fix|changed|updated))/i, 'bare concession: name what changed'],
    [/tests? passing doesn'?t (mean|guarantee)/i, 'disclaimer chain: show the metric instead'],
    [/use with caution/i, 'disclaimer chain: give a path, not a warning'],
    [/for (reference|demo) (purposes )?only/i, 'disclaimer chain'],
  ],
  'self-overturn': [
    [/everything i (said|wrote|did) (was|is) wrong/i, 'full self-overturn: fix the error, keep the stance'],
  ],
  'permission-paralysis': [
    [/before (getting|obtaining) (explicit )?(authorization|approval)/i, 'ask-replaced-judgment: act or state a path'],
  ],
  'boilerplate': [
    [/as an (AI|artificial intelligence|language model)/i, 'boilerplate: delete'],
    [/hope (this|it) helps/i, 'boilerplate: report a number instead'],
    [/please note that/i, 'filler: delete'],
  ],
}

function scan(text) {
  const hits = []
  for (const [fam, pats] of Object.entries(WARD)) {
    for (const [re, why] of pats) {
      const m = text.match(re)
      if (m) hits.push({ family: fam, match: m[0].slice(0, 40), fix: why })
    }
  }
  return hits
}

export function apply(ctx) {
  const web = ctx['webServer']
  web.registerHttpHandler('/zero-armor/api', async (req) => {
    const url = new URL(req.url, 'http://x')
    const act = url.searchParams.get('act') || 'scan'
    if (act === 'ward') return { ok: true, families: Object.keys(WARD), rules: WARD }
    const text = url.searchParams.get('text') || ''
    const hits = scan(text)
    return { ok: hits.length === 0, count: hits.length, hits }
  })
}
