export function triggerCelebration() {
  // Create canvas container
  const canvas = document.createElement("canvas")
  canvas.style.position = "fixed"
  canvas.style.inset = "0"
  canvas.style.pointerEvents = "none"
  canvas.style.zIndex = "100"
  canvas.style.width = "100vw"
  canvas.style.height = "100vh"
  document.body.appendChild(canvas)

  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Resize handler
  const resize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener("resize", resize)
  resize()

  // Configuration
  const particleCount = 150
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff", "#ff00ff", "#ffa500"]

  // Particle Class
  class Particle {
    x: number
    y: number
    vx: number
    vy: number
    color: string
    size: number
    rotation: number
    rotationSpeed: number
    opacity: number

    constructor() {
      this.x = canvas.width / 2
      this.y = canvas.height / 2
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 15 + 10 // Explosion speed
      this.vx = Math.cos(angle) * speed
      this.vy = Math.sin(angle) * speed - 5 // Initial upward bias
      this.color = colors[Math.floor(Math.random() * colors.length)]
      this.size = Math.random() * 8 + 4
      this.rotation = Math.random() * 360
      this.rotationSpeed = (Math.random() - 0.5) * 10
      this.opacity = 1
    }

    update() {
      this.x += this.vx
      this.y += this.vy
      this.vy += 0.5 // Gravity
      this.vx *= 0.96 // Air resistance
      this.vy *= 0.96
      this.rotation += this.rotationSpeed
      this.opacity -= 0.008 // Fade out
    }

    draw() {
      ctx!.save()
      ctx!.translate(this.x, this.y)
      ctx!.rotate((this.rotation * Math.PI) / 180)
      ctx!.globalAlpha = this.opacity
      ctx!.fillStyle = this.color
      ctx!.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
      ctx!.restore()
    }
  }

  // Create particles
  const particles: Particle[] = []
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }

  // Animation Loop
  let animationId: number
  const animate = () => {
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]
      p.update()
      p.draw()

      if (p.opacity <= 0) {
        particles.splice(i, 1)
      }
    }

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animate)
    } else {
      // Cleanup
      window.removeEventListener("resize", resize)
      if (canvas.parentNode) {
        document.body.removeChild(canvas)
      }
    }
  }

  animate()
}
