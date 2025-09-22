"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, Smartphone, HardDrive, Trash2, CheckCircle, AlertTriangle, Lock, Zap, Terminal, X } from "lucide-react"

export default function DataWiperApp() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [wipingProgress, setWipingProgress] = useState(0)
  const [isWiping, setIsWiping] = useState(false)
  const [currentStep, setCurrentStep] = useState("idle")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [confirmInput, setConfirmInput] = useState("")
  const [scriptStep, setScriptStep] = useState(0)

  const handleScan = () => {
    setIsScanning(true)
    setCurrentStep("scanning")
    setScanProgress(0)

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsScanning(false)
          setCurrentStep("ready")
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const handleWipe = () => {
    setShowConfirmDialog(true)
  }

  const executeWipeScript = () => {
    setShowConfirmDialog(false)
    setShowTerminal(true)
    setTerminalOutput([])
    setScriptStep(0)

    const scriptLines = [
      "#!/bin/bash",
      "Checking Android encryption status...",
      "state=$(adb shell getprop ro.crypto.state | tr -d '\\r')",
      "Device reports: ENCRYPTED.",
      "A factory reset will destroy the encryption keys and make old data unrecoverable.",
      "",
      "Type 'WIPE' (all caps) to confirm a full factory reset:",
    ]

    let currentLine = 0
    const interval = setInterval(() => {
      if (currentLine < scriptLines.length) {
        setTerminalOutput((prev) => [...prev, scriptLines[currentLine]])
        currentLine++
      } else {
        clearInterval(interval)
        setScriptStep(1) // Ready for confirmation
      }
    }, 800)
  }

  const handleWipeConfirmation = () => {
    if (confirmInput === "WIPE") {
      setScriptStep(2)
      const finalLines = [
        "Sending factory reset broadcast...",
        "adb shell am broadcast -a android.intent.action.MASTER_CLEAR",
        "Reset requested. The device will reboot and erase all user data.",
        "",
        "✓ WIPE COMPLETED SUCCESSFULLY",
      ]

      let currentLine = 0
      const interval = setInterval(() => {
        if (currentLine < finalLines.length) {
          setTerminalOutput((prev) => [...prev, finalLines[currentLine]])
          currentLine++
        } else {
          clearInterval(interval)
          setTimeout(() => {
            setShowTerminal(false)
            setIsWiping(true)
            setCurrentStep("wiping")
            setWipingProgress(0)

            const wipingInterval = setInterval(() => {
              setWipingProgress((prev) => {
                if (prev >= 100) {
                  clearInterval(wipingInterval)
                  setIsWiping(false)
                  setCurrentStep("complete")
                  return 100
                }
                return prev + 1
              })
            }, 80)
          }, 2000)
        }
      }, 1000)
    } else {
      setTerminalOutput((prev) => [...prev, "Cancelled."])
      setTimeout(() => {
        setShowTerminal(false)
        setScriptStep(0)
        setConfirmInput("")
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-sm bg-card border-x border-border min-h-screen relative">
        <div className="flex items-center justify-between px-6 py-2 text-xs text-muted-foreground border-b border-border">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 border border-current rounded-sm">
              <div className="w-3/4 h-full bg-current rounded-sm"></div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8 text-center border-b border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">SecureWipe Pro</h1>
          <p className="text-sm text-muted-foreground">Military-grade data destruction</p>
        </div>

        <div className="p-6 space-y-6 pb-24">
          <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
            <div className="flex items-center gap-3 mb-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <span className="font-medium text-card-foreground">Device Status</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Storage</span>
                <span className="text-card-foreground">128 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Free Space</span>
                <span className="text-card-foreground">45.2 GB</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Security Level</span>
                <Badge variant="secondary" className="text-xs">
                  <Lock className="w-3 h-3 mr-1" />
                  Military
                </Badge>
              </div>
            </div>
          </Card>

          {currentStep !== "idle" && (
            <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
              <div className="flex items-center gap-3 mb-3">
                <HardDrive className="w-5 h-5 text-accent" />
                <span className="font-medium text-card-foreground">Scan Results</span>
              </div>

              {isScanning && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Scanning...</span>
                    <span className="text-card-foreground">{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
              )}

              {currentStep === "ready" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <span>2,847 recoverable files found</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-muted-foreground">Photos</div>
                      <div className="font-medium text-card-foreground">1,234 files</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-muted-foreground">Documents</div>
                      <div className="font-medium text-card-foreground">567 files</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-muted-foreground">Messages</div>
                      <div className="font-medium text-card-foreground">892 files</div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <div className="text-muted-foreground">Other</div>
                      <div className="font-medium text-card-foreground">154 files</div>
                    </div>
                  </div>
                </div>
              )}

              {isWiping && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Wiping data...</span>
                    <span className="text-card-foreground">{wipingProgress}%</span>
                  </div>
                  <Progress value={wipingProgress} className="h-2" />
                  <div className="text-xs text-muted-foreground">Pass 3 of 7 - DoD 5220.22-M Standard</div>
                </div>
              )}

              {currentStep === "complete" && (
                <div className="flex items-center gap-2 text-sm text-accent">
                  <CheckCircle className="w-4 h-4" />
                  <span>Data wiping completed successfully</span>
                </div>
              )}
            </Card>
          )}

          <div className="space-y-3">
            {currentStep === "idle" && (
              <Button
                onClick={handleScan}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isScanning}
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Deep Scan
              </Button>
            )}

            {currentStep === "ready" && (
              <Button
                onClick={handleWipe}
                className="w-full h-12 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
                disabled={isWiping}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Secure Wipe Data
              </Button>
            )}

            {currentStep === "complete" && (
              <Button
                onClick={() => {
                  setCurrentStep("idle")
                  setScanProgress(0)
                  setWipingProgress(0)
                }}
                className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
            )}
          </div>

          <Card className="p-4 bg-card/50 backdrop-blur-sm border border-border/50">
            <h3 className="font-medium text-card-foreground mb-3">Security Features</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">DoD 5220.22-M Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">7-Pass Overwrite</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Forensic Verification</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Certificate Generation</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-card/80 backdrop-blur-md border-t border-border">
          <div className="flex items-center justify-around py-4">
            <Button variant="ghost" size="sm" className="flex flex-col gap-1">
              <Shield className="w-5 h-5" />
              <span className="text-xs">Secure</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col gap-1">
              <HardDrive className="w-5 h-5" />
              <span className="text-xs">Storage</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex flex-col gap-1">
              <Trash2 className="w-5 h-5" />
              <span className="text-xs">Wipe</span>
            </Button>
          </div>
        </div>

        {showConfirmDialog && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <Card className="w-full max-w-sm p-6 bg-card border border-destructive/20">
              <div className="text-center mb-6">
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-lg font-bold text-card-foreground mb-2">Confirm Data Wipe</h3>
                <p className="text-sm text-muted-foreground">
                  This will permanently erase all data on your device. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={executeWipeScript}
                  className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  <Terminal className="w-4 h-4 mr-2" />
                  Execute
                </Button>
              </div>
            </Card>
          </div>
        )}

        {showTerminal && (
          <div className="absolute inset-0 bg-black/95 backdrop-blur-sm flex flex-col p-4 z-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-card-foreground">Wipe Script Terminal</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTerminal(false)
                  setScriptStep(0)
                  setConfirmInput("")
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <Card className="flex-1 bg-black/50 border border-accent/20 p-4 font-mono text-sm overflow-y-auto">
              {terminalOutput.map((line, index) => (
                <div key={index} className={`mb-1 ${line.startsWith("✓") ? "text-accent" : "text-green-400"}`}>
                  {line.startsWith("#!/bin/bash") ? (
                    <span className="text-muted-foreground">{line}</span>
                  ) : line.includes("ENCRYPTED") ? (
                    <span className="text-accent font-bold">{line}</span>
                  ) : line.includes("✓") ? (
                    <span className="text-accent font-bold">{line}</span>
                  ) : (
                    <span>{line}</span>
                  )}
                </div>
              ))}

              {scriptStep === 1 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <input
                      type="text"
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleWipeConfirmation()}
                      className="bg-transparent border-none outline-none text-green-400 flex-1"
                      placeholder="Type 'WIPE' to confirm..."
                      autoFocus
                    />
                  </div>
                  <Button
                    onClick={handleWipeConfirmation}
                    className="mt-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    size="sm"
                  >
                    Execute Command
                  </Button>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
