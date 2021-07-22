module.exports = {
  apps : [
      {
        name: "sporttery2",
        script: "./server/index.js",
        watch: true,
        env: {
            "PORT": 8701,
            "NODE_ENV": "development"
        },
        env_production: {
            "PORT": 8700,
            "NODE_ENV": "production"
        }
      }
  ]
}