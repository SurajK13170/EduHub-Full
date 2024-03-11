const express = require("express")
const discussionRouter = express.Router()
const { discussionModel } = require("../Models/Discussion.model")
const { LectureModel } = require("../Models/Lecture.model")
const { auth } = require("../Middleware/Authentication")

discussionRouter.post('/:lectureId',auth,  async (req, res) => {
    const lecturId = req.params.lectureId
    const userId = req.user.userId;

    try {
        const {message } = req.body;
        const discussion = new discussionModel({lecturId, userId, message});
        await discussion.save()
        res.status(201).json({ message: 'Discussion created successfully', discussion });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})


discussionRouter.get('/user/:userId', auth,async (req, res) => {
    try {
        const userId = req.params.userId;
        const discussions = await discussionModel.find({ userId }).populate('lectureId');
        res.json(discussions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

discussionRouter.put('/:id',auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const updatedDiscussion = await discussionModel.findByIdAndUpdate(id, { message }, { new: true });
        if (!updatedDiscussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }
        res.json(updatedDiscussion);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

discussionRouter.delete('/:id',auth, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDiscussion = await discussionModel.findByIdAndDelete(id);
        if (!deletedDiscussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }
        res.json({ message: 'Discussion deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = {discussionRouter}