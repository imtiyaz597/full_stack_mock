


// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ExamContentLayout from "./ExamContentLayout";

// const API_BASE_URL = "http://localhost:5000";

// const ExamContent = ({
//   test,
//   setTest,
//   testId,
//   user,
//   currentQuestionIndex,
//   setCurrentQuestionIndex,
//   answers,
//   setAnswers,
//   markedForReview,
//   setMarkedForReview,
//   questionStatus,
//   setQuestionStatus,
//   timeLeft,
//   setTimeLeft,
//   score,
//   setScore,
//   showModal,
//   setShowModal,
//   viewingSolutions,
//   setViewingSolutions,
//   editedQuestions,
//   setEditedQuestions,
//   editingQuestionId,
//   setEditingQuestionId,
//   visitedQuestions,
//   setVisitedQuestions,
// }) => {
//   const navigate = useNavigate();
//   const isStudent = user?.role?.toLowerCase() === "student";
//   const [showSummaryBeforeSubmit, setShowSummaryBeforeSubmit] = useState(false);
//   const [lastSubmittedResultId, setLastSubmittedResultId] = useState(null);

//   useEffect(() => {
//     const handleTriggerModal = () => setShowModal(true);
//     window.addEventListener("trigger-submit-modal", handleTriggerModal);
//     return () => window.removeEventListener("trigger-submit-modal", handleTriggerModal);
//   }, []);

//   useEffect(() => {
//     if (!test || !isStudent) return;
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setShowSummaryBeforeSubmit(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [test, isStudent]);

//   useEffect(() => {
//     if (!test || !test.questions.length || !isStudent) return;
//     const currentQuestion = test.questions[currentQuestionIndex];
//     const qId = currentQuestion._id || currentQuestion.questionNumber;
//     setVisitedQuestions((prev) => ({ ...prev, [qId]: true }));

//     if (currentQuestionIndex > 0) {
//       const prevQuestion = test.questions[currentQuestionIndex - 1];
//       const prevQId = prevQuestion._id || prevQuestion.questionNumber;

//       setQuestionStatus((prev) => {
//         const currentStatus = prev[prevQId];
//         const hasAnswer = answers[prevQId] !== undefined && answers[prevQId] !== null;
//         const isMarked = markedForReview[prevQId];
//         const newStatus = hasAnswer && isMarked
//           ? "answeredMarked"
//           : isMarked
//           ? "marked"
//           : hasAnswer
//           ? "answered"
//           : visitedQuestions[prevQId]
//           ? "unanswered"
//           : currentStatus || "notVisited";

//         return currentStatus !== newStatus ? { ...prev, [prevQId]: newStatus } : prev;
//       });
//     }
//   }, [currentQuestionIndex, test, answers, markedForReview, isStudent]);

//   const handleOptionChange = (option) => {
//     const qId = test.questions[currentQuestionIndex]._id || test.questions[currentQuestionIndex].questionNumber;
//     setAnswers((prev) => ({ ...prev, [qId]: option }));
//     setQuestionStatus((prev) => ({
//       ...prev,
//       [qId]: markedForReview[qId] ? "answeredMarked" : "answered",
//     }));
//   };

//   const handleClear = () => {
//     const qId = test.questions[currentQuestionIndex]._id || test.questions[currentQuestionIndex].questionNumber;
//     const updatedAnswers = { ...answers };
//     delete updatedAnswers[qId];
//     setAnswers(updatedAnswers);
//     setQuestionStatus((prev) => ({
//       ...prev,
//       [qId]: markedForReview[qId] ? "marked" : "unanswered",
//     }));
//   };

//   const handleMark = () => {
//     const qId = test.questions[currentQuestionIndex]._id || test.questions[currentQuestionIndex].questionNumber;
//     const isMarked = !markedForReview[qId];
//     setMarkedForReview((prev) => ({ ...prev, [qId]: isMarked }));
//     setQuestionStatus((prev) => ({
//       ...prev,
//       [qId]: answers[qId]
//         ? isMarked
//           ? "answeredMarked"
//           : "answered"
//         : isMarked
//         ? "marked"
//         : "unanswered",
//     }));
//   };

