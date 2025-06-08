import type React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Certificate } from "@/lib/types/certificate";

Font.register({
  family: "Helvetica",
  src: "Helvetica",
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#f8fafc",
    padding: 40,
    fontFamily: "Helvetica",
  },
  container: {
    backgroundColor: "white",
    padding: 40,
    borderRadius: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    minHeight: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 40,
    height: 40,
    backgroundColor: "#d1fae5",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logoText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#059669",
  },
  brandContainer: {
    flexDirection: "column",
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  brandSubtitle: {
    fontSize: 12,
    color: "#64748b",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  medalIcon: {
    fontSize: 20,
    color: "#eab308",
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#64748b",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
  },
  participantName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#059669",
    textAlign: "center",
    marginBottom: 20,
    borderBottom: "2px solid #fda4af",
    paddingBottom: 8,
  },
  completionText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
  },
  courseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#374151",
    textAlign: "center",
    marginBottom: 20,
  },
  systemText: {
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 40,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  detailItem: {
    flex: 1,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 12,
    color: "#64748b",
  },
  footer: {
    // borderTop: "1px solid #e5e7eb",
    // paddingTop: 20,
    alignItems: "flex-start",
  },
  footerLabel: {
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 4,
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 2,
  },
  footerEmail: {
    fontSize: 10,
    color: "#64748b",
  },
  certificateId: {
    fontSize: 10,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 30,
  },
});

export interface CertificatePDFProps extends Certificate {
  color?: string;
  participantName: string;
  studyTime?: string;
  performance?: string;
  issuerName: string;
  issuerEmail: string;
}

export function CertificatePDF({
  courseName,
  certificateId,
  color = "#059669",
  participantName,
  issuerName,
  issuerEmail,
}: CertificatePDFProps) {
  const dynamicStyles = StyleSheet.create({
    participantName: {
      ...styles.participantName,
      color: color,
    },
    logoText: {
      ...styles.logoText,
      color: color,
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandContainer}>
              <Text style={styles.brandTitle}>Memoria</Text>
              <Text style={styles.brandSubtitle}>AI Learning Platform</Text>
            </View>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Certificate of Completion</Text>
          </View>

          <Text style={styles.subtitle}>This certifies that</Text>

          {/* Participant Name */}
          <Text style={dynamicStyles.participantName}>{participantName}</Text>

          <Text style={styles.completionText}>
            has successfully completed the learning program
          </Text>

          {/* Course Name */}
          <Text style={styles.courseName}>{courseName}</Text>

          <Text style={styles.systemText}>
            using the Memoria spaced repetition learning system
          </Text>

          {/* Certificate ID */}
          <Text style={styles.certificateId}>
            Certificate ID: {certificateId}
          </Text>

          {/* Details */}
          {/* <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Issue Date</Text>
              <Text style={styles.detailValue}>{formatDate(issueDate)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Study Time</Text>
              <Text style={styles.detailValue}>{studyTime}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={styles.detailValue}>{status === "completed" ? "✓ Completed" : "⏳ In Progress"}</Text>
            </View>
          </View> */}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerLabel}>Issued by</Text>
            <Text style={styles.footerTitle}>{issuerName}</Text>
            <Text style={styles.footerEmail}>{issuerEmail}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
