import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import fsdImportPlugin from 'eslint-plugin-fsd-import';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      'fsd-import': fsdImportPlugin,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caveats": false
      }],
      
      // 상대 경로 규칙
      'fsd-import/fsd-relative-path': ['error', { 
        alias: '@' // 프로젝트의 alias 설정 (예: '@'가 src 폴더를 가리키는 경우)
      }],
      
      // 레이어 import 규칙
      'fsd-import/layer-imports': ['error', {
        alias: '@',
        ignoreImportPatterns: [] // 예외로 허용할 패턴 추가 가능
      }],
      
      // public API import 규칙
      'fsd-import/public-api-imports': ['error', {
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/*.stories.*', '**/StoreDecorator.tsx']
      }]
    },
  },
];

export default eslintConfig;
