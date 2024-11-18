import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { useWindowSize } from 'react-use'

const colors = ['#FF000B', '#FFC911', '#8B73F2', '#00DC40']
const gravity = 0.07
const numberOfPieces = 300

const drawSparkle = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath()
  ctx.moveTo(10.7, 4.8)
  ctx.bezierCurveTo(9.4, 3.5, 8.4, 1.8, 7.5, 0)
  ctx.bezierCurveTo(6.7, 1.6, 6, 3.1, 4.8, 4.3)
  ctx.bezierCurveTo(3.5, 5.6, 1.8, 6.6, 0, 7.5)
  ctx.bezierCurveTo(1.6, 8.3, 3.1, 9, 4.3, 10.2)
  ctx.bezierCurveTo(5.6, 11.5, 6.6, 13.2, 7.5, 15)
  ctx.bezierCurveTo(8.3, 13.4, 9, 11.9, 10.2, 10.7)
  ctx.bezierCurveTo(11.5, 9.39, 13.2, 8.39, 15, 7.49)
  ctx.bezierCurveTo(13.4, 6.7, 11.9, 6, 10.7, 4.8)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
}

const drawRandomShape = (ctx: CanvasRenderingContext2D) => {
  const shapes = [drawSparkle]
  const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
  randomShape(ctx)
}

type Props = {
  runAnimation?: boolean
  scrollBarWidth?: number
  zIndex?: number
}

const Confetti = ({ runAnimation, scrollBarWidth = 15, zIndex = 1 }: Props) => {
  const { width, height } = useWindowSize()
  const scrollBarAdjustedWidth = width - scrollBarWidth
  const [initialMount, setInitialMount] = useState(true)

  useEffect(() => {
    setInitialMount(false)
  }, [])

  if (initialMount || !runAnimation) {
    return null
  }

  return (
    <ReactConfetti
      recycle={false}
      width={scrollBarAdjustedWidth}
      height={height}
      drawShape={drawRandomShape}
      colors={colors}
      gravity={gravity}
      numberOfPieces={numberOfPieces}
      style={{ position: 'fixed', zIndex: zIndex }}
    />
  )
}

export { Confetti }
