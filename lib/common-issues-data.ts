import type { CommonIssue } from "@/components/student/common-issues"

let commonIssuesList: CommonIssue[] = []

const DEFAULT_ISSUES: CommonIssue[] = [
  {
    issue: "Wi-Fi Not Connecting",
    category: "software",
    fixSteps: [
      "Check if Wi-Fi is enabled on your device",
      "Restart your Wi-Fi adapter (turn off and on)",
      "Forget the network and reconnect",
      "Update network drivers from Device Manager",
      "Reset network settings: Run 'ipconfig /release' and 'ipconfig /renew' in Command Prompt",
      "If still not working, restart your device",
    ],
  },
  {
    issue: "Laptop Won't Turn On",
    category: "hardware",
    fixSteps: [
      "Check if the power adapter is properly connected",
      "Try a different power outlet",
      "Remove the battery (if removable) and try powering on with adapter only",
      "Hold the power button for 30 seconds to reset power",
      "Check for any LED indicators on the device",
      "If no response, the battery or power board may need replacement",
    ],
  },
  {
    issue: "Screen Stays Black",
    category: "hardware",
    fixSteps: [
      "Check if the device is actually on (listen for fan sounds)",
      "Try connecting to an external monitor",
      "Adjust screen brightness (may be turned all the way down)",
      "Press Windows + P to check display settings",
      "Restart the device",
      "If external monitor works, the screen or display cable may be faulty",
    ],
  },
  {
    issue: "Keyboard Keys Not Responding",
    category: "hardware",
    fixSteps: [
      "Restart your device",
      "Check if specific keys or all keys are affected",
      "Update keyboard drivers from Device Manager",
      "Run Windows Troubleshooter for keyboard",
      "Check for physical damage or debris under keys",
      "Try an external keyboard to test if it's hardware or software",
    ],
  },
  {
    issue: "Software Crashes Frequently",
    category: "software",
    fixSteps: [
      "Close all running applications",
      "Update Windows and all software to latest versions",
      "Run Windows Memory Diagnostic tool",
      "Check Task Manager for high CPU/memory usage",
      "Uninstall recently installed software that may be causing conflicts",
      "Run System File Checker: 'sfc /scannow' in Command Prompt as Administrator",
      "If issue persists, backup data and perform a clean reinstall",
    ],
  },
  {
    issue: "Slow Performance",
    category: "software",
    fixSteps: [
      "Close unnecessary programs running in background",
      "Check available disk space (need at least 10% free)",
      "Run Disk Cleanup to remove temporary files",
      "Disable startup programs you don't need",
      "Scan for malware and viruses",
      "Defragment hard drive (if using HDD, not SSD)",
      "Check Task Manager for programs using excessive resources",
      "Consider upgrading RAM if consistently slow",
    ],
  },
  {
    issue: "No Sound/Audio",
    category: "hardware",
    fixSteps: [
      "Check if volume is muted or turned down",
      "Verify audio output device is selected correctly",
      "Test with headphones to isolate speaker issue",
      "Update audio drivers from Device Manager",
      "Run Windows Audio Troubleshooter",
      "Check audio settings in Windows Sound settings",
      "Restart Windows Audio service",
    ],
  },
  {
    issue: "Touchpad Not Working",
    category: "hardware",
    fixSteps: [
      "Check if touchpad is disabled (usually Fn + F key)",
      "Restart your device",
      "Update touchpad drivers from manufacturer website",
      "Check touchpad settings in Windows Settings",
      "Clean the touchpad surface",
      "Try an external mouse to verify if it's hardware issue",
    ],
  },
  {
    issue: "Battery Not Charging",
    category: "hardware",
    fixSteps: [
      "Check if the charging cable is properly connected",
      "Try a different power outlet",
      "Inspect the charging port for debris or damage",
      "Try a different charging adapter if available",
      "Check battery health in Windows Battery settings",
      "Remove battery (if removable) and reinsert it",
      "Update BIOS/UEFI firmware from manufacturer website",
      "If battery is swollen or damaged, stop using immediately and contact IT",
    ],
  },
  {
    issue: "Blue Screen of Death (BSOD)",
    category: "software",
    fixSteps: [
      "Note the error code displayed on the blue screen",
      "Restart your device and see if the issue persists",
      "Check for Windows updates and install them",
      "Update all device drivers, especially graphics and chipset drivers",
      "Run Windows Memory Diagnostic tool",
      "Check disk for errors: Run 'chkdsk C: /f' in Command Prompt as Administrator",
      "Run System File Checker: 'sfc /scannow' in Command Prompt as Administrator",
      "Check Event Viewer for specific error details",
      "If issue continues, backup data and perform a system restore or clean reinstall",
    ],
  },
]

const initializeIssues = () => {
  if (typeof window === "undefined") {
    return
  }

  const stored = localStorage.getItem("commonIssues")
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      commonIssuesList = parsed
      return
    } catch (e) {
      console.error("Error parsing stored common issues:", e)
    }
  }

  // Use default issues if no localStorage data
  commonIssuesList = DEFAULT_ISSUES
  saveIssues()
}

const saveIssues = () => {
  if (typeof window !== "undefined") {
    localStorage.setItem("commonIssues", JSON.stringify(commonIssuesList))
  }
}

export function getCommonIssues(): CommonIssue[] {
  initializeIssues()
  return [...commonIssuesList]
}

export function addCommonIssue(issue: CommonIssue): void {
  initializeIssues()
  commonIssuesList.push(issue)
  saveIssues()
}

export function deleteCommonIssue(index: number): void {
  initializeIssues()
  if (index >= 0 && index < commonIssuesList.length) {
    commonIssuesList.splice(index, 1)
    saveIssues()
  }
}

export function updateCommonIssue(index: number, issue: CommonIssue): void {
  initializeIssues()
  if (index >= 0 && index < commonIssuesList.length) {
    commonIssuesList[index] = issue
    saveIssues()
  }
}