//   const handleAnswerSelect = (questionId, selectedOption) => {
//     const currentQuestion = test.questions.find(q => q._id === questionId);
//     let correctAnswer = Array.isArray(currentQuestion.answer) ? currentQuestion.answer : [currentQuestion.answer];

//     if (currentQuestion.questionType === "Drag and Drop") {
//       correctAnswer = {};
//       currentQuestion.definitions?.forEach((def) => {
//         if (def.text && def.match) {
//           correctAnswer[def.text.toLowerCase().trim()] = def.match.toLowerCase().trim();
//         }
//       });

//       const normalize = (obj) =>
//         Object.entries(obj || {})
//           .map(([k, v]) => `${k.toLowerCase().trim()}:${v.toLowerCase().trim()}`)
//           .sort()
//           .join("|");
      
//     }

//     const normalize = (obj) =>
//       Object.entries(obj || {})
//         .map(([k, v]) => `${k.toLowerCase().trim()}:${v.toLowerCase().trim()}`)
//         .sort()
//         .join("|");

//     let isCorrect;
//     if (currentQuestion.questionType === "Drag and Drop") {
//       const givenMatches = {};
//       Object.entries(selectedOption || {}).forEach(([def, term]) => {
//         if (def && term) {
//           givenMatches[def.toLowerCase().trim()] = term.toLowerCase().trim();
//         }
//       });
//       isCorrect = normalize(correctAnswer) === normalize(givenMatches);
//     } else {
//       isCorrect = Array.isArray(selectedOption)
//         ? selectedOption.sort().join(",") === correctAnswer.sort().join(",")
//         : selectedOption === correctAnswer[0];
//     }

//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: {
//         selectedOption,
//         isCorrect,
//         correctAnswer,
//       },
//     }));

//     if (isCorrect) {
//       setScore((prevScore) => prevScore + (currentQuestion.marks || 1));
//     }
//   };

//   const handleFinishTest = async () => {
//     try {
//       const payload = {
//         userId: user?.id || user?._id,
//         testId: test?._id || testId,
//         answers,
//         score: typeof score === "number" ? score : 0,
//         markedForReviewMap: markedForReview,
//         questionStatusMap: questionStatus,
//       };

//       const response = await axios.post(`${API_BASE_URL}/api/studentTestData/submit-test`, payload);
//       const result = response.data;

//       toast.success("Test submitted successfully!");
//       setLastSubmittedResultId(result.resultId || result._id); // ✅ store it for View Solution

//     } catch (err) {
//       const errorMsg = err.response?.data?.error || "Submission failed.";
//       if (errorMsg.includes("Maximum 3 attempts")) {
//         toast.warn("You've already reached the maximum of 3 attempts for this test.");
//       } else {
//         toast.error(errorMsg);
//       }
//       console.error("❌ Submission Error:", errorMsg);
//     }
//   };

//   const handleCloseModal = () => setShowModal(false);
//   const handleConfirmSubmit = () => {
//     setShowModal(false);
//     setShowSummaryBeforeSubmit(true);
//   };

//   const handleEditQuestion = (questionId) => {
//     setEditingQuestionId(questionId);
//     const question = test.questions.find((q) => q._id === questionId);
//     setEditedQuestions((prev) => ({ ...prev, [questionId]: question }));
//   };

//   const handleSaveEditedQuestion = async (questionId) => {
//     try {
//       const updatedQuestion = editedQuestions[questionId];
//       const response = await axios.put(`${API_BASE_URL}/api/mock-tests/${testId}/questions/${questionId}`, updatedQuestion);
//       const updatedFromBackend = response.data.updatedQuestion;
//       setTest((prev) => {
//         const updatedQuestions = prev.questions.map((q) =>
//           q._id === questionId ? { ...q, ...updatedFromBackend } : q
//         );
//         return { ...prev, questions: updatedQuestions };
//       });
//       setEditingQuestionId(null);
//     } catch (err) {
//       console.error("Failed to update question", err);
//     }
//   };

