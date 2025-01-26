import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Typography, 
  Container, 
  TextField, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Dialog, 
  DialogTitle, 
  DialogContent,
  DialogActions,
  Zoom
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import PostForm from "./PostForm";

function extractImageUrl(url) {
  if (!url) return null;

  // Handle Google image search URLs
  const googleImgMatch = url.match(/imgurl=(.*?)&/);
  if (googleImgMatch) {
    return decodeURIComponent(googleImgMatch[1]);
  }

  // Handle other potential complex URLs or direct URLs
  try {
    new URL(url);
    return url;
  } catch (error) {
    console.warn('Invalid URL:', url);
    return null;
  }
}

function AdminPanel({ isAdmin, setIsAdmin, posts, updatePosts }) {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const renderContent = (content) => {
    if (!content) return '';

    let processedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .substring(0, 200) + '...';

    return { __html: processedContent };
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/admin/login", credentials);
      if (res.data.success) {
        setIsAdmin(true);
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`);
      const updatedPosts = posts.filter(post => post._id !== id);
      updatePosts(updatedPosts);
      setDeleteConfirmation(null);
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (!isAdmin) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="xs">
          <Box 
            component="form" 
            onSubmit={handleLogin}
            sx={{ 
              mt: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4" gutterBottom>
              Admin Login
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              variant="outlined"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              variant="outlined"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ 
                mt: 2,
                transition: 'transform 0.1s',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ my: 3 }}>
          Admin Panel
        </Typography>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {editingPost ? (
            <PostForm
              post={editingPost}
              onSave={(updatedPost) => {
                const updatedPosts = posts.map(p => 
                  p._id === updatedPost._id ? updatedPost : p
                );
                updatePosts(updatedPosts);
                setEditingPost(null);
              }}
              onCancel={() => setEditingPost(null)}
            />
          ) : (
            <PostForm
              onSave={(newPost) => {
                updatePosts([...posts, newPost]);
              }}
            />
          )}
        </motion.div>

        <Typography variant="h5" sx={{ my: 3 }}>
          All Posts
        </Typography>

        <Grid container spacing={3}>
          {posts.map((post) => {
            const imageUrl = extractImageUrl(post.imageUrl);
            return (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={post._id}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: 6
                    }
                  }}
                >
                  {imageUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={imageUrl}
                      alt={post.title}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        console.warn('Failed to load image in admin panel:', imageUrl);
                      }}
                      sx={{ 
                        objectFit: 'cover',
                        backgroundColor: 'background.default'
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {post.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      dangerouslySetInnerHTML={renderContent(post.content)}
                    />
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary" 
                      startIcon={<Edit />}
                      onClick={() => setEditingPost(post)}
                      sx={{
                        transition: 'transform 0.1s',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      startIcon={<Delete />}
                      onClick={() => setDeleteConfirmation(post)}
                      sx={{
                        transition: 'transform 0.1s',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        <Dialog
          open={!!deleteConfirmation}
          onClose={() => setDeleteConfirmation(null)}
          TransitionComponent={Zoom}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the post "{deleteConfirmation?.title}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmation(null)}>Cancel</Button>
            <Button 
              color="error" 
              onClick={() => handleDelete(deleteConfirmation._id)}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </motion.div>
  );
}

export default AdminPanel;