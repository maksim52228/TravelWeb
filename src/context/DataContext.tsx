import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Excursion, Page, SiteSettings } from '@/types';

interface DataContextType {
  excursions: Excursion[];
  pages: Page[];
  settings: SiteSettings;
  addExcursion: (excursion: Omit<Excursion, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExcursion: (id: string, excursion: Partial<Excursion>) => void;
  deleteExcursion: (id: string) => void;
  getExcursionBySlug: (slug: string) => Excursion | undefined;
  addPage: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePage: (id: string, page: Partial<Page>) => void;
  deletePage: (id: string) => void;
  getPageBySlug: (slug: string) => Page | undefined;
  updateSettings: (settings: Partial<SiteSettings>) => void;
}

const defaultExcursions: Excursion[] = [
  {
    id: '1',
    name: 'Остров Пхи-Пхи',
    slug: 'phi-phi',
    image: '/phi-phi.jpg',
    gallery: ['/phi-phi.jpg', '/similan.jpg'],
    rating: 4.9,
    reviews: 328,
    duration: '8 часов',
    groupSize: 'до 20',
    price: '2,500',
    currency: '฿',
    badge: 'Топ продаж',
    badgeColor: 'from-[#FF6B6B] to-[#FFB800]',
    description: 'Посетите знаменитые острова Пхи-Пхи с их кристально чистой водой и живописными скалами.',
    fullDescription: 'Острова Пхи-Пхи — это настоящий тропический рай в Андаманском море. Вы посетите знаменитый залив Майя, где снимался фильм "Пляж" с Леонардо ДиКаприо, поплаваете в кристально чистой воде среди тропических рыбок и насладитесь видами на знаменитые известняковые скалы.',
    includes: ['Трансфер из отеля', 'Обед на острове', 'Сноркелинг-экипировка', 'Русскоязычный гид', 'Страховка'],
    excludes: ['Напитки', 'Личные расходы', 'Чаевые'],
    schedule: [
      { time: '07:30', activity: 'Выезд из отеля' },
      { time: '09:00', activity: 'Отправление на скоростном катере' },
      { time: '10:30', activity: 'Остров Пхи-Пхи Ле — пляж Майя' },
      { time: '12:00', activity: 'Сноркелинг в бухте' },
      { time: '13:00', activity: 'Обед на острове' },
      { time: '15:00', activity: 'Остров Пхи-Пхи Дон — обезьяний пляж' },
      { time: '16:30', activity: 'Возвращение в порт' },
      { time: '18:00', activity: 'Прибытие в отель' },
    ],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Остров Джеймса Бонда',
    slug: 'james-bond',
    image: '/james-bond.jpg',
    gallery: ['/james-bond.jpg', '/hero-beach.jpg'],
    rating: 4.8,
    reviews: 256,
    duration: '6 часов',
    groupSize: 'до 15',
    price: '3,200',
    currency: '฿',
    badge: 'Популярное',
    badgeColor: 'from-[#0066CC] to-[#00D4AA]',
    description: 'Посетите знаменитый остров, где снимался фильм про Джеймса Бонда.',
    fullDescription: 'Остров Као Пхинг Кан, более известный как остров Джеймса Бонда, прославился после выхода фильма "Человек с золотым пистолетом". Вы увидите знаменитую скалу, вырастающую прямо из воды, покатаетесь на каноэ по морским пещерам и посетите плавучую деревню морских цыган.',
    includes: ['Трансфер из отеля', 'Обед', 'Каноэ', 'Русскоязычный гид', 'Страховка'],
    excludes: ['Напитки', 'Личные расходы'],
    schedule: [
      { time: '08:00', activity: 'Выезд из отеля' },
      { time: '09:30', activity: 'Прибытие в порт Ао Пханг Нга' },
      { time: '10:30', activity: 'Остров Джеймса Бонда' },
      { time: '12:00', activity: 'Каноэ по морским пещерам' },
      { time: '13:00', activity: 'Обед на плавучей ферме' },
      { time: '14:30', activity: 'Плавучая деревня Кох Паньяи' },
      { time: '16:00', activity: 'Возвращение в порт' },
      { time: '17:30', activity: 'Прибытие в отель' },
    ],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Симиланские острова',
    slug: 'similan',
    image: '/similan.jpg',
    gallery: ['/similan.jpg', '/diving.jpg'],
    rating: 5.0,
    reviews: 189,
    duration: '10 часов',
    groupSize: 'до 25',
    price: '4,500',
    currency: '฿',
    badge: 'VIP',
    badgeColor: 'from-[#FFB800] to-[#FF6B6B]',
    description: 'Рай для дайверов и любителей пляжного отдыха.',
    fullDescription: 'Симиланские острова — настоящий рай для любителей подводного мира. Этот архипелаг из 9 островов славится своими белоснежными пляжами, кристально чистой водой и богатейшей морской фауной. Вы увидите знаменитую гранитную глыбу "Парус", с которой открывается потрясающий вид.',
    includes: ['Трансфер из отеля', 'Завтрак и обед', 'Сноркелинг-экипировка', 'Русскоязычный гид', 'Страховка'],
    excludes: ['Напитки', 'Личные расходы', 'Прокат ласт'],
    schedule: [
      { time: '06:00', activity: 'Выезд из отеля' },
      { time: '08:00', activity: 'Завтрак в порту' },
      { time: '09:00', activity: 'Отправление на катере' },
      { time: '10:30', activity: 'Остров №8 — видовая площадка' },
      { time: '12:00', activity: 'Сноркелинг у острова №9' },
      { time: '13:00', activity: 'Обед на острове' },
      { time: '14:30', activity: 'Сноркелинг у острова №7' },
      { time: '15:30', activity: 'Отправление обратно' },
      { time: '17:00', activity: 'Прибытие в отель' },
    ],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Слоновья ферма',
    slug: 'elephant',
    image: '/elephant.jpg',
    gallery: ['/elephant.jpg', '/vip.jpg'],
    rating: 4.7,
    reviews: 412,
    duration: '4 часа',
    groupSize: 'до 10',
    price: '1,800',
    currency: '฿',
    badge: 'Семейное',
    badgeColor: 'from-[#00D4AA] to-[#0066CC]',
    description: 'Познакомьтесь со слонами в этичном санктуарии.',
    fullDescription: 'Посетите этичное слоновье санктуарии, где слоны живут в естественных условиях без цепей и крючьев. Вы накормите слонов фруктами, научитесь готовить для них витаминные шарики и понаблюдаете, как они купаются в реке.',
    includes: ['Трансфер из отеля', 'Кормление слонов', 'Обучение команде', 'Русскоязычный гид'],
    excludes: ['Напитки', 'Фотографии'],
    schedule: [
      { time: '09:00', activity: 'Выезд из отеля' },
      { time: '10:00', activity: 'Прибытие в санктуарий' },
      { time: '10:15', activity: 'Знакомство со слонами' },
      { time: '10:45', activity: 'Кормление слонов' },
      { time: '11:30', activity: 'Приготовление витаминных шариков' },
      { time: '12:00', activity: 'Купание слонов в реке' },
      { time: '13:00', activity: 'Обед' },
      { time: '14:00', activity: 'Возвращение в отель' },
    ],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Дайвинг-сафари',
    slug: 'diving',
    image: '/diving.jpg',
    gallery: ['/diving.jpg', '/yacht.jpg'],
    rating: 4.9,
    reviews: 156,
    duration: '6 часов',
    groupSize: 'до 8',
    price: '3,800',
    currency: '฿',
    badge: 'Приключение',
    badgeColor: 'from-[#0066CC] to-[#FFB800]',
    description: 'Погружение к коралловым рифам для новичков и опытных.',
    fullDescription: 'Откройте для себя удивительный подводный мир Андаманского моря. Наши опытные инструкторы проведут вас к лучшим дайвинг-сайтам у побережья Пхукета. Подходит как для начинающих, так и для опытных дайверов.',
    includes: ['Трансфер из отеля', '2 погружения', 'Всё оборудование', 'Инструктор', 'Обед', 'Страховка'],
    excludes: ['Сертификат PADI', 'Фото/видео под водой'],
    schedule: [
      { time: '07:30', activity: 'Выезд из отеля' },
      { time: '08:30', activity: 'Прибытие в дайв-центр' },
      { time: '09:00', activity: 'Инструктаж и подготовка' },
      { time: '10:00', activity: 'Первое погружение' },
      { time: '12:00', activity: 'Обед на борту' },
      { time: '13:30', activity: 'Второе погружение' },
      { time: '15:00', activity: 'Возвращение в порт' },
      { time: '16:00', activity: 'Прибытие в отель' },
    ],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Свадьба на пляже',
    slug: 'wedding',
    image: '/wedding.jpg',
    gallery: ['/wedding.jpg', '/villa.jpg'],
    rating: 5.0,
    reviews: 89,
    duration: '1 день',
    groupSize: 'индивид.',
    price: '45,000',
    currency: '฿',
    badge: 'Романтика',
    badgeColor: 'from-[#FF6B6B] to-[#FFB800]',
    description: 'Организация романтической свадебной церемонии.',
    fullDescription: 'Сделайте предложение или организуйте свадебную церемонию мечты на тропическом пляже Пхукета. Мы позаботимся обо всем: от цветочной арки и украшений до фотографа и банкета. Создайте воспоминания на всю жизнь!',
    includes: ['Организация церемонии', 'Цветочная арка', 'Фотосессия', 'Букет и бутоньерка', 'Шампанское', 'Торт'],
    excludes: ['Макияж и прическа', 'Трансфер', 'Видеосъемка'],
    schedule: [
      { time: '14:00', activity: 'Подготовка площадки' },
      { time: '16:00', activity: 'Начало церемонии' },
      { time: '16:30', activity: 'Обмен кольцами' },
      { time: '17:00', activity: 'Фотосессия на закате' },
      { time: '18:00', activity: 'Романтический ужин' },
    ],
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultPages: Page[] = [
  {
    id: '1',
    title: 'О нас',
    slug: 'about',
    content: '<h2>О компании Tour Paradise</h2><p>Мы — команда профессионалов, которая с 2014 года организует незабываемые путешествия на Пхукете. Наша миссия — показать вам самые красивые места Таиланда и сделать ваш отдых комфортным и беззаботным.</p><h3>Почему выбирают нас?</h3><ul><li>Официальная лицензия TAT</li><li>Русскоязычные гиды</li><li>Более 10 лет опыта</li><li>5000+ довольных клиентов</li></ul>',
    metaDescription: 'Tour Paradise — ваш проводник в мир тропического рая. Организуем экскурсии и VIP-отдых на Пхукете.',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Условия бронирования',
    slug: 'booking-terms',
    content: '<h2>Условия бронирования</h2><p>Бронирование экскурсий осуществляется за 24 часа до начала тура. Для бронирования необходимо внести предоплату в размере 50% от стоимости.</p><h3>Отмена бронирования</h3><p>Отмена за 48 часов — полный возврат. Отмена за 24 часа — возврат 50%. Отмена менее чем за 24 часа — предоплата не возвращается.</p>',
    metaDescription: 'Условия бронирования и отмены экскурсий на Пхукете.',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultSettings: SiteSettings = {
  siteName: 'Tour Paradise',
  phone: '+66 95 190 5999',
  whatsapp: '+66 95 190 5999',
  email: 'tour.tour.phuket@gmail.com',
  address: '46/23 Moo.9 T.Chalong, Phuket 83130',
  socialLinks: {
    instagram: 'https://instagram.com/tour_tour_phuket',
    telegram: 'https://t.me/tour_tour_phuket',
    whatsapp: 'https://wa.me/66951905999',
  },
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedExcursions = localStorage.getItem('tourparadise_excursions');
    const storedPages = localStorage.getItem('tourparadise_pages');
    const storedSettings = localStorage.getItem('tourparadise_settings');

    if (storedExcursions) {
      setExcursions(JSON.parse(storedExcursions));
    } else {
      setExcursions(defaultExcursions);
      localStorage.setItem('tourparadise_excursions', JSON.stringify(defaultExcursions));
    }

    if (storedPages) {
      setPages(JSON.parse(storedPages));
    } else {
      setPages(defaultPages);
      localStorage.setItem('tourparadise_pages', JSON.stringify(defaultPages));
    }

    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    } else {
      localStorage.setItem('tourparadise_settings', JSON.stringify(defaultSettings));
    }

    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tourparadise_excursions', JSON.stringify(excursions));
    }
  }, [excursions, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tourparadise_pages', JSON.stringify(pages));
    }
  }, [pages, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tourparadise_settings', JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  const addExcursion = (excursion: Omit<Excursion, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExcursion: Excursion = {
      ...excursion,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setExcursions((prev) => [...prev, newExcursion]);
  };

  const updateExcursion = (id: string, updates: Partial<Excursion>) => {
    setExcursions((prev) =>
      prev.map((exc) =>
        exc.id === id ? { ...exc, ...updates, updatedAt: new Date().toISOString() } : exc
      )
    );
  };

  const deleteExcursion = (id: string) => {
    setExcursions((prev) => prev.filter((exc) => exc.id !== id));
  };

  const getExcursionBySlug = (slug: string) => {
    return excursions.find((exc) => exc.slug === slug);
  };

  const addPage = (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPage: Page = {
      ...page,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPages((prev) => [...prev, newPage]);
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === id ? { ...page, ...updates, updatedAt: new Date().toISOString() } : page
      )
    );
  };

  const deletePage = (id: string) => {
    setPages((prev) => prev.filter((page) => page.id !== id));
  };

  const getPageBySlug = (slug: string) => {
    return pages.find((page) => page.slug === slug);
  };

  const updateSettings = (updates: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <DataContext.Provider
      value={{
        excursions,
        pages,
        settings,
        addExcursion,
        updateExcursion,
        deleteExcursion,
        getExcursionBySlug,
        addPage,
        updatePage,
        deletePage,
        getPageBySlug,
        updateSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
