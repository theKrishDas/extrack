import ChildComponent from "./local-comps/ChildComponent"

export default function Home() {
  return (
    // WARN: this main container have min-height: `min-h-dvh`
    <main className="min-h-dvh px-4" data-vaul-drawer-wrapper="">
      <nav className="fixed inset-x-0 bottom-1/5 inline-flex items-center justify-center">
        <div className="inline-flex w-full max-w-md justify-center">
          <ChildComponent />
        </div>
      </nav>
    </main>
  )
}
