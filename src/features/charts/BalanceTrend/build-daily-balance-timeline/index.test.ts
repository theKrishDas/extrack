import { endOfDay, set } from "date-fns"
import { describe, expect, it } from "vitest"
import { buildDailyBalanceTimeline } from "."

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns a timestamp (ms) for a date offset from referenceDate by `daysAgo`. */
function daysAgo(daysAgo: number, ref: Date = REFERENCE_DATE): number {
  const d = new Date(ref)
  d.setDate(d.getDate() - daysAgo)
  return d.getTime()
}

/** Midnight (SOD) of a date offset from referenceDate by `daysAgo`. */
function midnightOf(daysAgo: number, ref: Date = REFERENCE_DATE): Date {
  const d = new Date(ref)
  d.setDate(d.getDate() - daysAgo)
  d.setHours(0, 0, 0, 0)
  return d
}

// Fixed reference date for deterministic tests.
const REFERENCE_DATE = new Date("2024-06-15T23:59:59.999Z")

// ---------------------------------------------------------------------------
// Baseline
// ---------------------------------------------------------------------------

describe("baseline — no transactions", () => {
  it("days=0: returns 1 entry equal to currentBalance", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [],
      balanceAsOf: 1000,
      lookbackDays: 0,
      referenceDate: REFERENCE_DATE,
    })
    expect(result).toHaveLength(1)
    expect(result[0].balance).toBe(1000)
  })

  it("days=1: returns 2 entries, all flat at currentBalance", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [],
      balanceAsOf: 1000,
      lookbackDays: 1,
      referenceDate: REFERENCE_DATE,
    })
    expect(result).toHaveLength(2)
    for (const entry of result) expect(entry.balance).toBe(1000)
  })

  it("days=29: returns 30 entries, all flat at currentBalance", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [],
      balanceAsOf: 5000,
      lookbackDays: 29,
      referenceDate: REFERENCE_DATE,
    })
    expect(result).toHaveLength(30)
    for (const entry of result) expect(entry.balance).toBe(5000)
  })

  it("days=0 with transactions in input: single entry still equals currentBalance", () => {
    // Transactions on today are already baked into currentBalance.
    const result = buildDailyBalanceTimeline({
      transactions: [{ amount: 200, type: "income", date: daysAgo(0) }],
      balanceAsOf: 1000,
      lookbackDays: 0,
      referenceDate: REFERENCE_DATE,
    })
    expect(result).toHaveLength(1)
    expect(result[0].balance).toBe(1000)
  })
})

// ---------------------------------------------------------------------------
// Output shape & order
// ---------------------------------------------------------------------------

describe("output shape", () => {
  it("length is always days + 1", () => {
    for (const days of [0, 1, 7, 14, 29, 59]) {
      const result = buildDailyBalanceTimeline({
        transactions: [],
        balanceAsOf: 0,
        lookbackDays: days,
        referenceDate: REFERENCE_DATE,
      })
      expect(result).toHaveLength(days + 1)
    }
  })

  it("sorted ascending: output[0] is oldest, output[days] is today", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [],
      balanceAsOf: 100,
      lookbackDays: 29,
      referenceDate: REFERENCE_DATE,
    })
    expect(result[0].date.getTime()).toBeLessThan(result[29].date.getTime())
    expect(result[29].date).toEqual(midnightOf(0))
  })

  it("each date is normalized to midnight (SOD) with no time component", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [],
      balanceAsOf: 100,
      lookbackDays: 5,
      referenceDate: REFERENCE_DATE,
    })
    for (const entry of result) {
      expect(entry.date.getHours()).toBe(0)
      expect(entry.date.getMinutes()).toBe(0)
      expect(entry.date.getSeconds()).toBe(0)
      expect(entry.date.getMilliseconds()).toBe(0)
    }
  })

  it("each date object is a distinct reference (mutation safety)", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [],
      balanceAsOf: 100,
      lookbackDays: 3,
      referenceDate: REFERENCE_DATE,
    })
    const dates = result.map((e) => e.date)
    for (let i = 0; i < dates.length; i++) {
      for (let j = i + 1; j < dates.length; j++) {
        expect(dates[i]).not.toBe(dates[j])
      }
    }
  })

  it("output[0].date is exactly (referenceDate - days) at midnight", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [],
      balanceAsOf: 100,
      lookbackDays: 10,
      referenceDate: REFERENCE_DATE,
    })
    expect(result[0].date).toEqual(midnightOf(10))
  })
})

