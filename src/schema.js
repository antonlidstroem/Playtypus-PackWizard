// ── Pack schema — speglar Playtypus pack.config.json ─────────────────────────

export const EMPTY_PACK = {
  packId: '',
  appName: '',
  tagline: '',
  emoji: '',
  defaultLanguage: 'sv',
  accentColor: '#E8845A',
  startView: 'grid',
  themeFile: 'theme.css',
  themeDarkFile: 'theme-dark.css',
  typography: 'rounded',
  panicButton: {
    enabled: false,
    label: '',
    emoji: '🎲',
    // filter criteria (all optional):
    maxPrepMinutes:    null,   // null = no filter
    requireNoProps:    false,
    maxDurationSeconds: null,  // null = no filter
    maxLevel:          null,   // null = no filter
  },
  features: {
    favorites:        true,
    favoritesShelf:   false,
    doneTracking:     true,
    logbook:          false,
    streakTracking:   null,
    badges:           false,
    recentHistory:    true,
    shareActivity:    false,
    textToSpeech:     false,
    audioPlayer:      false,
    haptics:          true,
    printView:        false,
    levelBadges:      false,
    guidedMode:       false,
    export:           null,
    // v6
    defaultLayoutMode:  'grid',   // 'grid' | 'list'
    layoutUserToggle:   true,
    allowUserContent:   false,
    activityNotes:      false,
    cardActions:        false,
    dataSync:           'none',   // 'none' | 'export-only'
    reminders:          null,     // null | { enabled, time, frequency }
    slideshow:          false,
    progressionLock:    false,
    fontSizeScale:      false,
  },
  viewConfig: {
    default: 'grid',
    overrides: {},
  },
  readyNow: null,
  categories: [],          // [{ id, label, emoji }]
  situationPresets: [],
  filters: [],
  onboarding: { enabled: false, steps: [] },
  tutorial: { enabled: false, steps: [] },
};

export const TYPOGRAPHY_OPTIONS = [
  { value: 'rounded',    label: 'Rounded',      preview: 'Nunito',                    desc: 'Mjuk och vänlig — passar familjeappar och barninnehåll.' },
  { value: 'classic',    label: 'Classic',      preview: 'Lora / Source Serif 4',     desc: 'Seriös och läsbar — passar guider och utbildning.' },
  { value: 'playful',    label: 'Playful',      preview: 'Fredoka / Nunito',          desc: 'Lekfull och energisk — passar träning och spel.' },
  { value: 'editorial',  label: 'Editorial',    preview: 'Playfair Display / Lato',   desc: 'Elegant och tidlös — passar recept och livsstil.' },
  { value: 'modern',     label: 'Modern',       preview: 'DM Sans',                   desc: 'Ren och teknisk — passar produktivitet och verktyg.' },
  { value: 'bold',       label: 'Bold',         preview: 'Montserrat / Open Sans',    desc: 'Kraftfull och modern — passar sport och motivation.' },
  { value: 'accessible', label: 'Tillgänglig',  preview: 'Atkinson Hyperlegible',     desc: 'Hög läsbarhet — passar äldre, syn-nedsättning och skola.' },
];

export const LANGUAGE_OPTIONS = [
  { value: 'sv', label: 'Svenska 🇸🇪',  flag: '🇸🇪' },
  { value: 'en', label: 'English 🇬🇧',   flag: '🇬🇧' },
  { value: 'no', label: 'Norsk 🇳🇴',     flag: '🇳🇴' },
  { value: 'da', label: 'Dansk 🇩🇰',     flag: '🇩🇰' },
  { value: 'fi', label: 'Suomi 🇫🇮',     flag: '🇫🇮' },
  { value: 'de', label: 'Deutsch 🇩🇪',   flag: '🇩🇪' },
];

