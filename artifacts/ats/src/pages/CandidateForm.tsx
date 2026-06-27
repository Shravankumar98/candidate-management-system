import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useLocation } from "wouter";
import { useCreateCandidate, CandidateStatus } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().optional(),
  currentCompany: z.string().optional(),
  yearsOfExperience: z.coerce.number().min(0).optional().or(z.literal("").transform(() => undefined)),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("").transform(() => undefined)),
  skills: z.string().optional(), // We'll split by comma
  status: z.nativeEnum(CandidateStatus).optional().default(CandidateStatus.applied),
});

export default function CandidateForm() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const createCandidate = useCreateCandidate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      currentCompany: "",
      yearsOfExperience: undefined,
      resumeUrl: undefined,
      skills: "",
      status: CandidateStatus.applied,
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    const payload = {
      ...data,
      skills: data.skills ? data.skills.split(",").map(s => s.trim()).filter(Boolean) : undefined,
    };

    createCandidate.mutate(
      { data: payload as any },
      {
        onSuccess: (res) => {
          toast({ title: "Candidate created", description: "Successfully added to the pipeline." });
          setLocation(`/candidates/${res.id}`);
        },
        onError: () => {
          toast({ variant: "destructive", title: "Error", description: "Failed to create candidate." });
        }
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2 -ml-3 text-muted-foreground">
          <Link href="/candidates"><ArrowLeft className="w-4 h-4 mr-2" /> Back to candidates</Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">New Candidate</h1>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Candidate Information</CardTitle>
          <CardDescription>Enter the details for the new candidate.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jane@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applied Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Frontend Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentCompany"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="5" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Skills (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="React, TypeScript, Node.js" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resumeUrl"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Resume URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/in/..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(CandidateStatus).map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end gap-4 border-t border-border pt-6">
                <Button variant="outline" asChild>
                  <Link href="/candidates">Cancel</Link>
                </Button>
                <Button type="submit" disabled={createCandidate.isPending}>
                  {createCandidate.isPending ? "Creating..." : "Create Candidate"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
