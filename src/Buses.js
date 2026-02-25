import React, { useState } from "react";

export default function Buses() {
  const [buses, setBuses] = useState([
    {
      id: 1,
      number: "TN-01-AB-1234",
      model: "Ashok Leyland",
      capacity: 50,
      driver: "Ramesh Kumar",
      status: true,
    },
    {
      id: 2,
      number: "TN-02-CD-5678",
      model: "Tata",
      capacity: 45,
      driver: "Unassigned",
      status: false,
    },
  ]);

  const toggleStatus = (id) => {
    setBuses((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: !b.status } : b
      )
    );
  };

  return (
    <div className="buses-page">
      {/* ===== CSS INSIDE SAME FILE ===== */}
      <style>{`
        .buses-page {
          padding: 24px;
          font-family: Arial, Helvetica, sans-serif;
          background: #f4f6f9;
          min-height: 100vh;
        }

        .buses-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .add-btn {
          background: #4f46e5;
          color: white;
          border: none;
          padding: 10px 16px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 600;
        }

        .add-btn:hover {
          background: #4338ca;
        }

        .table-card {
          background: white;
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
          overflow-x: auto;
        }

        .buses-table {
          width: 100%;
          border-collapse: collapse;
        }

        .buses-table th {
          text-align: left;
          padding: 12px;
          font-size: 14px;
          color: #6b7280;
          border-bottom: 1px solid #eee;
        }

        .buses-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #f1f1f1;
          font-size: 14px;
        }

        .buses-table tr:hover {
          background: #f9fafb;
        }

        .status {
          border: none;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .status.active {
          background: #dcfce7;
          color: #166534;
        }

        .status.inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .actions button {
          border: none;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
        }

        .actions .edit {
          background: #e0f2fe;
          color: #075985;
        }

        .actions .delete {
          background: #fee2e2;
          color: #991b1b;
        }

        .actions button:hover {
          opacity: 0.85;
        }
      `}</style>

      <div className="buses-header">
        <h2>Manage Buses</h2>
        <button className="add-btn">+ Add Bus</button>
      </div>

      <div className="table-card">
        <table className="buses-table">
          <thead>
            <tr>
              <th>Bus Number</th>
              <th>Model</th>
              <th>Capacity</th>
              <th>Driver</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {buses.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.number}</td>
                <td>{bus.model}</td>
                <td>{bus.capacity}</td>
                <td>{bus.driver}</td>

                <td>
                  <button
                    className={bus.status ? "status active" : "status inactive"}
                    onClick={() => toggleStatus(bus.id)}
                  >
                    {bus.status ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="actions">
                  <button className="edit">Edit</button>
                  <button className="delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
