import Link from "next/link"
import { Bot, Workflow, MessageCircle, Database } from "lucide-react"

const items = [
  {
    title: "AI Workflows (n8n)",
    desc: "Custom automation flows that connect your tools, data, and AI into one intelligent system.",
    icon: Workflow,
  },
  {
    title: "AI Chatbots",
    desc: "Website, WhatsApp, and internal AI assistants trained on your business data.",
    icon: Bot,
  },
  {
    title: "Lead & CRM Automation",
    desc: "Automatic lead capture, scoring, follow-ups, and CRM updates without manual work.",
    icon: Database,
  },
  {
    title: "WhatsApp & Integrations",
    desc: "Automated WhatsApp replies, notifications, and integrations with your existing systems.",
    icon: MessageCircle,
  },
]

export function Automation() {
  return (
    <section id="automation" className="py-20">
      <div className="container relative mx-auto px-4 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium">
            Automation & AI Systems
          </div>

          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Automate Your Business.{" "}
            <span className="text-gradient">Not Just Your Website.</span>
          </h2>

          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            We design and deploy custom AI & automation workflows using{" "}
            <span className="text-foreground font-medium">n8n</span>.
            <br />
            From lead handling to CRM updates, WhatsApp follow-ups, internal tools,
            and cross-platform integrations — we automate the work your team shouldn’t do manually.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((it, idx) => (
            <div
              key={it.title}
              className="glass-card group p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 120}ms` }}
            >
              <div className="flex items-center gap-3">
                <it.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                <h3 className="font-semibold">{it.title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {it.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-95"
          >
            Tell us what to automate
          </Link>

          <Link
            href="#ai-chat-trigger"
            className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/10 px-6 py-3 text-sm font-semibold transition hover:bg-primary/15"
          >
            Talk to AI Assistant
          </Link>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Typical results: faster response times, fewer repetitive tasks, and cleaner operations.
        </p>
      </div>
    </section>
  )
}