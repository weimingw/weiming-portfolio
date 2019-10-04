// library.webpack.config.js
const path = require('path');
const webpack = require('webpack');

module.exports = {
    context: process.cwd(),
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.less', '.css'],
        modules: [__dirname, 'node_modules']
    },

    entry: {
        library: [
            'vue',
            'vuex',
            "@fortawesome/fontawesome-svg-core",
            "@fortawesome/free-solid-svg-icons",
            'lodash',
            'src/lib/VueDatePicker/vuejs-datepicker.min',
        ]
    },
    output: {
        filename: '[name].dll.js',
        path: path.resolve(__dirname, './public/library'),
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: './public/library/[name].json'
        })
    ]
};