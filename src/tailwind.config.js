/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./**/*.{js,jsx,ts,tsx,html}"
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary-color)',
                secondary: 'var(--secondary-color)',
                accent: 'var(--accent-color)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out',
                'slide-up': 'slideUp 0.5s ease-out',
                'bounce-slow': 'bounce 3s infinite',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },
            boxShadow: {
                'custom': '0 4px 16px 0 rgba(80, 80, 180, 0.10)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
            },
        },
    },
    plugins: [],
}; 