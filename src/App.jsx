import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import ResumeUpload from './pages/Resume_upload/ResumeUpload';
import QuestionsPage from './pages/QuestionsPage/QuestionsPage';
const App = () => {
  return (
    <>
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/resume" element={<ResumeUpload/>}/>
          <Route path="/interview" element={<QuestionsPage/>}/>
        </Routes>
        </BrowserRouter>
    </>
  )
}

export default App