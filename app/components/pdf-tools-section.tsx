"use client";

import { useState } from "react";
import { Search, Sparkles, ArrowRight } from "lucide-react";
import { Input } from "./ui/input";
import { pdfTools, toolCategories } from "../lib/toolsList";
import { PdfToolCard } from "./pdf-tool-card";
import Link from "next/link";

export function PdfToolsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all"); // Default to All tab
  
  const filteredTools = pdfTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="text-center max-w-6xl mx-auto my-10">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="font-bold text-7xl">
          PDF Tools
        </h2>
        <p className="text-2xl text-muted-foreground mt-2">
          Powerful tools to edit, convert, and manage your PDF documents
        </p>
      </div>

      {/* Badge */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center px-4 py-2 space-x-2 text-sm border rounded-full sm:text-base">
          <Sparkles className="w-4 h-4 sm:h-5 sm:w-5" />
          <span>All-in-one PDF Solution</span>
        </div>
      </div>

      {/* Search */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-5xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tools... (Press '/' to focus)"
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "/" && document.activeElement !== e.currentTarget) {
                e.preventDefault();
                e.currentTarget.focus();
              }
            }}
          />
        </div>
      </div>

      <div className="w-full mx-auto max-w-5xl mb-10">
        <div className="flex justify-start mb-6 border-b overflow-x-auto">
          {toolCategories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-2 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === category 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools
            .filter(tool => activeTab === "all" || tool.category === activeTab)
            .map((tool) => (
              <PdfToolCard
                key={tool.id}
                icon={tool.icon}
                title={tool.name}
                description={tool.description}
                trending={tool.category === "ai" ? true : tool.trending}
              />
            ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-10 text-center">
        <Link
          href="/tools"
          className="inline-flex items-center px-4 py-2 text-md font-medium text-white transition duration-300 bg-black rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
        >
          Explore All Tools
          <ArrowRight className="w-3 h-3 ml-2" />
        </Link>
      </div>
    </section>
  );
} 