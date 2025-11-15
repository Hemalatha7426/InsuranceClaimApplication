// import React, { useEffect, useState } from "react";
// import "./ClaimList.css";
// import {
//   getAllClaims,
//   getAllCustomers,
//   getMyClaims,
//   updateClaimStatus,
// } from "../utils/api";

// export default function ClaimList({ forAgent = false, onView }) {
//   const [claims, setClaims] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [filter, setFilter] = useState("ALL");
//   const [sortField, setSortField] = useState("");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [editingClaimId, setEditingClaimId] = useState(null);
//   const [editStatus, setEditStatus] = useState("");
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const pageSize = 5;

//   // -------- Fetch claims and customers based on role --------
//   useEffect(() => {
//     const fetchClaims = async () => {
//       setLoading(true);
//       try {
//         const auth = JSON.parse(localStorage.getItem("auth") || "{}");
//         let claimData = [];

//         if (auth.role === "ADMIN" || auth.role === "AGENT") {
//           claimData = await getAllClaims();
//           const customerData = await getAllCustomers();
//           setCustomers(customerData);
//         } else if (auth.role === "CUSTOMER" && auth.customerId) {
//           claimData = await getMyClaims(auth.customerId);
//         }

//         setClaims(claimData || []);
//       } catch (err) {
//         console.error("Failed to fetch claims:", err);
//         setClaims([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchClaims();
//   }, [forAgent]);

//   // -------- Sorting --------
//   const handleSort = (field) => {
//     const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
//     setSortField(field);
//     setSortOrder(order);
//   };

//   const sortedClaims = [...claims]
//     .filter((c) => (filter === "ALL" ? true : c.status === filter))
//     .sort((a, b) => {
//       if (!sortField) return 0;
//       const valA = a[sortField];
//       const valB = b[sortField];
//       if (valA < valB) return sortOrder === "asc" ? -1 : 1;
//       if (valA > valB) return sortOrder === "asc" ? 1 : -1;
//       return 0;
//     });

//   // -------- Pagination --------
//   const paginatedClaims = sortedClaims.slice(
//     (page - 1) * pageSize,
//     page * pageSize
//   );

//   // -------- Save claim status --------
//   const saveStatusUpdate = async (claimId) => {
//     try {
//       await updateClaimStatus(claimId, editStatus);
//       setClaims((prev) =>
//         prev.map((c) => (c.id === claimId ? { ...c, status: editStatus } : c))
//       );
//       setEditingClaimId(null);
//     } catch (err) {
//       console.error("Failed to update claim status:", err);
//     }
//   };

//   // -------- Helper to get customer name --------
//   const getCustomerName = (claim) => {
//     return (
//       claim.customer?.name ||
//       customers.find((c) => c.id === claim.customerId)?.name ||
//       "Unknown"
//     );
//   };

//   if (loading) return <p>Loading claims...</p>;

//   return (
//     <div className="claim-list">
//       <h2>{forAgent ? "Manage Claims" : "My Claims"}</h2>

//       {/* Filter */}
//       <div className="filter-bar">
//         <label>Status:</label>
//         <select
//           value={filter}
//           onChange={(e) => {
//             setFilter(e.target.value);
//             setPage(1);
//           }}
//         >
//           <option value="ALL">All</option>
//           <option value="SUBMITTED">Submitted</option>
//           <option value="UNDER_REVIEW">Under Review</option>
//           <option value="APPROVED">Approved</option>
//           <option value="REJECTED">Rejected</option>
//         </select>
//       </div>

//       {/* Table */}
//       <table className="table">
//         <thead>
//           <tr>
//             <th onClick={() => handleSort("id")}>
//               ID {sortField === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
//             </th>
//             {forAgent && <th>Customer</th>}
//             <th onClick={() => handleSort("claimType")}>
//               Type{" "}
//               {sortField === "claimType" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
//             </th>
//             <th onClick={() => handleSort("claimAmount")}>
//               Amount{" "}
//               {sortField === "claimAmount" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
//             </th>
//             <th onClick={() => handleSort("status")}>
//               Status{" "}
//               {sortField === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
//             </th>
//             <th onClick={() => handleSort("submissionDate")}>
//               Submitted{" "}
//               {sortField === "submissionDate"
//                 ? sortOrder === "asc"
//                   ? "↑"
//                   : "↓"
//                 : ""}
//             </th>
//             <th>File</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {paginatedClaims.length === 0 ? (
//             <tr>
//               <td colSpan={forAgent ? 8 : 7}>No claims found.</td>
//             </tr>
//           ) : (
//             paginatedClaims.map((c) => (
//               <tr key={c.id}>
//                 <td>{c.id}</td>
//                 {forAgent && <td>{getCustomerName(c)}</td>}
//                 <td>{c.claimType}</td>
//                 <td>{c.claimAmount?.toFixed(2)}</td>
//                 <td>
//                   {editingClaimId === c.id ? (
//                     <select
//                       value={editStatus}
//                       onChange={(e) => setEditStatus(e.target.value)}
//                     >
//                       <option value="SUBMITTED">SUBMITTED</option>
//                       <option value="UNDER_REVIEW">UNDER_REVIEW</option>
//                       <option value="APPROVED">APPROVED</option>
//                       <option value="REJECTED">REJECTED</option>
//                     </select>
//                   ) : (
//                     c.status
//                   )}
//                 </td>
//                 <td>{c.submissionDate}</td>
//                 <td>
//                   {c.fileUrl ? (
//                     <a href={c.fileUrl} target="_blank" rel="noopener noreferrer">
//                       View File
//                     </a>
//                   ) : (
//                     <span className="text-muted">No file</span>
//                   )}
//                 </td>
//                 <td>
//                   {forAgent ? (
//                     editingClaimId === c.id ? (
//                       <>
//                         <button
//                           className="btn-small"
//                           onClick={() => saveStatusUpdate(c.id)}
//                         >
//                           Save
//                         </button>
//                         <button
//                           className="btn-small"
//                           onClick={() => setEditingClaimId(null)}
//                         >
//                           Cancel
//                         </button>
//                       </>
//                     ) : (
//                       <button
//                         className="btn-small"
//                         onClick={() => {
//                           setEditingClaimId(c.id);
//                           setEditStatus(c.status);
//                         }}
//                       >
//                         Edit
//                       </button>
//                     )
//                   ) : (
//                     <button
//                       className="btn-small"
//                       onClick={() => onView("details", c.id)}
//                     >
//                       Details
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div className="pagination">
//         <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
//         <span>Page {page} of {Math.ceil(sortedClaims.length / pageSize)}</span>
//         <button
//           onClick={() => setPage((p) => (p * pageSize < sortedClaims.length ? p + 1 : p))}
//           disabled={page * pageSize >= sortedClaims.length}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import "./ClaimList.css";
import {
  getAllClaims,
  getAllCustomers,
  getMyClaims,
  updateClaimStatus,
} from "../utils/api";

