# TemBoddari-Server
🕹 [템보따리] 써보고 좋았던 것만, 우리끼리 같이 사는 추천 & 공구 서비스

**기획 의도**:
- 그룹 기반 추천 제품 정보를 제공하고, 함께 구매할 사람들을 모으는 공동구매 커뮤니티 구축
- 프디아 6기 내에서 다양한 아이템에 대한 궁금증이 자연스럽게 공동구매로 이어지는 모습 발견!
- 진솔한 사용 경험을 공유하고, 이를 기반으로 공동구매까지 연결할 수 있는 서비스의 필요성 인식

### Team Member

| 김지수 | 김태헌 | 박순영 | 지민선 | 
| :---: | :---: | :---: | :---: |
| PM, Full-Stack, Infra | Full-Stack | Full-Stack | Design, Full-Stack |
| <img src="https://avatars.githubusercontent.com/u/86948824?v=4" alt="김지수 프로필" width="180" height="180"> | <img src="https://github.com/user-attachments/assets/5090cbd2-9798-4776-ac2f-c6c8abdce005" alt="김태헌 프로필" width="180" height="180"> | <img src="https://github.com/user-attachments/assets/566743ca-11b2-4eda-a2f8-4bf59ed7df86" alt="박순영 프로필" width="180" height="180"> | <img src="https://github.com/user-attachments/assets/5cddbbee-c285-43fb-b68d-66dcc0de1d82" alt="지민선 프로필" width="180" height="180"> |
| [Jixoo-IT](https://github.com/Jixoo-IT) | [slay1379](https://github.com/slay1379) | [ruluralaa](https://github.com/ruluralaa) | [jiminseon](https://github.com/jiminseon) |


### 개발 기간
2025.06.24 - 2025.07.01

### 활용 기술 및 도구

- **Frontend**: Next.js, JavaScript
- **Backend**: Express, Node.js, MongoDB, Mongoose, Cloudinary
- **Infra**: EC2, Github Actions
- **Collaboration**: GitHub, Notion
---

<br/>

## 실행 화면 

| 그룹 생성 | 그룹 참여 |
|:---------:|:---------:|
| <img src="" width="450"> | <img src="" width="450"> |
| 추천 생성 | 공구 생성 |
| <img src="" width="450"> | <img src="" width="450"> |
| 공구 리스트 | 추천 리스트 |
| <img src="" width="450"> | <img src="" width="450"> |

<br/>

## 시연 영상
https://github.com/user-attachments/assets/8e178f82-b3ff-4cf5-b23a-0afe285b9f19


## 프로젝트 개요

### 1️⃣ 기획 의도
- 그룹 기반으로 신뢰할 수 있는 추천 제품 정보를 제공하고, 함께 구매할 사람들을 모으는 공동구매 커뮤니티 구축
- 단순한 광고가 아닌 진솔한 사용 후기 중심의 정보 공유
- 개인의 만족스러운 경험을 바탕으로 다른 사용자와 연결되는 구조 설계

<br/>

### 2️⃣ 기능 소개
1. 👤 **유저**
   - 회원가입, 로그인, 마이페이지 기능
   - 자신이 참여한 그룹/공구/추천글 확인 가능

2. 👥 **그룹**
   - 사용자가 직접 그룹 생성 및 참여 가능 (초대코드 기반)
   - 그룹 내에서만 볼 수 있는 전용 추천/공구 콘텐츠 존재

3. 📝 **추천**
   - 사용자가 제품을 추천하고 내용을 입력하면, URL을 통해 이미지 자동 수집
   - 추천 리스트는 그룹별로 확인 가능하며, ‘탐나요’ 버튼을 통해 인기순 정렬

4. 🛒 **공구**
   - 추천 제품을 기반으로 공동구매 시작 가능
   - 참여 인원, 마감 기한, 배송비 등 조건 입력
   - 마감 임박 순, 참여 많은 순 정렬 기능 제공


<br/>

### 3️⃣ 기대효과
#### 📱 [기술적 기대효과]
1. **풀스택 개발 역량 강화**
   - 프론트엔드와 백엔드를 모두 직접 구현하여, 전체 흐름을 수직적으로 경험
   - Cloudinary 연동을 통해 외부 API 및 미디어 처리에 대한 이해도 향상
   - GitHub Actions, EC2 기반의 실 CI/CD 구성 경험

2. **서비스 구조 이해도 향상**
  - 사용자 흐름을 고려한 기능 설계 및 구현
  - 그룹-추천-공구 흐름에 맞는 데이터 모델 설계


#### 🧩 [사회적 기대효과]
1. **신뢰 기반 소비**
   - 직접 써본 사람들이 공유하는 경험을 바탕으로, 보다 믿을 수 있는 제품 추천 가능
2. **합리적 소비**
   - 공동구매를 통해 가격을 절감하고 배송비를 나눌 수 있는 구조
3. **커뮤니티 강화**
   - 같은 그룹 내에서의 관심사 기반 공유와 참여로 유대감 형성

<br/>


### 4️⃣ 프로젝트 구조

#### ERD
![image](https://github.com/user-attachments/assets/aedd8c22-30cb-43c3-8104-d633eed74a30)

#### 아키텍처
![image](https://github.com/user-attachments/assets/85de6dd5-6c72-46a8-93d5-27806a297156)

