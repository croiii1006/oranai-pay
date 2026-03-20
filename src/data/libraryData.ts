export interface LibraryItem {
  id: number;
  titleKey: string;
  type: 'video' | 'image' | 'audio' | 'template';
  publisher: string;
  publishDate: string;
  publishDateFull: string;
  videoTypeKey: string;
  purposeKey: string;
  audienceKey: string;
  aiAnalysisKey: string;
  videoUrl: string;
  duration?: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  tags: string[];
  thumbnail: string;
  category: string;
}

export interface VoiceItem {
  id: number;
  titleKey: string;
  publisher: string;
  duration: string;
  style: string;
  audioUrl: string;
  plays: number;
  likes: number;
  thumbnail: string;
}

export interface ModelItem {
  id: number;
  name: string;
  style: string;
  gender: string;
  ethnicity: string;
  thumbnail: string;
  downloads: number;
  likes: number;
}

export const mockVoiceItems: VoiceItem[] = [
  { id: 1, titleKey: 'library.voice.corporate', publisher: 'OranAI', duration: '0:30', style: 'Corporate', audioUrl: '#', plays: 12500, likes: 890, thumbnail: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400' },
  { id: 2, titleKey: 'library.voice.emotional', publisher: 'OranAI', duration: '0:45', style: 'Emotional', audioUrl: '#', plays: 8900, likes: 720, thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400' },
  { id: 3, titleKey: 'library.voice.energetic', publisher: 'OranAI', duration: '0:25', style: 'Energetic', audioUrl: '#', plays: 15600, likes: 1200, thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' },
  { id: 4, titleKey: 'library.voice.calm', publisher: 'OranAI', duration: '1:00', style: 'Calm', audioUrl: '#', plays: 6700, likes: 540, thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400' },
  { id: 5, titleKey: 'library.voice.cinematic', publisher: 'OranAI', duration: '0:50', style: 'Cinematic', audioUrl: '#', plays: 11200, likes: 980, thumbnail: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400' },
  { id: 6, titleKey: 'library.voice.upbeat', publisher: 'OranAI', duration: '0:35', style: 'Upbeat', audioUrl: '#', plays: 9400, likes: 810, thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400' },
  { id: 7, titleKey: 'library.voice.corporate', publisher: 'OranAI', duration: '0:40', style: 'Narration', audioUrl: '#', plays: 8200, likes: 640, thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400' },
  { id: 8, titleKey: 'library.voice.emotional', publisher: 'OranAI', duration: '0:55', style: 'Ambient', audioUrl: '#', plays: 10400, likes: 730, thumbnail: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400' },
];

export const mockModelItems: ModelItem[] = [
  { id: 1, name: 'Emma Chen', style: 'Fashion', gender: 'Female', ethnicity: 'Asian', thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', downloads: 8900, likes: 1200 },
  { id: 2, name: 'Marcus Johnson', style: 'Corporate', gender: 'Male', ethnicity: 'African', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', downloads: 6500, likes: 890 },
  { id: 3, name: 'Sofia Martinez', style: 'Lifestyle', gender: 'Female', ethnicity: 'Hispanic', thumbnail: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400', downloads: 12400, likes: 1580 },
  { id: 4, name: 'Alex Kim', style: 'Sports', gender: 'Male', ethnicity: 'Asian', thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', downloads: 7200, likes: 920 },
  { id: 5, name: 'Isabella Brown', style: 'Beauty', gender: 'Female', ethnicity: 'Caucasian', thumbnail: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', downloads: 15600, likes: 2100 },
  { id: 6, name: 'David Lee', style: 'Tech', gender: 'Male', ethnicity: 'Asian', thumbnail: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', downloads: 5400, likes: 680 },
  { id: 7, name: 'Lena Novak', style: 'Editorial', gender: 'Female', ethnicity: 'Eastern European', thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400', downloads: 8400, likes: 1320 },
  { id: 8, name: 'Noah Williams', style: 'Street', gender: 'Male', ethnicity: 'Mixed', thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&sig=2', downloads: 9100, likes: 1410 },
];

export const mockLibraryItems: LibraryItem[] = [
  {
    id: 1,
    titleKey: 'library.cocacola.title',
    type: 'video',
    publisher: 'Coca-Cola',
    publishDate: 'Nov 2024',
    publishDateFull: 'Nov 19, 2024',
    videoTypeKey: 'library.cocacola.type',
    purposeKey: 'library.cocacola.purpose',
    audienceKey: 'library.cocacola.audience',
    aiAnalysisKey: 'library.cocacola.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/BVCOGW.mp4',
    duration: '01:00',
    views: 2850000,
    likes: 48200,
    comments: 3150,
    shares: 12400,
    tags: ['Christmas', 'Holiday', 'AI', 'Animation'],
    thumbnail: 'https://img.youtube.com/vi/4RSTupbfGog/maxresdefault.jpg',
    category: 'food',
  },
  {
    id: 2,
    titleKey: 'library.mcdonalds.title',
    type: 'video',
    publisher: "McDonald's",
    publishDate: '2024',
    publishDateFull: '2024',
    videoTypeKey: 'library.mcdonalds.type',
    purposeKey: 'library.mcdonalds.purpose',
    audienceKey: 'library.mcdonalds.audience',
    aiAnalysisKey: 'library.mcdonalds.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/4ov76u.mp4',
    duration: '00:40',
    views: 1420000,
    likes: 25600,
    comments: 1820,
    shares: 6340,
    tags: ['Future', 'Tech', 'AI', 'Innovation'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 3,
    titleKey: 'library.nike.title',
    type: 'video',
    publisher: 'Audiovisual con IA',
    publishDate: 'Apr 2025',
    publishDateFull: 'Apr 28, 2025',
    videoTypeKey: 'library.nike.type',
    purposeKey: 'library.nike.purpose',
    audienceKey: 'library.nike.audience',
    aiAnalysisKey: 'library.nike.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/8XDY2f.mp4',
    duration: '00:30',
    views: 980000,
    likes: 18400,
    comments: 920,
    shares: 4100,
    tags: ['Nike', 'AI Sports', 'Slow Motion'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 4,
    titleKey: 'library.jeremyRazors.title',
    type: 'video',
    publisher: "Jeremy's Razors",
    publishDate: 'Feb 2025',
    publishDateFull: 'Feb 7, 2025',
    videoTypeKey: 'library.jeremyRazors.type',
    purposeKey: 'library.jeremyRazors.purpose',
    audienceKey: 'library.jeremyRazors.audience',
    aiAnalysisKey: 'library.jeremyRazors.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/IKqMZ0.mp4',
    duration: '00:35',
    views: 520000,
    likes: 12800,
    comments: 740,
    shares: 2900,
    tags: ['Razor', 'Metal', 'AI Render'],
    thumbnail: '',
    category: 'personal',
  },
  {
    id: 5,
    titleKey: 'library.zaraDor.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Aug 2024',
    publishDateFull: 'Aug 5, 2024',
    videoTypeKey: 'library.zaraDor.type',
    purposeKey: 'library.zaraDor.purpose',
    audienceKey: 'library.zaraDor.audience',
    aiAnalysisKey: 'library.zaraDor.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/NWfxHT.mp4',
    duration: '00:32',
    views: 610000,
    likes: 14300,
    comments: 820,
    shares: 3100,
    tags: ['Zara', 'Concept', 'AI Fashion'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 6,
    titleKey: 'library.hiamiHooch.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Jul 2024',
    publishDateFull: 'Jul 31, 2024',
    videoTypeKey: 'library.hiamiHooch.type',
    purposeKey: 'library.hiamiHooch.purpose',
    audienceKey: 'library.hiamiHooch.audience',
    aiAnalysisKey: 'library.hiamiHooch.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/4ABq2l.mp4',
    duration: '00:28',
    views: 455000,
    likes: 11200,
    comments: 580,
    shares: 2400,
    tags: ['Beverage', 'Concept', 'Liquid FX'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 7,
    titleKey: 'library.dorSoda.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Aug 2024',
    publishDateFull: 'Aug 15, 2024',
    videoTypeKey: 'library.dorSoda.type',
    purposeKey: 'library.dorSoda.purpose',
    audienceKey: 'library.dorSoda.audience',
    aiAnalysisKey: 'library.dorSoda.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/ENHpkU.mp4',
    duration: '00:33',
    views: 388000,
    likes: 9300,
    comments: 520,
    shares: 1800,
    tags: ['Soda', 'Concept', 'Motion'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 8,
    titleKey: 'library.roguePerfume.title',
    type: 'video',
    publisher: 'The Dor Brothers',
    publishDate: 'Jul 2024',
    publishDateFull: 'Jul 30, 2024',
    videoTypeKey: 'library.roguePerfume.type',
    purposeKey: 'library.roguePerfume.purpose',
    audienceKey: 'library.roguePerfume.audience',
    aiAnalysisKey: 'library.roguePerfume.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/adMqvZ.mp4',
    duration: '00:31',
    views: 442000,
    likes: 10100,
    comments: 610,
    shares: 2100,
    tags: ['Perfume', 'Luxury', 'Stylized'],
    thumbnail: '',
    category: 'fashion',
  },
  {
    id: 9,
    titleKey: 'library.kfcRemix.title',
    type: 'video',
    publisher: 'Krishna Pasi',
    publishDate: 'Apr 2025',
    publishDateFull: 'Apr 1, 2025',
    videoTypeKey: 'library.kfcRemix.type',
    purposeKey: 'library.kfcRemix.purpose',
    audienceKey: 'library.kfcRemix.audience',
    aiAnalysisKey: 'library.kfcRemix.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/m9IZpK.mp4',
    duration: '00:30',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    tags: ['KFC', 'Food', 'AI'],
    thumbnail: '',
    category: 'food',
  },
  {
    id: 10,
    titleKey: 'library.volvoLife.title',
    type: 'video',
    publisher: 'László Gaál',
    publishDate: 'Jul 2024',
    publishDateFull: 'Jul 4, 2024',
    videoTypeKey: 'library.volvoLife.type',
    purposeKey: 'library.volvoLife.purpose',
    audienceKey: 'library.volvoLife.audience',
    aiAnalysisKey: 'library.volvoLife.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/5aurPq.mp4',
    duration: '00:30',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    tags: ['Volvo', 'Auto', 'AI'],
    thumbnail: '',
    category: 'auto',
  },
  {
    id: 11,
    titleKey: 'library.adidasFloral.title',
    type: 'video',
    publisher: 'RabbitHole',
    publishDate: 'May 2025',
    publishDateFull: 'May 16, 2025',
    videoTypeKey: 'library.adidasFloral.type',
    purposeKey: 'library.adidasFloral.purpose',
    audienceKey: 'library.adidasFloral.audience',
    aiAnalysisKey: 'library.adidasFloral.aiAnalysis',
    videoUrl: 'https://photog.art/api/oss/HBj45Q.mp4',
    duration: '00:30',
    views: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    tags: ['Adidas', 'Fashion', 'AI'],
    thumbnail: '',
    category: 'fashion',
  },
];
