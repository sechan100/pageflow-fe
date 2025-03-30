import { FlatCompat } from "@eslint/eslintrc";
import fsdImportPlugin from 'eslint-plugin-fsd-import';
import importPlugin from 'eslint-plugin-import';
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
      "import": importPlugin
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
      }],
      // 특정 패턴의 import 제한
      'no-restricted-imports': ['error', 
        {
          patterns: [
            {
              group: [
                '../entities/**',
                '../../entities/**',
                '../../../entities/**', 
                '../../../../entities/**',
                '../../../../../entities/**',
                '../../../../../../entities/**',
                '../../../../../../../entities/**',
              ],
              message: '상대 경로 대신 @/entities/* 별칭을 사용하세요.'
            },
            {
              group: [
                '../features/**',
                '../../features/**',
                '../../../features/**', 
                '../../../../features/**',
                '../../../../../features/**',
                '../../../../../../features/**',
                '../../../../../../../features/**',
              ],
              message: '상대 경로 대신 @/features/* 별칭을 사용하세요.',
            },
            {
              group: [
                '../widgets/**',
                '../../widgets/**',
                '../../../widgets/**', 
                '../../../../widgets/**',
                '../../../../../widgets/**',
                '../../../../../../widgets/**',
                '../../../../../../../widgets/**',
              ],
              message: '상대 경로 대신 @/widgets/* 별칭을 사용하세요.'
            },
            {
              group: [
                '../app/**',
                '../../app/**',
                '../../../app/**', 
                '../../../../app/**',
                '../../../../../app/**',
                '../../../../../../app/**',
                '../../../../../../../app/**',
              ],
              message: '상대 경로 대신 @/app/* 별칭을 사용하세요.'
            },
            {
              group: [
                '../_pages/**',
                '../../_pages/**',
                '../../../_pages/**', 
                '../../../../_pages/**',
                '../../../../../_pages/**',
                '../../../../../../_pages/**',
                '../../../../../../../_pages/**',
              ],
              message: '상대 경로 대신 @/pages/* 별칭을 사용하세요.'
            },
            {
              group: [
                '../shared/**',
                '../../shared/**',
                '../../../shared/**', 
                '../../../../shared/**',
                '../../../../../shared/**',
                '../../../../../../shared/**',
                '../../../../../../../shared/**',
              ],
              message: '상대 경로 대신 @/shared/* 별칭을 사용하세요.'
            },
            {
              group: [
                '../global/**',
                '../../global/**',
                '../../../global/**', 
                '../../../../global/**',
                '../../../../../global/**',
                '../../../../../../global/**',
                '../../../../../../../global/**',
              ],
              message: '상대 경로 대신 @/global/* 별칭을 사용하세요.'
            }
          ]
        }
      ]
    },
  },
];

export default eslintConfig;