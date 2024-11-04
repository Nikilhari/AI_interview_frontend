import React, { useEffect } from 'react';
import 'regenerator-runtime/runtime';
import '@babel/polyfill';
import styles from './QuestionsPage.module.css';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const TranscriptGenerator = ({ onTranscriptReady }) => {

  // useEffect(() => {
  //   startListening();
  // }, []);

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
  const stopListening = () => SpeechRecognition.stopListening();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      onTranscriptReady(transcript);
      resetTranscript(); // Reset the transcript after processing it
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <button onClick={startListening} className={styles.uploadButton}>Start</button>
      <button onClick={stopListening} className={styles.uploadButton}>Stop</button>
      <p>{transcript}</p>
    </div>
  );
};

export default TranscriptGenerator;
