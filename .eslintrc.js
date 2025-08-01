module.exports = {
	root: true,

	env: {
		browser: true,
		es6: true,
		node: true,
	},

	extends: [
		'eslint:recommended',
	],

	rules: {
		'prefer-const': 'error',
		'no-var': 'error',
		'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
	},

	// Игнорируем TypeScript файлы пока не настроены плагины
	ignorePatterns: ['**/*.ts', '**/*.d.ts'],
}; 