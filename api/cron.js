import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://hqjmcfaywfjwjqamyaik.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxam1jZmF5d2Zqd2pxYW15YWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyMDE3MDEsImV4cCI6MjEwMTc3NzcwMX0.WHzdySBpsjONCB1t3aEsIEh9CGr0uybye2qzg1Ovghw";

// Vercel Environment Variables'dan BOT_TOKEN'ni xavfsiz o'qiydi
const BOT_TOKEN = process.env.BOT_TOKEN;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function handler(req, res) {
  try {
    if (!BOT_TOKEN) {
      return res.status(500).json({ error: "BOT_TOKEN topilmadi" });
    }

    // 1. Bugungi g'olibni aniqlash
    const { data: topUsers, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (topUsers && topUsers.length > 0 && topUsers[0].score > 0) {
      const winner = topUsers[0];
      const today = new Date().toLocaleDateString('uz-UZ');

      const captionText = 
        `🎉 *TABRIKLAYMIZ, KUN CHEMPIONI!* 🎉\n\n` +
        `Siz bugun SMART AREA o'yinida *${winner.score} ball* to'plab, 1-o'rinni egalladingiz!\n\n` +
        `🎖 *Kun Chempioni Sertifikati* sizga taqdim etildi.\n` +
        `📅 Sana: ${today}\n\n` +
        `O'yinda faol qatnashganingiz uchun tashakkur! 🚀`;

      // Telegram Bot orqali g'oliblarga xabar yuborish
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: winner.user_id,
          text: captionText,
          parse_mode: 'Markdown'
        })
      });
    }

    // 2. Yangi kun uchun barcha ballarni 0 ga tushirish
    const { data: allUsers } = await supabase.from('leaderboard').select('id');
    if (allUsers && allUsers.length > 0) {
      const ids = allUsers.map(u => u.id);
      await supabase.from('leaderboard').update({ score: 0 }).in('id', ids);
    }

    return res.status(200).json({ success: true, message: "Yuborildi va ballar 0 ga tushirildi" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
        }

