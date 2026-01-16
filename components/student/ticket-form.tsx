"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createTicket } from "@/lib/ticket-data"
import { CheckCircle, ChevronLeft, ChevronRight, HelpCircle, Monitor, Wifi, Battery, MousePointer, X } from "lucide-react"

// --- Zod Schema ---
const ticketSchema = z.object({
  studentName: z.string().min(2, "Name must be at least 2 characters"),
  department: z.enum(["IS", "CS"]),
  year: z.enum(["senior", "wheeler", "junior"]),
  classYear: z.string().min(1, "Please select your class"),
  instructorName: z.string().min(2, "Instructor name is required"),
  deviceType: z.string().min(1, "Please select your device type"),
  // Strict IPv4 validation regex
  deviceIpAddress: z.string().regex(
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    "Invalid IP address (e.g., 192.168.1.50)"
  ),
  issueCategory: z.string().min(1, "Please select an issue category"),
  issueDescription: z.string().min(10, "Please provide more details about the issue"),
})

type TicketValues = z.infer<typeof ticketSchema>

const defaultValues: Partial<TicketValues> = {
  department: "IS",
  year: "senior",
  deviceType: "HP Zbook G3",
  issueCategory: "software",
}

interface TicketFormProps {
  onTicketCreated: () => void
}

const QUICK_PICKS = [
  {
    icon: <Wifi className="w-4 h-4" />,
    label: "No Wi-Fi",
    description: "I cannot connect to the school network.",
    category: "software",
  },
  {
    icon: <Monitor className="w-4 h-4" />,
    label: "Broken Screen",
    description: "My laptop screen is cracked or not turning on.",
    category: "hardware",
  },
  {
    icon: <Battery className="w-4 h-4" />,
    label: "Battery Issue",
    description: "My laptop battery drains very fast or doesn't charge.",
    category: "hardware",
  },
  {
    icon: <MousePointer className="w-4 h-4" />,
    label: "Trackpad/Mouse",
    description: "My trackpad cursor is freezing or jumping around.",
    category: "hardware",
  },
]

