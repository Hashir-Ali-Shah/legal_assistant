import { motion } from 'framer-motion';

export default function Card({
    children,
    className = '',
    clickable = false,
    onClick,
    hover = true,
    ...props
}) {
    const baseStyles = 'bg-white border-2 border-gray-200 rounded-xl p-6 transition-all duration-300';
    const hoverStyles = hover ? 'hover:shadow-md' : '';
    const clickableStyles = clickable ? 'cursor-pointer hover:border-gray-400' : '';

    if (clickable) {
        return (
            <motion.div
                className={`${baseStyles} ${hoverStyles} ${clickableStyles} ${className}`}
                onClick={onClick}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
            {children}
        </div>
    );
}
