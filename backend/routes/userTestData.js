

const express = require('express');
const router = express.Router();
const StudentTestData = require('../models/StudentTestData');
const MockTest = require('../models/MockTest');
const User = require('../models/User');

// ✅ GET RESULT WITH ENRICHED QUESTIONS FOR SOLUTION PAGE
router.get('/api/results/:id', async (req, res) => {
  try {
    const result = await StudentTestData.findById(req.params.id);
    if (!result) return res.status(404).json({ error: 'Result not found' });

    const test = await MockTest.findById(result.testId);
    const allResults = await StudentTestData.find({ testId: result.testId });

    const totalQuestions = result.detailedAnswers.length;
    const correct = result.detailedAnswers.filter(a => a.isCorrect).length;
    const incorrect = result.detailedAnswers.filter(a => a.selectedAnswer && !a.isCorrect).length;
    const skipped = result.detailedAnswers.filter(a => a.selectedAnswer === null).length;
    const score = result.score || 0;

    const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    const rank = sorted.findIndex(r => r._id.toString() === result._id.toString()) + 1;
    const topper = sorted[0]?.score || 0;
    const average = (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2);

    const yourAccuracy = ((correct / totalQuestions) * 100).toFixed(2);
    const topperAccuracy = ((sorted[0]?.detailedAnswers?.filter(a => a.isCorrect).length || 0) / totalQuestions * 100).toFixed(2);
    const averageAccuracy = ((sorted.reduce((acc, r) => acc + r.detailedAnswers.filter(a => a.isCorrect).length, 0) / (sorted.length * totalQuestions)) * 100).toFixed(2);

    const topicMap = {};
    for (const ans of result.detailedAnswers) {
      for (const tag of ans.tags || []) {
        if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
        topicMap[tag].total += 1;
        if (ans.isCorrect) topicMap[tag].correct += 1;
      }
    }
    const topicReport = Object.values(topicMap);

    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    for (const ans of result.detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += (ans.marks || 1);
    }

    // ✅ Inject solution-view data into each question
    const enrichedQuestions = (test?.questions || []).map((q) => {
      const qId = q._id?.toString() || q.questionNumber?.toString();
      const attempt = result.answers?.[qId];

      const enriched = {
        ...q.toObject?.() || q,
        selectedAnswer: attempt?.selectedOption ?? null,
        correctAnswer: q.correctAnswer || null,
        isCorrect: attempt?.isCorrect ?? null,
        explanation: q.explanation || null,
        options: q.options || [],
      };

      if (q.questionType === 'Drag and Drop') {
        enriched.definitions = q.definitions || [];
        enriched.terms = q.terms || [];
        enriched.answer = q.answer || [];
        enriched.selectedAnswer = attempt?.selectedOption || {};
        enriched.correctAnswer = {};
        (q.definitions || []).forEach((def) => {
          if (def?.text && def?.match) {
            enriched.correctAnswer[def.text] = def.match;
          }
        });
      }

      return enriched;
    });

    // ✅ Save calculated fields back into StudentTestData for future fast report fetching
    await StudentTestData.findByIdAndUpdate(req.params.id, {
      testTitle: test?.title || 'Mock Test',
      totalMarks: test?.questions?.length || 0,
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
    });

    // ✅ Then respond normally
    res.json({
      testTitle: test?.title || 'Mock Test',
      totalMarks: test?.questions?.length || 0,
      score,
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
      questions: enrichedQuestions,
      answers: result?.answers || {}
    });

  } catch (err) {
    console.error('Error in GET /api/results/:id', err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


// ✅ POST SUBMIT TEST — UNTOUCHED
router.post('/api/studentTestData/submit-test', async (req, res) => {
  try {
    const {
      userId,
      testId,
      answers,
      score,
      markedForReviewMap,
      questionStatusMap,
      detailedAnswers
    } = req.body;

    const attemptCount = await StudentTestData.countDocuments({ userId, testId });
    const test = await MockTest.findById(testId);
    const allResults = await StudentTestData.find({ testId });

    const totalQuestions = detailedAnswers.length;
    const correct = detailedAnswers.filter(a => a.isCorrect).length;
    const incorrect = detailedAnswers.filter(a => a.selectedAnswer && !a.isCorrect).length;
    const skipped = detailedAnswers.filter(a => a.selectedAnswer === null).length;

    const sorted = allResults.sort((a, b) => (b.score || 0) - (a.score || 0));
    const rank = sorted.findIndex(r => r.userId.toString() === userId.toString()) + 1;
    const topper = sorted[0]?.score || 0;
    const average = (sorted.reduce((acc, r) => acc + (r.score || 0), 0) / sorted.length).toFixed(2);

    const yourAccuracy = ((correct / totalQuestions) * 100).toFixed(2);
    const topperAccuracy = ((sorted[0]?.detailedAnswers?.filter(a => a.isCorrect).length || 0) / totalQuestions * 100).toFixed(2);
    const averageAccuracy = ((sorted.reduce((acc, r) => acc + r.detailedAnswers.filter(a => a.isCorrect).length, 0) / (sorted.length * totalQuestions)) * 100).toFixed(2);

    const topicMap = {};
    for (const ans of detailedAnswers) {
      for (const tag of ans.tags || []) {
        if (!topicMap[tag]) topicMap[tag] = { tag, total: 0, correct: 0 };
        topicMap[tag].total += 1;
        if (ans.isCorrect) topicMap[tag].correct += 1;
      }
    }
    const topicReport = Object.values(topicMap);

    const difficultyStats = { Easy: 0, Medium: 0, Intense: 0 };
    const difficultyScore = { Easy: 0, Medium: 0, Intense: 0 };
    for (const ans of detailedAnswers) {
      const level = ans.difficulty || 'Medium';
      difficultyStats[level] += 1;
      if (ans.isCorrect) difficultyScore[level] += (ans.marks || 1);
    }

    const newRecord = new StudentTestData({
      userId,
      testId,
      attemptNumber: attemptCount + 1,
      answers,
      score,
      markedForReviewMap,
      questionStatusMap,
      detailedAnswers,
      status: 'completed',
      completedAt: new Date(),

      // ✅ Report fields
      testTitle: test?.title || 'Mock Test',
      totalMarks: test?.questions?.length || 0,
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
      difficultyScore
    });

    const saved = await newRecord.save();
    res.status(200).json({ resultId: saved._id });

  } catch (error) {
    console.error("Submit test error:", error);
    res.status(500).json({ error: "Something went wrong during submission." });
  }
});


module.exports = router;
