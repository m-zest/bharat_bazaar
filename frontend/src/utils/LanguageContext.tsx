import { createContext, useContext, useState, ReactNode } from 'react'

export type LangCode = 'en' | 'hi' | 'ta' | 'bn' | 'gu' | 'mr'

interface LanguageContextType {
  lang: LangCode
  setLang: (lang: LangCode) => void
  t: (key: string) => string
}

export const LANGUAGES: { code: LangCode; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
]

const translations: Record<LangCode, Record<string, string>> = {
  en: {
    // Navbar
    'nav.features': 'Features',
    'nav.howItWorks': 'How it works',
    'nav.benefits': 'Benefits',
    'nav.testimonials': 'Testimonials',
    'nav.tryDemo': 'Try Demo',

    // Hero
    'hero.badge': 'Powered by Amazon Bedrock',
    'hero.title1': 'Bharat',
    'hero.title2': 'Bazaar',
    'hero.title3': 'AI Intelligence',
    'hero.tagline': 'Weighed by Intelligence',
    'hero.desc': 'The AI-powered market intelligence platform built for 12 million Indian retailers. Smart pricing, multilingual content, and real-time insights — in your language.',
    'hero.exploreDemo': 'Explore Demo',
    'hero.askAI': 'Ask AI in Hindi',
    'hero.stat1Label': 'Kirana Stores',
    'hero.stat2Label': 'Cities',
    'hero.stat3Label': 'Prize Pool',

    // Features
    'features.subtitle': 'Our AI Features',
    'features.title': 'Everything your store\nneeds to grow',
    'features.exploreAll': 'Explore All Features',
    'features.smartPricing': 'Smart Pricing',
    'features.smartPricingSub': 'AI-optimized prices for your region',
    'features.aiContent': 'AI Content',
    'features.aiContentSub': 'Descriptions in 6 Indian languages',
    'features.sentiment': 'Sentiment',
    'features.sentimentSub': 'Understands Hinglish reviews',
    'features.sourcing': 'Sourcing',
    'features.sourcingSub': 'Wholesale prices near you',

    // Showcase
    'showcase.subtitle': 'See it in action',
    'showcase.title': 'What BharatBazaar AI\ncan do for you',
    'showcase.explore': 'Explore 8+ more features',
    'showcase.exploreSub': 'Inventory, competitors, compare & more',
    'showcase.viewDashboard': 'View Dashboard',

    // Promo
    'promo.builtFor': 'Built for every',
    'promo.indianRetailer': 'Indian Retailer',
    'promo.openForAll': 'Open for All',
    'promo.freeForAll': 'Free for All\nRetailers',
    'promo.desc': 'AI-powered intelligence that was only available to Amazon & Flipkart. Now free for every dukandaar across India.',
    'promo.startFree': 'Start Free',

    // Benefits
    'benefits.subtitle': 'What makes us different',
    'benefits.title': 'Why BharatBazaar AI?',
    'benefits.desc': 'Purpose-built for Indian retail. Not a generic SaaS — every feature understands your market.',
    'benefits.languages': '6 Indian Languages',
    'benefits.languagesDesc': 'Hindi, Tamil, Bengali, Gujarati, Marathi & English. Not translations — true cultural adaptation.',
    'benefits.marketData': 'Real Market Data',
    'benefits.marketDataDesc': 'Live competitor prices from Amazon, Flipkart, BigBasket. Festival trends. Weather impact analysis.',
    'benefits.zeroSetup': 'Zero Setup',
    'benefits.zeroSetupDesc': 'No login, no credit card, no downloads. Open the link and start exploring in under 30 seconds.',

    // Testimonials
    'testimonials.subtitle': 'Testimonials',
    'testimonials.title': 'Built for Indian Retailers',

    // CTA
    'cta.title': 'Transform your retail\nbusiness today',
    'cta.desc': 'Join the AI revolution. No login needed — start in 30 seconds.',
    'cta.emailPlaceholder': 'Enter your email',
    'cta.getStarted': 'Get Started',

    // Footer
    'footer.desc': 'AI-powered market intelligence for Indian retail. Built for the AI for Bharat Hackathon 2026.',
    'footer.features': 'Features',
    'footer.resources': 'Resources',
    'footer.company': 'Company',
  },
  hi: {
    'nav.features': 'फीचर्स',
    'nav.howItWorks': 'कैसे काम करता है',
    'nav.benefits': 'फायदे',
    'nav.testimonials': 'समीक्षाएं',
    'nav.tryDemo': 'डेमो देखें',

    'hero.badge': 'Amazon Bedrock द्वारा संचालित',
    'hero.title1': 'भारत',
    'hero.title2': 'बाज़ार',
    'hero.title3': 'AI इंटेलिजेंस',
    'hero.tagline': 'बुद्धिमत्ता से तौला गया',
    'hero.desc': '1.2 करोड़ भारतीय दुकानदारों के लिए बना AI-संचालित मार्केट इंटेलिजेंस प्लेटफॉर्म। स्मार्ट प्राइसिंग, बहुभाषी कंटेंट, और रियल-टाइम इनसाइट्स — आपकी भाषा में।',
    'hero.exploreDemo': 'डेमो देखें',
    'hero.askAI': 'AI से हिंदी में पूछें',
    'hero.stat1Label': 'किराना स्टोर',
    'hero.stat2Label': 'शहर',
    'hero.stat3Label': 'पुरस्कार राशि',

    'features.subtitle': 'हमारे AI फीचर्स',
    'features.title': 'आपकी दुकान को बढ़ाने के\nलिए सब कुछ',
    'features.exploreAll': 'सभी फीचर्स देखें',
    'features.smartPricing': 'स्मार्ट प्राइसिंग',
    'features.smartPricingSub': 'आपके क्षेत्र के लिए AI-अनुकूलित कीमतें',
    'features.aiContent': 'AI कंटेंट',
    'features.aiContentSub': '6 भारतीय भाषाओं में विवरण',
    'features.sentiment': 'सेंटिमेंट',
    'features.sentimentSub': 'हिंग्लिश रिव्यू समझता है',
    'features.sourcing': 'सोर्सिंग',
    'features.sourcingSub': 'आपके पास थोक कीमतें',

    'showcase.subtitle': 'इसे एक्शन में देखें',
    'showcase.title': 'BharatBazaar AI आपके\nलिए क्या कर सकता है',
    'showcase.explore': '8+ और फीचर्स देखें',
    'showcase.exploreSub': 'इन्वेंटरी, प्रतिस्पर्धी, तुलना और अधिक',
    'showcase.viewDashboard': 'डैशबोर्ड देखें',

    'promo.builtFor': 'हर भारतीय',
    'promo.indianRetailer': 'दुकानदार के लिए',
    'promo.openForAll': 'सबके लिए खुला',
    'promo.freeForAll': 'सभी दुकानदारों\nके लिए मुफ्त',
    'promo.desc': 'AI-संचालित इंटेलिजेंस जो सिर्फ Amazon और Flipkart के पास थी। अब भारत के हर दुकानदार के लिए मुफ्त।',
    'promo.startFree': 'मुफ्त शुरू करें',

    'benefits.subtitle': 'हम कैसे अलग हैं',
    'benefits.title': 'BharatBazaar AI क्यों?',
    'benefits.desc': 'भारतीय रिटेल के लिए खास बना। कोई जेनेरिक SaaS नहीं — हर फीचर आपके बाज़ार को समझता है।',
    'benefits.languages': '6 भारतीय भाषाएं',
    'benefits.languagesDesc': 'हिंदी, तमिल, बंगाली, गुजराती, मराठी और अंग्रेजी। सिर्फ अनुवाद नहीं — सच्चा सांस्कृतिक अनुकूलन।',
    'benefits.marketData': 'असली मार्केट डेटा',
    'benefits.marketDataDesc': 'Amazon, Flipkart, BigBasket से लाइव प्रतिस्पर्धी कीमतें। त्योहार ट्रेंड। मौसम प्रभाव विश्लेषण।',
    'benefits.zeroSetup': 'ज़ीरो सेटअप',
    'benefits.zeroSetupDesc': 'कोई लॉगिन नहीं, कोई क्रेडिट कार्ड नहीं, कोई डाउनलोड नहीं। लिंक खोलें और 30 सेकंड में शुरू करें।',

    'testimonials.subtitle': 'समीक्षाएं',
    'testimonials.title': 'भारतीय दुकानदारों के लिए बना',

    'cta.title': 'अपने रिटेल बिज़नेस\nको आज बदलें',
    'cta.desc': 'AI क्रांति में शामिल हों। कोई लॉगिन नहीं — 30 सेकंड में शुरू करें।',
    'cta.emailPlaceholder': 'अपना ईमेल दर्ज करें',
    'cta.getStarted': 'शुरू करें',

    'footer.desc': 'भारतीय रिटेल के लिए AI-संचालित मार्केट इंटेलिजेंस। AI for Bharat Hackathon 2026 के लिए बनाया गया।',
    'footer.features': 'फीचर्स',
    'footer.resources': 'संसाधन',
    'footer.company': 'कंपनी',
  },
  ta: {
    'nav.features': 'அம்சங்கள்',
    'nav.howItWorks': 'எப்படி வேலை செய்கிறது',
    'nav.benefits': 'நன்மைகள்',
    'nav.testimonials': 'பயனர் கருத்துகள்',
    'nav.tryDemo': 'டெமோ பாருங்கள்',

    'hero.badge': 'Amazon Bedrock மூலம் இயங்குகிறது',
    'hero.title1': 'பாரத்',
    'hero.title2': 'பஜார்',
    'hero.title3': 'AI நுண்ணறிவு',
    'hero.tagline': 'நுண்ணறிவால் அளவிடப்பட்டது',
    'hero.desc': '1.2 கோடி இந்திய சில்லறை வணிகர்களுக்காக உருவாக்கப்பட்ட AI-இயங்கும் சந்தை நுண்ணறிவு தளம்। ஸ்மார்ட் விலை நிர்ணயம், பல மொழி உள்ளடக்கம் — உங்கள் மொழியில்.',
    'hero.exploreDemo': 'டெமோ பாருங்கள்',
    'hero.askAI': 'AI-யிடம் கேளுங்கள்',
    'hero.stat1Label': 'கிராணா கடைகள்',
    'hero.stat2Label': 'நகரங்கள்',
    'hero.stat3Label': 'பரிசு தொகை',

    'features.subtitle': 'எங்கள் AI அம்சங்கள்',
    'features.title': 'உங்கள் கடை வளர\nதேவையான அனைத்தும்',
    'features.exploreAll': 'அனைத்து அம்சங்களையும் பாருங்கள்',
    'features.smartPricing': 'ஸ்மார்ட் விலை',
    'features.smartPricingSub': 'உங்கள் பகுதிக்கான AI-உகந்த விலைகள்',
    'features.aiContent': 'AI உள்ளடக்கம்',
    'features.aiContentSub': '6 இந்திய மொழிகளில் விவரணைகள்',
    'features.sentiment': 'செண்டிமெண்ட்',
    'features.sentimentSub': 'ஹிங்லிஷ் விமர்சனங்களை புரிந்துகொள்கிறது',
    'features.sourcing': 'சோர்சிங்',
    'features.sourcingSub': 'உங்களுக்கு அருகில் மொத்த விலைகள்',

    'showcase.subtitle': 'செயலில் பாருங்கள்',
    'showcase.title': 'BharatBazaar AI உங்களுக்கு\nஎன்ன செய்ய முடியும்',
    'showcase.explore': '8+ மேலும் அம்சங்கள்',
    'showcase.exploreSub': 'சரக்கு, போட்டியாளர்கள், ஒப்பீடு & மேலும்',
    'showcase.viewDashboard': 'டாஷ்போர்ட் பாருங்கள்',

    'promo.builtFor': 'ஒவ்வொரு இந்திய',
    'promo.indianRetailer': 'வணிகருக்காக',
    'promo.openForAll': 'அனைவருக்கும் திறந்தது',
    'promo.freeForAll': 'அனைத்து வணிகர்களுக்கும்\nஇலவசம்',
    'promo.desc': 'Amazon & Flipkart-க்கு மட்டும் இருந்த AI-இயங்கும் நுண்ணறிவு. இப்போது இந்தியா முழுவதும் ஒவ்வொரு கடைக்காரருக்கும் இலவசம்.',
    'promo.startFree': 'இலவசமாக தொடங்குங்கள்',

    'benefits.subtitle': 'எங்களை வேறுபடுத்துவது',
    'benefits.title': 'ஏன் BharatBazaar AI?',
    'benefits.desc': 'இந்திய சில்லறை வணிகத்திற்காக சிறப்பாக உருவாக்கப்பட்டது. ஒவ்வொரு அம்சமும் உங்கள் சந்தையை புரிந்துகொள்கிறது.',
    'benefits.languages': '6 இந்திய மொழிகள்',
    'benefits.languagesDesc': 'இந்தி, தமிழ், வங்காளம், குஜராத்தி, மராத்தி & ஆங்கிலம். வெறும் மொழிபெயர்ப்பு அல்ல — உண்மையான கலாச்சார தழுவல்.',
    'benefits.marketData': 'உண்மையான சந்தை தரவு',
    'benefits.marketDataDesc': 'Amazon, Flipkart, BigBasket-ல் இருந்து நேரடி போட்டியாளர் விலைகள். பண்டிகை போக்குகள். வானிலை தாக்க பகுப்பாய்வு.',
    'benefits.zeroSetup': 'ஜீரோ செட்அப்',
    'benefits.zeroSetupDesc': 'லாகின் இல்லை, கிரெடிட் கார்டு இல்லை, டவுன்லோட் இல்லை. லிங்கை திறந்து 30 வினாடிகளில் தொடங்குங்கள்.',

    'testimonials.subtitle': 'பயனர் கருத்துகள்',
    'testimonials.title': 'இந்திய வணிகர்களுக்காக உருவாக்கப்பட்டது',

    'cta.title': 'உங்கள் சில்லறை\nவணிகத்தை இன்றே மாற்றுங்கள்',
    'cta.desc': 'AI புரட்சியில் சேருங்கள். லாகின் தேவையில்லை — 30 வினாடிகளில் தொடங்குங்கள்.',
    'cta.emailPlaceholder': 'உங்கள் மின்னஞ்சலை உள்ளிடுங்கள்',
    'cta.getStarted': 'தொடங்குங்கள்',

    'footer.desc': 'இந்திய சில்லறை வணிகத்திற்கான AI-இயங்கும் சந்தை நுண்ணறிவு. AI for Bharat Hackathon 2026-க்காக உருவாக்கப்பட்டது.',
    'footer.features': 'அம்சங்கள்',
    'footer.resources': 'வளங்கள்',
    'footer.company': 'நிறுவனம்',
  },
  bn: {
    'nav.features': 'ফিচার',
    'nav.howItWorks': 'কিভাবে কাজ করে',
    'nav.benefits': 'সুবিধা',
    'nav.testimonials': 'পর্যালোচনা',
    'nav.tryDemo': 'ডেমো দেখুন',

    'hero.badge': 'Amazon Bedrock দ্বারা চালিত',
    'hero.title1': 'ভারত',
    'hero.title2': 'বাজার',
    'hero.title3': 'AI ইন্টেলিজেন্স',
    'hero.tagline': 'বুদ্ধিমত্তা দিয়ে পরিমাপিত',
    'hero.desc': '১.২ কোটি ভারতীয় খুচরা বিক্রেতাদের জন্য তৈরি AI-চালিত মার্কেট ইন্টেলিজেন্স প্ল্যাটফর্ম। স্মার্ট প্রাইসিং, বহুভাষিক কন্টেন্ট — আপনার ভাষায়।',
    'hero.exploreDemo': 'ডেমো দেখুন',
    'hero.askAI': 'AI-কে জিজ্ঞেস করুন',
    'hero.stat1Label': 'কিরানা দোকান',
    'hero.stat2Label': 'শহর',
    'hero.stat3Label': 'পুরস্কার',

    'features.subtitle': 'আমাদের AI ফিচার',
    'features.title': 'আপনার দোকান বাড়াতে\nসব কিছু',
    'features.exploreAll': 'সব ফিচার দেখুন',
    'features.smartPricing': 'স্মার্ট প্রাইসিং',
    'features.smartPricingSub': 'আপনার অঞ্চলের জন্য AI-অপ্টিমাইজড দাম',
    'features.aiContent': 'AI কন্টেন্ট',
    'features.aiContentSub': '৬টি ভারতীয় ভাষায় বিবরণ',
    'features.sentiment': 'সেন্টিমেন্ট',
    'features.sentimentSub': 'হিংলিশ রিভিউ বোঝে',
    'features.sourcing': 'সোর্সিং',
    'features.sourcingSub': 'আপনার কাছে পাইকারি দাম',

    'showcase.subtitle': 'অ্যাকশনে দেখুন',
    'showcase.title': 'BharatBazaar AI আপনার\nজন্য কি করতে পারে',
    'showcase.explore': '৮+ আরও ফিচার',
    'showcase.exploreSub': 'ইনভেন্টরি, প্রতিযোগী, তুলনা ও আরও',
    'showcase.viewDashboard': 'ড্যাশবোর্ড দেখুন',

    'promo.builtFor': 'প্রতিটি ভারতীয়',
    'promo.indianRetailer': 'দোকানদারের জন্য',
    'promo.openForAll': 'সবার জন্য উন্মুক্ত',
    'promo.freeForAll': 'সব দোকানদারের\nজন্য বিনামূল্যে',
    'promo.desc': 'AI-চালিত ইন্টেলিজেন্স যা শুধু Amazon ও Flipkart-এর কাছে ছিল। এখন ভারতের প্রতিটি দোকানদারের জন্য বিনামূল্যে।',
    'promo.startFree': 'বিনামূল্যে শুরু করুন',

    'benefits.subtitle': 'আমরা কিভাবে আলাদা',
    'benefits.title': 'কেন BharatBazaar AI?',
    'benefits.desc': 'ভারতীয় খুচরা ব্যবসার জন্য বিশেষভাবে তৈরি। প্রতিটি ফিচার আপনার বাজার বোঝে।',
    'benefits.languages': '৬টি ভারতীয় ভাষা',
    'benefits.languagesDesc': 'হিন্দি, তামিল, বাংলা, গুজরাটি, মারাঠি ও ইংরেজি। শুধু অনুবাদ নয় — সত্যিকারের সাংস্কৃতিক অভিযোজন।',
    'benefits.marketData': 'আসল মার্কেট ডেটা',
    'benefits.marketDataDesc': 'Amazon, Flipkart, BigBasket থেকে লাইভ প্রতিযোগী দাম। উৎসব ট্রেন্ড। আবহাওয়া প্রভাব বিশ্লেষণ।',
    'benefits.zeroSetup': 'জিরো সেটআপ',
    'benefits.zeroSetupDesc': 'কোনো লগইন নেই, কোনো ক্রেডিট কার্ড নেই, কোনো ডাউনলোড নেই। লিংক খুলুন এবং ৩০ সেকেন্ডে শুরু করুন।',

    'testimonials.subtitle': 'পর্যালোচনা',
    'testimonials.title': 'ভারতীয় দোকানদারদের জন্য তৈরি',

    'cta.title': 'আপনার খুচরা ব্যবসা\nআজই বদলান',
    'cta.desc': 'AI বিপ্লবে যোগ দিন। কোনো লগইন নেই — ৩০ সেকেন্ডে শুরু করুন।',
    'cta.emailPlaceholder': 'আপনার ইমেইল দিন',
    'cta.getStarted': 'শুরু করুন',

    'footer.desc': 'ভারতীয় খুচরা ব্যবসার জন্য AI-চালিত মার্কেট ইন্টেলিজেন্স। AI for Bharat Hackathon 2026-এর জন্য তৈরি।',
    'footer.features': 'ফিচার',
    'footer.resources': 'সম্পদ',
    'footer.company': 'কোম্পানি',
  },
  gu: {
    'nav.features': 'ફીચર્સ',
    'nav.howItWorks': 'કેવી રીતે કામ કરે છે',
    'nav.benefits': 'ફાયદા',
    'nav.testimonials': 'સમીક્ષાઓ',
    'nav.tryDemo': 'ડેમો જુઓ',

    'hero.badge': 'Amazon Bedrock દ્વારા સંચાલિત',
    'hero.title1': 'ભારત',
    'hero.title2': 'બજાર',
    'hero.title3': 'AI ઈન્ટેલિજન્સ',
    'hero.tagline': 'બુદ્ધિમત્તાથી તોલાયેલ',
    'hero.desc': '1.2 કરોડ ભારતીય દુકાનદારો માટે બનેલ AI-સંચાલિત માર્કેટ ઈન્ટેલિજન્સ પ્લેટફોર્મ। સ્માર્ટ પ્રાઈસિંગ, બહુભાષી કન્ટેન્ટ — તમારી ભાષામાં.',
    'hero.exploreDemo': 'ડેમો જુઓ',
    'hero.askAI': 'AI ને પૂછો',
    'hero.stat1Label': 'કિરાણા સ્ટોર',
    'hero.stat2Label': 'શહેરો',
    'hero.stat3Label': 'ઈનામ રાશિ',

    'features.subtitle': 'અમારા AI ફીચર્સ',
    'features.title': 'તમારી દુકાન વધારવા\nબધું જ',
    'features.exploreAll': 'બધા ફીચર્સ જુઓ',
    'features.smartPricing': 'સ્માર્ટ પ્રાઈસિંગ',
    'features.smartPricingSub': 'તમારા વિસ્તાર માટે AI-ઑપ્ટિમાઈઝ્ડ કિંમતો',
    'features.aiContent': 'AI કન્ટેન્ટ',
    'features.aiContentSub': '6 ભારતીય ભાષાઓમાં વર્ણન',
    'features.sentiment': 'સેન્ટિમેન્ટ',
    'features.sentimentSub': 'હિંગ્લિશ રિવ્યુ સમજે છે',
    'features.sourcing': 'સોર્સિંગ',
    'features.sourcingSub': 'તમારી નજીક જથ્થાબંધ કિંમતો',

    'showcase.subtitle': 'એક્શનમાં જુઓ',
    'showcase.title': 'BharatBazaar AI તમારા\nમાટે શું કરી શકે છે',
    'showcase.explore': '8+ વધુ ફીચર્સ',
    'showcase.exploreSub': 'ઈન્વેન્ટરી, સ્પર્ધકો, સરખામણી અને વધુ',
    'showcase.viewDashboard': 'ડેશબોર્ડ જુઓ',

    'promo.builtFor': 'દરેક ભારતીય',
    'promo.indianRetailer': 'દુકાનદાર માટે',
    'promo.openForAll': 'બધા માટે ખુલ્લું',
    'promo.freeForAll': 'બધા દુકાનદારો\nમાટે મફત',
    'promo.desc': 'AI-સંચાલિત ઈન્ટેલિજન્સ જે ફક્ત Amazon અને Flipkart પાસે હતી. હવે ભારતના દરેક દુકાનદાર માટે મફત.',
    'promo.startFree': 'મફત શરૂ કરો',

    'benefits.subtitle': 'અમે કેવી રીતે અલગ છીએ',
    'benefits.title': 'શા માટે BharatBazaar AI?',
    'benefits.desc': 'ભારતીય રિટેલ માટે ખાસ બનાવેલ. દરેક ફીચર તમારું બજાર સમજે છે.',
    'benefits.languages': '6 ભારતીય ભાષાઓ',
    'benefits.languagesDesc': 'હિન્દી, તમિલ, બંગાળી, ગુજરાતી, મરાઠી અને અંગ્રેજી. ફક્ત અનુવાદ નહીં — સાચું સાંસ્કૃતિક અનુકૂલન.',
    'benefits.marketData': 'અસલ માર્કેટ ડેટા',
    'benefits.marketDataDesc': 'Amazon, Flipkart, BigBasket માંથી લાઈવ સ્પર્ધક કિંમતો. તહેવાર ટ્રેન્ડ. હવામાન અસર વિશ્લેષણ.',
    'benefits.zeroSetup': 'ઝીરો સેટઅપ',
    'benefits.zeroSetupDesc': 'કોઈ લોગીન નહીં, કોઈ ક્રેડિટ કાર્ડ નહીં, કોઈ ડાઉનલોડ નહીં. લિંક ખોલો અને 30 સેકન્ડમાં શરૂ કરો.',

    'testimonials.subtitle': 'સમીક્ષાઓ',
    'testimonials.title': 'ભારતીય દુકાનદારો માટે બનાવેલ',

    'cta.title': 'તમારો રિટેલ બિઝનેસ\nઆજે બદલો',
    'cta.desc': 'AI ક્રાંતિમાં જોડાઓ. કોઈ લોગીન નહીં — 30 સેકન્ડમાં શરૂ કરો.',
    'cta.emailPlaceholder': 'તમારો ઈમેલ દાખલ કરો',
    'cta.getStarted': 'શરૂ કરો',

    'footer.desc': 'ભારતીય રિટેલ માટે AI-સંચાલિત માર્કેટ ઈન્ટેલિજન્સ. AI for Bharat Hackathon 2026 માટે બનાવેલ.',
    'footer.features': 'ફીચર્સ',
    'footer.resources': 'સંસાધનો',
    'footer.company': 'કંપની',
  },
  mr: {
    'nav.features': 'वैशिष्ट्ये',
    'nav.howItWorks': 'कसे काम करते',
    'nav.benefits': 'फायदे',
    'nav.testimonials': 'अभिप्राय',
    'nav.tryDemo': 'डेमो पहा',

    'hero.badge': 'Amazon Bedrock द्वारे चालित',
    'hero.title1': 'भारत',
    'hero.title2': 'बाजार',
    'hero.title3': 'AI इंटेलिजन्स',
    'hero.tagline': 'बुद्धिमत्तेने मोजलेले',
    'hero.desc': '1.2 कोटी भारतीय दुकानदारांसाठी बनवलेले AI-चालित मार्केट इंटेलिजन्स प्लॅटफॉर्म। स्मार्ट प्राइसिंग, बहुभाषिक कंटेंट — तुमच्या भाषेत.',
    'hero.exploreDemo': 'डेमो पहा',
    'hero.askAI': 'AI ला विचारा',
    'hero.stat1Label': 'किराणा दुकाने',
    'hero.stat2Label': 'शहरे',
    'hero.stat3Label': 'बक्षीस रक्कम',

    'features.subtitle': 'आमची AI वैशिष्ट्ये',
    'features.title': 'तुमचे दुकान वाढवण्यासाठी\nसर्व काही',
    'features.exploreAll': 'सर्व वैशिष्ट्ये पहा',
    'features.smartPricing': 'स्मार्ट प्राइसिंग',
    'features.smartPricingSub': 'तुमच्या भागासाठी AI-ऑप्टिमाइज्ड किमती',
    'features.aiContent': 'AI कंटेंट',
    'features.aiContentSub': '6 भारतीय भाषांमध्ये वर्णन',
    'features.sentiment': 'सेंटिमेंट',
    'features.sentimentSub': 'हिंग्लिश रिव्ह्यू समजते',
    'features.sourcing': 'सोर्सिंग',
    'features.sourcingSub': 'तुमच्या जवळ घाऊक किमती',

    'showcase.subtitle': 'कृतीत पहा',
    'showcase.title': 'BharatBazaar AI तुमच्यासाठी\nकाय करू शकते',
    'showcase.explore': '8+ आणखी वैशिष्ट्ये',
    'showcase.exploreSub': 'इन्व्हेंटरी, स्पर्धक, तुलना आणि अधिक',
    'showcase.viewDashboard': 'डॅशबोर्ड पहा',

    'promo.builtFor': 'प्रत्येक भारतीय',
    'promo.indianRetailer': 'दुकानदारासाठी',
    'promo.openForAll': 'सर्वांसाठी खुले',
    'promo.freeForAll': 'सर्व दुकानदारांसाठी\nमोफत',
    'promo.desc': 'AI-चालित इंटेलिजन्स जी फक्त Amazon आणि Flipkart कडे होती. आता भारतातील प्रत्येक दुकानदारासाठी मोफत.',
    'promo.startFree': 'मोफत सुरू करा',

    'benefits.subtitle': 'आम्ही कसे वेगळे आहोत',
    'benefits.title': 'का BharatBazaar AI?',
    'benefits.desc': 'भारतीय किरकोळ व्यापारासाठी खास बनवलेले. प्रत्येक वैशिष्ट्य तुमचे बाजार समजते.',
    'benefits.languages': '6 भारतीय भाषा',
    'benefits.languagesDesc': 'हिंदी, तमिळ, बंगाली, गुजराती, मराठी आणि इंग्रजी. फक्त भाषांतर नाही — खरे सांस्कृतिक अनुकूलन.',
    'benefits.marketData': 'खरा मार्केट डेटा',
    'benefits.marketDataDesc': 'Amazon, Flipkart, BigBasket कडून लाइव्ह स्पर्धक किमती. सण ट्रेंड. हवामान प्रभाव विश्लेषण.',
    'benefits.zeroSetup': 'झिरो सेटअप',
    'benefits.zeroSetupDesc': 'कोणतेही लॉगिन नाही, क्रेडिट कार्ड नाही, डाउनलोड नाही. लिंक उघडा आणि 30 सेकंदात सुरू करा.',

    'testimonials.subtitle': 'अभिप्राय',
    'testimonials.title': 'भारतीय दुकानदारांसाठी बनवलेले',

    'cta.title': 'तुमचा किरकोळ व्यापार\nआज बदला',
    'cta.desc': 'AI क्रांतीत सामील व्हा. कोणतेही लॉगिन नाही — 30 सेकंदात सुरू करा.',
    'cta.emailPlaceholder': 'तुमचा ईमेल प्रविष्ट करा',
    'cta.getStarted': 'सुरू करा',

    'footer.desc': 'भारतीय किरकोळ व्यापारासाठी AI-चालित मार्केट इंटेलिजन्स. AI for Bharat Hackathon 2026 साठी बनवलेले.',
    'footer.features': 'वैशिष्ट्ये',
    'footer.resources': 'संसाधने',
    'footer.company': 'कंपनी',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>(() => {
    const saved = localStorage.getItem('bb-lang')
    return (saved as LangCode) || 'en'
  })

  const handleSetLang = (newLang: LangCode) => {
    setLang(newLang)
    localStorage.setItem('bb-lang', newLang)
  }

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
