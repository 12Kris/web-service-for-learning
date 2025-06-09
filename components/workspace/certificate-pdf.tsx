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
    backgroundColor: "#fff5f7",
    padding: 30,
    borderRadius: 8,
    alignItems: "center",
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
    color: "#1e293b",
  },
  brandSubtitle: {
    fontSize: 10,
    color: "#64748b",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: '#fef9f285',
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    backgroundColor: "#fef9f285",
    border: "1px solid gray",
    padding: '5px 15px',
    borderRadius: 13,
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
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
    color: "#64748b",
    textAlign: "center",
    marginBottom: 10,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    backgroundColor: "#fef9f285",
    border: "1px solid gray",
    padding: '5px 15px',
    borderRadius: 5,
    marginBottom: 10,
  },
  systemText: {
    fontSize: 10,
    color: "#9ca3af",
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
    color: "#374151",
  },
  detailValue: {
    fontSize: 10,
    color: "#64748b",
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
    color: "#374151",
    marginBottom: 2,
  },
  footerEmail: {
    fontSize: 10,
    color: "#64748b",
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
  completionDate,
  issuerName,
  issuerEmail,
  issueDate,
}: CertificatePDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>QR</Text>
            </View>
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
          <Text style={styles.participantName}>{participantName}</Text>

          <Text style={styles.completionText}>
            has successfully completed the learning program
          </Text>

          {/* Course Name */}
          <Text style={styles.courseName}>{courseName}</Text>

          <Text style={styles.systemText}>
            using the Memoria spaced repetition learning system
          </Text>

          {/* Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Completion Date</Text>
              <Text style={styles.detailValue}>{issueDate}</Text>
            </View>
          </View>

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

// import type React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Font,
// } from "@react-pdf/renderer";
// import { Certificate } from "@/lib/types/certificate";

// Font.register({
//   family: "Helvetica",
//   src: "Helvetica",
// });

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "white",
//     padding: 40,
//     fontFamily: "Helvetica",
//   },
//   container: {
//     backgroundColor: "#fff5f7", // Light pink gradient-like background
//     padding: 40,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   logo: {
//     width: 30,
//     height: 30,
//     backgroundColor: "#e0f2fe",
//     borderRadius: 4,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 10,
//   },
//   logoText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#0369a1",
//   },
//   brandContainer: {
//     flexDirection: "column",
//   },
//   brandTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#1e293b",
//   },
//   brandSubtitle: {
//     fontSize: 10,
//     color: "#64748b",
//   },
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#a3a3a3",
//     textAlign: "center",
//     backgroundColor: "#fef3c7",
//     padding: 5,
//     borderRadius: 4,
//   },
//   subtitle: {
//     fontSize: 12,
//     color: "#64748b",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   participantName: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#065f46",
//     textAlign: "center",
//     marginBottom: 10,
//     borderBottom: "2px solid #f87171",
//     paddingBottom: 8,
//   },
//   completionText: {
//     fontSize: 12,
//     color: "#64748b",
//     textAlign: "center",
//     marginBottom: 10,
//   },
//   courseName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#374151",
//     textAlign: "center",
//     marginBottom: 10,
//     backgroundColor: "#f1f5f9",
//     padding: 5,
//     borderRadius: 4,
//   },
//   systemText: {
//     fontSize: 10,
//     color: "#9ca3af",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   detailsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//     width: "60%",
//   },
//   detailItem: {
//     flex: 1,
//     alignItems: "center",
//   },
//   detailLabel: {
//     fontSize: 10,
//     fontWeight: "bold",
//     color: "#374151",
//     marginBottom: 2,
//   },
//   detailValue: {
//     fontSize: 10,
//     color: "#64748b",
//     backgroundColor: "#f1f5f9",
//     padding: 3,
//     borderRadius: 4,
//   },
//   footer: {
//     alignItems: "center",
//   },
//   footerLabel: {
//     fontSize: 10,
//     color: "#9ca3af",
//     marginBottom: 2,
//   },
//   footerTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#374151",
//     marginBottom: 2,
//   },
//   footerEmail: {
//     fontSize: 10,
//     color: "#64748b",
//   },
// });

// export interface CertificatePDFProps extends Certificate {
//   color?: string;
//   participantName: string;
//   courseName: string;
//   completionDate?: string;
//   studyTime?: string;
//   performance?: string;
//   issuerName: string;
//   issuerEmail: string;
// }

// export function CertificatePDF({
//   courseName,
//   participantName,
//   completionDate,
//   issuerName,
//   issuerEmail,
//   issueDate
// }: CertificatePDFProps) {
//   return (
//     <Document>
//       <Page size="A4" style={styles.page} orientation="landscape">
//         <View style={styles.container}>
//           <View style={styles.header}>
//             <View style={styles.logo}>
//               <Text style={styles.logoText}>QR</Text>
//             </View>
//             <View style={styles.brandContainer}>
//               <Text style={styles.brandTitle}>Memoria</Text>
//               <Text style={styles.brandSubtitle}>AI Learning Platform</Text>
//             </View>
//           </View>

//           <View style={styles.titleContainer}>
//             <Text style={styles.title}>Certificate of Completion</Text>
//           </View>

//           <Text style={styles.subtitle}>This certifies that</Text>

//           <Text style={styles.participantName}>{participantName}</Text>

//           <Text style={styles.completionText}>
//             has successfully completed the learning program
//           </Text>

//           <Text style={styles.courseName}>{courseName}</Text>

//           <Text style={styles.systemText}>
//             using the Memoria spaced repetition learning system
//           </Text>

//           <View style={styles.detailsContainer}>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Completion Date</Text>
//               <Text style={styles.detailValue}>{issueDate}</Text>
//             </View>
//           </View>

//           <View style={styles.footer}>
//             <Text style={styles.footerLabel}>Issued by</Text>
//             <Text style={styles.footerTitle}>{issuerName}</Text>
//             <Text style={styles.footerEmail}>{issuerEmail}</Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// }


// import type React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Font,
// } from "@react-pdf/renderer";
// import { Certificate } from "@/lib/types/certificate";

// Font.register({
//   family: "Helvetica",
//   src: "Helvetica",
// });

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: "column",
//     backgroundColor: "#f8fafc",
//     padding: 40,
//     fontFamily: "Helvetica",
//   },
//   container: {
//     backgroundColor: "white",
//     padding: 40,
//     borderRadius: 1,
//     boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//     minHeight: "100%",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   logo: {
//     width: 40,
//     height: 40,
//     backgroundColor: "#d1fae5",
//     borderRadius: 4,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   logoText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#059669",
//   },
//   brandContainer: {
//     flexDirection: "column",
//   },
//   brandTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#1e293b",
//   },
//   brandSubtitle: {
//     fontSize: 12,
//     color: "#64748b",
//   },
//   titleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   medalIcon: {
//     fontSize: 20,
//     color: "#eab308",
//     marginRight: 8,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#64748b",
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 14,
//     color: "#64748b",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   participantName: {
//     fontSize: 36,
//     fontWeight: "bold",
//     color: "#059669",
//     textAlign: "center",
//     marginBottom: 20,
//     borderBottom: "2px solid #fda4af",
//     paddingBottom: 8,
//   },
//   completionText: {
//     fontSize: 14,
//     color: "#64748b",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   courseName: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#374151",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   systemText: {
//     fontSize: 12,
//     color: "#9ca3af",
//     textAlign: "center",
//     marginBottom: 40,
//   },
//   detailsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 40,
//   },
//   detailItem: {
//     flex: 1,
//     alignItems: "center",
//   },
//   detailLabel: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#374151",
//     marginBottom: 4,
//   },
//   detailValue: {
//     fontSize: 12,
//     color: "#64748b",
//   },
//   footer: {
//     // borderTop: "1px solid #e5e7eb",
//     // paddingTop: 20,
//     alignItems: "flex-start",
//   },
//   footerLabel: {
//     fontSize: 10,
//     color: "#9ca3af",
//     marginBottom: 4,
//   },
//   footerTitle: {
//     fontSize: 12,
//     fontWeight: "bold",
//     color: "#374151",
//     marginBottom: 2,
//   },
//   footerEmail: {
//     fontSize: 10,
//     color: "#64748b",
//   },
//   certificateId: {
//     fontSize: 10,
//     color: "#9ca3af",
//     textAlign: "center",
//     marginBottom: 30,
//   },
// });

// export interface CertificatePDFProps extends Certificate {
//   color?: string;
//   participantName: string;
//   studyTime?: string;
//   performance?: string;
//   issuerName: string;
//   issuerEmail: string;
// }

// export function CertificatePDF({
//   courseName,
//   certificateId,
//   color = "#059669",
//   participantName,
//   issuerName,
//   issuerEmail,
// }: CertificatePDFProps) {
//   const dynamicStyles = StyleSheet.create({
//     participantName: {
//       ...styles.participantName,
//       color: color,
//     },
//     logoText: {
//       ...styles.logoText,
//       color: color,
//     },
//   });

//   return (
//     <Document>
//       <Page size="A4" style={styles.page} orientation="landscape">
//         <View style={styles.container}>
//           {/* Header */}
//           <View style={styles.header}>
//             <View style={styles.brandContainer}>
//               <Text style={styles.brandTitle}>Memoria</Text>
//               <Text style={styles.brandSubtitle}>AI Learning Platform</Text>
//             </View>
//           </View>

