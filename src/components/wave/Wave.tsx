import "./Wave.css"
import React, { useCallback, useEffect, useRef, useState } from "react"

interface Props {
  numberOfPeers: number
}

const Wave: React.FC<Props> = ({ numberOfPeers }) => {
  const requestRef = useRef<number>(0)
  const [numberOfPoints] = useState<number>(1000)

  const animate = useCallback(() => {
    requestRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => animate())

  const pathRef = useRef<any>(null)
  return (
    <div className='wave-container'>
      <svg>
        {[...Array(numberOfPeers)].map((element, i) => (
          <path ref={pathRef} key={i}></path>
        ))}
      </svg>
    </div>
  )
}

export default Wave
