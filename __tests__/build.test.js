// Set environment for minimal logging during tests
process.env.LOG_LEVEL = 'error';

const { getAllPosts } = require('../scripts/build/build-multimedia');

describe('Build System', () => {
  test('posts are ordered latest→oldest', async () => {
    const posts = await getAllPosts();
    
    // Only run test if we have posts to test
    if (posts.length > 1) {
      for (let i = 1; i < posts.length; i++) {
        const prev = new Date(posts[i - 1].date);
        const curr = new Date(posts[i].date);
        expect(prev.getTime()).toBeGreaterThanOrEqual(curr.getTime());
      }
    } else {
      // Log warning if not enough posts to test ordering
      console.warn('Not enough posts to test ordering (need at least 2)');
    }
  });
  
  test('getAllPosts returns an array', async () => {
    const posts = await getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
  });
  
  test('posts have required fields', async () => {
    const posts = await getAllPosts();
    
    posts.forEach(post => {
      expect(post).toHaveProperty('title');
      expect(post).toHaveProperty('date');
      expect(post).toHaveProperty('slug');
      expect(post).toHaveProperty('content');
    });
  });
}); 