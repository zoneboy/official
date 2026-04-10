import { COLORS, FONTS } from "../styles/tokens";
import { useBreakpoints } from "../hooks";
import { FadeIn } from "../components";

export default function PrivacyPolicyPage() {
  const { isMobile: m } = useBreakpoints();
  const h2 = { fontFamily: FONTS.headline, fontSize: m ? 20 : 26, fontWeight: 800, color: COLORS.primary, marginTop: 40, marginBottom: 14 };
  const h3 = { fontFamily: FONTS.headline, fontSize: m ? 17 : 20, fontWeight: 700, color: COLORS.onSurface, marginTop: 28, marginBottom: 10 };
  const p = { color: COLORS.onSurfaceVariant, fontSize: m ? 14 : 16, lineHeight: 1.8, marginBottom: 14 };

  return (
    <section style={{ maxWidth: 800, margin: "0 auto", padding: m ? "32px 20px 60px" : "60px 32px 100px" }}>
      <FadeIn>
        <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, background: `${COLORS.secondaryContainer}30`, color: COLORS.onSecondaryContainer, fontFamily: FONTS.headline, fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 20 }}>LEGAL</span>
        <h1 style={{ fontFamily: FONTS.headline, fontSize: m ? 32 : 52, fontWeight: 800, color: COLORS.primary, lineHeight: 1, letterSpacing: "-2px", marginBottom: 12 }}>Privacy Policy</h1>
        <p style={{ color: COLORS.onSurfaceVariant, fontSize: 14, marginBottom: 40 }}>Last updated: April 2026</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <p style={p}>The Recyclers Association of Nigeria ("RAN", "we", "our", or "us") is committed to protecting the privacy of our members, website visitors, and stakeholders. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or engage with our services.</p>

        <h2 style={h2}>1. Information We Collect</h2>

        <h3 style={h3}>Personal Information</h3>
        <p style={p}>We may collect personal information that you voluntarily provide to us when you register for membership, subscribe to our newsletter, register for events, fill out contact forms, or otherwise interact with our website. This may include your name, email address, phone number, organization name, job title, and state of residence.</p>

        <h3 style={h3}>Automatically Collected Information</h3>
        <p style={p}>When you visit our website, we may automatically collect certain information about your device, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website. This information is collected using cookies and similar technologies.</p>

        <h2 style={h2}>2. How We Use Your Information</h2>
        <p style={p}>We use the information we collect to operate and maintain our website, send newsletters and communications you have opted into, process membership applications, organize events and notify registered participants, respond to inquiries and provide support, improve our website and services, and comply with legal obligations.</p>

        <h2 style={h2}>3. Information Sharing</h2>
        <p style={p}>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist in operating our website and services (such as email delivery platforms), when required by law or to respond to legal processes, and to protect the rights, property, or safety of RAN, our members, or the public.</p>

        <h2 style={h2}>4. Data Security</h2>
        <p style={p}>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

        <h2 style={h2}>5. Newsletter & Communications</h2>
        <p style={p}>If you subscribe to our newsletter, your email address will be stored with our email service provider (Brevo/Sendinblue). You can unsubscribe at any time by clicking the unsubscribe link in any email we send or by contacting us directly.</p>

        <h2 style={h2}>6. Cookies</h2>
        <p style={p}>Our website may use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us understand how our site is used. You can control cookie preferences through your browser settings.</p>

        <h2 style={h2}>7. Third-Party Links</h2>
        <p style={p}>Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.</p>

        <h2 style={h2}>8. Your Rights</h2>
        <p style={p}>You have the right to access, correct, or delete your personal information held by us, withdraw consent for communications at any time, and request information about how your data is processed. To exercise any of these rights, please contact us using the details below.</p>

        <h2 style={h2}>9. Children's Privacy</h2>
        <p style={p}>Our website and services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children.</p>

        <h2 style={h2}>10. Changes to This Policy</h2>
        <p style={p}>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.</p>

        <h2 style={h2}>11. Contact Us</h2>
        <p style={p}>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
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
