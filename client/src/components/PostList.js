import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  TextField, 
  MenuItem, 
  Select,
  InputLabel,
  FormControl,
  Box,
  Container
} from "@mui/material";
import { Favorite, RemoveRedEye, CalendarToday } from "@mui/icons-material";
import { format } from 'date-fns';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("date-desc");

  useEffect(() => {
    axios.get("http://localhost:5000/posts").then((res) => setPosts(res.data));
  }, []);

  const handleLike = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/posts/${id}/like`);
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id ? { ...post, likes: res.data.likes } : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const extractImageUrl = (url) => {
    if (!url) return null;

    const googleImgMatch = url.match(/imgurl=(.*?)&/);
    if (googleImgMatch) {
      return decodeURIComponent(googleImgMatch[1]);
    }

    try {
      new URL(url);
      return url;
    } catch (error) {
      console.warn('Invalid URL:', url);
      return null;
    }
  };

  const renderContent = (content) => {
    if (!content) return '';

    let processedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>');

    return { __html: processedContent };
  };

  const filteredPosts = posts
    .filter((post) => 
      post.title.toLowerCase().includes(filter.toLowerCase()) ||
      post.likes.toString().includes(filter)
    )
    .sort((a, b) => {
      switch(sortOrder) {
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "likes-asc":
          return a.likes - b.likes;
        case "likes-desc":
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ my: 3 }}>
          Blog Posts
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' }
        }}>
          <TextField
            fullWidth
            label="Search posts by title or likes"
            variant="outlined"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortOrder}
              label="Sort By"
              onChange={(e) => setSortOrder(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
            >
              <MenuItem value="date-desc">Newest First</MenuItem>
              <MenuItem value="date-asc">Oldest First</MenuItem>
              <MenuItem value="likes-desc">Most Liked</MenuItem>
              <MenuItem value="likes-asc">Least Liked</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={3}>
          {filteredPosts.map((post) => {
            const imageUrl = extractImageUrl(post.imageUrl);
            const formattedDate = format(new Date(post.createdAt), 'MMMM d, yyyy');
            
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
                        console.warn('Failed to load image:', imageUrl);
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
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 1, 
                      mb: 1,
                      color: 'text.secondary'
                    }}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="body2">
                        {formattedDate}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      dangerouslySetInnerHTML={renderContent(post.content.substring(0, 200) + '...')}
                    />
                  </CardContent>
                  <CardActions 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}
                  >
                    <Button 
                      size="small" 
                      color="primary" 
                      startIcon={<Favorite />}
                      onClick={() => handleLike(post._id)}
                    >
                      {post.likes} Likes
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      component={RouterLink}
                      to={`/posts/${post._id}`}
                      startIcon={<RemoveRedEye />}
                    >
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </motion.div>
  );
}

export default PostList;