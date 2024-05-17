export const mockProtect = (req, res, next) => {
  req.user = { username: "testuser", positions: ["boss"] };
  next();
};

export const mockBoss = (req, res, next) => {
  next();
};
