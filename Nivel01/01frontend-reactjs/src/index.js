/*import {soma} from './soma';

const sub = (a,b)=>{
    return a-b;
}
console.log(soma(3,7));
console.log(sub(7,3));
*/

import React from 'react';
import {render} from 'react-dom';

import App from './App';

//JSX: HTML dentro do JS
render(<App />,document.getElementById('app'));