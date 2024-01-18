import React, { memo } from 'react'

const Button = ({ text, iconBefore, iconAfter, styles, handleClick }) => {
    return (
        <button
            type='button'
            className={`flex items-center justify-center gap-1 rounded-md flex-none px-1 ${styles ? styles : 'bg-blue-500 text-white'}`}
            onClick={handleClick && handleClick}
        >
            {iconBefore && <span>{iconBefore}</span>}
            <span>{text}</span>
            {iconAfter && <span>{iconAfter}</span>}

        </button>
    )
}

export default memo(Button)