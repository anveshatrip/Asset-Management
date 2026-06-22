import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/dashboard/UserDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import TechnicianDashboard from './pages/dashboard/TechnicianDashboard';
import AuthDashboard from './pages/dashboard/AuthDashboard';
import CreateTask from './pages/tasks/CreateTask';
import TaskList from './pages/tasks/TaskList';
import TaskDetail from './pages/tasks/TaskDetail';
import AssetList from './pages/assets/AssetList';
import AddAsset from './pages/assets/AddAsset';

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User routes */}
            <Route path="/dashboard/user" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <UserDashboard />
              </ProtectedRoute>
            } />

            {/* Manager routes */}
            <Route path="/dashboard/manager" element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <ManagerDashboard />
              </ProtectedRoute>
            } />

            {/* Technician routes */}
            <Route path="/dashboard/technician" element={
              <ProtectedRoute allowedRoles={['TECHNICIAN']}>
                <TechnicianDashboard />
              </ProtectedRoute>
            } />

            {/* Auth routes */}
            <Route path="/dashboard/auth" element={
              <ProtectedRoute allowedRoles={['AUTH']}>
                <AuthDashboard />
              </ProtectedRoute>
            } />

            {/* Shared routes */}
            <Route path="/tasks" element={
              <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'TECHNICIAN']}>
                <TaskList />
              </ProtectedRoute>
            } />
            <Route path="/tasks/create" element={
              <ProtectedRoute allowedRoles={['USER']}>
                <CreateTask />
              </ProtectedRoute>
            } />
            <Route path="/tasks/:taskCode" element={
              <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'TECHNICIAN']}>
                <TaskDetail />
              </ProtectedRoute>
            } />
            <Route path="/assets" element={
              <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'TECHNICIAN']}>
                <AssetList />
              </ProtectedRoute>
            } />
            <Route path="/assets/add" element={
              <ProtectedRoute allowedRoles={['MANAGER']}>
                <AddAsset />
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  );
}

export default App;