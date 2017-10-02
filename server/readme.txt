 To deploy:
 1. Uncomment the _config in client/package.json
 2. ionic build
 3. Copy the client/www to server/public
 4. Start server
 5. ssh -R 8080:localhost:8080 serveo.net