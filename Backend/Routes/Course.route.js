const express = require('express');
const courseRouter = express.Router();
const { authorize } = require("../Middleware/Authorization")
const { auth } = require("../Middleware/Authentication")
const { courseModel } = require('../Models/Courses.model');
const { UserModel } = require('../Models/User.model');

courseRouter.post('/', auth, authorize(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
    const { courseName, description } = req.body;
    try {
        const newCourse = new courseModel({ courseName, description });
        await newCourse.save();
        res.status(201).json({ message: 'Course created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

courseRouter.get('/', async (req, res) => {
    try {
        const courses = await courseModel.find();
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No courses found' });
        }
        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

courseRouter.get('/:id',auth, async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await courseModel.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

courseRouter.put('/:id',auth,authorize(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
    const courseId = req.params.id;
    const courseData = req.body;
    try {
        const updatedCourse = await courseModel.findByIdAndUpdate(courseId, courseData, { new: true });
        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(updatedCourse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

courseRouter.delete('/:id', auth,authorize(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
    const courseId = req.params.id;
    try {
        const deletedCourse = await courseModels.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

courseRouter.post("/course-enrolled-student/:id", auth, async (req, res) => {
    const studentId = req.user.userId;
    const courseId = req.params.id;

    try {
        let course = await courseModel.findById(courseId);
        let student = await UserModel.findById(studentId)
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const isEnrolled = course.enrolledUsers.includes(studentId);
        if (isEnrolled) {
            return res.status(200).json({ message: 'User is already enrolled in the course' });
        }

        // Push the studentId into the enrolledUsers array of the course
        student.enrolledCourses.push(courseId)

        course.enrolledUsers.push(studentId);

        // Save the course to persist the changes
        await course.save();
        await student.save()

        return res.status(200).json({ message: 'User enrolled in the course successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = { courseRouter };

