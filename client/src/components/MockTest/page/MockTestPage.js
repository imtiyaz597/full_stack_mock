import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaTrash, FaEye, FaEyeSlash, FaFilter, FaSearch } from "react-icons/fa";
import "../MockTestPage.css";

const MockTests = () => {
    const { user } = useContext(AuthContext);
    const [mockTestsData, setMockTestsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMockTests();
    }, []);

    const fetchMockTests = async () => {
        try {
            const response = await fetch("https://mock-full-stack-2.onrender.com/api/admin/mock-tests");
            if (response.ok) {
                const data = await response.json();
                setMockTestsData(data);
            } else {
                console.error("Failed to fetch mock tests");
            }
        } catch (error) {
            console.error("Error fetching mock tests:", error);
        }
    };

    const handleToggleStatus = async (testId, currentStatus) => {
        const newStatus = currentStatus === "active" ? "inactive" : "active";
        try {
            const res = await fetch(
                `https://mock-full-stack-2.onrender.com/api/admin/mock-tests/${testId}/status`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                }
            );
            if (res.ok) fetchMockTests();
        } catch (err) {
            console.error("Error updating test status:", err);
        }
    };

    const handleDeleteTest = async (testId) => {
        const confirmDelete = window.confirm("Do you want to delete this test permanently?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(
                `https://mock-full-stack-2.onrender.com/api/admin/mock-tests/${testId}`,
                { method: "DELETE" }
            );
            if (res.ok) fetchMockTests();
        } catch (err) {
            console.error("Error deleting test:", err);
        }
    };

    const filteredTests = mockTestsData.filter((test) => {
        const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" ? true : test.status.toLowerCase() === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mt-4">
            <style>
                {`
                    .card {
                        overflow: hidden;
                    }
                    .hover-card-img {
                        transition: transform 0.3s ease-in-out;
                        will-change: transform;
                    }
                    .card:hover .hover-card-img {
                        transform: scale(1.05);
                    }
                `}
            </style>

            <button className="back-btn-custom mb-3" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <h1 className="text-2xl font-bold mb-3">Available Mock Tests</h1>

            <div className="d-flex align-items-center gap-2 mb-3">
                <div className="input-group" style={{ maxWidth: "300px" }}>
                    <span className="input-group-text"><FaSearch /></span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search test by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="position-relative">
                    <button
                        className="btn btn-outline-dark d-flex align-items-center"
                        onClick={() => setShowFilterOptions((prev) => !prev)}
                    >
                        <FaFilter className="me-1" /> Filter
                    </button>
                    {showFilterOptions && (
                        <div className="position-absolute bg-white border rounded p-2 mt-2 shadow" style={{ zIndex: 10 }}>
                            <button className="dropdown-item" onClick={() => setStatusFilter("all")}>All</button>
                            <button className="dropdown-item" onClick={() => setStatusFilter("active")}>Active</button>
                            <button className="dropdown-item" onClick={() => setStatusFilter("inactive")}>Inactive</button>
                        </div>
                    )}
                </div>

                {user?.role?.toLowerCase() === "admin" && (
                    <button className="btn btn-success ms-auto" onClick={() => navigate("/create-mock-test")}>
                        Create Mock
                    </button>
                )}
            </div>

            {filteredTests.length === 0 ? (
                <p>No mock tests found.</p>
            ) : (
                <div className="row">
                    {filteredTests.map((test) => (
                        <div key={test._id} className="col-md-4">
                            <div className="card mb-3 shadow">
                                {test.wallpaper && (
                                    <img
                                        src={test.wallpaper}
                                        alt="Test Wallpaper"
                                        className="card-img-top hover-card-img"
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{test.title}</h5>
                                    <p className="card-text">
                                        {test.isFree ? "Free" : `Price: ₹${test.price}`}
                                    </p>
                                    <p>
                                        Status:{" "}
                                        <span
                                            style={{
                                                color: "white",
                                                padding: "3px 8px",
                                                borderRadius: "5px",
                                                backgroundColor: test.status === "active" ? "green" : "red",
                                            }}
                                        >
                                            {test.status === "active" ? "Active" : "Inactive"}
                                        </span>
                                    </p>

                                    {user?.role?.toLowerCase() === "student" && (
                                        test.status === "active" ? (
                                            <button className="btn btn-primary" onClick={() => navigate(`/exam/${test._id}`)}>
                                                Start Test
                                            </button>
                                        ) : (
                                            <p className="text-danger fw-bold mt-2">Test is currently inactive</p>
                                        )
                                    )}

                                    {user?.role?.toLowerCase() === "admin" && (
                                        <>
                                            <button className="btn btn-primary" onClick={() => navigate(`/exam/${test._id}`)}>
                                                Edit Test
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary ms-2"
                                                onClick={() => handleToggleStatus(test._id, test.status)}
                                            >
                                                {test.status === "active" ? <FaEye /> : <FaEyeSlash />}
                                            </button>
                                            <button
                                                className="btn btn-outline-danger ms-2"
                                                onClick={() => handleDeleteTest(test._id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </>
                                    )}

                                    {user?.role?.toLowerCase() === "teacher" && (
                                        <>
                                            <button
                                                className="btn btn-info me-2"
                                                onClick={() => navigate(`/exam/${test._id}?mode=view`)}
                                            >
                                                View Test
                                            </button>
                                            <button
                                                className="btn btn-outline-secondary ms-2"
                                                onClick={() => handleToggleStatus(test._id, test.status)}
                                            >
                                                {test.status === "active" ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MockTests;
