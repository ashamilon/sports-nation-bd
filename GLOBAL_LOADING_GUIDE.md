# Global Loading System Guide

This guide explains how to use the global loading system with rotating logo animation throughout the website.

## Components Created

### 1. GlobalLoading Component (`components/global-loading.tsx`)
- Main loading component with rotating logo
- Supports different sizes (sm, md, lg, xl)
- Can be used as full-screen overlay or inline
- Customizable text and logo display

### 2. Loading Context (`lib/loading-context.tsx`)
- React context for managing global loading state
- Provides `isLoading`, `loadingText`, and `setLoading` function

### 3. Loading Overlay (`components/loading-overlay.tsx`)
- Full-screen loading overlay that appears when global loading is active
- Automatically shows/hides based on context state

### 4. Global Loading Hook (`lib/use-global-loading.ts`)
- Convenient hook for triggering global loading
- Provides `showLoading`, `hideLoading`, and `withLoading` functions

## Usage Examples

### Basic Usage

```tsx
import { useGlobalLoading } from '@/lib/use-global-loading'

function MyComponent() {
  const { showLoading, hideLoading, withLoading } = useGlobalLoading()

  const handleAction = () => {
    showLoading('Processing...')
    // Do something
    setTimeout(() => hideLoading(), 2000)
  }

  return <button onClick={handleAction}>Do Something</button>
}
```

### Async Operations

```tsx
import { useGlobalLoading } from '@/lib/use-global-loading'

function MyComponent() {
  const { withLoading } = useGlobalLoading()

  const handleAsyncAction = async () => {
    await withLoading(async () => {
      const response = await fetch('/api/data')
      const data = await response.json()
      // Process data
    }, 'Loading data...')
  }

  return <button onClick={handleAsyncAction}>Load Data</button>
}
```

### Inline Loading

```tsx
import GlobalLoading from '@/components/global-loading'

function MyComponent() {
  return (
    <div>
      <h1>My Page</h1>
      <GlobalLoading 
        size="md" 
        text="Loading content..." 
      />
    </div>
  )
}
```

### Full-Screen Loading

```tsx
import GlobalLoading from '@/components/global-loading'

function MyComponent() {
  return (
    <GlobalLoading 
      fullScreen 
      size="lg" 
      text="Loading page..." 
    />
  )
}
```

## Page Loading Templates

### Root Loading (`app/loading.tsx`)
- Shows when navigating between pages
- Uses GlobalLoading component

### Dashboard Loading (`app/dashboard/loading.tsx`)
- Specific loading for dashboard pages
- Custom styling for dashboard context

### Admin Loading (`app/admin/loading.tsx`)
- Specific loading for admin pages
- Custom styling for admin context

## Features

- **Rotating Logo**: Smooth 360-degree rotation animation
- **Pulsing Dots**: Three animated dots with staggered timing
- **Customizable Text**: Dynamic loading messages
- **Multiple Sizes**: sm, md, lg, xl options
- **Full-Screen Overlay**: Can cover entire viewport
- **Context-Based**: Global state management
- **TypeScript Support**: Full type safety

## Integration

The loading system is already integrated into:
- Root layout with LoadingProvider
- Loading overlay for global state
- Page loading templates
- Dashboard overview component (example usage)

## Styling

The loading component uses:
- Framer Motion for animations
- Tailwind CSS for styling
- CSS variables for theming
- Responsive design principles

## Performance

- Optimized animations using Framer Motion
- Lazy loading of components
- Minimal re-renders with context optimization
- Image optimization with Next.js Image component
