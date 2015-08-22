
module.exports = {
    build: {
        isomorphic: true,
        server: {
            compressionLevel: 0,
        },
        libs: [
            'bower_components/firebase/firebase-debug.js',
            'node_modules/react/dist/react-with-addons.js'
        ]
    },
    release: {
        isomorphic: true,
        server: {
            compressionLevel: 9,
        },
        webpack: {
            dedupe: true,
            uglify: true,
            debug: false
        },
        inline: {
            css: true,
            js: true,
            libs: true,
            assets: true
        },
        libs: [
            'bower_components/firebase/firebase.js',
            'node_modules/react/dist/react-with-addons.min.js'
        ],
        assets: [
            'node_modules/bootstrap/fonts'
        ]
    }
};
