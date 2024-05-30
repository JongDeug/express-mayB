module.exports = {
    apps: [
        {
            name: 'my-app',
            script: 'yarn',
            exec_mode: 'cluster',
            args: 'node src/index.js',
            watch: true,
            instances: 3,
        },
    ],
};
