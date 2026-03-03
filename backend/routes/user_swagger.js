module.exports = {
    paths: {
        '/users/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Daftar akun baru',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', example: 'moci@gmail.com' },
                                    password: { type: 'string', example: '123' }
                                }
                            }
                        }
                    }
                },
                responses: { 201: { description: 'Berhasil daftar' } }
            }
        },
        '/users/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Masuk ke sistem',
                security: [],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', example: 'moci@gmail.com' },
                                    password: { type: 'string', example: '123' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Berhasil login' } }
            }
        },
        '/users/refresh-token': {
            post: {
                tags: ['Authentication'],
                summary: 'Perbarui access token',
                security: [], // Pastikan di route backend, endpoint ini TIDAK dipasang middleware auth
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['refreshToken'],
                                properties: {
                                    refreshToken: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: { 200: { description: 'Token diperbarui' } }
            }
        }
    }
};