
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export default function ContactUsPage() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSubmitting(false);
        toast({
            title: "Message Sent!",
            description: "Thank you for contacting us. We will get back to you shortly.",
        });
        setName('');
        setEmail('');
        setMessage('');
    };

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-4xl">Contact Us</CardTitle>
          <CardDescription className="text-lg">
            We'd love to hear from you. Reach out with any questions or feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="font-headline text-2xl font-semibold">Get in Touch</h3>
                    <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h4 className="font-semibold">Our Office</h4>
                            <p className="text-muted-foreground">123 Saffron Street, Suite 100<br/>Community City, CA 90210</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h4 className="font-semibold">Email Us</h4>
                            <p className="text-muted-foreground">contact@jivanindia.co</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary mt-1" />
                        <div>
                            <h4 className="font-semibold">Call Us</h4>
                            <p className="text-muted-foreground">(123) 456-7890</p>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                     <div>
                        <Label htmlFor="email">Your Email</Label>
                        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                     <div>
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={5} />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                </form>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
