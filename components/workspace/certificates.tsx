"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Certificate } from "@/lib/types/certificate";
import { CertificatePDF, type CertificatePDFProps } from "./certificate-pdf";
import { pdf } from "@react-pdf/renderer";

interface CertificatesProps {
  certificates: Certificate[];
  user_full_name: string;
}

export default function Certificates({ certificates, user_full_name }: CertificatesProps) {
  const handleDownloadCertificate = async (certificate: Certificate) => {
    const certificateData: CertificatePDFProps = {
      id: certificate.id,
      courseName: certificate.courseName,
      certificateId: certificate.certificateId,
      issueDate: certificate.issueDate,
      participantName: user_full_name,
      color: "#52796f",
      issuerName: "Memoria",
      issuerEmail: "memoria.app@gmail.com",
    };

    try {
      const pdfBlob = await pdf(
        <CertificatePDF {...certificateData} />
      ).toBlob();

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificateData.participantName.replace(
        /\s+/g,
        "_"
      )}-${certificate.certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating certificate PDF:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold text-[--neutral]">
          Your Certificates
        </h1>
      </div>
      {certificates.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>
            No certificates available. Complete a course to earn a certificate!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.slice(0, 4).map((certificate) => (
            <Card
              key={certificate.id}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <div
                className={`h-8 w-full rounded-t-xl`}
                style={{
                  backgroundColor: certificate.color
                    ? certificate.color
                    : "#FFB6C1",
                }}
              ></div>
              <CardHeader className="pt-4 pb-2">
                <CardTitle className="text-lg truncate">
                  {certificate.courseName}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="mb-2 text-sm font-semibold text-[--neutral]">
                  {certificate.status === "completed"
                    ? "Completed"
                    : "In Progress"}
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Completed on{" "}
                    {new Date(certificate.issueDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mb-4 text-sm">
                  <Award className="w-4 h-4 text-[--neutral]" />
                  <span>Certificate ID: {certificate.certificateId}</span>
                </div>
                <div className="flex justify-end mt-auto">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadCertificate(certificate)}
                    size="sm"
                    className="text-[--neutral] border border-2 border-[--neutral] rounded-full px-4 py-2 text-sm font-semibold hover:bg-[--neutral] hover:text-white transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
