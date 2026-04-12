import { useState } from "react";
import { Download } from "lucide-react";

interface ExportButtonProps {
  content: string;
  filename: string;
}

export function ExportButton({ content, filename }: ExportButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    if (!content) return;
    setDownloading(true);
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 300);
  };

  return (
    <button
      onClick={handleDownload}
      className={`p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all ${
        downloading ? "scale-90" : "scale-100"
      }`}
      title="Export as File"
    >
      <Download size={16} />
    </button>
  );
}
