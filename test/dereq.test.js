import dereq from '../src/dereq.js';

describe('dereq testing', () => { 
    test('create with valid host', () => {
        const requests = dereq('10.16.0.140').end();
        expect(requests).toEqual({});
    });

    test('create with dns host', () => {
        const requests = dereq('google.com').end();
        expect(requests).toEqual({});
    });

    test('create with invalid host', () => {        
        expect(() => dereq('10.1116.0.140', 5002, 'http').end()).toThrow(TypeError);
    });

    test('create with function', () => {
        const _ = dereq('jsonplaceholder.typicode.com')
            .root({
                get: {
                    todos: (count) => `todos/${count}`
                }
            });

        expect(_.get.todos(1))
            .toBe('https://jsonplaceholder.typicode.com/todos/1');
    });

    test('create with groups', () => {
        const _ = dereq('10.16.0.140', 9001)
            .group('list', {
                get: {
                    list: 'get-list',
                    create: 'get-empty-list',
                },
                post: {
                    save: 'save-list',
                }
            })
            .group('ports', {
                get: {
                    ports: 'get-ports',
                }
            })
            .end();
        expect(_).toEqual({
            list: {
                get: {
                    list: 'https://10.16.0.140:9001/list/get-list',
                    create: 'https://10.16.0.140:9001/list/get-empty-list',
                },
                post: {
                    save: 'https://10.16.0.140:9001/list/save-list',
                }
            },
            ports: {
                get: {
                    ports: 'https://10.16.0.140:9001/ports/get-ports',
                }
            }
        });
    });
});