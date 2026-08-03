import { chunkText, cosineSimilarity, keywordScore } from '../src/rag.js';

let passed = 0;
let failed = 0;

const assert = (name: string, condition: boolean) => {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${name}`);
  } else {
    failed += 1;
    console.log(`FAIL  ${name}`);
  }
};

const longText = Array.from({ length: 600 }, (_, i) => `word${i}`).join(' ');
const chunks = chunkText(longText, 100, 20);
assert('chunkText splits long text', chunks.length > 1);
assert('chunkText keeps short text intact', chunkText('hello world').length === 1);

const score = keywordScore('What is chunk?', 'Chunk documents into segments');
assert('keywordScore finds overlap', score > 0);

const sim = cosineSimilarity([1, 0, 0], [1, 0, 0]);
assert('cosineSimilarity identical vectors', sim === 1);

console.log(`\n${passed}/${passed + failed} rag checks passed`);
process.exit(failed > 0 ? 1 : 0);
