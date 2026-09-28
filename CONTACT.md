# Réception des demandes par email

Le formulaire envoie ses champs en POST à `contact.php`. PHP valide les données,
puis transmet un email texte à une adresse personnelle fixe. Le visiteur ne peut
pas choisir le destinataire. Son adresse est placée dans `Reply-To` : le bouton
Répondre de la messagerie permet de lui répondre directement.

## Configuration sur l'hébergement

1. Utiliser un hébergement exécutant une version maintenue de PHP 8 et proposant
   un service d'envoi pour la fonction `mail()`. GitHub Pages et Live Server ne
   peuvent pas exécuter ce fichier PHP. Garder le formulaire et PHP sur le même domaine.
2. Copier `contact-config.example.php` en `contact-config.php`, uniquement sur
   l'hébergement. Renseigner `recipient` avec l'adresse personnelle de réception
   et `sender` avec une adresse du domaine autorisée par l'hébergeur.
3. Déployer `index.html`, `styles.css`, `main.js`, `contact.js`, `contact.php` et la
   configuration. Ne pas servir les fichiers PHP comme de simples fichiers statiques.
4. Activer HTTPS. Vérifier la configuration email du domaine (SPF/DKIM et les
   consignes de l'hébergeur). Si `mail()` est indisponible, il faudra remplacer le
   transport par un envoi SMTP authentifié, par exemple avec PHPMailer.
5. Faire un envoi de test autorisé, vérifier la réception et les indésirables,
   puis vérifier que Répondre cible bien l'adresse du visiteur.

La configuration personnelle est exclue de Git. Aucun mot de passe de la boîte
personnelle n'est demandé. Sans adresses configurées, le serveur refuse l'envoi
avec un statut 503 : il ne simule pas une réussite.

## Comportement

- Validation côté serveur des champs obligatoires, types, longueurs, email et
  téléphone ; rejet des retours à la ligne dans les champs courts.
- Email en texte brut UTF-8, encodé en base64 ; pas de HTML fourni par le visiteur.
- Champ invisible contre certains robots. Ce filtre seul ne bloque pas tous les
  spams : prévoir une limitation de débit côté hébergeur avant ouverture au public,
  puis une protection supplémentaire si nécessaire.
- En JavaScript : état d'envoi, blocage des doubles clics, message de retour et
  conservation des champs en cas d'erreur. Aucun nouvel envoi automatique.
- Sans JavaScript : soumission POST et page de résultat PHP.
- Aucune sauvegarde en base de données et aucun accusé de réception envoyé au visiteur.

`mail()` retourne une acceptation par le service d'envoi, pas une garantie de
livraison dans la boîte personnelle : https://www.php.net/manual/fr/function.mail.php

## Vérification avant activation

- Exécuter `php -l contact.php` et `php -l contact-config.example.php`.
- Vérifier les réponses 405 (GET), 422 (champs invalides ou champ invisible rempli)
  et 503 (configuration absente ou transport indisponible).
- Vérifier le formulaire sur ordinateur et mobile, avec et sans JavaScript.
- Tester un message accentué et multiligne sur l'hébergement de destination.

L'environnement de préparation ne dispose pas de PHP : le traitement serveur
et la réception réelle restent à vérifier sur l'hébergement. Les contrôles locaux
portent sur la syntaxe JavaScript, ses retours simulés et le câblage HTML.
