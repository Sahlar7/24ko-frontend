import React, {useState, useEffect} from "react";
import './fade.css';
const Notification = ({ message, setMessage }) => {
    const [fade, setFade] = useState('fade-in');

    useEffect(() => {
        const timer = setTimeout(() => {
          setFade('fade-out');
          setTimeout(() => {
            setMessage('');
            setFade('fade-in');
          }, 500);
        }, 2000);
    
        return () => clearTimeout(timer);
      }, [message, setMessage]);

  return (
    <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-100 text-red-800 px-4 py-2 rounded shadow-md
          }`}
        >
            {message && (
            <span className={fade}>{message}</span>
            )}
        </div>
  );
};
export default Notification;