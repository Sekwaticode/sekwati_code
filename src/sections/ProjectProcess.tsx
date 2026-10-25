import HowItWorks, { type Step } from "@/components/ui/how-it-works";

const projectSteps: Step[] = [
  {
    title: "Enquire & Register",
    description:
      "Send an enquiry and create your client account. Your portal is where you manage meetings, proposals, payments, progress and communication.",
    colorTheme: "orange",
  },
  {
    title: "Book a Discovery Call",
    description:
      "Schedule a call and share your business, requirements, goals, budget and timeline so we can assess your needs and scope the work.",
    colorTheme: "blue",
  },
  {
    title: "Proposal & Quotation",
    description:
      "We send a detailed proposal: scope, deliverables, timeline, total cost, deposit and milestones. Review and accept it in your portal.",
    colorTheme: "purple",
  },
  {
    title: "Secure Escrow Funding",
    description:
      "Fund the project through a trusted escrow provider. Pay at least the agreed deposit, not the full fee, and track your balance in the portal.",
    colorTheme: "orange",
  },
  {
    title: "Milestone-Based Delivery",
    description:
      "The project is split into milestones, each with deliverables, acceptance criteria, a payment amount and a due date. Follow every update live.",
    colorTheme: "blue",
  },
  {
    title: "Approve & Release Funds",
    description:
      "Review each milestone and approve it or request corrections. Only approved milestones are paid; future funds stay safely in escrow.",
    colorTheme: "purple",
  },
  {
    title: "Final Delivery & Handover",
    description:
      "Receive your final deliverables, credentials, documentation and any deployment or maintenance plan. Your full project history stays in the portal.",
    colorTheme: "orange",
  },
];

export const ProjectProcess = () => {
  return (
    <section className="pt-24" id="How-It-Works">
      <div className="container">
        <div className="section-heading">
          <h2 className="section-title">How Your Project Works</h2>
          <p className="section-description mt-5">
            From your first enquiry to final handover, every step is clear,
            tracked in your client portal, and protected by milestone-based
            escrow payments.
          </p>
        </div>
      </div>
      <HowItWorks features={projectSteps} className="mt-10" />
    </section>
  );
};
