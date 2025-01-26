import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Typography, 
  Container, 
  Paper, 
  Box, 
  Button, 
  CardMedia,
  Chip,
  Divider
} from "@mui/material";
import { 
  ArrowBack, 
  CalendarToday, 
  Favorite 
} from "@mui/icons-material";
import { format } from 'date-fns';

function extractImageUrl(url) {
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
}

function PostDetails({ posts }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const post = posts?.find(p => p._id === id);

  if (!post) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container>
          <Typography variant="h4" color="error">
            Post not found
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
            sx={{
              mt: 2,
              transition: 'transform 0.1s',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
          >
            Back to Posts
          </Button>
        </Container>
      </motion.div>
    );
  }

  const renderContent = (content) => {
    if (!content) return '';

    let processedContent = content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/\n/g, '<br>');

    return { __html: processedContent };
  };

  const imageUrl = extractImageUrl(post.imageUrl);
  const formattedDate = format(new Date(post.createdAt), 'MMMM d, yyyy');

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
            startIcon={<ArrowBack />}
            sx={{ 
              mb: 2,
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateX(-10px)',
                boxShadow: 3
              }
            }}
          >
            Back to Posts
          </Button>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Paper 
              elevation={4} 
              sx={{ 
                p: 3, 
                mb: 3,
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2,
                backgroundColor: 'background.paper',
                borderRadius: 2,
                transition: 'box-shadow 0.3s',
                '&:hover': {
                  boxShadow: 6
                }
              }}
            >
              <Typography variant="h3" component="h1" gutterBottom sx={{ 
                transition: 'color 0.3s',
                '&:hover': {
                  color: 'primary.main'
                }
              }}>
                {post.title}
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                mb: 2
              }}>
                <Chip 
                  icon={<CalendarToday />} 
                  label={formattedDate} 
                  variant="outlined" 
                  color="primary"
                  sx={{
                    transition: 'transform 0.1s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                />
                <Chip 
                  icon={<Favorite />} 
                  label={`${post.likes} Likes`} 
                  variant="outlined" 
                  color="secondary"
                  sx={{
                    transition: 'transform 0.1s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                />
              </Box>

              {imageUrl && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardMedia
                    component="img"
                    alt={post.title}
                    image={imageUrl}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      console.error('Image failed to load:', imageUrl);
                    }}
                    sx={{ 
                      width: '100%', 
                      maxHeight: '400px', 
                      objectFit: 'cover',
                      borderRadius: 2,
                      mb: 3,
                      backgroundColor: 'background.default',
                      transition: 'transform 0.3s',
                    }} 
                  />
                </motion.div>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography 
                variant="body1" 
                component="div"
                dangerouslySetInnerHTML={renderContent(post.content)}
                sx={{ 
                  lineHeight: 1.6,
                  '& strong': { fontWeight: 'bold' },
                  '& em': { fontStyle: 'italic' },
                  '& u': { textDecoration: 'underline' }
                }}
              />
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
}

export default PostDetails;