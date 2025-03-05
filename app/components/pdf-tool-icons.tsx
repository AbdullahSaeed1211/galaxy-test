import React from "react";
import { 
  FileText, 
  Combine, 
  FileDown, 
  FileUp, 
  Lock, 
  Brain, 
  FileImage, 
  Scissors, 
  RotateCw, 
  Crop, 
  Stamp, 
  Type, 
  Highlighter, 
  EyeOff, 
  PenTool, 
  Share2, 
  Languages, 
  BarChart, 
  FileSearch, 
  FileQuestion, 
  FileSpreadsheet, 
  FilePieChart, 
  Presentation, 
  FileCode, 
  Image
} from "lucide-react";

// Map of color names to their Tailwind classes
const colorMap: Record<string, string> = {
  "red": "text-red-500",
  "blue": "text-blue-500",
  "green": "text-green-500",
  "purple": "text-purple-500",
  "yellow": "text-yellow-500",
  "indigo": "text-indigo-500",
  "pink": "text-pink-500",
  "orange": "text-orange-500",
  "cyan": "text-cyan-500",
  "emerald": "text-emerald-500",
  "violet": "text-violet-500",
  "slate": "text-slate-500",
  "amber": "text-amber-500",
  "rose": "text-rose-600",
  "teal": "text-teal-500",
  "sky": "text-sky-500",
};

// Base icon wrapper to ensure consistent styling
export const IconWrapper = ({ children, color }: { children: React.ReactNode, color: keyof typeof colorMap }) => (
  <div className={`w-10 h-10 flex items-center justify-center rounded-md ${colorMap[color]}`}>
    {children}
  </div>
);

export const PdfIcon = () => (
  <IconWrapper color="red">
    <FileText size={24} strokeWidth={2} />
  </IconWrapper>
);

export const MergeIcon = () => (
  <IconWrapper color="blue">
    <Combine size={24} strokeWidth={2} />
  </IconWrapper>
);

export const CompressIcon = () => (
  <IconWrapper color="green">
    <FileDown size={24} strokeWidth={2} />
  </IconWrapper>
);

export const ConvertIcon = () => (
  <IconWrapper color="purple">
    <FileUp size={24} strokeWidth={2} />
  </IconWrapper>
);

export const SecurityIcon = () => (
  <IconWrapper color="yellow">
    <Lock size={24} strokeWidth={2} />
  </IconWrapper>
);

export const AiIcon = () => (
  <IconWrapper color="indigo">
    <Brain size={24} strokeWidth={2} />
  </IconWrapper>
);

export const ImageIcon = () => (
  <IconWrapper color="pink">
    <FileImage size={24} strokeWidth={2} />
  </IconWrapper>
);

export const SplitIcon = () => (
  <IconWrapper color="orange">
    <Scissors size={24} strokeWidth={2} />
  </IconWrapper>
);

export const RotateIcon = () => (
  <IconWrapper color="cyan">
    <RotateCw size={24} strokeWidth={2} />
  </IconWrapper>
);

export const CropIcon = () => (
  <IconWrapper color="emerald">
    <Crop size={24} strokeWidth={2} />
  </IconWrapper>
);

export const WatermarkIcon = () => (
  <IconWrapper color="violet">
    <Stamp size={24} strokeWidth={2} />
  </IconWrapper>
);

export const TextIcon = () => (
  <IconWrapper color="slate">
    <Type size={24} strokeWidth={2} />
  </IconWrapper>
);

export const HighlightIcon = () => (
  <IconWrapper color="amber">
    <Highlighter size={24} strokeWidth={2} />
  </IconWrapper>
);

export const RedactIcon = () => (
  <IconWrapper color="rose">
    <EyeOff size={24} strokeWidth={2} />
  </IconWrapper>
);

export const SignIcon = () => (
  <IconWrapper color="teal">
    <PenTool size={24} strokeWidth={2} />
  </IconWrapper>
);

export const ShareIcon = () => (
  <IconWrapper color="sky">
    <Share2 size={24} strokeWidth={2} />
  </IconWrapper>
);

export const TranslateIcon = () => (
  <IconWrapper color="blue">
    <Languages size={24} strokeWidth={2} />
  </IconWrapper>
);

export const AnalyticsIcon = () => (
  <IconWrapper color="indigo">
    <BarChart size={24} strokeWidth={2} />
  </IconWrapper>
);

export const OcrIcon = () => (
  <IconWrapper color="amber">
    <FileSearch size={24} strokeWidth={2} />
  </IconWrapper>
);

export const QuizIcon = () => (
  <IconWrapper color="purple">
    <FileQuestion size={24} strokeWidth={2} />
  </IconWrapper>
);

export const ExcelIcon = () => (
  <IconWrapper color="green">
    <FileSpreadsheet size={24} strokeWidth={2} />
  </IconWrapper>
);

export const ChartIcon = () => (
  <IconWrapper color="red">
    <FilePieChart size={24} strokeWidth={2} />
  </IconWrapper>
);

export const PresentationIcon = () => (
  <IconWrapper color="orange">
    <Presentation size={24} strokeWidth={2} />
  </IconWrapper>
);

export const HtmlIcon = () => (
  <IconWrapper color="blue">
    <FileCode size={24} strokeWidth={2} />
  </IconWrapper>
);

export const PhotoIcon = () => (
  <IconWrapper color="pink">
    <Image size={24} strokeWidth={2} />
  </IconWrapper>
); 