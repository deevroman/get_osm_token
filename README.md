
<h1 align="center">Get OSM OAuth Token</h1>


## Description
Extension to get OpenStreetMap's OAuth token in a couple of clicks

The expansion has two goals:

1. To prefill the fields when registering an OAuth application. All you have to do is to specify its name
2. Add a button to get OAuth token to the application page.

### How to use

0. Install the extension
1. Click the _Create OSM OAuth2 app_ button in the extension menu
2. Give it a name and the necessary permissions
3. After registering, click _Get OAuth token_.
4. Copy and paste it into your application.

For example, use this command in your terminal: 
```bash
curl -H "Authorization: Bearer <TOKEN>" https://master.apis.dev.openstreetmap.org/api/0.6/user/details.json
```

## Русское описание

Firefox-расширение для получения OAuth-токена OpenStreetMap в пару кликов.

### Как использовать

0. Установите расширение
1. Нажмите кнопку _Create OSM OAuth2 app_.
2. Дайте ему имя и нужные права
3. После регистрации нажмите _Get OAuth token_.
4. Скопирйте и вставьте его в ваше приложение.

Например, попробуйте выполнить в вашем терминале:
```bash
curl -H "Authorization: Bearer <TOKEN>" https://master.apis.dev.openstreetmap.org/api/0.6/user/details.json
```