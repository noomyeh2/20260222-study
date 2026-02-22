# 배포 가이드 (GitHub → Vercel)

## 새 기능 추가 후 배포 흐름

### 1. 로컬에서 확인
```bash
npm run dev
```
브라우저에서 http://localhost:3000 접속하여 새 기능이 잘 동작하는지 확인

### 2. GitHub에 푸시
```bash
git add .
git status          # 변경된 파일 확인
git commit -m "feat: 다크 모드 토글 추가"
git push
```

### 3. Vercel 자동 배포
- GitHub에 푸시하면 Vercel이 자동으로 새 배포를 시작합니다
- Vercel 대시보드에서 배포 진행 상황 확인
- 완료되면 Production URL에서 확인 가능

### 4. Supabase Redirect URL (최초 1회)
Vercel 배포 URL이 바뀌었다면 Supabase에서 설정:
1. Supabase → Authentication → URL Configuration
2. Redirect URLs에 `https://your-app.vercel.app/**` 추가