//   if (showSummaryBeforeSubmit && test) {
//     const totalQuestions = test.questions.length;
//     const answered = Object.values(answers || {}).filter(a => a !== null && a !== undefined).length;
//     const marked = Object.keys(markedForReview || {}).filter(k => markedForReview[k]).length;
//     const skipped = totalQuestions - answered;

//     return (
//       <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
//         <h2>Submit Quiz</h2>
//         <p><strong>Total Questions:</strong> {totalQuestions}</p>
//         <p><strong>Answered:</strong> {answered}</p>
//         <p><strong>Skipped:</strong> {skipped}</p>
//         <p><strong>Marked for Review:</strong> {marked}</p>

//         {!lastSubmittedResultId ? (
//           <button
//             onClick={handleFinishTest}
//             style={{ marginTop: '1rem', padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
//           >
//             Confirm Submit
//           </button>
//         ) : (
//           <button
//             onClick={() => navigate(`/solution/${lastSubmittedResultId}`)}
//             style={{ marginTop: '1rem', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
//           >
//             View Solution
//           </button>
//         )}

//         <br />
//         <button
//           onClick={() => setShowSummaryBeforeSubmit(false)}
//           style={{ marginTop: '10px', padding: '8px 18px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px' }}
//         >
//           Cancel
//         </button>
//       </div>
//     );
//   }

//   const currentQuestion = test.questions[currentQuestionIndex];

//   return (
//     <ExamContentLayout
//       test={test}
//       currentQuestionIndex={currentQuestionIndex}
//       currentQuestion={currentQuestion}
//       isStudent={isStudent}
//       timeLeft={timeLeft}
//       editingQuestionId={editingQuestionId}
//       editedQuestions={editedQuestions}
//       setEditedQuestions={setEditedQuestions}
//       answers={answers}
//       handleAnswerSelect={handleAnswerSelect}
//       handleEditQuestion={handleEditQuestion}
//       handleSaveEditedQuestion={handleSaveEditedQuestion}
//       setEditingQuestionId={setEditingQuestionId}
//       viewingSolutions={viewingSolutions}
//       questionStatus={questionStatus}
//       markedForReview={markedForReview}
//       handleOptionChange={handleOptionChange}
//       handleMark={handleMark}
//       handleClear={handleClear}
//       setCurrentQuestionIndex={setCurrentQuestionIndex}
//       handleQuestionSelect={setCurrentQuestionIndex}
//       handleFinishTest={handleFinishTest}
//       user={user}
//       showModal={showModal}
//       handleCloseModal={handleCloseModal}
//       handleConfirmSubmit={handleConfirmSubmit}
//     />
//   );
// };

// export default ExamContent;

// import React, { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import ExamContentLayout from "./ExamContentLayout";

// const API_BASE_URL = "http://localhost:5000";

// const ExamContent = ({
//   test,
//   setTest,
//   testId,
//   user,
//   currentQuestionIndex,
//   setCurrentQuestionIndex,
//   answers,
//   setAnswers,
//   markedForReview,
//   setMarkedForReview,
//   questionStatus,
//   setQuestionStatus,
//   timeLeft,
//   setTimeLeft,
//   score,
//   setScore,
//   showModal,
//   setShowModal,
//   viewingSolutions,
//   setViewingSolutions,
//   editedQuestions,
//   setEditedQuestions,
//   editingQuestionId,
//   setEditingQuestionId,
//   visitedQuestions,
//   setVisitedQuestions,
//   isPaused,
//   setIsPaused,
//   pauseKey,
//   timeKey,
// }) => {
//   const navigate = useNavigate();
//   const isStudent = user?.role?.toLowerCase() === "student";
//   const [showSummaryBeforeSubmit, setShowSummaryBeforeSubmit] = useState(false);
//   const [lastSubmittedResultId, setLastSubmittedResultId] = useState(null);

