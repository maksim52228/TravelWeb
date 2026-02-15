import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  Settings, 
  LogOut,
  Users,
  Star
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { excursions, pages } = useData();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const stats = [
    { 
      label: 'Экскурсий', 
      value: excursions.length, 
      icon: Map, 
      color: 'from-[#0066CC] to-[#0088FF]',
      active: excursions.filter(e => e.active).length 
    },
    { 
      label: 'Страниц', 
      value: pages.length, 
      icon: FileText, 
      color: 'from-[#00D4AA] to-[#00FFAA]',
      active: pages.filter(p => p.active).length 
    },
    { 
      label: 'Средний рейтинг', 
      value: (excursions.reduce((acc, e) => acc + e.rating, 0) / excursions.length).toFixed(1), 
      icon: Star, 
      color: 'from-[#FFB800] to-[#FFD700]',
      active: null 
    },
    { 
      label: 'Всего отзывов', 
      value: excursions.reduce((acc, e) => acc + e.reviews, 0).toLocaleString(), 
      icon: Users, 
      color: 'from-[#FF6B6B] to-[#FF8888]',
      active: null 
    },
  ];

  const menuItems = [
    { 
      label: 'Экскурсии', 
      description: 'Управление экскурсиями и турами',
      icon: Map, 
      href: '/admin/excursions',
      color: 'bg-blue-50 text-[#0066CC]'
    },
    { 
      label: 'Страницы', 
      description: 'Управление статическими страницами',
      icon: FileText, 
      href: '/admin/pages',
      color: 'bg-teal-50 text-[#00D4AA]'
    },
    { 
      label: 'Настройки', 
      description: 'Настройки сайта и контактов',
      icon: Settings, 
      href: '/admin/settings',
      color: 'bg-yellow-50 text-[#FFB800]'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50">
        <div className="p-6">
          <a href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0066CC] to-[#00D4AA] flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold font-['Montserrat']">
              Tour<span className="text-[#00D4AA]">Paradise</span>
            </span>
          </a>

          <nav className="space-y-2">
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0066CC]/10 to-[#00D4AA]/10 text-[#0066CC] rounded-xl font-medium"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Дашборд</span>
            </button>
            <button
              onClick={() => navigate('/admin/excursions')}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#6B7280] hover:bg-[#F8FAFC] rounded-xl font-medium transition-colors"
            >
              <Map className="w-5 h-5" />
              <span>Экскурсии</span>
            </button>
            <button
              onClick={() => navigate('/admin/pages')}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#6B7280] hover:bg-[#F8FAFC] rounded-xl font-medium transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Страницы</span>
            </button>
            <button
              onClick={() => navigate('/admin/settings')}
              className="w-full flex items-center gap-3 px-4 py-3 text-[#6B7280] hover:bg-[#F8FAFC] rounded-xl font-medium transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Настройки</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1A1A2E] font-['Montserrat']">
                Дашборд
              </h1>
              <p className="text-[#6B7280] mt-1">Обзор вашего сайта</p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-[#0066CC] rounded-lg font-medium hover:bg-[#F8FAFC] transition-colors border"
            >
              Открыть сайт →
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-[#1A1A2E] mb-1">{stat.value}</div>
                  <div className="text-[#6B7280] text-sm">{stat.label}</div>
                  {stat.active !== null && (
                    <div className="mt-2 text-xs text-[#00D4AA]">
                      {stat.active} активных
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-4 font-['Montserrat']">
            Быстрые действия
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={index}
                  onClick={() => navigate(item.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left"
                >
                  <div className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">{item.label}</h3>
                  <p className="text-[#6B7280] text-sm">{item.description}</p>
                </motion.button>
              );
            })}
          </div>

          {/* Recent Excursions */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4 font-['Montserrat']">
              Последние экскурсии
            </h2>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280]">Название</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280]">Цена</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280]">Рейтинг</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280]">Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {excursions.slice(0, 5).map((excursion) => (
                    <tr key={excursion.id} className="border-t">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={excursion.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-medium text-[#1A1A2E]">{excursion.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#6B7280]">
                        {excursion.price} {excursion.currency}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                          <span>{excursion.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          excursion.active 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {excursion.active ? 'Активна' : 'Неактивна'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
