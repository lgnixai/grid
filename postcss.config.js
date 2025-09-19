export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {
            overrideBrowserslist: [
                'Chrome > 31',
                'Firefox > 31',
                'Safari > 8',
                '> 1%',
            ],
            grid: true,
        },
    },
}