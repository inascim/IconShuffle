import startServer from './startServer';
import resolvers from './graphql/GlobalResolvers';
import typeDefs from './graphql/TypeDefinitions';

startServer({ typeDefs, resolvers });
