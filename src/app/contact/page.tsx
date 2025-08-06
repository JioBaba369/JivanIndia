
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { firestore } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ContactUsPage() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            toast({
                title: "Missing Information",
                description: "Please fill out all fields.",
                variant: "destructive",
            });
            return;
        }
        setIsSubmitting(true);
        
        try {
            await addDoc(collection(firestore, "contacts"), {
                name,
                email,
                message,
                createdAt: serverTimestamp(),
            });

            toast({
                title: "Message Sent!",
                description: "Thank you for contacting us. We will get back to you shortly.",
            });
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error("Error submitting contact form:", error);
            toast({
                title: "Submission Failed",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className="bg-background">
       <section className="relative bg-primary/10 py-20 md:py-32 text-center">
         <div className="absolute inset-0">
            <Image 
                src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwdXMlMjBtYWlsJTIwซองจดหมายfGVufDB8fHx8MTc1NDE5NzQzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="A composition of mail envelopes and contact icons"
                fill
                className="object-cover opacity-10"
                priority
                data-ai-hint="mail envelope"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4 relative">
          <h1 className="font-headline text-4xl font-bold md:text-6xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-lg text-foreground/80">
            We'd love to hear from you. Reach out with any questions, feedback, or inquiries.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 text-center mb-16">
                <Card className="border-none bg-transparent shadow-none">
                    <CardContent className="p-6">
                        <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
                        <h3 className="font-headline text-xl font-semibold">Email Us</h3>
                        <p className="text-muted-foreground mt-2">contact@jivanindia.co</p>
                    </CardContent>
                </Card>
                <Card className="border-none bg-transparent shadow-none">
                    <CardContent className="p-6">
                        <Phone className="h-10 w-10 text-primary mx-auto mb-4" />
                        <h3 className="font-headline text-xl font-semibold">Call Us</h3>
                        <p className="text-muted-foreground mt-2">(123) 456-7890</p>
                    </CardContent>
                </Card>
                <Card className="border-none bg-transparent shadow-none">
                    <CardContent className="p-6">
                        <MapPin className="h-10 w-10 text-primary mx-auto mb-4" />
                        <h3 className="font-headline text-xl font-semibold">Our Office</h3>
                        <p className="text-muted-foreground mt-2">123 Saffron St, Suite 100<br/>Community City, CA 90210</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="max-w-2xl mx-auto shadow-xl shadow-black/5">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Your Name</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Your Email</Label>
                            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="message">Your Message</Label>
                            <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} required rows={5} />
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 animate-spin"/> Sending...</> : 'Send Message'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
      </section>
    </div>
  );
}
