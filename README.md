# Simple Blog - Modern Writing Platform

A high-fidelity, premium blog platform built with React, focused on a seamless writing experience and modern aesthetics.

## 🚀 Features

- **Rich Text Editor**: Powered by Tiptap, allowing for bold, italics, headings, lists, quotes, and code blocks.
- **Image Management**: Support for cover photos and inline images with direct upload to Supabase Storage.
- **Dynamic Content**: Live preview while editing, auto-generating slugs, and real-time validation.
- **Social Interaction**: Robust comment system with image attachments and nested design.
- **Responsive & Accessible**: Fully optimized for mobile with a glassmorphic, dark-mode-ready UI.
- **Secure Auth**: Full authentication flow using Supabase Auth.

## 🛠 Tech Stack

### 🟦 TypeScript
The entire project is written in **TypeScript**. 
- **Type Safety**: Ensures data consistency from the Supabase fetching layer all the way to the UI components.
- **Developer Experience**: Robust IDE support with autocompletion for state shapes, props, and database schemas.
- **Maintainability**: Clear interfaces for `Blog`, `Comment`, and `User` models make the codebase easy to refactor and scale.

### 🟣 Redux (Toolkit)
We use **Redux Toolkit** for sophisticated state management.
- **Global Data Store**: Manages the list of blogs, the current active blog, and user-specific data.
- **Asynchronous Thunks**: Handles complex logic for fetching, creating, updating, and deleting blog posts with built-in loading and error states.
- **Centralized Logic**: Separates business logic from UI components, keeping views clean and focused on rendering.

### ⚡ Supabase
**Supabase** serves as our Backend-as-a-Service (BaaS).
- **PostgreSQL Database**: Stores all blog posts and comments with relational integrity.
- **Authentication**: Out-of-the-box support for email/password login and session persistence.
- **Storage**: Handles high-resolution image uploads for cover photos and blog content.
- **Row Level Security (RLS)**: Protects data by ensuring only authors can edit or delete their own posts, while allowing public read access.

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI elements (Navbar, Editor, Pagination)
├── contexts/       # AuthContext for universal session management
├── features/       # Redux slices and async thunks (blog, comments)
├── layouts/        # Page wrappers and consistent shell designs
├── pages/          # Full page components (BlogList, BlogForm, Login)
└── store.ts        # Central Redux store configuration
```

## ⚙️ Local Setup

1.  **Clone the repository**:
    ```bash
    git clone [repository-url]
    cd simple-blog
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the root directory:
    ```text
    REACT_APP_SUPABASE_URL=your_supabase_url
    REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Start the development server**:
    ```bash
    npm start
    ```

## 🔐 Database Security

Ensure you have RLS policies enabled in your Supabase dashboard:
- **Blogs**: `(auth.uid() = user_id)` for UPDATE/DELETE.
- **Comments**: `EXISTS (SELECT 1 FROM blogs WHERE blogs.id = comments.blog_id AND blogs.user_id = auth.uid())` for DELETE.

---

Built with ❤️ by parodez
