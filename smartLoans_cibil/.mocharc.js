module.exports = {
    extension: ['js'],
    reporter: "spec",
    spec: ['src/**/*.spec.js', 'src/**/*.test.js', 'test/**/*.test.js', 'specs/**/*.spec.js'],
    watchFiles: ['**/*.js'],
    watchIgnore: ['node_modules']
}