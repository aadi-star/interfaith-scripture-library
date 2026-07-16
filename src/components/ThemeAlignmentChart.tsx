import React, { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Cell
} from "recharts";
import { 
  Layers, 
  HelpCircle, 
  TrendingUp, 
  Activity, 
  Compass, 
  Share2, 
  Heart,
  BarChart3
} from "lucide-react";
import { ComparisonResponse, ReligionType } from "../types";

const RELIGION_LABELS: Record<string, string> = {
  hinduism: "Hinduism",
  islam: "Islam",
  christianity: "Christianity",
  buddhism: "Buddhism",
  judaism: "Judaism",
  sikhism: "Sikhism",
  jainism: "Jainism",
  taoism: "Taoism"
};

const RELIGION_COLORS: Record<string, string> = {
  hinduism: "#f59e0b",      // Amber
  islam: "#10b981",          // Emerald
  christianity: "#3b82f6",   // Blue
  buddhism: "#a855f7",       // Purple
  judaism: "#06b6d4",        // Cyan
  sikhism: "#ec4899",        // Pink
  jainism: "#84cc16",        // Lime
  taoism: "#14b8a6"          // Teal
};

interface ThemeAlignmentChartProps {
  synthesisResponse: ComparisonResponse;
}

const ETHICAL_DIMENSIONS = [
  { name: "Compassion & Goodwill", keywords: ["love", "compassion", "mercy", "charity", "kind", "benevolent", "forgiven", "friendly", "malice", "benevolence", "heart", "agape", "care", "peaceful", "unconditional"] },
  { name: "Humility & Ego-Transcendence", keywords: ["humility", "proud", "boast", "ego", "surrender", "glory", "modest", "vanity", "pride", "egotism", "possessiveness", "humble", "submission", "surrendered", "self-mastery"] },
  { name: "Social Welfare & Relief", keywords: ["wealth", "needy", "orphan", "justice", "share", "volunteer", "giving", "humanitarian", "poor", "welfare", "relieve", "civic", "equity", "social", "help"] },
  { name: "Harmony & Non-injury", keywords: ["peace", "non-injury", "ahimsa", "non-violence", "reconciliation", "harmonious", "quiet", "still", "calm", "tranquil", "shanti", "serene", "soft", "reconcile", "balance"] },
  { name: "Wisdom & Spiritual Truth", keywords: ["wisdom", "truth", "knowledge", "intellect", "illumination", "prophecy", "guide", "buddhi", "thought", "mind", "study", "dharma", "teaching", "real", "contemplate"] }
];

