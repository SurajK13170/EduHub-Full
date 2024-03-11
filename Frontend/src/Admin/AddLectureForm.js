import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

function AddLectureForm() {
  const { auth } = useAuth();
  const [courses, setCourses] = useState([]);
  const [showLectureForm, setShowLectureForm] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/course`, {
          headers: { 'Authorization': `Bearer ${auth.token}` }
        });
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [auth.token]);

  const handleAddLecture = (courseId) => {
    setSelectedCourseId(courseId);
    setShowLectureForm(true);
  };

  const handleCancel = () => {
    setShowLectureForm(false);
    setSelectedCourseId('');
  };

  const handleSubmitLecture = async (lectureData) => {
    try {
      const response = await fetch(`${API_URL}/lecture/${selectedCourseId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(lectureData)
      });
      if (!response.ok) {
        throw new Error('Failed to add lecture');
      }
      setShowLectureForm(false);
      setSelectedCourseId('');
    } catch (error) {
      console.error('Error adding lecture:', error);
    }
  };

  return (
    <div>
      <h2>Add New Lecture</h2>
      <ul>
        {courses.map((course) => (
          <li key={course._id} style={{ marginBottom: '10px' }}>
            <span>{course.courseName}</span>
            <button
              onClick={() => handleAddLecture(course._id)}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
              }}
            >
              Add Lecture
            </button>
          </li>
        ))}
      </ul>
      {showLectureForm && (
        <LectureForm
          courseId={selectedCourseId}
          onCancel={handleCancel}
          onSubmit={handleSubmitLecture}
        />
      )}
    </div>
  );
}

function LectureForm({ courseId, onCancel, onSubmit }) {
  const [lectureTitle, setLectureTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lectureUrl, setLectureUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const lectureData = {
      lectureTitle,
      description,
      Lecture_URL: lectureUrl,
    };
    onSubmit(lectureData);
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Add Lecture</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
          placeholder="Lecture Title"
          style={{ marginBottom: '10px', width: '400px', height:"30px" }}
        /> <br/>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          style={{ marginBottom: '10px', height: '100px', width: '400px' }}
        ></textarea><br/>
        <input
          type="text"
          value={lectureUrl}
          onChange={(e) => setLectureUrl(e.target.value)}
          placeholder="Lecture URL"
          style={{ marginBottom: '10px', width: '400px', height:"30px" }}
        /> <br/>
        <button
          type="submit"
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            backgroundColor: '#dc3545',
            color: '#fff',
            padding: '5px 10px',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default AddLectureForm;
