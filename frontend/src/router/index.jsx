import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import PublicRoute from '@/components/common/PublicRoute';
import AdminLayout from '@/components/layout/AdminLayout';
import CandidateLayout from '@/components/layout/CandidateLayout';
import Layout from '@/components/layout/Layout';
import RecruiterLayout from '@/components/layout/RecruiterLayout';
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

// Lazy load pages
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const Jobs = lazy(() => import('@/pages/jobs/Jobs'));
const JobDetail = lazy(() => import('@/pages/jobs/JobDetail'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Blog = lazy(() => import('@/pages/Blog'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const About = lazy(() => import('@/pages/About'));
const FindCandidates = lazy(() => import('@/pages/FindCandidates'));
const CandidateProfile = lazy(() => import('@/pages/candidate/Profile'));
const CandidateDashboard = lazy(() => import('@/pages/candidate/Dashboard'));
const CandidateJobs = lazy(() => import('@/pages/candidate/Jobs'));
const CandidateApplications = lazy(() => import('@/pages/candidate/Applications'));
const CandidateInterviews = lazy(() => import('@/pages/candidate/Interviews'));

// Recruiter pages
const RecruiterDashboard = lazy(() => import('@/pages/recruiter/Dashboard'));
const RecruiterJobs = lazy(() => import('@/pages/recruiter/Jobs'));
const CreateJob = lazy(() => import('@/pages/recruiter/CreateJob'));
const EditJob = lazy(() => import('@/pages/recruiter/EditJob'));
const RecruiterCandidates = lazy(() => import('@/pages/recruiter/Candidates'));
const RecruiterApplications = lazy(() => import('@/pages/recruiter/Applications'));
const RecruiterInterviews = lazy(() => import('@/pages/recruiter/Interviews'));
const RecruiterMessages = lazy(() => import('@/pages/recruiter/Messages'));
const RecruiterSubscription = lazy(() => import('@/pages/recruiter/Subscription'));
const RecruiterAnalytics = lazy(() => import('@/pages/recruiter/Analytics'));
const RecruiterProfile = lazy(() => import('@/pages/recruiter/Profile'));
const RecruiterServicePlans = lazy(() => import('@/pages/recruiter/ServicePlans'));
const RecruiterPayments = lazy(() => import('@/pages/recruiter/Payments'));

// Admin pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const UsersManagement = lazy(() => import('@/pages/admin/UsersManagement'));
const JobsManagement = lazy(() => import('@/pages/admin/JobsManagement'));
const JobCategories = lazy(() => import('@/pages/admin/JobCategories'));
const ReportsManagement = lazy(() => import('@/pages/admin/ReportsManagement'));
const Payments = lazy(() => import('@/pages/admin/Payments'));
const ServicePlans = lazy(() => import('@/pages/admin/ServicePlans'));
const Subscriptions = lazy(() => import('@/pages/admin/Subscriptions'));
const EmailTemplates = lazy(() => import('@/pages/admin/EmailTemplates'));
const Notifications = lazy(() => import('@/pages/admin/Notifications'));
const Analytics = lazy(() => import('@/pages/admin/Analytics'));
const Maintenance = lazy(() => import('@/pages/admin/Maintenance'));
const Settings = lazy(() => import('@/pages/admin/Settings'));

const NotFound = lazy(() => import('@/pages/NotFound'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

// Special wrapper for auth components to preserve state
const AuthSuspenseWrapper = ({ children }) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner /></div>}>
    {children}
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <Home />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'jobs',
        element: (
          <SuspenseWrapper>
            <Jobs />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'jobs/:id',
        element: (
          <SuspenseWrapper>
            <JobDetail />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'terms',
        element: (
          <SuspenseWrapper>
            <Terms />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'privacy',
        element: (
          <SuspenseWrapper>
            <Privacy />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'blog',
        element: (
          <SuspenseWrapper>
            <Blog />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'blog/:id',
        element: (
          <SuspenseWrapper>
            <BlogDetail />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'about',
        element: (
          <SuspenseWrapper>
            <About />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'find-candidates',
        element: (
          <SuspenseWrapper>
            <FindCandidates />
          </SuspenseWrapper>
        ),
      },
      // Auth routes (public only) - No SuspenseWrapper to prevent state loss
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Login />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <Register />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'verify-email',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <VerifyEmail />
            </Suspense>
          </PublicRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <Suspense fallback={<LoadingSpinner />}>
              <ForgotPassword />
            </Suspense>
          </PublicRoute>
        ),
      },
      // Candidate routes (protected)
      {
        path: 'candidate',
        element: <ProtectedRoute allowedRoles={['candidate']} />,
        children: [
          {
            index: true,
            element: <Navigate to="/candidate/dashboard" replace />,
          },
          {
            path: '',
            element: <CandidateLayout />,
            children: [
              {
                path: 'dashboard',
                element: (
                  <SuspenseWrapper>
                    <CandidateDashboard />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'profile',
                element: (
                  <SuspenseWrapper>
                    <CandidateProfile />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'jobs',
                element: (
                  <SuspenseWrapper>
                    <CandidateJobs />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'applications',
                element: (
                  <SuspenseWrapper>
                    <CandidateApplications />
                  </SuspenseWrapper>
                ),
              },
              {
                path: 'interviews',
                element: (
                  <SuspenseWrapper>
                    <CandidateInterviews />
                  </SuspenseWrapper>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  // Recruiter routes (protected) - Separate layout
  {
    path: 'recruiter',
    element: <ProtectedRoute allowedRoles={['recruiter']} />,
    children: [
      {
        index: true,
        element: <Navigate to="/recruiter/dashboard" replace />,
      },
      {
        path: '',
        element: <RecruiterLayout />,
        children: [
          {
            path: 'dashboard',
            element: (
              <SuspenseWrapper>
                <RecruiterDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs',
            element: (
              <SuspenseWrapper>
                <RecruiterJobs />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs/create',
            element: (
              <SuspenseWrapper>
                <CreateJob />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs/:id/edit',
            element: (
              <SuspenseWrapper>
                <EditJob />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs/:id/edit',
            element: (
              <SuspenseWrapper>
                <EditJob />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'candidates',
            element: (
              <SuspenseWrapper>
                <RecruiterCandidates />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'applications',
            element: (
              <SuspenseWrapper>
                <RecruiterApplications />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'interviews',
            element: (
              <SuspenseWrapper>
                <RecruiterInterviews />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'messages',
            element: (
              <SuspenseWrapper>
                <RecruiterMessages />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'subscription',
            element: (
              <SuspenseWrapper>
                <RecruiterSubscription />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'analytics',
            element: (
              <SuspenseWrapper>
                <RecruiterAnalytics />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'profile',
            element: (
              <SuspenseWrapper>
                <RecruiterProfile />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'service-plans',
            element: (
              <SuspenseWrapper>
                <RecruiterServicePlans />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'payments',
            element: (
              <SuspenseWrapper>
                <RecruiterPayments />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  // Admin routes (protected) - Separate from main layout
  {
    path: 'admin',
    element: <ProtectedRoute allowedRoles={['admin']} />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: '',
        element: <AdminLayout />,
        children: [
          {
            path: 'dashboard',
            element: (
              <SuspenseWrapper>
                <AdminDashboard />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'users',
            element: (
              <SuspenseWrapper>
                <UsersManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'jobs',
            element: (
              <SuspenseWrapper>
                <JobsManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'job-categories',
            element: (
              <SuspenseWrapper>
                <JobCategories />
              </SuspenseWrapper>
            ),
          },
          
          {
            path: 'reports',
            element: (
              <SuspenseWrapper>
                <ReportsManagement />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'payments',
            element: (
              <SuspenseWrapper>
                <Payments />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'service-plans',
            element: (
              <SuspenseWrapper>
                <ServicePlans />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'subscriptions',
            element: (
              <SuspenseWrapper>
                <Subscriptions />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'email-templates',
            element: (
              <SuspenseWrapper>
                <EmailTemplates />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'notifications',
            element: (
              <SuspenseWrapper>
                <Notifications />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'analytics',
            element: (
              <SuspenseWrapper>
                <Analytics />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'maintenance',
            element: (
              <SuspenseWrapper>
                <Maintenance />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'settings',
            element: (
              <SuspenseWrapper>
                <Settings />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    ),
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
