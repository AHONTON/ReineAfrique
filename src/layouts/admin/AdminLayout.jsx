import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  return (
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative transition-colors duration-300">
      {/* Subtil overlay dégradé pour éviter effets de carreaux */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle at 10% 10%, rgba(249,115,22,0.03), transparent 20%), radial-gradient(circle at 90% 90%, rgba(34,197,94,0.02), transparent 25%)',
        }}
      />
      
      <Sidebar />
      <div className="lg:pl-64 w-full min-h-screen">
        <Header />
        <main className="p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
