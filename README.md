# 🧪 Lab Playground: Web Architecture & Security Lab

> **Access/Refresh Token 기반 보안 체계 개선부터 핵심 기능(OAuth2, RBAC, 이미지 업로드, 대댓글)까지 실험하고 검증하는 풀스택 토이 프로젝트입니다.**  
> 향후 결제 시스템, 예약 시스템 등 다양한 비즈니스 로직을 계속해서 확장·실험할 예정입니다.

---

## 📸 System Overview

[(전체 메인 화면 또는 주요 기능 동작 Gif/이미지)]

---

## 🛠 Tech Stack

### Frontend
- **Framework / Library**: React
- **State Management**: Zustand (로그인 상태, AccessToken 만료 시간 관리)
- **Data Fetching**: React Query (유저 정보 및 서버 데이터 캐싱/동기화)

### Backend & Database
- **Framework**: Spring Boot
- **Database**: MySQL
- **In-Memory Store**: Redis (Docker Container 기반 Refresh Token 관리)
- **Security**: Spring Security, JWT (JSON Web Token), OAuth2 Client

### Infrastructure & DevOps
- **Container**: Docker (Redis)

---

## 🚀 Key Features & Architecture

### 1. 보안 중심의 인증/인가 시스템 (RTR & OAuth2)
- **보안 구조 개선 (Local Store → RTR)**:
  - 기존 LocalStorage 저장 방식의 보안 취약점을 개선하기 위해 **Refresh Token Rotation (RTR)** 구조 도입
  - Docker 기반 **Redis**를 활용해 Refresh Token의 TTL(Time-To-Live) 관리 및 빠른 검증 수행
- **OAuth2 소셜 로그인**: Google OAuth2를 통한 간편 로그인 지원
- **동적 권한 승격 (RBAC & Dynamic Key Verification)**:
  - 일반 사용자 로그인 후 `/admin` 페이지 접근
  - 전용 `ActivateKey` 입력 성공 시 DB의 사용자 Role을 `ROLE_ADMIN`으로 즉시 승격
  - 권한 변경이 반영된 신규 JWT 토큰 재발급을 통한 관리자 전용 기능 제어

```
[Client (React)]             [Server (Spring Boot)]            [Google / DB / Redis]
       │                               │                                │
       │─── 1. Google 로그인 요청 ────>│                                │
       │                               │─── 2. 유저 정보 조회 ─────────>│ (Google)
       │                               │─── 3. 유저 & RT 저장 ─────────>│ (DB / Redis)
       │<── 4. Access/Refresh 발급 ────│                                │
       │                               │                                │
       │─── 5. 토큰 재발급 (/reissue)─>│                                │
       │                               │─── 6. RT 교체 (Rotation) ─────>│ (Redis)
       │<── 7. 신규 토큰 전달 ─────────│                                │
```

---

### 2. 클라이언트 상태 관리 이원화
- **Zustand**: 로그인 여부, AccessToken 만료 시각(남은 로그인 시간 타이머) 등 전역 UI 상태 관리
- **React Query**: 유저 프로필 등 서버 데이터의 비동기 상태 관리 및 Caching 처리

[(남은 로그인 시간 타이머가 동작하는 UI 및 Zustand/React Query 상태 관리 구조 이미지)]

---

### 3. 커뮤니티 게시판 (이미지 첨부 및 대댓글)
- **이미지 업로드**: Multipart/Data 기반 로컬 파일 시스템 저장 처리
- **계층형 대댓글 Structure**: 게시글 내 무제한/다단계 대댓글 유연한 데이터 구조 설계 및 조회

[(이미지가 첨부된 게시글 상세 화면 및 대댓글 구조 캡처 이미지)]

---

### 4. 동적 권한 승격 관리자 페이지
- `/admin` 전용 인가 라우팅
- 보안 키(ActivateKey) 검증을 통한 실시간 권한 변경 및 토큰 교환 UI

[(Admin 페이지에서 ActivateKey 입력 및 ROLE_ADMIN 승격 성공 UI 이미지)]

---

## 🏗 System Architecture Sequence
```
[Client (React)]             [Server (Spring Boot)]             [Google OAuth2]         [MySQL DB]           [Redis]
       │                               │                               │                    │                   │
       │─── 1. Google 로그인 요청    ──>│                               │                    │                   │
       │                               │─── 2. User 정보 조회   ───────>│                    │                   │
       │                               │<── 3. User 정보 (email, name)  │                    │                   │
       │                               │                                                    │                   │
       │                               │─── 4. User 정보 저장 및 업데이트    ────────────────>│                   │
       │                               │<── 5. 유저 entity 반환    ──────────────────────────│                   │
       │                               │                                                                        │
       │                               │─── 6. Acess & Refresh Token 생성                                       │
       │                               │─── 7. Refresh Token 저장   ───────────────────────────────────────────>│
       │<── 8. 토큰 쿠기 전달 및    ────│                                                                        │
       │    리다이렉트                  │                                                                        │
       │                               │                                                                        │
       │─── 9. Admin Key 입력  ───────>│                                                                        │
       │                               │─── 10. User Role Admin 등업    ───────────────────────────────────────>│
       │<── 11. Admin 토큰 쿠기 발급  ──│                                                                        │
```

## 📌 Roadmaps & Future Experiments

현재 프로젝트는 확장형 테스트베드로 운영되고 있으며, 지속적으로 다음 기능들을 추가 및 테스트할 예정입니다.

- [x] **JWT Refresh Token Rotation (Redis) & OAuth2**
- [x] **RBAC 권한 동적 승격 및 관리자 페이지**
- [x] **로컬 이미지 첨부 게시판 및 대댓글**
- [ ] **장바구니 & 결제 시스템**
- [ ] **동시성 제어를 고려한 예약 시스템**
- [ ] **S3 / Cloud Storage 기반 이미지 업로드 이관**
