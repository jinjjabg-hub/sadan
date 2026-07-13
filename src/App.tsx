import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Heart, 
  BookOpen, 
  ShieldCheck, 
  Scale, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronLeft,
  AlertTriangle,
  Instagram, 
  Facebook, 
  Youtube,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Save,
  LogOut,
  LogIn,
  Upload
} from "lucide-react";
import { Post, SiteSettings } from "./types";
import { fetchPosts, createPost, updatePost, deletePost, fetchSettings, updateSettings, submitContact, fetchContacts, fetchDonations, deleteDonation, deleteContact } from "./services/api";
import DonationModal from "./components/DonationModal";
import NewsWriteModal from "./components/NewsWriteModal";

// --- Components ---

const Navbar = ({ activeTab, setActiveTab, isAdmin, setIsAdmin }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { id: 'home', label: '홈' },
    { id: 'about', label: '소개' },
    { id: 'services', label: '사업안내' },
    { id: 'news', label: '소식' },
    { id: 'donation', label: '후원하기' },
    { id: 'contact', label: '문의' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <Heart className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">사단법인 마음지키미</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeTab === item.id ? 'text-primary' : 'text-gray-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            {isAdmin ? (
              <button 
                onClick={() => setActiveTab('admin')}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Settings className="w-4 h-4" /> 관리자
              </button>
            ) : (
              <button 
                onClick={() => setIsAdmin(true)} // Simple toggle for demo
                className="text-gray-400 hover:text-gray-600"
              >
                <LogIn className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-4 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg"
                >
                  {item.label}
                </button>
              ))}
              {isAdmin && (
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-4 text-base font-medium text-primary hover:bg-pink-50 rounded-lg"
                >
                  관리자 대시보드
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onCtaClick, onAboutClick }: any) => (
  <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary bg-pink-50 rounded-full uppercase">
            사단법인 마음지키미
          </span>
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-8">
            당신의 소중한 마음,<br />
            <span className="text-primary">우리가 함께</span> 지킵니다.
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            선제적 예방, 그림책 심리상담, 생명존중 교육을 통해<br />
            모두가 행복한 세상을 만들어가는 따뜻한 동행입니다.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onCtaClick}
              className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-pink-200 flex items-center gap-2"
            >
              문의하기 <ChevronRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onAboutClick}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 transition-all cursor-pointer"
            >
              마음지키미 소개
            </button>
          </div>
        </motion.div>
      </div>
    </div>
    
    {/* Background Decorative Elements */}
    <div className="absolute top-0 right-0 w-1/2 h-full bg-pink-50/20 -z-0 rounded-l-[100px] hidden lg:block overflow-hidden">
      <svg className="w-full h-full object-cover opacity-90" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Turbulence filter for watercolor hand-painted outline bleeding */}
          <filter id="watercolor-texture">
            <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          
          <filter id="heavy-blur"><feGaussianBlur stdDeviation="15" /></filter>
          <filter id="medium-blur"><feGaussianBlur stdDeviation="7" /></filter>
          <filter id="soft-blur"><feGaussianBlur stdDeviation="3" /></filter>

          {/* Gradients */}
          <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA6B8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF719A" stopOpacity="0.63" />
          </linearGradient>
          <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FB923C" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="yellowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#818CF8" stopOpacity="0.45" />
          </linearGradient>

          {/* Core Heart Path */}
          <path id="heart-shape" d="M 0 -30 C -15 -55, -45 -55, -45 -25 C -45 5, -15 25, 0 50 C 15 25, 45 5, 45 -25 C 45 -55, 15 -55, 0 -30 Z" />
        </defs>

        {/* 5 Watercolor Hearts matching the user's uploaded watercolor pattern */}
        
        {/* Blue Heart (top-center, highly blurred) */}
        <g transform="translate(420, 110) scale(1.1) rotate(15)">
          <use href="#heart-shape" fill="url(#blueGrad)" filter="url(#heavy-blur)" />
          <use href="#heart-shape" fill="url(#blueGrad)" filter="url(#watercolor-texture)" opacity="0.6" />
        </g>

        {/* Yellow Heart (top-left, blurred) */}
        <g transform="translate(180, 130) scale(1.3) rotate(-35)">
          <use href="#heart-shape" fill="url(#yellowGrad)" filter="url(#medium-blur)" />
          <use href="#heart-shape" fill="url(#yellowGrad)" filter="url(#watercolor-texture)" opacity="0.7" />
        </g>

        {/* Orange Heart (upper-left, slightly blurred) */}
        <g transform="translate(300, 200) scale(1.4) rotate(-22)">
          <use href="#heart-shape" fill="url(#orangeGrad)" filter="url(#medium-blur)" />
          <use href="#heart-shape" fill="url(#orangeGrad)" filter="url(#watercolor-texture)" opacity="0.7" />
        </g>

        {/* Green Heart (mid-left, lightly blurred) */}
        <g transform="translate(240, 340) scale(1.6) rotate(-15)">
          <use href="#heart-shape" fill="url(#greenGrad)" filter="url(#soft-blur)" />
          <use href="#heart-shape" fill="url(#greenGrad)" filter="url(#watercolor-texture)" opacity="0.8" />
        </g>

        {/* Highlight Main Red/Pink Heart (bottom center, very crisp, largest) */}
        <g transform="translate(460, 440) scale(2.2) rotate(10)">
          <use href="#heart-shape" fill="url(#pinkGrad)" filter="url(#soft-blur)" opacity="0.5" />
          <use href="#heart-shape" fill="url(#pinkGrad)" filter="url(#watercolor-texture)" />
        </g>
      </svg>
    </div>
    <motion.div 
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 5, 0]
      }}
      transition={{ duration: 10, repeat: Infinity }}
      className="absolute top-40 right-20 w-96 h-96 bg-primary/2 rounded-full blur-3xl -z-0" 
    />
  </section>
);

