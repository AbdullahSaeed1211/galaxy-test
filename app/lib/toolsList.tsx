import { ReactNode } from "react";
import { 
  MergeIcon, 
  CompressIcon, 
  ConvertIcon, 
  SecurityIcon, 
  AiIcon,
  SplitIcon,
  RotateIcon,
  CropIcon,
  WatermarkIcon,
  TextIcon,
  HighlightIcon,
  RedactIcon,
  SignIcon,
  ShareIcon,
  TranslateIcon,
  AnalyticsIcon,
  OcrIcon,
  QuizIcon,
  ExcelIcon,
  PresentationIcon,
  HtmlIcon,
  PhotoIcon,
  ImageIcon
} from "../components/pdf-tool-icons";

export interface PdfTool {
  id: string;
  name: string;
  description: string;
  icon: ReactNode;
  category: ToolCategory;
  trending?: boolean;
}

// Available categories for filtering
export const toolCategories = ["all", "edit", "convert", "merge", "security", "ai"] as const;
export type ToolCategory = typeof toolCategories[number];

// PDF tools data - ordered by importance/popularity
export const pdfTools: PdfTool[] = [
  // Essential tools - most commonly used
  {
    id: "compress",
    name: "Compress PDF",
    description: "Reduce file size while maintaining quality",
    icon: <CompressIcon />,
    category: "edit",
    trending: true,
  },
  {
    id: "merge",
    name: "Merge PDFs",
    description: "Combine multiple PDFs into one document",
    icon: <MergeIcon />,
    category: "merge",
    trending: true,
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF to editable Word document",
    icon: <ConvertIcon />,
    category: "convert",
    trending: true,
  },
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    description: "Convert Word documents to PDF format",
    icon: <ConvertIcon />,
    category: "convert",
    trending: true,
  },
  {
    id: "esign",
    name: "eSign PDF",
    description: "Add electronic signatures to your documents",
    icon: <SignIcon />,
    category: "security",
    trending: true,
  },
  {
    id: "encrypt",
    name: "Encrypt PDF",
    description: "Secure your PDF with password protection",
    icon: <SecurityIcon />,
    category: "security",
  },
  {
    id: "ai-chat",
    name: "Chat with PDF",
    description: "Ask questions about your PDF content",
    icon: <AiIcon />,
    category: "ai",
    trending: true,
  },
  
  // Conversion tools - document formats
  {
    id: "excel-to-pdf",
    name: "Excel to PDF",
    description: "Convert Excel spreadsheets to PDF format",
    icon: <ExcelIcon />,
    category: "convert",
  },
  {
    id: "pdf-to-excel",
    name: "PDF to Excel",
    description: "Convert PDF tables to Excel spreadsheets",
    icon: <ExcelIcon />,
    category: "convert",
  },
  {
    id: "powerpoint-to-pdf",
    name: "PowerPoint to PDF",
    description: "Convert PowerPoint presentations to PDF",
    icon: <PresentationIcon />,
    category: "convert",
  },
  {
    id: "pdf-to-powerpoint",
    name: "PDF to PowerPoint",
    description: "Convert PDF to PowerPoint presentations",
    icon: <PresentationIcon />,
    category: "convert",
  },
  {
    id: "pdf-to-html",
    name: "PDF to HTML",
    description: "Convert PDF documents to HTML web pages",
    icon: <HtmlIcon />,
    category: "convert",
  },
  
  // Conversion tools - image formats
  {
    id: "jpg-to-pdf",
    name: "JPG to PDF",
    description: "Convert JPG images to PDF documents",
    icon: <ImageIcon />,
    category: "convert",
  },
  {
    id: "png-to-pdf",
    name: "PNG to PDF",
    description: "Convert PNG images to PDF documents",
    icon: <ImageIcon />,
    category: "convert",
  },
  {
    id: "pdf-to-jpg",
    name: "PDF to JPEG",
    description: "Convert PDF pages to JPG images",
    icon: <PhotoIcon />,
    category: "convert",
  },
  {
    id: "pdf-to-png",
    name: "PDF to PNG",
    description: "Convert PDF pages to PNG images",
    icon: <PhotoIcon />,
    category: "convert",
  },
  {
    id: "heic-to-pdf",
    name: "HEIC to PDF",
    description: "Convert HEIC images to PDF format",
    icon: <ImageIcon />,
    category: "convert",
  },
  {
    id: "bmp-to-pdf",
    name: "BMP to PDF",
    description: "Convert BMP images to PDF format",
    icon: <ImageIcon />,
    category: "convert",
  },
  {
    id: "gif-to-pdf",
    name: "GIF to PDF",
    description: "Convert GIF images to PDF format",
    icon: <ImageIcon />,
    category: "convert",
  },
  {
    id: "tiff-to-pdf",
    name: "TIFF to PDF",
    description: "Convert TIFF images to PDF format",
    icon: <ImageIcon />,
    category: "convert",
  },
  
  // Edit tools
  {
    id: "split",
    name: "Split PDF",
    description: "Divide a PDF into multiple files",
    icon: <SplitIcon />,
    category: "edit",
  },
  {
    id: "remove-pages",
    name: "Remove Pages",
    description: "Delete specific pages from a PDF document",
    icon: <SplitIcon />,
    category: "edit",
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    description: "Extract specific pages from a PDF document",
    icon: <SplitIcon />,
    category: "edit",
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    description: "Rotate pages in a PDF document",
    icon: <RotateIcon />,
    category: "edit",
  },
  {
    id: "crop-pdf",
    name: "Crop PDF",
    description: "Crop pages in a PDF document",
    icon: <CropIcon />,
    category: "edit",
  },
  {
    id: "add-watermark",
    name: "Add Watermark",
    description: "Add text or image watermarks to PDF pages",
    icon: <WatermarkIcon />,
    category: "edit",
  },
  {
    id: "add-page-numbers",
    name: "Add Page Numbers",
    description: "Add page numbers to PDF documents",
    icon: <TextIcon />,
    category: "edit",
  },
  {
    id: "edit-pdf",
    name: "Edit PDF",
    description: "Add text, shapes, images, and annotations",
    icon: <TextIcon />,
    category: "edit",
  },
  {
    id: "highlight-pdf",
    name: "Highlight PDF",
    description: "Add highlights to text in PDF documents",
    icon: <HighlightIcon />,
    category: "edit",
  },
  {
    id: "redact-pdf",
    name: "Redact PDF",
    description: "Remove sensitive information from PDFs",
    icon: <RedactIcon />,
    category: "security",
  },
  {
    id: "ocr-pdf",
    name: "OCR PDF",
    description: "Make text in scanned PDFs searchable",
    icon: <OcrIcon />,
    category: "edit",
    trending: true,
  },
  
  // Security tools
  {
    id: "remove-password",
    name: "Remove Password",
    description: "Remove password protection from PDFs",
    icon: <SecurityIcon />,
    category: "security",
  },
  {
    id: "share-pdf",
    name: "Share PDF",
    description: "Securely share PDF documents with others",
    icon: <ShareIcon />,
    category: "security",
  },
  
  // AI-powered tools
  {
    id: "ai-summarize",
    name: "Summarize PDF",
    description: "Get AI-generated summaries of your documents",
    icon: <AiIcon />,
    category: "ai",
  },
  {
    id: "ai-translate",
    name: "Translate PDF",
    description: "Translate PDF summaries to different languages",
    icon: <TranslateIcon />,
    category: "ai",
  },
  {
    id: "ai-pl-analyzer",
    name: "P&L Analyzer",
    description: "AI-powered Profit & Loss analysis",
    icon: <AnalyticsIcon />,
    category: "ai",
  },
  {
    id: "ai-resume-checker",
    name: "Resume Checker",
    description: "AI-powered resume review and feedback",
    icon: <AiIcon />,
    category: "ai",
  },
  {
    id: "ai-resume-scanner",
    name: "Resume Scanner",
    description: "AI-powered resume overview & questions",
    icon: <AiIcon />,
    category: "ai",
  },
  {
    id: "ai-invoice-scanner",
    name: "Invoice Scanner",
    description: "AI-powered invoice data extraction",
    icon: <AiIcon />,
    category: "ai",
  },
  {
    id: "ai-quiz-generator",
    name: "Quiz Generator",
    description: "AI-powered quiz creation from PDF content",
    icon: <QuizIcon />,
    category: "ai",
  },
]; 