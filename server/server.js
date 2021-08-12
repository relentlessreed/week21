const express = require('express');
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const db = require('./config/connection');
const { typeDefs, resolvers } = require('./schemas');
// const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;
// const server = new ApolloServer({

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

// server.applyMiddleware({ app });
async function startServer() {
  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
}

startServer();
// const server = new ApolloServer({
// 	typeDefs,
// 	resolvers,
// });

// await ApolloServer.start();
// server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
// app.get('*', (req, res) => {
// 	res.sendFile(path.join(__dirname, '../client/build/index.html'));
// });

// app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on localhost:${PORT}`);
    // console.log(`Use GraphQL at localhost:${PORT}${server.graphqlPath}`);
    console.log(`Use GraphQL at localhost:${PORT}${apolloServer.graphqlPath}`);
  });
});