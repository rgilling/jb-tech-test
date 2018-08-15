module.exports = {
  "extends": "airbnb-base",
  "env": {
      "es6": true,
      "browser": true
  },
  "rules": {
      "brace-style": [
          "error",
          "stroustrup"
      ],
      "comma-dangle": [
          "error",
          "never"
      ],
      "no-unused-vars": [
          "warn"
      ],
      "no-var": [
          "off"
      ],
      "one-var": [
          "off"
      ],
      "global-require": [
        "off"
      ],
      "import/no-dynamic-require": ["off"],
      "no-param-reassign": ["off"],
      "import/no-extraneous-dependencies": ["off"]
  }
}