import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Pattern de fond subtil */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none z-0"
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
      <div className="lg:pl-64 relative z-10">
        <Header />
        <main className="p-4 sm:p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