//           {/* Title */}
//           <View style={styles.titleContainer}>
//             <Text style={styles.title}>Certificate of Completion</Text>
//           </View>

//           <Text style={styles.subtitle}>This certifies that</Text>

//           {/* Participant Name */}
//           <Text style={dynamicStyles.participantName}>{participantName}</Text>

//           <Text style={styles.completionText}>
//             has successfully completed the learning program
//           </Text>

//           {/* Course Name */}
//           <Text style={styles.courseName}>{courseName}</Text>

//           <Text style={styles.systemText}>
//             using the Memoria spaced repetition learning system
//           </Text>

//           {/* Certificate ID */}
//           <Text style={styles.certificateId}>
//             Certificate ID: {certificateId}
//           </Text>

//           {/* Details */}
//           {/* <View style={styles.detailsContainer}>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Issue Date</Text>
//               <Text style={styles.detailValue}>{formatDate(issueDate)}</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Study Time</Text>
//               <Text style={styles.detailValue}>{studyTime}</Text>
//             </View>
//             <View style={styles.detailItem}>
//               <Text style={styles.detailLabel}>Status</Text>
//               <Text style={styles.detailValue}>{status === "completed" ? "✓ Completed" : "⏳ In Progress"}</Text>
//             </View>
//           </View> */}

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerLabel}>Issued by</Text>
//             <Text style={styles.footerTitle}>{issuerName}</Text>
//             <Text style={styles.footerEmail}>{issuerEmail}</Text>
//           </View>
//         </View>
//       </Page>
//     </Document>
//   );
// }
