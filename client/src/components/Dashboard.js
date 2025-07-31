import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [progress, setProgress] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/');
      try {
        const res = await axios.get('http://localhost:5000/api/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProgress(res.data.progress);
      } catch {
        navigate('/');
      }
    };
    fetchProgress();
  }, [navigate]);

  const subjects = [
    'Algebra 1', 'Algebra 2', 'Advanced Algebra', 'Linear Algebra', 'Abstract Algebra',
    'Probability & Statistics', 'Geometry', 'Trigonometry', 'Differential Geometry',
    'Pre-Calculus', 'Calculus 1', 'Calculus 2', 'Calculus 3', 'Calculus of Variations',
    'Complex Analysis', 'Numerical Analysis', 'Fourier Analysis', 'Differential Equations',
    'Partial Differential Equations', 'Topology', 'Vectors and Coordinate Systems',
    'Matrices and Transformations', 'Astrophysics', 'General Relativity', 'Special Relativity',
    'Theory of Relativity'
  ];

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {subjects.map(subject => (
          <li key={subject}>
            <a href={`/subject/${encodeURIComponent(subject)}`}>{subject}</a>
            {progress[subject] && <span> ✅</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
