module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'api.seaocelot.com', 'flask-general.s3.amazonaws.com'],
  },
  publicRuntimeConfig: {
    SERVER_API: process.env.SERVER_API
  },
}