//   // 👇 Trigger modal listener
//   useEffect(() => {
//     const handleTriggerModal = () => setShowModal(true);
//     window.addEventListener("trigger-submit-modal", handleTriggerModal);
//     return () => window.removeEventListener("trigger-submit-modal", handleTriggerModal);
//   }, []);

//   // ⏱ Timer countdown
//   useEffect(() => {
//     if (!test || !isStudent || isPaused) return;
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         const updated = prev - 1;
//         localStorage.setItem(timeKey, updated.toString());
//         if (updated <= 0) {
//           clearInterval(timer);
//           setShowSummaryBeforeSubmit(true);
//           return 0;
//         }
//         return updated;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [test, isStudent, isPaused]);

//   // 👁️ Auto-pause on tab close
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setIsPaused(true);
//         localStorage.setItem(pauseKey, "true");
//       }
//     };
//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
//   }, []);

//   // 🔁 Question visit + status
//   useEffect(() => {
//     if (!test || !test.questions.length || !isStudent) return;
//     const currentQuestion = test.questions[currentQuestionIndex];
//     const qId = currentQuestion._id || currentQuestion.questionNumber;
//     setVisitedQuestions((prev) => ({ ...prev, [qId]: true }));

//     if (currentQuestionIndex > 0) {
//       const prevQuestion = test.questions[currentQuestionIndex - 1];
//       const prevQId = prevQuestion._id || prevQuestion.questionNumber;

//       setQuestionStatus((prev) => {
//         const currentStatus = prev[prevQId];
//         const hasAnswer = (() => {
//           const ans = answers[prevQId];
//           if (!ans) return false;
//           if (typeof ans === "object" && ans.selectedOption) {
//             if (typeof ans.selectedOption === "object") {
//               // Drag & Drop or multi-select
//               return Object.keys(ans.selectedOption).length > 0;
//             }
//             // Single select (string or number)
//             return !!ans.selectedOption;
//           }
//           return false;
//         })();
//         const isMarked = markedForReview[prevQId];
//         const newStatus = hasAnswer && isMarked
//           ? "answeredMarked"
//           : isMarked
//           ? "marked"
//           : hasAnswer
//           ? "answered"
//           : visitedQuestions[prevQId]
//           ? "unanswered"
//           : currentStatus || "notVisited";

//         return currentStatus !== newStatus ? { ...prev, [prevQId]: newStatus } : prev;
//       });
//     }
//   }, [currentQuestionIndex, test, answers, markedForReview, isStudent]);

//   const handleOptionChange = (option) => {
//     const qId = test.questions[currentQuestionIndex]._id || test.questions[currentQuestionIndex].questionNumber;
//     setAnswers((prev) => ({ ...prev, [qId]: option }));
//     setQuestionStatus((prev) => ({
//       ...prev,
//       [qId]: markedForReview[qId] ? "answeredMarked" : "answered",
//     }));
//   };

//   const handleClear = () => {
//     const qId = test.questions[currentQuestionIndex]._id || test.questions[currentQuestionIndex].questionNumber;
//     const updatedAnswers = { ...answers };
//     delete updatedAnswers[qId];
//     setAnswers(updatedAnswers);
//     setQuestionStatus((prev) => ({
//       ...prev,
//       [qId]: markedForReview[qId] ? "marked" : "unanswered",
//     }));
//   };

//   const handleMark = () => {
//     const qId = test.questions[currentQuestionIndex]._id || test.questions[currentQuestionIndex].questionNumber;
//     const isMarked = !markedForReview[qId];
//     setMarkedForReview((prev) => ({ ...prev, [qId]: isMarked }));
//     setQuestionStatus((prev) => ({
//       ...prev,
//       [qId]: answers[qId]
//         ? isMarked
//           ? "answeredMarked"
//           : "answered"
//         : isMarked
//         ? "marked"
//         : "unanswered",
//     }));
//   };

