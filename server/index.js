const express = require("express");
const app = express();
const port = 3001;

const cors = require("cors");

const {
  addUser,
  generateVotePoint,
  writePost,
  writeComment,
  votePost,
  writeTags,
  deletePost,
  deleteVotedPost,
  deleteTagCount,
  deleteComment,
  toggleSolve,
} = require("./firebase-config");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/addUser", async (req, res) => {
  // functional, add new user to the database
  await addUser({ email: req.body.email, name: req.body.name })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error.message);
    });
  //   res.send()
});

app.post("/generateVotePoint", async (req, res) => {
  await generateVotePoint()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error.message);
    });
});

app.post("/writePost", async (req, res) => {
  await writePost({
    category: req.body.category,
    isAnonymous: !!req.body.isAnonymous,
    message: req.body.message,
    userId: req.body.userId,
    tags: req.body.tags,
  })
    .then((result) => {
      res.send(result);
      generateVotePoint();
      writeTags({ tags: req.body.tags });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post("/writeComment", async (req, res) => {
  await writeComment({
    postId: req.body.postId,
    reply: req.body.reply,
    userId: req.body.userId,
  })
    .then((result) => {
      res.send(result);
      generateVotePoint();
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.post("/votePost", async (req, res) => {
  await votePost({
    voteType: req.body.voteType,
    userId: req.body.userId,
    postId: req.body.postId,
    weight: req.body.weight,
  })
    .then((result) => {
      res.send(result);
      generateVotePoint();
    })
    .catch((error) => {
      res.send(error.message);
    });
});

app.post("/deletePost", async (req, res) => {
  await deletePost({ postId: req.body.postId })
    .then((result) => {
      res.send(result);
      deleteVotedPost({ userId: req.body.userId, postId: req.body.postId });
      deleteTagCount({ tags: req.body.tags });
    })
    .catch((error) => {
      res.send(error.message);
    });
});

app.post("/deleteComment", async (req, res) => {
  await deleteComment({ commentId: req.body.postId })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error.message);
    });
});

app.post("/toggleSolve", async (req, res) => {
  await toggleSolve({ isSolved: req.body.isSolved, postId: req.body.postId })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send(error.message);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
