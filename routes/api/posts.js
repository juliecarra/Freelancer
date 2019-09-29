const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

//@route   POST api/posts
//@desc    Create a post
//@access  Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route   GET api/posts
//@desc    Get all posts
//@access  Private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); //Find the post (the most recent will be displayed first)
    res.json(posts);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route   GET api/posts/:id
//@desc    Get post by ID
//@access  Private

router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ msg: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

//@route   DELETE api/posts/:id
//@desc    Get all posts
//@access  Private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //If post doesn't exist
    if (!post) {
      res.status(404).json({ msg: "Post not found" });
    }
    //Check user
    if (post.user.toString() !== req.user.id) {
      res.status(404).json({ msg: "User not authorized" });
    }
    await post.remove();
    res.json({ msg: "Post removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") {
      res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server error");
  }
});

//@route   PUT api/posts/like/:id
//@desc    Like a  post
//@access  Private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check  if a post has already been like by the user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route   PUT api/posts/unlike/:id
//@desc    Unlike a  post
//@access  Private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    //Check  if a post has already been like by the user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }

    //Get remove index
    const removeIndex = post.likes.map(like =>
      like.user.toString().indexOf(req.user.id)
    );

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route   POST api/posts/comment/:id
//@desc    Comment a post
//@access  Private
router.post(
  "/comment/:id",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("password");
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route   DELETE api/posts/comment/:id/:comment_id
//@desc    Delete a comment
//@access  Private

router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    //Get the post by its id
    const post = await Post.findById(req.params.id);

    //Get the comment from the post
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );

    //Make sure comment exist
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }

    //Make sure that the user who wants to delete the comment is the one who add the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Comment does not exist " });
    }
    //Get remove index
    const removeIndex = post.comments.map(comment =>
      comment.user.toString().indexOf(req.user.id)
    );

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
