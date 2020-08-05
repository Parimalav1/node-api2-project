const express = require('express');

const Posts = require('./db.js');

const { find } = require('./db.js');

const router = express.Router();

router.post("/", (req, res) => {
    const post = req.body;
    if (!post.title || !post.contents) {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        });
    } else {
        Posts.insert(post)
            .then(rv => {
                res.status(201).json({ id: rv.id, ...post });
            })
            .catch(error => {
                res.status(500).json({ error: "There was an error while saving the post to the database" });
            })
    }
});

router.post("/:id/comments", (req, res) => {
    Posts.findById(req.params.id)
        .then(posts => {
            if (!posts) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                const newComment = req.body;
                if (!newComment.text) {
                    res.status(400).json({ errorMessage: "Please provide text for the comment." });
                } else{
                    console.log(posts);
                    console.log('post.id: ' + posts[0].id);
                    newComment.post_id = posts[0].id;
                    Posts.insertComment(newComment)
                    .then(rv => {
                        newComment.id = rv.id;
                        res.status(201).json(newComment);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: "There was an error while saving the comment to the database" });
                    });
                }
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        });
});

router.get('/', (req, res) => {
    // all the database methods return a promise(then & catch)
    const query = req.query;// holds the query string parameters

    Posts.find(query)// pass the query string parameters to the database library
        .then(rv => {
            res.status(200).json(rv);
        })
        .catch(err => {
            console.log(error);
            res.status(500).json({ error: "The posts information could not be retrieved." });
        });

});

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then(rv => {
            if (rv) {
                res.status(200).json(rv);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({ error: "The post information could not be retrieved." });
        });
});

router.get("/:id/comments", (req, res) => {
    const comments = Posts.findPostComments(req.params.id);

    comments.then(rv => {
        if (rv) {
            res.status(200).json(rv);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({ error: "The comments information could not be retrieved." });
        });
});

router.delete("/:id", (req, res) => {
    Posts.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: "The post has been nuked" });
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({ error: "The post could not be removed" });
        });
});

router.put("/:id", (req, res) => {
    const postChanges = req.body;
    if (!postChanges.title || !postChanges.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
        return;
    }

    Posts.findById(req.params.id)
    .then(posts => {
        let post = posts[0];
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
            return;
        }
    
        Posts.update(post.id, postChanges)
            .then(count => {
                if (count === 1) {
                    Posts.findById(req.params.id).then(post => {
                        res.status(200).json(post);
                    });
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." });
                }
            })
            .catch(error => {
                // log error to database
                console.log(error);
                res.status(500).json({ error: "The post information could not be retrieved." });
            });
    })

});

module.exports = router;