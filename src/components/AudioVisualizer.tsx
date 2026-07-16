import React, { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioElement: HTMLAudioElement | null;
  isSpeaking: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  audioElement,
  isSpeaking,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const numBars = 18;
  const barHeightsRef = useRef<number[]>([]);
  
  if (barHeightsRef.current.length === 0) {
    barHeightsRef.current = new Array(numBars).fill(4);
  }

  // Initialize Web Audio context safely on demand
  useEffect(() => {
    if (!audioElement) {
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch (e) {}
        sourceRef.current = null;
      }
      return;
    }

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;

      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (!analyserRef.current) {
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.75;
        analyserRef.current = analyser;
      }
      const analyser = analyserRef.current;

      // Disconnect former source node first
      if (sourceRef.current) {
        try {
          sourceRef.current.disconnect();
        } catch (e) {}
      }

      const source = ctx.createMediaElementSource(audioElement);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      sourceRef.current = source;
    } catch (err) {
      console.warn("Audio Visualizer API integration bypassed, resorting to high-fidelity animation simulator.", err);
    }
  }, [audioElement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      width = canvas.width;
      height = canvas.height;
    };
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);

    const barHeights = barHeightsRef.current;

    const render = () => {
      animationRef.current = requestAnimationFrame(render);
      ctx.clearRect(0, 0, width, height);

      const t = performance.now() / 1000;
      const dataArray = new Uint8Array(numBars);
      let hasRealData = false;

      if (isSpeaking && analyserRef.current && audioElement) {
        const tempArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(tempArray);
        
        for (let i = 0; i < numBars; i++) {
          const index = Math.floor(1 + i * 1.3);
          dataArray[i] = tempArray[index] || 0;
        }
        hasRealData = dataArray.some((val) => val > 0);
      }

      for (let i = 0; i < numBars; i++) {
        let targetHeight = 4;

        if (isSpeaking) {
          if (hasRealData) {
            const scale = (dataArray[i] / 255) * (height * 0.9);
            targetHeight = Math.max(4, scale);
          } else {
            // High-fidelity speech parametric simulator for SpeechSynthesisUtterance flow:
            // 1. Slow phrase/word cadence envelope (creates verbal rhythm)
            const wordModulator = Math.max(0, Math.sin(t * 1.8) * 0.75 + Math.sin(t * 0.6) * 0.25);
            
            // 2. Faster syllable phoneme envelope (rhythmic dental flows)
            const syllableModulator = Math.max(0, Math.sin(t * 11) * 0.6 + Math.cos(t * 22) * 0.4);
            
            // Combine both word grouping and syllable cadence 
            let vocalPower = wordModulator * syllableModulator;
            
            // Periodic statement gaps or micro-pauses for speaking flow
            const phraseSilence = Math.sin(t * 0.35) > -0.6;
            if (!phraseSilence) {
              vocalPower = 0.0;
            }

            // 3. Formant resonant centers (vowel spectral shapes warping around middle frequencies)
            const formantPeak1 = (numBars / 2) + Math.sin(t * 2.8) * (numBars * 0.28);
            const distToPeak1 = Math.abs(i - formantPeak1);
            const formantFactor1 = Math.exp(-Math.pow(distToPeak1 / 2.2, 2));

            const formantPeak2 = (numBars / 2) + Math.cos(t * 4.6) * (numBars * 0.35);
            const distToPeak2 = Math.abs(i - formantPeak2);
            const formantFactor2 = Math.exp(-Math.pow(distToPeak2 / 1.6, 2)) * 0.45;

            // Combine formants
            const resonance = 0.15 + (formantFactor1 * 0.6) + (formantFactor2 * 0.25);

            // 4. Micro-consonant fricative sibilance noise
            const jitterNoise = Math.sin(t * (70 + i * 25)) * 0.18 + (Math.random() - 0.5) * 0.15;
            
            const finalBarEnergy = Math.max(0, vocalPower * (resonance + jitterNoise * 0.18));
            const baseFluct = Math.abs(Math.sin(t * 4.0 + i * 0.4)) * 0.08;

            const finalScale = (finalBarEnergy + baseFluct) * (height * 0.85);
            targetHeight = Math.max(4, 4 + finalScale);
          }
        } else {
          // Zen breathing state when silent
          // Serene slow respiratory rise and fall wave that sweeps across the bars organically
          const breathCycle = Math.sin(t * 1.5 + i * 0.25);
          const breathe = Math.max(0, breathCycle) * (height * 0.25);
          targetHeight = 4 + breathe;
        }

        const easeFactor = isSpeaking ? 0.32 : 0.08;
        barHeights[i] += (targetHeight - barHeights[i]) * easeFactor;
      }

      const barPadding = 3.5 * window.devicePixelRatio;
      const totalWidth = width;
      const availableWidth = totalWidth - (numBars - 1) * barPadding;
      const barRawWidth = availableWidth / numBars;
      const barWidth = Math.max(3 * window.devicePixelRatio, barRawWidth);

      const drawnTotalWidth = numBars * barWidth + (numBars - 1) * barPadding;
      const startX = (totalWidth - drawnTotalWidth) / 2;

      for (let i = 0; i < numBars; i++) {
        const barHeight = barHeights[i];
        const x = startX + i * (barWidth + barPadding);
        const y = height - barHeight;

        ctx.beginPath();
        const grad = ctx.createLinearGradient(x, height, x, y);
        grad.addColorStop(0, "rgba(16, 185, 129, 0.08)");
        grad.addColorStop(0.35, "rgba(16, 185, 129, 0.85)");
        grad.addColorStop(1, "rgba(245, 158, 11, 0.9)");

        ctx.fillStyle = grad;
        const radius = Math.min(barWidth / 2, barHeight / 2, 4 * window.devicePixelRatio);

        if (ctx.roundRect) {
          ctx.roundRect(x, y, barWidth, barHeight, radius);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();

        if (isSpeaking && barHeight > 10) {
          ctx.beginPath();
          ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
          ctx.arc(x + barWidth / 2, y + radius, radius * 0.45, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpeaking, audioElement]);

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full block rounded-lg overflow-hidden cursor-pointer"
        title="Auditory Waveform Sanctuary Visualizer"
      />
    </div>
  );
};
