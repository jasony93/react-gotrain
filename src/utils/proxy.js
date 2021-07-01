const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: "https://finance.naver.com/item/main.nhn?code=005930",
            changeOrigin: true,
            pathRewrite: {
                '^/api': '' // 하위 url 초기화
            }

        })

    );
};