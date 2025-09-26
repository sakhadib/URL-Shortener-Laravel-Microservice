// Type declarations for libraries without TypeScript definitions

declare module 'd3-array' {
  export const max: any
  export const min: any
  export const extent: any
  export const bisect: any
}

declare module 'd3-color' {
  export const rgb: any
  export const hsl: any
}

declare module 'd3-ease' {
  export const easeLinear: any
  export const easeCubic: any
}

declare module 'd3-interpolate' {
  export const interpolate: any
  export const interpolateNumber: any
}

declare module 'd3-path' {
  export const path: any
}

declare module 'd3-scale' {
  export const scaleLinear: any
  export const scaleBand: any
  export const scaleOrdinal: any
}

declare module 'd3-shape' {
  export const line: any
  export const area: any
  export const arc: any
}

declare module 'd3-time' {
  export const timeDay: any
  export const timeWeek: any
  export const timeMonth: any
}

declare module 'd3-time-format' {
  export const timeFormat: any
  export const timeParse: any
}

// Lucide React icons
declare module 'lucide-react' {
  import { ComponentType } from 'react'
  
  interface IconProps {
    size?: number | string
    color?: string
    className?: string
    [key: string]: any
  }
  
  export const Link: ComponentType<IconProps>
  export const Plus: ComponentType<IconProps>
  export const LogOut: ComponentType<IconProps>
  export const Copy: ComponentType<IconProps>
  export const ExternalLink: ComponentType<IconProps>
  export const Calendar: ComponentType<IconProps>
  export const Check: ComponentType<IconProps>
  export const BarChart3: ComponentType<IconProps>
  export const Trash2: ComponentType<IconProps>
  export const Loader2: ComponentType<IconProps>
  export const X: ComponentType<IconProps>
  export const Wifi: ComponentType<IconProps>
  export const WifiOff: ComponentType<IconProps>
  export const RefreshCw: ComponentType<IconProps>
  export const Zap: ComponentType<IconProps>
  export const Shield: ComponentType<IconProps>
  export const Globe: ComponentType<IconProps>
}