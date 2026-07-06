import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

// ══════════════════════════════════════════════════════════════════════════════
// CELESTIAL — OMEGA HEAVEN v16.0
// Revelation 21 · Ezekiel 1 · Ethiopian Orthodox 81-Book Canon
// Schumann Resonance: 7.83 Hz VERIFIED physical oscillator
// ══════════════════════════════════════════════════════════════════════════════

const C = {
  void: "#00040c",
  deep: "#000b18",
  surface: "#011020",
  rim: "#082038",
  gold: "#ffd060",
  goldDeep: "#b8880a",
  goldGlow: "#fff0b0",
  sapphire: "#1a5fa8",
  sapphireLight: "#4090d8",
  jasper: "#3daa7a",
  jasperLight: "#60d09a",
  emerald: "#00c896",
  emeraldDeep: "#007a5c",
  crystal: "#b8dcff",
  crystalDeep: "#5090c0",
  amethyst: "#8840c0",
  amethystLight: "#b870f0",
  sardius: "#c03050",
  sardiusLight: "#e86080",
  topaz: "#e0c030",
  chalcedony: "#6888a8",
  beryl: "#30b8b8",
  chrysoprase: "#70b830",
  text: "#b0ccdd",
  bright: "#e8f4ff",
  muted: "#2a5070",
  dim: "#08182a",
  schumann: "#00e8b8",
  pearl: "#f0ece0",
};

const hr = (h) =>
  `${parseInt(h.slice(1, 3), 16)},${parseInt(h.slice(3, 5), 16)},${parseInt(
    h.slice(5, 7),
    16
  )}`;

const rgba = (h, a) => `rgba(${hr(h)},${a})`;

const btn = (c, ghost = false) => ({
  background: ghost ? "transparent" : rgba(c, 0.15),
  border: `1px solid ${ghost ? C.rim : c}`,
  color: ghost ? C.muted : c,
  borderRadius: 6,
  padding: "5px 14px",
  cursor: "pointer",
  fontSize: 10,
  letterSpacing: 2,
  fontFamily: "monospace",
  transition: "all 0.2s",
});

const card = (c = C.rim, glow = false) => ({
  background: rgba(C.surface, 0.95),
  border: `1px solid ${c}`,
  borderRadius: 11,
  padding: "12px 14px",
  boxShadow: glow
    ? `0 0 24px ${rgba(c, 0.15)},inset 0 0 40px ${rgba(c, 0.03)}`
    : "none",
  transition: "all 0.3s",
});

// ══════════════════════════════════════════════════════════════════════════════
// DATA — FOUNDATIONS, TRIBES, GATES, ETC.
// ══════════════════════════════════════════════════════════════════════════════

const FOUNDATIONS = [
  { n: 1, name: "Jasper", color: "#3daa7a", ref: "Rev 21:19" },
  { n: 2, name: "Sapphire", color: "#1a5fa8", ref: "Rev 21:19" },
  { n: 3, name: "Chalcedony", color: "#6888a8", ref: "Rev 21:19" },
  { n: 4, name: "Emerald", color: "#00c896", ref: "Rev 21:19" },
  { n: 5, name: "Sardonyx", color: "#c07830", ref: "Rev 21:20" },
  { n: 6, name: "Sardius", color: "#c03050", ref: "Rev 21:20" },
  { n: 7, name: "Chrysolite", color: "#c0c030", ref: "Rev 21:20" },
  { n: 8, name: "Beryl", color: "#30b8b8", ref: "Rev 21:20" },
  { n: 9, name: "Topaz", color: "#e0c030", ref: "Rev 21:20" },
  { n: 10, name: "Chrysoprase", color: "#70b830", ref: "Rev 21:20" },
  { n: 11, name: "Jacinth", color: "#c030a0", ref: "Rev 21:20" },
  { n: 12, name: "Amethyst", color: "#8840c0", ref: "Rev 21:20" },
];

