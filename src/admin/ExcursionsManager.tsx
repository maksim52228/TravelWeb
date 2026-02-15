import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '@/context/DataContext';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Star,
  Map,
  LogOut,
  LayoutDashboard,
  FileText,
  Settings,
  X
} from 'lucide-react';
import type { Excursion } from '@/types';

const badgeColors = [
  { name: 'Красно-золотой', value: 'from-[#FF6B6B] to-[#FFB800]' },
  { name: 'Сине-бирюзовый', value: 'from-[#0066CC] to-[#00D4AA]' },
  { name: 'Золотой', value: 'from-[#FFB800] to-[#FFD700]' },
  { name: 'Бирюзово-синий', value: 'from-[#00D4AA] to-[#0066CC]' },
  { name: 'Сине-золотой', value: 'from-[#0066CC] to-[#FFB800]' },
];

export default function ExcursionsManager() {
  const navigate = useNavigate();
  const { excursions, addExcursion, updateExcursion, deleteExcursion } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExcursion, setEditingExcursion] = useState<Excursion | null>(null);
  const [formData, setFormData] = useState<Partial<Excursion>>({
    name: '',
    slug: '',
    image: '/hero-beach.jpg',
    gallery: [],
    rating: 5,
    reviews: 0,
    duration: '',
    groupSize: '',
    price: '',
    currency: '฿',
    badge: '',
    badgeColor: 'from-[#0066CC] to-[#00D4AA]',
    description: '',
    fullDescription: '',
    includes: [],
    excludes: [],
    schedule: [],
    active: true,
  });

  const filteredExcursions = excursions.filter(exc => 
    exc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (excursion?: Excursion) => {
    if (excursion) {
      setEditingExcursion(excursion);
      setFormData(excursion);
    } else {
      setEditingExcursion(null);
      setFormData({
        name: '',
        slug: '',
        image: '/hero-beach.jpg',
        gallery: [],
        rating: 5,
        reviews: 0,
        duration: '',
        groupSize: '',
        price: '',
        currency: '฿',
        badge: '',
        badgeColor: 'from-[#0066CC] to-[#00D4AA]',
        description: '',
        fullDescription: '',
        includes: [],
        excludes: [],
        schedule: [],
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExcursion(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExcursion) {
      updateExcursion(editingExcursion.id, formData);
    } else {
      addExcursion(formData as Omit<Excursion, 'id' | 'createdAt' | 'updatedAt'>);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту экскурсию?')) {
      deleteExcursion(id);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const addScheduleItem = () => {
    setFormData(prev => ({
      ...prev,
      schedule: [...(prev.schedule || []), { time: '', activity: '' }]
    }));
  };

  const updateScheduleItem = (index: number, field: 'time' | 'activity', value: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule?.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeScheduleItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      schedule: prev.schedule?.filter((_, i) => i !== index)
    }));
  };

  const addListItem = (field: 'includes' | 'excludes') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), '']
    }));
  };

  const updateListItem = (field: 'includes' | 'excludes', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (field: 'includes' | 'excludes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index)
    }));
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
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0066CC]/10 to-[#00D4AA]/10 text-[#0066CC] rounded-xl font-medium"
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
        <div className="max-w-6xl mx-auto">
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
                  Экскурсии
                </h1>
                <p className="text-[#6B7280] mt-1">Управление экскурсиями и турами</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#0066CC] to-[#00D4AA] text-white rounded-lg font-medium hover:shadow-lg transition-shadow"
            >
              <Plus className="w-5 h-5" />
              <span>Добавить</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Поиск экскурсий..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#0066CC] outline-none transition-colors"
            />
          </div>

          {/* Excursions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExcursions.map((excursion) => (
              <motion.div
                key={excursion.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={excursion.image}
                    alt={excursion.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 left-3 px-3 py-1 bg-gradient-to-r ${excursion.badgeColor} text-white text-xs font-bold rounded-full`}>
                    {excursion.badge}
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => handleOpenModal(excursion)}
                      className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-[#0066CC] hover:bg-white"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(excursion.id)}
                      className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-red-500 hover:bg-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1A1A2E] mb-2">{excursion.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-[#6B7280]">
                      <Star className="w-4 h-4 text-[#FFB800] fill-[#FFB800]" />
                      <span>{excursion.rating}</span>
                    </div>
                    <div className="font-bold text-[#0066CC]">
                      {excursion.price} {excursion.currency}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      excursion.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {excursion.active ? 'Активна' : 'Неактивна'}
                    </span>
                    <a
                      href={`/excursion/${excursion.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#0066CC] hover:underline"
                    >
                      Посмотреть →
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#1A1A2E] font-['Montserrat']">
                  {editingExcursion ? 'Редактировать экскурсию' : 'Новая экскурсия'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Название *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          name,
                          slug: editingExcursion ? prev.slug : generateSlug(name)
                        }));
                      }}
                      className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      URL (slug) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Цена *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        className="flex-1 px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                      />
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                      >
                        <option value="฿">฿ (THB)</option>
                        <option value="$">$ (USD)</option>
                        <option value="€">€ (EUR)</option>
                        <option value="₽">₽ (RUB)</option>
                      </select>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Длительность *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="например: 8 часов"
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                    />
                  </div>

                  {/* Group Size */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Размер группы *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="например: до 20"
                      value={formData.groupSize}
                      onChange={(e) => setFormData(prev => ({ ...prev, groupSize: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Бейдж
                    </label>
                    <input
                      type="text"
                      placeholder="например: Топ продаж"
                      value={formData.badge}
                      onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                    />
                  </div>

                  {/* Badge Color */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Цвет бейджа
                    </label>
                    <select
                      value={formData.badgeColor}
                      onChange={(e) => setFormData(prev => ({ ...prev, badgeColor: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                    >
                      {badgeColors.map(color => (
                        <option key={color.value} value={color.value}>{color.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Рейтинг
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                    />
                  </div>

                  {/* Reviews */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Количество отзывов
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.reviews}
                      onChange={(e) => setFormData(prev => ({ ...prev, reviews: parseInt(e.target.value) }))}
                      className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Изображение
                  </label>
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  >
                    <option value="/hero-beach.jpg">Пляж на закате</option>
                    <option value="/phi-phi.jpg">Пхи-Пхи</option>
                    <option value="/james-bond.jpg">Джеймс Бонд</option>
                    <option value="/similan.jpg">Симиланы</option>
                    <option value="/elephant.jpg">Слоновья ферма</option>
                    <option value="/diving.jpg">Дайвинг</option>
                    <option value="/wedding.jpg">Свадьба</option>
                    <option value="/yacht.jpg">Яхта</option>
                    <option value="/vip.jpg">VIP вилла</option>
                    <option value="/villa.jpg">Вилла</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Краткое описание *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none resize-none"
                  />
                </div>

                {/* Full Description */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Полное описание *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.fullDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none resize-none"
                  />
                </div>

                {/* Includes */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Что включено
                  </label>
                  <div className="space-y-2">
                    {formData.includes?.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateListItem('includes', index, e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem('includes', index)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addListItem('includes')}
                      className="text-sm text-[#0066CC] hover:underline"
                    >
                      + Добавить пункт
                    </button>
                  </div>
                </div>

                {/* Excludes */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Что не включено
                  </label>
                  <div className="space-y-2">
                    {formData.excludes?.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateListItem('excludes', index, e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeListItem('excludes', index)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addListItem('excludes')}
                      className="text-sm text-[#0066CC] hover:underline"
                    >
                      + Добавить пункт
                    </button>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Программа тура
                  </label>
                  <div className="space-y-2">
                    {formData.schedule?.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Время"
                          value={item.time}
                          onChange={(e) => updateScheduleItem(index, 'time', e.target.value)}
                          className="w-24 px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Активность"
                          value={item.activity}
                          onChange={(e) => updateScheduleItem(index, 'activity', e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeScheduleItem(index)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addScheduleItem}
                      className="text-sm text-[#0066CC] hover:underline"
                    >
                      + Добавить этап
                    </button>
                  </div>
                </div>

                {/* Active */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-5 h-5 text-[#0066CC] rounded focus:ring-[#0066CC]"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-[#1A1A2E]">
                    Активна (отображается на сайте)
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#0066CC] to-[#00D4AA] text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
                  >
                    {editingExcursion ? 'Сохранить' : 'Создать'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
