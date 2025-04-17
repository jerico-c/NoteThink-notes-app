const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development', // Ubah ke 'production' saat build
    entry: './src/scripts/script.js', // Entry point aplikasi
    output: {
        filename: 'bundle.js', // Nama file output
        path: path.resolve(__dirname, 'dist'), // Folder output
        clean: true, // Membersihkan folder output sebelum build
    },
    devServer: {
        static: './dist', // Folder untuk menyajikan file statis
        open: true, // Membuka browser secara otomatis
        port: 3000, // Port untuk dev server
    },
    module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
            ],
          },
        ],
      },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Template HTML
            filename: 'index.html', // Nama file output HTML
        }),
    ],
};