// ---------------------------------------------------------------------------
// Back-calculation — single transaction
// ---------------------------------------------------------------------------

describe("back-calculation — single transaction", () => {
  it("income on day 5 ago: days before it = currentBalance - amount", () => {
    // currentBalance = 1000 includes this income of 200.
    // Before day-5: 1000 - 200 = 800. On and after day-5: 1000.
    const result = buildDailyBalanceTimeline({
      transactions: [{ amount: 200, type: "income", date: daysAgo(5) }],
      balanceAsOf: 1000,
      lookbackDays: 9,
      referenceDate: REFERENCE_DATE,
    })
    // output[0..3] = days 9..6 ago (before the income)
    for (let i = 0; i <= 3; i++) expect(result[i].balance).toBe(800)
    // output[5..9] = days 5..0 ago (on/after the income)
    for (let i = 4; i <= 9; i++) expect(result[i].balance).toBe(1000)
  })

  it("expense on day 3 ago: days before it = currentBalance + amount", () => {
    // currentBalance = 700 includes this expense of 300.
    // Before day-3: 700 + 300 = 1000. On and after day-3: 700.
    const result = buildDailyBalanceTimeline({
      transactions: [{ amount: 300, type: "expense", date: daysAgo(3) }],
      balanceAsOf: 700,
      lookbackDays: 6,
      referenceDate: REFERENCE_DATE,
    })
    for (let i = 0; i <= 2; i++) expect(result[i].balance).toBe(1000)
    for (let i = 3; i <= 6; i++) expect(result[i].balance).toBe(700)
  })

  it("transaction on today (day 0): all prior days = currentBalance - net of today", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [{ amount: 500, type: "income", date: daysAgo(0) }],
      balanceAsOf: 1500,
      lookbackDays: 3,
      referenceDate: REFERENCE_DATE,
    })
    // prior days: 1500 - 500 = 1000
    for (let i = 0; i < 3; i++) expect(result[i].balance).toBe(1000)
    expect(result[3].balance).toBe(1500)
  })

  it("transaction on oldest day: all subsequent days carry same balance", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [{ amount: 100, type: "expense", date: daysAgo(4) }],
      balanceAsOf: 900,
      lookbackDays: 4,
      referenceDate: REFERENCE_DATE,
    })
    // output[0] = day-4: 900. output[1..4] = 900 (carried forward)
    for (const entry of result) expect(entry.balance).toBe(900)
    // Before day-4 (nothing in window): pre-window = 900 + 100 = 1000, not in output
  })
})

// ---------------------------------------------------------------------------
// Back-calculation — multiple transactions
// ---------------------------------------------------------------------------

