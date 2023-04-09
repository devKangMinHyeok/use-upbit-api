import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

import {TextEncoder, TextDecoder} from 'util';

(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
