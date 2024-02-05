# dereq
Declarative library for describing endpoints.

## Install

npm:
```sh
npm install dereq
```

yarn:
```sh
yarn add dereq
```

## Usage

Describe your request scheme

```js
import { dereq } from 'dereq';

export const requests = dereq('10.16.0.140', 9001)
    .group('list', {
        get: {
            list: 'get-list',
            create: 'get-empty-list'
        },
        post: {
            save: 'save-list',
        }
    })
    .group('ports', {
        get: {
            ports: (count) => `get-ports?count=${count}`,
        }
    })
    .end();
```

And send your requests to any place

```js
import { requests } from 'requests';

const createList = async () => {
    try {
        const response = await fetch(requests.list.get.create);
        const answer = await response.json();
        console.log(answer);
    } catch (error) {
        console.error(error);
    }
}
```

```js
import { requests } from 'requests';
import axios from 'axios';

const createList = async () => {
    try {
        const response = await axios.get(requests.list.get.create);
        console.log(response);
    } catch (error) {
        console.error(error);
    }
}
```

## License

[MIT](LICENSE)