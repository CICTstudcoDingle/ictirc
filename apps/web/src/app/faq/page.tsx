import type { Metadata } from "next";
import { CircuitBackground } from "@ictirc/ui";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions | IRJICT",
  description: "Common questions about ISSN, paper submission, review process, and publication with IRJICT.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What is an ISSN of IRJICT?",
      answer: "ISSN: 2960-3773 is the International Standard Serial Number of IRJICT (International Research Journal for Information and Communications Technology)."
    },
    {
      question: "Can I submit more than one paper for the same issue?",
      answer: "Yes, you can submit more than one paper for the same issue on IRJICT."
    },
    {
      question: "How can I submit my manuscript at IRJICT?",
      answer: "You can submit your manuscript or paper to the IRJICT through online paper submission or on Email editor@irjict.com."
    },
    {
      question: "How much time does IRJICT take in the manuscript or paper review process?",
      answer: "The editorial board is highly committed to the quick review process of the paper. The review process takes the maximum of 15-20 working days."
    },
    {
      question: "What is the frequency of publication on IRJICT?",
      answer: "IRJICT publish journal two times a year. It publishes two time in a year."
    },
    {
      question: "When will I get the acceptance email if my paper is accepted?",
      answer: "The acceptance letter is provided after the completion of the review process."
    },
    {
      question: "What are the benefits of publishing paper on open access journal?",
      answer: "Open access is the ability of anyone to view and download your article without having to pay. This has been proven to be a good thing, since open access articles are cited more often in other scholarly publications than those articles available only through paid access."
    },
    {
      question: "Where can I submit Copyright Transfer Form?",
      answer: "Download the copyright transfer form and submit at editor@irjict.com."
    },
    {
      question: "Does there any restriction for the number of pages and fee for extra pages?",
      answer: "Maximum 10 pages are allowed in a paper. If it exceeds more than 10 pages, you are advice to revised your paper to reduce the number of pages based on the maximum number of pages required."
    },
    {
      question: "How does the review process work?",
      answer: "The review of articles is done through a double blind peer review. All the articles received by IRJICT (International Research Journal for Information and Communications Technology) are sending to Review Committee after deleting the name of the author to have an unbiased opinion about the research."
    },
    {
      question: "Is there a template available for paper format?",
      answer: "Yes, you can download the paper format from our website."
    },
    {
      question: "How do I contact IRJICT?",
      answer: "You can contact us via email or our contact form."
    },
    {
      question: "What does “call for papers” mean?",
      answer: "A conference, Journal, or organization invites submission of research papers for various topics. The “call for paper” session mentions the review period for the paper. These papers are peer-reviewed and the status of the manuscript is notified to the authors within the specified review period. Also, the “call for papers” provides acceptance of more journals at a single organized platform."
    }
  ];

  return (
    <div className="pt-14 md:pt-16 min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 via-[#4a0000] to-gray-900 text-white py-16 md:py-20 overflow-hidden">
        <CircuitBackground variant="subtle" animated />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gold">Questions</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Most asked questions related to IRJICT
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <details key={index} className="group py-4">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-gray-900 hover:text-maroon transition-colors list-none">
                  <span>{faq.question}</span>
                  <span className="ml-6 flex h-7 w-7 items-center justify-center rounded-full bg-maroon/5 text-maroon transition group-open:rotate-180">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
