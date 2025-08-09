
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
          <CardDescription>Last Updated: August 9, 2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            Welcome to JivanIndia.co ("we," "us," or "our"). We are committed to protecting your personal information and respecting your privacy. This Privacy Policy explains how we collect, use, share, and safeguard your personal information when you access or use our website, JivanIndia.co, and related services (collectively, the "Services"). If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@jivanindia.co.
          </p>
          <p>
            By using our Services, you agree to the collection and use of your information in accordance with this Privacy Policy. If you do not agree, please do not use the Services.
          </p>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, information collected automatically, and, in some cases, information from third parties. The types of information we collect include:</p>
            
            <h3 className="font-headline text-lg font-semibold text-foreground mt-4">1.1 Information You Provide</h3>
            <p>We collect personal information you voluntarily provide when you:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Register for an account on the Website.</li>
              <li>Express interest in our products or services (e.g., by filling out forms or subscribing to newsletters).</li>
              <li>Participate in activities on the Website (e.g., surveys, promotions, or forums).</li>
              <li>Contact us via email, forms, or other communication channels.</li>
            </ul>
            <p className="mt-2">This information may include:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Personal Identifiers:</strong> Name, email address, phone number, mailing address.</li>
                <li><strong>Account Details:</strong> Username, password, and other account-related information.</li>
                <li><strong>Payment Information:</strong> Billing details or payment method information (processed securely via third-party payment processors).</li>
                <li><strong>Communications:</strong> Feedback, survey responses, or messages you send us.</li>
            </ul>
            
            <h3 className="font-headline text-lg font-semibold text-foreground mt-4">1.2 Information Collected Automatically</h3>
            <p>When you use the Services, we may automatically collect:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Usage Data:</strong> Pages visited, time spent on the Website, click patterns, and referral URLs.</li>
              <li><strong>Device and Technical Data:</strong> IP address, browser type, operating system, device type, and other technical information.</li>
              <li><strong>Cookies and Tracking Technologies:</strong> Information collected via cookies, web beacons, or similar technologies to enhance your experience and analyze usage. See our Cookie Policy for details. (Note: Add a link to your Cookie Policy if applicable.)</li>
            </ul>

            <h3 className="font-headline text-lg font-semibold text-foreground mt-4">1.3 Information from Third Parties</h3>
            <p>We may receive information from third parties, such as:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Analytics providers (e.g., Google Analytics) for usage statistics.</li>
              <li>Social media platforms if you interact with us via social media.</li>
              <li>Business partners or service providers involved in delivering our Services.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">2. How We Use Your Information</h2>
            <p>We use your personal information for the following purposes, based on our legitimate business interests, to perform a contract with you, with your consent, or to comply with legal obligations:</p>
             <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>To Provide and Improve Services:</strong> Create and manage your account, process transactions, and deliver requested services or products.</li>
                <li><strong>To Communicate:</strong> Respond to your inquiries, send service-related notifications, or provide marketing communications (with your consent, where required).</li>
                <li><strong>To Personalize Your Experience:</strong> Tailor content, recommendations, or advertisements based on your preferences and usage.</li>
                <li><strong>To Analyze and Enhance:</strong> Monitor usage trends, improve the Website’s functionality, and develop new features or services.</li>
                <li><strong>To Ensure Security:</strong> Detect and prevent fraud, unauthorized access, or other harmful activities.</li>
                <li><strong>To Comply with Legal Obligations:</strong> Meet regulatory requirements or respond to legal requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">3. Sharing Your Information</h2>
            <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
             <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>With Your Consent:</strong> When you explicitly agree to share your information (e.g., for a specific promotion).</li>
                <li><strong>With Service Providers:</strong> With trusted third-party vendors (e.g., payment processors, hosting providers, or analytics services) who assist us in operating the Services, subject to strict confidentiality agreements.</li>
                <li><strong>For Legal Purposes:</strong> To comply with applicable laws, regulations, or legal processes (e.g., subpoenas, court orders).</li>
                <li><strong>To Protect Rights:</strong> To enforce our Terms of Service, protect our rights or property, or ensure the safety of our users or the public.</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, where your information may be transferred as part of the transaction, with notice to you where required.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">4. How We Keep Your Information Safe</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal information, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Encryption of sensitive data (e.g., during transmission via SSL/TLS).</li>
                <li>Access controls to limit who can view or process your information.</li>
                <li>Regular security assessments to identify and address vulnerabilities.</li>
            </ul>
            <p className="mt-2">However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security. You are responsible for maintaining the confidentiality of your account credentials.</p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">5. Your Privacy Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
             <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
                <li><strong>Correction:</strong> Request corrections to inaccurate or incomplete information.</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal or contractual obligations.</li>
                <li><strong>Opt-Out:</strong> Opt out of marketing communications or certain data processing (e.g., targeted advertising).</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a structured, commonly used format.</li>
                <li><strong>Restrict Processing:</strong> Request limitations on how we process your data, where applicable.</li>
            </ul>
             <p className="mt-2">To exercise these rights, contact us at privacy@jivanindia.co. We will respond within the timeframes required by applicable law (e.g., 30 days under GDPR, 45 days under CCPA). We may require verification of your identity before processing your request.</p>
          </section>

           <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">6. Data Retention</h2>
            <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, including to meet legal, accounting, or reporting requirements. For example:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Account information is retained while your account is active and for a reasonable period thereafter.</li>
              <li>Transaction data may be retained for compliance with tax or legal obligations (e.g., 7 years in some jurisdictions).</li>
              <li>Usage data may be anonymized and retained for analytics purposes.</li>
            </ul>
            <p className="mt-2">When no longer needed, we securely delete or anonymize your information.</p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">7. International Data Transfers</h2>
            <p>If you are located outside the United States, your information may be transferred to and processed in the United States or other countries where our service providers operate. We ensure appropriate safeguards are in place, such as Standard Contractual Clauses for EU/UK users, to protect your data in compliance with applicable laws.</p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">8. Updates to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Updates will be posted on this page with a revised "Last Updated" date. We may, but are not obligated to, provide additional notice of significant changes. Your continued use of the Services after updates constitutes your acceptance of the revised Privacy Policy.</p>
          </section>

          <section>
             <h2 className="font-headline text-xl font-semibold text-foreground mb-2">9. Contact Us</h2>
             <p>If you have questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us at:</p>
             <div className="mt-2">
                <p>Email: privacy@jivanindia.co</p>
                <p>Based in: JivanIndia.co, Sydney, Australia</p>
             </div>
             <p className="mt-2">If you are in the European Economic Area (EEA) or United Kingdom (UK), you may also contact your local data protection authority if you have concerns about our compliance with data protection laws.</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
