import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

function LectureList() {
  const { auth } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lectures, setLectures] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/course`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        } else {
          throw new Error('Failed to fetch courses');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  const handleCourseChange = async (courseId) => {
    try {
      const res = await fetch(`${API_URL}/course/${courseId}`, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLectures(data.lectures);
        setSelectedCourse(courseId);
      } else {
        throw new Error('Failed to fetch lectures');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (lectureId) => {
    try {
      // Send DELETE request to backend to delete lecture
      const response = await fetch(`${API_URL}/lecture/${lectureId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        setLectures(lectures.filter(lecture => lecture._id !== lectureId));
        console.log('Lecture deleted successfully');
      } else {
        throw new Error('Failed to delete lecture');
      }
    } catch (error) {
      console.error('Error deleting lecture:', error);
    }
  };
  

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>All Courses</h2>
      <select onChange={(e) => handleCourseChange(e.target.value)}>
        <option value="">Select a course</option>
        {courses.map((course) => (
          <option key={course._id} value={course._id}>{course.courseName}</option>
        ))}
      </select>

      {selectedCourse && (
        <div style={{ marginTop: '20px' }}>
          <h2>Lectures for {courses.find((course) => course._id === selectedCourse).courseName}</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lectures.map((lecture) => (
                <tr key={lecture._id}>
                  <td>{lecture.title}</td>
                  <td>{lecture.description}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(lecture._id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '3px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Link to="/admin/add-leacture" style={{ display: 'block', marginTop: '20px' }}>
        Add New Lecture
      </Link>
    </div>
  );
}

export default LectureList;
