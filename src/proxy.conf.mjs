export default [
    {   // Proxy to the backend
        context: [
            '/api',
            '/my',
            '/many',
            '/endpoints',
            '/here'
        ],
        target: 'http://localhost:8080',
        secure: false
    }
];