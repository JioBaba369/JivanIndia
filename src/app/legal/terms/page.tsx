
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Terms of Service</CardTitle>
          <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground space-y-4">
          <p>
            Please read these Terms of Service carefully before using the JivanIndia.co website operated by us.
          </p>
          
          <h2 className="font-headline text-xl font-semibold">1. Conditions of Use</h2>
          <p>
            We will provide their services to you, which are subject to the conditions stated below in this document. Every time you visit this website, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.
          </p>

          <h2 className="font-headline text-xl font-semibold">2. Privacy Policy</h2>
          <p>
            Before you continue using our website we advise you to read our privacy policy regarding our user data collection. It will help you better understand our practices.
          </p>
          
          <h2 className="font-headline text-xl font-semibold">3. User Account</h2>
          <p>
            If you are an owner of an account on this website, you are solely responsible for maintaining the confidentiality of your private user details (username and password). You are responsible for all activities that occur under your account or password.
          </p>
          
          <h2 className="font-headline text-xl font-semibold">4. Applicable Law</h2>
          <p>
            By visiting this website, you agree that the laws of the location, without regard to principles of conflict laws, will govern these terms of service, or any dispute of any sort that might come between JivanIndia.co and you, or its business partners and associates.
          </p>

          <h2 className="font-headline text-xl font-semibold">5. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms from time to time at our sole discretion. Therefore, you should review these page periodically. Your continued use of the Website or our service after any such change constitutes your acceptance of the new Terms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
