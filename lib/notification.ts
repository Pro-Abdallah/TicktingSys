let hasPermission = false

// Sync local permission flag when the module loads (client-only).
if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
  hasPermission = true
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    console.log("Notifications not supported")
    return false
  }

  if (Notification.permission === "granted") {
    hasPermission = true
    return true
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    hasPermission = permission === "granted"
    return hasPermission
  }

  return false
}

export function playNotificationSound() {
  try {
    const audio = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Drop-FSmLRaqnjZtAQAT3HBHH2wK3CenCVz.mp3")
    audio.volume = 0.6
    audio.play().catch((err) => console.log("Audio play failed:", err))
  } catch (error) {
    console.log("Audio error:", error)
  }
}

export function showNotification(title: string, body: string) {
  if (!("Notification" in window)) {
    console.log("Notifications not supported")
    return
  }

  const permissionGranted = Notification.permission === "granted" || hasPermission
  if (!permissionGranted) {
    console.log("No notification permission")
    return
  }

  try {
    hasPermission = true
    const notification = new Notification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag: "ticket-notification",
      requireInteraction: false,
    })

    // Play sound
    playNotificationSound()

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000)
  } catch (error) {
    console.log("Notification error:", error)
  }
}
