/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brutalist palette
                'brutal-black': '#000000',
                'brutal-white': '#ffffff',
                'brutal-gray': '#f0f0f0',
            },
            fontFamily: {
                mono: ['"Courier New"', 'Courier', 'monospace'], // Brutalist feel
            }
        },
    },
    plugins: [],
}
