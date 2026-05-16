import React from 'react';
import { Link } from 'react-router-dom';

const BlogHome = () => {
  const articles = [
    {
      title: 'Best AI Tools for YouTubers',
      description: 'Discover the top AI tools to help YouTubers create engaging content and grow their channels.',
      link: '/blog/best-ai-tools-for-youtubers',
    },
    {
      title: 'AI Tools for TikTok Creators',
      description: 'Learn how AI tools can help TikTok creators generate viral content and save time.',
      link: '/blog/ai-tools-for-tiktok-creators',
    },
    {
      title: 'How AI Helps Creators Go Viral',
      description: 'Explore how AI-powered tools can help creators go viral on social media platforms.',
      link: '/blog/how-ai-helps-creators-go-viral',
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Blog</h1>
      <p>Explore our latest articles on AI tools for creators.</p>
      <ul>
        {articles.map((article, index) => (
          <li key={index} style={{ marginBottom: '20px' }}>
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <Link to={article.link}>Read More</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogHome;