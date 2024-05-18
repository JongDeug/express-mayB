export const pagination = (req, res, next) => {
  const page = req.query.page ?? '1';
  const limit = req.query.limit ?? '20';
  const take = Number(limit);
  const skip = (Number(page) - 1) * take;

  // 계산해서 추가
  req.take = take;
  req.skip = skip;

  next();
}
