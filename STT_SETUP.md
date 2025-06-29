# Speech-to-Text (STT) Setup with Reverie

## Overview
This application now includes speech-to-text functionality using the Reverie STT service, supporting English and 11 Indian languages with real-time streaming transcription.

## API Configuration
- **API Key**: `bd448f71dae9549fa69f377a3b5f190775369fba`
- **App ID**: `com.ayushman.codefly`

## Features Implemented

### 1. **MicrophoneButton Component** (`src/components/MicrophoneButton.jsx`)
- **Compact Design**: Small, unobtrusive microphone button with integrated language selector
- **Proper Positioning**: Language menu appears ABOVE the button to avoid overlap issues
- **Click Outside Behavior**: Menu automatically closes when clicking outside
- **Visual Feedback**: 
  - Blue colors for inactive state with proper hover effects
  - Red colors and pulsing indicator when recording
  - Clear status messages and tooltips

### 2. **Language Support**
Limited to English and Indian languages only:
- 🇺🇸 English
- 🇮🇳 Hindi (हिन्दी)
- 🇮🇳 Assamese (অসমীয়া)
- 🇮🇳 Bengali (বাংলা)
- 🇮🇳 Gujarati (ગુજરાતી)
- 🇮🇳 Kannada (ಕನ್ನಡ)
- 🇮🇳 Malayalam (മലയാളം)
- 🇮🇳 Marathi (मराठी)
- 🇮🇳 Odia (ଓଡ଼ିଆ)
- 🇮🇳 Punjabi (ਪੰਜਾਬੀ)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Telugu (తెలుగు)

### 3. **useReverieStt Hook** (`src/lib/useReverieStt.js`)
- **Event Handling**: Proper handling of FINAL_RESULT and PARTIAL_RESULTS events
- **Transcript Management**: Accumulates final results and shows real-time partial results
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Configuration**: 3-minute timeout, 1-second silence detection, continuous mode

### 4. **Integration Points**
- **Dashboard Chat**: Integrated into main chat input
- **Content Wizard**: Available in content generation prompts
- **Positioning**: Microphone appears next to input fields with language selector

## UI/UX Improvements

### Fixed Issues:
1. ✅ **Popup Positioning**: Language menu now appears above instead of below
2. ✅ **Click Outside**: Menu closes properly when clicking outside
3. ✅ **Hover Effects**: Microphone button maintains blue color on hover
4. ✅ **Language Selection**: Compact, intuitive design with flag icons
5. ✅ **Visual Feedback**: Clear recording status and language indicators

### Button Design:
- **Inactive**: Blue background with blue text
- **Recording**: Red background with red text and pulsing indicator
- **Language Selector**: Compact flag + dropdown arrow design
- **Tooltips**: Show current language and action descriptions

## Technical Implementation

### Dependencies
```json
{
  "@reverieit/reverie-client": "^0.5.0"
}
```

### CDN Script (already loaded in layout.js)
```html
<script src="https://cdn.jsdelivr.net/npm/reverie-stt-sdk/dist/bundle.js" />
```

### Usage Example
```jsx
import MicrophoneButton from '@/components/MicrophoneButton'

<MicrophoneButton
  onTranscript={(text) => setInputValue(text)}
  disabled={isLoading}
  language="en"
/>
```

## Configuration Options

### STT Settings:
- **Domain**: 'generic' (suitable for general content)
- **Silence Detection**: 1 second
- **Timeout**: 180 seconds (3 minutes)
- **Continuous Mode**: Enabled
- **Language Switching**: Real-time language switching

### Error Handling:
- Network connectivity issues
- Microphone permission denied
- API key/authentication errors
- Timeout and silence detection

## Testing

1. **Permission Test**: Browser will request microphone permission
2. **Language Test**: Switch between languages and verify transcription
3. **Continuous Test**: Speak continuously to test sentence building
4. **Silence Test**: Pause speaking to test silence detection
5. **Error Test**: Test with network disconnected

## Performance Optimizations

- **Lazy Loading**: STT client initialized only when needed
- **Memory Management**: Proper cleanup on component unmount
- **Event Debouncing**: Efficient transcript updates
- **Error Recovery**: Automatic retry mechanisms

## Browser Compatibility

- **Chrome**: Full support with best performance
- **Firefox**: Full support
- **Safari**: Basic support (iOS restrictions apply)
- **Edge**: Full support

## Security Notes

- API credentials are used client-side (standard for STT services)
- No audio data is stored locally
- Real-time processing with immediate transcript delivery
- Secure HTTPS connection required for microphone access

## Future Enhancements

- [ ] Voice activity detection for better silence handling
- [ ] Custom vocabulary for domain-specific terms
- [ ] Offline mode for basic functionality
- [ ] Audio quality indicators
- [ ] Recording history and playback

