import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from './QuestionsPage.module.css';

const socket = io(); // Assuming Socket.IO is properly configured

function QuestionsPage() {
  const [question, setQuestion] = useState('Loading question...');
  const [answer, setAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(90); // 1 minute 30 seconds
  const [showDialogue, setShowDialogue] = useState(false);

  useEffect(() => {
    socket.on('newQuestion', (data) => {
      setQuestion(data.question);
      resetTimer();
    });

    const countdown = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(countdown);
          submitAnswer(); // Automatically submit the answer when time is up
          return 0;
        } else if (prevTime === 31) {
          setShowDialogue(true);
          setTimeout(() => setShowDialogue(false), 5000); // Hide dialogue box after 5 seconds
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const resetTimer = () => {
    setTimeRemaining(90); // Reset to 1 minute 30 seconds
  };

  const submitAnswer = () => {
    if (answer.trim()) {
      socket.emit('submitAnswer', { answer });
      setAnswer('');
    }
  };

  const handleAnswerChange = (e) => setAnswer(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAnswer();
  };

  return (
    <div className={styles.uploadPage}>
      <h1 className={styles.heading}>Interview Question</h1>
      <div className={styles.questionContainer}>
        <p id="questionText" className={styles.questionText}>{question}</p>
      </div>
      <div className={styles.answerContainer}>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={handleAnswerChange}
            className={styles.inputFile}
            placeholder="Type your answer here..."
            autoFocus
          />
          <button type="submit" className={styles.uploadButton}>Submit Answer</button>
        </form>
      </div>
      <div id="timer" className={styles.skillsContainer}>
        Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}
      </div>

      {/* Dialogue box for 30 seconds warning */}
      {showDialogue && (
        <div id="dialogueBox" className={styles.dialogueBox}>
          <p>Only 30 seconds remaining!</p>
        </div>
      )}
    </div>
  );
}

export default QuestionsPage;
