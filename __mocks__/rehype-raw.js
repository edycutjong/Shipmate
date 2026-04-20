// Mock rehype-raw for Jest (ESM module)
module.exports = function rehypeRaw() {
  return (tree) => tree;
};
