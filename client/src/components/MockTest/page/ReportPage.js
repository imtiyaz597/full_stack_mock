// src/pages/ReportPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ReportPage = () => {
  const { resultId } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`https://mock-full-stack-2.onrender.com/api/results/${resultId}`);
        const data = await res.json();
        setReport(data);
      } catch (err) {
        console.error("Error fetching report", err);
      }
    };

    fetchReport();
  }, [resultId]);

  if (!report) return <div>Loading report...</div>;

  const {
    testTitle,
    score,
    totalMarks,
    correct,
    incorrect,
    skipped,
    rank,
    topper,
    average,
    yourAccuracy,
    topperAccuracy,
    averageAccuracy,
    topicReport,
    difficultyStats,
    difficultyScore,
  } = report;

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "auto" }}>
      <h2>{testTitle}</h2>
      <p>
        <strong>Your Score:</strong> {score} / {totalMarks}
      </p>
      <p>
        <strong>Correct:</strong> {correct} | <strong>Incorrect:</strong> {incorrect} |{" "}
        <strong>Skipped:</strong> {skipped}
      </p>
      <p>
        <strong>Rank:</strong> #{rank}
      </p>
      <p>
        <strong>Topper Score:</strong> {topper} | <strong>Average:</strong> {average}
      </p>
      <p>
        <strong>Your Accuracy:</strong> {yourAccuracy}% | <strong>Topper Accuracy:</strong> {topperAccuracy}% |{" "}
        <strong>Average Accuracy:</strong> {averageAccuracy}%
      </p>

      <h3>📊 Topic Report</h3>
      <table border="1" cellPadding="8" style={{ width: "100%", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th>Topic</th>
            <th>Total</th>
            <th>Correct</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(topicReport) && topicReport.length > 0 ? (
            topicReport.map((t, i) => (
              <tr key={i}>
                <td>{t.tag}</td>
                <td>{t.total}</td>
                <td>{t.correct}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No topic report available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h3 style={{ marginTop: "2rem" }}>📈 Difficulty Level Analysis</h3>
      <p>
        <strong>Easy:</strong> {difficultyScore?.Easy || 0} / {difficultyStats?.Easy || 0}
      </p>
      <p>
        <strong>Medium:</strong> {difficultyScore?.Medium || 0} / {difficultyStats?.Medium || 0}
      </p>
      <p>
        <strong>Intense:</strong> {difficultyScore?.Intense || 0} / {difficultyStats?.Intense || 0}
      </p>
    </div>
  );
};

export default ReportPage;
