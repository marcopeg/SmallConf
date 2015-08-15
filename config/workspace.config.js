
module.exports = {
    build: {
        isomorphic: false,
        compressionLevel: 9,
        libs: [
            'bower_components/firebase/firebase-debug.js',
            'node_modules/react/dist/react-with-addons.js'
        ]
    },
    release: {
        isomorphic: true,
        compressionLevel: 9,
        webpack: {
            dedupe: true,
            uglify: false,
            debug: false
        },
        inline: {
            css: false,
            js: false,
            libs: false,
            assets: false
        },
        libs: [
            'bower_components/firebase/firebase.js',
            'node_modules/react/dist/react-with-addons.min.js'
        ]
    }
};
