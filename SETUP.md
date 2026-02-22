# Supabase 인증 및 데이터베이스 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인
2. **New Project** 클릭
3. 프로젝트 이름, 비밀번호, 리전 설정 후 생성

## 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 값을 입력하세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**값 확인 방법:**
- Supabase 대시보드 → **Project Settings** → **API**
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. 이메일 인증 설정 (선택)

Supabase는 기본적으로 이메일 확인을 요구합니다. 개발 시 비활성화하려면:

1. Supabase 대시보드 → **Authentication** → **Providers** → **Email**
2. **Confirm email** 옵션 끄기

## 4. 메모 테이블 생성 (선택)

메모를 데이터베이스에 저장하려면:

1. Supabase 대시보드 → **SQL Editor**
2. `supabase-schema.sql` 파일 내용 복사 후 실행

## 5. 실행

```bash
npm install
npm run dev
```

- **로그인**: http://localhost:3000/auth/login
- **회원가입**: http://localhost:3000/auth/signup
