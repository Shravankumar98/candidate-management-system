import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Users, LayoutDashboard, Columns, Activity } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground">A</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">ATS Command</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6 border border-primary/20">
            Enterprise ATS
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4 leading-tight">
            Hire smarter.<br />Move faster.
          </h1>
          <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto leading-relaxed">
            A complete Applicant Tracking System built for recruitment teams who need clarity, speed, and control over every hire.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/sign-up">Start for free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl">
          {[
            { icon: LayoutDashboard, label: "Live Dashboard", desc: "Pipeline stats at a glance" },
            { icon: Users, label: "Candidate CRM", desc: "Full profiles, notes, history" },
            { icon: Columns, label: "Kanban Pipeline", desc: "Drag-and-drop hiring stages" },
            { icon: Activity, label: "Activity Log", desc: "Every action tracked" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="p-4 rounded-xl border border-border bg-card text-left">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <div className="text-sm font-medium text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-border py-4 text-center">
        <p className="text-xs text-muted-foreground">ATS Command &mdash; Enterprise Candidate Management</p>
      </footer>
    </div>
  );
}
