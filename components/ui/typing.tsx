import React from 'react'
import { Typewriter } from 'react-simple-typewriter';

type Props = {
    words: string[];
}

const Typing = ({ words }: Props) => {

    return (
        <p className='whitespace-pre-lines'>
            <Typewriter
                words={words}
                typeSpeed={15}
                delaySpeed={0}
                loop={1}
            />
        </p>
    )
}

export default Typing