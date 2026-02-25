import React, { useState } from "react";

export default function Drivers() {
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "Ramesh Kumar",
      phone: "9876543210",
      license: "TN-2023-12345",
      bus: "Bus-101",
      tripCode: 1001,
      status: true,
    },
    {
      id: 2,
      name: "Suresh Babu",
      phone: "9123456780",
      license: "TN-2022-98765",
      bus: "Unassigned",
      tripCode: 1002,
      status: false,
    },
  ]);

  const toggleStatus = (id) => {
    setDrivers((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, status: !d.status } : d
      )
    );
  };

  return (
    <div className="drivers-page">
      {/* ===== CSS inside same file ===== */}
      <style>{`
        .drivers-page {
          padding: 24px;
          font-family: Arial, Helvetica, sans-serif;
          background: #f4f6f9;
          min-height: 100vh;
        }

        .drivers-header {
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

        .drivers-table {
          width: 100%;
          border-collapse: collapse;
        }

        .drivers-table th {
          text-align: left;
          padding: 12px;
          font-size: 14px;
          color: #6b7280;
          border-bottom: 1px solid #eee;
        }

        .drivers-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #f1f1f1;
          font-size: 14px;
        }

        .drivers-table tr:hover {
          background: #f9fafb;
        }

        .trip-badge {
          background: transparent;
          color: #374151;
          padding: 0;
          border-radius: 0;
          font-weight: 400;
          font-size: 14px;
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

      <div className="drivers-header">
        <h2>Manage Drivers</h2>
        <button className="add-btn">+ Add Driver</button>
      </div>

      <div className="table-card">
        <table className="drivers-table">
          <thead>
            <tr>
              <th>Trip Code</th>
              <th>Name</th>
              <th>Phone</th>
              <th>License</th>
              <th>Assigned Bus</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {drivers.map((driver) => (
              <tr key={driver.id}>
                <td>
                  <span className="trip-badge">{driver.tripCode}</span>
                </td>
                <td>{driver.name}</td>
                <td>{driver.phone}</td>
                <td>{driver.license}</td>
                <td>{driver.bus}</td>

                <td>
                  <button
                    className={
                      driver.status ? "status active" : "status inactive"
                    }
                    onClick={() => toggleStatus(driver.id)}
                  >
                    {driver.status ? "Active" : "Inactive"}
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
