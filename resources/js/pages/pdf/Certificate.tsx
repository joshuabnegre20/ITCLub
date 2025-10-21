import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 30,
    position: "relative",
    fontFamily: "Times-Roman",
  },
  border: {
    position: "absolute",
    top: 15,
    left: 15,
    right: 15,
    bottom: 15,
    border: "3px solid #1e40af",
    borderRadius: 4,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  leftSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 20,
  },
  rightSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 20,
    borderLeft: "1px solid #e2e8f0",
  },
  header: {
    marginBottom: 25,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 6,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    color: "#64748b",
    fontFamily: "Times-Roman",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    textAlign: "center",
  },
  decorativeLine: {
    width: 120,
    height: 2,
    backgroundColor: "#1e40af",
    marginVertical: 15,
  },
  presentedTo: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 6,
    fontFamily: "Times-Roman",
    fontStyle: "italic",
    textAlign: "center",
  },
  participantName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
    fontFamily: "Times-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    textAlign: "center",
    maxWidth: 280,
    lineHeight: 1.2,
  },
  achievementText: {
    fontSize: 11,
    color: "#475569",
    marginBottom: 3,
    fontFamily: "Times-Roman",
    textAlign: "center",
    lineHeight: 1.3,
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e40af",
    marginVertical: 12,
    fontFamily: "Times-Bold",
    textAlign: "center",
    textTransform: "uppercase",
    maxWidth: 280,
    lineHeight: 1.2,
  },
  description: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 6,
    fontFamily: "Times-Roman",
    textAlign: "center",
    lineHeight: 1.2,
    maxWidth: 280,
  },
  dateSection: {
    marginTop: 20,
    alignItems: "center",
  },
  dateLabel: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 3,
    fontFamily: "Times-Roman",
    textTransform: "uppercase",
  },
  date: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e293b",
    fontFamily: "Times-Bold",
  },
  signatureSection: {
    marginTop: 25,
    alignItems: "center",
    width: "100%",
  },
  signature: {
    alignItems: "center",
    marginBottom: 15,
    width: 180,
  },
  signatureLine: {
    width: 140,
    height: 1,
    backgroundColor: "#1e293b",
    marginTop: 20,
    marginBottom: 5,
  },
  signatureName: {
    fontSize: 8,
    color: "#475569",
    fontFamily: "Times-Roman",
  },
  signatureTitle: {
    fontSize: 7,
    color: "#64748b",
    fontFamily: "Times-Roman",
    fontStyle: "italic",
  },
  seal: {
    width: 70,
    height: 70,
    border: "2px solid #1e40af",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 20,
  },
  sealText: {
    fontSize: 8,
    color: "#1e40af",
    fontFamily: "Times-Roman",
    textAlign: "center",
    lineHeight: 1.2,
  },
  watermark: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: 48,
    color: "#f1f5f9",
    fontWeight: "bold",
    fontFamily: "Times-Bold",
    opacity: 0.05,
  },
  certificateId: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    fontSize: 7,
    color: "#94a3b8",
    textAlign: "center",
    fontFamily: "Times-Roman",
  },
  decorativeCorner: {
    position: 'absolute',
    fontSize: 14,
    color: '#1e40af',
  },
});

// Decorative corner component
const DecorativeCorner = ({ position }: { position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' }) => {
  const positions = {
    topLeft: { top: 20, left: 20 },
    topRight: { top: 20, right: 20 },
    bottomLeft: { bottom: 20, left: 20 },
    bottomRight: { bottom: 20, right: 20 },
  };

  return (
    <View style={[styles.decorativeCorner, positions[position]]}>
      <Text>❖</Text>
    </View>
  );
};

export default function Certification({
  participantName,
  projectTitle,
  date,
}: {
  participantName: string;
  projectTitle: string;
  date: string;
}) {
  // Generate a certificate ID
  const certificateId = `TMC-${Math.random().toString(36).substr(2, 6).toUpperCase()}-${Date.now().toString(36).substr(-4)}`;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Border */}
        <View style={styles.border} />
        
        {/* Watermark */}
        <Text style={styles.watermark}>TMC IT CLUB</Text>
        
        {/* Decorative Corners */}
        <DecorativeCorner position="topLeft" />
        <DecorativeCorner position="topRight" />
        <DecorativeCorner position="bottomLeft" />
        <DecorativeCorner position="bottomRight" />
        
        {/* Main Content Container */}
        <View style={styles.container}>
          {/* Left Section - Certificate Content */}
          <View style={styles.leftSection}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Certificate of Achievement</Text>
              <Text style={styles.subtitle}>TMC IT Club</Text>
            </View>

            {/* Decorative Line */}
            <View style={styles.decorativeLine} />

            {/* Participant Name Section */}
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.presentedTo}>This Certificate is Proudly Presented To</Text>
              <Text style={styles.participantName}>{participantName}</Text>
            </View>

            {/* Achievement Details */}
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <Text style={styles.achievementText}>in recognition of successful completion and</Text>
              <Text style={styles.achievementText}>outstanding participation in</Text>
            </View>
            
            <View style={styles.decorativeLine} />
            
            {/* Project Title */}
            <Text style={styles.projectTitle}>{projectTitle}</Text>
            
            <View style={styles.decorativeLine} />

            {/* Description */}
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <Text style={styles.description}>
                This certificate acknowledges the dedication, effort, and exceptional 
                performance demonstrated throughout the project.
              </Text>
              <Text style={styles.description}>
                The recipient has shown remarkable commitment to learning and excellence 
                in their field of study.
              </Text>
            </View>

            {/* Date Section */}
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>Issued on</Text>
              <Text style={styles.date}>{date}</Text>
            </View>
          </View>

          {/* Right Section - Signatures & Seal */}
          <View style={styles.rightSection}>
            {/* Official Seal */}
            <View style={styles.seal}>
              <Text style={styles.sealText}>OFFICIAL{"\n"}SEAL{"\n"}TMC IT</Text>
            </View>

            {/* Signatures Section */}
            <View style={styles.signatureSection}>
              <View style={styles.signature}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>Club President</Text>
                <Text style={styles.signatureTitle}>TMC IT Club</Text>
              </View>
              
              <View style={styles.signature}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>Project Advisor</Text>
                <Text style={styles.signatureTitle}>TMC IT Club</Text>
              </View>

              <View style={styles.signature}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureName}>Head of Department</Text>
                <Text style={styles.signatureTitle}>TMC IT Club</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Certificate ID */}
        <Text style={styles.certificateId}>
          Certificate ID: {certificateId} | Digitally issued by TMC IT Club | Valid and Verifiable
        </Text>
      </Page>
    </Document>
  );
}