const ServiceCard = ({ icon: Icon, title, description, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="p-8 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group"
  >
    <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
      <Icon className="text-primary w-7 h-7 group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const Services = () => (
  <section className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">주요 사업 안내</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">마음지키미는 생명의 소중함을 알리고 마음의 상처를 치유하기 위해 다양한 활동을 펼치고 있습니다.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ServiceCard 
          icon={ShieldCheck} 
          title="선제적 예방 및 생명존중" 
          description="위기 상황에 처한 분들을 위한 긴급 상담 및 생명 존중 예방 교육을 실시합니다."
          delay={0.1}
        />
        <ServiceCard 
          icon={BookOpen} 
          title="그림책심리상담" 
          description="그림책을 매개로 내면의 상처를 들여다보고 치유하는 전문 심리 상담입니다."
          delay={0.2}
        />
        <ServiceCard 
          icon={Heart} 
          title="불안예방" 
          description="일상 속 불안을 다스리고 심리적 안정감을 찾을 수 있도록 돕는 예방 프로그램입니다."
          delay={0.3}
        />
      </div>
    </div>
  </section>
);

const NewsSection = ({ posts, onViewAll }: { posts: Post[]; onViewAll: () => void }) => (
  <section className="py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">마음지키미 소식</h2>
          <p className="text-gray-600">마음지키미의 활동과 공지사항을 확인하세요.</p>
        </div>
        <button 
          onClick={onViewAll}
          className="text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
        >
          전체보기 <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.slice(0, 3).map((post, idx) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-gray-100">
              <img 
                src={getPostFirstImage(post.image_url, post.id)} 
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">{post.category}</span>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
            <p className="text-gray-600 line-clamp-2 mb-4">{post.content}</p>
            <span className="text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = ({ setActiveTab }: { setActiveTab: (tab: string) => void }) => (
  <footer className="bg-gray-900 text-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">사단법인 마음지키미</span>
          </div>
          <p className="text-gray-400 max-w-sm mb-8">
            사단법인 마음지키미는 생명존중 문화를 확산하고, 마음의 치유가 필요한 모든 분들과 함께합니다.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-6">바로가기</h4>
          <ul className="space-y-4 text-gray-400">
            <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('about'); }} className="hover:text-white transition-colors">협회소개</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('services'); }} className="hover:text-white transition-colors">사업안내</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('news'); }} className="hover:text-white transition-colors">공지사항</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('donation'); }} className="hover:text-white transition-colors">후원안내</a></li>
            <li className="pt-2 border-t border-gray-800"></li>
            <li><a href="https://www.nts.go.kr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">국세청</a></li>
            <li><a href="https://www.acrc.go.kr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">국민권익위원회</a></li>
            <li><a href="https://www.mohw.go.kr" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">주무관청(보건복지부)</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">고객센터</h4>
          <p className="text-gray-400 text-sm mb-2">대표번호: 051-711-2099</p>
          <p className="text-gray-400 text-sm mb-2">이메일: didava@naver.com</p>
          <p className="text-gray-400 text-sm mb-2">주소: 부산시 남구 평화로 47번길 75, 2층</p>
          <p className="text-gray-400 text-sm">상담시간: 평일 09:00 ~ 18:00</p>
        </div>
      </div>
      <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
        <p>© 2026 사단법인 마음지키미. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-gray-300">이용약관</a>
          <a href="#" className="hover:text-gray-300 font-bold">개인정보처리방침</a>
        </div>
      </div>
    </div>
  </footer>
);

