export default function ParticipantsModal({
  isModalOpen,
  setIsModalOpen,
  selectedParticipants,
  setSelectedParticipants,
  handleStartGroupBuy,
  loading,
  discounts,
}) {
  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Select Participants</h2>
        <div className="space-y-4">
          {[2, 5, 10].map((option) => (
            <div key={option} className="flex items-center gap-2">
              <input
                type="radio"
                id={`participants-${option}`}
                name="participants"
                value={option}
                checked={selectedParticipants === option}
                onChange={() => setSelectedParticipants(option)}
              />
              <label htmlFor={`participants-${option}`}>
                {option} Participants - {discounts[option]}% Discount
              </label>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={handleStartGroupBuy}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
            disabled={loading}>
            {loading ? "Starting..." : "Start Group Buy"}
          </button>
        </div>
      </div>
    </div>
  );
}