export const VIEW_OPTIONS = [
  { value: 'grid',   label: 'Grid',       icon: '⊞', desc: 'Visuell grid med kort. Passar aktiviteter, recept och utmaningar.' },
  { value: 'list',   label: 'Lista',      icon: '☰', desc: 'Kompakt radlista. Passar guider, steg och långa samlingar.' },
  { value: 'single', label: 'En i taget', icon: '▭', desc: 'Fokuserat helskärmsläge. Passar meditation, steg-för-steg och fokusövningar.' },
];

export const ACCENT_PRESETS = [
  '#E8845A', '#5A9BE8', '#8A5AE8', '#E85A8A',
  '#5AE8A0', '#E8C85A', '#5AE8E8', '#E8705A',
  '#3B7A57', '#C0392B', '#1A535C', '#F7B731',
];

export const EMPTY_ACTIVITY = {
  id: '',
  title: '',
  description: '',
  emoji: '',
  category: '',
  durationSeconds: 600,
  prepTimeMinutes: 0,
  level: 1,
  requiresProps: false,
  props: [],
  steps: [],
  tags: [],
  contentBlocks: [],
  // NOTE: cardFeatures and preferredView are not Playtypus Activity model fields.
  filterValues: {},
  contentVersion: 1,
  // v5+
  repeat: null,          // 'weekly' | 'monthly' | 'never' | null
  // v6
  showAfter: null,       // 'YYYY-MM-DD' | null
  showBefore: null,      // 'YYYY-MM-DD' | null
  nextActivity: null,    // id of next activity in a series | null
};

export const LEVEL_OPTIONS = [
  { value: 1, label: 'Enkel',  color: 'var(--green)',  desc: 'Passar alla, ingen förberedelse krävs.' },
  { value: 2, label: 'Medel',  color: 'var(--accent)', desc: 'Kräver lite ansträngning eller planering.' },
  { value: 3, label: 'Svår',   color: 'var(--red)',    desc: 'Utmanande, kräver förberedelse eller erfarenhet.' },
];

// ── Hjälpfunktion: sekunder → läsbar sträng ───────────────────────────────────
export function formatDuration(seconds) {
  if (!seconds) return '';
  if (seconds < 60)   return `${seconds} sek`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} min`;
  return `${Math.round(seconds / 3600)} h`;
}

// ── Hjälpfunktion: "10 min"-sträng → sekunder ────────────────────────────────
export function parseDurationToSeconds(str) {
  if (typeof str === 'number') return str;
  if (!str) return 600;
  const s = String(str).toLowerCase().trim();
  const hMatch = s.match(/(\d+)\s*h/);
  const mMatch = s.match(/(\d+)\s*(min|m)/);
  const sMatch = s.match(/(\d+)\s*(sek|s)/);
  let total = 0;
  if (hMatch) total += parseInt(hMatch[1]) * 3600;
  if (mMatch) total += parseInt(mMatch[1]) * 60;
  if (sMatch) total += parseInt(sMatch[1]);
  return total || 600;
}

// ── Strategi-prompt (fas 1 av AI-flödet) ────────────────────────────────────
export function buildStrategyPrompt(wizardState) {
  const { packMeta, features } = wizardState;
  const lines = [
    `Du är expert på att designa engagerande aktivitetsappar för mobil.`,
    ``,
    `Jag håller på att bygga ett Playtypus-pack och behöver din hjälp att ta fram en strategi INNAN vi genererar några filer.`,
    ``,
    `## Det jag vet om appen:`,
  ];

  if (packMeta.appName)       lines.push(`- Appnamn: ${packMeta.appName}`);
  if (packMeta.tagline)       lines.push(`- Tagline: ${packMeta.tagline}`);
  if (packMeta.targetAudience) lines.push(`- Målgrupp: ${packMeta.targetAudience}`);
  if (packMeta.theme)          lines.push(`- Tema/ämne: ${packMeta.theme}`);
  if (packMeta.defaultLanguage) lines.push(`- Huvudspråk: ${LANGUAGE_OPTIONS.find(l => l.value === packMeta.defaultLanguage)?.label || packMeta.defaultLanguage}`);
  if (packMeta.accentColor)    lines.push(`- Accentfärg: ${packMeta.accentColor}`);
  if (packMeta.typography)     lines.push(`- Typsnittsstil: ${packMeta.typography}`);

  const activeFeatures = Object.entries(features || {}).filter(([, v]) => v && v !== null).map(([k]) => k);
  if (activeFeatures.length > 0) lines.push(`- Aktiverade funktioner: ${activeFeatures.join(', ')}`);

  lines.push(
    ``,
    `## Jag behöver din strategi i exakt detta JSON-format:`,
    ``,
    `\`\`\`json`,
    JSON.stringify({
      appName: "Föreslaget namn om inget är angivet, annars befintligt",
      tagline: "En rad som fångar känslan",
      emoji: "🌿",
      accentColor: "#hex om du har ett förslag",
      tone: "Beskriv appens ton och känsla på 1–2 meningar",
      targetInsights: "Vad vet vi om målgruppen och vad motiverar dem?",
      categories: [
        {
          id: "slug-utan-mellanslag",
          label: "Visningsnamn",
          emoji: "🏃",
          suggestedCount: 8,
          rationale: "Varför denna kategori passar appen"
        }
      ],
      suggestedFeatures: {
        favorites: true,
        doneTracking: true,
        logbook: false,
        textToSpeech: false,
        levelBadges: false,
        guidedMode: false,
        progressionLock: false,
        allowUserContent: false,
        activityNotes: false,
      },
      contentGuidelines: "Vad ska aktiviteterna ha gemensamt? Ton, längd, steg?",
      totalActivities: 20
    }, null, 2),
    `\`\`\``,
    ``,
    `Svara ENDAST med JSON-blocket. Inga förklaringar utanför blocket.`,
  );

  return lines.join('\n');
}

