const { Thought, User } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts)).catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'ID NOT FOUND FOR THAT THOUGHT.' })
                    : res.json(thought)
            ).catch((err) => res.status(500).json(err));
    },
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                return User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
                );
            })
            .then((user) =>
                !user
                ? res.status(404).json({
                    message: 'THOUGHT CREATED. ID NOT FOUND FOR THAT USER.',
                    })
                : res.json('THOUGHT CREATED')
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
            )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'ID NOT FOUND FOR THAT THOUGHT.' })
                    : res.json(thought)
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'ID NOT FOUND FOR THAT THOUGHT.' })
                    : User.findOneAndUpdate(
                        { thoughts: req.params.thoughtId },
                        { $pull: { thoughts: req.params.thoughtId } },
                        { new: true }
                        )
            )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'DELETED THOUGHT. ID NOT FOUND FOR THAT USER.' })
                    : res.json({ message: 'THOUGHT DELETED.' })
            )
            .catch((err) => res.status(500).json(err));
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
            )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'ID NOT FOUND FOR THAT THOUGHT.'})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $pull: { reactions: req.params.reactionId } },
            { runValidators: true, new: true }
            )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'ID NOT FOUND FOR THAT THOUGHT.'})
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    }
};