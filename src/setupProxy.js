const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(
        createProxyMiddleware('http://localhost:8080/api/XXX-server', {
            pathRewrite: { '^/api/XXX-server/': '/' },
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:8080/ws/XXX-server', {
            pathRewrite: { '^/ws/XXX-server/': '/' },
            ws: true,
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:9000/api/gateway', {
            pathRewrite: { '^/api/gateway/': '/' },
        })
    );
    app.use(

        ('http://localhost:9000/ws/gateway', {
            pathRewrite: { '^/ws/gateway/': '/' },
            ws: true,
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:5025/api/config', {
            pathRewrite: { '^/api/config/': '/' },
            headers: { userId: 'John' },
        })
    );
    app.use(
        createProxyMiddleware('http://localhost:5024/ws/config-notification', {
            pathRewrite: { '^/ws/config-notification/': '/' },
            headers: { userId: 'John' },
            ws: true,
        })
    );
};
