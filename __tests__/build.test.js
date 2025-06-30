const { getAllPosts } = require('../build');

test('posts are ordered latest→oldest', () => {
  const posts = getAllPosts();
  for (let i = 1; i < posts.length; i++) {
    const prev = new Date(posts[i - 1].date);
    const curr = new Date(posts[i].date);
    expect(prev >= curr).toBe(true);
  }
}); 