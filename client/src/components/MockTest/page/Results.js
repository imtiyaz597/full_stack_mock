// import React, { useState } from "react";

// const Results = ({ questions, userAnswers }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   if (!questions || questions.length === 0) {
//     return <div>No questions available to display results.</div>;
//   }

//   const currentQuestion = questions[currentIndex];
//   const userAnswer = userAnswers?.[currentQuestion._id];
//   const options = currentQuestion?.options || [];
//   let correctAnswer = currentQuestion?.answer;

//   // ✅ Proper comparison logic for Drag and Drop
//   let isCorrect = userAnswer?.isCorrect;

//   if (
//     currentQuestion.questionType === "Drag and Drop" &&
//     typeof userAnswer?.selectedOption === "object"
//   ) {
//     const expected = {};
//     currentQuestion.definitions?.forEach((def) => {
//       if (def.text && def.match) {
//         expected[def.text.toLowerCase().trim()] = def.match.toLowerCase().trim();
//       }
//     });

//     const given = {};
//     Object.entries(userAnswer.selectedOption || {}).forEach(([def, term]) => {
//       if (def && term) {
//         given[def.toLowerCase().trim()] = term.toLowerCase().trim();
//       }
//     });

//     const normalize = (obj) =>
//       Object.entries(obj)
//         .sort((a, b) => a[0].localeCompare(b[0]))
//         .map(([k, v]) => `${k}:${v}`)
//         .join("|");

//     isCorrect = normalize(expected) === normalize(given);
//   }

//   const formatUserAnswer = () => {
//     if (
//       currentQuestion.questionType === "Drag and Drop" &&
//       typeof userAnswer?.selectedOption === "object"
//     ) {
//       return Object.entries(userAnswer.selectedOption)
//         .map(([definition, term]) => `${term}: ${definition}`)
//         .join(", ");
//     }

//     if (typeof userAnswer?.selectedOption === "object") {
//       return Object.entries(userAnswer.selectedOption)
//         .map(([def, term]) => `${term}: ${def}`)
//         .join(", ");
//     }

//     if (Array.isArray(userAnswer?.selectedOption)) {
//       return userAnswer.selectedOption.join(", ");
//     }

//     return userAnswer?.selectedOption || "None";
//   };

//   let formattedCorrectAnswer = correctAnswer;

//   if (
//     currentQuestion.questionType === "Drag and Drop" &&
//     Array.isArray(correctAnswer) &&
//     Array.isArray(currentQuestion.terms) &&
//     Array.isArray(currentQuestion.definitions)
//   ) {
//     formattedCorrectAnswer = currentQuestion.definitions.map((def) => {
//       const term = def.match;
//       const definition = def.text;
//       return `${term}: ${definition}`;
//     });
//   }

//   const handleNext = () => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex((prevIndex) => prevIndex + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex((prevIndex) => prevIndex - 1);
//     }
//   };

//   const displayIsCorrect = isCorrect;

//   return (
//     <div className="container my-5">
//       <h2 className="text-center mb-4">Test Results</h2>
//       <div className="card mb-4">
//         <div className="card-body">
//           <h5 className="card-title">
//             {currentQuestion.questionNumber}: {currentQuestion.question}
//           </h5>
//           <p>
//             <strong>Question Type:</strong>{" "}
//             {currentQuestion.questionType || "N/A"}
//           </p>

//           {Array.isArray(options) ? (
//             <ul className="list-group">
//               {options.map((option) => {
//                 const isCorrectOption = Array.isArray(correctAnswer)
//                   ? correctAnswer.includes(option._id)
//                   : correctAnswer === option._id;
//                 const isSelectedOption = Array.isArray(userAnswer?.selectedOption)
//                   ? userAnswer.selectedOption.includes(option._id)
//                   : userAnswer?.selectedOption === option._id;

//                 return (
//                   <li
//                     key={option._id || option.label}
//                     className={`list-group-item ${
//                       isCorrectOption
//                         ? "list-group-item-success"
//                         : isSelectedOption
//                         ? "list-group-item-danger"
//                         : ""
//                     }`}
//                   >
//                     {`${option.label}: ${option.text}`}
//                     {isCorrectOption && <strong> (Correct)</strong>}
//                     {isSelectedOption && !isCorrectOption && (
//                       <strong> (Your Selection)</strong>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : typeof options === "object" ? (
//             <ul className="list-group">
//               {Object.entries(options).map(([key, value]) => {
//                 const isCorrectOption = correctAnswer?.[key] === value;
//                 const isSelectedOption =
//                   userAnswer?.selectedOption?.[key] === value;

//                 return (
//                   <li
//                     key={key}
//                     className={`list-group-item ${
//                       isCorrectOption
//                         ? "list-group-item-success"
//                         : isSelectedOption
//                         ? "list-group-item-danger"
//                         : ""
//                     }`}
//                   >
//                     {`${key}: ${value}`}
//                     {isCorrectOption && <strong> (Correct)</strong>}
//                     {isSelectedOption && !isCorrectOption && (
//                       <strong> (Your Selection)</strong>
//                     )}
//                   </li>
//                 );
//               })}
//             </ul>
//           ) : (
//             <p>No valid options available.</p>
//           )}

