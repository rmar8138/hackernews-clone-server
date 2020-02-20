const link = (parent, args, context, info) => {
  return context.prisma.vote({ id: parent.id }).link();
};

const user = (parent, args, context, info) => {
  return context.prisma.vote({ id: parent.id }).user();
};

module.exports = {
  link,
  user
};
