import React, {
	useCallback,
	useState,
	useRef,
	useEffect,
	MutableRefObject,
} from "react"
import "./TextBanner.css"
interface Props {
	direction: string
	roomid: string | null | undefined
}
const TextBanner: React.FunctionComponent<Props> = ({ direction, roomid }) => {
	return <TextTicker roomid={roomid} direction={direction} />
}

interface TickerProps {
	direction: string
	roomid: string | null | undefined
}
const TextTicker: React.FunctionComponent<TickerProps> = ({
	direction,
	roomid,
}) => {
	const scaledFrame = useRef<number>(0)
	const requestRef = useRef<number>(0)
	const spanRef: MutableRefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(
		null
	)
	const [_direction, set_Direction] = useState<String>(direction)
	const animate = useCallback(() => {
		requestRef.current = requestAnimationFrame(animate)
		scaledFrame.current = requestRef.current / 2
		if (_direction === "right") {
			if (scaledFrame.current < 28000) {
			} else if (scaledFrame.current >= 28000) {
				if (spanRef.current) spanRef.current.style.transform = `translateX(0px)`
			}
			if (spanRef.current)
				spanRef.current.style.transform = `translateX(-${scaledFrame.current}px)`
		} else if (_direction === "left") {
			if (spanRef.current)
				spanRef.current.style.transform = `translateX(${
					-90000 + scaledFrame.current
				}px)`
		}
	}, [_direction])
	useEffect(() => {
		set_Direction(direction)
		if (!roomid) {
			animate()
		} else {
			if (requestRef.current) cancelAnimationFrame(requestRef.current)
		}
	}, [set_Direction, animate, direction, roomid])

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
