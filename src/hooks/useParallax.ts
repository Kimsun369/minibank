import { useEffect, useRef, useState } from 'react'

interface ParallaxOptions {
  speed?: number
  offset?: number
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, offset = 0 } = options
  const ref = useRef<HTMLDivElement>(null)
  const [translateY, setTranslateY] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const handleScroll = () => {
            if (!ref.current) return

            const rect = ref.current.getBoundingClientRect()
            const scrolled = window.scrollY
            const elementTop = rect.top + scrolled
            const windowHeight = window.innerHeight

            if (rect.top < windowHeight) {
              const distance = window.scrollY - elementTop + windowHeight
              setTranslateY(distance * speed)
            }
          }

          window.addEventListener('scroll', handleScroll, { passive: true })
          handleScroll()

          return () => {
            window.removeEventListener('scroll', handleScroll)
          }
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [speed])

  return { ref, translateY }
}
