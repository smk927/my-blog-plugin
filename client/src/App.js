import React, { useState, useEffect } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route 
} from "react-router-dom";
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Box
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import PostList from "./components/PostList";
import PostDetails from "./components/PostDetails";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  // Create enhanced dark theme
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: darkMode ? '#64b5f6' : '#1976d2',
        light: darkMode ? '#90caf9' : '#4dabf5',
        dark: darkMode ? '#1976d2' : '#115293'
      },
      secondary: {
        main: darkMode ? '#f48fb1' : '#f50057',
      },
      background: {
        default: darkMode ? '#121212' : '#f4f4f4',
        paper: darkMode ? '#1d1d1d' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#e0e0e0' : '#212121',
        secondary: darkMode ? '#b0b0b0' : '#666666'
      }
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: darkMode 
                ? '0 4px 10px rgba(64, 180, 246, 0.4)' 
                : '0 4px 10px rgba(25, 118, 210, 0.4)'
            }
          }
        }
      }
    }
  });

  // Fetch posts when component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Function to update posts after admin actions
  const updatePosts = (newPosts) => {
    setPosts(newPosts);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <AppBar 
            position="static" 
            sx={{ 
              background: darkMode 
                ? 'linear-gradient(135deg, #1d1d1d 0%, #121212 100%)' 
                : 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)'
            }}
          >
            <Toolbar>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                The Digital Pen
              </Typography>
              <IconButton 
                color="inherit" 
                onClick={toggleDarkMode}
                aria-label="toggle dark mode"
                sx={{
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'rotate(180deg)'
                  }
                }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PostList posts={posts} />} />
                <Route 
                  path="/posts/:id" 
                  element={<PostDetails posts={posts} />} 
                />
                <Route
                  path="/admin"
                  element={
                    <AdminPanel 
                      isAdmin={isAdmin} 
                      setIsAdmin={setIsAdmin} 
                      posts={posts}
                      updatePosts={updatePosts}
                    />
                  }
                />
              </Routes>
            </AnimatePresence>
          </Container>
        </motion.div>
      </Router>
    </ThemeProvider>
  );
}

export default App;