//   const handleAnswerSelect = (questionId, selectedOption) => {
//     const currentQuestion = test.questions.find(q => q._id === questionId);
//     let correctAnswer = Array.isArray(currentQuestion.answer)
//       ? currentQuestion.answer
//       : [currentQuestion.answer];

//     if (currentQuestion.questionType === "Drag and Drop") {
//       correctAnswer = {};
//       currentQuestion.definitions?.forEach((def) => {
//         if (def.text && def.match) {
//           correctAnswer[def.text.toLowerCase().trim()] = def.match.toLowerCase().trim();
//         }
//       });
//     }

//     const normalize = (obj) =>
//       Object.entries(obj || {})
//         .map(([k, v]) => `${k.toLowerCase().trim()}:${v.toLowerCase().trim()}`)
//         .sort()
//         .join("|");

//     let isCorrect;
//     if (currentQuestion.questionType === "Drag and Drop") {
//       const givenMatches = {};
//       Object.entries(selectedOption || {}).forEach(([def, term]) => {
//         if (def && term) {
//           givenMatches[def.toLowerCase().trim()] = term.toLowerCase().trim();
//         }
//       });
//       isCorrect = normalize(correctAnswer) === normalize(givenMatches);
//     } else {
//       isCorrect = Array.isArray(selectedOption)
//         ? selectedOption.sort().join(",") === correctAnswer.sort().join(",")
//         : selectedOption === correctAnswer[0];
//     }

//     setAnswers((prev) => ({
//       ...prev,
//       [questionId]: {
//         selectedOption,
//         isCorrect,
//         correctAnswer,
//       },
//     }));

//     if (isCorrect) {
//       setScore((prevScore) => prevScore + (currentQuestion.marks || 1));
//     }
//   };

//   const handleFinishTest = async () => {
//     try {
//       const payload = {
//         userId: user?.id || user?._id,
//         testId: test?._id || testId,
//         answers,
//         score: typeof score === "number" ? score : 0,
//         markedForReviewMap: markedForReview,
//         questionStatusMap: questionStatus,
//       };

//       const response = await axios.post(`${API_BASE_URL}/api/studentTestData/submit-test`, payload);
//       const result = response.data;
//       toast.success("Test submitted successfully!");
//       setLastSubmittedResultId(result.resultId || result._id);
//     } catch (err) {
//       const errorMsg = err.response?.data?.error || "Submission failed.";
//       if (errorMsg.includes("Maximum 3 attempts")) {
//         toast.warn("You've already reached the maximum of 3 attempts for this test.");
//       } else {
//         toast.error(errorMsg);
//       }
//       console.error("❌ Submission Error:", errorMsg);
//     }
//   };

//   const handleCloseModal = () => setShowModal(false);
//   const handleConfirmSubmit = () => {
//     setShowModal(false);
//     setShowSummaryBeforeSubmit(true);
//   };

//   const handleEditQuestion = (questionId) => {
//     setEditingQuestionId(questionId);
//     const question = test.questions.find((q) => q._id === questionId);
//     setEditedQuestions((prev) => ({ ...prev, [questionId]: question }));
//   };

//   const handleSaveEditedQuestion = async (questionId) => {
//     try {
//       const updatedQuestion = editedQuestions[questionId];
//       const response = await axios.put(`${API_BASE_URL}/api/mock-tests/${testId}/questions/${questionId}`, updatedQuestion);
//       const updatedFromBackend = response.data.updatedQuestion;
//       setTest((prev) => {
//         const updatedQuestions = prev.questions.map((q) =>
//           q._id === questionId ? { ...q, ...updatedFromBackend } : q
//         );
//         return { ...prev, questions: updatedQuestions };
//       });
//       setEditingQuestionId(null);
//     } catch (err) {
//       console.error("Failed to update question", err);
//     }
//   };

