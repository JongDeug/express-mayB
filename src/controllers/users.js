function getUsers(req, res) {
  res.status(200).json({users: this.users});
}

// 이건 안되더라
// export const getUsers = (req, res) => {
//   res.status(200).json({ users: this.users });
// };


export default {
  getUsers,
};
