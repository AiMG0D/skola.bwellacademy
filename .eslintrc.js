module.exports = {
  root: true,
  env: {
    node: true,
  },
  globals: {
    $: 'readonly',
    $$: 'readonly',
    $ref: 'readonly',
    $computed: 'readonly',
    $shallowRef: 'readonly',
    $customRef: 'readonly',
    $toRef: 'readonly',
    defineProps: 'readonly',
    defineEmits: 'readonly',
    withDefaults: 'readonly',
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/no-deprecated-slot-attribute': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/no-setup-props-destructure': 'off',
  },
  ignorePatterns: ['dist/**/*'],
};
