import { dereq, makeOrigin, fmtPathName, fmtURL, fmtBody } from "../src/dereq";

test('test empty requests', () => { 
    const server = makeOrigin('localhost');
    expect(dereq(server, [])).toStrictEqual({});
});

test('test create origin', () => {
    const server = makeOrigin('jsonplaceholder.typicode.com');
    expect(server).toStrictEqual({
        ip: 'jsonplaceholder.typicode.com',
        port: '',
        protocol: 'https'
    });
});

test('test format pathname', () => {
    expect(fmtPathName([])).toBe('/');
    expect(fmtPathName(['users'])).toBe('/users/');
    expect(fmtPathName(['users', 'posts'])).toBe('/users/posts/');
});

test('test format url', () => {
    const server = makeOrigin('jsonplaceholder.typicode.com');
    expect(fmtURL(server, [], 'posts'))
        .toBe('https://jsonplaceholder.typicode.com/posts');

    expect(fmtURL(server, ['users'], 'posts'))
        .toBe('https://jsonplaceholder.typicode.com/users/posts');

    expect(fmtURL(server, ['users', 'posts'], 'posts'))
        .toBe('https://jsonplaceholder.typicode.com/users/posts/posts');
});

test('test format body', () => {
    const server = makeOrigin('jsonplaceholder.typicode.com');

    expect(fmtBody(server, 
        [], 
        {
            get: {
                posts: 'posts'
            },
            post: {
                posts: 'posts'
            }
        }
    )).toStrictEqual({
        get: {
            posts: 'https://jsonplaceholder.typicode.com/posts'
        },
        post: {
            posts: 'https://jsonplaceholder.typicode.com/posts'
        }
    });

    expect(fmtBody(server, 
        ['users'], 
        {
            get: {
                posts: 'posts'
            },
            post: {
                posts: 'posts'
            }
        }
    )).toStrictEqual({
        get: {
            posts: 'https://jsonplaceholder.typicode.com/users/posts'
        },
        post: {
            posts: 'https://jsonplaceholder.typicode.com/users/posts'
        }
    })
});

test('test empty group requests', () => { 
    const server = makeOrigin('jsonplaceholder.typicode.com');

    expect({
        jsonplaceholder: 
            dereq(server, [
                [],
                {
                    get: {
                        posts: 'posts'
                    },
                    post: {
                        posts: 'posts'
                    }
                }
            ])
        })
    .toStrictEqual({
        jsonplaceholder: {
            get: {
                posts: 'https://jsonplaceholder.typicode.com/posts'
            },
            post: {
                posts: 'https://jsonplaceholder.typicode.com/posts'
            }
        }
    });
});