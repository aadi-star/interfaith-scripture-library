import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { calculateMoonPhaseDetails, SACRED_FESTIVALS_DATA, FESTIVAL_DATES_2026, MoonPhaseDetails } from "../festivalsData";
import { Sparkles, Calendar, Moon, ArrowRight, Eye } from "lucide-react";

interface LunarRadialChartProps {
  month: number; // 0-indexed
  year: number;
  fastFinderQuery: string;
  onSelectDay?: (day: number) => void;
}

interface DayData {
  day: number;
  date: Date;
  details: MoonPhaseDetails;
  fasts: { name: string; type: string; id: string; source: string }[];
}

// Local duplicate or reference of dynamic vrats to determine day alignments
const LOCAL_DYNAMIC_VRATS = [
  { id: "ekadashi-vrat", name: "Ekadashi Vrat", keyTargetTithis: [11, 26], type: "fasting", source: "Drik Panchang" },
  { id: "pradosh-vrat", name: "Pradosh Vrat", keyTargetTithis: [13, 28], type: "fasting", source: "Drik Panchang" },
  { id: "masik-shivratri", name: "Masik Shivratri", keyTargetTithis: [29], type: "vigil", source: "Drik Panchang" },
  { id: "sankashti-chaturthi", name: "Sankashti Ganesha Chaturthi", keyTargetTithis: [19], type: "fasting", source: "Drik Panchang" },
  { id: "vinayaka-chaturthi", name: "Vinayaka Ganesha Chaturthi", keyTargetTithis: [4], type: "fasting", source: "Drik Panchang" },
  { id: "satyanarayan-purnima", name: "Purnima Vrat", keyTargetTithis: [15], type: "celebration", source: "Drik Panchang" },
  { id: "amavasya-tarpanam", name: "Amavasya Ancestor Vow", keyTargetTithis: [30], type: "remembrance", source: "Drik Panchang" }
];

