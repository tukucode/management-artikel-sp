import React, { ReactNode } from 'react'

type ConditionalViewProps = {
  condition: boolean[];
  children: ReactNode;
};

export const ConditionalView = ({ condition, children }: ConditionalViewProps) => {
  const arrayChildren = Array.isArray(children) ? children : [children]

  const slots: { type: string; node: ReactNode }[] = []

  arrayChildren.forEach((child) => {
    if (!React.isValidElement(child)) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typeName = (child.type as any).displayName
    if (typeName === 'If' || typeName === 'ElseIf' || typeName === 'Else') {
      slots.push({ type: typeName, node: child })
    }
  })

  for (let i = 0; i < slots.length; i++) {
    const { type, node } = slots[i]

    if (type === 'If' && condition[0]) return <>{node}</>
    if (type === 'ElseIf' && condition[i]) return <>{node}</>
    if (type === 'Else') return <>{node}</>
  }

  return null
}

export const If = ({ children }: { children: ReactNode }) => <>{children}</>
If.displayName = 'If'

export const ElseIf = ({ children }: { children: ReactNode }) => <>{children}</>
ElseIf.displayName = 'ElseIf'

export const Else = ({ children }: { children: ReactNode }) => <>{children}</>
Else.displayName = 'Else'