describe("back-calculation — multiple transactions", () => {
  it("multiple transactions on different days: balance steps correctly", () => {
    // currentBalance = 1000
    // income 200 on day-5, expense 100 on day-2
    // pre-window balance = 1000 - 200 + 100 = 900
    // day-7..day-6: 900, day-5..day-3: 1100, day-2..day-0: 1000
    const result = buildDailyBalanceTimeline({
      transactions: [
        { amount: 200, type: "income", date: daysAgo(5) },
        { amount: 100, type: "expense", date: daysAgo(2) },
      ],
      balanceAsOf: 1000,
      lookbackDays: 7,
      referenceDate: REFERENCE_DATE,
    })
    expect(result[0].balance).toBe(900) // day-7
    expect(result[1].balance).toBe(900) // day-6
    expect(result[2].balance).toBe(1100) // day-5 (income applied)
    expect(result[3].balance).toBe(1100) // day-4
    expect(result[4].balance).toBe(1100) // day-3
    expect(result[5].balance).toBe(1000) // day-2 (expense applied)
    expect(result[6].balance).toBe(1000) // day-1
    expect(result[7].balance).toBe(1000) // day-0 (today)
  })

  it("multiple transactions same calendar day: only net applied once", () => {
    // income 300 + expense 100 on day-2 → net +200
    // currentBalance = 1200, pre-window = 1200 - 200 = 1000
    const result = buildDailyBalanceTimeline({
      transactions: [
        { amount: 300, type: "income", date: daysAgo(2) },
        { amount: 100, type: "expense", date: daysAgo(2) },
      ],
      balanceAsOf: 1200,
      lookbackDays: 4,
      referenceDate: REFERENCE_DATE,
    })
    expect(result[0].balance).toBe(1000) // day-4
    expect(result[1].balance).toBe(1000) // day-3
    expect(result[2].balance).toBe(1200) // day-2 (net +200 applied)
    expect(result[3].balance).toBe(1200) // day-1
    expect(result[4].balance).toBe(1200) // day-0
  })

  it("two transactions with identical epoch: grouped into same day", () => {
    const sameTimestamp = daysAgo(3)
    const result = buildDailyBalanceTimeline({
      transactions: [
        { amount: 50, type: "expense", date: sameTimestamp },
        { amount: 50, type: "expense", date: sameTimestamp },
      ],
      balanceAsOf: 900,
      lookbackDays: 5,
      referenceDate: REFERENCE_DATE,
    })
    // net on day-3: -100. pre-window: 900 + 100 = 1000
    expect(result[0].balance).toBe(1000) // day-5
    expect(result[1].balance).toBe(1000) // day-4
    expect(result[2].balance).toBe(900) // day-3 (both applied)
    expect(result[3].balance).toBe(900) // day-2
  })
})

// ---------------------------------------------------------------------------
// Sparse fill / carry-forward
// ---------------------------------------------------------------------------

describe("sparse fill — carry-forward", () => {
  it("transactions only on first and last day: middle days carry-forward correctly", () => {
    // income 100 on day-9, expense 50 on day-0
    // pre-window = 950 - 100 + 50 = 900
    // day-9: 1000, day-8..day-1: 1000, day-0: 950
    const result = buildDailyBalanceTimeline({
      transactions: [
        { amount: 100, type: "income", date: daysAgo(9) },
        { amount: 50, type: "expense", date: daysAgo(0) },
      ],
      balanceAsOf: 950,
      lookbackDays: 9,
      referenceDate: REFERENCE_DATE,
    })
    // day-9 is output[0]: pre-window = 900, income +100 applied → 1000
    expect(result[0].balance).toBe(1000)
    for (let i = 1; i <= 8; i++) expect(result[i].balance).toBe(1000)
    expect(result[9].balance).toBe(950) // day-0: expense -50
  })

  it("no transactions in middle 20 days: those days hold same balance", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [
        { amount: 200, type: "income", date: daysAgo(29) },
        { amount: 200, type: "expense", date: daysAgo(0) },
      ],
      balanceAsOf: 800,
      lookbackDays: 29,
      referenceDate: REFERENCE_DATE,
    })
    // pre-window = 800 - 200 + 200 = 800
    // day-29: 1000, day-28..day-1: 1000, day-0: 800
    expect(result[0].balance).toBe(1000)
    for (let i = 1; i <= 28; i++) expect(result[i].balance).toBe(1000)
    expect(result[29].balance).toBe(800)
  })
})

// ---------------------------------------------------------------------------
// Negative balance
// ---------------------------------------------------------------------------

describe("negative balance (overdraft)", () => {
  it("negative currentBalance propagates without throwing", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [],
      balanceAsOf: -500,
      lookbackDays: 3,
      referenceDate: REFERENCE_DATE,
    })
    expect(result).toHaveLength(4)
    for (const entry of result) expect(entry.balance).toBe(-500)
  })

  it("expense pushes balance further negative correctly", () => {
    // currentBalance = -200, expense 300 on day-1
    // pre-window = -200 + 300 = 100
    const result = buildDailyBalanceTimeline({
      transactions: [{ amount: 300, type: "expense", date: daysAgo(1) }],
      balanceAsOf: -200,
      lookbackDays: 2,
      referenceDate: REFERENCE_DATE,
    })
    expect(result[0].balance).toBe(100) // day-2
    expect(result[1].balance).toBe(-200) // day-1 (expense applied)
    expect(result[2].balance).toBe(-200) // day-0
  })
})

