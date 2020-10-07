import React, { useState } from "react"
import "./Info.css"
import questionLogo from "../welcome/logos/question-logo.svg"

const Info: React.FC = () => {
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
        Convergerge is a virtual space designed for musical collaboration.
        Customize your performence environment and start creating.
      </div>
    </div>
  )
}

export default Info
