import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '@fontsource/plus-jakarta-sans/400.css'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'
import '@fontsource/plus-jakarta-sans/800.css'
import AppLayout from './layouts/AppLayout'
import HomePage from './pages/HomePage'
import ClientsPage from './pages/ClientsPage'
import ClientDetailPage from './pages/ClientDetailPage'
import TicketsPage from './pages/TicketsPage'
import TeamPage from './pages/TeamPage'
import ProjectsPage from './pages/ProjectsPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
