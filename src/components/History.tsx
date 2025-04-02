import { format } from 'date-fns'

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

interface HistoryProps {
  sessions: Session[]
}

const History = ({ sessions }: HistoryProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'start':
        return 'text-green-500'
      case 'pause':
        return 'text-yellow-500'
      case 'restart':
        return 'text-red-500'
      case 'complete':
        return 'text-blue-500'
      default:
        return 'text-gray-500'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'start':
        return '▶️'
      case 'pause':
        return '⏸️'
      case 'restart':
        return '🔄'
      case 'complete':
        return '✅'
      default:
        return '•'
    }
  }

  return (
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No sessions recorded yet.</p>
          <p className="text-gray-400 text-sm mt-2">Complete a Pomodoro session to see it here.</p>
        </div>
      ) : (
        sessions.map((session) => (
          <div key={session.id} className="bg-white rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-500">
                {format(new Date(session.date), 'MMM d, yyyy HH:mm')}
              </div>
              <div className="text-sm text-gray-500">
                {formatTime(session.workDuration)} work • {formatTime(session.restDuration)} break • {session.rounds} rounds • {session.sets} sets
              </div>
            </div>
            <div className="space-y-2">
              {session.events.map((event, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className={getEventColor(event.type)}>{getEventIcon(event.type)}</span>
                  <span className="text-gray-600">
                    {format(new Date(event.time), 'HH:mm:ss')} - {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </span>
                  <span className="text-gray-500">
                    • Round {event.round}/{session.rounds} • Set {event.set}/{session.sets}
                  </span>
                  <span className="text-gray-500">
                    • {event.isWorkTime ? 'Work' : 'Break'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default History 