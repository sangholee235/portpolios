import React from 'react';

const SocialLoginButton = ({ provider, onClick }) => {
  const buttonStyles = {
    kakao: {
      bgColor: 'bg-yellow-300',
      hoverColor: 'hover:bg-yellow-400',
      borderColor: 'border-yellow-400',
      textColor: 'text-black',
      icon: null
    },
    google: {
      bgColor: 'bg-white',
      hoverColor: 'hover:bg-gray-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-700',
      icon: 'https://www.google.com/favicon.ico'
    }
  };

  const style = buttonStyles[provider];

  return (
    <button 
      className={`w-full flex items-center justify-center px-4 py-2 border ${style.borderColor} rounded-md ${style.bgColor} ${style.hoverColor} transition-colors`}
      onClick={onClick}
    >
      {style.icon && (
        <img src={style.icon} alt={`${provider} icon`} className="w-5 h-5 mr-2" />
      )}
      <span className={style.textColor}>
        {provider === 'kakao' ? '카카오 로그인' : '구글 로그인'}
      </span>
    </button>
  );
};

export default SocialLoginButton;