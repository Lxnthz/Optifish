import React from "react";

export default function RequestsTab({ requests, handleRequestAction }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users Requests</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Request ID</th>
            <th className="border border-gray-300 px-4 py-2">User Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Requested Role</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.length > 0 ? (
            requests.map((request) => (
              <tr key={request.id}>
                <td className="border border-gray-300 px-4 py-2">
                  {request.id}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.full_name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {request.requested_role}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(request.created_at).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleRequestAction(request.id, "approved")}
                    className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 mr-2">
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequestAction(request.id, "rejected")}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600">
                    Reject
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                No requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
