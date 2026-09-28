<?php
declare(strict_types=1);

// Une réponse JSON pour fetch(), une page lisible si JavaScript est désactivé.
function respond(int $status, string $message): void
{
    http_response_code($status);
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    if (strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false) {
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode(['ok' => $status === 200, 'message' => $message]);
    } else {
        header('Content-Type: text/html; charset=UTF-8');
        $safeMessage = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
        echo '<!doctype html><html lang="fr"><meta charset="utf-8">'
            . '<meta name="viewport" content="width=device-width,initial-scale=1">'
            . '<title>Contact</title><main><h1>Votre demande</h1><p>'
            . $safeMessage . '</p><p><a href="index.html">Retour au site</a></p>'
            . '<p>En cas d’erreur, utilisez le bouton Retour de votre navigateur pour retrouver le formulaire.</p>'
            . '</main></html>';
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, 'Veuillez utiliser le formulaire de contact.');
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) {
    respond(413, 'Votre demande est trop volumineuse.');
}

// Ne jamais faire confiance aux seules vérifications du navigateur.
function field(string $name, int $maxBytes, bool $multiline = false): string
{
    $value = $_POST[$name] ?? '';
    if (!is_string($value) || strlen($value) > $maxBytes
        || preg_match('//u', $value) !== 1
        || preg_match($multiline ? '/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/' : '/[\x00-\x1F\x7F]/', $value)) {
        respond(422, 'Un champ contient une valeur invalide ou trop longue.');
    }
    return trim($value);
}

// Champ invisible : filtre simple contre certains robots, pas un CAPTCHA.
if (field('website', 500) !== '') {
    respond(422, 'La demande n’a pas pu être validée.');
}

$firstName = field('prenom', 400);
$lastName = field('nom', 400);
$phone = field('portable', 40);
$email = field('email', 254);
$message = field('message', 20000, true);

if ($firstName === '' || $lastName === '' || $message === ''
    || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || !preg_match('/\A[+0-9(). \-]{6,40}\z/', $phone)
    || strlen(preg_replace('/\D/', '', $phone)) < 6) {
    respond(422, 'Vérifiez les champs obligatoires, votre email et votre téléphone.');
}

// Le destinataire est fixé sur le serveur, jamais fourni par le visiteur.
$configFile = __DIR__ . '/contact-config.php';
$config = is_file($configFile) ? require $configFile : [];
$recipient = is_array($config) ? ($config['recipient'] ?? '') : '';
$sender = is_array($config) ? ($config['sender'] ?? '') : '';
foreach ([$recipient, $sender] as $address) {
    if (!is_string($address) || preg_match('/[\r\n\x00]/', $address)
        || !filter_var($address, FILTER_VALIDATE_EMAIL)) {
        respond(503, 'Le formulaire est temporairement indisponible. Veuillez réessayer plus tard.');
    }
}

$body = "Nouvelle demande depuis le site\n\n"
    . "Prénom : $firstName\nNom : $lastName\nTéléphone : $phone\nEmail : $email\n\n"
    . "Message :\n$message\n";
$headers = [
    'From' => $sender,
    'Reply-To' => $email,
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => 'base64',
];

// mail() utilise le service d'envoi de l'hébergeur. Aucun mot de passe de
// messagerie personnelle n'est nécessaire. Ne pas ajouter de paramètres shell.
$accepted = false;
try {
    $accepted = function_exists('mail') && @mail(
        $recipient,
        'Nouvelle demande de contact - site web',
        chunk_split(base64_encode($body)),
        $headers
    );
} catch (Throwable $error) {
    // Ne pas exposer la configuration ou les données personnelles au navigateur.
    error_log('Contact: mail transport failed.');
}

if (!$accepted) {
    respond(503, 'L’envoi a échoué. Votre message n’a pas été transmis. Veuillez réessayer plus tard.');
}

// Acceptation par le serveur d'envoi, pas confirmation de réception en boîte.
respond(200, 'Votre demande a été prise en charge pour envoi. Merci de votre message.');
