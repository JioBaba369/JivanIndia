
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function LegalPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">Legal Center</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
            <p className="text-muted-foreground mb-8">
                Here you can find important legal documents regarding our services.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="items-center">
                         <FileText className="h-10 w-10 text-primary mb-2" />
                        <CardTitle className="font-headline text-2xl">Privacy Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <p className="text-muted-foreground mb-4">How we handle your data.</p>
                        <Button asChild>
                            <Link href="/legal/privacy">View Policy</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="items-center">
                         <FileText className="h-10 w-10 text-primary mb-2" />
                        <CardTitle className="font-headline text-2xl">Terms of Service</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <p className="text-muted-foreground mb-4">The rules for using our platform.</p>
                         <Button asChild>
                            <Link href="/legal/terms">View Terms</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