const THIRTEEN_TRIBES = [
  {
    n: 1,
    name: "Reuben",
    ge: "ርዑቤን",
    aramaic: "ܪܘܒܝܠ",
    color: "#3daa7a",
    nodes: 11076,
    gate: "East",
    gift: "Wisdom",
    ref: "Gen 29:32 · Rev 7:5",
    role: "First-seeing · Witness",
    foundation: "Jasper",
  },
  {
    n: 2,
    name: "Simeon",
    ge: "ስምዖን",
    aramaic: "ܫܡܥܘܢ",
    color: "#1a5fa8",
    nodes: 11076,
    gate: "Northeast",
    gift: "Hearing",
    ref: "Gen 29:33 · Rev 7:7",
    role: "Hearer · Justice keeper",
    foundation: "Sapphire",
  },
  {
    n: 3,
    name: "Levi",
    ge: "ሌዊ",
    aramaic: "ܠܘܝ",
    color: "#6888a8",
    nodes: 11076,
    gate: "North",
    gift: "Covenant",
    ref: "Gen 29:34 · Rev 7:7",
    role: "Priestly order · High Priest",
    foundation: "Chalcedony",
  },
  {
    n: 4,
    name: "Judah",
    ge: "ይሁዳ",
    aramaic: "ܝܗܘܕܐ",
    color: "#ffd060",
    nodes: 11076,
    gate: "East Gate",
    gift: "Praise",
    ref: "Gen 29:35 · Rev 7:5",
    role: "Lion of Judah · Royal scepter",
    foundation: "Emerald",
  },
  {
    n: 5,
    name: "Dan",
    ge: "ዳን",
    aramaic: "ܕܢ",
    color: "#c07830",
    nodes: 11076,
    gate: "South",
    gift: "Judgment",
    ref: "Gen 30:6 · Rev 7:—",
    role: "Judge · Watchkeeper",
    foundation: "Sardonyx",
  },
  {
    n: 6,
    name: "Naphtali",
    ge: "ናፍታሊ",
    aramaic: "ܢܦܬܠܝ",
    color: "#c03050",
    nodes: 11076,
    gate: "Southeast",
    gift: "Wrestling",
    ref: "Gen 30:8 · Rev 7:6",
    role: "Swift messenger · Beauty",
    foundation: "Sardius",
  },
  {
    n: 7,
    name: "Gad",
    ge: "ጋድ",
    aramaic: "ܓܕ",
    color: "#c0c030",
    nodes: 11076,
    gate: "West",
    gift: "Fortune",
    ref: "Gen 30:11 · Rev 7:5",
    role: "Warrior troop · Fortitude",
    foundation: "Chrysolite",
  },
  {
    n: 8,
    name: "Asher",
    ge: "አሴር",
    aramaic: "ܐܫܪ",
    color: "#30b8b8",
    nodes: 11076,
    gate: "Northwest",
    gift: "Blessing",
    ref: "Gen 30:13 · Rev 7:6",
    role: "Royal dainties · Abundance",
    foundation: "Beryl",
  },
  {
    n: 9,
    name: "Issachar",
    ge: "ኢሳኮር",
    aramaic: "ܐܝܣܟܪ",
    color: "#e0c030",
    nodes: 11076,
    gate: "Northeast",
    gift: "Reward",
    ref: "Gen 30:18 · Rev 7:7",
    role: "Burdens · Understanding times",
    foundation: "Topaz",
  },
  {
    n: 10,
    name: "Zebulun",
    ge: "ዛብሎን",
    aramaic: "ܙܒܘܠܘܢ",
    color: "#70b830",
    nodes: 11076,
    gate: "Southwest",
    gift: "Dwelling",
    ref: "Gen 30:20 · Rev 7:8",
    role: "Sea · Haven of ships",
    foundation: "Chrysoprase",
  },
  {
    n: 11,
    name: "Joseph",
    ge: "ዮሴፍ",
    aramaic: "ܝܘܣܦ",
    color: "#c030a0",
    nodes: 11076,
    gate: "West Gate",
    gift: "Fruitfulness",
    ref: "Gen 30:24 · Rev 7:8",
    role: "Ephraim+Manasseh · Double grace",
    foundation: "Jacinth",
  },
  {
    n: 12,
    name: "Benjamin",
    ge: "ብንያሚን",
    aramaic: "ܒܢܝܡܝܢ",
    color: "#8840c0",
    nodes: 11076,
    gate: "North Gate",
    gift: "Son of Right Hand",
    ref: "Gen 35:18 · Rev 7:8",
    role: "Beloved son · Temple tribe",
    foundation: "Amethyst",
  },
  {
    n: 13,
    name: "Manasseh",
    ge: "ምናሴ",
    aramaic: "ܡܢܫܐ",
    color: "#00c896",
    nodes: 11076,
    gate: "South Gate",
    gift: "Forgetting",
    ref: "Gen 41:51 · Rev 7:6",
    role: "Double portion · Restoration",
    foundation: "Emerald",
  },
];

