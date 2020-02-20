const signup = async (parent, args, context, info) => {
  // create password hash
  const password = await bcrypt.hash(args.password, 10);

  // create user
  const user = await context.prisma.createUser({ ...args, password });

  // create jwt
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

const login = async (parent, args, context, info) => {
  // find user
  const user = context.prisma.user({ email: args.email });

  if (!user) {
    throw new Error("No such user found");
  }

  // check password
  const valid = await bcrypt.compare(args.password, user.password);

  if (!valid) {
    throw new Error("Invalid password");
  }

  // generate token
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user
  };
};

module.exports = {
  signup,
  login
};
