import { Route, Routes } from 'react-router-dom'
import { SvgDefs } from './components/SvgDefs'
import { Home } from './pages/Home'
import { NotesListPage } from './pages/NotesListPage'
import { NoteDetailPage } from './pages/NoteDetailPage'
import { AdminPage } from './pages/AdminPage'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <>
      <SvgDefs />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notas" element={<NotesListPage />} />
        <Route path="/notas/:slug" element={<NoteDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
