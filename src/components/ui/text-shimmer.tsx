/**
 * Code snippet from reactbits
 * https://reactbits.dev/text-animations/shiny-text
 */

"use client"

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "motion/react"
import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"

/** Returns progress [0, 100] for a single forward cycle with optional end-delay. */
function calcLinearProgress(
  elapsed: number,
  animationDuration: number,
  delayDuration: number
): number {
  const cycleDuration = animationDuration + delayDuration
  const cycleTime = elapsed % cycleDuration

  if (cycleTime < animationDuration) {
    return (cycleTime / animationDuration) * 100
  }

  return 100
}

/** Returns progress [0, 100] for a yoyo (forward -> hold -> reverse -> hold) cycle. */
function calcYoyoProgress(
  elapsed: number,
  animationDuration: number,
  delayDuration: number
): number {
  const cycleDuration = animationDuration + delayDuration
  const fullCycle = cycleDuration * 2
  const cycleTime = elapsed % fullCycle

  if (cycleTime < animationDuration) {
    return (cycleTime / animationDuration) * 100
  }

  if (cycleTime < cycleDuration) {
    return 100
  }

  if (cycleTime < cycleDuration + animationDuration) {
    const reverseTime = cycleTime - cycleDuration
    return 100 - (reverseTime / animationDuration) * 100
  }

  return 0
}

interface ShinyTextProps {
  text: string
  ariaLabel?: string
  disabled?: boolean
  speed?: number
  className?: string
  color?: string
  shineColor?: string
  spread?: number
  yoyo?: boolean
  pauseOnHover?: boolean
  direction?: "left" | "right"
  delay?: number
}

const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  ariaLabel,
  disabled = false,
  speed = 2,
  className = "",
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
  delay = 0,
}) => {
  const [isPaused, setIsPaused] = useState(false)
  const progress = useMotionValue(0)
  const elapsedRef = useRef(0)
  const lastTimeRef = useRef<number | null>(null)
  const directionRef = useRef(direction === "left" ? 1 : -1)

  const animationDuration = speed * 1000
  const delayDuration = delay * 1000

  useAnimationFrame((time) => {
    if (disabled || isPaused) {
      lastTimeRef.current = null
      return
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time
      return
    }

    const deltaTime = time - lastTimeRef.current
    lastTimeRef.current = time
    elapsedRef.current += deltaTime

    const p = yoyo
      ? calcYoyoProgress(elapsedRef.current, animationDuration, delayDuration)
      : calcLinearProgress(elapsedRef.current, animationDuration, delayDuration)

    progress.set(directionRef.current === 1 ? p : 100 - p)
  })

  useEffect(() => {
    directionRef.current = direction === "left" ? 1 : -1
    elapsedRef.current = 0
    progress.set(directionRef.current === 1 ? 0 : 100)
  }, [direction, progress])

  // Transform: p=0 -> 150% (shine off right), p=100 -> -50% (shine off left)
  const backgroundPosition = useTransform(
    progress,
    (p) => `${150 - p * 2}% center`
  )

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true)
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false)
  }, [pauseOnHover])

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }

  return (
    <motion.span
      aria-label={ariaLabel}
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ ...gradientStyle, backgroundPosition }}
    >
      {text}
    </motion.span>
  )
}

export default ShinyText
