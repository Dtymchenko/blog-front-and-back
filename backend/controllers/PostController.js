import PostModel from "../models/Post.js";

// export const getLastTags = async (req, res) => {
//   try {
//     const posts = await PostModel.find().limit(5).exec();
//     const tags = posts
//       .map((obj) => obj.tags)
//       .flat()
//       .filter((tag, index, self) => self.indexOf(tag) === index)
//       .slice(-5);
//     res.json(tags);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Failed to receive tags",
//     });
//   }
// };

export const getTags = async (req, res) => {
  try {
    const allPosts = await PostModel.find().exec();
    const tags = allPosts
      .map((obj) => obj.tags)
      .flat()
      .filter((tag, index, self) => self.indexOf(tag) === index)
    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to receive tags",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Did not manage to create article",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId }, // Filter condition for the update
      { $inc: { viewsCount: 1 } }, // Update operation
      { new: true } // Options to return the updated document
    ).populate("user");

    if (!updatedPost) {
      return res.status(404).json({ message: "Article not found" });
    }

    res.json(updatedPost);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Did not manage to get article",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;
    const deletedPost = await PostModel.findOneAndDelete({ _id: postId });

    if (!deletedPost) {
      return res.status(404).json({
        message: "Article not found",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Did not manage to delete article",
    });
  }
};

export const update = async (req, res) => {
  console.log("req:", req.body.title, req.body.text);
  try {
    const postId = req.params.id;
    const updatedPost = await PostModel.findOne({ _id: postId });
    if (!updatedPost) {
      return res.status(404).json({
        message: "Article not found",
      });
    }
    await updatedPost.updateOne({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      user: req.userId,
    });

    console.log("After update:", updatedPost);
    await updatedPost.save();
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Did not manage to update article",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Did not manage to get articles",
    });
  }
};
