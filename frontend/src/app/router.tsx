import { createBrowserRouter } from 'react-router-dom';

import { AuthGuard } from './auth-guard';
import { AppShell } from '../components/layout/app-shell';
import { DashboardPage } from '../pages/dashboard-page';
import { JobApplicationsPage } from '../pages/job-applications-page';
import { JobApplicationDetailPage } from '../pages/job-application-detail-page';
import { LearningResourcesPage } from '../pages/learning-resources-page';
import { ProjectsPage } from '../pages/projects-page';
import { ProjectDetailPage } from '../pages/project-detail-page';
import { SubscriptionsPage } from '../pages/subscriptions-page';
import { NotesPage } from '../pages/notes-page';
import { SavedLinksPage } from '../pages/saved-links-page';
import { ProfilePage } from '../pages/profile-page';
import { SettingsPage } from '../pages/settings-page';
import { LoginPage } from '../pages/login-page';
import { RegisterPage } from '../pages/register-page';
import { NotFoundPage } from '../pages/not-found-page';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/job-applications', element: <JobApplicationsPage /> },
          { path: '/job-applications/:id', element: <JobApplicationDetailPage /> },
          { path: '/learning-resources', element: <LearningResourcesPage /> },
          { path: '/projects', element: <ProjectsPage /> },
          { path: '/projects/:id', element: <ProjectDetailPage /> },
          { path: '/subscriptions', element: <SubscriptionsPage /> },
          { path: '/notes', element: <NotesPage /> },
          { path: '/saved-links', element: <SavedLinksPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);