export const LunarRadialChart: React.FC<LunarRadialChartProps> = ({
  month,
  year,
  fastFinderQuery,
  onSelectDay
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null);
  const [selectedDayNum, setSelectedDayNum] = useState<number | null>(null);

  // Generate days dataset for the chosen month and year
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysData: DayData[] = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateObj = new Date(year, month, day, 12, 0, 0);
    const details = calculateMoonPhaseDetails(dateObj);

    const fasts: { name: string; type: string; id: string; source: string }[] = [];

    // 1. Match Drik Panchang dynamic vrats
    LOCAL_DYNAMIC_VRATS.forEach((vrat) => {
      if (vrat.keyTargetTithis.includes(details.tithiIndex)) {
        fasts.push({
          id: `${vrat.id}-${day}`,
          name: vrat.name,
          type: vrat.type,
          source: vrat.source
        });
      }
    });

    // 2. Match database festivals
    SACRED_FESTIVALS_DATA.forEach((fest) => {
      const dates = FESTIVAL_DATES_2026[fest.id];
      if (dates) {
        const fYear = parseInt(dates.start.substring(0, 4));
        const fMonth = parseInt(dates.start.substring(4, 6)) - 1;
        const fDay = parseInt(dates.start.substring(6, 8));

        if (fYear === year && fMonth === month && fDay === day) {
          if (!fasts.some(f => f.id.startsWith(fest.id))) {
            fasts.push({
              id: `${fest.id}-${day}`,
              name: fest.name,
              type: fest.type,
              source: fest.sourcesAndGuides?.primaryGuide || "Traditional Canon"
            });
          }
        }
      }
    });

    return {
      day,
      date: dateObj,
      details,
      fasts
    };
  });

  // Keep a default day highlighted or hovered initially (e.g. today or day 1)
  useEffect(() => {
    if (daysData.length > 0) {
      // Find today if in current month, else select day 1
      const today = new Date();
      let defaultDay = daysData[0];
      if (today.getFullYear() === year && today.getMonth() === month) {
        const matching = daysData.find(d => d.day === today.getDate());
        if (matching) defaultDay = matching;
      }
      setHoveredDay(defaultDay);
    }
  }, [month, year]);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous drawing
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    const width = 360;
    const height = 360;
    const center = width / 2;
    const innerRadius = 55;
    const outerRadius = 135;
    const labelRadius = outerRadius + 18;

    svgElement
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%");

    // Setup main container group
    const g = svgElement
      .append("g")
      .attr("transform", `translate(${center}, ${center})`);

    // Define color scales & gradients
    const defs = svgElement.append("defs");

    // Shukla Paksha (Waxing) Gradient - Bright gold/amber
    const shuklaGrad = defs
      .append("linearGradient")
      .attr("id", "shukla-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");
    shuklaGrad.append("stop").attr("offset", "0%").attr("stop-color", "#2c1e08");
    shuklaGrad.append("stop").attr("offset", "100%").attr("stop-color", "#f59e0b");

    // Krishna Paksha (Waning) Gradient - Midnight indigo
    const krishnaGrad = defs
      .append("linearGradient")
      .attr("id", "krishna-gradient")
      .attr("x1", "0%")
      .attr("y1", "100%")
      .attr("x2", "0%")
      .attr("y2", "0%");
    krishnaGrad.append("stop").attr("offset", "0%").attr("stop-color", "#0b0c14");
    krishnaGrad.append("stop").attr("offset", "100%").attr("stop-color", "#6366f1");

    // Active Selection Glow
    const glowFilter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-20%")
      .attr("y", "-20%")
      .attr("width", "140%")
      .attr("height", "140%");
    glowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "4")
      .attr("result", "blur");
    glowFilter
      .append("feComposite")
      .attr("in", "SourceGraphic")
      .attr("in2", "blur")
      .attr("operator", "over");

    // Angle scale mapping day to radians
    // Let's offset by -Math.PI / 2 to start Day 1 at the absolute top (12 o'clock)
    const angleScale = d3
      .scaleLinear()
      .domain([1, daysInMonth + 1])
      .range([-Math.PI / 2, 1.5 * Math.PI]);

    // Concentric guideline rings for illumination reference (25%, 50%, 75%, 100%)
    const ringRadii = [25, 50, 75, 100];
    ringRadii.forEach((pct) => {
      const radius = innerRadius + (pct / 100) * (outerRadius - innerRadius);
      g.append("circle")
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", "rgba(255, 255, 255, 0.05)")
        .attr("stroke-dasharray", pct === 100 ? "none" : "2,3")
        .attr("stroke-width", 1);
    });

    // Radial grids
    daysData.forEach((d) => {
      const angle = angleScale(d.day);
      const x1 = Math.cos(angle) * innerRadius;
      const y1 = Math.sin(angle) * innerRadius;
      const x2 = Math.cos(angle) * (outerRadius + 8);
      const y2 = Math.sin(angle) * (outerRadius + 8);

      g.append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "rgba(255, 255, 255, 0.03)")
        .attr("stroke-width", 0.5);
    });

    // Draw the main bars (donuts / wedges)
    const arcGenerator = d3
      .arc<any>()
      .innerRadius(innerRadius)
      .outerRadius((d) => {
        // Height of the bar corresponds to moon illumination
        const litVal = d.details.litPercent; // 0 to 100
        const scaleVal = litVal / 100;
        return innerRadius + scaleVal * (outerRadius - innerRadius);
      })
      .startAngle((d) => angleScale(d.day))
      .endAngle((d) => angleScale(d.day + 1))
      .padAngle(0.015)
      .padRadius(innerRadius);

    // Clickable full-slice overlay for interactions
    const hoverArcGenerator = d3
      .arc<any>()
      .innerRadius(innerRadius - 5)
      .outerRadius(outerRadius + 8)
      .startAngle((d) => angleScale(d.day))
      .endAngle((d) => angleScale(d.day + 1))
      .padAngle(0.01)
      .padRadius(innerRadius);

    // Draw visual bars
    const barGroup = g.append("g").attr("class", "bars");

    barGroup
      .selectAll("path")
      .data(daysData)
      .enter()
      .append("path")
      .attr("d", arcGenerator)
      .attr("fill", (d) => {
        const isShukla = d.details.paksha.includes("Shukla");
        return isShukla ? "url(#shukla-gradient)" : "url(#krishna-gradient)";
      })
      .attr("opacity", (d) => {
        // Highlight days matching search query or with fasts
        if (fastFinderQuery) {
          const matchQuery = d.fasts.some(f => f.name.toLowerCase().includes(fastFinderQuery.toLowerCase())) ||
            d.details.tithiName.toLowerCase().includes(fastFinderQuery.toLowerCase());
          return matchQuery ? 1.0 : 0.25;
        }
        return 0.75;
      })
      .attr("class", d => `bar-day-${d.day}`)
      .style("transition", "all 0.2s ease-in-out");

    // Draw visual indicators for fasting alignments on the outer rim
    const indicatorGroup = g.append("g").attr("class", "indicators");

    daysData.forEach((d) => {
      if (d.fasts.length > 0) {
        const angle = angleScale(d.day + 0.5); // centered on the slice
        const indicatorRadius = outerRadius + 6;
        const x = Math.cos(angle) * indicatorRadius;
        const y = Math.sin(angle) * indicatorRadius;

        // Is there a primary fasting type?
        const isVigil = d.fasts.some(f => f.type === "vigil");
        const isRemembrance = d.fasts.some(f => f.type === "remembrance");
        
        const color = isVigil ? "#a78bfa" : isRemembrance ? "#818cf8" : "#fbbf24";

        // Draw small glowing star/circle
        indicatorGroup
          .append("circle")
          .attr("cx", x)
          .attr("cy", y)
          .attr("r", 3.5)
          .attr("fill", color)
          .attr("stroke", "#0f0f14")
          .attr("stroke-width", 1)
          .style("filter", "drop-shadow(0 0 3px " + color + ")")
          .style("pointer-events", "none");
      }
    });

    // Draw Day Labels around the outer rim
    const labelGroup = g.append("g").attr("class", "labels");

    daysData.forEach((d) => {
      const angle = angleScale(d.day + 0.5); // center in slice
      const x = Math.cos(angle) * labelRadius;
      const y = Math.sin(angle) * labelRadius;

      // Make text upright and readable depending on position
      const isTopHalf = y < 0;
      const isLeftHalf = x < 0;

      labelGroup
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", d.day === selectedDayNum ? "#fbbf24" : "rgba(255,255,255,0.45)")
        .attr("font-size", d.day === selectedDayNum ? "10px" : "8px")
        .attr("font-weight", d.day === selectedDayNum ? "bold" : "normal")
        .attr("font-family", "JetBrains Mono, monospace")
        .text(d.day)
        .style("pointer-events", "none");
    });

    // Draw Interactive overlays for rich mouse tracking
    const overlayGroup = g.append("g").attr("class", "overlays");

    overlayGroup
      .selectAll("path")
      .data(daysData)
      .enter()
      .append("path")
      .attr("d", hoverArcGenerator)
      .attr("fill", "transparent")
      .attr("class", "cursor-pointer")
      .on("mouseenter", (event, d) => {
        setHoveredDay(d);
        // Dim others, highlight active bar
        g.selectAll(".bars path").attr("opacity", 0.35);
        g.select(`.bar-day-${d.day}`).attr("opacity", 1.0).style("filter", "url(#glow)");
      })
      .on("mouseleave", (event, d) => {
        // Reset opacities
        g.selectAll(".bars path")
          .attr("opacity", (b: any) => {
            if (fastFinderQuery) {
              const matchQuery = b.fasts.some((f: any) => f.name.toLowerCase().includes(fastFinderQuery.toLowerCase())) ||
                b.details.tithiName.toLowerCase().includes(fastFinderQuery.toLowerCase());
              return matchQuery ? 1.0 : 0.25;
            }
            return 0.75;
          })
          .style("filter", "none");
      })
      .on("click", (event, d) => {
        setSelectedDayNum(d.day);
        if (onSelectDay) {
          onSelectDay(d.day);
        }
      });

    // Draw the center static circle (represents the Moon itself)
    const centerMoon = g.append("g").attr("class", "center-moon");
    centerMoon
      .append("circle")
      .attr("r", innerRadius - 8)
      .attr("fill", "#050608")
      .attr("stroke", "rgba(255,255,255,0.15)")
      .attr("stroke-width", 1);

  }, [month, year, daysInMonth, fastFinderQuery, selectedDayNum]);

  // Helper to render realistic dynamic SVG Moon Phase based on illumination & Paksha
  const renderInteractiveMoonPhase = (pct: number, paksha: string) => {
    // We will draw a stylish 36px moon phase with CSS/SVG
    const isShukla = paksha.includes("Shukla");
    const r = 18;
    
    // Calculate 3D lunar crescent curve
    // If waxing (Shukla): lit grows from right to left
    // If waning (Krishna): dark grows from right to left
    let sweep = 0;
    let d = "";

    if (pct === 0) {
      // New Moon
      return <circle cx="18" cy="18" r="17" className="fill-slate-900 stroke-white/10" strokeWidth="1" />;
    } else if (pct === 100) {
      // Full Moon
      return <circle cx="18" cy="18" r="17" className="fill-amber-400/95 stroke-amber-500/30" strokeWidth="1" style={{ filter: "drop-shadow(0 0 6px rgba(245,158,11,0.4))" }} />;
    }

    const litFraction = pct / 100;

    // Standard high-fidelity crescent paths
    if (isShukla) {
      // Waxing crescent/gibbous
      if (litFraction < 0.5) {
        // Crescent - lit on the right
        const rx = r * (1 - 2 * litFraction);
        d = `M ${r} 0 A ${r} ${r} 0 0 1 ${r} ${2*r} A ${rx} ${r} 0 0 0 ${r} 0`;
      } else {
        // Gibbous - lit on the right, bowing out on the left
        const rx = r * (2 * litFraction - 1);
        d = `M ${r} 0 A ${r} ${r} 0 0 1 ${r} ${2*r} A ${rx} ${r} 0 0 1 ${r} 0`;
      }
    } else {
      // Waning crescent/gibbous - lit on the left
      if (litFraction > 0.5) {
        // Waning Gibbous - bowing out on the right
        const rx = r * (2 * (1 - litFraction) - 1);
        const rxAbs = Math.abs(rx);
        d = `M ${r} 0 A ${rxAbs} ${r} 0 0 1 ${r} ${2*r} A ${r} ${r} 0 0 1 ${r} 0`;
      } else {
        // Waning Crescent
        const rx = r * (1 - 2 * (1 - litFraction));
        const rxAbs = Math.abs(rx);
        d = `M ${r} 0 A ${rxAbs} ${r} 0 0 0 ${r} ${2*r} A ${r} ${r} 0 0 1 ${r} 0`;
      }
    }

    return (
      <svg width="36" height="36" viewBox="0 0 36 36" className="inline-block select-none pointer-events-none">
        {/* Dark background circle */}
        <circle cx="18" cy="18" r="17" className="fill-slate-950 stroke-white/5" strokeWidth="1" />
        {/* Illuminated portion */}
        <path d={d} className="fill-amber-400" style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.35))" }} />
      </svg>
    );
  };

  return (
    <div className="p-5 rounded-3xl bg-black/40 border border-white/5 space-y-5 relative">
      <div className="absolute top-3 right-4 flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[9px] font-mono font-bold text-amber-300 uppercase tracking-widest">D3 Radial Alignment System</span>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Radial SVG Column */}
        <div className="w-full sm:w-80 md:w-88 lg:w-96 shrink-0 aspect-square flex items-center justify-center relative bg-[#090a0d] rounded-2xl border border-white/[0.03] p-2 shadow-inner">
          <svg ref={svgRef} className="w-full h-full" />
          
          {/* Inner circle focal content (displays current hovered/selected day) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hoveredDay ? (
              <div className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-center space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">Day</span>
                <span className="text-xl font-bold font-mono text-white leading-none">{hoveredDay.day}</span>
                <span className="text-[9px] font-mono text-amber-400 font-semibold leading-none truncate max-w-[85px]">
                  {hoveredDay.details.tithiName.split(" ")[0]}
                </span>
                <span className="text-[8px] font-mono text-slate-450 leading-none">
                  {hoveredDay.details.litPercent}% Lit
                </span>
              </div>
            ) : (
              <div className="text-[10px] font-mono text-slate-500">Hover Day</div>
            )}
          </div>
        </div>

        {/* Selected Alignment Info Card Column */}
        <div className="flex-1 w-full space-y-4">
          {hoveredDay ? (
            <div className="p-5 rounded-2xl bg-[#090a0f] border border-white/10 space-y-4 relative overflow-hidden shadow-lg group">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/40 via-indigo-500/20 to-transparent" />

              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">ASTRONOMICAL ALIGNMENT</span>
                  <h4 className="text-sm sm:text-base font-serif text-white font-bold flex items-center gap-2">
                    <span>
                      {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][hoveredDay.date.getDay()]}, {hoveredDay.day} {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month]}
                    </span>
                  </h4>
                </div>
                {renderInteractiveMoonPhase(hoveredDay.details.litPercent, hoveredDay.details.paksha)}
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/45 border border-white/5">
                  <span className="text-[9px] text-slate-500 block">Tithi Index</span>
                  <span className="text-amber-400 font-bold block mt-0.5">Tithi {hoveredDay.details.tithiIndex} / 30</span>
                </div>
                <div className="p-3 rounded-xl bg-black/45 border border-white/5">
                  <span className="text-[9px] text-slate-500 block">Calculated Tithi</span>
                  <span className="text-slate-200 font-semibold block truncate mt-0.5">{hoveredDay.details.tithiName}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/45 border border-white/5 col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-slate-500 block">Lunar Phase</span>
                  <span className="text-slate-300 font-medium block truncate mt-0.5">{hoveredDay.details.name}</span>
                </div>
              </div>

              {/* Tithi Timeline & Paksha progression */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>Krishna Void (Amavasya)</span>
                  <span className="text-amber-400 font-bold">Purnima (Full)</span>
                  <span>Krishna Void</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden relative border border-white/5">
                  {/* Highlight current position in timeline */}
                  <div 
                    className="absolute h-full bg-amber-500 rounded-full"
                    style={{ left: `${(hoveredDay.details.tithiIndex - 1) / 30 * 100}%`, width: '8px', transform: 'translateX(-4px)' }}
                  />
                  {/* Fill color based on Shukla/Krishna */}
                  <div 
                    className={`h-full opacity-25 ${hoveredDay.details.paksha.includes("Shukla") ? 'bg-amber-400' : 'bg-indigo-500'}`}
                    style={{ width: `${hoveredDay.details.tithiIndex / 30 * 100}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-450 font-serif leading-none italic flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Currently traversing <strong>{hoveredDay.details.paksha}</strong>. Illumination is {hoveredDay.details.litPercent}% with a synodic synodic age of {hoveredDay.details.age.toFixed(2)} days.</span>
                </div>
              </div>

              {/* Fasts/Occurrences Active on this Day */}
              <div className="space-y-2 border-t border-white/5 pt-3">
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">SAINTLY FASTS & VRATS OBSERVED:</span>
                {hoveredDay.fasts.length > 0 ? (
                  <div className="space-y-2">
                    {hoveredDay.fasts.map((f, i) => (
                      <div 
                        key={i} 
                        className="p-3 rounded-xl bg-amber-500/[0.02] border border-amber-500/20 flex items-center justify-between gap-3 group/item hover:bg-amber-500/[0.04] transition-all cursor-pointer"
                        onClick={() => {
                          if (onSelectDay) onSelectDay(hoveredDay.day);
                        }}
                      >
                        <div className="space-y-0.5">
                          <h5 className="text-xs font-serif font-bold text-amber-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>{f.name}</span>
                          </h5>
                          <p className="text-[10px] font-mono text-slate-450">Authority: {f.source}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-400 group-hover/item:text-amber-400 text-[10px] font-mono transition-colors">
                          <span>Focus Day</span>
                          <ArrowRight className="w-3 h-3 group-hover/item:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center rounded-xl bg-white/[0.01] border border-white/5 text-xs text-slate-500 italic font-serif">
                    No principal solar-lunar fasting coordinates active on this day. Excellent day for standard nourishment, scripture study, and quiet meditation.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 rounded-2xl bg-[#090a0f] border border-white/5 text-slate-500 font-serif text-sm italic">
              Hover over any slice of the lunar clock to view daily Tithi coordinates, moon phases, and fast events.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
