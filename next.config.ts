import type { NextConfig } from "next";
import webpack from "webpack";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Exclude Node.js modules from client-side bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        child_process: false,
        worker_threads: false,
      };
      
      // Ignore Node.js file system modules when bundling for client
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /^@nodelib\/fs\./,
        }),
        new webpack.IgnorePlugin({
          resourceRegExp: /^fast-glob$/,
        })
      );
    }
    return config;
  },
};

export default nextConfig;
