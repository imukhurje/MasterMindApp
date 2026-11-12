module.exports = {
  presets: ['module:@react-native/babel-preset'],

  plugins: [
    // Keep the classic JSX transform used by the existing project.
    ['@babel/plugin-transform-react-jsx', { runtime: 'classic' }],

    // Transform static class blocks used by packages such as laravel-echo.
    '@babel/plugin-transform-class-static-block',

    // Reanimated plugin must always be last.
    'react-native-reanimated/plugin',
  ],
};
