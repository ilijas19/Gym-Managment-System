const createTokenUser = (user) => {
  return {
    name: user.name,
    username: user.username,
    role: user.role,
    userId: user._id,
  };
};

module.exports = createTokenUser;
