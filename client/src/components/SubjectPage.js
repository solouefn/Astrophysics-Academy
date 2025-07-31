import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function SubjectPage() {
  const { name } = useParams();
  const [score, setScore] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/progress', {
        subject: name,
        lesson: 'Lesson 1',
        score: parseFloat(score)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Progress Saved!');
    } catch {
      setMessage('Error saving progress.');
    }
  };

  return (
    <div>
      <h2>{decodeURIComponent(name)}</h2>
      <p>Enter your score for Lesson 1:</p>
      <input type="number" value={score} onChange={e => setScore(e.target.value)} />
      <button onClick={handleSubmit}>Submit</button>
      <p>{message}</p>
    </div>
  );
}

export default SubjectPage;
