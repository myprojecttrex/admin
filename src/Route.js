import React, { useState } from "react";

export default function Routes() {
  const [routes, setRoutes] = useState([
    {
      id: 1,
      name: "Route 1",
      from: "Chennai",
      to: "Trichy",
      stops: 8,
      bus: "Bus-101",
      status: true,
    },
    {
      id: 2,
      name: "Route 2",
      from: "Madurai",
      to: "Salem",
      stops: 6,
      bus: "Unassigned",
      status: false,
    },
  ]);

  const toggleStatus = (id) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: !r.status } : r
      )
    );
  };

  return (
    <div className="routes-page">
      {/* ===== CSS INSIDE SAME FILE ===== */}
      <style>{`
        .routes-page {
          padding: 24px;
          font-family: Arial, Helvetica, sans-serif;
          background: #f4f6f9;
          min-height: 100vh;
        }

        .routes-header {
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

        .routes-table {
          width: 100%;
          border-collapse: collapse;
        }

        .routes-table th {
          text-align: left;
          padding: 12px;
          font-size: 14px;
          color: #6b7280;
          border-bottom: 1px solid #eee;
        }

        .routes-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #f1f1f1;
          font-size: 14px;
        }

        .routes-table tr:hover {
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

      <div className="routes-header">
        <h2>Manage Routes</h2>
        <button className="add-btn">+ Add Route</button>
      </div>

      <div className="table-card">
        <table className="routes-table">
          <thead>
            <tr>
              <th>Route Name</th>
              <th>From</th>
              <th>To</th>
              <th>Stops</th>
              <th>Assigned Bus</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {routes.map((route) => (
              <tr key={route.id}>
                <td>{route.name}</td>
                <td>{route.from}</td>
                <td>{route.to}</td>
                <td>{route.stops}</td>
                <td>{route.bus}</td>

                <td>
                  <button
                    className={route.status ? "status active" : "status inactive"}
                    onClick={() => toggleStatus(route.id)}
                  >
                    {route.status ? "Active" : "Inactive"}
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
