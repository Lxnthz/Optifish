export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch("/api/role-upgrade-requests");
      const data = await response.json();
      setRequests(data);
    };
    fetchRequests();
  }, []);

  const handleApproval = async (requestId, status) => {
    try {
      const response = await fetch("/api/role-upgrade-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });
      if (response.ok) {
        alert(`Request ${status}`);
        setRequests((prev) =>
          prev.filter((request) => request.request_id !== requestId)
        );
      }
    } catch (error) {
      console.error("Error processing request:", error);
    }
  };

  return (
    <div>
      <h1>Role Upgrade Requests</h1>
      <ul>
        {requests.map((request) => (
          <li key={request.request_id}>
            User ID: {request.user_id}, Requested Role: {request.requested_role}
            <button
              onClick={() => handleApproval(request.request_id, "approved")}>
              Approve
            </button>
            <button
              onClick={() => handleApproval(request.request_id, "rejected")}>
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