// ---------------------------------------------------------------------------
// Integer amounts — no float conversion
// ---------------------------------------------------------------------------

describe("integer amounts", () => {
  it("amounts remain integers throughout — no float drift", () => {
    const result = buildDailyBalanceTimeline({
      transactions: [
        { amount: 333, type: "income", date: daysAgo(1) },
        { amount: 111, type: "expense", date: daysAgo(1) },
      ],
      balanceAsOf: 222,
      lookbackDays: 2,
      referenceDate: REFERENCE_DATE,
    })
    for (const entry of result) {
      expect(Number.isInteger(entry.balance)).toBe(true)
    }
  })
})

// ---------------------------------------------------------------------------
// Out-of-window transactions — silently ignored
// ---------------------------------------------------------------------------

describe("out-of-window transactions", () => {
  // TODO(UPS-14): out-of-window transactions corrupt periodNet via getSparse
  it.todo("transaction before window start is ignored", () => {
    // With days=2, window is [day-2, today]. day-5 is outside.
    const withOutOfWindow = buildDailyBalanceTimeline({
      transactions: [{ amount: 999, type: "income", date: daysAgo(5) }],
      balanceAsOf: 1000,
      lookbackDays: 2,
      referenceDate: REFERENCE_DATE,
    })
    const withoutOutOfWindow = buildDailyBalanceTimeline({
      transactions: [],
      balanceAsOf: 1000,
      lookbackDays: 2,
      referenceDate: REFERENCE_DATE,
    })
    expect(withOutOfWindow.map((e) => e.balance)).toEqual(
      withoutOutOfWindow.map((e) => e.balance)
    )
  })
})

// ---------------------------------------------------------------------------
// referenceDate — normalization
// ---------------------------------------------------------------------------

describe("referenceDate normalization", () => {
  it("mid-day referenceDate produces same result as EOD referenceDate", () => {
    const midDay = set("2024-06-15", {
      hours: 12,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    })
    const eod = endOfDay("2024-06-15")

    const tx = [
      {
        amount: 100,
        type: "income" as const,
        date: new Date("2024-06-15T18:00:00.000Z").getTime(),
      },
    ]

    const resultMidDay = buildDailyBalanceTimeline({
      transactions: tx,
      balanceAsOf: 500,
      lookbackDays: 2,
      referenceDate: midDay,
    })
    const resultEod = buildDailyBalanceTimeline({
      transactions: tx,
      balanceAsOf: 500,
      lookbackDays: 2,
      referenceDate: eod,
    })

    expect(resultMidDay).toEqual(resultEod)
    expect(resultMidDay.map((e) => e.balance)).toEqual(
      resultEod.map((e) => e.balance)
    )
  })

  it("past referenceDate with matching currentBalance produces correct historical timeline", () => {
    const pastRef = set("2024-05-01", {
      hours: 23,
      minutes: 59,
      seconds: 59,
      milliseconds: 999,
    })
    // currentBalance = 800 as of 2024-05-01 EOD, expense 200 on day-1 (2024-04-30)
    const result = buildDailyBalanceTimeline({
      transactions: [
        {
          amount: 200,
          type: "expense",
          date: new Date("2024-04-30").getTime(),
        },
      ],
      balanceAsOf: 800,
      lookbackDays: 2,
      referenceDate: pastRef,
    })
    // pre-window = 800 + 200 = 1000
    // day-2 (apr 29): 1000, day-1 (apr 30): 800, day-0 (may 1): 800
    expect(result[0].balance).toBe(1000)
    expect(result[1].balance).toBe(800)
    expect(result[2].balance).toBe(800)
  })
})
