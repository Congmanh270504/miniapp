/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // adjust to your folders
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            screens: {
                '4k': '2500px', // breakpoint cho màn hình lớn hơn 24 inch
            },
        },
    },
    plugins: [
        require('tailwindcss-motion'),
    ],
};
