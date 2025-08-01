
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
          <CardDescription>Last updated: July 29, 2024</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to JivanIndia.co. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
          </p>
          
          <h2 className="font-headline text-xl font-semibold">1. What Information We Collect</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website or otherwise when you contact us.
          </p>

          <h2 className="font-headline text-xl font-semibold">2. How We Use Your Information</h2>
          <p>
            We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          
          <h2 className="font-headline text-xl font-semibold">3. Will Your Information Be Shared?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.
          </p>
          
          <h2 className="font-headline text-xl font-semibold">4. How We Keep Your Information Safe</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>

           <h2 className="font-headline text-xl font-semibold">5. Contact Us</h2>
          <p>
            If you have questions or comments about this policy, you may email us at privacy@jivanindia.co.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
