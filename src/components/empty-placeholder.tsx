import {classNames} from '@/lib'
import React from 'react'


interface Props {
  title: string
  message?: string
  children?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const EmptyPlaceholder = ({title, message, children, actions, className}: Props) => {
  return (
    <div
      className={classNames(
        'my-10 flex h-full w-full flex-col items-center justify-center',
        className,
      )}
    >
      {children && (
        <div className="bg-card flex h-[72px] w-[72px] items-center justify-center rounded-full">
          {children}
        </div>
      )}
      <h3 className="mt-6 text-xl font-medium">{title}</h3>
      {message && (
        <p className="text-foreground/80 mb-8 mt-3 text-center text-base font-normal leading-6">
          {message}
        </p>
      )}
      {actions}
    </div>
  )
}
