import ChildComponent from "./local-comps/ChildComponent"
import Transactions from "./local-comps/Transactions"

export default function Home() {
  return (
    <>
      <nav className="fixed inset-x-0 bottom-1/5 inline-flex items-center justify-center">
        <div className="inline-flex w-full max-w-md justify-center">
          <ChildComponent />
        </div>
      </nav>

      {/* // WARN: this main container have min-height: `min-h-dvh` */}
      <main className="min-h-dvh px-4 pt-6" data-vaul-drawer-wrapper="">
        <section className="">
          <Transactions />
        </section>
      </main>
    </>
  )
}
