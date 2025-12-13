export function triggerCelebration() {
  // Create container for video - transparent, no backdrop
  const container = document.createElement("div")
  container.className = "fixed inset-0 pointer-events-none z-[100]"
  container.style.backgroundColor = "transparent"
  document.body.appendChild(container)

  // Create video element - fullscreen
  const video = document.createElement("video")
  video.src = "/chroma-keyed-video (1).webm"
  video.autoplay = true
  video.muted = false
  video.loop = false
  video.playsInline = true
  video.style.width = "100%"
  video.style.height = "100%"
  video.style.objectFit = "cover"
  video.style.pointerEvents = "none"

  // Play the video
  video.play().catch((err) => {
    console.error("Failed to play celebration video:", err)
    // Try with muted if autoplay fails
    video.muted = true
    video.play().catch((e) => {
      console.error("Failed to play muted video:", e)
      if (container.parentNode) {
        document.body.removeChild(container)
      }
    })
  })

  // Remove container when video ends
  video.addEventListener("ended", () => {
    if (container.parentNode) {
      document.body.removeChild(container)
    }
  })

  // Handle video errors
  video.addEventListener("error", (e) => {
    console.error("Failed to load celebration video:", e)
    if (container.parentNode) {
      document.body.removeChild(container)
    }
  })

  // Handle video load
  video.addEventListener("loadeddata", () => {
    console.log("Celebration video loaded successfully")
  })

  container.appendChild(video)

  // Fallback: remove after 15 seconds if video doesn't end properly
  setTimeout(() => {
    if (container.parentNode) {
      document.body.removeChild(container)
    }
  }, 15000)
}
