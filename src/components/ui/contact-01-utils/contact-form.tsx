"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const WHATSAPP_NUMBER = "27696731098";

const services = [
  "Enterprise Website",
  "E-Commerce Site",
  "Booking Website",
  "Landing Page",
  "Something else",
];

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [agreed, setAgreed] = useState(false);

  const update = (field: keyof typeof formData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const sendToWhatsApp = () => {
    const { name, email, phone, service, message } = formData;
    const text = [
      `Hello, my name is ${name}.`,
      `My email is ${email}.`,
      phone && `My number is ${phone}.`,
      service && `I'm interested in: ${service}.`,
      `Here's my message: ${message}`,
    ]
      .filter(Boolean)
      .join(" ");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <Card className="rounded-3xl shadow-[0_7px_14px_#EAEAEA]">
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
        <CardDescription>
          We usually reply within one business day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          className="flex flex-col gap-4"
        >
          <input
            type="hidden"
            name="access_key"
            value="568cac2c-b74a-4c70-a437-a31c4e11eed3"
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="071 234 5678"
                value={formData.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="service">What do you need?</Label>
            <Select
              name="service"
              value={formData.service}
              onValueChange={(value) => update("service", value)}
            >
              <SelectTrigger id="service">
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Tell us about your project"
              className="min-h-[120px]"
              value={formData.message}
              onChange={(e) => update("message", e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="consent"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <Label htmlFor="consent" className="font-normal">
              I agree to be contacted about my enquiry.
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              type="button"
              className="flex-1"
              disabled={!agreed}
              onClick={sendToWhatsApp}
            >
              Send to WhatsApp
            </Button>
            <Button
              type="submit"
              variant="outline"
              className="flex-1"
              disabled={!agreed}
            >
              Submit Form
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
