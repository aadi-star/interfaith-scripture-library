/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Flame,
  Sun,
  Moon,
  Compass,
  BookOpen,
  Scroll,
  Infinity,
  Atom,
  Shield,
  Scale,
  Heart,
  Sparkles,
  Music,
  BookMarked
} from "lucide-react";
import { ReligionType } from "../types";

interface ReligiousIconProps {
  bookKey: string;
  religion: ReligionType;
  className?: string;
}

export const ReligiousIcon: React.FC<ReligiousIconProps> = ({
  bookKey,
  religion,
  className = "w-5 h-5"
}) => {
  const lowerKey = (bookKey || "").toLowerCase();
  const lowerRel = (religion || "").toLowerCase();

  // 1. Direct Book-Key Specific Mappings for specialized iconography
  if (lowerKey === "bhagavad_gita" || lowerKey === "ramayana" || lowerKey === "saura_purana") {
    return <Sun className={`${className} text-amber-400`} />;
  }
  if (lowerKey.includes("samaveda")) {
    return <Music className={`${className} text-sky-400`} />;
  }
  if (lowerKey === "agni_purana" || lowerKey === "shiva_purana" || lowerKey.includes("rigveda") || lowerKey.includes("yajurveda")) {
    return <Flame className={`${className} text-orange-500`} />;
  }
  if (lowerKey.includes("quran") || lowerKey.includes("hadith") || lowerKey.includes("islam")) {
    return <Moon className={`${className} text-emerald-400 fill-emerald-400/10`} />;
  }
  if (lowerKey.includes("bible") || lowerKey.includes("gospel") || lowerKey.includes("christian")) {
    return <BookOpen className={`${className} text-sky-400`} />;
  }
  if (lowerKey === "torah" || lowerKey === "talmud" || lowerKey.includes("jewish")) {
    return <Scroll className={`${className} text-amber-500`} />;
  }
  if (
    lowerKey === "dhammapada" ||
    lowerKey.includes("sutra") ||
    lowerKey.includes("pitaka") ||
    lowerKey.includes("buddhist") ||
    lowerKey === "lalitavistara" ||
    lowerKey === "journey_west"
  ) {
    return <Compass className={`${className} text-rose-400 animate-spin-slow`} />;
  }
  if (lowerKey.includes("jain") || lowerKey === "tattvartha_sutra") {
    return <Heart className={`${className} text-pink-400 fill-pink-400/10`} />;
  }
  if (lowerKey === "somnium") {
    return <Atom className={`${className} text-purple-400`} />;
  }
  if (lowerKey === "analects" || lowerKey.includes("dharmashastra")) {
    return <Scale className={`${className} text-teal-400`} />;
  }
  if (lowerKey === "tao_te_ching") {
    return <Compass className={`${className} text-teal-300`} />;
  }
  if (lowerKey.includes("guru_granth") || lowerKey.includes("dasam_granth") || lowerKey.includes("sikh")) {
    return <Infinity className={`${className} text-amber-500`} />;
  }
  if (lowerKey.includes("prayers")) {
    return <Sparkles className={`${className} text-amber-300`} />;
  }

  // 2. Religion Category Mappings for general books under a tradition
  switch (lowerRel) {
    case "hinduism":
      return <Flame className={`${className} text-orange-500`} />;
    case "islam":
      return <Moon className={`${className} text-emerald-400 fill-emerald-400/10`} />;
    case "christianity":
      return <BookOpen className={`${className} text-sky-400`} />;
    case "judaism":
      return <Scroll className={`${className} text-amber-500`} />;
    case "buddhism":
      return <Compass className={`${className} text-rose-400`} />;
    case "jainism":
      return <Heart className={`${className} text-pink-400 fill-pink-400/10`} />;
    case "mythology":
      return <Sparkles className={`${className} text-violet-400 animate-pulse`} />;
    case "history":
      return <Shield className={`${className} text-slate-400`} />;
    case "space":
      return <Atom className={`${className} text-purple-400`} />;
    case "prayers":
      return <Sparkles className={`${className} text-amber-300`} />;
    default:
      return <BookOpen className={`${className} text-amber-500/80`} />;
  }
};
