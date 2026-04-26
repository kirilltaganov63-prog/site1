export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const { phone, page } = req.body || {};
  if (!phone || String(phone).replace(/\D/g, '').length < 10) return res.status(400).json({ ok: false, error: 'bad_phone' });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(500).json({ ok: false, error: 'telegram_not_configured' });
  const text = `🪑 Новая заявка с сайта Марго\n📞 Телефон: ${phone}\n🌐 Страница: ${page || ''}`;
  const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({chat_id:chatId,text}) });
  if (!tgRes.ok) return res.status(502).json({ ok:false, error:'telegram_error' });
  return res.status(200).json({ ok:true });
}
