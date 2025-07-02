/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  },
}

module.exports = nextConfig