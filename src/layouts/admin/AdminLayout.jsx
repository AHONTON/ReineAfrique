import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  return (
    <div className="admin-dashboard min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative transition-colors duration-300">
      {/* Pattern de fond subtil */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none z-0"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            rgba(251, 115, 22, 0.1) 20px,
            rgba(251, 115, 22, 0.1) 40px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 20px,
            rgba(154, 52, 18, 0.1) 20px,
            rgba(154, 52, 18, 0.1) 40px
          )`,
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
