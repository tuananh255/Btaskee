import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
        <main className="flex-1 pt-40 container mx-auto"><Outlet /></main>
      <Footer />
    </div>
  );
}