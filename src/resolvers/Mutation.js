const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("./../utils");

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
  const user = await context.prisma.user({ email: args.email });
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

const post = async (parent, args, context, info) => {
  // get userId from token
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
};

const vote = async (parent, args, context, info) => {
  // get userId from token
  const userId = getUserId(context);

  // check if user already voted
  const linkExists = await context.prisma.$exists.vote({
    user: {
      id: userId
    },
    link: {
      id: args.linkId
    }
  });

  if (linkExists) {
    throw new Error(`Already voted for link: ${args.linkId}`);
  }

  // create vote in db
  return context.prisma.createVote({
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  });
};

module.exports = {
  signup,
  login,
  post,
  vote
};
