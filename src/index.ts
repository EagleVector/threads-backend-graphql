import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

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
      type Mutation {
        createUser(firstName: String!, lastName: String!, email: String!, password: String!): Boolean
      }
    `,
		// Actual Functions
		resolvers: {
			Query: {
				hello: () => `Hey There, I am a graphQL server`,
				say: (_, { name }: { name: String }) => `Hey ${name}, Whats Up?`
			},
      Mutation: {
        createUser: async(_, 
          { 
            firstName, 
            lastName, 
            email, 
            password
          }: {
            firstName: string; 
            lastName: string;
            email: string;
            password: string
           }
        ) => {
          await prismaClient.user.create({
            data: {
              email,
              firstName,
              lastName,
              password,
              salt: "random_salt"
            },
          });
          return true;
        }
      }
		}
	});

	// Start the gql srever
	await gqlServer.start();

	app.get('/', (req, res) => {
		res.json({ message: 'Server is up and Running' });
	});

	app.use('/graphql', expressMiddleware(gqlServer));

	app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
}

init();