export default function TicketForm({ onTicketCreated }: TicketFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showIPHelper, setShowIPHelper] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<TicketValues>({
    resolver: zodResolver(ticketSchema),
    defaultValues,
    mode: "onChange",
  })

  const { watch, setValue, trigger } = form
  const watchedYear = watch("year")

  // Calculate generic class options based on year
  const getClassOptions = () => {
    const yearNum = watchedYear === "senior" ? 4 : watchedYear === "wheeler" ? 5 : 3
    const baseNum = 1
    return Array.from({ length: 4 }, (_, i) => ({
      value: `${watchedYear.charAt(0).toUpperCase() + watchedYear.slice(1)} ${baseNum + i}`,
      label: `${watchedYear.charAt(0).toUpperCase() + watchedYear.slice(1)} ${baseNum + i}`,
    }))
  }

  // --- Handlers ---
  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
    let value = e.target.value

    // Allow only numbers and dots
    value = value.replace(/[^0-9.]/g, "")

    // Split into segments
    const segments = value.split(".")

    // Enforce max 4 segments
    if (segments.length > 4) {
      // If we have more than 4 segments, truncate the value
      value = segments.slice(0, 4).join(".")
    }

    // Auto-add dot after 3 digits
    // Logic: check the last typed char. If it was a digit, and the current segment is now 3 digits, append dot.
    // However, that might be annoying if user is backspacing.
    // A simpler approach for the "after each 3 numbers" rule:

    // We only modify if the user is ADDING characters (not deleting)
    // But detecting add vs delete in simple change handler is tricky without prev state.
    // Let's use successful pattern matching.

    // If the input ends with 3 digits, and the number of dots is less than 3, add a dot.
    if (/\d{3}$/.test(value) && (value.match(/\./g) || []).length < 3) {
      value += "."
    }

    // Also strictly limit each segment to 3 chars length (technically Zod handles value 255 but UI can stop length)
    // Re-split to check segment lengths
    const checkedSegments = value.split(".").map(seg => seg.slice(0, 3))
    value = checkedSegments.join(".").replace(/\.{2,}/g, ".") // prevent double dots

    fieldChange(value)
  }

  const handleNext = async () => {
    let valid = false
    if (currentStep === 1) {
      valid = await trigger(["studentName", "department", "year", "classYear", "instructorName"])
    } else if (currentStep === 2) {
      valid = await trigger(["deviceType", "deviceIpAddress"])
    }

    if (valid) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleQuickPick = (pick: typeof QUICK_PICKS[0]) => {
    setValue("issueCategory", pick.category)
    setValue("issueDescription", pick.description)
  }

  const onSubmit = async (data: TicketValues) => {
    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const studentId = `STU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      createTicket({
        studentId,
        studentName: data.studentName,
        studentEmail: `${data.studentName.toLowerCase().replace(/\s+/g, ".")}@school.edu`,
        department: data.department as any,
        year: data.year as any,
        classYear: data.classYear,
        instructorName: data.instructorName,
        deviceType: data.deviceType as any,
        deviceIpAddress: data.deviceIpAddress,
        issueDescription: data.issueDescription,
        issueType: data.issueCategory as any,
        issueCategory: data.issueCategory as any,
        status: "open",
        isExternal: false,
      } as any)

      setShowSuccess(true)
      setTimeout(() => {
        onTicketCreated()
      }, 2000)
    } finally {
      setLoading(false)
    }
  }

  const progressPercentage = ((currentStep - 1) / 2) * 100

  return (
    <>
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none animate-in fade-in duration-300">
          <div className="bg-card border-2 border-primary rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300 pointer-events-auto">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-2">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground">Ticket Submitted!</h3>
              <p className="text-muted-foreground mt-2">Help is on the way.</p>
            </div>
          </div>
        </div>
      )}

      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <CardHeader className="pt-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <CardTitle className="text-2xl font-bold">New Support Ticket</CardTitle>
              <CardDescription>
                Step {currentStep} of 3: {currentStep === 1 ? "Your Info" : currentStep === 2 ? "Device Info" : "Issue Details"}
              </CardDescription>
            </div>
            <div className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
              {currentStep === 1 && "Identity"}
              {currentStep === 2 && "Device"}
              {currentStep === 3 && "Problem"}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {currentStep === 1 && (
                <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instructorName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instructor</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select dept" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="IS">Information Systems</SelectItem>
                              <SelectItem value="CS">Computer Science</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val)
                              setValue("classYear", "")
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="senior">Senior</SelectItem>
                              <SelectItem value="wheeler">Wheeler</SelectItem>
                              <SelectItem value="junior">Junior</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="classYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getClassOptions().map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
                  <FormField
                    control={form.control}
                    name="deviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Device Model</FormLabel>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {["HP Zbook G3", "HP Silver", "Dell Latitude"].map((device) => (
                            <div
                              key={device}
                              onClick={() => field.onChange(device)}
                              className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-all ${field.value === device ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                                }`}
                            >
                              <div className={`p-3 rounded-full ${field.value === device ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                <Monitor className="w-5 h-5" />
                              </div>
                              <span className="font-semibold text-sm">{device}</span>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deviceIpAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>IP Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="192.168.1.1"
                              {...field}
                              onChange={(e) => handleIpChange(e, field.onChange)}
                              maxLength={15} // 3*4 + 3 dots
                              className="pr-24 font-mono tracking-wide"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-7 text-xs text-primary hover:text-primary/80"
                              onClick={() => setShowIPHelper(true)}
                            >
                              <HelpCircle className="w-3 h-3 mr-1" />
                              Help?
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          We'll automatically add dots after 3 numbers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Quick Picks</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {QUICK_PICKS.map((pick) => (
                        <button
                          key={pick.label}
                          type="button"
                          onClick={() => handleQuickPick(pick)}
                          className="text-left p-3 border rounded-lg hover:bg-muted/50 transition-colors group flex gap-3 items-start"
                        >
                          <div className="p-2 bg-primary/10 text-primary rounded-md group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {pick.icon}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{pick.label}</div>
                            <div className="text-xs text-muted-foreground line-clamp-1">{pick.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  <FormField
                    control={form.control}
                    name="issueCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="software">Software (Apps, OS, Login)</SelectItem>
                            <SelectItem value="hardware">Hardware (Screen, Battery, Keyboard)</SelectItem>
                            <SelectItem value="network">Network (Wi-Fi, Internet)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="issueDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please describe exactly what is happening..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1 || loading}
            className="w-[100px]"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext} className="w-[100px]">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={loading}
              className="w-[140px] bg-primary hover:bg-primary/90"
            >
              {loading ? "Submitting..." : "Submit Ticket"}
              {!loading && <CheckCircle className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </CardFooter>
      </Card>

      {showIPHelper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <Card className="w-full max-w-md relative animate-in slide-in-from-bottom-8">
            <button
              onClick={() => setShowIPHelper(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
            <CardHeader>
              <CardTitle>Find Your IP Address</CardTitle>
              <CardDescription>Follow these steps on your Windows device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">1</div>
                <p className="text-sm">Press <kbd className="px-1.5 py-0.5 bg-muted rounded border text-xs">Win + R</kbd></p>
              </div>
              <div className="flex gap-3">
                <div className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">2</div>
                <p className="text-sm">Type <code className="text-primary font-mono">cmd</code> and hit Enter</p>
              </div>
              <div className="flex gap-3">
                <div className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">3</div>
                <div className="space-y-1">
                  <p className="text-sm">Type <code className="text-primary font-mono">ipconfig</code> and hit Enter</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-none w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">4</div>
                <p className="text-sm">Look for <strong>IPv4 Address</strong> (e.g., 10.0.0.5)</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setShowIPHelper(false)} className="w-full">Got it</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  )
}
