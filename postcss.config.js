const stylelint = require("stylelint");
const postcssCssnext=require("postcss-cssnext")
module.exports = {
  plugins:  [
    require('precss'),
    require('postcss-custom-media'),
    require('lost'),
    require('postcss-short'),
    require('postcss-css-variables'),
    require('postcss-nested'),
    require('postcss-import'),
    postcssCssnext({
      browsers:['last 2 versions', '> 5%'],
    }),
    // stylelint({
    //   rules: {
    //     "font-family-name-quotes": "always-where-required",
    //     "function-url-quotes": "always",
    //     "selector-attribute-quotes": "always",
    //     "selector-max-compound-selectors": 3,
    //     "custom-media-pattern": ".+",
    //     "selector-max-specificity": "0,2,0",
    //     "unit-whitelist": ["em", "rem", "%", "px", "ms"],
    //     "indentation": [2, {
    //       "message": "Please use 4 spaces for indentation.",
    //       "severity": "warning"
    //     }]
    //   },
    // })
  ]
}
