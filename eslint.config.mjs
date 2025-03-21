import { FlatCompat } from "@eslint/eslintrc";
import fsdImportPlugin from 'eslint-plugin-fsd-import';
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({ extends: ['next/core-web-vitals', 'next/typescript'],
    rules: {
      "@typescript-eslint/no-unused-vars": ["off"],
      "@typescript-eslint/no-explicit-any": ["off"],
    }
  }),
  {
    plugins: {
      'fsd-import': fsdImportPlugin,
    },
    rules: {
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
      }]
    },
  },
];

export default eslintConfig;