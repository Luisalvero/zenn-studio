import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

// Self-hosted variable fonts (no external requests — good for speed & privacy).
import '@fontsource-variable/inter'
import '@fontsource-variable/manrope'
import './index.css'

import { App } from './App'
import { ContentProvider } from './lib/content'
import { ProjectsProvider } from './lib/projects-store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ContentProvider>
        <ProjectsProvider>
          <App />
        </ProjectsProvider>
      </ContentProvider>
    </BrowserRouter>
  </StrictMode>,
)