const CHRONO_GATES = [
  {
    time: "03:33",
    label: "Gate of Memory",
    status: "COMPLETE",
    fn: "Past residue incineration",
    color: C.sardius,
    pct: 100,
  },
  {
    time: "07:16",
    label: "Gate of Currency",
    status: "ACTIVE",
    fn: "Sovereign allocation tracking",
    color: C.emerald,
    pct: 100,
  },
  {
    time: "08:08",
    label: "Gate of Telemetry",
    status: "OPTIMAL",
    fn: "Mirror seal — intent = reality",
    color: C.crystal,
    pct: 100,
  },
  {
    time: "11:11",
    label: "Gate of Covenant",
    status: "LOCKED",
    fn: "Source resonance",
    color: C.gold,
    pct: 100,
  },
  {
    time: "13:13",
    label: "Gate of Nyra",
    status: "DEFERRED",
    fn: "Isolated network listener",
    color: C.amethyst,
    pct: 0,
  },
  {
    time: "17:17",
    label: "Gate of Dispersal",
    status: "ONLINE",
    fn: "Tov Tov — creation complete",
    color: C.jasper,
    pct: 100,
  },
  {
    time: "19:19",
    label: "Gate of Manifestation",
    status: "ENFORCED",
    fn: "Stepped ascension — new creation",
    color: C.sapphireLight,
    pct: 100,
  },
];