//   // 🧾 Summary before final submit
//   if (showSummaryBeforeSubmit && test) {
//     const totalQuestions = test.questions.length;
//     const answered = Object.values(answers || {}).filter(a => a !== null && a !== undefined).length;
//     const marked = Object.keys(markedForReview || {}).filter(k => markedForReview[k]).length;
//     const skipped = totalQuestions - answered;

//     return (
//       <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
//         <h2>Submit Quiz</h2>
//         <p><strong>Total Questions:</strong> {totalQuestions}</p>
//         <p><strong>Answered:</strong> {answered}</p>
//         <p><strong>Skipped:</strong> {skipped}</p>
//         <p><strong>Marked for Review:</strong> {marked}</p>

//         {!lastSubmittedResultId ? (
//           <button
//             onClick={handleFinishTest}
//             style={{ marginTop: '1rem', padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
//           >
//             Confirm Submit
//           </button>
//         ) : (
//           <button
//             onClick={() => navigate(`/solution/${lastSubmittedResultId}`)}
//             style={{ marginTop: '1rem', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
//           >
//             View Solution
//           </button>
//         )}

//         <br />
//         <button
//           onClick={() => setShowSummaryBeforeSubmit(false)}
//           style={{ marginTop: '10px', padding: '8px 18px', backgroundColor: 'gray', color: 'white', border: 'none', borderRadius: '5px' }}
//         >
//           Cancel
//         </button>
//       </div>
//     );
//   }

//   const currentQuestion = test.questions[currentQuestionIndex];

//   return (
//     <ExamContentLayout
//       test={test}
//       currentQuestionIndex={currentQuestionIndex}
//       currentQuestion={currentQuestion}
//       isStudent={isStudent}
//       timeLeft={timeLeft}
//       editingQuestionId={editingQuestionId}
//       editedQuestions={editedQuestions}
//       setEditedQuestions={setEditedQuestions}
//       answers={answers}
//       handleAnswerSelect={handleAnswerSelect}
//       handleEditQuestion={handleEditQuestion}
//       handleSaveEditedQuestion={handleSaveEditedQuestion}
//       setEditingQuestionId={setEditingQuestionId}
//       viewingSolutions={viewingSolutions}
//       questionStatus={questionStatus}
//       markedForReview={markedForReview}
//       handleOptionChange={handleOptionChange}
//       handleMark={handleMark}
//       handleClear={handleClear}
//       setCurrentQuestionIndex={setCurrentQuestionIndex}
//       handleQuestionSelect={setCurrentQuestionIndex}
//       handleFinishTest={handleFinishTest}
//       user={user}
//       showModal={showModal}
//       handleCloseModal={handleCloseModal}
//       handleConfirmSubmit={handleConfirmSubmit}
//       isPaused={isPaused}
//       setIsPaused={setIsPaused}
//       pauseKey={pauseKey}
//       timeKey={timeKey}
//     />
//   );
// };

// export default ExamContent;

