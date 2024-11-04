import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import styles from './QuestionsPage.module.css';

const socket = io();

function QuestionsPage() {
  const [question, setQuestion] = useState('Loading question...');
  const [answer, setAnswer] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(90);
  const [showDialogue, setShowDialogue] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [micOn, setMicOn] = useState(false);

  useEffect(() => {
    socket.on('newQuestion', (data) => {
      setQuestion(data.question);
      resetTimer();
    });

    const countdown = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(countdown);
          submitAnswer(); 
          return 0;
        } else if (prevTime === 31) {
          setShowDialogue(true);
          setTimeout(() => setShowDialogue(false), 5000); 
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const resetTimer = () => {
    setTimeRemaining(90);
  };

  const submitAnswer = () => {
    console.log(answer)
    if (answer.trim()) {
      socket.emit('submitAnswer', { answer });
      setAnswer('');
      setShowTranscript(false);
    }
  };

  const handleAnswerChange = (e) => {
    if (micOn) {
      // Stop mic if user starts typing
      toggleMic(false);
    }
    setAnswer(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAnswer();
  };

  const handleTranscriptReady = (transcript) => {
    setAnswer(transcript);
    setShowTranscript(true);
  };

  const handleConfirmTranscript = () => {
    submitAnswer();
  };

  const handleEditTranscript = () => {
    setShowTranscript(false);
  };

  const toggleMic = (status) => {
    setMicOn(status);
    if (status) {
      startListening();
    } else {
      stopListening();
    }
  };

  // Web Speech API Functions
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setMicOn(true);
      };

      recognition.onend = () => {
        setMicOn(false);
      };

      recognition.onresult = (event) => {
        const transcriptResult = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        handleTranscriptReady(transcriptResult);
      };

      recognition.onerror = (event) => {
        console.error('Speech Recognition Error:', event.error);
      };

      recognition.start();
      window.recognitionInstance = recognition; // Save recognition instance to stop it later
    } else {
      console.error('Web Speech API is not supported in this browser.');
    }
  };

  const stopListening = () => {
    if (window.recognitionInstance) {
      window.recognitionInstance.stop();
    }
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
          <button type="submit" className={styles.uploadButton}>
            Submit Answer
          </button>
        </form>
      </div>

      <div>
        <p>Microphone: {micOn ? 'on' : 'off'}</p>
        <button onClick={() => toggleMic(!micOn)} className={styles.uploadButton}>
          {micOn ? 'Reset' : 'Start Listening'}
        </button>
      </div>

      <div id="timer" className={styles.skillsContainer}>
        Time Remaining: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}
      </div>

      {showDialogue && (
        <div id="dialogueBox" className={styles.dialogueBox}>
          <p>Only 30 seconds remaining!</p>
        </div>
      )}
    </div>
  );
}

export default QuestionsPage;
