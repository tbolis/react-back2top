import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import Back2Top from '../src';

import './styles.css';

const Filler = ({title}: {title: string}) => (
    <section>
        <h2>{title}</h2>
        {Array.from({length: 6}, (_, i) => (
            <p key={i}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur turpis in arcu
                consectetur, a mollis erat rhoncus. Suspendisse quam turpis, cursus et sapien dignissim, ornare
                suscipit lectus. Ut elementum felis ac magna fringilla, a semper lacus commodo.
            </p>
        ))}
    </section>
);

const Demo = () => {
    const [clicks, setClicks] = useState(0);

    return (
        <main>
            <h1>react-back2top</h1>
            <p>Scroll down. Three buttons demonstrate different configurations.</p>

            {/* Defaults: appears after 400px, 300ms fade, 800ms scroll */}
            <Back2Top>&#8679;</Back2Top>

            {/* Custom class, earlier visibility, faster scroll, onClick callback */}
            <Back2Top
                className='pill'
                visibilityHeight={200}
                scrollDuration={300}
                fadeDuration={600}
                onClick={() => setClicks(c => c + 1)}>
                Top ({clicks})
            </Back2Top>

            {/* Inline style, custom aria-label, instant scroll */}
            <Back2Top
                className='round'
                visibilityHeight={600}
                scrollDuration={0}
                aria-label='Jump to the top of the page'
                style={{fontWeight: 600}}>
                Instant
            </Back2Top>

            <Filler title='Defaults'/>
            <Filler title='Custom class, callback and durations'/>
            <p className='log'>onClick fired {clicks} time(s)</p>
            <Filler title='Instant scroll'/>
            <Filler title='More content'/>
        </main>
    );
};

createRoot(document.getElementById('root')!).render(<Demo/>);
