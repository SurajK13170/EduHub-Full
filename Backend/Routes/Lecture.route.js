const express = require('express');
const lectureRouter = express.Router();
const { LectureModel } = require('../Models/Lecture.model');
const {courseModel} = require("../Models/Courses.model")
const {auth} = require("../Middleware/Authentication")
const {authorize} = require("../Middleware/Authorization")

// Create a lecture
lectureRouter.post('/:id', auth, authorize(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
    const courseId = req.params.id;
    const { lectureTitle, description, Lecture_URL } = req.body;
    try {
        const newLecture = new LectureModel({ lectureTitle, description, Lecture_URL });
        await newLecture.save();

        const course = await courseModel.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.lectures.push(newLecture._id);
        await course.save();

        res.status(201).json({ message: 'Lecture created and associated with the course successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Get all lectures
lectureRouter.get('/',auth, async (req, res) => {
    try {
        const lectures = await LectureModel.find();
        if (!lectures || lectures.length === 0) {
            return res.status(404).json({ message: 'No lectures found' });
        }
        res.status(200).json(lectures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get lecture by ID
lectureRouter.get('/:id', auth,async (req, res) => {
    const lectureId = req.params.id;
    try {
        const lecture = await LectureModel.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }
        res.status(200).json(lecture);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update lecture
lectureRouter.put('/:id',auth,authorize(["SUPER_ADMIN", "ADMIN"]), async (req, res) => {
    const lectureId = req.params.id;
    const lectureData = req.body;
    try {
        const updatedLecture = await LectureModel.findByIdAndUpdate(lectureId, lectureData, { new: true });
        if (!updatedLecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }
        res.status(200).json(updatedLecture);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete lecture
lectureRouter.delete('/:id',auth,authorize(["ADMIN"]), async (req, res) => {
    const lectureId = req.params.id;
    try {
        const deletedLecture = await LectureModel.findByIdAndDelete(lectureId);
        if (!deletedLecture) {
            return res.status(404).json({ message: 'Lecture not found' });
        }
        res.status(200).json({ message: 'Lecture deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



lectureRouter.post('/:courseId/lectures',auth, authorize(["SUPER_ADMIN", "ADMIN"]),async (req, res) => {
    try {
        const { lectureTitle,description,Lecture_URL } = req.body;
        const courseId = req.params.courseId;

        const newLecture = new LectureModel({ lectureTitle,description,Lecture_URL, course: courseId });
        await newLecture.save();

        const course = await courseModel.findById(courseId);
        course.lectures.push(newLecture._id);
        await course.save();

        res.status(201).json({ message: 'Lecture added to course successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = { lectureRouter };
