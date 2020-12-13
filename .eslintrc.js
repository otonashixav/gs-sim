module.exports = {
	plugins: [
		"@typescript-eslint/eslint-plugin",
		"eslint-plugin-tsdoc"
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname,
		sourceType: "module"
	},
	rules: {
		"semi": "off",
		"@typescript-eslint/semi": "error",
		"tsdoc/syntax": "warn",
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/explicit-member-accessibility": "error",
		"@typescript-eslint/typedef": [
			"error",
			{
				"parameter": true,
				"propertyDeclaration": true,
				"variableDeclaration": true,
				"memberVariableDeclaration": true
			}
		]
	}
};