export default function ClaimList({ onView }) {
  const [claims, setClaims] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [editingClaimId, setEditingClaimId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isAgent, setIsAgent] = useState(false); // Dynamically track agent/admin
  const pageSize = 5;

  // -------- Fetch claims and customers based on role --------
  useEffect(() => {
    const fetchClaims = async () => {
      setLoading(true);
      try {
        const auth = JSON.parse(localStorage.getItem("auth") || "{}");
        setIsAgent(auth.role === "ADMIN" || auth.role === "AGENT");

        let claimData = [];

        if (auth.role === "ADMIN" || auth.role === "AGENT") {
          claimData = await getAllClaims();
          const customerData = await getAllCustomers();
          setCustomers(customerData);
        } else if (auth.role === "CUSTOMER" && auth.customerId) {
          claimData = await getMyClaims(auth.customerId);
        }

        setClaims(claimData || []);
      } catch (err) {
        console.error("Failed to fetch claims:", err);
        setClaims([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  // -------- Sorting --------
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const sortedClaims = [...claims]
    .filter((c) => (filter === "ALL" ? true : c.status === filter))
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // -------- Pagination --------
  const paginatedClaims = sortedClaims.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // -------- Save claim status --------
  const saveStatusUpdate = async (claimId) => {
    try {
      await updateClaimStatus(claimId, editStatus);
      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status: editStatus } : c))
      );
      setEditingClaimId(null);
    } catch (err) {
      console.error("Failed to update claim status:", err);
    }
  };

  // -------- Helper to get customer name --------
  const getCustomerName = (claim) => {
    return (
      claim.customer?.name ||
      customers.find((c) => c.id === claim.customerId)?.name ||
      "Unknown"
    );
  };

  if (loading) return <p>Loading claims...</p>;

  return (
    <div className="claim-list">
      <h2>{isAgent ? "Manage Claims" : "My Claims"}</h2>

      {/* Filter */}
      <div className="filter-bar">
        <label>Status:</label>
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>
              ID {sortField === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            {isAgent && <th>Customer</th>}
            <th onClick={() => handleSort("claimType")}>
              Type {sortField === "claimType" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("claimAmount")}>
              Amount {sortField === "claimAmount" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("status")}>
              Status {sortField === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th onClick={() => handleSort("submissionDate")}>
              Submitted {sortField === "submissionDate" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </th>
            <th>File</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedClaims.length === 0 ? (
            <tr>
              <td colSpan={isAgent ? 8 : 7}>No claims found.</td>
            </tr>
          ) : (
            paginatedClaims.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                {isAgent && <td>{getCustomerName(c)}</td>}
                <td>{c.claimType}</td>
                <td>{c.claimAmount?.toFixed(2)}</td>
                <td>
                  {editingClaimId === c.id ? (
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="SUBMITTED">SUBMITTED</option>
                      <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  ) : (
                    c.status
                  )}
                </td>
                <td>{c.submissionDate}</td>
                <td>
                  {c.fileUrl ? (
                    <a href={c.fileUrl} target="_blank" rel="noopener noreferrer">
                      View File
                    </a>
                  ) : (
                    <span className="text-muted">No file</span>
                  )}
                </td>
                <td>
                  {isAgent ? (
                    editingClaimId === c.id ? (
                      <>
                        <button className="btn-small" onClick={() => saveStatusUpdate(c.id)}>
                          Save
                        </button>
                        <button className="btn-small" onClick={() => setEditingClaimId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-small"
                        onClick={() => {
                          setEditingClaimId(c.id);
                          setEditStatus(c.status);
                        }}
                      >
                        Edit
                      </button>
                    )
                  ) : (
                    <button className="btn-small" onClick={() => onView("details", c.id)}>
                      Details
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil(sortedClaims.length / pageSize)}
        </span>
        <button
          onClick={() => setPage((p) => (p * pageSize < sortedClaims.length ? p + 1 : p))}
          disabled={page * pageSize >= sortedClaims.length}
        >
          Next
        </button>
      </div>
    </div>
  );
}
