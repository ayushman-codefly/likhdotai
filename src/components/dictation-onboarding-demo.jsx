"use client"

import React, { useState } from 'react'
import { KeyTestComponent } from '@/app/_reusables/Editor'

const DictationOnboardingDemo = () => {
  const [keyTestPassed, setKeyTestPassed] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleKeyDetected = (success) => {
    if (success) {
      setKeyTestPassed(true)
      setShowSuccessMessage(true)
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🎤 Learn Quick Dictation
        </h2>
        <p className="text-gray-600">
          Test your keyboard shortcut to start dictating instantly in the editor
        </p>
      </div>

      {/* Key Test Component */}
      <div className="mb-6">
        <KeyTestComponent 
          onKeyDetected={handleKeyDetected}
          className="w-full"
        />
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 text-xl">🎉</span>
            <div>
              <h3 className="text-green-800 font-semibold">Perfect! You've got it!</h3>
              <p className="text-green-700 text-sm">
                You can now use this shortcut anywhere in the editor to start dictating.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-semibold mb-2">How to use dictation:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Hold the key while speaking to start dictating</li>
          <li>• Release the key to stop and insert your text</li>
          <li>• Works anywhere in the editor - even between existing text</li>
          <li>• Supports 12 languages including English, Hindi, and more</li>
        </ul>
      </div>

      {/* Continue Button */}
      <div className="text-center mt-6">
        <button
          disabled={!keyTestPassed}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            keyTestPassed
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {keyTestPassed ? 'Continue to Editor →' : 'Complete the test to continue'}
        </button>
      </div>
    </div>
  )
}

export default DictationOnboardingDemo 