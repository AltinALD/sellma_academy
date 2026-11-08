<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

if (trim((string)($data['website'] ?? '')) !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$name = trim((string)($data['name'] ?? ''));
$phone = trim((string)($data['phone'] ?? ''));
$digits = preg_replace('/\D+/', '', $phone);

if (mb_strlen($name) < 2 || strlen($digits) < 8) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'missing']);
    exit;
}

$level = ($data['level'] ?? '') === 'pro' ? 'pro' : 'beginner';

$entry = [
    'id' => bin2hex(random_bytes(4)),
    'name' => mb_substr($name, 0, 80),
    'phone' => mb_substr($phone, 0, 30),
    'city' => mb_substr(trim((string)($data['city'] ?? '')), 0, 60),
    'instagram' => mb_substr(trim((string)($data['instagram'] ?? '')), 0, 40),
    'level' => $level,
    'workshop' => 'Prishtina 9 November 2026',
    'created' => date('c'),
];

$dir = __DIR__ . '/data';
if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
    exit;
}

$file = $dir . '/bookings.json';
$bookings = [];
if (is_file($file)) {
    $decoded = json_decode((string)file_get_contents($file), true);
    if (is_array($decoded)) {
        $bookings = $decoded;
    }
}

$bookings[] = $entry;
$written = file_put_contents(
    $file,
    json_encode($bookings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
    LOCK_EX
);

if ($written === false) {
    http_response_code(500);
    echo json_encode(['ok' => false]);
    exit;
}

echo json_encode(['ok' => true, 'id' => $entry['id']]);
