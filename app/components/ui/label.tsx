import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/utils'

const labelVariants = cva(
	'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
	{
		variants: {
			variant: {
				default: 'text-primary',
				secondary:
					'bg-indigo-600 text-center h-full flex items-center justify-center rounded-l-md text-white',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
		VariantProps<typeof labelVariants>
>(({ className, variant, asChild = false, ...props }, ref) => (
	<LabelPrimitive.Root
		ref={ref}
		className={cn(labelVariants({ variant, className }))}
		{...props}
	/>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
