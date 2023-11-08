import React from 'react'
import useSpeechRecognition from '../hooks/useSpeechRecognitionHook'

function SRTest() {

    const {
        text,
        isListening,
        startListening,
        hasRecognitionSupport
    } = useSpeechRecognition()

  return (
    <div className='h-screen w-full flex justify-center items-center'>

        {hasRecognitionSupport ? <div className='p-10'>
            <button className='bg-gray-600 py-3 px-6 rounded-full text-white' onClick={startListening}>Start</button>
        </div> : <h1>Speech recognition not supported...</h1>}

        {text}

        {isListening ? <h1>Your browser is listening...</h1> : null}

    </div>
  )
}

export default SRTest