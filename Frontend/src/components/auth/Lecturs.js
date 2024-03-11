import React, { useEffect, useState } from 'react';
import { API_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { useParams, Link } from 'react-router-dom';

const buttonStyle = {
  backgroundColor: '#4CAF50',
  border: 'none',
  color: 'white',
  padding: '10px 20px',
  textAlign: 'center',
  textDecoration: 'none',
  display: 'inline-block',
  fontSize: '16px',
  margin: '4px 2px',
  cursor: 'pointer',
  borderRadius: '5px',
};

const lectureStyle = {
  marginBottom: '20px',
  padding: '15px',
  backgroundColor: '#f2f2f2',
  border: '1px solid #ccc',
  borderRadius: '5px',
};

const headerStyle = {
  textAlign: 'center',
};

function Lectures() {
  const [lectures, setLectures] = useState([]);
  const { auth } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    if (!auth) return;

    const fetchLecturesForEnrolledCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/course/${id}`, {
          headers: { 'Authorization': `Bearer ${auth.token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setLectures(data.lectures);
        } else {
          console.error(`Failed to fetch lectures for course`);
        }
      } catch (error) {
        console.error('Error fetching lectures:', error);
      }
    };

    fetchLecturesForEnrolledCourses();
  }, [auth, id]);

  return (
    <div>
      <h2 style={headerStyle}>Lectures for Enrolled Courses</h2>
      {lectures.map((lecture, index) => (
        <div key={index} style={lectureStyle}>
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>{lecture.lectureTitle}</p>
          <p style={{ marginBottom: '15px' }}>{lecture.description}</p>
          <Link to={`https://youtu.be/yRpLlJmRo2w?si=GXnIy99OLeCfUCvW`} style={{ textDecoration: 'none' }}>
            <button style={buttonStyle}>Watch Lecture</button>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default Lectures;
