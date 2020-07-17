import React from 'react';

export default function Header({ title, children }) {
    return (
        <header>
            <h1>{title}</h1>
            {children}
        </header>
    );
}

/*
export default function Header({ title, children }) {
    return (
        <header>
            <h1>{title}</h1>
            {children}
        </header>
    );
}



export default function Header({props}){
    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    );



    export default function Header({title}){
    return (
        <header>
            <h1>{title}</h1>
        </header>
    );
}

*/
