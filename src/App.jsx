import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Articles from './pages/Articles.jsx'
import Category from './pages/Category.jsx'
import Article from './pages/Article.jsx'
import AuthGate from './admin/AuthGate.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import Dashboard from './admin/Dashboard.jsx'
import PostsList from './admin/PostsList.jsx'
import PostEditor from './admin/PostEditor.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Legal from './pages/Legal.jsx'
import Categories from './admin/Categories.jsx'
import Authors from './admin/Authors.jsx'
import Subscribers from './admin/Subscribers.jsx'
import Messages from './admin/Messages.jsx'
import NotFound from './pages/NotFound.jsx'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.querySelector(hash)?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main className="container"><Outlet /></main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<AuthGate />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="posts" element={<PostsList />} />
            <Route path="posts/new" element={<PostEditor />} />
            <Route path="posts/:id/edit" element={<PostEditor />} />
            <Route path="categories" element={<Categories />} />
            <Route path="authors" element={<Authors />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="messages" element={<Messages />} />
          </Route>
        </Route>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/category/:slug" element={<Category />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Legal page="terms" />} />
          <Route path="/privacy" element={<Legal page="privacy" />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
