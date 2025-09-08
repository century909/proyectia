import React, { forwardRef } from 'react';
import './ChatInput.scss';

const ChatInput = forwardRef(({ 
  value, 
  onChange, 
  onSubmit, 
  disabled,
  placeholder = "Type your message...",
  ...props 
}, ref) => {
  return (
    <form onSubmit={onSubmit} className="chat-input-form">
      <div className="chat-input-container">
        <textarea
          ref={ref}
          value={value}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault(); // Prevent new line
              onSubmit(e); // Trigger form submission
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          className="chat-input-textarea"
          {...props}
        />
        <button 
          type="submit" 
          disabled={disabled || !value?.trim()}
          className="chat-input-button"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            className="chat-input-icon"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </form>
  );
});

export default ChatInput;