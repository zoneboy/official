import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn } from "../components";

export default function TermsOfServicePage() {
  const { isMobile: m } = useBreakpoints();
  const h2 = { fontFamily: FONTS.headline, fontSize: m ? 20 : 26, fontWeight: 800, color: COLORS.primary, marginTop: 40, marginBottom: 14 };
  const h3 = { fontFamily: FONTS.headline, fontSize: m ? 17 : 20, fontWeight: 700, color: COLORS.onSurface, marginTop: 28, marginBottom: 10 };
  const p = { color: COLORS.onSurfaceVariant, fontSize: m ? 14 : 16, lineHeight: 1.8, marginBottom: 14 };

  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: m ? "32px 20px 60px" : "60px 32px 100px" }}>
      <FadeIn>
        <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: `${COLORS.secondaryContainer}30`, color: COLORS.onSecondaryContainer, fontFamily: FONTS.headline, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>LEGAL</span>
        <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 32 : 52, fontWeight: 800, color: COLORS.primary, lineHeight: 1, letterSpacing: "-2px", marginBottom: 12 }}>Terms of Service</h1>
        <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, marginBottom: 40 }}>Last updated: April 2026</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p style={p}>Welcome to the Recyclers Association of Nigeria ("RAN") website. By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our website.</p>

        <h2 style={h2}>1. About RAN</h2>
        <p style={p}>The Recyclers Association of Nigeria is the unified voice of the waste management and recycling sector in Nigeria. Our mission is to promote effective waste management through education, advocacy, and the 4Rs approach: Reduce, Reuse, Repurpose, and Recycle.</p>

        <h2 style={h2}>2. Use of Website</h2>
        <p style={p}>You may use our website for lawful purposes only. You agree not to use the website in any way that violates applicable laws or regulations, to impersonate any person or entity, to interfere with or disrupt the website or its servers, to attempt to gain unauthorized access to any part of the website, or to collect or harvest personal information of other users without consent.</p>

        <h2 style={h2}>3. Membership</h2>

        <h3 style={h3}>Eligibility</h3>
        <p style={p}>Membership in RAN is open to recycling professionals, businesses, and organizations operating within Nigeria's waste management and recycling sector. Membership applications are subject to review and approval by RAN.</p>

        <h3 style={h3}>Membership Obligations</h3>
        <p style={p}>Members are expected to adhere to RAN's code of conduct and ethical standards, pay membership dues as prescribed, participate in association activities in good faith, and maintain professional standards in their recycling operations.</p>

        <h3 style={h3}>Termination of Membership</h3>
        <p style={p}>RAN reserves the right to suspend or terminate membership for violation of these terms, failure to pay dues, conduct that brings the association into disrepute, or any other reason deemed appropriate by the Board of Trustees.</p>

        <h2 style={h2}>4. Intellectual Property</h2>
        <p style={p}>All content on this website, including text, graphics, logos, images, and software, is the property of RAN or its content suppliers and is protected by Nigerian and international copyright laws. You may not reproduce, distribute, modify, or create derivative works from any content without our prior written consent.</p>

        <h2 style={h2}>5. Events & Programs</h2>
        <p style={p}>RAN organizes conferences, workshops, webinars, and other events. Registration for these events is subject to availability. RAN reserves the right to modify event schedules, speakers, or venues as necessary. Event fees, once paid, are subject to our refund policy communicated at the time of registration.</p>

        <h2 style={h2}>6. Newsletter & Communications</h2>
        <p style={p}>By subscribing to our newsletter, you consent to receive periodic emails about RAN activities, industry news, policy updates, and related content. You may unsubscribe at any time using the link provided in each email.</p>

        <h2 style={h2}>7. Resources & Downloads</h2>
        <p style={p}>Documents, reports, and other resources made available for download on our website are provided for informational purposes only. While we strive to ensure accuracy, RAN makes no warranties regarding the completeness or reliability of these materials. Downloaded resources are for personal or organizational use and may not be redistributed commercially without permission.</p>

        <h2 style={h2}>8. Limitation of Liability</h2>
        <p style={p}>RAN provides this website and its services on an "as is" and "as available" basis. To the fullest extent permitted by law, RAN disclaims all warranties, express or implied. RAN shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the website or services.</p>

        <h2 style={h2}>9. External Links</h2>
        <p style={p}>Our website may contain links to external websites or services that are not owned or controlled by RAN. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites.</p>

        <h2 style={h2}>10. Governing Law</h2>
        <p style={p}>These Terms of Service shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Nigeria.</p>

        <h2 style={h2}>11. Changes to These Terms</h2>
        <p style={p}>RAN reserves the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on the website. Your continued use of the website after any changes constitutes your acceptance of the revised terms.</p>

        <h2 style={h2}>12. Contact Us</h2>
        <p style={p}>If you have any questions about these Terms of Service, please contact us at:</p>
        <div style={{ background: COLORS.surfaceContainerLow, borderRadius: 12, padding: m ? 20 : 28, marginTop: 8 }}>
          <p style={{ fontFamily: FONTS.headline, fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Recyclers Association of Nigeria</p>
          <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, lineHeight: 1.8 }}>
            F3, Global Plaza, Kaura District, Abuja, FCT, Nigeria<br />
            Email: ran@recyclersassociation.org<br />
            Phone: +234 907 981 9777
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
