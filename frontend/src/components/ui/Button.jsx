const Button = ({ text, color }) => {
    return (
        <button
            className={`bg-${color}`}
        >
            {text}
        </button>
    );
};

export default Button;
