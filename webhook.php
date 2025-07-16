<?php
date_default_timezone_set("America/Sao_Paulo");

// Captura IP do visitante
$ip = $_SERVER['REMOTE_ADDR'];

// Usa API de localização por IP (ip-api.com)
$geo = json_decode(file_get_contents("http://ip-api.com/json/{$ip}?fields=status,country,regionName,city,query"), true);

$pais = $geo['country'] ?? 'Desconhecido';
$cidade = $geo['city'] ?? 'Desconhecida';
$regiao = $geo['regionName'] ?? '';
$ip_exibido = $geo['query'] ?? $ip;

$localizacao = "$cidade, $regiao - $pais";

// Navegador / Dispositivo (User-Agent)
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Desconhecido';

// Detecta marca do dispositivo
$marca = 'Desconhecida';
if (stripos($userAgent, 'Samsung') !== false) {
    $marca = 'Samsung';
} elseif (stripos($userAgent, 'iPhone') !== false) {
    $marca = 'iPhone';
} elseif (stripos($userAgent, 'Windows NT') !== false) {
    $marca = 'PC Windows';
} elseif (stripos($userAgent, 'Macintosh') !== false) {
    $marca = 'Mac';
} elseif (stripos($userAgent, 'Android') !== false) {
    $marca = 'Android (genérico)';
}

// Idioma do navegador (HTTP_ACCEPT_LANGUAGE)
$idioma = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? 'Desconhecido';

// Data e hora do acesso
$dataHora = date("d/m/Y H:i:s");

// Webhook do Discord
$webhookURL = "https://discord.com/api/webhooks/1395040328104411216/0Hn1FtZ5x9iRMK-fHeoTU9jtO2q2bhm9_Ht7_nuZA7JzA0nlRop8eTyPOEYPVXSGufAC";

// Monta a mensagem com embed e explicações
$mensagem = [
    "embeds" => [[
        "title" => "📥 Novo acesso ao site",
        "color" => hexdec("FF69B4"),
        "fields" => [
            [
                "name" => "📅 Data e Hora",
                "value" => "$dataHora\n*Quando a pessoa acessou o site.*",
                "inline" => true
            ],
            [
                "name" => "🌐 IP",
                "value" => "$ip_exibido\n*Endereço IP público do visitante.*",
                "inline" => true
            ],
            [
                "name" => "📍 Localização",
                "value" => "$localizacao\n*Localização aproximada baseada no IP (cidade, estado e país).*",
                "inline" => false
            ],
            [
                "name" => "🖥️ Navegador / Dispositivo",
                "value" => "$userAgent\n*Informações completas do navegador e dispositivo usados.*",
                "inline" => false
            ],
            [
                "name" => "📱 Marca do Dispositivo",
                "value" => "$marca\n*Marca/modelo aproximado do dispositivo que acessou o site.*",
                "inline" => true
            ],
            [
                "name" => "🌐 Idioma do Navegador",
                "value" => "$idioma\n*Idioma preferido configurado no navegador do visitante.*",
                "inline" => true
            ],
        ],
        "footer" => [
            "text" => "Acesso monitorado para segurança e análise.",
        ],
        "timestamp" => date("c")
    ]]
];

// Enviar para o Discord
$options = [
    "http" => [
        "header"  => "Content-type: application/json",
        "method"  => "POST",
        "content" => json_encode($mensagem)
    ]
];

$context = stream_context_create($options);
file_get_contents($webhookURL, false, $context);
?>
