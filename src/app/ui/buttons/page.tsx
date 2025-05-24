"use client"

import {useRef} from "react"

import {Button} from "@/components/ui/button"

export default function Page() {
  const thatRef = useRef(null)
  return (
    <main className="p-6">
      <section className="">
        <Button
          ref={thatRef}
          onPress={() => {
            console.log(thatRef.current)
          }}
        >
          Download CV.
        </Button>
      </section>

      <section className="mt-2 flex flex-wrap gap-1">
        {["gray", "filled", "tinted", "ghost"].map(variant => (
          <section className="mt-2 flex flex-wrap gap-1" key={variant}>
            {[
              "gray",
              "blue",
              "red",
              "orange",
              "yellow",
              "green",
              "mint",
              "teal",
              "cyan",
              "indigo",
              "purple",
              "pink",
              "brown",
            ].map(color => (
              <Button variant={variant as never} color={color as never} key={color}>
                {color}
              </Button>
            ))}
          </section>
        ))}
      </section>
    </main>
  )
}
