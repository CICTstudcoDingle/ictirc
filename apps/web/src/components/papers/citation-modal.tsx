"use client";

import { useState } from "react";
import { X, Copy, Check, FileText } from "lucide-react";
import { Button } from "@ictirc/ui";
import { motion, AnimatePresence } from "framer-motion";

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: {
    title: string;
    authors: { name: string }[];
    publishedAt?: Date;
    doi?: string;
    volume?: number;
    issue?: number;
    pages?: string;
  };
}

export function CitationModal({ isOpen, onClose, paper }: CitationModalProps) {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const year = paper.publishedAt ? paper.publishedAt.getFullYear() : new Date().getFullYear();
  const authorNames = paper.authors.map((a) => a.name).join(", ");
  const firstAuthorLast = paper.authors[0]?.name.split(" ").pop() || "Author";
  
  // Formatters
  const formats = {
    APA: `${authorNames} (${year}). ${paper.title}. International Research Journal on Information and Communications Technology.${paper.volume ? ` ${paper.volume}(${paper.issue}),` : ""} ${paper.doi ? ` https://doi.org/${paper.doi}` : ""}`,
    MLA: `${authorNames}. "${paper.title}." International Research Journal on Information and Communications Technology, ${paper.volume ? `vol. ${paper.volume}, no. ${paper.issue}, ` : ""}${year}${paper.doi ? `, doi:${paper.doi}` : ""}.`,
    BibTeX: `@article{${firstAuthorLast.toLowerCase()}${year},
  title={${paper.title}},
  author={${paper.authors.map(a => a.name).join(" and ")}},
  journal={International Research Journal on Information and Communications Technology},
  ${paper.volume ? `volume={${paper.volume}},` : ""}
  ${paper.issue ? `number={${paper.issue}},` : ""}
  year={${year}},
  ${paper.doi ? `doi={${paper.doi}}` : ""}
}`
  };

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-maroon p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gold" />
                <h2 className="font-bold tracking-tight">Cite this Paper</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-600 font-medium"> Select a citation style to copy:</p>
              
              <div className="space-y-4">
                {Object.entries(formats).map(([name, citation]) => (
                  <div key={name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-maroon uppercase tracking-widest">{name}</span>
                      <button
                        onClick={() => copyToClipboard(citation, name)}
                        className="text-xs flex items-center gap-1.5 text-gray-500 hover:text-maroon transition-colors font-medium"
                      >
                        {copiedFormat === name ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-800 font-mono break-words">
                      {citation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex justify-end">
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
