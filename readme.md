# tinymonad
A simple no frills implementation of common Monads (Maybe, Result) and some
methods to enable writing safer code.

```sh
npm install tinymonad --save
yarn add tinymonad
bower install tinymonad --save
```
## Usage

### Javascript

```javascript
var m = require('tinymonad');
var value = m.Some('value');
value.map((v) => console.log(v));
```
```sh
Output should be 'value'
```

### TypeScript

```typescript
import { Some, Meybe } from 'tinymonad';
const value: Maybe<string> = Some('value');
value.map((v) => console.log(v));
```
```sh
Output should be 'value'
```
