import React, { useState } from "react"
import "./Info.css"
import questionLogo from "../wrapper/logos/question-logo.svg"

interface Props {
	roomid: string | null | undefined
}
const Info: React.FC<Props> = ({ roomid }) => {
	const [isInfoMenuOpen, setIsInfoMenuOpen] = useState<Boolean>(false)

	return (
		<div className='info-container'>
			<img
				onMouseEnter={() => {
					setIsInfoMenuOpen(true)
				}}
				onMouseLeave={() => {
					setIsInfoMenuOpen(false)
				}}
				src={questionLogo}
				alt='question mark'
			/>
			<div
				className={
					isInfoMenuOpen ? "info-text-container active" : "info-text-container"
				}>
				{roomid
					? "You are inside a performance room! You'll be automatically connected to other users and can record your sounds with the record button"
					: "Convergerge is a virtual space designed for musical collaboration.Customize your performance environment and start creating."}
			</div>
		</div>
	)
}

export default Info
