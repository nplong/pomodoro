interface SettingsProps {
  workDuration: number;
  restDuration: number;
  rounds: number;
  onSettingsChange: (settings: { workDuration: number; restDuration: number; rounds: number }) => void;
}

export default function Settings({ workDuration, restDuration, rounds, onSettingsChange }: SettingsProps) {
  const handleChange = (field: string, value: number) => {
    onSettingsChange({
      workDuration,
      restDuration,
      rounds,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-primary-100">
      <h2 className="text-2xl font-bold mb-6 text-primary-900">Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Work Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="60"
            value={workDuration}
            onChange={(e) => handleChange('workDuration', parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Rest Duration (minutes)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={restDuration}
            onChange={(e) => handleChange('restDuration', parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Number of Rounds
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={rounds}
            onChange={(e) => handleChange('rounds', parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border border-primary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
} 