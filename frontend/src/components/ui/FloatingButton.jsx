const FloatingButton = ({ text, color, onClick, className = '' }) => {
    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg 
        bg-gradient-to-b ${color} text-white text-xs font-bold
        transition-all duration-200 ease-in-out
        hover:scale-110 hover:shadow-xl
        active:scale-105 active:brightness-90 ${className}`}
      >
        {text}
      </button>
    );
  };
  
  export default FloatingButton;
