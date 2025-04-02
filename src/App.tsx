import { useState, useEffect } from 'react'
import Timer from './components/Timer'
import Settings from './components/Settings'
import History from './components/History'
import './App.css'
import { Play, Pause, RotateCcw, Settings as SettingsIcon, History as HistoryIcon } from 'lucide-react'

interface Session {
  id: string
  date: string
  workDuration: number
  restDuration: number
  rounds: number
  sets: number
  completed: boolean
  events: {
    type: 'start' | 'pause' | 'restart' | 'complete'
    time: string
    round: number
    set: number
    isWorkTime: boolean
  }[]
}

function App() {
  const [workDuration, setWorkDuration] = useState(25 * 60)
  const [restDuration, setRestDuration] = useState(5 * 60)
  const [rounds, setRounds] = useState(4)
  const [sets, setSets] = useState(1)
  const [sessions, setSessions] = useState<Session[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [round, setRound] = useState(1)
  const [set, setSet] = useState(1)
  const [isWorkTime, setIsWorkTime] = useState(true)
  const [timeInput, setTimeInput] = useState({
    work: '25',
    rest: '05',
    long: '15'
  })
  const [currentSession, setCurrentSession] = useState<Session | null>(null)

  useEffect(() => {
    // Initialize timeInput with default values
    setTimeInput({
      work: formatDuration(workDuration).replace(':', ''),
      rest: formatDuration(restDuration).replace(':', ''),
      long: formatDuration(restDuration * 3).replace(':', '')
    })
  }, [])

  useEffect(() => {
    let interval: number | undefined
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      handleTimerComplete()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    if (isWorkTime) {
      // Work time completed, start break time automatically
      if (round === rounds) {
        if (set === sets) {
          // All sets completed, stop the timer
          setIsRunning(false)
          setTimeLeft(workDuration)
          setRound(1)
          setSet(1)
          setIsWorkTime(true)
          if (currentSession) {
            const completedSession: Session = {
              ...currentSession,
              completed: true,
              events: [
                ...currentSession.events,
                {
                  type: 'complete' as const,
                  time: new Date().toISOString(),
                  round,
                  set,
                  isWorkTime
                }
              ]
            }
            const updatedSessions = [completedSession, ...sessions]
            setSessions(updatedSessions)
            localStorage.setItem('pomodoroSessions', JSON.stringify(updatedSessions))
            setCurrentSession(null)
          }
        } else {
          // Set completed, start long break
          setTimeLeft(restDuration * 3)
          setRound(1)
          setSet((prev) => prev + 1)
          setIsWorkTime(false)
          if (currentSession) {
            const updatedSession: Session = {
              ...currentSession,
              events: [
                ...currentSession.events,
                {
                  type: 'complete' as const,
                  time: new Date().toISOString(),
                  round,
                  set,
                  isWorkTime
                }
              ]
            }
            setCurrentSession(updatedSession)
          }
        }
      } else {
        // Round completed, start short break
        setTimeLeft(restDuration)
        setRound((prev) => prev + 1)
        setIsWorkTime(false)
        if (currentSession) {
          const updatedSession: Session = {
            ...currentSession,
            events: [
              ...currentSession.events,
              {
                type: 'complete' as const,
                time: new Date().toISOString(),
                round,
                set,
                isWorkTime
              }
            ]
          }
          setCurrentSession(updatedSession)
        }
      }
    } else {
      // Break time completed, start work time automatically
      setTimeLeft(workDuration)
      setIsWorkTime(true)
      if (currentSession) {
        const updatedSession: Session = {
          ...currentSession,
          events: [
            ...currentSession.events,
            {
              type: 'complete' as const,
              time: new Date().toISOString(),
              round,
              set,
              isWorkTime
            }
          ]
        }
        setCurrentSession(updatedSession)
      }
    }
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3')
    audio.volume = 0.1
    audio.play()
  }

  useEffect(() => {
    // Load sessions from localStorage
    const savedSessions = localStorage.getItem('pomodoroSessions')
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions)
        setSessions(parsedSessions)
      } catch (error) {
        console.error('Error loading sessions:', error)
        localStorage.removeItem('pomodoroSessions')
      }
    }
  }, [])

  const handleSettingsChange = (settings: {
    workDuration: number
    restDuration: number
    rounds: number
    sets: number
  }) => {
    setWorkDuration(settings.workDuration)
    setRestDuration(settings.restDuration)
    setRounds(settings.rounds)
    setSets(settings.sets)
  }

  const handleSessionComplete = () => {
    if (currentSession) {
      const completedSession: Session = {
        ...currentSession,
        completed: true,
        events: [
          ...currentSession.events,
          {
            type: 'complete' as const,
            time: new Date().toISOString(),
            round,
            set,
            isWorkTime
          }
        ]
      }
      const updatedSessions = [completedSession, ...sessions]
      setSessions(updatedSessions)
      localStorage.setItem('pomodoroSessions', JSON.stringify(updatedSessions))
      setCurrentSession(null)
    }
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
    if (!currentSession) {
      const newSession: Session = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        workDuration,
        restDuration,
        rounds,
        sets,
        completed: false,
        events: [{
          type: 'start' as const,
          time: new Date().toISOString(),
          round,
          set,
          isWorkTime
        }]
      }
      setCurrentSession(newSession)
    } else {
      const updatedSession: Session = {
        ...currentSession,
        events: [
          ...currentSession.events,
          {
            type: isRunning ? 'pause' as const : 'start' as const,
            time: new Date().toISOString(),
            round,
            set,
            isWorkTime
          }
        ]
      }
      setCurrentSession(updatedSession)
    }
  }

  const resetTimer = () => {
    setTimeLeft(workDuration)
    setRound(1)
    setSet(1)
    setIsWorkTime(true)
    if (currentSession) {
      const updatedSession: Session = {
        ...currentSession,
        events: [
          ...currentSession.events,
          {
            type: 'restart' as const,
            time: new Date().toISOString(),
            round: 1,
            set: 1,
            isWorkTime: true
          }
        ]
      }
      setCurrentSession(updatedSession)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleTimeInput = (value: string, type: 'work' | 'rest' | 'long') => {
    // Only allow numbers and limit to 4 digits
    if (!/^\d*$/.test(value) || value.length > 4) return

    // Update the input value
    setTimeInput(prev => ({ ...prev, [type]: value }))

    // Handle the input based on length
    if (value.length <= 2) {
      // Only minutes part
      const minutes = parseInt(value.padStart(2, '0'))
      const seconds = type === 'work' ? workDuration % 60 :
                     type === 'rest' ? restDuration % 60 :
                     (restDuration * 3) % 60
      
      const totalSeconds = minutes * 60 + seconds
      updateTimeSettings(totalSeconds, type)
    } else if (value.length <= 4) {
      // Both minutes and seconds
      const minutes = parseInt(value.substring(0, 2))
      let seconds = parseInt(value.substring(2).padStart(2, '0'))
      
      // If seconds are greater than 59, set them to 0
      if (seconds > 59) {
        seconds = 0
      }
      
      const totalSeconds = minutes * 60 + seconds
      updateTimeSettings(totalSeconds, type)
    }
  }

  const updateTimeSettings = (totalSeconds: number, type: 'work' | 'rest' | 'long') => {
    if (type === 'work') {
      handleSettingsChange({ 
        workDuration: totalSeconds, 
        restDuration, 
        rounds, 
        sets 
      })
    } else if (type === 'rest') {
      handleSettingsChange({ 
        workDuration, 
        restDuration: totalSeconds, 
        rounds, 
        sets 
      })
    } else if (type === 'long') {
      handleSettingsChange({ 
        workDuration, 
        restDuration: totalSeconds / 3, 
        rounds, 
        sets 
      })
    }
  }

  const handleTimeBlur = (type: 'work' | 'rest' | 'long') => {
    const value = timeInput[type]
    if (value.length === 1) {
      // If only one digit for minutes, pad with zero
      const paddedValue = value.padStart(2, '0')
      setTimeInput(prev => ({ ...prev, [type]: paddedValue }))
    } else if (value.length > 2) {
      // Check seconds when leaving the field
      const minutes = value.substring(0, 2)
      let seconds = parseInt(value.substring(2))
      if (seconds > 59) {
        seconds = 0
        setTimeInput(prev => ({ ...prev, [type]: minutes + '00' }))
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-200 animate-gradient">
      <div className="fixed inset-0 bg-gradient-to-br from-pink-100/30 via-rose-100/30 to-orange-100/30 animate-gradient">
        <div className="h-full w-full overflow-auto">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <div className={`rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-transform duration-300 ${
                isWorkTime 
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600' 
                  : 'bg-gradient-to-br from-primary-300 to-primary-400'
              }`}>
                <div className="text-9xl font-bold mb-4 font-mono text-white">{formatTime(timeLeft)}</div>
                <div className="text-sm text-primary-100 mb-6">
                  {isWorkTime ? 'Work Time' : 'Break Time'} • Round {round}/{rounds} • Set {set}/{sets}
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={toggleTimer}
                    className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                  >
                    {isRunning ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-4 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <RotateCcw className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  if (showSettings || showHistory) {
                    setShowSettings(false)
                    setShowHistory(false)
                  } else {
                    setShowSettings(true)
                    setShowHistory(false)
                  }
                }}
                className="px-8 py-3 bg-transparent border-2 border-primary-500/50 hover:border-primary-500 hover:bg-primary-500/10 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center gap-4 shadow-lg hover:shadow-xl mb-6"
              >
                <SettingsIcon className="w-5 h-5 text-primary-500" />
                <HistoryIcon className="w-5 h-5 text-primary-500" />
              </button>

              <div className="w-full max-w-4xl">
                {(showSettings || showHistory) && (
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="flex justify-center gap-4 mb-6">
                      <button
                        onClick={() => {
                          setShowSettings(true)
                          setShowHistory(false)
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          showSettings 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => {
                          setShowSettings(false)
                          setShowHistory(true)
                        }}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          showHistory 
                            ? 'bg-primary-500 text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        History
                      </button>
                    </div>

                    {showSettings && (
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm text-primary-600 mb-2">Work Time</label>
                          <input
                            type="text"
                            value={timeInput.work.length > 2 
                              ? timeInput.work.substring(0, 2) + ':' + timeInput.work.substring(2)
                              : timeInput.work}
                            onChange={(e) => handleTimeInput(e.target.value.replace(':', ''), 'work')}
                            onBlur={() => handleTimeBlur('work')}
                            className="w-full bg-white border border-primary-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-center"
                            placeholder="MM:SS"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-primary-600 mb-2">Short Break</label>
                          <input
                            type="text"
                            value={timeInput.rest.length > 2 
                              ? timeInput.rest.substring(0, 2) + ':' + timeInput.rest.substring(2)
                              : timeInput.rest}
                            onChange={(e) => handleTimeInput(e.target.value.replace(':', ''), 'rest')}
                            onBlur={() => handleTimeBlur('rest')}
                            className="w-full bg-white border border-primary-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-center"
                            placeholder="MM:SS"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-primary-600 mb-2">Long Break</label>
                          <input
                            type="text"
                            value={timeInput.long.length > 2 
                              ? timeInput.long.substring(0, 2) + ':' + timeInput.long.substring(2)
                              : timeInput.long}
                            onChange={(e) => handleTimeInput(e.target.value.replace(':', ''), 'long')}
                            onBlur={() => handleTimeBlur('long')}
                            className="w-full bg-white border border-primary-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-center"
                            placeholder="MM:SS"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-primary-600 mb-2">Rounds per Set</label>
                          <input
                            type="number"
                            value={rounds}
                            onChange={(e) => handleSettingsChange({ workDuration, restDuration, rounds: parseInt(e.target.value), sets })}
                            className="w-full bg-white border border-primary-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
                            min="1"
                            max="10"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm text-primary-600 mb-2">Number of Sets</label>
                          <input
                            type="number"
                            value={sets}
                            onChange={(e) => handleSettingsChange({ workDuration, restDuration, rounds, sets: parseInt(e.target.value) })}
                            className="w-full bg-white border border-primary-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-center"
                            min="1"
                            max="5"
                          />
                        </div>
                      </div>
                    )}

                    {showHistory && (
                      <History sessions={sessions} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App