//           <p className="mt-3">
//             <strong>Your Answer:</strong> {formatUserAnswer()}
//           </p>

//           <p>
//             <strong>Correct Answer:</strong>{" "}
//             {Array.isArray(formattedCorrectAnswer)
//               ? formattedCorrectAnswer.join(", ")
//               : formattedCorrectAnswer || "None"}
//           </p>

//           <p>
//             <strong>Status:</strong>{" "}
//             <span
//               className={`badge ${
//                 displayIsCorrect ? "bg-success" : "bg-danger"
//               }`}
//             >
//               {displayIsCorrect ? "Correct" : "Incorrect"}
//             </span>
//           </p>
//         </div>
//       </div>

//       <div className="d-flex justify-content-between">
//         <button
//           className="btn btn-primary"
//           onClick={handlePrevious}
//           disabled={currentIndex === 0}
//         >
//           Previous
//         </button>
//         <button
//           className="btn btn-primary"
//           onClick={handleNext}
//           disabled={currentIndex === questions.length - 1}
//         >
//           Next
//         </button>


//       </div>
//     </div>
//   );
// };

// export default Results;

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ExamContentLayout from "./ExamContentLayout";

const API_BASE_URL = "https://mock-full-stack-2.onrender.com";

const ExamContent = ({
  test,
  setTest,
  testId,
  user,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  answers,
  setAnswers,
  markedForReview,
  setMarkedForReview,
  questionStatus,
  setQuestionStatus,
  timeLeft,
  setTimeLeft,
  score,
  setScore,
  showModal,
  setShowModal,
  viewingSolutions,
  setViewingSolutions,
  editedQuestions,
  setEditedQuestions,
  editingQuestionId,
  setEditingQuestionId,
  visitedQuestions,
  setVisitedQuestions,
}) => {
  const navigate = useNavigate();
  const isStudent = user?.role?.toLowerCase() === "student";
  const [showSummaryBeforeSubmit, setShowSummaryBeforeSubmit] = useState(false);

  useEffect(() => {
    const handleTriggerModal = () => setShowModal(true);
    window.addEventListener("trigger-submit-modal", handleTriggerModal);
    return () => window.removeEventListener("trigger-submit-modal", handleTriggerModal);
  }, []);

  useEffect(() => {
    if (!test || !isStudent) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowSummaryBeforeSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, isStudent]);

  useEffect(() => {
    if (!test || !test.questions.length || !isStudent) return;
    const currentQuestion = test.questions[currentQuestionIndex];
    const qId = currentQuestion._id || currentQuestion.questionNumber;
    setVisitedQuestions((prev) => ({ ...prev, [qId]: true }));

    if (currentQuestionIndex > 0) {
      const prevQuestion = test.questions[currentQuestionIndex - 1];
      const prevQId = prevQuestion._id || prevQuestion.questionNumber;

      setQuestionStatus((prev) => {
        const currentStatus = prev[prevQId];
        const hasAnswer = answers[prevQId] !== undefined && answers[prevQId] !== null;
        const isMarked = markedForReview[prevQId];
        const newStatus = hasAnswer && isMarked
          ? "answeredMarked"
          : isMarked
          ? "marked"
          : hasAnswer
          ? "answered"
          : visitedQuestions[prevQId]
          ? "unanswered"
          : currentStatus || "notVisited";

        return currentStatus !== newStatus ? { ...prev, [prevQId]: newStatus } : prev;
      });
    }
  }, [currentQuestionIndex, test, answers, markedForReview, isStudent]);

  const handleOptionChange = (option) => {
    const qId = test.questions[currentQuestionIndex]._id || test.questions[currentQuestionIndex].questionNumber;
    setAnswers((prev) => ({ ...prev, [qId]: option }));
    setQuestionStatus((prev) => ({
      ...prev,
      [qId]: markedForReview[qId] ? "answeredMarked" : "answered",
    }));
  };

  const handleClear = () => {
    const qId = test.questions[currentQuestionIndex]._id || test.questions[currentQuestionIndex].questionNumber;
    const updatedAnswers = { ...answers };
    delete updatedAnswers[qId];
    setAnswers(updatedAnswers);
    setQuestionStatus((prev) => ({
      ...prev,
      [qId]: markedForReview[qId] ? "marked" : "unanswered",
    }));
  };

  const handleMark = () => {
    const qId = test.questions[currentQuestionIndex]._id || test.questions[currentQuestionIndex].questionNumber;
    const isMarked = !markedForReview[qId];
    setMarkedForReview((prev) => ({ ...prev, [qId]: isMarked }));
    setQuestionStatus((prev) => ({
      ...prev,
      [qId]: answers[qId]
        ? isMarked
          ? "answeredMarked"
          : "answered"
        : isMarked
        ? "marked"
        : "unanswered",
    }));
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    const currentQuestion = test.questions.find(q => q._id === questionId);
    let correctAnswer = Array.isArray(currentQuestion.answer) ? currentQuestion.answer : [currentQuestion.answer];

    if (currentQuestion.questionType === "Drag and Drop") {
      correctAnswer = {};
      currentQuestion.definitions?.forEach((def) => {
        if (def.text && def.match) {
          correctAnswer[def.text.toLowerCase().trim()] = def.match.toLowerCase().trim();
        }
      });
    }

    const normalize = (obj) =>
      Object.entries(obj || {})
        .map(([k, v]) => `${k.toLowerCase().trim()}:${v.toLowerCase().trim()}`)
        .sort()
        .join("|");

    let isCorrect;
    if (currentQuestion.questionType === "Drag and Drop") {
      const givenMatches = {};
      Object.entries(selectedOption || {}).forEach(([def, term]) => {
        if (def && term) {
          givenMatches[def.toLowerCase().trim()] = term.toLowerCase().trim();
        }
      });
      isCorrect = normalize(correctAnswer) === normalize(givenMatches);
    } else {
      isCorrect = Array.isArray(selectedOption)
        ? selectedOption.sort().join(",") === correctAnswer.sort().join(",")
        : selectedOption === correctAnswer[0];
    }

    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOption,
        isCorrect,
        correctAnswer,
      },
    }));

    if (isCorrect) {
      setScore((prevScore) => prevScore + (currentQuestion.marks || 1));
    }
  };

  const handleFinishTest = async () => {
    try {
      const payload = {
        userId: user?.id || user?._id,
        testId: test?._id || testId,
        answers,
        score: typeof score === "number" ? score : 0,
        markedForReviewMap: markedForReview,
        questionStatusMap: questionStatus,
      };

      const response = await axios.post(`${API_BASE_URL}/api/studentTestData/submit-test`, payload);
      const result = response.data;

      toast.success("Test submitted successfully!");
      navigate(`/view-solution/${result.resultId}`);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Submission failed.";
      if (errorMsg.includes("Maximum 3 attempts")) {
        toast.warn("You've already reached the maximum of 3 attempts for this test.");
      } else {
        toast.error(errorMsg);
      }
      console.error("❌ Submission Error:", errorMsg);
    }
  };

  const handleCloseModal = () => setShowModal(false);
  const handleConfirmSubmit = () => {
    setShowModal(false);
    setShowSummaryBeforeSubmit(true);
  };

  const handleEditQuestion = (questionId) => {
    setEditingQuestionId(questionId);
    const question = test.questions.find((q) => q._id === questionId);
    setEditedQuestions((prev) => ({ ...prev, [questionId]: question }));
  };

  const handleSaveEditedQuestion = async (questionId) => {
    try {
      const updatedQuestion = editedQuestions[questionId];
      const response = await axios.put(`${API_BASE_URL}/api/mock-tests/${testId}/questions/${questionId}`, updatedQuestion);
      const updatedFromBackend = response.data.updatedQuestion;
      setTest((prev) => {
        const updatedQuestions = prev.questions.map((q) =>
          q._id === questionId ? { ...q, ...updatedFromBackend } : q
        );
        return { ...prev, questions: updatedQuestions };
      });
      setEditingQuestionId(null);
    } catch (err) {
      console.error("Failed to update question", err);
    }
  };

  if (showSummaryBeforeSubmit && test) {
    const totalQuestions = test.questions.length;
    const answered = Object.values(answers || {}).filter(a => a !== null && a !== undefined).length;
    const marked = Object.keys(markedForReview || {}).filter(k => markedForReview[k]).length;
    const skipped = totalQuestions - answered;

    return (
      <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
        <h2>Submit Quiz</h2>
        <p><strong>Total Questions:</strong> {totalQuestions}</p>
        <p><strong>Answered:</strong> {answered}</p>
        <p><strong>Skipped:</strong> {skipped}</p>
        <p><strong>Marked for Review:</strong> {marked}</p>

        <button
          onClick={handleFinishTest}
          style={{ marginTop: '1rem', padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Confirm Submit
        </button>
        <br />
        <button
          onClick={() => setShowSummaryBeforeSubmit(false)}
          style={{ marginTop: '10px', padding: '8px 18px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Cancel
        </button>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <ExamContentLayout
      test={test}
      currentQuestionIndex={currentQuestionIndex}
      currentQuestion={currentQuestion}
      isStudent={isStudent}
      timeLeft={timeLeft}
      editingQuestionId={editingQuestionId}
      editedQuestions={editedQuestions}
      setEditedQuestions={setEditedQuestions}
      answers={answers}
      handleAnswerSelect={handleAnswerSelect}
      handleEditQuestion={handleEditQuestion}
      handleSaveEditedQuestion={handleSaveEditedQuestion}
      setEditingQuestionId={setEditingQuestionId}
      viewingSolutions={viewingSolutions}
      questionStatus={questionStatus}
      markedForReview={markedForReview}
      handleOptionChange={handleOptionChange}
      handleMark={handleMark}
      handleClear={handleClear}
      setCurrentQuestionIndex={setCurrentQuestionIndex}
      handleQuestionSelect={setCurrentQuestionIndex}
      handleFinishTest={handleFinishTest}
      user={user}
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      handleConfirmSubmit={handleConfirmSubmit}
    />
  );
};

export default ExamContent;
