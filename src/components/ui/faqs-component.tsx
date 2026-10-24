'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

// Answers are based on what the Pricing section already lists.
const faqItems = [
    {
        id: 'item-1',
        question: 'Which package is right for my business?',
        answer: 'The Enterprise Website (R5,000) suits businesses that need a professional multi-page site. The E-Commerce Site (R10,000) is for selling products online, and the Booking Website (R20,000) is for businesses that take appointments. Not sure? Send us a message and we will recommend one.',
    },
    {
        id: 'item-2',
        question: 'Is a domain and business email included?',
        answer: 'Yes. Every package includes a domain with business email addresses, plus basic SEO, a WhatsApp button and a Google map frame.',
    },
    {
        id: 'item-3',
        question: 'Do I get branding items as well?',
        answer: 'Yes. All packages include a business card, email signature, letterhead and invoice design.',
    },
    {
        id: 'item-4',
        question: 'Can I manage my own products or content?',
        answer: 'The E-Commerce and Booking packages include an admin panel with a secure login and a content management system, so you can update products, services and content yourself.',
    },
    {
        id: 'item-5',
        question: 'Can I get a mobile app with my booking website?',
        answer: 'Yes. A mobile app can be added to the Booking Website package for an extra R10,000.',
    },
    {
        id: 'item-6',
        question: 'How do I get started?',
        answer: 'Fill in our contact form, WhatsApp or call us on 069 673 1098, or email info@sekwaticode.com. We will chat about what you need and take it from there.',
    },
]

const ContactPrompt = ({ className }: { className: string }) => (
    <p className={`text-white/60 ${className}`}>
        Can&apos;t find what you&apos;re looking for? Contact our{' '}
        <Link
            href="/contact"
            className="font-medium text-white hover:underline">
            customer support team
        </Link>
    </p>
)

export default function FAQs() {
    return (
        <section
            className="bg-[#0a0a0a] py-16 text-white md:py-24"
            id="FAQs">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-8 md:grid-cols-5 md:gap-12">
                    <div className="md:col-span-2">
                        <h2 className="text-4xl font-semibold">FAQs</h2>
                        <p className="mt-4 text-balance text-lg text-white/60">Your questions answered</p>
                        <ContactPrompt className="mt-6 hidden md:block" />
                    </div>

                    <div className="md:col-span-3">
                        <Accordion
                            type="single"
                            collapsible>
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="border-white/10">
                                    <AccordionTrigger className="cursor-pointer text-left text-base hover:no-underline">{item.question}</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-base text-white/70">{item.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <ContactPrompt className="md:hidden" />
                </div>
            </div>
        </section>
    )
}