const AdminDashboard = ({ posts, setPosts, settings, setSettings, onLogout, onOpenWriteModal, onOpenEditModal, onDeleteClick, isDevEnvironment }: any) => {
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [contacts, setContacts] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [activeAdminTab, setActiveAdminTab] = useState('posts');

  useEffect(() => {
    const loadContacts = async () => {
      const data = await fetchContacts();
      setContacts(data);
    };
    const loadDonations = async () => {
      const data = await fetchDonations();
      setDonations(data);
    };
    if (activeAdminTab === 'contacts') loadContacts();
    if (activeAdminTab === 'donations') loadDonations();
  }, [activeAdminTab]);

  const handleSaveSettings = async () => {
    await updateSettings(settings);
    setIsEditingSettings(false);
  };

  const handleDeleteContact = async (id: number) => {
    if (window.confirm("정말 이 문의 내역을 삭제하시겠습니까?")) {
      try {
        await deleteContact(id);
        setContacts(prev => prev.filter(c => c.id !== id));
      } catch (err: any) {
        alert("삭제에 실패했습니다: " + err.message);
      }
    }
  };

  const handleDeleteDonation = async (id: number) => {
    if (window.confirm("정말 이 후원 신청 내역을 삭제하시겠습니까?")) {
      try {
        await deleteDonation(id);
        setDonations(prev => prev.filter(d => d.id !== id));
      } catch (err: any) {
        alert("삭제에 실패했습니다: " + err.message);
      }
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveAdminTab('posts')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeAdminTab === 'posts' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            게시글 관리
          </button>
          <button 
            onClick={() => setActiveAdminTab('contacts')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeAdminTab === 'contacts' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            문의 내역
          </button>
          <button 
            onClick={() => setActiveAdminTab('donations')}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${activeAdminTab === 'donations' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            후원 신청 내역
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" /> 로그아웃
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-32">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" /> 사이트 설정
              </h2>
              <button 
                onClick={() => isEditingSettings ? handleSaveSettings() : setIsEditingSettings(true)}
                className="text-primary hover:underline font-medium"
              >
                {isEditingSettings ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">사이트 이름</label>
                {isEditingSettings ? (
                  <input 
                    type="text" 
                    value={settings.site_name} 
                    onChange={e => setSettings({...settings, site_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{settings.site_name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">이사장 사진</label>
                {isEditingSettings ? (
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      placeholder="이미지 URL"
                      value={settings.chairperson_image || ''} 
                      onChange={e => setSettings({...settings, chairperson_image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-200 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-2 pb-3">
                          <Upload className="w-5 h-5 mb-1 text-gray-400" />
                          <p className="text-xs text-gray-500 font-medium">사진 업로드 (클릭하여 파일 선택)</p>
                          <p className="text-[10px] text-gray-400">자동 고효율 압축 처리</p>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                const img = new Image();
                                img.src = reader.result as string;
                                img.onload = () => {
                                  const canvas = document.createElement('canvas');
                                  const MAX_WIDTH = 500;
                                  const MAX_HEIGHT = 750;
                                  let width = img.width;
                                  let height = img.height;
                                  
                                  if (width > height) {
                                    if (width > MAX_WIDTH) {
                                      height *= MAX_WIDTH / width;
                                      width = MAX_WIDTH;
                                    }
                                  } else {
                                    if (height > MAX_HEIGHT) {
                                      width *= MAX_HEIGHT / height;
                                      height = MAX_HEIGHT;
                                    }
                                  }
                                  
                                  canvas.width = width;
                                  canvas.height = height;
                                  const ctx = canvas.getContext('2d');
                                  ctx?.drawImage(img, 0, 0, width, height);
                                  
                                  const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
                                  setSettings({...settings, chairperson_image: compressedBase64});
                                };
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <img 
                      src={settings.chairperson_image || "/chairperson_portrait.svg"} 
                      alt="윤주은 이사장" 
                      className="w-12 h-12 object-cover rounded-full border border-gray-100 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-xs text-gray-400 truncate max-w-[150px]">
                      {settings.chairperson_image ? "사진 업로드됨" : "기본 이미지 사용 중"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {activeAdminTab === 'posts' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">게시글 관리</h2>
                {isDevEnvironment && (
                  <button 
                    onClick={onOpenWriteModal}
                    className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1 hover:bg-primary-dark transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> 새 글 작성
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {posts.map((post: Post) => (
                  <div key={post.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
                        <img src={getPostFirstImage(post.image_url, post.id)} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{post.title}</h4>
                        <p className="text-xs text-gray-400">{post.category} • {new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {isDevEnvironment ? (
                      <div className="flex gap-2">
                         <button 
                          onClick={() => onOpenEditModal(post)}
                          className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteClick(post)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">조회 전용</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeAdminTab === 'contacts' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6">문의 내역</h2>
              <div className="space-y-4">
                {contacts.length === 0 ? (
                  <p className="text-center py-12 text-gray-400">접수된 문의가 없습니다.</p>
                ) : (
                  contacts.map((contact: any) => (
                    <div key={contact.id} className="p-6 border border-gray-100 rounded-2xl bg-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{contact.name}</h4>
                          <p className="text-sm text-primary font-medium">{contact.phone}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-400">{new Date(contact.created_at).toLocaleString()}</span>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 whitespace-pre-wrap">{contact.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeAdminTab === 'donations' && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-6">후원 신청 내역</h2>
              <div className="space-y-4">
                {donations.length === 0 ? (
                  <p className="text-center py-12 text-gray-400">접수된 후원 신청 내역이 없습니다.</p>
                ) : (
                  donations.map((donation: any) => (
                    <div key={donation.id} className="p-6 border border-gray-100 rounded-[32px] bg-gray-50 shadow-sm">
                      <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{donation.name} 후원자님</h4>
                          <p className="text-sm font-semibold text-primary">{donation.phone} {donation.email ? `| ${donation.email}` : ''}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-gray-400">{new Date(donation.created_at).toLocaleString()}</span>
                          <button
                            onClick={() => handleDeleteDonation(donation.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-sm">
                        <div>
                          <span className="block text-xs font-bold text-gray-400">생년월일</span>
                          <span className="font-medium text-gray-700">{donation.birthdate}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-400">납부 금액</span>
                          <span className="font-bold text-primary">{donation.amount.toLocaleString()}원 / 월</span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-400">희망 출금일</span>
                          <span className="font-medium text-gray-700">매월 {donation.payment_day}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-400">은행명</span>
                          <span className="font-medium text-gray-700">{donation.bank_name}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-400">계좌번호</span>
                          <span className="font-mono font-medium text-gray-700">{donation.account_number}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-bold text-gray-400">예금주명</span>
                          <span className="font-medium text-gray-700">{donation.account_holder}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export function getPostFirstImage(imageUrl: string | undefined | null, postId: number): string {
  if (!imageUrl) return `https://picsum.photos/seed/post${postId}/400/300`;
  if (imageUrl.startsWith("[") && imageUrl.endsWith("]")) {
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    } catch (e) {
      // fallback
    }
  }
  return imageUrl;
}

export function getPostImages(imageUrl: string | undefined | null): string[] {
  if (!imageUrl) return [];
  if (imageUrl.startsWith("[") && imageUrl.endsWith("]")) {
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // fallback
    }
  }
  return imageUrl ? [imageUrl] : [];
}

export default function App() {
  const isDevEnvironment = true;
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [settings, setSettings] = useState<SiteSettings>({
    site_name: '사단법인 마음지키미',
    primary_color: '#EC4899',
    bg_color: '#FDFCFB'
  });
  const [loading, setLoading] = useState(true);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isNewsWriteModalOpen, setIsNewsWriteModalOpen] = useState(false);
  const [selectedNewsCategory, setSelectedNewsCategory] = useState('공지사항');
  const [newsSearchQuery, setNewsSearchQuery] = useState('');
  const [selectedPostDetail, setSelectedPostDetail] = useState<Post | null>(null);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  useEffect(() => {
    setActiveImgIdx(0);
  }, [selectedPostDetail]);

  useEffect(() => {
    const init = async () => {
      try {
        const [postsData, settingsData] = await Promise.all([
          fetchPosts(),
          fetchSettings()
        ]);
        setPosts(postsData);
        if (settingsData.site_name) setSettings(settingsData);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-stable-bg">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-12 h-12 bg-primary rounded-full flex items-center justify-center"
        >
          <Heart className="text-white w-6 h-6" />
        </motion.div>
      </div>
    );
  }

  const handleSavePost = async (postData: { id?: number; title: string; category: string; content: string; image_url: string }) => {
    if (postData.id) {
      await updatePost(postData.id, postData);
    } else {
      await createPost(postData);
    }
    
    try {
      const updatedPosts = await fetchPosts();
      setPosts(updatedPosts);

      if (selectedPostDetail && selectedPostDetail.id === postData.id) {
        setSelectedPostDetail({
          ...selectedPostDetail,
          title: postData.title,
          category: postData.category,
          content: postData.content,
          image_url: postData.image_url
        });
      }
    } catch (err) {
      console.error("Failed to refresh posts list after saving post:", err);
      // We don't rethrow because the save operation was already fully successful on the database!
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ '--color-primary': settings.primary_color } as any}>
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin} 
        setIsAdmin={setIsAdmin} 
      />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Hero 
                onCtaClick={() => setActiveTab('contact')} 
                onAboutClick={() => setActiveTab('about')}
              />
              <Services />
              <NewsSection posts={posts} onViewAll={() => setActiveTab('news')} />
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-32 pb-20 max-w-4xl mx-auto px-4"
            >
              <div className="p-6 sm:p-12 relative">
                <div className="relative z-10">
                  {/* Card Header */}
                  <div className="flex justify-between items-center mb-10 pb-4">
                    <span className="text-sm font-bold tracking-wider text-rose-400">사단법인 마음지키미</span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-gray-900 tracking-tight">인사말</h2>
                  </div>

                  {/* Two Column Layout (Portrait on Left, Text on Right) */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
                    {/* Left Column: Portrait */}
                    <div className="md:col-span-5 flex flex-col items-center">
                      <div className="w-full max-w-[280px] aspect-[2/3] rounded-[36px] overflow-hidden bg-white relative group shadow-md">
                        <img 
                          src={settings.chairperson_image || "/chairperson_portrait.svg"} 
                          alt="윤주은 이사장" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="mt-4 text-[13px] font-medium text-gray-500 tracking-wider font-serif">사단법인 마음지키미 초대 이사장</p>
                    </div>

                    {/* Right Column: Content Text */}
                    <div className="md:col-span-7 space-y-6 text-gray-700 leading-relaxed text-[15px] sm:text-[16px] font-sans">
                      <p className="font-semibold text-gray-900 text-lg">
                        사단법인 마음지키미의 첫 문을 여는 초대 이사장 윤주은입니다.
                      </p>
                      
                      <p>
                        지금 우리 사회는 겉으로는 화려해 보이지만, 내면은 말할 수 없는 고통과 생명 경시의 위기에 처해 있습니다. 저는 이러한 현실을 더 이상 지켜볼 수 없다는 절박함과 사명감으로, 뜻을 같이하는 여러분과 함께 이 자리에 섰습니다.
                      </p>
                      
                      <p className="pl-4 py-1 font-serif italic text-gray-800 border-l-4 border-rose-300">
                        마음지키미는 단순한 단체가 아닙니다. 우리는 <span className="font-bold text-rose-500">'선제적 예방으로 생명을 존중'</span>하는 가장 적극적인 실천가들의 연대입니다.
                      </p>
                      
                      <p>
                        <span className="font-semibold text-rose-600 px-1.5 py-0.5 rounded">1차 까봐(현실)</span>를 직시하고, <span className="font-semibold text-rose-600 px-1.5 py-0.5 rounded">2차 까봐(망상)</span>를 알아차리는 문화를 확산시켜, 수많은 이들이 생각의 감옥에서 벗어나 다시 숨 쉴 수 있도록 돕는 구명보트가 될 것입니다.
                      </p>
                      
                      <p>
                        초대 이사장으로서 저는 우리 법인의 4대 핵심가치를 굳건히 세우겠습니다.
                      </p>
                      
                      <p className="font-medium text-gray-800 p-4 rounded-2xl grid grid-cols-2 gap-3 text-sm">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />인식개선 (생각 전환)</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />회복 (내면 치유)</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />실천 (삶의 변화)</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-400" />책임 (사회적 연대)</span>
                      </p>
                      
                      <p>
                        여러분의 마음이 평온을 되찾고 건강하게 피어날 수 있도록, 마음지키미가 언제나 든든한 동행자가 되겠습니다.
                      </p>

                      {/* Signature */}
                      <div className="pt-6 text-right font-serif text-lg text-gray-900">
                        사단법인 마음지키미 이사장 <span className="font-extrabold tracking-widest text-xl ml-2">윤 주 은</span> 올림
                      </div>
                    </div>
                  </div>

                  {/* Card Divider */}
                  <div className="my-10" />

                  {/* Contact Info Footer Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-sm font-sans pt-8 border-t border-gray-200/50">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase mb-1">PHONE</span>
                      <span className="text-gray-700 font-medium text-xs sm:text-sm">010-4599-2064</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase mb-1">EMAIL</span>
                      <span className="text-gray-700 font-medium text-xs sm:text-sm break-all">didava@naver.com</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase mb-1">BLOG</span>
                      <a href="https://blog.naver.com/didava_school" target="_blank" rel="noopener noreferrer" className="text-gray-700 font-medium text-xs sm:text-sm hover:text-rose-500 hover:underline">didava_school</a>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase mb-1">INSTAGRAM</span>
                      <a href="https://instagram.com/didava_school" target="_blank" rel="noopener noreferrer" className="text-gray-700 font-medium text-xs sm:text-sm hover:text-rose-500 hover:underline">@didava_school</a>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-rose-400 tracking-wider uppercase mb-1">YOUTUBE</span>
                      <a href="https://www.youtube.com/@디다봐TV" target="_blank" rel="noopener noreferrer" className="text-gray-700 font-medium text-xs sm:text-sm hover:text-rose-500 hover:underline">@디다봐TV</a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Services />
              <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="text-primary" /> 그림책심리상담
                  </h3>
                  <p className="text-gray-600 mb-6">그림책은 아이들만을 위한 것이 아닙니다. 성인들에게도 그림책은 잊고 있던 순수함과 내면의 목소리를 들려주는 훌륭한 도구입니다.</p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 개인 심리 상담 프로그램</li>
                    <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 집단 상담 워크숍</li>
                    <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 그림책 테라피 전문가 과정</li>
                  </ul>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <ShieldCheck className="text-primary" /> 선제적 예방 및 생명존중
                  </h3>
                  <p className="text-gray-600 mb-6">생명은 그 자체로 존엄하며 보호받아야 할 가치가 있습니다. 우리는 다양한 계층을 대상으로 생명의 소중함을 일깨우는 교육을 제공합니다.</p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 청소년 선제적 예방 게이트키퍼 양성</li>
                    <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 생명존중 문화 확산 캠페인</li>
                    <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 위기 가정 지원 및 상담</li>
                  </ul>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Heart className="text-primary" /> 불안예방 프로그램
                  </h3>
                  <p className="text-gray-600 mb-6">현대인들이 겪는 다양한 불안과 스트레스를 예방하고 관리하여 마음의 근육을 튼튼하게 키워줍니다.</p>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 마음챙김 명상 클래스</li>
                    <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 스트레스 관리 워크숍</li>
                    <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 정서 조절 코칭</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'news' && (
            <motion.div
              key="news"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-32 pb-20 max-w-7xl mx-auto px-4"
            >
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-sm font-bold text-primary uppercase tracking-widest mb-3 block">마음지키미 뉴스룸</span>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                  마음지키미 소식
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  공지사항, 생생한 행사사진, 전문 강사활동 등 마음지키미의 다양한 활동 소식을 만나보세요.
                </p>
              </div>

              {/* Sub-tabs, Search, and Create actions */}
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-100 pb-8 mb-12">
                {/* Category Sub-tabs */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {['공지사항', '행사사진', '강사활동'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedNewsCategory(cat)}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer ${
                        selectedNewsCategory === cat
                          ? 'bg-primary text-white shadow-md shadow-pink-100'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Bar & Write Action Button */}
                <div className="flex gap-2 w-full md:w-auto flex-col sm:flex-row">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="소식 검색..."
                      value={newsSearchQuery}
                      onChange={(e) => setNewsSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-gray-800"
                    />
                    <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  {isDevEnvironment && (
                    <button
                      onClick={() => setIsNewsWriteModalOpen(true)}
                      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:bg-primary-dark transition-colors cursor-pointer shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      소식 올리기
                    </button>
                  )}
                </div>
              </div>

              {/* Posts Grid Layout */}
              {posts.filter(p => {
                const matchesCategory = p.category === selectedNewsCategory;
                const matchesSearch = p.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) || 
                                      p.content.toLowerCase().includes(newsSearchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
              }).length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200 p-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto text-gray-400 shadow-sm mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 00-2-2v3m2 3V10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">등록된 소식이 없습니다</h3>
                  <p className="text-gray-500 mb-6 max-w-sm mx-auto">선택하신 조건에 맞는 마음지키미 소식이 아직 등록되지 않았습니다. 따뜻한 이야기를 전해 주세요!</p>
                  {isDevEnvironment && (
                    <button
                      onClick={() => setIsNewsWriteModalOpen(true)}
                      className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm hover:bg-primary-dark transition-colors cursor-pointer inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      첫 소식 올리기
                    </button>
                  )}
                </div>
              ) : selectedNewsCategory === '행사사진' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.filter(p => {
                    const matchesCategory = p.category === selectedNewsCategory;
                    const matchesSearch = p.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) || 
                                          p.content.toLowerCase().includes(newsSearchQuery.toLowerCase());
                    return matchesCategory && matchesSearch;
                  }).map((post, idx) => {
                    const images = getPostImages(post.image_url);
                    return (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => setSelectedPostDetail(post)}
                        className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
                      >
                        {/* Top: Large Image Container */}
                        <div className="w-full aspect-[4/3] overflow-hidden bg-gray-50 relative">
                          <img 
                            src={getPostFirstImage(post.image_url, post.id)} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          {/* Multiple Images Indicator Badge */}
                          {images.length > 1 && (
                            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                              <span className="text-white">+ {images.length}장</span>
                            </div>
                          )}
                          {/* Elegant Category Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 text-[11px] font-extrabold rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm text-white bg-blue-600">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        {/* Bottom: Content Body */}
                        <div className="p-6 flex flex-col justify-between flex-grow">
                          <div>
                            <span className="text-xs text-gray-400 font-medium mb-1.5 block">
                              {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                              {post.content}
                            </p>
                          </div>
                          
                          <div className="pt-4 mt-4 border-t border-gray-50 flex justify-between items-center text-sm font-bold text-primary">
                            <span className="flex items-center gap-1 text-xs">
                              사진 보기
                              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                            </span>
                            
                            {isDevEnvironment && (
                              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={() => {
                                    setPostToEdit(post);
                                    setIsNewsWriteModalOpen(true);
                                  }}
                                  className="px-2.5 py-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  수정
                                </button>
                                <button
                                  onClick={() => {
                                    setPostToDelete(post);
                                  }}
                                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  삭제
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.filter(p => {
                    const matchesCategory = p.category === selectedNewsCategory;
                    const matchesSearch = p.title.toLowerCase().includes(newsSearchQuery.toLowerCase()) || 
                                          p.content.toLowerCase().includes(newsSearchQuery.toLowerCase());
                    return matchesCategory && matchesSearch;
                  }).map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setSelectedPostDetail(post)}
                      className="group bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 p-6 cursor-pointer hover:-translate-y-0.5"
                    >
                      {/* Left: Small Image Container */}
                      <div className="w-full md:w-56 h-40 md:h-28 flex-shrink-0 rounded-2xl overflow-hidden bg-gray-50 relative">
                        <img 
                          src={getPostFirstImage(post.image_url, post.id)} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {/* Elegant Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wider backdrop-blur-md shadow-sm text-white ${
                            post.category === '공지사항' 
                              ? 'bg-rose-500' 
                              : 'bg-blue-600' 
                          }`}>
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Right: Content Body */}
                      <div className="flex flex-col justify-between flex-grow py-0.5">
                        <div>
                          <span className="text-xs text-gray-400 font-medium mb-1 block">
                            {new Date(post.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                          <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                            {post.title}
                          </h3>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                            {post.content}
                          </p>
                        </div>
                        
                        <div className="pt-3 md:pt-0 flex justify-between items-center text-sm font-bold text-primary">
                          <span className="flex items-center gap-1 text-xs">
                            자세히 보기
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                          
                          {isDevEnvironment && (
                            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => {
                                  setPostToEdit(post);
                                  setIsNewsWriteModalOpen(true);
                                }}
                                className="px-3 py-1 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3" />
                                수정
                              </button>
                              <button
                                onClick={() => {
                                  setPostToDelete(post);
                                }}
                                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                                삭제
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'donation' && (
            <motion.div
              key="donation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="pt-32 pb-20 max-w-5xl mx-auto px-4"
            >
              <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">후원 안내</h1>
                <p className="text-gray-600">여러분의 소중한 후원이 한 생명을 살리는 큰 힘이 됩니다.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6">
                    <Heart className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">정기 후원</h3>
                  <p className="text-gray-600 mb-6">매달 일정 금액을 후원하여 마음지키미의 지속적인 활동을 지원합니다.</p>
                  <button 
                    onClick={() => setIsDonationModalOpen(true)}
                    className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
                  >
                    신청하기
                  </button>
                </div>
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                  <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6">
                    <Plus className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">일시 후원</h3>
                  <p className="text-gray-600 mb-6">원하시는 때에 자유롭게 후원하여 생명 존중 활동에 동참하실 수 있습니다.</p>
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="text-sm font-bold text-gray-400 uppercase mb-2">계좌 이체 안내</p>
                    <p className="text-gray-900 font-bold">국민은행 556602-01-582765</p>
                    <p className="text-gray-600 text-sm">(예금주: 사단법인 마음지키미)</p>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50 p-10 rounded-[40px] text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">후원금은 이렇게 사용됩니다</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="p-4">
                    <div className="text-3xl font-bold text-primary mb-2">40%</div>
                    <p className="text-gray-700 font-medium">위기 상담 및<br/>긴급 지원</p>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-primary mb-2">35%</div>
                    <p className="text-gray-700 font-medium">생명존중<br/>교육 프로그램</p>
                  </div>
                  <div className="p-4">
                    <div className="text-3xl font-bold text-primary mb-2">25%</div>
                    <p className="text-gray-700 font-medium">그림책 테라피<br/>교구 제작</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="pt-32 pb-20 max-w-4xl mx-auto px-4"
            >
              <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-xl">
                <h1 className="text-3xl font-bold mb-8 text-center">상담 및 문의</h1>
                <p className="text-center text-gray-600 mb-12">도움이 필요하신가요? 언제든 편하게 연락주세요.</p>
                <form className="space-y-6" onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const data = {
                    name: formData.get('name') as string,
                    phone: formData.get('phone') as string,
                    message: formData.get('message') as string,
                  };
                  try {
                    await submitContact(data);
                    alert("문의가 접수되었습니다. 곧 연락드리겠습니다.");
                    (e.target as HTMLFormElement).reset();
                  } catch (err) {
                    alert("문의 접수 중 오류가 발생했습니다.");
                  }
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">이름</label>
                      <input name="name" required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="성함을 입력해주세요" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">연락처</label>
                      <input name="phone" required type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="010-0000-0000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">문의 내용</label>
                    <textarea name="message" required rows={5} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20" placeholder="문의하실 내용을 상세히 적어주세요"></textarea>
                  </div>
                  <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-lg shadow-pink-100">
                    문의 보내기
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <motion.div
              key="admin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AdminDashboard 
                posts={posts} 
                setPosts={setPosts} 
                settings={settings} 
                setSettings={setSettings} 
                onLogout={() => {
                  setIsAdmin(false);
                  setActiveTab('home');
                }}
                onOpenWriteModal={() => {
                  setPostToEdit(null);
                  setIsNewsWriteModalOpen(true);
                }}
                onOpenEditModal={(post: Post) => {
                  setPostToEdit(post);
                  setIsNewsWriteModalOpen(true);
                }}
                onDeleteClick={setPostToDelete}
                isDevEnvironment={isDevEnvironment}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setActiveTab={setActiveTab} />
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
      
      <NewsWriteModal 
        isOpen={isNewsWriteModalOpen} 
        onClose={() => {
          setIsNewsWriteModalOpen(false);
          setPostToEdit(null);
        }} 
        postToEdit={postToEdit}
        onSave={handleSavePost} 
      />

      {/* Custom Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setPostToDelete(null)}
          />
          <div className="relative bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">게시글 삭제</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              정말로 <span className="font-semibold text-gray-700">"{postToDelete.title}"</span> 게시글을 삭제하시겠습니까?<br />
              삭제된 게시글은 다시 복구할 수 없습니다.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer text-sm"
              >
                취소
              </button>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await deletePost(postToDelete.id);
                    setPosts(posts.filter(p => p.id !== postToDelete.id));
                    if (selectedPostDetail && selectedPostDetail.id === postToDelete.id) {
                      setSelectedPostDetail(null);
                    }
                  } catch (err) {
                    console.error("Failed to delete post", err);
                  } finally {
                    setPostToDelete(null);
                  }
                }}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md cursor-pointer text-sm"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Lightbox Modal */}
      {selectedPostDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedPostDetail(null)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 flex-shrink-0">
              <span className="px-3.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                {selectedPostDetail.category}
              </span>
              <button 
                onClick={() => setSelectedPostDetail(null)}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-8 space-y-6 flex-grow">
              {(() => {
                const images = getPostImages(selectedPostDetail.image_url);
                if (images.length === 0) return null;
                const activeImg = images[activeImgIdx] || images[0];
                return (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-gray-50 border border-gray-100 group">
                      <img 
                        src={activeImg} 
                        alt={selectedPostDetail.title} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      
                      {images.length > 1 && (
                        <>
                          {/* Navigation Buttons */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImgIdx((prev) => (prev - 1 + images.length) % images.length);
                            }}
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/10"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImgIdx((prev) => (prev + 1) % images.length);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/10"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>

                          {/* Image Counter Badge */}
                          <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-bold text-white tracking-wider">
                            {activeImgIdx + 1} / {images.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Thumbnails list */}
                    {images.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none justify-center">
                        {images.map((img, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setActiveImgIdx(index)}
                            className={`w-14 h-10 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                              index === activeImgIdx ? 'border-primary scale-105 shadow-sm' : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                {selectedPostDetail.title}
              </h2>
              <p className="text-gray-400 text-sm">
                게시일자: {new Date(selectedPostDetail.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="text-gray-700 leading-relaxed text-base whitespace-pre-line border-t border-gray-50 pt-6">
                {selectedPostDetail.content}
              </div>
            </div>

            <div className="flex gap-3 px-8 py-5 border-t border-gray-100 bg-gray-50 flex-shrink-0">
              <button
                onClick={() => setSelectedPostDetail(null)}
                className="flex-grow py-3 px-4 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-center text-sm"
              >
                닫기
              </button>
              
              {isDevEnvironment && (
                <>
                  <button
                    onClick={() => {
                      setPostToEdit(selectedPostDetail);
                      setIsNewsWriteModalOpen(true);
                    }}
                    className="py-3 px-5 bg-pink-50 text-primary font-bold rounded-xl hover:bg-pink-100 transition-colors cursor-pointer text-center text-sm flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    수정
                  </button>

                  <button
                    onClick={() => {
                      setPostToDelete(selectedPostDetail);
                    }}
                    className="py-3 px-5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors cursor-pointer text-center text-sm flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