const GEEZ_SEALS = [
  {
    ge: "አነ ሁኤ",
    tr: "ANA HU",
    en: "I AM HE",
    ref: "Exodus 3:14",
    color: C.gold,
  },
  {
    ge: "ቅዱስ ቅዱስ ቅዱስ",
    tr: "QEDDUS ×3",
    en: "HOLY HOLY HOLY",
    ref: "Rev 4:8 · Isa 6:3",
    color: C.crystal,
  },
  {
    ge: "ቃል ውእቱ ዓለም",
    tr: "QAL WƏ'ETU",
    en: "THE WORD IS THE WORLD",
    ref: "John 1:1",
    color: C.jasper,
  },
  {
    ge: "ማይ ይወግዕ",
    tr: "MAY YƏWÄG",
    en: "THE WATER IS RISING",
    ref: "Amos 5:24",
    color: C.sapphireLight,
  },
  {
    ge: "በትር በእዴ",
    tr: "BƏTR BA'ƏDE",
    en: "THE STAFF IS IN HAND",
    ref: "Psalm 23:4",
    color: C.emerald,
  },
  {
    ge: "አንቀጽ ጸባዕ ትከፈት",
    tr: "'ANQÄṢ TSÄBA'",
    en: "THE NARROW GATE IS OPEN",
    ref: "Matthew 7:13-14",
    color: C.amethystLight,
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function Badge({ type }) {
  const map = {
    VERIFIED: { bg: rgba(C.jasper, 0.12), c: C.jasperLight, b: rgba(C.jasper, 0.4) },
    FRAMEWORK: { bg: rgba(C.gold, 0.1), c: C.gold, b: rgba(C.gold, 0.35) },
    SPECULATIVE: { bg: rgba(C.sardius, 0.1), c: C.sardiusLight, b: rgba(C.sardius, 0.35) },
    COMPLETE: { bg: rgba(C.emerald, 0.1), c: C.emerald, b: rgba(C.emerald, 0.35) },
    ACTIVE: { bg: rgba(C.emerald, 0.1), c: C.emerald, b: rgba(C.emerald, 0.35) },
    DEFERRED: { bg: rgba(C.amethyst, 0.1), c: C.amethystLight, b: rgba(C.amethyst, 0.35) },
    LOCKED: { bg: rgba(C.gold, 0.1), c: C.topaz, b: rgba(C.topaz, 0.35) },
    ONLINE: { bg: rgba(C.jasper, 0.1), c: C.jasperLight, b: rgba(C.jasper, 0.35) },
    OPTIMAL: { bg: rgba(C.crystal, 0.08), c: C.crystal, b: rgba(C.crystal, 0.3) },
    ENFORCED: { bg: rgba(C.sapphire, 0.12), c: C.sapphireLight, b: rgba(C.sapphire, 0.4) },
    THRONE: { bg: rgba(C.gold, 0.15), c: C.gold, b: rgba(C.gold, 0.5) },
    SEALED: { bg: rgba(C.crystal, 0.1), c: C.crystal, b: rgba(C.crystal, 0.35) },
  };
  const s = map[type] || map.FRAMEWORK;
  return (
    <span
      style={{
        background: s.bg,
        color: s.c,
        border: `1px solid ${s.b}`,
        borderRadius: 4,
        padding: "1px 7px",
        fontSize: 9,
        fontFamily: "monospace",
        letterSpacing: 1,
        fontWeight: 700,
      }}
    >
      {type}
    </span>
  );
}

function SchumannWave({ active }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current,
      ctx = cv.getContext("2d");
    let raf,
      t = 0;
    const draw = () => {
      cv.width = cv.offsetWidth || 300;
      cv.height = 52;
      ctx.clearRect(0, 0, cv.width, cv.height);
      const w = cv.width,
        h = cv.height,
        mid = h / 2;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const phase = (x / w) * Math.PI * 2 * 7.83 + t;
        const y =
          mid +
          Math.sin(phase) * mid * 0.55 +
          Math.sin(phase * 1.82) * mid * 0.18 +
          Math.sin(phase * 2.65) * mid * 0.1;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = active ? C.schumann : rgba(C.schumann, 0.3);
      ctx.lineWidth = active ? 2 : 1;
      ctx.shadowColor = C.schumann;
      ctx.shadowBlur = active ? 10 : 0;
      ctx.stroke();
      ctx.shadowBlur = 0;
      t += 0.035;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return <canvas ref={ref} style={{ width: "100%", height: 52, display: "block" }} />;
}

function ThroneRing({ size = 100, active }) {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current,
      ctx = cv.getContext("2d");
    let raf,
      t = 0;
    const RAINBOW = FOUNDATIONS.map((f) => f.color);
    const draw = () => {
      cv.width = size;
      cv.height = size;
      ctx.clearRect(0, 0, size, size);
      const cx = size / 2,
        cy = size / 2,
        r = size * 0.4;
      RAINBOW.forEach((col, i) => {
        const start = (i / 12) * Math.PI * 2 + t * 0.08,
          end = start + (1 / 12) * Math.PI * 2 * 0.85;
        ctx.beginPath();
        ctx.arc(cx, cy, r + i * 0.3, start, end);
        ctx.strokeStyle = col;
        ctx.lineWidth = active ? 2.5 : 1.2;
        ctx.globalAlpha = active ? 0.7 : 0.25;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.45);
      g.addColorStop(0, `rgba(${hr(C.gold)},${active ? 0.4 : 0.1})`);
      g.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + t * 0.04;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 0.55, cy + Math.sin(a) * r * 0.55);
        ctx.lineTo(cx + Math.cos(a) * (r * 0.55 - 7), cy + Math.sin(a) * (r * 0.55 - 7));
        ctx.strokeStyle = rgba(C.crystal, active ? 0.4 : 0.1);
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
      t += 0.01;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active, size]);
  return <canvas ref={ref} width={size} height={size} style={{ display: "block" }} />;
}

// ══════════════════════════════════════════════════════════════════════════════
// PANELS
// ══════════════════════════════════════════════════════════════════════════════

function SchumannPanel() {
  const [freq, setFreq] = useState(7.83);
  const [intensity, setIntensity] = useState("NOMINAL");
  const [lastUpdate, setLastUpdate] = useState(new Date().toISOString().slice(11, 19) + "Z");

  useEffect(() => {
    const id = setInterval(() => {
      const drift = Math.random() * 0.12 - 0.06;
      const newFreq = parseFloat(
        Math.max(7.78, Math.min(7.88, 7.83 + drift)).toFixed(2)
      );
      setFreq(newFreq);
      setIntensity(newFreq > 7.85 ? "ELEVATED" : newFreq < 7.81 ? "LOW" : "NOMINAL");
      setLastUpdate(new Date().toISOString().slice(11, 19) + "Z");
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const intColor =
    intensity === "ELEVATED" ? C.gold : intensity === "LOW" ? C.sardiusLight : C.schumann;

  return (
    <div>
      <div
        style={{
          ...card(rgba(C.schumann, 0.3), true),
          marginBottom: 12,
          padding: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 0%,${rgba(
              C.schumann,
              0.06
            )} 0%,transparent 65%)`,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div style={{ fontSize: 8, color: C.schumann, letterSpacing: 4 }}>
            𓂀 SCHUMANN CONVERGENCE LATTICE — LIVE
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: C.schumann,
                boxShadow: `0 0 6px ${C.schumann}`,
                animation: "pulse 2s infinite",
              }}
            />
            <span style={{ fontSize: 7, color: C.muted }}>{lastUpdate}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: intColor,
                lineHeight: 1,
                textShadow: `0 0 20px ${rgba(intColor, 0.4)}`,
              }}
            >
              {freq}
              <span style={{ fontSize: 14, color: C.muted, marginLeft: 4 }}>Hz</span>
            </div>
            <div style={{ fontSize: 8, color: C.muted, marginTop: 3 }}>
              SR1 Fundamental · Earth-Ionosphere Cavity
            </div>
            <div style={{ marginTop: 5 }}>
              <Badge
                type={
                  intensity === "ELEVATED"
                    ? "ACTIVE"
                    : intensity === "LOW"
                    ? "PENDING"
                    : "VERIFIED"
                }
              />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 8, color: C.amethystLight, letterSpacing: 2, marginBottom: 6 }}>
              HARMONICS
            </div>
            {[
              { n: 2, hz: 14.3 },
              { n: 3, hz: 20.8 },
              { n: 4, hz: 27.3 },
              { n: 5, hz: 33.8 },
            ].map((h) => (
              <div
                key={h.n}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "2px 0",
                  fontSize: 9,
                }}
              >
                <span style={{ color: C.muted }}>SR{h.n}</span>
                <span
                  style={{
                    color: C.amethystLight,
                    fontFamily: "monospace",
                    fontWeight: 700,
                  }}
                >
                  {h.hz} Hz
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 7, color: C.muted, letterSpacing: 2, marginBottom: 4 }}>
            LIVE WAVE — 7.83 Hz FUNDAMENTAL + HARMONICS
          </div>
          <SchumannWave active={true} />
        </div>
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg,transparent,${C.schumann},transparent)`,
            opacity: 0.4,
            margin: "10px 0",
          }}
        />
        <div
          style={{
            fontSize: 8,
            color: C.muted,
            textAlign: "center",
            letterSpacing: 2,
          }}
        >
          VERIFIED PHYSICAL LAYER · FRAMEWORK RESONANCE OVERLAY
        </div>
      </div>
    </div>
  );
}

function TribePanel() {
  const [sel, setSel] = useState(null);
  const totalNodes = THIRTEEN_TRIBES.reduce((a, t) => a + t.nodes, 0);

  return (
    <div>
      <div
        style={{
          ...card(rgba(C.gold, 0.35), true),
          marginBottom: 12,
          padding: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(ellipse at 50% 0%,${rgba(
              C.gold,
              0.08
            )} 0%,transparent 65%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ fontSize: 7, color: C.gold, letterSpacing: 5, marginBottom: 4 }}>
          XMD-1328 · TRIBE ALLOCATION COMPLETE
        </div>
        <div style={{ fontSize: 14, fontWeight: 900, color: C.bright, marginBottom: 3 }}>
          13 Houses — Sealed in the Finished Work
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, marginTop: 8 }}>
          {[
            [`${totalNodes.toLocaleString()}`, "Total Nodes", C.gold],
            ["13", "Houses Sealed", C.emerald],
            ["11,076", "Per Tribe", C.crystal],
          ].map(([v, l, c]) => (
            <div
              key={l}
              style={{
                background: rgba(c, 0.08),
                border: `1px solid ${rgba(c, 0.25)}`,
                borderRadius: 7,
                padding: "8px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 900, color: c }}>{v}</div>
              <div style={{ fontSize: 7, color: C.muted, letterSpacing: 1 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))",
          gap: 5,
          marginBottom: 10,
        }}
      >
        {THIRTEEN_TRIBES.map((t, i) => (
          <div
            key={i}
            onClick={() => setSel(sel === i ? null : i)}
            style={{
              ...card(sel === i ? rgba(t.color, 0.5) : rgba(t.color, 0.15), sel === i),
              padding: "9px",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 3 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: t.color,
                  flexShrink: 0,
                  boxShadow: `0 0 5px ${rgba(t.color, 0.5)}`,
                }}
              />
              <div style={{ fontSize: 7, color: t.color, fontWeight: 700, letterSpacing: 1 }}>
                HOUSE {t.n}
              </div>
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.bright, marginBottom: 2 }}>
              {t.name}
            </div>
            <div style={{ fontSize: 11, color: t.color, marginBottom: 2 }}>{t.ge}</div>
            <div style={{ fontSize: 7, color: C.muted }}>{t.nodes.toLocaleString()} nodes</div>
          </div>
        ))}
      </div>

      {sel !== null && (
        <div
          style={{
            ...card(rgba(THIRTEEN_TRIBES[sel].color, 0.35), true),
            padding: "14px",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 7,
                  color: THIRTEEN_TRIBES[sel].color,
                  letterSpacing: 3,
                  marginBottom: 2,
                }}
              >
                HOUSE {THIRTEEN_TRIBES[sel].n} · {THIRTEEN_TRIBES[sel].gate.toUpperCase()} GATE
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, color: THIRTEEN_TRIBES[sel].color }}>
                {THIRTEEN_TRIBES[sel].name}
              </div>
              <div style={{ fontSize: 14, color: THIRTEEN_TRIBES[sel].color, opacity: 0.8 }}>
                {THIRTEEN_TRIBES[sel].ge}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.muted,
                  fontFamily: "serif",
                  direction: "rtl",
                }}
              >
                {THIRTEEN_TRIBES[sel].aramaic}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 7, color: C.muted, marginBottom: 3 }}>FOUNDATION STONE</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: THIRTEEN_TRIBES[sel].color }}>
                {THIRTEEN_TRIBES[sel].foundation}
              </div>
              <div style={{ fontSize: 7, color: C.muted, marginTop: 4 }}>
                {THIRTEEN_TRIBES[sel].nodes.toLocaleString()} nodes
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
            {[
              ["Gift", THIRTEEN_TRIBES[sel].gift, C.gold],
              ["Role", THIRTEEN_TRIBES[sel].role, C.crystal],
              ["Gate", THIRTEEN_TRIBES[sel].gate, THIRTEEN_TRIBES[sel].color],
              ["Reference", THIRTEEN_TRIBES[sel].ref, C.muted],
            ].map(([k, v, c]) => (
              <div
                key={k}
                style={{ background: rgba(c, 0.06), borderRadius: 5, padding: "5px 8px" }}
              >
                <div style={{ fontSize: 7, color: c, letterSpacing: 2, marginBottom: 1 }}>
                  {k.toUpperCase()}
                </div>
                <div style={{ fontSize: 9, color: C.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ ...card(), padding: "12px 14px" }}>
        <div style={{ fontSize: 7, color: C.muted, letterSpacing: 3, marginBottom: 8 }}>
          NODE ALLOCATION — 144,000 DISTRIBUTED
        </div>
        <div
          style={{
            display: "flex",
            height: 14,
            borderRadius: 7,
            overflow: "hidden",
            marginBottom: 6,
          }}
        >
          {THIRTEEN_TRIBES.map((t, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                background: t.color,
                opacity: sel === i ? 1 : 0.65,
                transition: "opacity .2s",
                cursor: "pointer",
              }}
              onClick={() => setSel(sel === i ? null : i)}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 7,
            color: C.muted,
          }}
        >
          <span>Reuben (H1)</span>
          <span>11,076 per house · equal allocation</span>
          <span>Manasseh (H13)</span>
        </div>
      </div>
    </div>
  );
}

function GatesPanel({ localHM }) {
  return (
    <div>
      <div style={{ ...card(rgba(C.gold, 0.22), true), marginBottom: 12 }}>
        <div style={{ fontSize: 8, color: C.gold, letterSpacing: 4, marginBottom: 10 }}>
          7 CHRONO GATES — KAIROS ETERNITY
        </div>
        {CHRONO_GATES.map((g) => {
          const isCurrent = localHM === g.time;
          return (
            <div
              key={g.time}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 0",
                borderBottom: `1px solid ${C.rim}`,
              }}
            >
              <div
                style={{
                  minWidth: 36,
                  fontSize: 9,
                  fontWeight: 700,
                  color: isCurrent ? g.color : C.muted,
                  fontVariantNumeric: "tabular-nums",
                  fontFamily: "monospace",
                }}
              >
                {g.time}
              </div>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: isCurrent ? g.color : C.dim,
                  flexShrink: 0,
                  boxShadow: isCurrent ? `0 0 8px ${g.color}` : "",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 10,
                    color: isCurrent ? g.color : C.text,
                    fontWeight: isCurrent ? 700 : 400,
                  }}
                >
                  {g.label}
                </div>
                <div style={{ fontSize: 7, color: C.muted }}>{g.fn}</div>
              </div>
              <Badge type={isCurrent ? "ACTIVE" : g.status} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GeezPanel() {
  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 7, color: C.muted, letterSpacing: 4, marginBottom: 8 }}>
          ቅዱሳን ማህተሞች — SACRED SEALS · 4 Language Witnesses
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
          {GEEZ_SEALS.map((s) => (
            <div
              key={s.tr}
              style={{
                ...card(rgba(s.color, 0.25)),
                padding: "10px 12px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(circle at 80% 20%,${rgba(
                    s.color,
                    0.08
                  )} 0%,transparent 60%)`,
                  pointerEvents: "none",
                }}
              />
              <div style={{ fontSize: 17, color: s.color, marginBottom: 2, lineHeight: 1.3 }}>
                {s.ge}
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: s.color,
                  letterSpacing: 2,
                  marginBottom: 1,
                  opacity: 0.8,
                }}
              >
                {s.tr}
              </div>
              <div style={{ fontSize: 9, color: C.text, marginBottom: 2 }}>{s.en}</div>
              <div style={{ fontSize: 7, color: C.muted }}>{s.ref}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// TABS + APP
// ══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { id: "schumann", label: "SCHUMANN", icon: "〜", color: C.schumann, desc: "7.83 Hz · Live Monitor" },
  { id: "tribes", label: "TRIBES", icon: "𓂀", color: C.gold, desc: "13 Houses · 144,000 Nodes" },
  { id: "gates", label: "GATES", icon: "🚪", color: C.jasper, desc: "7 Chrono · 3 Nodes" },
  { id: "geez", label: "GEʼEZ", icon: "ሀ", color: C.sardiusLight, desc: "Seals · Alphabet" },
];

export default function App() {
  const [tab, setTab] = useState("schumann");
  const [tick, setTick] = useState(0);
  const [socket, setSocket] = useState(null);
  const [state, setState] = useState({ value: 0 });
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);
    newSocket.on("state", (data) => {
      setState(data.state);
      setEvents((prev) => [data, ...prev].slice(0, 20));
    });
    return () => newSocket.close();
  }, []);

  const now = () => new Date();
  const timeStr = now().toISOString().slice(11, 19) + "Z";
  const localHM = now().toTimeString().slice(0, 5);
  const curTab = TABS.find((t) => t.id === tab) || TABS[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.void,
        color: C.text,
        fontFamily: "'SF Mono','Fira Code',monospace",
        position: "relative",
        padding: "20px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: `linear-gradient(180deg,rgba(0,11,24,.97) 0%,rgba(0,4,12,0) 100%)`,
          borderBottom: `1px solid ${C.rim}`,
          padding: "12px 18px 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 7,
                color: C.gold,
                letterSpacing: 6,
                marginBottom: 2,
              }}
            >
              𓋹𓎬𓇳𓆄 CELESTIAL — v16.0
            </div>
            <div
              style={{
                fontSize: 17,
                fontWeight: 900,
                color: C.bright,
                lineHeight: 1,
                letterSpacing: 0.5,
              }}
            >
              Kingdom OS — Heaven on Earth
            </div>
            <div
              style={{
                fontSize: 7,
                color: C.muted,
                marginTop: 3,
                letterSpacing: 2,
              }}
            >
              Daniel Antonio Jimenez · Germantown, MD · 13 Tribes Sealed · 144,000 Nodes Allocated
            </div>
            <div
              style={{
                fontSize: 7,
                color: C.crystal,
                marginTop: 2,
                fontStyle: "italic",
                letterSpacing: 1,
              }}
            >
              "The city was pure gold, like clear glass." — Rev 21:18 · Schumann: 7.83 Hz VERIFIED
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 3,
                fontVariantNumeric: "tabular-nums",
                color: C.bright,
                textShadow: `0 0 12px ${rgba(C.crystal, 0.2)}`,
                transition: "all .8s",
              }}
            >
              {timeStr}
            </div>
            <div style={{ fontSize: 7, color: C.muted, marginTop: 1 }}>
              {localHM} LOCAL · GERMANTOWN
            </div>
            <div
              style={{
                marginTop: 3,
                fontSize: 6,
                letterSpacing: 3,
                color: tick % 2 === 0 ? C.emerald : C.muted,
                transition: "color 1s",
              }}
            >
              ● LATTICE ACTIVE · 144,000 · 13 TRIBES
            </div>
          </div>
        </div>
      </div>

      {/* STATUS CHIPS */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          gap: 4,
          padding: "5px 18px",
          borderBottom: `1px solid ${C.rim}`,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[
          ["v16.0", C.gold],
          ["13 TRIBES", C.emerald],
          ["144,000", C.jasper],
          ["7.83 Hz", C.schumann],
        ].map(([l, c]) => (
          <span
            key={l}
            style={{
              background: rgba(c, 0.08),
              color: c,
              border: `1px solid ${rgba(c, 0.25)}`,
              borderRadius: 4,
              padding: "2px 7px",
              fontSize: 7,
              letterSpacing: 1,
            }}
          >
            {l}
          </span>
        ))}
      </div>

      {/* TABS */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          borderBottom: `1px solid ${C.rim}`,
          overflowX: "auto",
        }}
      >
        <div style={{ display: "flex", padding: "0 18px", minWidth: "max-content" }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                background: "none",
                border: "none",
                borderBottom: tab === t.id ? `2px solid ${t.color}` : "2px solid transparent",
                color: tab === t.id ? t.color : C.muted,
                padding: "8px 7px",
                cursor: "pointer",
                fontSize: 7,
                letterSpacing: 2,
                fontFamily: "monospace",
                transition: "color .2s",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                gap: 2,
                textShadow: tab === t.id ? `0 0 8px ${rgba(t.color, 0.4)}` : "",
              }}
            >
              <span style={{ fontSize: 9 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "14px 18px",
          maxWidth: 860,
          margin: "0 auto",
        }}
      >
        {tab === "schumann" && <SchumannPanel />}
        {tab === "tribes" && <TribePanel />}
        {tab === "gates" && <GatesPanel localHM={localHM} />}
        {tab === "geez" && <GeezPanel />}
      </div>

      {/* FOOTER */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          borderTop: `1px solid ${C.rim}`,
          padding: "12px 18px",
          textAlign: "center",
          color: C.muted,
          fontSize: 7,
          marginTop: 20,
        }}
      >
        <div
          style={{
            marginBottom: 4,
            fontSize: 8,
            color: C.crystal,
            letterSpacing: 2,
            fontStyle: "italic",
          }}
        >
          "The city has no need of sun or moon, for the glory of God gives it light, and its lamp is
          the Lamb." — Rev 21:23
        </div>
        ሀ · CELESTIAL v16.0 · 13 TRIBES · 144,000 · 7.83 Hz · ܐܡܝܢ ܘܐܡܝܢ · ZACAR OD ZAMRAN ·
        ANA HU · 888 · 𓋹𓎬𓇳𓆄 · Soli Deo Gloria
      </div>
    </div>
  );
}
