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
  FileText,
  LogOut,
  LayoutDashboard,
  Map,
  Settings,
  X,
  ExternalLink
} from 'lucide-react';
import type { Page } from '@/types';

export default function PagesManager() {
  const navigate = useNavigate();
  const { pages, addPage, updatePage, deletePage } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [formData, setFormData] = useState<Partial<Page>>({
    title: '',
    slug: '',
    content: '',
    metaDescription: '',
    active: true,
  });

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenModal = (page?: Page) => {
    if (page) {
      setEditingPage(page);
      setFormData(page);
    } else {
      setEditingPage(null);
      setFormData({
        title: '',
        slug: '',
        content: '',
        metaDescription: '',
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPage) {
      updatePage(editingPage.id, formData);
    } else {
      addPage(formData as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту страницу?')) {
      deletePage(id);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  const insertHtmlTag = (tag: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content || '';
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    let insertion = '';
    switch (tag) {
      case 'h2':
        insertion = '<h2>Заголовок</h2>';
        break;
      case 'h3':
        insertion = '<h3>Подзаголовок</h3>';
        break;
      case 'p':
        insertion = '<p>Текст параграфа</p>';
        break;
      case 'ul':
        insertion = '<ul>\n  <li>Пункт 1</li>\n  <li>Пункт 2</li>\n  <li>Пункт 3</li>\n</ul>';
        break;
      case 'strong':
        insertion = '<strong>Жирный текст</strong>';
        break;
      case 'a':
        insertion = '<a href="/">Ссылка</a>';
        break;
    }
    
    const newContent = before + insertion + after;
    setFormData(prev => ({ ...prev, content: newContent }));
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertion.length, start + insertion.length);
    }, 0);
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
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#0066CC]/10 to-[#00D4AA]/10 text-[#0066CC] rounded-xl font-medium"
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
                  Страницы
                </h1>
                <p className="text-[#6B7280] mt-1">Управление статическими страницами</p>
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
              placeholder="Поиск страниц..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-[#0066CC] outline-none transition-colors"
            />
          </div>

          {/* Pages List */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280]">Название</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280]">URL</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#6B7280]">Статус</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B7280]">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredPages.map((page) => (
                  <tr key={page.id} className="border-t hover:bg-[#F8FAFC]">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#1A1A2E]">{page.title}</div>
                    </td>
                    <td className="px-6 py-4 text-[#6B7280]">
                      /page/{page.slug}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        page.active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {page.active ? 'Активна' : 'Неактивна'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/page/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center text-[#6B7280]"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleOpenModal(page)}
                          className="w-8 h-8 hover:bg-gray-100 rounded-lg flex items-center justify-center text-[#0066CC]"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id)}
                          className="w-8 h-8 hover:bg-red-50 rounded-lg flex items-center justify-center text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                  {editingPage ? 'Редактировать страницу' : 'Новая страница'}
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
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Название страницы *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          title,
                          slug: editingPage ? prev.slug : generateSlug(title)
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
                </div>

                {/* Meta Description */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Meta Description (SEO)
                  </label>
                  <input
                    type="text"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder="Краткое описание для поисковых систем"
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none"
                  />
                </div>

                {/* Content Editor */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Содержимое страницы *
                  </label>
                  
                  {/* Toolbar */}
                  <div className="flex flex-wrap gap-2 mb-2 p-2 bg-[#F8FAFC] rounded-lg">
                    <button
                      type="button"
                      onClick={() => insertHtmlTag('h2')}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHtmlTag('h3')}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHtmlTag('p')}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
                    >
                      Параграф
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHtmlTag('ul')}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
                    >
                      Список
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHtmlTag('strong')}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 font-bold"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => insertHtmlTag('a')}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 text-[#0066CC] underline"
                    >
                      Ссылка
                    </button>
                  </div>

                  <textarea
                    id="content"
                    required
                    rows={15}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="<h2>Заголовок</h2>\n<p>Текст страницы...</p>"
                    className="w-full px-4 py-2 border rounded-lg focus:border-[#0066CC] outline-none resize-none font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-[#6B7280]">
                    Используйте HTML-теги для форматирования. Доступны: h2, h3, p, ul/li, strong, a
                  </p>
                </div>

                {/* Preview */}
                {formData.content && (
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A2E] mb-2">
                      Предпросмотр
                    </label>
                    <div 
                      className="p-4 bg-[#F8FAFC] rounded-lg prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.content }}
                    />
                  </div>
                )}

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
                    {editingPage ? 'Сохранить' : 'Создать'}
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
