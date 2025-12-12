import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Workflows } from './pages/Workflows';
import { WorkflowEditor } from './pages/WorkflowEditor';
import { Teams } from './pages/Teams';
import { Engineers } from './pages/Engineers';
import { Settings } from './pages/Settings';
import { Runbooks } from './pages/Runbooks';
import { RunbookEditor } from './pages/RunbookEditor';
import { Projects } from './pages/Projects';
import { ProjectBoard } from './pages/ProjectBoard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workflows" element={<Layout><Workflows /></Layout>} />
          <Route path="/workflows/new" element={<WorkflowEditor />} />
          <Route path="/workflows/:id" element={<WorkflowEditor />} />
          <Route path="/teams" element={<Layout><Teams /></Layout>} />
          <Route path="/engineers" element={<Layout><Engineers /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
          <Route path="/runbooks" element={<Runbooks />} />
          <Route path="/runbooks/new" element={<RunbookEditor />} />
          <Route path="/runbooks/:id" element={<RunbookEditor />} />
          <Route path="/projects" element={<Layout><Projects /></Layout>} />
          <Route path="/projects/:id" element={<ProjectBoard />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
