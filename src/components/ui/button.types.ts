import type Link from 'next/link'

import type { VariantProps } from 'class-variance-authority'

import type { buttonVariants } from '@/components/ui/button'

type ButtonVariants = VariantProps<typeof buttonVariants>

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {}

export interface ButtonLinkProps
    extends React.ComponentProps<typeof Link>, ButtonVariants {}
