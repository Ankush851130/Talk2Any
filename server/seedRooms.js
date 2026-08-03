require('dotenv').config();
const mongoose = require('mongoose');
const Room = require('./models/Room');
const User = require('./models/User');

const categories = ['Study', 'Programming', 'Gaming', 'Music', 'Language Exchange', 'Interview Practice', 'General'];
const languages = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Japanese', 'Chinese', 'Arabic', 'Any'];

const roomTemplates = [
  { title: "React 19 & Next.js 15 Deep Dive", cat: "Programming", lang: "English", desc: "Discussing Server Components, Actions, and modern frontend patterns." },
  { title: "English Daily Speaking Club", cat: "Language Exchange", lang: "English", desc: "Fluent English conversation practice for non-native speakers." },
  { title: "LeetCode & DSA Problem Solving", cat: "Interview Practice", lang: "English", desc: "Solving medium/hard algorithm problems together." },
  { title: "Node.js & Microservices Architecture", cat: "Programming", lang: "English", desc: "Best practices for building scalable backend APIs." },
  { title: "Late Night Coding & Lofi Beats", cat: "Music", lang: "Any", desc: "Quiet study and coding room with chill music vibes." },
  { title: "Full Stack MERN Project Review", cat: "Programming", lang: "English", desc: "Show your portfolio projects and get constructive peer feedback." },
  { title: "Hindi & English Conversation Corner", cat: "Language Exchange", lang: "Hindi", desc: "Friendly language exchange practice for Hindi learners." },
  { title: "System Design Mock Interview", cat: "Interview Practice", lang: "English", desc: "Designing distributed systems for FAANG level interviews." },
  { title: "Japanese Conversation for Beginners", cat: "Language Exchange", lang: "Japanese", desc: "Konnichiwa! Let's practice Hiragana, Katakana, and basic phrases." },
  { title: "Valorant & Casual Gaming Lounge", cat: "Gaming", lang: "English", desc: "Find teammates for ranked matches and chill games." },
  { title: "Python Data Science & AI Discussion", cat: "Programming", lang: "English", desc: "Exploring Pandas, PyTorch, LLMs, and machine learning models." },
  { title: "French Vocabulary & Grammar Chat", cat: "Language Exchange", lang: "French", desc: "Bonjour! Practice French pronunciation and daily phrases." },
  { title: "Spanish Conversation Practice", cat: "Language Exchange", lang: "Spanish", desc: "Hola a todos! Conversación en español para todos los niveles." },
  { title: "German Learning & B1 Prep", cat: "Language Exchange", lang: "German", desc: "Hallo! Practice German grammar and conversation." },
  { title: "FAANG Behavioral Interview Practice", cat: "Interview Practice", lang: "English", desc: "STAR method practice for behavioral software engineer interviews." },
  { title: "Quiet Focus Pomodoro Study Room", cat: "Study", lang: "Any", desc: "25 min focus / 5 min break silent study room for productivity." },
  { title: "WebRTC & Real-time Socket Development", cat: "Programming", lang: "English", desc: "Building live voice, video, and chat WebRTC platforms." },
  { title: "Cybersecurity & Ethical Hacking Study", cat: "Study", lang: "English", desc: "Discussing CTF challenges, network security, and pentesting." },
  { title: "Acoustic Guitar & Music Jam Session", cat: "Music", lang: "Any", desc: "Share your favorite songs and jam with fellow musicians." },
  { title: "Chinese Mandarin Spoken Practice", cat: "Language Exchange", lang: "Chinese", desc: "Nǐ hǎo! Practice Pinyin, tones, and conversational Mandarin." },
  { title: "DevOps, Docker & Kubernetes Group", cat: "Programming", lang: "English", desc: "CI/CD pipelines, container orchestration, and cloud infrastructure." },
  { title: "UI/UX & Modern Web Aesthetics", cat: "General", lang: "English", desc: "Figma design reviews, CSS animations, and visual UI best practices." },
  { title: "Rust Programming Language Explorers", cat: "Programming", lang: "English", desc: "Learning ownership, borrowing, and high-performance Rust systems." },
  { title: "Arabic Language Practice", cat: "Language Exchange", lang: "Arabic", desc: "Ahlan w Sahlan! Learn and speak Modern Standard Arabic." },
  { title: "Mobile Dev: React Native & Flutter", cat: "Programming", lang: "English", desc: "Building cross-platform mobile apps for iOS and Android." },
];

const seedDummyRooms = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable is missing!');
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB Atlas...');

    // Find or create default owner
    let ownerUser = await User.findOne({});
    if (!ownerUser) {
      ownerUser = await User.create({
        username: 'CommunityHost',
        email: 'host@talk2any.com',
        password: 'Password123!',
        isVerified: true,
        country: 'Global',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=CommunityHost',
      });
      console.log('[Seed] Created default host user.');
    }

    const roomsToInsert = [];
    for (let i = 1; i <= 50; i++) {
      const template = roomTemplates[(i - 1) % roomTemplates.length];
      const isPriv = i % 7 === 0; // Every 7th room is password protected
      
      roomsToInsert.push({
        title: `${template.title} #${Math.floor(i / roomTemplates.length) + 1}`,
        description: template.desc,
        category: template.cat,
        language: template.lang,
        maxParticipants: 4,
        isPrivate: isPriv,
        password: isPriv ? '1234' : '',
        owner: ownerUser._id,
        participants: [],
        coOwners: [],
        isActive: true,
      });
    }

    // Insert into DB
    const inserted = await Room.insertMany(roomsToInsert);
    console.log(`[Seed] Successfully inserted ${inserted.length} dummy rooms into MongoDB! 🎉`);

    await mongoose.disconnect();
    console.log('[Seed] Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding rooms:', err.message);
    process.exit(1);
  }
};

seedDummyRooms();
