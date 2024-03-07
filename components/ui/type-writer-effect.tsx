import { useState, useEffect } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';

interface TypewriterProps {
  text: string;
}

const Typewriter: React.FC<TypewriterProps> = ({ text }) => {
  const [currentText, setCurrentText] = useState('');
  const controls = useAnimation();

  useEffect(() => {
    const addNextCharacter = async () => {
      for (const char of text) {
        setCurrentText((prevText) => prevText + char);
        await controls.start({ opacity: 1, x: 0 });
        await controls.start({ opacity: 0, x: '100%' });
      }
    };

    addNextCharacter();
  }, [text, controls]);

  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={controls}
      style={{ display: 'inline-block' }}
    >
      {currentText}
    </motion.div>
  );
};

export default Typewriter;
