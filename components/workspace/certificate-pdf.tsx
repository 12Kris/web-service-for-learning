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
    backgroundColor: "white",
    padding: 40,
    fontFamily: "Helvetica",
    color: "#52796f",
  },
  container: {
    border: "1px solid gray",
    padding: 30,
    borderRadius: 8,
    alignItems: "center",
    color: "#52796f",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 25,
    height: 25,
    backgroundColor: "#dbeafe",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    border: "1px solid gray",
  },
  logoText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
  brandContainer: {
    flexDirection: "column",
  },
  brandTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  brandSubtitle: {
    fontSize: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: '#fef9f285',
    borderRadius: "13px",
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#fef9f285",
    border: "1px solid gray",
    padding: '5px 15px',
    borderRadius: "13px",
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  participantName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#065f46",
    textAlign: "center",
    marginBottom: 10,
    borderBottom: "2px solid #dc2626",
    paddingBottom: 8,
  },
  completionText: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#fef9f285",
    border: "1px solid gray",
    padding: '5px 15px',
    borderRadius: 5,
    marginBottom: 10,
  },
  systemText: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 20,
  },
  detailsContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 20,
    textAlign: "center"
  },
  detailItem: {
    marginBottom: 5,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  detailValue: {
    fontSize: 10,
  },
  footer: {
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 10,
    color: "#9ca3af",
    marginBottom: 2,
  },
  footerTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  footerEmail: {
    fontSize: 10,
  },
});

export interface CertificatePDFProps extends Certificate {
  participantName: string;
  courseName: string;
  completionDate?: string;
  issuerName: string;
  issuerEmail: string;
}

export function CertificatePDF({
  participantName,
  courseName,
  issuerName,
  issuerEmail,
  issueDate,
  color,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={[styles.container, { backgroundColor: color }]}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>QR</Text>
            </View>
            <View style={styles.brandContainer}>
              <Text style={styles.brandTitle}>Memoria</Text>
              <Text style={styles.brandSubtitle}>AI Learning Platform</Text>
            </View>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Certificate of Completion</Text>
          </View>

          <Text style={styles.subtitle}>This certifies that</Text>

          <Text style={styles.participantName}>{participantName}</Text>

          <Text style={styles.completionText}>
            has successfully completed the learning program
          </Text>

          <Text style={styles.courseName}>{courseName}</Text>

          <Text style={styles.systemText}>
            using the Memoria spaced repetition learning system
          </Text>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Completion Date</Text>
              <Text style={styles.detailValue}>{issueDate}</Text>
            </View>
          </View>

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
