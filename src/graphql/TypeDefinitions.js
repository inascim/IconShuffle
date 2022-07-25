// @flow
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';
import path from 'path';

const typeArrays = fileLoader(path.join(__dirname, 'modules', '**', '*.gql'));
const typesDefs = mergeTypes(typeArrays);

export default typesDefs;
