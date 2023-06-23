module.exports = (api) => {
    return {
        plugins: [
            "postcss-import",
            "postcss-preset-env",
            "autoprefixer",
            "css-mqpacker",
            "cssnano"
        ]
    }
}