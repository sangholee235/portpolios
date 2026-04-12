import React from 'react';
import { IoClose } from 'react-icons/io5';

const Modal = ({ 
    type = 'confirm',
    title,
    message,
    onClose,
    onConfirm,
    options,
    value,
    onChange,
    placeholder = "폴더명을 입력하세요",  // Add default placeholder
    children
}) => {
    const renderContent = () => {
        switch (type) {
            case 'confirm':
                return (
                    <div className="text-center my-5">
                        {message}
                    </div>
                );
            case 'select':
                return (
                    <div className="flex flex-col gap-3">
                        {options?.map((option, index) => (
                            <div 
                                key={index} 
                                className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                                onClick={() => onConfirm(option)}
                            >
                                <span className="mr-3">●</span>
                                {option.label}
                            </div>
                        ))}
                        <div 
                            className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer text-gray-600"
                            onClick={() => {
                                onClose();
                                onConfirm({ type: 'new_folder', showNameInput: true });
                            }}
                        >
                            <span className="mr-3 text-xl">+</span>
                            새 폴더 만들기
                        </div>
                    </div>
                );

            case 'edit':
                return (
                    <div className="my-5">
                        <input
                            type="text"
                            value={value || ''}
                            onChange={(e) => onChange && onChange(e)}
                            placeholder={placeholder}  // Use the placeholder prop
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            autoFocus
                        />
                        {/* Add validation error message when nickname exceeds 10 characters */}
                        {value && value.length > 15 && (
                            <div className="text-red-500 text-sm mt-2">15자 이하로 작성해 주세요.</div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[90%] md:w-[50%] shadow-lg">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        <IoClose />
                    </button>
                </div>

                {renderContent()}

                {(type === 'confirm' || type === 'edit') && (
                    <div className="flex justify-end mt-5">
                        <button
                            onClick={onConfirm}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg"
                            disabled={type === 'edit' && value && value.length > 15}
                        >
                            확인
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;