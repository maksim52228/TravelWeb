import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { 
  ArrowLeft, 
  Save,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Send,
  MessageCircle,
  LogOut,
  LayoutDashboard,
  Map,
  FileText,
  Settings,
  CheckCircle
} from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useData();
  const [formData, setFormData] = useState(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

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
              className="w-full flex items-center gap-3 px-4 py-3 text-[#6B7280] hover:bg-[#F8FAFC] rounded-xl font-medium transition-colors"
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
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0066CC]/10 to-[#00D4AA]/10 text-[#0066CC] rounded-xl font-medium"
            >
              <Settings className="w-5 h-5" />
              <span>Настройки</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={() => navigate('/admin/login')}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="p-2 hover:bg-white rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[#6B7280]" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-[#1A1A2E] font-['Montserrat']">
                  Настройки
                </h1>
                <p className="text-[#6B7280] mt-1">Настройки сайта и контактной информации</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {isSaved && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Настройки сохранены успешно!</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-6 font-['Montserrat']">
                Основные настройки
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Название сайта
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-6 font-['Montserrat']">
                Контактная информация
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Телефон
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-6 font-['Montserrat']">
                Социальные сети
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    <Instagram className="w-4 h-4 inline mr-1" />
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, instagram: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    <Send className="w-4 h-4 inline mr-1" />
                    Telegram
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.telegram}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, telegram: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    <MessageCircle className="w-4 h-4 inline mr-1" />
                    WhatsApp Link
                  </label>
                  <input
                    type="url"
                    value={formData.socialLinks.whatsapp}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      socialLinks: { ...prev.socialLinks, whatsapp: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-[#0066CC] to-[#00D4AA] text-white rounded-xl font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Сохранить настройки</span>
            </motion.button>
          </form>

          {/* Admin Info */}
          <div className="mt-8 p-6 bg-yellow-50 rounded-2xl">
            <h3 className="font-bold text-yellow-800 mb-2">Данные для входа в админку</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <p><strong>Логин:</strong> admin</p>
              <p><strong>Пароль:</strong> admin123</p>
              <p className="text-xs mt-2 text-yellow-600">
                * В демо-режиме данные хранятся в localStorage браузера
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
