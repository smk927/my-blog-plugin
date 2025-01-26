import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  IconButton, 
  Stack 
} from "@mui/material";
import { 
  FormatBold, 
  FormatItalic, 
  FormatUnderlined 
} from "@mui/icons-material";

function PostForm({ post = {}, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: post.title || "",
    content: post.content || "",
    imageUrl: post.imageUrl || "",
  });

  const applyFormatting = (formatting) => {
    const textarea = document.getElementById('content-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText;
    switch(formatting) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      default:
        return;
    }

    const newContent = 
      formData.content.slice(0, start) + 
      formattedText + 
      formData.content.slice(end);

    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (post._id) {
        response = await axios.put(`http://localhost:5000/posts/${post._id}`, formData);
        onSave(response.data);
      } else {
        response = await axios.post("http://localhost:5000/posts", formData);
        onSave(response.data);
      }
    } catch (err) {
      console.error("Error saving post:", err);
      alert("Failed to save post. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="md">
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            my: 3 
          }}
        >
          <Typography variant="h5" gutterBottom>
            {post._id ? "Edit Post" : "Create New Post"}
          </Typography>

          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />

          <Stack 
            direction="row" 
            spacing={1} 
            sx={{ 
              mb: 1,
              '& button': {
                transition: 'transform 0.1s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }
            }}
          >
            <IconButton 
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                applyFormatting('bold');
              }}
              title="Bold"
            >
              <FormatBold />
            </IconButton>
            <IconButton 
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                applyFormatting('italic');
              }}
              title="Italic"
            >
              <FormatItalic />
            </IconButton>
            <IconButton 
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                applyFormatting('underline');
              }}
              title="Underline"
            >
              <FormatUnderlined />
            </IconButton>
          </Stack>

          <TextField
            id="content-textarea"
            fullWidth
            label="Content"
            multiline
            rows={6}
            variant="outlined"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
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
            label="Image URL"
            variant="outlined"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              }
            }}
          />

          <Stack direction="row" spacing={2}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{
                transition: 'transform 0.1s',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              {post._id ? "Update" : "Create"} Post
            </Button>
            {onCancel && (
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={onCancel}
                sx={{
                  transition: 'transform 0.1s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Cancel
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
    </motion.div>
  );
}

export default PostForm;