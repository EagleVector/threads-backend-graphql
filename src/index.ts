import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  // Create graphql server
  const gqlServer = new ApolloServer({
    // Schema Layer
    typeDefs: `
      type Query {
        hello: String
        say(name: String): String
      }
    `,
    // Actual Functions
    resolvers: {
      Query: {
        hello: () => `Hey There, I am a graphQL server`,
        say: (_, {name}: {name: String} ) => `Hey ${name}, Whats Up?`
      }
    }      
  })

  // Start the gql srever
  await gqlServer.start()


  app.get('/', (req, res) => {
    res.json({ message: 'Server is up and Running' });
  });

  app.use('/graphql', expressMiddleware(gqlServer));

  app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
}

init();