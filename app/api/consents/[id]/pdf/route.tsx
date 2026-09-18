import { NextResponse } from "next/server";
import { Document, Page, StyleSheet, Text, View, renderToBuffer } from "@react-pdf/renderer";
import { createClient } from "@/lib/supabase/server";
import { WAIVER_SECTIONS, WAIVER_TITLE } from "@/lib/waiver";
import type { Consent } from "@/lib/types";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 14, marginBottom: 12, fontFamily: "Helvetica-Bold" },
  summaryBox: { marginBottom: 16, padding: 10, backgroundColor: "#f5f3ee", borderRadius: 4 },
  row: { marginBottom: 2 },
  section: { marginBottom: 10 },
  heading: { fontSize: 11, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  paragraph: { marginBottom: 4, lineHeight: 1.4 },
  bullet: { flexDirection: "row", marginBottom: 3 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1, lineHeight: 1.4 },
});

function ConsentPdf({ consent }: { consent: Consent }) {
  const member = consent.members ?? null;
  const memberName = member ? `${member.first_name} ${member.last_name}`.trim() : "Member";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{WAIVER_TITLE}</Text>

        <View style={styles.summaryBox}>
          <Text style={styles.row}>Name: {memberName}</Text>
          <Text style={styles.row}>Email: {member?.email ?? "—"}</Text>
          <Text style={styles.row}>Phone: {member?.phone ?? "—"}</Text>
          <Text style={styles.row}>Date of birth: {member?.date_of_birth ?? "—"}</Text>
          <Text style={styles.row}>Address: {member?.address ?? "—"}</Text>
          <Text style={styles.row}>Medical information: {member?.medical_info ?? "—"}</Text>
          <Text style={styles.row}>
            Accepted: {new Date(consent.accepted_at).toLocaleString()}
          </Text>
        </View>

        {WAIVER_SECTIONS.map((section) => (
          <View key={section.heading} style={styles.section} wrap={false}>
            <Text style={styles.heading}>{section.heading}</Text>
            {section.paragraphs?.map((p) => (
              <Text key={p} style={styles.paragraph}>
                {p}
              </Text>
            ))}
            {section.bullets?.map((b) => (
              <View key={b} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: consent, error } = await supabase
    .from("consents")
    .select(
      "id, member_id, accepted_at, members:member_id(id, first_name, last_name, phone, email, member_id, date_of_birth, address, medical_info)"
    )
    .eq("id", params.id)
    .single();

  if (error || !consent) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const normalizedConsent: Consent = {
    id: consent.id,
    member_id: consent.member_id,
    accepted_at: consent.accepted_at,
    members: (consent.members as Consent["members"]) ?? null,
  };

  const buffer = await renderToBuffer(<ConsentPdf consent={normalizedConsent} />);
  const safeName = ((normalizedConsent.members ? `${normalizedConsent.members.first_name} ${normalizedConsent.members.last_name}` : "member") as string)
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="waiver-${safeName}.pdf"`,
    },
  });
}
