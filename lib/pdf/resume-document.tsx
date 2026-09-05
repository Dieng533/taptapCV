import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Resume } from "@/types/resume";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1f2937" },
  headerRow: { flexDirection: "row", marginBottom: 16, borderBottomWidth: 2, paddingBottom: 12 },
  name: { fontSize: 20, fontWeight: 700, marginBottom: 2 },
  jobTitle: { fontSize: 11, color: "#4b5563", marginBottom: 4 },
  contact: { fontSize: 9, color: "#6b7280" },
  summary: { fontSize: 9.5, lineHeight: 1.5, marginBottom: 12, color: "#374151" },
  sectionTitle: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", marginBottom: 6, letterSpacing: 0.5 },
  itemRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 1 },
  itemTitle: { fontSize: 10, fontWeight: 700 },
  itemSubtitle: { fontSize: 9, color: "#6b7280", marginBottom: 2 },
  itemDate: { fontSize: 8.5, color: "#6b7280" },
  itemDesc: { fontSize: 9, lineHeight: 1.4, color: "#374151", marginBottom: 6 },
  section: { marginBottom: 12 },
  skillChip: { fontSize: 8.5, marginRight: 6, marginBottom: 4 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap" },
});

function formatMonthYear(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

export function ResumePdfDocument({ resume }: { resume: Resume }) {
  const { data, primary_color, section_order } = resume;
  const p = data.personalInfo;

  return (
    <Document title={`CV_${p.firstName}_${p.lastName}`}>
      <Page size="A4" style={styles.page}>
        <View style={[styles.headerRow, { borderBottomColor: primary_color }]}>
          <View>
            <Text style={[styles.name, { color: primary_color }]}>
              {p.firstName} {p.lastName}
            </Text>
            <Text style={styles.jobTitle}>{p.jobTitle}</Text>
            <Text style={styles.contact}>
              {[p.email, p.phone, p.city, p.country].filter(Boolean).join("  ·  ")}
            </Text>
          </View>
        </View>

        {data.summary ? <Text style={styles.summary}>{data.summary}</Text> : null}

        {section_order.map((key) => {
          if (key === "experience" && data.experiences.length > 0) {
            return (
              <View key={key} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: primary_color }]}>Expérience professionnelle</Text>
                {data.experiences.map((exp) => (
                  <View key={exp.id} wrap={false} style={{ marginBottom: 6 }}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemTitle}>{exp.position}</Text>
                      <Text style={styles.itemDate}>
                        {formatMonthYear(exp.startDate)} — {exp.isCurrent ? "Présent" : formatMonthYear(exp.endDate)}
                      </Text>
                    </View>
                    <Text style={styles.itemSubtitle}>
                      {exp.company}
                      {exp.city ? ` · ${exp.city}` : ""}
                    </Text>
                    {exp.description ? <Text style={styles.itemDesc}>{exp.description}</Text> : null}
                  </View>
                ))}
              </View>
            );
          }
          if (key === "education" && data.educations.length > 0) {
            return (
              <View key={key} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: primary_color }]}>Formation</Text>
                {data.educations.map((ed) => (
                  <View key={ed.id} wrap={false} style={{ marginBottom: 6 }}>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemTitle}>{ed.degree}</Text>
                      <Text style={styles.itemDate}>
                        {formatMonthYear(ed.startDate)} — {formatMonthYear(ed.endDate)}
                      </Text>
                    </View>
                    <Text style={styles.itemSubtitle}>
                      {ed.school}
                      {ed.city ? ` · ${ed.city}` : ""}
                    </Text>
                    {ed.description ? <Text style={styles.itemDesc}>{ed.description}</Text> : null}
                  </View>
                ))}
              </View>
            );
          }
          if (key === "skills" && data.skills.length > 0) {
            return (
              <View key={key} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: primary_color }]}>Compétences</Text>
                <View style={styles.skillsRow}>
                  {data.skills.map((s) => (
                    <Text key={s.id} style={styles.skillChip}>
                      • {s.name}
                    </Text>
                  ))}
                </View>
              </View>
            );
          }
          if (key === "languages" && data.languages.length > 0) {
            return (
              <View key={key} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: primary_color }]}>Langues</Text>
                {data.languages.map((l) => (
                  <Text key={l.id} style={{ fontSize: 9, marginBottom: 2 }}>
                    {l.name} — {l.level}
                  </Text>
                ))}
              </View>
            );
          }
          if (key === "certifications" && data.certifications.length > 0) {
            return (
              <View key={key} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: primary_color }]}>Certifications</Text>
                {data.certifications.map((c) => (
                  <Text key={c.id} style={{ fontSize: 9, marginBottom: 2 }}>
                    {c.name} {c.issuer ? `— ${c.issuer}` : ""}
                  </Text>
                ))}
              </View>
            );
          }
          if (key === "projects" && data.projects.length > 0) {
            return (
              <View key={key} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: primary_color }]}>Projets</Text>
                {data.projects.map((pr) => (
                  <View key={pr.id} style={{ marginBottom: 6 }}>
                    <Text style={styles.itemTitle}>{pr.name}</Text>
                    {pr.technologies ? <Text style={styles.itemSubtitle}>{pr.technologies}</Text> : null}
                    {pr.description ? <Text style={styles.itemDesc}>{pr.description}</Text> : null}
                  </View>
                ))}
              </View>
            );
          }
          if (key === "interests" && data.interests.length > 0) {
            return (
              <View key={key} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: primary_color }]}>Centres d'intérêt</Text>
                <Text style={{ fontSize: 9 }}>{data.interests.map((i) => i.name).join(" · ")}</Text>
              </View>
            );
          }
          if (key === "references" && data.references.length > 0) {
            return (
              <View key={key} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: primary_color }]}>Références</Text>
                {data.references.map((r) => (
                  <Text key={r.id} style={{ fontSize: 9, marginBottom: 2 }}>
                    {r.name} {r.role ? `— ${r.role}` : ""} {r.organization ? `(${r.organization})` : ""}
                  </Text>
                ))}
              </View>
            );
          }
          return null;
        })}
      </Page>
    </Document>
  );
}
