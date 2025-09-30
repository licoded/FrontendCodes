import LazyImg from "./components/LazyImg"
import MDN from "./MDN"

function App() {
  return (
    <div style={{maxWidth: '240px', margin: '0 auto'}}>
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
