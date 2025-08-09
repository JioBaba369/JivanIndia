
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Terms of Service</CardTitle>
          <CardDescription>Last Updated: August 9, 2025</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>
            Welcome to JivanIndia.co ("Website"). These Terms of Service ("Terms") govern your access to and use of our Website, including any content, features, or services offered (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms and all applicable laws. If you do not agree with these Terms, you may not use or access the Services.
          </p>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or using the Services, you confirm that you have read, understood, and agree to be bound by these Terms, which form a legally binding agreement between you and JivanIndia.co ("we," "us," or "our"). If you are using the Services on behalf of an organization or entity, you represent and warrant that you have the authority to bind that organization to these Terms, and "you" refers to both you and the organization.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">2. Privacy Policy</h2>
            <p>
              Your use of the Services is also subject to our Privacy Policy, which is incorporated into these Terms by reference. Please review the Privacy Policy to understand how we collect, use, store, and disclose your personal information. If you do not agree with the Privacy Policy, you should not use the Services.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">3. User Accounts and Responsibilities</h2>
            <h3 className="font-headline text-lg font-semibold text-foreground mt-4">3.1 Account Creation</h3>
            <p>
              To access certain features of the Services, you may need to create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information updated.
            </p>
            <h3 className="font-headline text-lg font-semibold text-foreground mt-4">3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials, including your username and password. You are also responsible for all activities that occur under your account. You agree to notify us immediately at support@jivanindia.co of any unauthorized use of your account or any other security breach.
            </p>
            <h3 className="font-headline text-lg font-semibold text-foreground mt-4">3.3 Liability</h3>
            <p>
              We are not liable for any loss or damage resulting from your failure to safeguard your account information. You agree not to share your account credentials with others or allow unauthorized access to your account.
            </p>
          </section>
          
          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">4. Use Restrictions</h2>
            <p>You agree not to use the Services for any unlawful or prohibited purpose. Specifically, you may not:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Use the Services in violation of any applicable local, state, national, or international law.</li>
                <li>Attempt to gain unauthorized access to any portion of the Services or any systems or networks connected to the Services.</li>
                <li>Engage in any activity that interferes with or disrupts the Services, including introducing viruses, malware, or other harmful code.</li>
                <li>Reverse-engineer, decompile, or disassemble any software used in the Services.</li>
                <li>Use automated systems (e.g., bots, scripts) to access or scrape content from the Services without prior written consent.</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
            </ul>
             <p className="mt-2">We reserve the right to investigate and take appropriate action, including legal action, against any user who violates these restrictions.</p>
          </section>
          
          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">5. Intellectual Property</h2>
            <p>
             All content, trademarks, logos, and materials available through the Services, including but not limited to text, images, graphics, and software (collectively, "Content"), are the property of JivanIndia.co or its licensors and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of the Content without our prior written permission, except as expressly permitted by these Terms or applicable law.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">6. Termination</h2>
            <p>
              We may suspend or terminate your access to the Services, with or without notice, if you violate these Terms or engage in any activity that we believe is harmful to the Services, our users, or our business. Upon termination, your right to use the Services will immediately cease, and we may delete your account and any associated data, subject to our Privacy Policy. You may also terminate your account at any time by contacting us at support@jivanindia.co. Sections 4, 5, 7, 8, and 9 will survive termination of these Terms.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, JivanIndia.co, its affiliates, officers, directors, employees, and agents will not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the Services, whether based on contract, tort, negligence, strict liability, or otherwise, even if we have been advised of the possibility of such damages. Our total liability to you for any claim arising from these Terms or the Services will not exceed the amount you paid us, if any, to use the Services in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">8. Governing Law and Jurisdiction</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law principles. Any legal action or proceeding arising out of or relating to these Terms will be brought exclusively in the federal or state courts located in New Castle County, Delaware. You irrevocably consent to the personal jurisdiction and venue of these courts.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">9. Dispute Resolution</h2>
            <p>
             Any dispute arising out of or relating to these Terms or the Services will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association (AAA). The arbitration will take place in New Castle County, Delaware, and will be conducted in English. The arbitrator’s decision will be final and binding, and judgment on the award may be entered in any court of competent jurisdiction. Notwithstanding the foregoing, we may seek injunctive or other equitable relief in any court of competent jurisdiction to protect our intellectual property or other rights.
            </p>
          </section>

          <section>
            <h2 className="font-headline text-xl font-semibold text-foreground mb-2">10. Modifications to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at our sole discretion at any time. Changes will be effective upon posting the updated Terms to the Website, with the "Last Updated" date revised accordingly. We may, but are not obligated to, provide additional notice of significant changes. Your continued use of the Services after changes are posted constitutes your acceptance of the updated Terms. It is your responsibility to review these Terms periodically.
            </p>
          </section>
          
          <section>
             <h2 className="font-headline text-xl font-semibold text-foreground mb-2">11. Contact Us</h2>
             <p>If you have any questions, concerns, or complaints about these Terms or the Services, please contact us at:</p>
             <div className="mt-2">
                <p>Email: support@jivanindia.co</p>
                <p>Based in: JivanIndia.co, Sydney Australia</p>
             </div>
          </section>
          
        </CardContent>
      </Card>
    </div>
  );
}
