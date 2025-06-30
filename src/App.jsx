import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Switch } from '@/components/ui/switch.jsx'
import { 
  Brain, Activity, Zap, MessageCircle, Send, Settings, BarChart3, 
  Smartphone, Database, Bot, Mic, MicOff, Volume2, VolumeX, 
  Headphones, Menu, X, Home, Monitor, Cpu, HardDrive, Wifi,
  Battery, Signal, Clock, User, Power
} from 'lucide-react'
import brainLogoHD from './assets/app_icon_1024.png'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Hello! I'm the A.I. Apex Brain mobile interface. How can I assist you today?", sender: 'ai', timestamp: '3:35:17 PM' }
  ])
  const [currentView, setCurrentView] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 85,
    memoryUsage: 72,
    activeAlgorithms: 42,
    successRate: 90,
    activeAgents: 12,
    loadedModels: 8,
    voiceBanks: 5,
    selfLearningRate: 44.65,
    batteryLevel: 87,
    signalStrength: 4,
    networkStatus: 'Connected'
  })
  
  // Voice-related state
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [handsFreeMode, setHandsFreeMode] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  // Initialize speech recognition and synthesis
  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')
        
        if (event.results[event.results.length - 1].isFinal) {
          setMessage(transcript)
          if (handsFreeMode) {
            setTimeout(() => {
              if (transcript.trim()) {
                sendMessageWithText(transcript)
              }
            }, 500)
          }
        }
      }
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (handsFreeMode && event.error !== 'no-speech') {
          setTimeout(() => {
            if (handsFreeMode && !isListening) {
              startListening()
            }
          }, 1000)
        }
      }
      
      recognitionRef.current.onend = () => {
        setIsListening(false)
        if (handsFreeMode) {
          setTimeout(() => {
            if (handsFreeMode) {
              startListening()
            }
          }, 500)
        }
      }
      
      setSpeechSupported(true)
    }

    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }
  }, [handsFreeMode])

  // Handle hands-free mode toggle
  useEffect(() => {
    if (handsFreeMode && speechSupported) {
      startListening()
    } else if (!handsFreeMode && isListening) {
      stopListening()
    }
  }, [handsFreeMode])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const speakText = (text) => {
    if (synthRef.current && voiceEnabled) {
      synthRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1.0
      utterance.volume = 0.8
      
      const voices = synthRef.current.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.name.includes('Alex') ||
        voice.name.includes('Samantha')
      )
      if (preferredVoice) {
        utterance.voice = preferredVoice
      }
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        if (handsFreeMode && !isListening) {
          setTimeout(() => startListening(), 500)
        }
      }
      utterance.onerror = () => setIsSpeaking(false)
      
      synthRef.current.speak(utterance)
    }
  }

  const sendMessageWithText = (text) => {
    if (text.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        text: text,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
      setChatMessages(prev => [...prev, newMessage])
      setMessage('')
      
      setTimeout(() => {
        const responses = [
          "Mobile interface active. Processing your request through our distributed AI network.",
          "Voice command received on mobile. Engaging 42 algorithms for optimal response.",
          "Mobile AI processing complete. Your request has been analyzed and processed.",
          "Hands-free mobile mode operational. I'm ready to assist with your next command.",
          "Mobile interface synchronized with main system. All functions are operational."
        ]
        
        const aiResponse = {
          id: chatMessages.length + 2,
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
        setChatMessages(prev => [...prev, aiResponse])
        
        if (voiceEnabled) {
          setTimeout(() => speakText(aiResponse.text), 500)
        }
      }, 1500)
    }
  }

  const sendMessage = () => {
    sendMessageWithText(message)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleVoiceActivation = () => {
    if (speechSupported) {
      if (!handsFreeMode) {
        startListening()
        speakText("Mobile AI activated. I'm listening.")
      } else {
        speakText("Hands-free mode is already active on mobile.")
      }
    }
  }

  const renderStatusBar = () => (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 text-white text-xs">
      <div className="flex items-center space-x-2">
        <Clock className="w-3 h-3" />
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <Signal className="w-3 h-3" />
          <div className="flex space-x-0.5">
            {[...Array(systemMetrics.signalStrength)].map((_, i) => (
              <div key={i} className="w-1 h-2 bg-green-400 rounded-sm"></div>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Wifi className="w-3 h-3 text-green-400" />
        </div>
        <div className="flex items-center space-x-1">
          <Battery className="w-3 h-3" />
          <span>{systemMetrics.batteryLevel}%</span>
        </div>
      </div>
    </div>
  )

  const renderNavigation = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700">
      <div className="flex justify-around py-2">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'chat', icon: MessageCircle, label: 'Chat' },
          { id: 'monitor', icon: Monitor, label: 'Monitor' },
          { id: 'settings', icon: Settings, label: 'Settings' }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentView(id)}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors ${
              currentView === id 
                ? 'text-yellow-400 bg-yellow-500/20' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )

  const renderHomeView = () => (
    <div className="space-y-6 pb-20">
      {/* Hero Section with App Store Quality HD Brain Logo */}
      <div className="text-center py-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="flex justify-center mb-4">
          <img 
            src={brainLogoHD} 
            alt="AI Apex Brain HD Logo" 
            className="w-24 h-24 drop-shadow-2xl rounded-2xl"
            style={{ 
              imageRendering: 'crisp-edges',
              WebkitImageRendering: 'crisp-edges',
              filter: 'contrast(1.1) brightness(1.05) saturate(1.1)'
            }}
          />
        </div>
        <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
          AI APEX BRAIN
        </h1>
        <p className="text-slate-300 text-sm mb-4">Mobile Intelligence Interface</p>
        <div className="flex justify-center space-x-2">
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
            {systemMetrics.successRate}% Success
          </Badge>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
            {systemMetrics.activeAlgorithms} Algorithms
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4">
        <h3 className="text-lg font-semibold mb-4 text-white">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          {speechSupported && (
            <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors"
                  onClick={handleVoiceActivation}>
              <CardContent className="p-4 text-center">
                <Mic className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-semibold text-sm text-white">Voice Command</h4>
                <p className="text-xs text-slate-400">Say "Hey JARVIS"</p>
              </CardContent>
            </Card>
          )}
          
          <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors"
                onClick={() => setCurrentView('chat')}>
            <CardContent className="p-4 text-center">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-white">Chat Interface</h4>
              <p className="text-xs text-slate-400">Text conversation</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors"
                onClick={() => setCurrentView('monitor')}>
            <CardContent className="p-4 text-center">
              <BarChart3 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-white">System Monitor</h4>
              <p className="text-xs text-slate-400">Performance metrics</p>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800/50 border-slate-700 cursor-pointer hover:bg-slate-800/70 transition-colors">
            <CardContent className="p-4 text-center">
              <Bot className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-sm text-white">AI Control</h4>
              <p className="text-xs text-slate-400">Algorithm management</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="px-4">
        <h3 className="text-lg font-semibold mb-4 text-white">System Status</h3>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{systemMetrics.activeAlgorithms}</div>
                <div className="text-xs text-slate-400">Active Algorithms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{systemMetrics.successRate}%</div>
                <div className="text-xs text-slate-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{systemMetrics.activeAgents}</div>
                <div className="text-xs text-slate-400">Active Agents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{systemMetrics.selfLearningRate}%</div>
                <div className="text-xs text-slate-400">Self-Learning</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderChatView = () => (
    <div className="flex flex-col h-full pb-20">
      {/* Chat Header */}
      <div className="bg-slate-900/90 p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={brainLogoHD} 
              alt="AI Brain" 
              className="w-10 h-10 rounded-lg"
              style={{ 
                imageRendering: 'crisp-edges',
                WebkitImageRendering: 'crisp-edges',
                filter: 'contrast(1.1) brightness(1.05) saturate(1.1)'
              }}
            />
            <div>
              <h2 className="font-semibold text-white">AI Apex Brain</h2>
              <p className="text-xs text-slate-400">Mobile Interface Active</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {speechSupported && (
              <div className="flex items-center space-x-1">
                <Switch
                  checked={handsFreeMode}
                  onCheckedChange={setHandsFreeMode}
                  className="data-[state=checked]:bg-purple-500 scale-75"
                />
                <Headphones className="w-4 h-4 text-purple-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 ${
              msg.sender === 'user' 
                ? 'bg-yellow-500/20 text-yellow-100 border border-yellow-500/30' 
                : 'bg-slate-700/50 text-slate-100 border border-slate-600'
            }`}>
              <p className="text-sm">{msg.text}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs opacity-70">{msg.timestamp}</p>
                {msg.sender === 'ai' && voiceEnabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(msg.text)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-white"
                  >
                    <Volume2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voice Status */}
      {(isListening || isSpeaking) && (
        <div className="px-4 py-2">
          <div className="flex justify-center space-x-4">
            {isListening && (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">
                <Mic className="w-3 h-3 mr-1" />
                {handsFreeMode ? 'Hands-Free Active' : 'Listening...'}
              </Badge>
            )}
            {isSpeaking && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                <Volume2 className="w-3 h-3 mr-1" />
                Speaking...
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-700">
        <div className="flex space-x-2">
          <Textarea
            placeholder={handsFreeMode ? 'Hands-free mode active...' : 'Type your message...'}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none text-sm"
            rows={2}
            disabled={handsFreeMode}
          />
          <div className="flex flex-col space-y-1">
            {speechSupported && !handsFreeMode && (
              <Button
                onClick={isListening ? stopListening : startListening}
                className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white p-2`}
                disabled={isSpeaking}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
            )}
            <Button 
              onClick={sendMessage} 
              className="bg-yellow-500 hover:bg-yellow-600 text-black p-2"
              disabled={handsFreeMode}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMonitorView = () => (
    <div className="space-y-6 pb-20 p-4">
      <div className="text-center mb-6">
        <img 
          src={brainLogoHD} 
          alt="AI Brain" 
          className="w-16 h-16 mx-auto mb-3 rounded-xl"
          style={{ 
            imageRendering: 'crisp-edges',
            WebkitImageRendering: 'crisp-edges',
            filter: 'contrast(1.1) brightness(1.05) saturate(1.1)'
          }}
        />
        <h2 className="text-xl font-bold text-white">System Monitor</h2>
        <p className="text-sm text-slate-400">Real-time performance metrics</p>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Activity className="w-5 h-5 text-green-500" />
            <span>Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">CPU Usage</span>
              <span className="text-yellow-400">{systemMetrics.cpuUsage}%</span>
            </div>
            <Progress value={systemMetrics.cpuUsage} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Memory Usage</span>
              <span className="text-blue-400">{systemMetrics.memoryUsage}%</span>
            </div>
            <Progress value={systemMetrics.memoryUsage} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Self-Learning Progress</span>
              <span className="text-green-400">{systemMetrics.selfLearningRate}%</span>
            </div>
            <Progress value={systemMetrics.selfLearningRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* System Components */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Database className="w-5 h-5 text-blue-500" />
            <span>System Components</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Active Algorithms</span>
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              {systemMetrics.activeAlgorithms}/42
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Loaded Models</span>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
              {systemMetrics.loadedModels}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Voice Banks</span>
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
              {systemMetrics.voiceBanks}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Active Agents</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {systemMetrics.activeAgents}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Infrastructure Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Zap className="w-5 h-5 text-yellow-500" />
            <span>Infrastructure</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Neon Database</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Connected</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Hetzner Cloud</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Online</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Voice Engine</span>
            <Badge className={`${speechSupported ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
              {speechSupported ? 'Active' : 'Unavailable'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Mobile Sync</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Synchronized</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettingsView = () => (
    <div className="space-y-6 pb-20 p-4">
      <div className="text-center mb-6">
        <img 
          src={brainLogoHD} 
          alt="AI Brain" 
          className="w-16 h-16 mx-auto mb-3 rounded-xl"
          style={{ 
            imageRendering: 'crisp-edges',
            WebkitImageRendering: 'crisp-edges',
            filter: 'contrast(1.1) brightness(1.05) saturate(1.1)'
          }}
        />
        <h2 className="text-xl font-bold text-white">Settings</h2>
        <p className="text-sm text-slate-400">Configure your AI experience</p>
      </div>

      {/* Voice Settings */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Mic className="w-5 h-5 text-blue-500" />
            <span>Voice Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-white">Voice Output</span>
              <p className="text-xs text-slate-400">Enable AI voice responses</p>
            </div>
            <Switch
              checked={voiceEnabled}
              onCheckedChange={setVoiceEnabled}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          {speechSupported && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-white">Hands-Free Mode</span>
                <p className="text-xs text-slate-400">Continuous voice detection</p>
              </div>
              <Switch
                checked={handsFreeMode}
                onCheckedChange={setHandsFreeMode}
                className="data-[state=checked]:bg-purple-500"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-base">
            <Smartphone className="w-5 h-5 text-green-500" />
            <span>System Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">App Version</span>
            <span className="text-sm text-white">2.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Build</span>
            <span className="text-sm text-white">Enhanced Mobile</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Platform</span>
            <span className="text-sm text-white">Cross-Platform</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Network Status</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {systemMetrics.networkStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4 text-center">
          <img 
            src={brainLogoHD} 
            alt="AI Brain" 
            className="w-12 h-12 mx-auto mb-3 rounded-lg"
            style={{ 
              imageRendering: 'crisp-edges',
              WebkitImageRendering: 'crisp-edges',
              filter: 'contrast(1.1) brightness(1.05) saturate(1.1)'
            }}
          />
          <h3 className="font-semibold text-white mb-2">AI Apex Brain Mobile</h3>
          <p className="text-xs text-slate-400 mb-3">
            Advanced artificial intelligence platform with 42 optimized algorithms, 
            vertex-level orchestration, and self-learning capabilities.
          </p>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
            Production Ready • 90% Success Rate
          </Badge>
        </CardContent>
      </Card>
    </div>
  )

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return renderHomeView()
      case 'chat':
        return renderChatView()
      case 'monitor':
        return renderMonitorView()
      case 'settings':
        return renderSettingsView()
      default:
        return renderHomeView()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {renderStatusBar()}
      <div className="flex-1 overflow-y-auto">
        {renderCurrentView()}
      </div>
      {renderNavigation()}
    </div>
  )
}

export default App

