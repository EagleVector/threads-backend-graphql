import { ApolloServer } from '@apollo/server';
import { User } from './user';

async function createApolloGraphqlServer() {
	// Create graphql server
	const gqlServer = new ApolloServer({
		// Schema Layer
		typeDefs: `
      type Query {
				${User.queries}
			}
      type Mutation {
				${User.mutations}
			}
    `,
		// Actual Functions
		resolvers: {
			Query: {
				...User.resolvers.queries
			},
			Mutation: {
				...User.resolvers.mutations
			}
		}
	});

	// Start the gql srever
	await gqlServer.start();

	return gqlServer;
}

export default createApolloGraphqlServer;
