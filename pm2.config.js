module.exports = {
  apps: [
    {
      name: 'foodia-mobile-prod',
      script: 'node_modules/next/dist/bin/next',
      args: ['start', '-p', '3005'],
    },
  ],
};
