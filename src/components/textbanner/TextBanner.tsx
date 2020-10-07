import React, { useCallback, useState, useRef, useEffect } from "react"
import "./TextBanner.css"
interface Props {
  direction: string
}
const TextBanner: React.FunctionComponent<Props> = ({ direction }) => {
  return <TextTicker direction={direction} />
}

interface TickerProps {
  direction: string
}
const TextTicker: React.FunctionComponent<TickerProps> = ({ direction }) => {
  const scaledFrame = useRef<number>(0)
  const requestRef = useRef<number>(0)
  const spanRef = useRef<any>()
  const [_direction, set_Direction] = useState<String>(direction)
  const animate = useCallback(() => {
    requestRef.current = requestAnimationFrame(animate)
    scaledFrame.current = requestRef.current * 2
    if (_direction === "right") {
      if (scaledFrame.current < 28000) {
        console.log(scaledFrame.current)
      } else if (scaledFrame.current >= 28000) {
        spanRef.current.style.transform = `translateX(0px)`
      }
      spanRef.current.style.transform = `translateX(-${scaledFrame.current}px)`
    } else if (_direction === "left") {
      spanRef.current.style.transform = `translateX(${
        -90000 + scaledFrame.current
      }px)`
    }
  }, [_direction])
  useEffect(() => {
    set_Direction(direction)
    animate()
  }, [set_Direction, animate, direction])
  useEffect(() => console.log(scaledFrame), [scaledFrame])

  return (
    <div ref={spanRef} className='text-container'>
      <span>
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise make some noise
        make some noise make some noise make some noise make some noise make
        some noise make some noise make some noise make some noise make some
        noise make some noise make some noise make some noise
      </span>
    </div>
  )
}
export default TextBanner