export const ThemeAlignmentChart: React.FC<ThemeAlignmentChartProps> = ({ synthesisResponse }) => {
  const [activeChartTab, setActiveChartTab] = useState<"dimensions" | "intersection">("dimensions");
  const [hoveredData, setHoveredData] = useState<string | null>(null);

  const comparisons = synthesisResponse.comparisons || [];

  // 1. Dynamic dimensions data builder
  const dimensionsData = ETHICAL_DIMENSIONS.map((dim) => {
    const row: any = { dimension: dim.name };
    comparisons.forEach((comp) => {
      const textToScan = `${comp.keyPassage} ${comp.explanation} ${comp.relevanceToModernLife}`.toLowerCase();
      let matchCount = 0;
      dim.keywords.forEach((kw) => {
        const regex = new RegExp(kw, "gi");
        const matches = textToScan.match(regex);
        if (matches) {
          matchCount += matches.length;
        }
      });
      // Normalize score between 25 and 95 for graceful visualization
      const score = Math.min(95, 25 + matchCount * 12);
      row[comp.religion] = score;
    });
    return row;
  });

  // 2. Dynamic intersection overlap index builder (with standard calculations)
  const mainTheme = synthesisResponse.theme || "Universal Ethics";
  const themeWords = mainTheme.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

  const intersectionData = comparisons.map((comp) => {
    const textToScan = `${comp.keyPassage} ${comp.explanation} ${comp.relevanceToModernLife}`.toLowerCase();
    
    // Count matches to user's search theme words
    let overlapCount = 0;
    themeWords.forEach((word) => {
      // safe extraction to avoid infinite loops or regex escape crashes
      const parts = textToScan.split(word);
      overlapCount += (parts.length - 1);
    });

    const alignmentScore = Math.min(98, 40 + overlapCount * 15);
    
    // Modern feasibility scoring
    const hasPracticalKeywords = /modern|action|practice|society|community|daily|people|today|live|world/i.test(comp.relevanceToModernLife);
    const relevanceScore = Math.min(95, 30 + (comp.relevanceToModernLife.length / 4) + (hasPracticalKeywords ? 20 : 0));

    return {
      religion: comp.religion,
      name: RELIGION_LABELS[comp.religion] || comp.religion,
      "Alignment Index": Math.round(alignmentScore),
      "Modern Feasibility": Math.round(relevanceScore),
    };
  });

  // Calculate highest alignment theme
  const getTopAlignmentTradition = () => {
    if (intersectionData.length === 0) return "N/A";
    const sorted = [...intersectionData].sort((a, b) => b["Alignment Index"] - a["Alignment Index"]);
    return sorted[0].name;
  };

  const getAverageAlignment = () => {
    if (intersectionData.length === 0) return 0;
    const sum = intersectionData.reduce((acc, curr) => acc + curr["Alignment Index"], 0);
    return Math.round(sum / intersectionData.length);
  };

  // Safe helper to build tooltip formatter
  const formatPercentage = (value: any) => `${value}%`;

  return (
    <div className="bg-[#0e0f14]/90 border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-5">
      {/* Decorative background visual elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none z-0" />

      {/* Main Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Analytical Comparison Visualizer
            </h4>
          </div>
          <h3 className="text-lg font-serif font-semibold text-white">
            Ethical Alignment &amp; Synthesis Matrix
          </h3>
          <p className="text-[11px] text-slate-400 font-serif leading-relaxed">
            Quantitative matrix plotting scriptural key features, thematic presence, and intersection metrics for &ldquo;{mainTheme}&rdquo;.
          </p>
        </div>

        {/* View Toggle tabs switch */}
        <div className="flex bg-black/40 border border-white/5 p-1 rounded-xl shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveChartTab("dimensions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === "dimensions"
                ? "bg-amber-500 text-black shadow-md font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Ethical Dimensions</span>
          </button>
          <button
            onClick={() => setActiveChartTab("intersection")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
              activeChartTab === "intersection"
                ? "bg-amber-500 text-black shadow-md font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Theme Intersection</span>
          </button>
        </div>
      </div>

      {/* Quick stats board row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono">Traditions Present</span>
          <span className="text-xl font-bold text-white mt-1 block">{comparisons.length}</span>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono">Top Aligning Tradition</span>
          <span className="text-xs font-bold text-amber-300 mt-1.5 truncate block">{getTopAlignmentTradition()}</span>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono">Avg Concept Overlap</span>
          <span className="text-xl font-bold text-indigo-400 mt-1 block">{getAverageAlignment()}%</span>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3 text-center">
          <span className="text-[9px] uppercase tracking-wider text-slate-500 block font-mono">Thematic Target</span>
          <span className="text-xs font-mono font-bold text-slate-300 mt-1.5 truncate block uppercase">
            {mainTheme.substring(0, 15)}{mainTheme.length > 15 ? "..." : ""}
          </span>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="bg-black/25 rounded-xl p-4 border border-white/5 min-h-[300px] flex items-center justify-center relative z-10 shadow-inner">
        {comparisons.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <Compass className="w-8 h-8 text-slate-600 mx-auto animate-spin-slow" />
            <p className="text-sm font-serif text-slate-400 font-medium">Accumulating scriptural matrix...</p>
            <p className="text-[11px] text-slate-500">Provide a theme and click Analyze in the form above.</p>
          </div>
        ) : (
          <div className="w-full h-[320px]">
            {activeChartTab === "dimensions" ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dimensionsData}>
                  <PolarGrid stroke="rgba(255,255,255,0.07)" radialLines={true} gridType="polygon" />
                  <PolarAngleAxis 
                    dataKey="dimension" 
                    tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    tick={{ fill: "#475569", fontSize: 8 }}
                    axisLine={false}
                  />
                  {comparisons.map((comp) => (
                    <Radar
                      key={comp.religion}
                      name={RELIGION_LABELS[comp.religion] || comp.religion}
                      dataKey={comp.religion}
                      stroke={RELIGION_COLORS[comp.religion] || "#ffffff"}
                      fill={RELIGION_COLORS[comp.religion] || "#ffffff"}
                      fillOpacity={0.15}
                      strokeWidth={1.8}
                    />
                  ))}
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "rgba(10, 11, 15, 0.95)", 
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      fontSize: "11px",
                      color: "#f8fafc",
                      fontFamily: "monospace"
                    }}
                    itemStyle={{ padding: "1px 0" }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "10px", marginTop: "15px", fontFamily: "monospace" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={intersectionData}
                  margin={{ top: 20, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fill: "#475569", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "rgba(10, 11, 15, 0.95)", 
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                      fontSize: "11px",
                      color: "#f8fafc"
                    }}
                    formatter={formatPercentage}
                  />
                  <Legend 
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "10px", marginTop: "10px", fontFamily: "monospace" }}
                  />
                  <Bar 
                    dataKey="Alignment Index" 
                    fill="#f59e0b" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={32}
                  >
                    {intersectionData.map((entry, index) => (
                      <Cell key={`cell-align-${index}`} fill={RELIGION_COLORS[entry.religion] || "#f59e0b"} fillOpacity={0.8} />
                    ))}
                  </Bar>
                  <Bar 
                    dataKey="Modern Feasibility" 
                    fill="#6366f1" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={32}
                  >
                    {intersectionData.map((entry, index) => (
                      <Cell key={`cell-feas-${index}`} fill={RELIGION_COLORS[entry.religion] || "#6366f1"} fillOpacity={0.4} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        )}
      </div>

      {/* Explanatory insights footer box */}
      <div className="bg-[#14151b] border border-white/5 rounded-xl p-4 text-xs font-serif leading-relaxed text-slate-300 md:flex md:items-start md:gap-3">
        <Activity className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 mx-auto md:mx-0" />
        <div className="space-y-1 text-center md:text-left mt-2 md:mt-0">
          <span className="text-[10px] uppercase font-mono font-bold text-indigo-300 block tracking-wider">
            Methodological Synthesis Note
          </span>
          <p className="text-slate-400 text-xs text-justify">
            This analytical cockpit uses dynamic lexical scanning across comparative summaries. The <strong className="text-slate-200">Ethical Dimensions radar profile</strong> measures occurrences of foundational universal coordinates, while the <strong className="text-slate-200">Theme Intersection bar chart</strong> establishes the quantitative index (lexical overlapping) of your query concept against each canon.
          </p>
        </div>
      </div>
    </div>
  );
};
