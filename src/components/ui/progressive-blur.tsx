"use client"

import type React from "react"

import { cn } from "@/lib/utils"

export interface ProgressiveBlurProps {
  className?: string
  height?: string
  position?: "top" | "bottom" | "both"
  blurLevels?: number[]
  children?: React.ReactNode
}

export function ProgressiveBlur({
  className,
  height = "30%",
  position = "bottom",
  blurLevels = [0.5, 1, 2, 4, 8, 16, 32, 64],
}: ProgressiveBlurProps) {
  // Create array with length equal to blurLevels.length - 2 (for before/after pseudo elements)
  const divElements = new Array(blurLevels.length - 2).fill(null)

  const positionClasses: Record<"top" | "bottom" | "both", string> = {
    top: "top-0",
    bottom: "bottom-0",
    both: "inset-y-0",
  }

  const firstLayerMasks: Record<"top" | "bottom" | "both", string> = {
    bottom:
      "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)",
    top: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 12.5%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 37.5%)",
    both: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)",
  }

  const lastLayerMasks: Record<"top" | "bottom" | "both", string> = {
    bottom:
      "linear-gradient(to bottom, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)",
    top: "linear-gradient(to top, rgba(0,0,0,0) 87.5%, rgba(0,0,0,1) 100%)",
    both: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)",
  }

  const getMaskGradient = (
    pos: "top" | "bottom" | "both",
    startPercent: number,
    midPercent: number,
    endPercent: number
  ): string => {
    const gradients: Record<"top" | "bottom" | "both", string> = {
      bottom: `linear-gradient(to bottom, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${endPercent + 12.5}%)`,
      top: `linear-gradient(to top, rgba(0,0,0,0) ${startPercent}%, rgba(0,0,0,1) ${midPercent}%, rgba(0,0,0,1) ${endPercent}%, rgba(0,0,0,0) ${endPercent + 12.5}%)`,
      both: "linear-gradient(rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%, rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%)",
    }
    return gradients[pos]
  }

  return (
    <div
      aria-hidden
      className={cn(
        "gradient-blur pointer-events-none absolute inset-x-0 z-10",
        className,
        positionClasses[position]
      )}
      style={{
        height: position === "both" ? "100%" : height,
      }}
    >
      {/* First blur layer (pseudo element) */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 1,
          backdropFilter: `blur(${blurLevels[0]}px)`,
          WebkitBackdropFilter: `blur(${blurLevels[0]}px)`,
          maskImage: firstLayerMasks[position],
          WebkitMaskImage: firstLayerMasks[position],
        }}
      />

      {/* Middle blur layers */}
      {divElements.map((_, index) => {
        const blurIndex = index + 1
        const startPercent = blurIndex * 12.5
        const midPercent = (blurIndex + 1) * 12.5
        const endPercent = (blurIndex + 2) * 12.5

        const maskGradient = getMaskGradient(
          position,
          startPercent,
          midPercent,
          endPercent
        )

        return (
          <div
            className="absolute inset-0"
            key={`blur-${blurIndex}`}
            style={{
              zIndex: index + 2,
              backdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              WebkitBackdropFilter: `blur(${blurLevels[blurIndex]}px)`,
              maskImage: maskGradient,
              WebkitMaskImage: maskGradient,
            }}
          />
        )
      })}

      {/* Last blur layer (pseudo element) */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: blurLevels.length,
          backdropFilter: `blur(${blurLevels.at(-1)}px)`,
          WebkitBackdropFilter: `blur(${blurLevels.at(-1)}px)`,
          maskImage: lastLayerMasks[position],
          WebkitMaskImage: lastLayerMasks[position],
        }}
      />
    </div>
  )
}
