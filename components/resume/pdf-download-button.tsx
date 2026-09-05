"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumePdfDocument } from "@/lib/pdf/resume-document";
import type { Resume } from "@/types/resume";
import { slugify } from "@/lib/utils";
import { pdf } from "@react-pdf/renderer";

export function PdfDownloadButton({ resume }: { resume: Resume }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const doc = <ResumePdfDocument resume={resume} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `CV_${slugify(resume.data.personalInfo.firstName)}_${slugify(
        resume.data.personalInfo.lastName
      )}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleDownload} disabled={loading}>
      <Download className="h-4 w-4" /> {loading ? "Génération..." : "Télécharger en PDF"}
    </Button>
  );
}
