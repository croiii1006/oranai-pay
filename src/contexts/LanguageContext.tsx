import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { STORAGE_KEYS } from "@/lib/constants";
import { getLanguage as getStoredLanguage, setLanguage as setStoredLanguage } from "@/lib/utils/storage";

type Language = "en" | "zh";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.solution": "Solution",
    "nav.models": "Platform",
    "nav.products": "Products",
    "nav.pricing": "Pricing",
    "nav.library": "Inspiration",
    "nav.signIn": "Sign In",
    "nav.contactUs": "Contact Us",

    // Sidebar
    "sidebar.resources": "Resources",
    "sidebar.aboutUs": "About Us",
    "sidebar.blog": "Blog",
    "sidebar.careers": "Careers",
    "sidebar.docs": "Docs",
    "sidebar.privacy": "Privacy & Terms",

    // Hero
    "hero.title": "OranAI",
    "hero.subtitle": "AI for Integrated Marketing Intelligence",
    "hero.description":
      "From brand insight to global execution, powered by multimodal AI",
    "hero.exploreSolution": "Explore Solution",
    "hero.viewModels": "View Models",

    // Common
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.submit": "Submit",

    // Solution Page
    "solution.know": "KNOW",
    "solution.build": "BUILD",
    "solution.manage": "MANAGE",
    "solution.scale": "SCALE",
    "solution.yourBrand": "your brand",
    "solution.marketInsight": "Market Insight",
    "solution.consumerInsight": "Consumer Insight",
    "solution.healthInsight": "Health Insight",
    "solution.brandHealthMetrics": "Brand Health Metrics",
    "solution.industryTrends": "Industry Trends & Policy Watch",
    "solution.marketInsightDesc":
      "Monitors competitor moves and cultural shifts, using AI to analyze strategic positioning and uncover differentiated blue-ocean opportunities.",
    "solution.consumerInsightDesc":
      "Builds dynamic 3D user profiles, mines comment pain points, and applies psychological models to map motivations.",
    "solution.healthInsightDesc":
      "Tracks brand sentiment, public emotion, and word-of-mouth signals across platforms in real time to enable risk alerts, reputation management, and long-term brand health optimization.",
    "solution.brandHealthMetricsDesc":
      "Evaluates brand volume and user assets in real time across awareness, perception, and behavioral relationship dimensions.",
    "solution.industryTrendsDesc":
      "Combines macro data with NLP to forecast industry direction, subculture shifts, and compliance risks.",
    "solution.brandPositioningGen": "Brand Positioning Generation",
    "solution.contentEngine": "Content Generation Engine",
    "solution.socialOps": "Social & Community Ops",
    "solution.crmOps": "Private Domain & User Ops",
    "solution.brandPositioningGenDesc":
      "Surfaces brand DNA and emotional connection points, automatically deriving positioning plans with strong competitive advantages.",
    "solution.contentEngineDesc":
      "Produces multimodal marketing assets at scale, using standardized SOPs to rapidly localize content across languages.",
    "solution.socialOpsDesc":
      "Auto-adapts to major platform algorithms to respond to trends within minutes and intelligently match KOLs/KOCs.",
    "solution.crmOpsDesc":
      "Uses long-memory AI agents to deliver predictive marketing while governing and activating private-domain assets.",
    "solution.dataAssetMgmt": "Data Asset Management",
    "solution.sentimentMgmt": "Public Opinion Management",
    "solution.complianceMgmt": "Compliance Management",
    "solution.salesServiceMgmt": "Sales & Service Management",
    "solution.dataAssetMgmtDesc":
      "Automates cleaning, labeling, and access control across multi-source data to keep brand assets secure and compounding.",
    "solution.sentimentMgmtDesc":
      "Sets up always-on risk alerts and response playbooks, guiding sentiment positively to protect brand reputation.",
    "solution.complianceMgmtDesc":
      "Identifies legal and ethical risks upfront and uses automated checks to keep every business step compliant.",
    "solution.salesServiceMgmtDesc":
      "Powers sales conversion with a dynamic knowledge base and surfaces real customer pain points from service conversations.",
    "solution.geoSeoOpt": "GEO & SEO Optimization",
    "solution.localizationGrowth": "Content Localization & Global Growth",
    "solution.leadAdsOpt": "Lead Capture & Ad Optimization",
    "solution.trendForecast": "Trend & Revenue Forecasting",
    "solution.geoSeoOptDesc":
      "Improves indexing and authority in AI search engines through structured content and format optimization.",
    "solution.localizationGrowthDesc":
      "Optimizes multilingual messaging with native context, dynamically adjusts global pricing, and avoids cultural sensitivity pitfalls.",
    "solution.leadAdsOptDesc":
      "Automatically captures prospect profiles and iterates on ROI to configure ad delivery precisely.",
    "solution.trendForecastDesc":
      "Simulates volume lift and conversion after marketing spend, using data-driven projections to optimize ROI.",
    "solution.brandPositioning": "Brand Positioning",
    "solution.brandStory": "Brand Story",
    "solution.contentGeneration": "Content Generation",
    "solution.brandPositioningDesc":
      "Uses AI-driven insights and strategy models to clarify positioning, build differentiation, and keep brand messaging consistent worldwide.",
    "solution.brandStoryDesc":
      "Crafts narratives, emotional connections, and brand tone to turn brand value into compelling, resonant expressions.",
    "solution.contentGenerationDesc":
      "Scales copy, image, and video production with AI while keeping visual consistency and adapting content for multiple platforms and regions.",
    "solution.socialMedia": "Social Media",
    "solution.community": "Community",
    "solution.dam": "Digital Assets",
    "solution.sentiment": "Sentiment Analysis",
    "solution.compliance": "Compliance",
    "solution.customerService": "Customer Service",
    "solution.socialMediaDesc":
      "Manages multiple social platforms in one flow: scheduling, publishing, engagement, and performance tracking for efficient operations.",
    "solution.damDesc":
      "Stores brand content in a structured, smart-tagged, highly reusable way to build a durable digital asset library and boost team collaboration.",
    "solution.sentimentDesc":
      "Analyzes public opinion and emotional trends in real time, supporting proactive response, risk control, and strategic reputation management.",
    "solution.seo": "GEO / SEO",
    "solution.ads": "Ads",
    "solution.predictiveGrowth": "Predictive Growth",
    "solution.seoDesc":
      "Optimizes brand visibility in AI-driven search and recommendation systems, adapting to the shift from traditional search to AI-assisted decision-making.",
    "solution.adsDesc":
      "Runs AI-driven advertising with precise audience targeting, automated creative optimization, and ROI-led global delivery.",
    "solution.predictiveGrowthDesc":
      "Uses data-driven models for performance forecasting, scalable growth, and long-term optimization through continuous feedback loops.",
    "solution.knowDesc":
      "Do you still lack precise insight into real consumer needs and the competitive landscape?",
    "solution.buildDesc":
      "Are you facing insufficient high-quality content output, difficult cross-platform adaptation, and inefficient private-domain operations?",
    "solution.manageDesc":
      "Are you worried that brand data sits idle, crises erupt suddenly, and compliance risks slip out of control?",
    "solution.scaleDesc":
      "Are you stuck with global marketing that is hard to localize, inefficient ad delivery, and ROI you cannot predict accurately?",

    // Models Page
    "models.title": "PLATFORM",
    "models.filter": "Filter",
    "models.reset": "Reset",
    "models.nlp": "NLP",
    "models.multimodal": "Multimodal",
    "models.generation": "Generation",
    "models.vision": "Vision",
    "models.audio": "Audio",
    "models.enterprise": "Enterprise",
    "models.supplier": "Supplier",
    "models.allSuppliers": "All Suppliers",
    "models.billingType": "Billing Type",
    "models.allTypes": "All Types",
    "models.usageBilling": "Usage-based",
    "models.timesBilling": "Per-call",
    "models.endpointType": "Endpoint Type",
    "models.allEndpoints": "All Endpoints",
    "models.expand": "Show more",
    "models.collapse": "Collapse",
    "models.unknownSupplier": "Unknown",
    "models.loading": "Loading...",
    "models.loadingMore": "Loading...",
    "models.loadFailed": "Failed to load model data",
    "models.retry": "Retry",

    // Products Page
    "products.title": "PHOTOG",
    "products.headline": "Your Smartest AI-Marketing Team",
    "products.subheadline": "Always online, Always professional",
    "products.insight": "Insight",
    "products.strategy": "Strategy",
    "products.material": "Content",
    "products.operation": "Operation",
    "products.imageGen": "Image Generation",
    "products.videoGen": "Video Generation",
    "products.digitalHuman": "Digital Human",
    "products.requestDemo": "Request Demo",
    "products.geoMonitor": "GEO Monitor",
    "products.brandHealth": "Brand Health",
    "products.brandStrategy": "Brand Strategy",
    "products.chatPlaceholder": "Generate a Xiaohongshu post",
    "products.webSearch": "Web Search",
    "products.thinking": "Thinking",
    "products.redbook": "Xiaohongshu",
    "products.youtube": "Youtube",
    "products.tiktok": "TikTok",
    "products.amazon": "Amazon",
    "products.semrush": "Semrush",
    "products.b2bLead": "B2B Lead Generation",
    "products.comingSoon": "Coming Soon",
    "products.modelClaude": "Claude",
    "products.modelChatGPT": "ChatGPT",
    "products.modelDeepSeek": "DeepSeek",
    "products.modelGemini": "Gemini",
    "products.modelDoubao": "Doubao",

    // Library - labels
    "library.title": "AI INSPIRATION",
    "library.heroDesc": "AI inspiration from across the web, brought together in one place. Discover stunning videos, immersive soundscapes, and lifelike digital models — all powered by cutting-edge AI technology to accelerate your creative workflow.",
    "library.scrollToExplore": "Scroll to explore",
    "library.tab.video": "AI Video",
    "library.tab.voice": "AI Voice",
    "library.tab.model": "AI Model",
    "library.section.video": "Video",
    "library.section.voice": "Voice & Music",
    "library.section.model": "Digital Models",
    "library.voice.corporate": "Corporate Narrative",
    "library.voice.emotional": "Emotional Storytelling",
    "library.voice.energetic": "Energetic Beat",
    "library.voice.calm": "Calm Ambient",
    "library.voice.cinematic": "Cinematic Score",
    "library.voice.upbeat": "Upbeat Pop",
    "library.all": "All",
    "library.food": "Food & Beverage",
    "library.auto": "Automotive",
    "library.fashion": "Fashion & Beauty",
    "library.digital": "3C Digital",
    "library.finance": "Financial Services",
    "library.personal": "Personal Care",
    "library.culture": "Culture & Creative",
    "library.platform": "Platform Marketing",
    "library.diy": "Handmade DIY",
    "library.image": "Image",
    "library.video": "Video",
    "library.audio": "Audio",
    "library.template": "Template",
    "library.download": "Download",
    "library.replicate": "Replicate Viral",
    "library.videoType": "Type",
    "library.purpose": "Purpose",
    "library.audience": "Target Audience",
    "library.aiAnalysis": "AI Technology",
    "library.watchVideo": "Watch Video",
    "library.downloadVideo": "Download Video",
    "library.downloadAudio": "Download Audio",
    "library.duration": "Duration",
    "library.watchResource": "View Resource",
    "library.loading": "Loading...",
    "library.loadingMore": "Loading...",
    "library.loadFailed": "Failed to load, please try again later",
    "library.loadDetailFailed": "Failed to load details",
    "library.noData": "No data available",
    "library.publisher": "Publisher",
    "library.category": "Category",
    "library.publishTime": "Publish Time",
    "library.views": "Views",
    "library.likes": "Likes",
    "library.comments": "Comments",
    "library.shares": "Shares",
    "library.collects": "Collects",
    "library.unknown": "Unknown",
    "library.purposeLabel": "Purpose",
    "library.targetAudienceLabel": "Target Audience",
    "library.aiTechLabel": "AI Technology",
    "library.comingSoon": "Coming Soon",

    // Library items (EN)
    "library.cocacola.title": "Coca-Cola: The Holiday Magic is Coming",
    "library.cocacola.type": "Holiday emotional marketing",
    "library.cocacola.purpose":
      "Strengthen brand-holiday association, stimulate seasonal consumption",
    "library.cocacola.audience": "Family consumers, holiday gift buyers",
    "library.cocacola.aiAnalysis":
      "AI animation generation (e.g., Santa Claus dynamic design)",

    "library.mcdonalds.title": "McDonald's: A Taste of Tomorrow",
    "library.mcdonalds.type": "Futuristic tech ad",
    "library.mcdonalds.purpose":
      "Shape brand innovation image, attract digital generation",
    "library.mcdonalds.audience": "Tech enthusiasts, young fast-food consumers",
    "library.mcdonalds.aiAnalysis":
      "AI predictive generation (e.g., future restaurant scene simulation)",

    "library.nike.title": "Audiovisual con IA: Nike's AI-Powered Commercial",
    "library.nike.type": "AI sports dynamic ad",
    "library.nike.purpose":
      "Highlight product performance with AI motion capture detail",
    "library.nike.audience": "Athletes, fitness communities",
    "library.nike.aiAnalysis":
      "Motion trajectory AI analysis with slow-motion synthesis",

    "library.jeremyRazors.title": "Jeremy's Razors Commercial",
    "library.jeremyRazors.type": "AI razor brand creative ad",
    "library.jeremyRazors.purpose":
      "Highlight sharpness and comfort to attract male consumers",
    "library.jeremyRazors.audience":
      "Male consumers, personal-care marketers, AI commercial creators",
    "library.jeremyRazors.aiAnalysis":
      "Stable Diffusion or Blender metal polish; Adobe Firefly style lock",

    "library.zaraDor.title": "The Dor Brothers: Zara Concept Remix",
    "library.zaraDor.type": "Brand concept ad",
    "library.zaraDor.purpose":
      "Portfolio or AI ad experiment to attract brands/platforms",
    "library.zaraDor.audience": "Zara fans, AI video tech lovers, digital artists",
    "library.zaraDor.aiAnalysis":
      "Runway Gen-2 or Veo 3 plus Stable Diffusion style consistency",

    "library.hiamiHooch.title": "The Dor Brothers: Hiami Hooch",
    "library.hiamiHooch.type": "Fictional beverage concept ad",
    "library.hiamiHooch.purpose": "Test AI potential in beverage marketing",
    "library.hiamiHooch.audience":
      "Cocktail lovers, AIGC experimenters, beverage marketers",
    "library.hiamiHooch.aiAnalysis":
      "AI liquid simulation; 3D modeling and rendering; AI voiceover",

    "library.dorSoda.title": "The Dor Brothers: Soda Water Ad",
    "library.dorSoda.type": "AI-generated concept ad",
    "library.dorSoda.purpose":
      "Show AI video capability to attract brands and peers",
    "library.dorSoda.audience":
      "AI practitioners, digital marketers, soda water consumers",
    "library.dorSoda.aiAnalysis":
      "Midjourney/SD stills plus Runway animation; Veo 3 for consistency",

    "library.roguePerfume.title": "The Dor Brothers: Rogue Perfume",
    "library.roguePerfume.type": "AI perfume concept ad",
    "library.roguePerfume.purpose":
      "Show luxury fragrance aesthetics and attract brands",
    "library.roguePerfume.audience": "AI fans, marketers, perfume consumers",
    "library.roguePerfume.aiAnalysis":
      "Midjourney, Gen-3, Magnific AI, Veo 3 video generation",

    "library.kfcRemix.title": "Krishna Pasi: KFC Remix",
    "library.kfcRemix.type": "Food ad (UGC)",
    "library.kfcRemix.purpose":
      "Show how AI reshapes fast-food ads and personal creativity",
    "library.kfcRemix.audience":
      "KFC consumers, AI food creators, fast-food marketers",
    "library.kfcRemix.aiAnalysis":
      "Food rendering boost; multi-angle motion shots; AI voice clone",

    "library.volvoLife.title": 'Laszlo Gaal: Volvo "For Life"',
    "library.volvoLife.type": "Automotive concept ad",
    "library.volvoLife.purpose": "Explore AI storytelling for safety and future tech",
    "library.volvoLife.audience":
      "Volvo owners, car tech enthusiasts, AI video experimenters",
    "library.volvoLife.aiAnalysis":
      "Future city/weather simulation; vehicle tracking; AI narration",

    "library.adidasFloral.title": "RabbitHole: Adidas Floral",
    "library.adidasFloral.type": "AI sports-fashion ad",
    "library.adidasFloral.purpose":
      "Test AI creative use in floral sports visuals",
    "library.adidasFloral.audience":
      "Adidas fans, AI digital artists, apparel designers",
    "library.adidasFloral.aiAnalysis":
      "Style transfer fusion with dynamic lighting and shading",

    "library.chinguCafe.title": "RabbitHole: Chingu Cafe",
    "library.chinguCafe.type": "AI cafe brand concept ad",
    "library.chinguCafe.purpose":
      "Explore emotional storytelling for beverage marketing",
    "library.chinguCafe.audience":
      "Coffee lovers, K-culture fans, AI creative experimenters",
    "library.chinguCafe.aiAnalysis":
      "Face animation detail; coffee liquid and steam simulation",

    "library.invideoSpark.title": 'RabbitHole: InVideo "The Spark"',
    "library.invideoSpark.type": "AI creative concept ad",
    "library.invideoSpark.purpose":
      "Show InVideo visual expression in AI ad creation",
    "library.invideoSpark.audience":
      "AI ad creators, inspiration-focused viewers",
    "library.invideoSpark.aiAnalysis":
      "Topaz Gigapixel/Video AI; Pika Labs color and light grading",

    "library.netflixBite.title": 'RabbitHole: Netflix "The Sacred Bite"',
    "library.netflixBite.type": "AI streaming promo ad",
    "library.netflixBite.purpose":
      "Reinforce Netflix sensory experience with cross-scene creativity",
    "library.netflixBite.audience":
      "Netflix users, film lovers, streaming consumers, ad creatives",
    "library.netflixBite.aiAnalysis":
      "RunwayML grading; Midjourney scenes; Adobe suite; Topaz detail",

    "library.gotMilk.title": "Niccyan: Got Milk Remix",
    "library.gotMilk.type": "AI cookie brand concept ad",
    "library.gotMilk.purpose": "Reinforce healthy-essential brand perception",
    "library.gotMilk.audience":
      "Got Milk audience, families, dairy marketers, remix fans",
    "library.gotMilk.aiAnalysis":
      "Stable Diffusion or Adobe Firefly for refined visuals",

    "library.durex.title": "Haggar Shoval: Durex AI Spot",
    "library.durex.type": "AI product promotion",
    "library.durex.purpose":
      "Balance functional and emotional expression in sensitive category",
    "library.durex.audience":
      "Durex consumers, FMCG marketers, AI ad creators",
    "library.durex.aiAnalysis":
      "Midjourney/SD mood; Runway Gen-2 low-saturation style",

    "library.adidasBlue.title": "Billy Boman: Beyond The Blue (Adidas)",
    "library.adidasBlue.type": "AI sports concept ad",
    "library.adidasBlue.purpose":
      "Show AI creative potential for sports brand spirit",
    "library.adidasBlue.audience":
      "Adidas fans, sports brand marketers, AI ad creators, art lovers",
    "library.adidasBlue.aiAnalysis":
      "Midjourney + RunwayML + Topaz; still-to-motion workflow",

    "library.porscheDream.title": "Laszlo Gaal: Porsche Concept",
    "library.porscheDream.type": "AI luxury automotive ad",
    "library.porscheDream.purpose":
      "Show AI visual expression for high-end cars",
    "library.porscheDream.audience":
      "Porsche fans, luxury car lovers, auto marketers, AI creators",
    "library.porscheDream.aiAnalysis":
      "Veo2; SD + car LoRA; Adobe Firefly lighting",

    "library.lincoln.title": "Jeremy Haccoun: LINCOLN Concept",
    "library.lincoln.type": "AI luxury automotive ad",
    "library.lincoln.purpose": "Show design aesthetics and luxury attributes",
    "library.lincoln.audience":
      "Lincoln fans, premium buyers, auto marketers, AI ad creators",
    "library.lincoln.aiAnalysis":
      "Runway Gen-3 driving dynamics; SD/Blender refinement",

    "library.realThing.title": 'Anima Studios TV: Coca-Cola "The Real Thing"',
    "library.realThing.type": "AI carbonated drink concept ad",
    "library.realThing.purpose":
      "Blend classic theme with AI innovation to spark resonance",
    "library.realThing.audience":
      "Coca-Cola consumers, FMCG marketers, AI ad creators, classic fans",
    "library.realThing.aiAnalysis":
      "Runway Gen-3 dynamics; Canva/PS AI red tone control; Topaz detail",

    "library.flowerTea.title": 'Bi Yao: Flower Tea "Four Seasons Zen White"',
    "library.flowerTea.type": "AI cultural aesthetic ad",
    "library.flowerTea.purpose":
      "Promote tea culture with seasonal wellness concept",
    "library.flowerTea.audience": "Tea lovers, guofeng culture audience",
    "library.flowerTea.aiAnalysis":
      "AI guofeng rendering with TCM knowledge graph",

    "library.warmFurball.title": "Wang Tianwang: Warm Furball for Winter",
    "library.warmFurball.type": "Emotional marketing + product showcase",
    "library.warmFurball.purpose":
      "Use seasonal topic to boost views and stickiness",
    "library.warmFurball.audience":
      "DIY lovers, Gen Z consumers, AI enthusiasts",
    "library.warmFurball.aiAnalysis":
      "AI script generation (assumed); Veo 3 dynamic rendering/style",

    "library.lenovoYouth.title": "N_S600: Lenovo Youth Day Concept",
    "library.lenovoYouth.type": "Theme TVC-level AI ad",
    "library.lenovoYouth.purpose":
      "Iterate shots to attract AI and advertising attention",
    "library.lenovoYouth.audience":
      "Youth Day audience, Lenovo fans, AI/TVC creators, content makers",
    "library.lenovoYouth.aiAnalysis":
      "MJ/SD assets plus Runway motion; heavy shot selection; unified tone",

    "library.pocari.title": "Lu Qile: Pocari Sweat Remix",
    "library.pocari.type": "AI sports drink ad",
    "library.pocari.purpose":
      "Explore AI MV workflow and solve high-dynamic pain points",
    "library.pocari.audience":
      "Pocari fans, AI video creators, AIGC enthusiasts",
    "library.pocari.aiAnalysis":
      "Pseudo-TVC texture; AI music; workflow for consistency",

    "library.xiaomiBuds.title": "Hongri AIGC: Xiaomi Buds 5 Pro Remix",
    "library.xiaomiBuds.type": "AI earbud concept ad",
    "library.xiaomiBuds.purpose":
      "Explore AI commercial possibilities for earbuds",
    "library.xiaomiBuds.audience":
      "Xiaomi fans, AI ad creators, earbud enthusiasts, AIGC practitioners",
    "library.xiaomiBuds.aiAnalysis":
      "99% AI; fantasy scenes and poetic visuals; sound-theme imagery",

    "library.ysl.title": "Mashang AIGC: Saint Laurent Remix",
    "library.ysl.type": "AIGC artistic fashion ad",
    "library.ysl.purpose":
      "Attract fashion and AIGC audiences, grow influence",
    "library.ysl.audience":
      "Fashion lovers, Saint Laurent fans, AIGC enthusiasts",
    "library.ysl.aiAnalysis":
      "GAN/diffusion style transfer aligning brand style",

    "library.heytea.title": "Mashang AIGC: HeyTea Guava Grape Remix",
    "library.heytea.type": "AI milk-tea concept ad",
    "library.heytea.purpose":
      "Show beverage visuals and highlight key selling points",
    "library.heytea.audience":
      "HeyTea consumers, milk tea lovers, beverage marketers, AIGC creators",
    "library.heytea.aiAnalysis":
      "Fruit texture rendering; brand visual alignment; summer ambience",

    "library.guming.title": "Mashang AIGC: GuMing Milk Tea Remix",
    "library.guming.type": "AI guofeng milk tea concept ad",
    "library.guming.purpose":
      "Show beverage visuals with guofeng highlights",
    "library.guming.audience":
      "GuMing consumers, milk tea lovers, beverage marketers, AIGC creators",
    "library.guming.aiAnalysis":
      "Guofeng character and scene; detailed color/texture rendering",

    "library.taobao.title": 'Taobao: Maker Festival "Chat About the Future?"',
    "library.taobao.type": "AI interactive marketing ad",
    "library.taobao.purpose":
      "Promote Maker Festival tech vibe, attract young users",
    "library.taobao.audience":
      "Gen Z, tech geeks, ecommerce professionals",
    "library.taobao.aiAnalysis":
      "AI dialogue generation; virtual host/digital human (assumed)",

    "library.oreoCosmos.title": "Oreo: Cosmic Oreo",
    "library.oreoCosmos.type": "Sci-fi food ad",
    "library.oreoCosmos.purpose": "Space theme to attract kids and families",
    "library.oreoCosmos.audience": "Kids, sci-fi fans, short-video users",
    "library.oreoCosmos.aiAnalysis":
      "Space scene generation; zero-gravity floating display",

    "library.snickers.title": "Billy Boman: Snickers Remix",
    "library.snickers.type": "AI food concept ad",
    "library.snickers.purpose":
      "Show AI food ad creativity to attract brands",
    "library.snickers.audience":
      "Snickers consumers, snack marketers, AI ad creators, AIGC lovers",
    "library.snickers.aiAnalysis":
      "95% Veo 3, 5% Seedance; ElevenLabs; AE + Topaz upscaling",

    "library.felix.title": "Billy Boman: Felix Series Remix",
    "library.felix.type": "AI food concept ad",
    "library.felix.purpose": "Build portfolio to attract food brands",
    "library.felix.audience":
      "Felix consumers, food marketers, AI ad creators, AIGC fans",
    "library.felix.aiAnalysis":
      "OpenAI Sora 2; material detail rendering; dynamic scenes",

    "library.redbull.title": "Billy Boman: Red Bull Remix",
    "library.redbull.type": "AI energy drink ad",
    "library.redbull.purpose":
      "Show high-dynamic stylized beverage work to attract brands",
    "library.redbull.audience":
      "Red Bull consumers, extreme sports fans, FMCG marketers, AI creators",
    "library.redbull.aiAnalysis":
      "95% Flow by Google; 5% Seedance; AE color and transitions",

    "library.benefit.title": 'Billy Boman: Benefit "Bad Girl Bounce"',
    "library.benefit.type": "AI beauty booster ad",
    "library.benefit.purpose":
      "Show cosmetic visuals and highlight product",
    "library.benefit.audience":
      "Benefit users, beauty lovers, cosmetic marketers, AI ad creators",
    "library.benefit.aiAnalysis":
      "LumaLabsAI; texture rendering; makeup simulation; sweet style",

    "library.kalshi.title": "PJ Ace: Kalshi Ad",
    "library.kalshi.type": "AI finance/prediction platform ad",
    "library.kalshi.purpose": "Show platform advantages and attract new users",
    "library.kalshi.audience":
      "Investors, prediction platform users, finance marketers, AI creators",
    "library.kalshi.aiAnalysis":
      "Stable Diffusion LoRA trained on finance scenes for consistency",

    "library.im8.title": "PJ Ace: Beckham's IM8 Wellness Drink",
    "library.im8.type": "Health beverage commercial ad",
    "library.im8.purpose":
      "Promote IM8 and show AI visuals in co-branded marketing",
    "library.im8.audience":
      "Beckham fans, IM8 target audience, marketers, AI creators",
    "library.im8.aiAnalysis":
      "Possible digital human; MJ/SD scenes; Runway Gen-2 motion",

    "library.wistiaLenny.title":
      "Billy Woodward: Lenny's Big Delivery (Wistia)",
    "library.wistiaLenny.type": "AI narrative platform promo",
    "library.wistiaLenny.purpose":
      "Show Wistia capability and AI storytelling",
    "library.wistiaLenny.audience":
      "Marketers, content creators, fun ad lovers, AI storytellers",
    "library.wistiaLenny.aiAnalysis":
      "nano banana + Midjourney + Seedance + Kling 2.5 + Suno + ElevenLabs (mock)",

    "library.guerlain.title":
      'Guerlain: Bee Bottle "Born in 1853. Made for the future"',
    "library.guerlain.type": "AI + heritage luxury ad",
    "library.guerlain.purpose":
      "Blend heritage with AI to reinforce innovative luxury image",
    "library.guerlain.audience":
      "Luxury consumers, beauty collectors, AI art enthusiasts",
    "library.guerlain.aiAnalysis":
      "Material rendering (metal sheen); 3D + AI animation for bee path",

    "library.bosie.title": "bosie: THE ERA OF bosie",
    "library.bosie.type": "AI fashion brand ad",
    "library.bosie.purpose":
      "Fuse sci-fi and myth to shape bold, diverse brand image",
    "library.bosie.audience":
      "Young individualists, new-brand watchers, ad creatives, sci-fi/myth fans",
    "library.bosie.aiAnalysis":
      "Traditional creative + production; sci-fi sets with myth visual design",

    // Footer
    "footer.copyright": "粤ICP备 2024322593号 Copyright © 2025 OranAI. All rights reserved.",
    "footer.contactUs": "Contact us",
    "footer.phone": "Phone",

    // About Us Dialog
    "about.title": "About OranAI",
    "about.subtitle": "Pioneering the future of AI-powered marketing intelligence",
    "about.whoWeAre": "Who We Are",
    "about.whoWeAreDesc": "OranAI is a leading AI company focused on integrated marketing intelligence. We combine cutting-edge multimodal AI technology with deep marketing expertise to help brands understand their markets, build compelling narratives, and scale globally.",
    "about.mission": "Our Mission",
    "about.missionDesc": "To empower brands with AI-driven insights and tools that transform how they connect with consumers worldwide. We believe in making sophisticated marketing intelligence accessible to businesses of all sizes.",
    "about.values": "Our Values",
    "about.innovation": "Innovation",
    "about.innovationDesc": "Pushing boundaries with AI technology",
    "about.excellence": "Excellence",
    "about.excellenceDesc": "Delivering exceptional quality",
    "about.collaboration": "Collaboration",
    "about.collaborationDesc": "Building together with partners",
    "about.integrity": "Integrity",
    "about.integrityDesc": "Acting with honesty and transparency",
  },
  zh: {
    // Navigation
    "nav.solution": "解决方案",
    "nav.models": "开放平台",
    "nav.products": "产品",
    "nav.pricing": "定价",
    "nav.library": "灵感",
    "nav.signIn": "登录",
    "nav.contactUs": "联系我们",

    // Sidebar
    "sidebar.resources": "资源中心",
    "sidebar.aboutUs": "关于我们",
    "sidebar.blog": "博客",
    "sidebar.careers": "招贤纳士",
    "sidebar.docs": "文档",
    "sidebar.privacy": "隐私与条款",

    // Hero
    "hero.title": "OranAI",
    "hero.subtitle": "整合营销智能 AI",
    "hero.description": "从品牌洞察到全球执行，由多模态 AI 驱动",
    "hero.exploreSolution": "探索解决方案",
    "hero.viewModels": "查看模型",

    // Common
    "common.search": "搜索",
    "common.filter": "筛选",
    "common.all": "全部",
    "common.submit": "提交",

    // Solution Page
    "solution.know": "KNOW",
    "solution.build": "BUILD",
    "solution.manage": "MANAGE",
    "solution.scale": "SCALE",
    "solution.yourBrand": "your brand",
    "solution.marketInsight": "市场洞察",
    "solution.consumerInsight": "消费者洞察",
    "solution.healthInsight": "健康洞察",
    "solution.brandHealthMetrics": "品牌健康度指标体系",
    "solution.industryTrends": "行业趋势与政策监测",
    "solution.marketInsightDesc": "监控竞品动态与文化变迁，利用 AI 分析战略布局并寻找差异化蓝海机会。",
    "solution.consumerInsightDesc": "构建动态 3D 用户画像，深度挖掘评论区痛点并利用心理模型探索驱动力。",
    "solution.healthInsightDesc": "跨平台实时监测品牌舆情、公众情绪与口碑信号——实现风险预警、声誉管理与长期品牌健康优化。",
    "solution.brandHealthMetricsDesc": "从认知度、感知度及行为关系三大维度，实时评估品牌声量与用户资产。",
    "solution.industryTrendsDesc": "结合宏观数据与 NLP 技术，预判行业风向、亚文化变迁及合规风险预警。",
    "solution.brandPositioningGen": "品牌定位生成",
    "solution.contentEngine": "内容生成引擎",
    "solution.socialOps": "社媒与社群运营",
    "solution.crmOps": "私域与用户运营",
    "solution.brandPositioningGenDesc": "挖掘品牌基因与消费者情感联结点，自动推演具备强竞争优势的定位方案。",
    "solution.contentEngineDesc": "批量产出多模态营销素材，通过标准化 SOP 实现多语言内容的快速裂变。",
    "solution.socialOpsDesc": "自动适配主流平台算法风格，实现分钟级热点响应与 KOL/KOC 智能匹配。",
    "solution.crmOpsDesc": "利用具备长期记忆的 AI 客服实现预测性营销，深度治理并盘活私域资产。",
    "solution.dataAssetMgmt": "数据资产管理",
    "solution.sentimentMgmt": "舆情管理",
    "solution.complianceMgmt": "合规管理",
    "solution.salesServiceMgmt": "销售与客服管理",
    "solution.dataAssetMgmtDesc": "实现多源数据的自动化清洗、标注与鉴权，保障品牌数据资产的安全增值。",
    "solution.sentimentMgmtDesc": "建立全天候风险预警与应对策略，通过正面引导有效维护品牌声誉。",
    "solution.complianceMgmtDesc": "前置性识别法律与道德风险，通过自动化巡检确保各业务环节稳健运行。",
    "solution.salesServiceMgmtDesc": "通过动态知识库赋能销售转化，并从服务对话中反馈真实的客户痛点。",
    "solution.geoSeoOpt": "GEO & SEO 优化",
    "solution.localizationGrowth": "内容本土化与全球化增长",
    "solution.leadAdsOpt": "线索抓取与广告投放优化",
    "solution.trendForecast": "趋势与收益预测",
    "solution.geoSeoOptDesc": "通过内容结构化与格式优化，提升品牌在 AI 搜索引擎中的收录与权重。",
    "solution.localizationGrowthDesc": "结合地道语境优化多语种表达，动态调整全球定价策略并规避文化敏感点。",
    "solution.leadAdsOptDesc": "自动化获取潜客画像，并通过 ROI 动态迭代实现广告投放的精准配置。",
    "solution.trendForecastDesc": "模拟营销投入后的声量增幅与转化效果，通过数据推演优化投资回报率。",
    "solution.brandPositioning": "品牌定位",
    "solution.brandStory": "品牌故事",
    "solution.contentGeneration": "内容生成",
    "solution.brandPositioningDesc": "运用 AI 驱动的洞察与策略模型，帮助品牌明确定位、构建差异化优势，并在全球市场保持一致的品牌信息传达。",
    "solution.brandStoryDesc": "通过叙事构建、情感连接与品牌调性塑造，将品牌价值转化为引人入胜、深入人心的品牌表达。",
    "solution.contentGenerationDesc": "基于 AI 实现文案、图片与视频的规模化生产，同时保持视觉一致性，并灵活适配多平台与多区域的内容需求。",
    "solution.socialMedia": "社交媒体",
    "solution.community": "社区管理",
    "solution.dam": "数字资产",
    "solution.sentiment": "舆情分析",
    "solution.compliance": "合规管理",
    "solution.customerService": "客户服务",
    "solution.socialMediaDesc": "统一管理多个社交媒体平台——涵盖内容排期、发布管理、互动响应与效果追踪，实现一站式高效运营。",
    "solution.damDesc": "将品牌内容结构化存储、智能标签化并高效复用，打造可持续沉淀的数字资产库，提升团队协作效率。",
    "solution.sentimentDesc": "通过 AI 实时分析公众舆论与情绪趋势，支持主动响应、风险管控与品牌声誉管理。",
    "solution.seo": "GEO / SEO",
    "solution.ads": "广告",
    "solution.predictiveGrowth": "预测增长",
    "solution.seoDesc": "优化品牌在 AI 驱动的搜索与推荐系统中的可见度——适应从传统搜索向 AI 辅助决策的转型趋势。",
    "solution.adsDesc": "以 AI 驱动智能广告投放——精准人群定向、创意自动优化、ROI 导向的全球化投放策略。",
    "solution.predictiveGrowthDesc": "基于数据驱动的模型实现业绩预测、可规模化增长与长期优化，通过持续反馈闭环驱动业务成长。",
    "solution.knowDesc": "您是否仍对消费者真实需求、市场竞争格局缺乏精准洞察？",
    "solution.buildDesc": "您是否面临优质内容产能不足、跨平台适配难、私域运营低效的困境？",
    "solution.manageDesc": "您是否担忧品牌数据资产沉睡、舆情危机突发、合规风险失控？",
    "solution.scaleDesc": "您是否困扰于全球营销本土化难、广告投放低效、ROI 无法精准预测？",

    // Models Page
    "models.title": "模型",
    "models.filter": "筛选",
    "models.reset": "重置",
    "models.nlp": "自然语言",
    "models.multimodal": "多模态",
    "models.generation": "生成",
    "models.vision": "视觉",
    "models.audio": "音频",
    "models.enterprise": "企业级",
    "models.supplier": "供应商",
    "models.allSuppliers": "全部供应商",
    "models.billingType": "计费类型",
    "models.allTypes": "全部类型",
    "models.usageBilling": "按量计费",
    "models.timesBilling": "按次计费",
    "models.endpointType": "端点类型",
    "models.allEndpoints": "全部端点",
    "models.expand": "展开更多",
    "models.collapse": "收起",
    "models.unknownSupplier": "未知供应商",
    "models.loading": "加载中...",
    "models.loadingMore": "加载中...",
    "models.loadFailed": "加载模型数据失败",
    "models.retry": "重试",

    // Products Page
    "products.title": "PHOTOG",
    "products.headline": "你最聪明的 AI 营销团队",
    "products.subheadline": "全天在线，始终专业",
    "products.insight": "洞察",
    "products.strategy": "策略",
    "products.material": "素材",
    "products.operation": "运营",
    "products.imageGen": "图片生成",
    "products.videoGen": "视频生成",
    "products.digitalHuman": "数字人",
    "products.requestDemo": "申请演示",
    "products.geoMonitor": "GEO 监控平台",
    "products.brandHealth": "品牌健康度",
    "products.brandStrategy": "品牌策略",
    "products.chatPlaceholder": "生成一个小红书帖子",
    "products.webSearch": "联网搜索",
    "products.thinking": "深度思考",
    "products.redbook": "小红书",
    "products.youtube": "Youtube",
    "products.tiktok": "TikTok",
    "products.amazon": "Amazon",
    "products.semrush": "Semrush",
    "products.b2bLead": "B2B线索获客",
    "products.comingSoon": "即将上线",
    "products.modelClaude": "Claude",
    "products.modelChatGPT": "ChatGPT",
    "products.modelDeepSeek": "DeepSeek",
    "products.modelGemini": "Gemini",
    "products.modelDoubao": "豆包",

    // Library - labels
    "library.title": "AI 灵感中心",
    "library.heroDesc": "来自全网的 AI 灵感在这里汇聚。探索令人惊艳的视频、沉浸式音效和逼真的数字模特——全部由尖端 AI 技术驱动，加速您的创意工作流程。",
    "library.scrollToExplore": "向下滚动探索",
    "library.tab.video": "AI 视频",
    "library.tab.voice": "AI 语音",
    "library.tab.model": "AI 模特",
    "library.section.video": "视频",
    "library.section.voice": "语音 & 音乐",
    "library.section.model": "数字模特",
    "library.voice.corporate": "企业叙事",
    "library.voice.emotional": "情感故事",
    "library.voice.energetic": "动感节拍",
    "library.voice.calm": "平静氛围",
    "library.voice.cinematic": "电影配乐",
    "library.voice.upbeat": "欢快流行",
    "library.all": "全部",
    "library.food": "食品饮料",
    "library.auto": "汽车交通",
    "library.fashion": "时尚美妆",
    "library.digital": "3C 数码",
    "library.finance": "金融服务",
    "library.personal": "个人护理",
    "library.culture": "文化创意",
    "library.platform": "平台推广",
    "library.diy": "手工 DIY",
    "library.image": "图片",
    "library.video": "视频",
    "library.audio": "音频",
    "library.template": "模板",
    "library.download": "下载",
    "library.replicate": "复制爆款",
    "library.videoType": "类型",
    "library.purpose": "发布目的",
    "library.audience": "目标受众",
    "library.aiAnalysis": "AI 技术点",
    "library.watchVideo": "观看视频",
    "library.downloadVideo": "下载视频",
    "library.downloadAudio": "下载音频",
    "library.duration": "时长",
    "library.watchResource": "查看资源",
    "library.loading": "加载中...",
    "library.loadingMore": "加载中...",
    "library.loadFailed": "加载失败，请稍后重试",
    "library.loadDetailFailed": "加载详情失败",
    "library.noData": "暂无数据",
    "library.publisher": "发布方",
    "library.category": "业务类型",
    "library.publishTime": "发布时间",
    "library.views": "浏览",
    "library.likes": "点赞",
    "library.comments": "评论",
    "library.shares": "分享",
    "library.collects": "收藏",
    "library.unknown": "未知",
    "library.purposeLabel": "发布目的",
    "library.targetAudienceLabel": "目标人群",
    "library.aiTechLabel": "AI技术点",
    "library.comingSoon": "即将推出",

    // Library items (ZH)
    "library.cocacola.title": "Coca-Cola：《The Holiday Magic is Coming》",
    "library.cocacola.type": "节日情感营销",
    "library.cocacola.purpose": "强化品牌节日关联，刺激季节性消费",
    "library.cocacola.audience": "家庭消费者、节日礼品购买者",
    "library.cocacola.aiAnalysis": "AI 动画生成（如圣诞老人动态设计）",

    "library.mcdonalds.title": "McDonald's：《A Taste of Tomorrow》",
    "library.mcdonalds.type": "未来科技感广告",
    "library.mcdonalds.purpose": "塑造品牌创新形象，吸引数字化一代",
    "library.mcdonalds.audience": "科技爱好者、年轻快餐消费者",
    "library.mcdonalds.aiAnalysis": "AI 预测生成（如未来餐厅场景模拟）",

    "library.nike.title": "Audiovisual con IA：Nike's AI-Powered Commercial",
    "library.nike.type": "AI 运动动态广告",
    "library.nike.purpose": "强调产品性能，通过 AI 捕捉运动员动作细节",
    "library.nike.audience": "运动员、健身社群",
    "library.nike.aiAnalysis": "运动轨迹 AI 分析与慢动作合成",

    "library.jeremyRazors.title": "Jeremy's Razors 商业广告",
    "library.jeremyRazors.type": "AI 剃须刀品牌创意广告",
    "library.jeremyRazors.purpose": "突出锋利度与舒适度，吸引男性消费者",
    "library.jeremyRazors.audience":
      "男性消费者、个护营销人员、AI 商业广告创作者",
    "library.jeremyRazors.aiAnalysis":
      "Stable Diffusion/Blender 金属质感优化，Adobe Firefly 锁定硬朗风格",

    "library.zaraDor.title": "The Dor Brothers：Zara 二创",
    "library.zaraDor.type": "品牌概念广告",
    "library.zaraDor.purpose": "作品集 / AI 广告实验，吸引品牌或平台关注",
    "library.zaraDor.audience":
      "Zara 粉丝、AI 视频技术爱好者、数字艺术创作者",
    "library.zaraDor.aiAnalysis":
      "Runway Gen-2 或 Veo 3 + Stable Diffusion 风格一致性",

    "library.hiamiHooch.title": "The Dor Brothers：Hiami Hooch",
    "library.hiamiHooch.type": "虚构饮料概念广告",
    "library.hiamiHooch.purpose": "测试 AI 在饮料行业的营销潜力",
    "library.hiamiHooch.audience": "调酒文化爱好者、AIGC 实验者、饮料营销人员",
    "library.hiamiHooch.aiAnalysis": "AI 液体模拟，3D 建模与渲染，AI 配音",

    "library.dorSoda.title": "The Dor Brothers：苏打水广告",
    "library.dorSoda.type": "AI 生成概念广告",
    "library.dorSoda.purpose": "展示 AI 视频能力，吸引品牌方和同行",
    "library.dorSoda.audience": "AI 从业者、数字营销人、苏打水潜在消费者",
    "library.dorSoda.aiAnalysis":
      "Midjourney/SD 出图 + Runway 动画，Veo 3 保证人物一致性",

    "library.roguePerfume.title": "The Dor Brothers：Rogue 香水",
    "library.roguePerfume.type": "AI 香水概念广告",
    "library.roguePerfume.purpose": "展示奢品香氛视觉，吸引品牌关注",
    "library.roguePerfume.audience": "AI 爱好者、营销从业者、香水消费者",
    "library.roguePerfume.aiAnalysis":
      "Midjourney、Gen-3、Magnific AI、Veo 3 视频生成",

    "library.kfcRemix.title": "Krishna Pasi：肯德基二创",
    "library.kfcRemix.type": "食品广告（UGC）",
    "library.kfcRemix.purpose": "展示 AI 重塑快餐广告与个人创意",
    "library.kfcRemix.audience": "肯德基消费者、AI 美食创作者、快餐营销人员",
    "library.kfcRemix.aiAnalysis":
      "食物渲染增强，多角度动态运镜，AI 语音合成",

    "library.volvoLife.title": "Laszlo Gaal：Volvo《For Life》",
    "library.volvoLife.type": "汽车概念广告",
    "library.volvoLife.purpose": "探索 AI 在安全与未来科技叙事",
    "library.volvoLife.audience":
      "沃尔沃车主、汽车科技爱好者、AI 视频实验者",
    "library.volvoLife.aiAnalysis": "未来城市/天气模拟，车辆追踪稳定，AI 旁白",

    "library.adidasFloral.title": "RabbitHole：Adidas Floral 二创",
    "library.adidasFloral.type": "AI 运动时尚广告",
    "library.adidasFloral.purpose": "测试 AI 在花卉运动视觉的创意应用",
    "library.adidasFloral.audience":
      "Adidas 潮流粉丝、AI 数字艺术爱好者、服饰设计师",
    "library.adidasFloral.aiAnalysis": "风格迁移融合，动态光影渲染",

    "library.chinguCafe.title": "RabbitHole：Chingu Cafe",
    "library.chinguCafe.type": "AI 咖啡品牌概念广告",
    "library.chinguCafe.purpose": "探索情感化叙事（友情主题）",
    "library.chinguCafe.audience": "咖啡文化爱好者、韩流粉丝、AI 创意实验者",
    "library.chinguCafe.aiAnalysis": "人脸动画细节，咖啡液体/蒸汽模拟",

    "library.invideoSpark.title": "RabbitHole：InVideo《The Spark》",
    "library.invideoSpark.type": "AI 创意概念广告",
    "library.invideoSpark.purpose": "展示 InVideo 在 AI 广告创作的视觉表达",
    "library.invideoSpark.audience": "AI 广告创作者、关注灵感的受众",
    "library.invideoSpark.aiAnalysis": "Topaz Gigapixel/Video AI，Pika Labs 调色与光影",

    "library.netflixBite.title": "RabbitHole：Netflix《The Sacred Bite》",
    "library.netflixBite.type": "AI 流媒体宣传广告",
    "library.netflixBite.purpose": "强化 Netflix 感官体验，跨场景创意",
    "library.netflixBite.audience":
      "Netflix 用户、电影爱好者、流媒体消费者、广告创意从业者",
    "library.netflixBite.aiAnalysis":
      "RunwayML 调色，Midjourney 场景，Adobe 套件，Topaz 纹理细化",

    "library.gotMilk.title": "Niccyan：Got Milk 二创",
    "library.gotMilk.type": "AI 生成饼干品牌概念广告",
    "library.gotMilk.purpose": "强化品牌健康必需品认知",
    "library.gotMilk.audience":
      "Got Milk 受众、家庭消费者、乳制品营销人员、二创爱好者",
    "library.gotMilk.aiAnalysis": "Stable Diffusion 或 Adobe Firefly 细化画面",

    "library.durex.title": "Haggar Shoval：Durex 二创",
    "library.durex.type": "AI 产品推广",
    "library.durex.purpose": "探索敏感品类的功能与情感平衡",
    "library.durex.audience": "Durex 消费者、快消营销人员、AI 广告创作者",
    "library.durex.aiAnalysis":
      "Midjourney/SD 氛围；Runway Gen-2 低饱和风格统一",

    "library.adidasBlue.title": "Billy Boman：Adidas《Beyond The Blue》",
    "library.adidasBlue.type": "AI 运动品牌概念广告",
    "library.adidasBlue.purpose": "展示 AI 在运动品牌广告的创意潜力",
    "library.adidasBlue.audience":
      "Adidas 粉丝、运动品牌营销人员、AI 广告创作者、视觉艺术爱好者",
    "library.adidasBlue.aiAnalysis": "Midjourney + RunwayML + Topaz，静态转动态流程",

    "library.porscheDream.title": "Laszlo Gaal：Porsche 保时捷二创",
    "library.porscheDream.type": "AI 豪华汽车概念广告",
    "library.porscheDream.purpose": "展示高端汽车 AI 视觉表达力",
    "library.porscheDream.audience":
      "保时捷粉丝、豪车爱好者、汽车营销人员、AI 创作者",
    "library.porscheDream.aiAnalysis":
      "Veo2；SD + 汽车 LoRA；Adobe Firefly 调光影",

    "library.lincoln.title": "Jeremy Haccoun：LINCOLN 林肯二创",
    "library.lincoln.type": "AI 豪华汽车品牌概念广告",
    "library.lincoln.purpose": "展现设计美学与豪华属性",
    "library.lincoln.audience":
      "林肯粉丝、高端车消费者、汽车营销人员、AI 广告创作者",
    "library.lincoln.aiAnalysis":
      "Runway Gen-3 行驶动态；SD/Blender 细化（推测）",

    "library.realThing.title": "Anima Studios TV：Coca-Cola《The Real Thing》",
    "library.realThing.type": "AI 碳酸饮料概念广告",
    "library.realThing.purpose": "经典主题 + AI 创新，激发共鸣",
    "library.realThing.audience":
      "可口可乐消费者、快消营销人员、AI 广告创作者、经典主题爱好者",
    "library.realThing.aiAnalysis":
      "Runway Gen-3 动态；Canva/PS AI 控红调；Topaz 纹理",

    "library.flowerTea.title": "比尧：花茶《四季禅白》",
    "library.flowerTea.type": "AI 文化美学广告",
    "library.flowerTea.purpose": "推广茶文化，结合季节养生概念",
    "library.flowerTea.audience": "茶道爱好者、国风文化受众",
    "library.flowerTea.aiAnalysis": "AI 古风渲染 + 中医知识图谱结合",

    "library.warmFurball.title": "王天王-：《送给冬天的温暖毛球》",
    "library.warmFurball.type": "情感营销 + 产品展示",
    "library.warmFurball.purpose": "通过季节话题提升播放量与黏性",
    "library.warmFurball.audience": "手工 DIY 爱好者、Z 世代消费者、AI 爱好者",
    "library.warmFurball.aiAnalysis": "AI 脚本生成（推测）；Veo 3 动态渲染/风格统一",

    "library.lenovoYouth.title": "N_S600：国际青年节联想二创",
    "library.lenovoYouth.type": "主题 TVC 级 AI 广告",
    "library.lenovoYouth.purpose": "反复优化镜头，吸引 AI 与广告行业关注",
    "library.lenovoYouth.audience":
      "国际青年节关注者、联想粉丝、AI/TVC 从业者、内容创作者",
    "library.lenovoYouth.aiAnalysis":
      "MJ/SD 素材 + Runway 动态；大量镜头筛选统一色调",

    "library.pocari.title": "鹿柒乐：宝矿力二创",
    "library.pocari.type": "AI 运动型饮料广告",
    "library.pocari.purpose": "探索 AIMV 工作流，解决高动态痛点",
    "library.pocari.audience": "宝矿力粉丝、AI 视频创作者、AIGC 爱好者",
    "library.pocari.aiAnalysis": "伪 TVC 质感，AI 音乐编曲，流程保证一致性",

    "library.xiaomiBuds.title": "红日映画 AIGC：小米 Buds 5 Pro 二创",
    "library.xiaomiBuds.type": "AI 耳机概念广告",
    "library.xiaomiBuds.purpose": "探索耳机 + AI 创意的商业可能",
    "library.xiaomiBuds.audience":
      "小米粉丝、AI 广告创作者、耳机爱好者、AIGC 实践者",
    "library.xiaomiBuds.aiAnalysis": "99% 纯 AI；奇幻场景与诗性视觉；声觉主题画面",

    "library.ysl.title": "马尚 AIGC：Saint Laurent 二创",
    "library.ysl.type": "AIGC 艺术时尚广告",
    "library.ysl.purpose": "吸引时尚/AIGC 观众，提升影响力",
    "library.ysl.audience": "时尚爱好者、Saint Laurent 粉丝、AIGC 爱好者",
    "library.ysl.aiAnalysis": "GAN/扩散风格迁移，融合品牌风格",

    "library.heytea.title": "马尚 AIGC：喜茶芭乐青提二创",
    "library.heytea.type": "AI 奶茶概念广告",
    "library.heytea.purpose": "展示饮品卖点与视觉创作能力",
    "library.heytea.audience": "喜茶消费者、奶茶爱好者、饮品营销人员、AIGC 从业者",
    "library.heytea.aiAnalysis": "渲染果肉/色泽，匹配品牌视觉，营造夏日氛围",

    "library.guming.title": "马尚 AIGC：古茗奶茶二创",
    "library.guming.type": "AI 古风奶茶概念广告",
    "library.guming.purpose": "展示饮品视觉与古风卖点",
    "library.guming.audience": "古茗消费者、奶茶爱好者、饮品营销人员、AIGC 从业者",
    "library.guming.aiAnalysis": "古风角色与场景，细节渲染（色泽、质感）",

    "library.taobao.title": "Taobao：造物节《跟 AI 聊聊未来会怎样？》",
    "library.taobao.type": "AI 互动营销广告",
    "library.taobao.purpose": "推广造物节科技感，吸引年轻用户",
    "library.taobao.audience": "Z 世代、科技极客、电商从业者",
    "library.taobao.aiAnalysis": "AI 对话生成，虚拟主播/数字人（推测）",

    "library.oreoCosmos.title": "Oreo：《宇宙奥利奥》",
    "library.oreoCosmos.type": "科幻风格食品广告",
    "library.oreoCosmos.purpose": "宇宙主题吸引儿童与家庭消费者",
    "library.oreoCosmos.audience": "儿童、科幻迷、短视频用户",
    "library.oreoCosmos.aiAnalysis": "太空场景生成，零重力漂浮展示",

    "library.snickers.title": "Billy Boman：士力架二创",
    "library.snickers.type": "AI 食品创意概念广告",
    "library.snickers.purpose": "展示 AI 食品广告创意，吸引品牌",
    "library.snickers.audience":
      "士力架消费者、零食营销人员、AI 广告创作者、AIGC 爱好者",
    "library.snickers.aiAnalysis":
      "95% Veo 3 + 5% Seedance；ElevenLabs；AE 后期；Topaz 放大",

    "library.felix.title": "Billy Boman：Felix 系列食品二创",
    "library.felix.type": "AI 食品创意概念广告",
    "library.felix.purpose": "积累案例，吸引食品行业关注",
    "library.felix.audience":
      "Felix 消费者、食品营销人员、AI 广告创作者、AIGC 爱好者",
    "library.felix.aiAnalysis":
      "OpenAI Sora 2；材质细节渲染；场景化动态生成",

    "library.redbull.title": "Billy Boman：Red Bull 红牛二创",
    "library.redbull.type": "AI 能量饮料广告",
    "library.redbull.purpose": "展示高动态风格化饮料广告能力",
    "library.redbull.audience":
      "红牛消费者、极限运动爱好者、快消营销人员、AI 广告创作者",
    "library.redbull.aiAnalysis":
      "95% Flow by Google + 5% Seedance；AE 调色与过渡",

    "library.benefit.title": "Billy Boman：Benefit《Bad Girl Bounce》",
    "library.benefit.type": "AI 彩妆助推广告",
    "library.benefit.purpose": "展示美妆视觉并突出卖点",
    "library.benefit.audience":
      "Benefit 用户、美妆爱好者、彩妆营销人员、AI 广告创作者",
    "library.benefit.aiAnalysis":
      "LumaLabsAI；质地渲染；妆面模拟；甜美时尚风",

    "library.kalshi.title": "PJ Ace：Kalshi 广告",
    "library.kalshi.type": "AI 金融/预测平台广告",
    "library.kalshi.purpose": "展示平台优势并吸引潜在用户",
    "library.kalshi.audience":
      "金融投资者、预测平台用户、金融营销人员、AI 广告创作者",
    "library.kalshi.aiAnalysis":
      "Stable Diffusion LoRA 训练金融场景风格，强化统一性",

    "library.im8.title": "PJ Ace：IM8 健康饮品商业广告",
    "library.im8.type": "健康饮品商业广告",
    "library.im8.purpose": "推广 IM8，展示联名营销中的 AI 视觉",
    "library.im8.audience":
      "Beckham 粉丝、IM8 目标客群、营销从业者、AI 创作者",
    "library.im8.aiAnalysis":
      "可能数字人；MJ/SD 场景；Runway Gen-2 动态（推测）",

    "library.wistiaLenny.title":
      "Billy Woodward：《Lenny's Big Delivery》（Wistia）",
    "library.wistiaLenny.type": "AI 叙事类平台推广",
    "library.wistiaLenny.purpose": "展示 Wistia 功能与 AI 叙事能力",
    "library.wistiaLenny.audience":
      "企业营销/内容创作者、趣味广告爱好者、AI 叙事创作者",
    "library.wistiaLenny.aiAnalysis":
      "nano banana + Midjourney + Seedance + Kling 2.5 + Suno + ElevenLabs（mock）",

    "library.guerlain.title":
      'Guerlain：蜜蜂瓶《Born in 1853. Made for the future》',
    "library.guerlain.type": "AI + 传统工艺奢品广告",
    "library.guerlain.purpose": "历史传承结合 AI，强化高端创新形象",
    "library.guerlain.audience": "奢侈品消费者、美妆收藏家、AI 艺术爱好者",
    "library.guerlain.aiAnalysis":
      "材质渲染（金属光泽）；3D 建模 + AI 动画（蜜蜂路径）",

    "library.bosie.title": "bosie：《THE ERA OF bosie》",
    "library.bosie.type": "AI 服装品牌广告",
    "library.bosie.purpose": "科幻神话融合，塑造新锐多元品牌形象",
    "library.bosie.audience":
      "年轻个性消费群体、新锐品牌关注者、广告创意从业者、科幻/神话爱好者",
    "library.bosie.aiAnalysis": "以传统创意与拍摄为主；科幻场景与神话元素视觉设计",

    // Footer
    "footer.copyright": "粤ICP备 2024322593号 Copyright © 2025 OranAI. 保留所有权利。",
    "footer.contactUs": "联系我们",
    "footer.phone": "电话",

    // About Us Dialog
    "about.title": "关于 OranAI",
    "about.subtitle": "引领 AI 驱动营销智能的未来",
    "about.whoWeAre": "我们是谁",
    "about.whoWeAreDesc": "OranAI 是一家专注于整合营销智能的领先 AI 公司。我们将前沿的多模态 AI 技术与深厚的营销专业知识相结合，帮助品牌了解市场、构建引人入胜的叙事，并实现全球化扩展。",
    "about.mission": "我们的使命",
    "about.missionDesc": "通过 AI 驱动的洞察和工具，赋能品牌改变与全球消费者的连接方式。我们致力于让各种规模的企业都能使用先进的营销智能。",
    "about.values": "我们的价值观",
    "about.innovation": "创新",
    "about.innovationDesc": "用 AI 技术突破边界",
    "about.excellence": "卓越",
    "about.excellenceDesc": "交付卓越品质",
    "about.collaboration": "协作",
    "about.collaborationDesc": "与合作伙伴共同成长",
    "about.integrity": "诚信",
    "about.integrityDesc": "以诚实和透明行事",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // 从 localStorage 读取初始语言，如果没有则默认使用 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = getStoredLanguage() as Language;
    return (stored === 'zh' || stored === 'en') ? stored : "en";
  });

  // 当语言改变时，保存到 localStorage
  useEffect(() => {
    setStoredLanguage(language);
  }, [language]);

  // 包装 setLanguage，确保保存到 localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
