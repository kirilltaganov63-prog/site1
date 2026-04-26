<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false]); exit; }
$data = json_decode(file_get_contents('php://input'), true) ?: [];
$phone = $data['phone'] ?? '';
if (!$phone || strlen(preg_replace('/\D/', '', $phone)) < 10) { http_response_code(400); echo json_encode(['ok'=>false,'error'=>'bad_phone']); exit; }
$token = getenv('TELEGRAM_BOT_TOKEN');
$chatId = getenv('TELEGRAM_CHAT_ID');
if (!$token || !$chatId) { http_response_code(500); echo json_encode(['ok'=>false,'error'=>'telegram_not_configured']); exit; }
$text = "🪑 Новая заявка с сайта Марго\n📞 Телефон: {$phone}\n🌐 Страница: ".($data['page'] ?? '');
$url = "https://api.telegram.org/bot{$token}/sendMessage";
$payload = json_encode(['chat_id'=>$chatId,'text'=>$text], JSON_UNESCAPED_UNICODE);
$ch = curl_init($url);
curl_setopt_array($ch, [CURLOPT_POST=>true, CURLOPT_HTTPHEADER=>['Content-Type: application/json'], CURLOPT_POSTFIELDS=>$payload, CURLOPT_RETURNTRANSFER=>true]);
$result = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); curl_close($ch);
if ($code < 200 || $code >= 300) { http_response_code(502); echo json_encode(['ok'=>false,'error'=>'telegram_error']); exit; }
echo json_encode(['ok'=>true]);
?>
