const generateColorVariants = (
  baseColor: string,
  mixColor?: string
): string[] => {
  const variants: string[] = []
  for (let i = 1; i <= 10; i++) {
    const percentage = i * 10
    variants.push(
      `color-mix(in oklab, ${baseColor} ${percentage}%, ${mixColor || "white"})`
    )
  }
  return variants
}

export { generateColorVariants }
