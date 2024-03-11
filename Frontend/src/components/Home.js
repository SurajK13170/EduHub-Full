import React, { useEffect, useState } from 'react';
import styles from '../css/home.module.css';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function CourseCard({ course, handleEnroll, }) {
  const {auth} = useAuth()

  return (
    <div className={styles.courseCard}>
      <h2>{course.courseName}</h2>
      <p>{course.description}</p>
      <p>Prerequisites: {course.prerequisites}</p>
      <button className={styles.enrollButton} onClick={() => handleEnroll(course._id)}>{auth.user.enrolledCourses.has(course._id)?"View":"Enroll"}</button>
    </div>
  );
}

export default function Home() {
  const [courses, setCourses] = useState([]);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getCourses = async () => {
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
    getCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      if (!auth) {
        navigate('/login');
        return;
      }
        if(auth.user.enrolledCourses.has(courseId)){
        navigate(`/lecture/${courseId}`);
          return
        }
      const res = await fetch(`${API_URL}/course/course-enrolled-student/${courseId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${auth.token}` }
      });
      if (res.ok) {
        console.log(res)
      } else {
        throw new Error('Failed to enroll in the course');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1 className={styles.heading}>Hello, {auth?.user?.name || 'Guest'}</h1>
      <p className={styles.subHeading}>Here are a bunch of courses you can enroll in:</p>
      <section className={styles.courseContainer}>
        {courses.map((course, i) => (
          <CourseCard key={i} course={course} handleEnroll={handleEnroll} />
        ))}
      </section>
    </div>
  );
}