## 🎯 Features

- **Real-time STT streaming** for chat inputs
- **Multi-language support** including English and 11 Indian languages
- **Visual feedback** with recording indicators
- **Language selection** with flag indicators
- **Error handling** and status messages
- **Seamless integration** with existing chat interface

## 🌍 Supported Languages

- 🇺🇸 English
- 🇮🇳 Hindi (हिंदी)
- 🇧🇩 Bengali (বাংলা)
- 🇮🇳 Tamil (தமிழ்)
- 🇮🇳 Telugu (తెలుగు)
- 🇮🇳 Malayalam (മലയാളം)
- 🇮🇳 Kannada (ಕನ್ನಡ)
- 🇮🇳 Gujarati (ગુજરાતી)
- 🇮🇳 Marathi (मराठी)
- 🇮🇳 Punjabi (ਪੰਜਾਬੀ)
- 🇮🇳 Odia (ଓଡ଼ିଆ)
- 🇮🇳 Assamese (অসমীয়া)

## 🚀 Setup Instructions

### 1. Get Reverie API Credentials

1. Visit [https://revup.reverieinc.com](https://revup.reverieinc.com)
2. Create an account or sign in
3. Generate your **API Key** and **App ID**

### 2. Configure Environment Variables

Add these variables to your `.env.local` file:

```env
# Reverie Speech-to-Text Configuration
NEXT_PUBLIC_REVERIE_API_KEY="your_reverie_api_key_here"
NEXT_PUBLIC_REVERIE_APP_ID="your_reverie_app_id_here"
```

### 3. CDN Script (Already Added)

The Reverie STT SDK script is automatically included in the application:

```html
<script src="https://cdn.jsdelivr.net/npm/reverie-stt-sdk/dist/bundle.js"></script>
```

## 🎙️ How to Use

### 1. **Start Voice Input**
- Click the microphone button (🎤) next to the chat input
- Grant microphone permissions when prompted
- The button turns red with a pulsing indicator when recording

### 2. **Select Language**
- Click on the language selector below the microphone (when not recording)
- Choose from 12 supported languages
- The interface shows flag and language name

### 3. **Stop Recording**
- Click the microphone button again to stop
- Or wait for automatic stopping after 3 seconds of silence
- Transcribed text appears in the input field automatically

### 4. **Send Message**
- Review the transcribed text
- Edit if needed
- Press Enter or click Send to submit

## 🔧 Technical Implementation

### Components

1. **`useReverieStt` Hook** (`src/lib/useReverieStt.js`)
   - Manages STT client initialization
   - Handles streaming audio transcription
   - Provides state management and error handling

2. **`MicrophoneButton` Component** (`src/components/MicrophoneButton.jsx`)
   - Visual microphone interface
   - Language selection dropdown
   - Recording status indicators
   - Error message display

3. **Integration Points**
   - Dashboard chat input (`src/app/(authpages)/dashboard/page.js`)
   - ChatWindow component (`src/components/chat-window.jsx`)

### Configuration Options

```javascript
const sttOptions = {
  continuous: true,        // Keep listening for multiple words
  silence: 3000,          // Stop after 3 seconds of silence
  timeout: 60,            // Maximum 60 seconds per session
  logging: false          // Disable debug logging
}
```

## 🔍 Troubleshooting

### Common Issues

**1. "Reverie STT SDK not loaded"**
- Check internet connection
- Verify CDN script is loaded
- Check browser console for script errors

**2. "Failed to initialize speech recognition"**
- Verify API key and App ID in environment variables
- Check API quota limits on Reverie dashboard
- Ensure microphone permissions are granted

**3. "No audio detected"**
- Check microphone permissions in browser
- Verify microphone is working in other applications
- Try different browsers (Chrome recommended)

**4. Language not transcribing correctly**
- Ensure selected language matches spoken language
- Speak clearly and at moderate pace
- Check for background noise

### Browser Compatibility

- ✅ **Chrome** (Recommended)
- ✅ **Firefox**
- ✅ **Safari** (MacOS)
- ⚠️ **Edge** (Limited testing)

### Performance Tips

- Use in quiet environment for better accuracy
- Speak clearly and at normal pace
- Keep sessions under 60 seconds for optimal performance
- Stable internet connection recommended for streaming

## 📝 API Usage Limits

- Check your Reverie dashboard for usage statistics
- Free tier typically includes limited monthly transcription minutes
- Upgrade plans available for higher usage requirements

## 🆘 Support

For technical issues:
1. Check browser console for error messages
2. Verify environment variables configuration
3. Test microphone permissions
4. Contact Reverie support for API-related issues

---

**Note**: This implementation requires a stable internet connection as it uses cloud-based STT processing through Reverie's servers. 