var admin = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

var serviceAccount = require("./firebaseAppData.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://haribon-e-wall-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = getFirestore();

const addUser = async ({ name, email }) => {
  await db
    .collection("UserData")
    .equalTo(email)
    .once("value", (snapshot) => {
      if (!snapshot.exists()) {
        db.collection("UserData")
          .doc(email)
          .set({ name: name, isAdmin: /\d/.test(email) ? false : true });
      }
    });
};

const redditAlgorithm = (post) => {
  const timePosted = new Date(post.data().timePosted._seconds);
  const currentDate = new Date(Timestamp.fromDate(new Date())._seconds);
  let t = currentDate - timePosted;
  let x = post.data().upVote - post.data().downVote;
  let y = 0;
  let z = 0;

  if (x > 0) {
    y = 1;
  } else if ((x = 0)) {
    y = 0;
  } else {
    y = -1;
  }

  if (Math.abs(x) >= 1) {
    z = Math.abs(x);
  } else {
    z = 1;
  }

  let result = Math.log(10) * z + (y * t) / 45000;
  return result;
};

const generateVotePoint = async () => {
  // to update the vote count using the reddit algorithm
  const ref = await db.collection("Posts").get();

  if (!ref.empty) {
    ref.forEach((post) => {
      // console.log(redditAlgorithm(post));
      const refPost = db.collection("Posts").doc(post.id);
      refPost.update({
        votePoint: redditAlgorithm(post),
      });
    });
  }
};

const votePost = async ({ voteType, userType, postId }) => {
  // TODO: check if the user up votes or down votes, then update the current vote count of a specific post
  // TODO: add the post to a user's vote lists
};

const writePost = async ({ category, isAnonymous, message, userId, tags }) => {
  await db.collection("Posts").add({
    categoryId: category,
    downVote: 0,
    upVote: 0,
    isAnonymous: isAnonymous,
    isSolved: false,
    message: message,
    tags: tags,
    timePosted: Timestamp.fromDate(new Date()),
    userId: userId,
    votePoint: 0,
  });
};

const writeComment = async () => {
  // TODO: add comment using the post id then add it on the Comments collection
};

module.exports = {
  addUser: addUser,
  generateVotePoint: generateVotePoint,
  writePost: writePost,
};
