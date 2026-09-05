"use client";

import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumePdfDocument } from "@/lib/pdf/resume-document";
import type { Resume } from "@/types/resume";
import { slugify } from "@/lib/utils";

// PDFDownloadLink touche `window` / canvas au chargement : on le charge uniquement côté client.
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false, loading: () => <Button disabled size="lg">Préparation du PDF...</Button> }
);

export function PdfDownloadButton({ resume }: { resume: Resume }) {
  const fileName = `CV_${slugify(resume.data.personalInfo.firstName)}_${slugify(
    resume.data.personalInfo.lastName
  )}.pdf`;

  return (
    <PDFDownloadLink document={<ResumePdfDocument resume={resume} />} fileName={fileName}>
      {({ loading }) => (
        <Button size="lg" disabled={loading}>
          <Download className="h-4 w-4" /> {loading ? "Génération..." : "Télécharger en PDF"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
