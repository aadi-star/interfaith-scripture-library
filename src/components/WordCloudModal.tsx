import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { 
  X, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  Volume2, 
  Search,
  Scale,
  Brain,
  Hash,
  Share2,
  Bookmark
} from "lucide-react";
import { RELIGION_LABELS, RELIGION_COLORS } from "../scripturesRegistry";

interface RelatedTerm {
  text: string;
  weight: number;
  category: string;
}

interface ScriptureOccurrence {
  religion: string;
  book: string;
  chapter: string;
  verse: string;
  text: string;
  explanation: string;
}

interface ReligionDistribution {
  religion: string;
  count: number;
}

interface WordCloudData {
  term: string;
  globalFrequency: number;
  distribution: ReligionDistribution[];
  relatedTerms: RelatedTerm[];
  scriptureOccurrences: ScriptureOccurrence[];
}

interface WordCloudModalProps {
  term: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectPassage?: (religion: string, bookKey: string, chapter: number) => void;
  highThinking?: boolean;
}

export function WordCloudModal({ term, isOpen, onClose, onSelectPassage, highThinking = false }: WordCloudModalProps) {
  const [currentTerm, setCurrentTerm] = useState<string>(term);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WordCloudData | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Synchronize internal state with props term when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentTerm(term);
      setHistory([]);
      fetchTermData(term);
    }
  }, [term, isOpen]);

  const fetchTermData = async (word: string) => {
    if (!word) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/scriptures/word-cloud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: word, highThinking })
      });
      if (!res.ok) {
        throw new Error(`Failed to load word frequency analysis (${res.status})`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while running semantic frequency analyzer.");
    } finally {
      setLoading(false);
    }
  };

  const handleWordClick = (newWord: string) => {
    if (newWord.toLowerCase() === currentTerm.toLowerCase()) return;
    setHistory(prev => [...prev, currentTerm]);
    setCurrentTerm(newWord);
    fetchTermData(newWord);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(prevHistory => prevHistory.slice(0, -1));
    setCurrentTerm(prev);
    fetchTermData(prev);
  };

  // D3 force simulation for the Word Cloud
  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) return;

    // Clear previous SVG contents
    const svgElement = d3.select(svgRef.current);
    svgElement.selectAll("*").remove();

    const rect = containerRef.current.getBoundingClientRect();
    const width = Math.max(300, rect.width || 450);
    const height = 300;

    svgElement
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    interface WordNode extends d3.SimulationNodeDatum {
      text: string;
      weight: number;
      category: string;
      radius: number;
      x?: number;
      y?: number;
    }

    // Map data to nodes
    const nodes: WordNode[] = data.relatedTerms.map(t => ({
      text: t.text,
      weight: t.weight,
      category: t.category,
      x: width / 2 + (Math.random() - 0.5) * 80,
      y: height / 2 + (Math.random() - 0.5) * 80,
      radius: 0
    }));

    // Size scale
    const minWeight = (d3.min(nodes, (d: WordNode) => d.weight) as number) || 10;
    const maxWeight = (d3.max(nodes, (d: WordNode) => d.weight) as number) || 100;
    const fontSizeScale = d3.scaleLinear()
      .domain([minWeight, maxWeight])
      .range([11, 26]);

    // Compute radii for collision based on text length and size
    nodes.forEach(node => {
      const fontSize = fontSizeScale(node.weight);
      // Rough estimation of text bounding box for collision detection
      node.radius = (node.text.length * (fontSize * 0.45)) / 2 + 10;
    });

    // Color categories based on RELIGION_COLORS or fallback
    const getCategoryColor = (category: string) => {
      const catLower = category.toLowerCase();
      if (catLower.includes("hindu")) return "#f59e0b"; // amber-500
      if (catLower.includes("islam") || catLower.includes("muslim")) return "#10b981"; // emerald-500
      if (catLower.includes("christian")) return "#6366f1"; // indigo-500
      if (catLower.includes("juda") || catLower.includes("hebrew")) return "#3b82f6"; // blue-500
      if (catLower.includes("buddh")) return "#f43f5e"; // rose-500
      if (catLower.includes("jain")) return "#f97316"; // orange-500
      if (catLower.includes("myth") || catLower.includes("lore")) return "#8b5cf6"; // violet-500
      return "#94a3b8"; // slate-400 fallback
    };

    // Simulation setup
    const simulation = d3.forceSimulation<any>(nodes)
      .force("cx", d3.forceX(width / 2).strength(0.12))
      .force("cy", d3.forceY(height / 2).strength(0.12))
      .force("charge", d3.forceManyBody().strength(-20))
      .force("collide", d3.forceCollide<any>().radius((d: any) => d.radius).iterations(2))
      .alphaDecay(0.04);

    // Create container group
    const g = svgElement.append("g");

    // Add elements
    const textNodes = g.selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "cursor-pointer group")
      .on("click", (event, d: any) => {
        handleWordClick(d.text);
      });

    // Add subtle background bubble/pill shape for hover enhancement
    textNodes.append("rect")
      .attr("rx", 14)
      .attr("ry", 14)
      .attr("fill", (d: any) => getCategoryColor(d.category))
      .attr("opacity", 0.04)
      .attr("stroke", (d: any) => getCategoryColor(d.category))
      .attr("stroke-width", 1)
      .attr("stroke-opacity", 0.1)
      .attr("class", "transition-all duration-200 group-hover:fill-opacity-15 group-hover:stroke-opacity-40");

    // Add actual text
    textNodes.append("text")
      .text((d: any) => d.text)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-family", "system-ui, -apple-system, sans-serif")
      .attr("font-weight", (d: any) => d.text.toLowerCase() === currentTerm.toLowerCase() ? "bold" : "500")
      .attr("font-size", (d: any) => `${fontSizeScale(d.weight)}px`)
      .attr("fill", (d: any) => d.text.toLowerCase() === currentTerm.toLowerCase() ? "#fbbf24" : getCategoryColor(d.category))
      .attr("class", "transition-colors duration-150 select-none group-hover:brightness-125")
      .style("text-shadow", "0 1px 2px rgba(0,0,0,0.6)");

    // Adjust rect size on tick once texts are in DOM
    textNodes.each(function(d: any) {
      const gNode = d3.select(this);
      const textNode = gNode.select("text").node() as SVGTextElement;
      if (textNode) {
        const bbox = textNode.getBBox();
        const paddingX = 14;
        const paddingY = 8;
        gNode.select("rect")
          .attr("x", bbox.x - paddingX / 2)
          .attr("y", bbox.y - paddingY / 2)
          .attr("width", bbox.width + paddingX)
          .attr("height", bbox.height + paddingY);
      }
    });

    // Drag behavior
    const drag = d3.drag<any, any>()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

    textNodes.call(drag as any);

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.2).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Tick update
    simulation.on("tick", () => {
      textNodes.attr("transform", d => {
        // Constrain to canvas boundaries
        const r = d.radius || 20;
        d.x = Math.max(r, Math.min(width - r, d.x));
        d.y = Math.max(r, Math.min(height - r, d.y));
        return `translate(${d.x}, ${d.y})`;
      });
    });

    return () => {
      simulation.stop();
    };
  }, [data, currentTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0b0b0f] border border-white/10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[90vh] md:h-[80vh] transition-all duration-300">
        
        {/* Header bar */}
        <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white text-base font-bold flex items-center gap-2">
                <span>Theological Term Frequency Index</span>
                {highThinking && (
                  <span className="text-[9px] bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-normal uppercase">
                    Deep Reasoning Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400">
                Visualizing lexical mapping and parallels across sacred global canons
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={handleBack}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-lg text-xs font-mono transition-colors cursor-pointer"
              >
                &larr; Back
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition-colors border border-white/5 cursor-pointer"
              aria-label="Close analytics"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-20 space-y-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-amber-500/10" />
                <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                <Brain className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-slate-300 font-mono text-xs">
                  Analyzing database for &ldquo;{currentTerm}&rdquo;...
                </p>
                <p className="text-[10px] text-slate-500 italic max-w-sm">
                  Performing deep scholarly indexing across Hinduism, Buddhism, Islam, Christianity, Judaism, and mythology texts.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-md mx-auto">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">
                <X className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-white font-bold text-sm">Failed to Analyze Term</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
              </div>
              <button
                onClick={() => fetchTermData(currentTerm)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Retry Analysis
              </button>
            </div>
          ) : data ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive Cloud Canvas & Basic info */}
              <div className="lg:col-span-7 bg-[#121217] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
                <div className="p-4 bg-white/[0.01] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-amber-400" />
                    <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Dynamic Connection Map: &ldquo;{data.term}&rdquo;
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 italic">
                    Drag terms to rearrange, click to explore
                  </span>
                </div>

                <div ref={containerRef} className="relative w-full h-[300px] bg-[#07070a]/90 flex items-center justify-center overflow-hidden">
                  <svg ref={svgRef} className="w-full h-full" />
                </div>

                {/* Legend and stats */}
                <div className="p-4 bg-white/[0.02] border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">
                      Calculated Corpus Frequency
                    </span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl font-serif font-bold text-white tracking-tight">
                        {data.globalFrequency.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Occurrences Globally</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="block text-[10px] font-mono uppercase text-slate-400 tracking-wider font-bold">
                      Legend / Faith Contexts
                    </span>
                    <div className="flex flex-wrap gap-2 text-[9px] font-mono font-bold">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Hinduism</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> Islam</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#6366f1]" /> Christianity</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Judaism</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f43f5e]" /> Buddhism</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Comparative occurrence analysis and scriptural citations */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Distribution Breakdown panel */}
                <div className="bg-[#121217] border border-white/5 rounded-2xl p-4 space-y-3">
                  <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-amber-400" />
                    Cross-Tradition Quantitative Distribution
                  </h4>
                  <div className="space-y-2 pt-1">
                    {data.distribution.map((dist, idx) => {
                      const maxVal = Math.max(...data.distribution.map(d => d.count)) || 1;
                      const percentage = (dist.count / maxVal) * 100;
                      const faithKey = dist.religion.toLowerCase();
                      
                      // Match colors
                      let barColor = "bg-slate-500";
                      let txtColor = "text-slate-400";
                      if (faithKey.includes("hindu")) { barColor = "bg-amber-500"; txtColor = "text-amber-400"; }
                      else if (faithKey.includes("islam")) { barColor = "bg-emerald-500"; txtColor = "text-emerald-400"; }
                      else if (faithKey.includes("christian")) { barColor = "bg-indigo-500"; txtColor = "text-indigo-400"; }
                      else if (faithKey.includes("juda")) { barColor = "bg-blue-500"; txtColor = "text-blue-400"; }
                      else if (faithKey.includes("buddh")) { barColor = "bg-rose-500"; txtColor = "text-rose-400"; }
                      else if (faithKey.includes("jain")) { barColor = "bg-orange-500"; txtColor = "text-orange-400"; }
                      else if (faithKey.includes("myth")) { barColor = "bg-violet-500"; txtColor = "text-violet-400"; }

                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span className="text-slate-300 font-sans font-medium">{dist.religion}</span>
                            <span className={`font-bold ${txtColor}`}>{dist.count} mentions</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${barColor} rounded-full`} 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Specific Scripture occurrences / Citations */}
                <div className="space-y-3">
                  <h4 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    Comparative Citations Across Traditions
                  </h4>

                  <div className="space-y-3 max-h-[360px] overflow-y-auto custom-scrollbar pr-1">
                    {data.scriptureOccurrences.map((occ, index) => {
                      const religionColors = RELIGION_COLORS[occ.religion.toLowerCase()] || {
                        bg: "bg-slate-900/40",
                        text: "text-slate-300",
                        border: "border-slate-800",
                        accent: "bg-slate-600 hover:bg-slate-700 text-white"
                      };

                      return (
                        <div 
                          key={index} 
                          className="p-3.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl space-y-2 transition-all group"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5">
                              <span className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${religionColors.bg} ${religionColors.text} ${religionColors.border}`}>
                                {occ.religion}
                              </span>
                              <span className="text-xs text-white font-mono font-bold group-hover:text-amber-400 transition-colors">
                                {occ.book} {occ.chapter}:{occ.verse}
                              </span>
                            </div>
                            {onSelectPassage && (
                              <button
                                onClick={() => {
                                  // Attempt to translate book name to key
                                  const bk = occ.book.toLowerCase().replace(/\s+/g, "_");
                                  onSelectPassage(occ.religion, bk, Number(occ.chapter));
                                  onClose();
                                }}
                                className="flex items-center space-x-0.5 text-[10px] font-mono text-slate-400 group-hover:text-amber-400 hover:underline transition-colors bg-transparent border-0 cursor-pointer"
                              >
                                <span>Go to text</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs font-serif italic text-slate-200 leading-relaxed font-semibold pl-2 border-l-2 border-white/10 group-hover:border-amber-500/40 transition-colors">
                            &ldquo;{occ.text}&rdquo;
                          </p>
                          <div className="bg-[#0b0b0f] border border-white/[0.03] p-2 rounded-lg flex items-start space-x-2">
                            <Brain className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400 leading-normal">
                              <strong className="font-mono uppercase text-indigo-300 tracking-wide text-[9px] block">Theological Synthesis</strong>
                              {occ.explanation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="h-full flex items-center justify-center py-20 text-slate-500 italic text-xs font-mono">
              Please click a scripture word to initiate comparative mapping.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-3.5 bg-white/[0.01] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-slate-500 gap-2">
          <span>Comparative Theology Semantic Tool • Powered by Gemini AI</span>
          <span>Click any word inside the word cloud to perform deep-link lookup</span>
        </div>

      </div>
    </div>
  );
}