// ... all your imports remain unchanged ...
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
  isPaused,
  setIsPaused,
  pauseKey,
  timeKey,
}) => {
  const navigate = useNavigate();
  const isStudent = user?.role?.toLowerCase() === "student";
  const [showSummaryBeforeSubmit, setShowSummaryBeforeSubmit] = useState(false);
  const [lastSubmittedResultId, setLastSubmittedResultId] = useState(null);

  useEffect(() => {
    const handleTriggerModal = () => setShowModal(true);
    window.addEventListener("trigger-submit-modal", handleTriggerModal);
    return () => window.removeEventListener("trigger-submit-modal", handleTriggerModal);
  }, []);

  useEffect(() => {
    if (!test || !isStudent || isPaused) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const updated = prev - 1;
        localStorage.setItem(timeKey, updated.toString());
        if (updated <= 0) {
          clearInterval(timer);
          setShowSummaryBeforeSubmit(true);
          return 0;
        }
        return updated;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [test, isStudent, isPaused]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
        localStorage.setItem(pauseKey, "true");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // inside useEffect for question status update
  useEffect(() => {
    if (!test || !test.questions.length || !isStudent) return;
  
    const currentQuestion = test.questions[currentQuestionIndex];
    const currentQId = currentQuestion._id || currentQuestion.questionNumber;
  
    // Mark current question as visited
    setVisitedQuestions((prev) => ({
      ...prev,
      [currentQId]: true,
    }));
  
    // Only check and update the status of the previous question
    if (currentQuestionIndex > 0) {
      const prevQuestion = test.questions[currentQuestionIndex - 1];
      const prevQId = prevQuestion._id || prevQuestion.questionNumber;
      const ans = answers[prevQId];
      const marked = markedForReview[prevQId];
  
      const hasAnswer = (() => {
        if (!ans) return false;
        if (typeof ans === "object" && ans.selectedOption !== undefined) {
          if (typeof ans.selectedOption === "object") {
            return Object.keys(ans.selectedOption).length > 0;
          }
          return !!ans.selectedOption;
        }
        return false;
      })();
  
      const newStatus = hasAnswer && marked
        ? "answeredMarked"
        : hasAnswer
        ? "answered"
        : marked
        ? "marked"
        : "unanswered"; // Only set if moving away and unanswered
  
      setQuestionStatus((prev) => ({
        ...prev,
        [prevQId]: newStatus,
      }));
    }
  }, [currentQuestionIndex, test, answers, markedForReview]);
  
  


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
    let correctAnswer = Array.isArray(currentQuestion.answer)
      ? currentQuestion.answer
      : [currentQuestion.answer];

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

    const normalizeStatus = (status) => {
      switch (status) {
        case "answered": return "ANSWERED";
        case "unanswered": return "NOT ANSWERED";
        case "marked": return "MARKED FOR REVIEW";
        case "answeredMarked": return "ANSWERED & MARKED FOR REVIEW";
        default: return "NOT ANSWERED";
      }
    };
    
    try {
      const detailedAnswers = Object.entries(answers).map(([questionId, answerObj]) => {
        const originalQ = test.questions.find(q => (q._id || q.questionNumber) == questionId);
        return {
          questionId,
          selectedAnswer: answerObj?.selectedOption || null,
          correctAnswer: answerObj?.correctAnswer || null,
          isCorrect: answerObj?.isCorrect || false,
          explanation: originalQ?.explanation || '',
          tags: originalQ?.tags || [],
          difficulty: originalQ?.difficulty || 'Medium',
          timeAllocated: originalQ?.timeAllocated || 0,
          markedForReview: markedForReview[questionId] || false,
          questionStatus: normalizeStatus(questionStatus[questionId]) || 'NOT ANSWERED'
        };
      });
      
  
      const payload = {
        userId: user?.id || user?._id,
        testId: test?._id || testId,
        answers,
        score: typeof score === "number" ? score : 0,
        markedForReviewMap: markedForReview,
        questionStatusMap: questionStatus,
        detailedAnswers // ✅ added
      };
  
      const response = await axios.post(`${API_BASE_URL}/api/studentTestData/submit-test`, payload);
      const result = response.data;
      toast.success("Test submitted successfully!");
      setLastSubmittedResultId(result.resultId || result._id);
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Submission failed.";
      if (errorMsg.includes("Maximum")) {
        toast.warn(errorMsg);
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

        {!lastSubmittedResultId ? (
          <button
            onClick={handleFinishTest}
            style={{ marginTop: '1rem', padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Confirm Submit
          </button>
        ) : (
          <button
          onClick={() => {
            localStorage.removeItem(timeKey); // ✅ Reset timer
            localStorage.removeItem(pauseKey); // ✅ Optional: Also reset pause state
            navigate(`/solution/${lastSubmittedResultId}`);
          }}
        
            style={{ marginTop: '1rem', padding: '10px 20px', backgroundColor: '#4748ac', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            View Solution
          </button>
        )}

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
      isPaused={isPaused}
      setIsPaused={setIsPaused}
      pauseKey={pauseKey}
      timeKey={timeKey}
    />
  );
};

export default ExamContent; //exam 