// ── Aktivitets-prompt (fas 2 av AI-flödet) ──────────────────────────────────
export function buildAiPrompt(wizardState) {
  const { packMeta, aiFields, activities, aiStrategy, languages } = wizardState;
  const needsActivities = (aiFields || []).includes('activities') || (activities || []).length === 0;
  const needsMeta = (aiFields || []).filter(f => ['appName','tagline','emoji','accentColor','categories'].includes(f));
  const strategy = aiStrategy;

  const lines = [
    `Du är expert på att designa aktivitetsappar för mobil. Skapa ett Playtypus-pack.`,
    ``,
    `## Vad jag har bestämt:`,
  ];

  const name    = (strategy?.appName    || packMeta.appName);
  const tagline = (strategy?.tagline    || packMeta.tagline);
  const emoji   = (strategy?.emoji      || packMeta.emoji);
  const color   = (strategy?.accentColor || packMeta.accentColor);
  const tone    = strategy?.tone;

  if (name    && !aiFields?.includes('appName'))    lines.push(`- Appnamn: ${name}`);
  if (tagline && !aiFields?.includes('tagline'))    lines.push(`- Tagline: ${tagline}`);
  if (packMeta.targetAudience)                      lines.push(`- Målgrupp: ${packMeta.targetAudience}`);
  if (packMeta.theme)                               lines.push(`- Tema/ämne: ${packMeta.theme}`);
  if (packMeta.defaultLanguage)                     lines.push(`- Språk: ${LANGUAGE_OPTIONS.find(l => l.value === packMeta.defaultLanguage)?.label || packMeta.defaultLanguage}`);
  if (color  && !aiFields?.includes('accentColor')) lines.push(`- Accentfärg: ${color}`);
  if (tone)                                          lines.push(`- Ton/känsla: ${tone}`);
  if (strategy?.contentGuidelines)                  lines.push(`- Innehållsriktlinjer: ${strategy.contentGuidelines}`);

  // Kategorier — använd strategins om tillgängliga
  const stratCats = strategy?.categories;
  const manualCats = (packMeta.categories || []).map(c => typeof c === 'string' ? { id: c, label: c, emoji: '' } : c);
  const cats = stratCats || (manualCats.length > 0 ? manualCats : null);
  if (cats && !aiFields?.includes('categories')) {
    lines.push(`- Kategorier: ${cats.map(c => `${c.emoji || ''} ${c.label || c.id}`).join(', ')}`);
  }

  if (needsMeta.length > 0) {
    lines.push(``, `## Jag behöver att du bestämmer:`);
    if (aiFields.includes('appName'))    lines.push(`- appName: kort, minnesvärt namn`);
    if (aiFields.includes('tagline'))    lines.push(`- tagline: en rad som fångar känslan`);
    if (aiFields.includes('emoji'))      lines.push(`- emoji: ett emoji som representerar appen`);
    if (aiFields.includes('accentColor'))lines.push(`- accentColor: en hex-färg som passar temat`);
    if (aiFields.includes('categories')) lines.push(`- categories: 3–6 kategorier som [{ "id": "slug", "label": "Visningsnamn", "emoji": "🏃" }]`);
  }

  if (needsActivities) {
    const count = strategy?.totalActivities || packMeta.activityCount || 20;
    const langs = languages || ['sv'];
    lines.push(
      ``, `## Aktiviteter:`,
      `Skapa ${count} aktiviteter. Varje aktivitet ska ha EXAKT dessa fält:`,
      `- id: "act-001" (löpnummer, unikt)`,
      `- title: kort, engagerande titel`,
      `- description: 1–3 meningar som motiverar och förklarar`,
      `- emoji: ett passande emoji`,
      `- category: id-värdet på en av kategorierna ovan (slug, inte label)`,
      `- durationSeconds: heltal, t.ex. 600 för 10 min, 1800 för 30 min`,
      `- prepTimeMinutes: heltal, minuter förberedelse (0 om ingen krävs)`,
      `- level: 1 (enkel), 2 (medel) eller 3 (svår)`,
      `- requiresProps: true/false — kräver aktiviteten rekvisita eller material?`,
      `- props: array med material om requiresProps är true, annars []`,
      `- steps: array med 3–6 steg som string, t.ex. ["Steg 1...", "Steg 2..."]`,
      `- tags: 2–4 nyckelord som array`,
      `- repeat: null | "weekly" | "monthly" | "never" — hur ofta aktiviteten bör upprepas`,
      `- contentVersion: alltid 1`,
    );
    if (langs.length > 1) {
      lines.push(
        ``,
        `Appen stödjer ${langs.length} språk: ${langs.join(', ')}.`,
        `Skapa aktiviteterna på standardspråket (${langs[0]}) — vi hanterar översättning separat.`,
      );
    }
  }

  lines.push(
    ``, `## VIKTIGT — returnera EXAKT denna JSON-struktur och inget annat:`,
    `\`\`\`json`,
    JSON.stringify(buildExpectedJson(wizardState, needsActivities, cats), null, 2),
    `\`\`\``,
    ``, `Inga förklaringar, ingen text utanför JSON-blocket.`,
  );

  return lines.join('\n');
}

function buildExpectedJson(wizardState, needsActivities, cats) {
  const { aiFields } = wizardState;
  const out = {};

  if (aiFields?.includes('appName'))    out.appName    = '...';
  if (aiFields?.includes('tagline'))    out.tagline    = '...';
  if (aiFields?.includes('emoji'))      out.emoji      = '...';
  if (aiFields?.includes('accentColor'))out.accentColor= '#xxxxxx';
  if (aiFields?.includes('categories')) out.categories = [{ id: 'slug', label: 'Namn', emoji: '🎯' }];

  if (needsActivities) {
    out.activities = [
      {
        id: 'act-001',
        title: '...',
        description: '...',
        emoji: '...',
        category: cats?.[0]?.id || 'kategori-slug',
        durationSeconds: 600,
        prepTimeMinutes: 0,
        level: 1,
        requiresProps: false,
        props: [],
        steps: ['Steg 1...', 'Steg 2...', 'Steg 3...'],
        tags: ['nyckelord'],
        repeat: null,
        contentVersion: 1,
      },
    ];
  }
  return out;
}

export function slugify(str) {
  return (str || '')
    .toLowerCase()
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
