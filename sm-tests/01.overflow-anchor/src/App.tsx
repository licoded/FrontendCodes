import { useEffect, useRef } from "react"
import LazyImg from "./components/LazyImg"
import MDN from "./MDN"

function App() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const logScrollInfo = () => {
      const now = new Date()
      const timeString = now.toTimeString().split(' ')[0] // HH:MM:SS format

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScrollPosition = window.scrollY

      console.log(`${timeString} - 可滚动高度: ${scrollableHeight}px, 当前滚动位置: ${currentScrollPosition}px`)
    }

    let lastScrollHeight = document.documentElement.scrollHeight
    let lastScrollPosition = window.scrollY

    const handleScroll = () => {
      const currentScrollHeight = document.documentElement.scrollHeight
      const currentScrollPosition = window.scrollY

      if (currentScrollHeight !== lastScrollHeight || currentScrollPosition !== lastScrollPosition) {
        logScrollInfo()
        lastScrollHeight = currentScrollHeight
        lastScrollPosition = currentScrollPosition
      }
    }

    const handleResize = () => {
      const currentScrollHeight = document.documentElement.scrollHeight

      if (currentScrollHeight !== lastScrollHeight) {
        logScrollInfo()
        lastScrollHeight = currentScrollHeight
      }
    }

    // Initial log
    logScrollInfo()

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    // Use MutationObserver to detect DOM changes that might affect scroll height
    const observer = new MutationObserver(() => {
      const currentScrollHeight = document.documentElement.scrollHeight
      if (currentScrollHeight !== lastScrollHeight) {
        logScrollInfo()
        lastScrollHeight = currentScrollHeight
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'src']
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} style={{maxWidth: '240px', margin: '0 auto'}}>
      <MDN/>
      <LazyImg
        imgSrc={'https://images.freejpg.com.ar/900/1706/majestic-view-of-the-primatial-cathedral-of-bogota-in-bolivar-square-F100038875.jpg'}
        preloadDelayMs={5000}
      />
      <MDN/>
      <MDN/>
      <MDN/>
      <MDN/>
    </div>
  )
}

export default App
