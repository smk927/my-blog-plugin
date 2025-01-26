# Blog Application with React and Material-UI

A modern, responsive blog application built with React, Material-UI, and Framer Motion. Features a clean interface for blog post management with smooth animations and transitions.

## Features

- 🎨 Modern UI with Material-UI components
- ✨ Smooth animations using Framer Motion
- 📱 Fully responsive design
- 🔐 Admin authentication
- 📝 Rich text formatting
- 🖼️ Image support
- ❤️ Like system
- 🔍 Search and filter posts
- 🗂️ Sort posts by date or popularity

## Tech Stack

- React
- Material-UI
- Framer Motion
- Express.js (Backend)
- MongoDB
- Axios
- date-fns

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/smk927/my-blog-plugin.git
```

2. Install dependencies:
```bash
cd server
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Start the development server:
```bash
cd client
npm start
```

The reader application will be available at `http://localhost:3000`
The admin application will be available at `http://localhost:3000/admin`

## Features in Detail

### Post Management
- Create, read, update, and delete blog posts
- Rich text formatting (bold, italic, underline)
- Image URL support
- Post preview in cards

### Admin Panel
- Secure admin login
- Post management interface
- Edit and delete capabilities
- Post creation form

### User Features
- Like posts
- Search posts by title
- Sort posts by date or popularity
- Read full post content
- Responsive image display

### UI/UX Features
- Smooth page transitions
- Hover animations
- Loading states
- Responsive design
- Material Design components
- Modern card-based layout
