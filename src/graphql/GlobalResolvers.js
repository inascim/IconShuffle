// @flow
import { fileLoader, mergeResolvers } from 'merge-graphql-schemas';
import path from 'path';

const resolversArrays = fileLoader(path.join(__dirname, 'modules', '**', 'resolvers.js'));
const resolvers = mergeResolvers(resolversArrays);

export default resolvers;
