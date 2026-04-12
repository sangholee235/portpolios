importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js"
);

/**
 * https://github.com/CodeSoom/ConStu/issues/133
 * public디렉토리는 env로 환경변수 처리가 불가하며
 * firebase의 클라이언트단 api key는 공개되어도 무방함
 */
firebase.initializeApp({
  apiKey: "AIzaSyBkpeAuPG6D4TyeY6QCXRvBUqiNdOjRfeg",
  authDomain: "onegominsushi.firebaseapp.com",
  projectId: "onegominsushi",
  storageBucket: "onegominsushi.firebasestorage.app",
  messagingSenderId: "602248758411",
  appId: "1:602248758411:web:7a64976c5fb5bb0088c08e",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/pushlogo.png",
    data: {
      url: payload.data.url || "https://www.gomin.my/", // 기본값으로 메인 페이지 URL 설정
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 이벤트 처리 추가
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // 알림 닫기

  // 클릭 시 해당 URL로 이동
  const urlToOpen = event.notification.data.url;

  // 이미 열린 탭이 있는지 확인하고, 없으면 새 탭 열기
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        // 이미 열린 탭이 있는지 확인
        for (let client of windowClients) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // 열린 탭이 없으면 새 탭 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
