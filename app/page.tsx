"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Wrench, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("student")
  const [studentEmail, setStudentEmail] = useState("")
  const [itUsername, setItUsername] = useState("")
  const [itPassword, setItPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (studentEmail) {
      setLoading(true)
      setTimeout(() => {
        window.location.href = `/student?email=${encodeURIComponent(studentEmail)}`
      }, 400)
    }
  }

  const handleITLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (itUsername && itPassword) {
      setLoading(true)
      setTimeout(() => {
        window.location.href = `/it?user=${encodeURIComponent(itUsername)}`
      }, 400)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 opacity-100 transition-opacity duration-300">
      <div className="w-full max-w-md opacity-100 transition-all duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Wrench className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">IT Support Portal</h1>
          <p className="text-muted-foreground">Device repair management system</p>
        </div>

        {/* Login card */}
        <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 bg-card">
          <CardContent className="pt-8 pb-8 px-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-muted p-1 rounded-lg gap-1">
                <TabsTrigger
                  value="student"
                  className="gap-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm text-muted-foreground data-[state=inactive]:hover:text-foreground transition-all font-semibold"
                >
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Student</span>
                </TabsTrigger>
                <TabsTrigger
                  value="it"
                  className="gap-2 rounded-md data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:shadow-sm text-muted-foreground data-[state=inactive]:hover:text-foreground transition-all font-semibold"
                >
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">IT Staff</span>
                </TabsTrigger>
              </TabsList>

              {/* Student Login */}
              <TabsContent value="student" className="space-y-5 opacity-100 transition-opacity duration-300">
                <form onSubmit={handleStudentLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="student-email" className="text-sm font-semibold text-foreground">
                      Email Address
                    </Label>
                    <Input
                      id="student-email"
                      type="email"
                      placeholder="you@school.edu"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                      className="input-modern"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={!studentEmail || loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* IT Staff Login */}
              <TabsContent value="it" className="space-y-5 opacity-100 transition-opacity duration-300">
                <form onSubmit={handleITLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="it-username" className="text-sm font-semibold text-foreground">
                      Username
                    </Label>
                    <Input
                      id="it-username"
                      type="text"
                      placeholder="admin"
                      value={itUsername}
                      onChange={(e) => setItUsername(e.target.value)}
                      required
                      className="input-modern"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="it-password" className="text-sm font-semibold text-foreground">
                      Password
                    </Label>
                    <Input
                      id="it-password"
                      type="password"
                      placeholder="••••••••"
                      value={itPassword}
                      onChange={(e) => setItPassword(e.target.value)}
                      required
                      className="input-modern"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2"
                    disabled={!itUsername || !itPassword || loading}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        Login
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border opacity-100 transition-all duration-500">
          <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">Student:</span> Any email
            </p>
            <p>
              <span className="font-semibold text-foreground">IT Staff:</span> admin / demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
