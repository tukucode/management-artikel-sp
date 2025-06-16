// src/components/ui/Loop.tsx
'use client'

import { createContext, useContext } from 'react'

type LoopContextType<T> = {
  of: T[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LoopContext = createContext<LoopContextType<any> | null>(null)

export function LoopView<T>({ of, children }: { of: T[]; children: React.ReactNode }) {
  return (
    <LoopContext.Provider value={{ of }}>
      {children}
    </LoopContext.Provider>
  )
}

export function Each<T>({ children }: { children: (item: T, index: number) => React.ReactNode }) {
  const context = useContext(LoopContext) as LoopContextType<T> | null
  if (!context) throw new Error('<Each> Must be used inside <Loop>')

  return <>{context.of.map(children)}</>
}

export function Empty({ children }: { children: React.ReactNode }) {
  const context = useContext(LoopContext)
  if (!context) throw new Error('<Empty> Must be used inside <Loop>')

  if (context.of.length > 0) return null
  return <>{children}</>
}
