function getUsers(req, res, next) {
  try {
    // res.status(200).json({ users: this.users });
    // throw new Error('test');
  } catch (err) {
    next(err);
  }
}

// 이건 안되더라
// export const getUsers = (req, res) => {
//   res.status(200).json({ users: this.users });
// };

function getUser(req, res, next) {
  try {
    const { id } = req.params;

    const user = this.users.find((user) => user.id === +id);

    if (!user) {
      const error = new Error('유저를 찾을 수 없습니다.');
      error.status = 404;
      throw error;
    }

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}

export default {
  getUsers,
  getUser,
};
