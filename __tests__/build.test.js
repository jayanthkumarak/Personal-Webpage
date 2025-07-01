// Mock console to suppress output during tests
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
});

const { getAllPosts } = require('../scripts/build/build-multimedia');

test('posts are ordered latest→oldest', () => {
  const posts = getAllPosts();
  for (let i = 1; i < posts.length; i++) {
    const prev = new Date(posts[i - 1].date);
    const curr = new Date(posts[i].date);
    expect(prev >= curr).toBe(true);
  }
}); 