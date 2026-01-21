import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBlogs } from '../../features/blogSlice';
import { RootState, AppDispatch } from '../../store';
import './BlogList.css';
import { useAuth } from '../../contexts/AuthContext';

const BlogList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((state: RootState) => state.blogs);

  const { user } = useAuth();

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBlogs(user?.id));
    }
  }, [dispatch, user]);

  if (loading) return <div className="blog-list-container">Loading...</div>
  if (error) return <div className="blog-list-container">Error: {error}</div>

  return (
    <div className="blog-list-container">
      <div className="blog-list-header">
        <h1>Blog Posts</h1>
        <button className="blog-create-btn">Create Blog</button>
      </div>
      <div className="blog-list">
        {blogs.map(blog => (
          <div key={blog.id} className="blog-card">
            {blog.image_url && (
              <img src={blog.image_url} alt={blog.title} className="blog-card-image" />
            )}
            <div className="blog-card-content">
              <h2 className="blog-card-title">{blog.title}</h2>
              <p className="blog-card-summary">{blog.content}</p>
              <div className="blog-card-footer">
                <span className="blog-card-date">{blog.created_at && new Date(blog.created_at).toLocaleString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                }).replace(',', '')}</span>
                <button className="blog-card-btn view">View</button>
                <button className="blog-card-btn edit">Edit</button>
                <button className="blog-card-btn delete">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
