import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StudentAttempts = ({ studentId }) => {
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await axios.get(`https://mock-full-stack-2.onrender.com/api/studentTestData/${studentId}`);
        setAttempts(res.data);
      } catch (err) {
        console.error("Error fetching attempts", err);
      }
    };
    fetchAttempts();
  }, [studentId]);

  return (
    <div className="container my-3">
      <h3>Student Attempts</h3>
      {attempts.length === 0 ? (
        <p>No attempts found.</p>
      ) : (
        <ul className="list-group">
          {attempts.map((attempt, idx) => (
            <li className="list-group-item" key={idx}>
              Attempt #{attempt.attemptNumber} — Score: {attempt.score} — Status: {attempt.status}
              {attempt.completedAt && (
                <div>Completed At: {new Date(attempt.completedAt).toLocaleString()}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentAttempts;
