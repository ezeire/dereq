import { dereq, makeOrigin, fmtPathName, fmtURL, fmtBody } from "../src/dereq";

describe('makeOrigin function:', () => {
    test('create with ip', () => {
        const server = makeOrigin('localhost');
        expect(server)
            .toEqual({ip: 'localhost', port: '', protocol: 'https'});
    });

    test('create with ip and port', () => {
        const server = makeOrigin('localhost', 3000);
        expect(server)
            .toEqual({ip: 'localhost', port: '3000', protocol: 'https'});
    });

    test('create with ip, port and protocol', () => {
        const server = makeOrigin('localhost', '5000', 'http');
        expect(server)
            .toEqual({ip: 'localhost', port: '5000', protocol: 'http'});
    });
});

describe('fmtPathName function:', () => {
    test('create with empty pathname', () => {
        expect(fmtPathName([]))
            .toBe('/');
    });

    test('create with single pathname', () => {
        expect(fmtPathName(['users']))
            .toBe('/users/');
    });

    test('create with multiple pathname', () => {
        expect(fmtPathName(['users', 'posts']))
            .toBe('/users/posts/');
    });
});

describe('fmtURL function:', () => {
    const _ = makeOrigin('jsonplaceholder.typicode.com');
    test('create with empty pathname', () => {
        expect(fmtURL(_, [], 'posts'))
            .toBe('https://jsonplaceholder.typicode.com/posts');
    });

    test('create with single pathname', () => {
        expect(fmtURL(_, ['users'], 'posts'))
            .toBe('https://jsonplaceholder.typicode.com/users/posts');
    });
    
    test('create with multiple pathname', () => {
        expect(fmtURL(_, ['users', 'posts'], 'posts'))
            .toBe('https://jsonplaceholder.typicode.com/users/posts/posts');
    });

    test('create with params', () => {
        expect(fmtURL(_, ['users', 'posts'], 'posts', '?limit=10'))
            .toBe('https://jsonplaceholder.typicode.com/users/posts/posts?limit=10');
    });
});

describe('fmtBody function:', () => {
    const _ = makeOrigin('jsonplaceholder.typicode.com');

    test('create with empty body', () => {
        expect(fmtBody(_, [], {})).toEqual({});
    });

    test('create with multiple body', () => {
        expect(fmtBody(_, 
            [], 
            {
                get: {
                    posts: 'posts'
                },
                post: {
                    posts: 'posts'
                }
            }
        )).toEqual({
            get: {
                posts: 'https://jsonplaceholder.typicode.com/posts'
            },
            post: {
                posts: 'https://jsonplaceholder.typicode.com/posts'
            }
        });
    });

    test('create with pathname', () => {
        expect(fmtBody(_,
            ['users'], 
            {
                get: {
                    posts: 'posts'
                }
            }
        )).toEqual({
            get: {
                posts: 'https://jsonplaceholder.typicode.com/users/posts'
            }
        });
    });

    test('create with multiple pathname', () => {
        expect(fmtBody(_, 
            ['users', 'posts'], 
            {
                get: {
                    posts: 'posts'
                }
            }
        )).toEqual({
            get: {
                posts: 'https://jsonplaceholder.typicode.com/users/posts/posts'
            }
        });
    });
});

describe('dereq function:', () => {

    test('create with empty body', () => {
        expect(dereq({
            origin: makeOrigin('jsonplaceholder.typicode.com'),
            endpoints: {}
        })).toEqual({});
    });

    test('create with empty path', () => {
        expect(dereq({
            origin: makeOrigin('jsonplaceholder.typicode.com'),
            endpoints: {
                users: [
                    [],
                    {
                        get: {
                            posts: 'posts'
                        }
                    }
                ]
            }
        })).toEqual({
            users: {
                get: {
                    posts: 'https://jsonplaceholder.typicode.com/posts'
                }
            }
        });
    });

    test('create with multiple path', () => {
        expect(dereq({
            origin: makeOrigin('jsonplaceholder.typicode.com'),
            endpoints: {
                users: [
                    ['users', 'posts'],
                    {
                        get: {
                            posts: 'posts'
                        }
                    }
                ]
            }
        })).toEqual({
            users: {
                get: {
                    posts: 'https://jsonplaceholder.typicode.com/users/posts/posts'
                }
            }
        });
    });

    test('create with multiple endpoints', () => {
        expect(dereq({
            origin: makeOrigin('jsonplaceholder.typicode.com'),
            endpoints: {
                users: [
                    ['users', 'posts'],
                    {
                        get: {
                            posts: 'posts'
                        }
                    }
                ],
                posts: [
                    ['posts'],
                    {
                        get: {
                            comments: 'comments'
                        }
                    }
                ]
            }
        })).toEqual({
            users: {
                get: {
                    posts: 'https://jsonplaceholder.typicode.com/users/posts/posts'
                }
            },
            posts: {
                get: {
                    comments: 'https://jsonplaceholder.typicode.com/posts/comments'
                }
            }
        })
    });

    test('create with function and call', () => {
        const _ = dereq({
            origin: makeOrigin('jsonplaceholder.typicode.com'),
            endpoints: {
                users: [
                    ['users'],
                    {
                        get: {
                            posts: (count) => `posts/${count}`
                        }
                    }
                ]
            }
        });

        expect(_.users.get.posts(20))
            .toBe('https://jsonplaceholder.typicode.com/users/posts/20');
    });
});