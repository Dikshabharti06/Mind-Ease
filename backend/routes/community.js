
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// Get all posts (with pagination and filtering)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || null;
    const tags = req.query.tags ? req.query.tags.split(',') : null;
    const resolved = req.query.resolved === 'true' ? true : (req.query.resolved === 'false' ? false : null);
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (tags) {
      query.tags = { $in: tags };
    }
    
    if (resolved !== null) {
      query.resolved = resolved;
    }
    
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name')
      .populate('comments.author', 'name');
    
    // Transform to hide author details when anonymous
    const transformedPosts = posts.map(post => {
      const p = post.toObject();
      if (p.isAnonymous) {
        p.author = { name: 'Anonymous' };
      }
      
      p.comments = p.comments.map(comment => {
        if (comment.isAnonymous) {
          comment.author = { name: 'Anonymous' };
        }
        return comment;
      });
      
      return p;
    });
    
    const total = await Post.countDocuments(query);
    
    res.json({
      posts: transformedPosts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name')
      .populate('comments.author', 'name');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Transform to hide author details when anonymous
    const p = post.toObject();
    if (p.isAnonymous) {
      p.author = { name: 'Anonymous' };
    }
    
    p.comments = p.comments.map(comment => {
      if (comment.isAnonymous) {
        comment.author = { name: 'Anonymous' };
      }
      return comment;
    });
    
    res.json(p);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, isAnonymous, category, tags } = req.body;
    
    const newPost = new Post({
      title,
      content,
      author: req.user.id,
      isAnonymous: isAnonymous || false,
      category: category || 'General',
      tags: tags || []
    });
    
    await newPost.save();
    
    // Populate author data
    await newPost.populate('author', 'name');
    
    // Transform for response
    const post = newPost.toObject();
    if (post.isAnonymous) {
      post.author = { name: 'Anonymous' };
    }
    
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment to a post
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { content, isAnonymous, isHelpful } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    post.comments.push({
      content,
      author: req.user.id,
      isAnonymous: isAnonymous || false,
      isHelpful: isHelpful || false
    });
    
    await post.save();
    await post.populate('comments.author', 'name');
    
    // Get the added comment
    const newComment = post.comments[post.comments.length - 1].toObject();
    
    // Transform for anonymous
    if (newComment.isAnonymous) {
      newComment.author = { name: 'Anonymous' };
    }
    
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error adding comment:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user already liked the post
    if (post.likes.includes(req.user.id)) {
      // Unlike
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      // Like
      post.likes.push(req.user.id);
    }
    
    await post.save();
    
    res.json({ likes: post.likes.length, userLiked: post.likes.includes(req.user.id) });
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark post as resolved
router.put('/:id/resolve', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Only the author can mark as resolved
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    post.resolved = !post.resolved;
    await post.save();
    
    res.json({ resolved: post.resolved });
  } catch (err) {
    console.error('Error resolving post:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
