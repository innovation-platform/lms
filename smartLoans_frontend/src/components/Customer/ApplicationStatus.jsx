import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { fetchLoanApplications } from "../../services/loanService";

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const getLoanApplications = async () => {
      try {
        console.log("account Number",user.accountNumber)
        const response = await fetchLoanApplications(user.accountNumber);
        setApplications(response.loans);
      } catch (err) {
        setError("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };
    getLoanApplications();
  }, [user]);

  return (
    <div>
      <h2>Loan Application Status</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && !error && applications.length === 0 && (
        <p>No loan applications found.</p>
      )}

      {!loading && !error && applications.length > 0 && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Loan Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Submitted on</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.loanType}</td>
                <td>{app.loanAmount}/-</td>
                <td>
                  <span
                    className={`badge ${app.status.toLowerCase() === "approved"
                        ? "text-white"
                        : app.status.toLowerCase() === "pending"
                          ? "bg-warning text-white"
                          : app.status.toLowerCase() === "rejected"
                            ? "bg-danger text-white"
                            : app.status.toLowerCase() === "completed"
                              ? "text-white"
                              : "bg-light text-dark"
                      }`}
                    style={{
                      backgroundColor: app.status.toLowerCase() === "completed" ? "#03C04A" : app.status.toLowerCase() === 'approved' ? "#41B3A2" : "",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {app.status}
                  </span>


                </td>
                <td>
                  {/* Show submittedOn date */}
                  {app.submittedOn
                    ? new Date(app.submittedOn).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicationStatus;
