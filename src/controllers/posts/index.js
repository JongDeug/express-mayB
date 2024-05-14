function getPosts(req, res) {
  res.status(200).json({ posts: this.posts });
}

export default {
  getPosts,
};

