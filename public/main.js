const socket = io('http://localhost:3000', {
    autoConnect: false
})

socket.onAny((event, ...args) => {
    console.log(event, ...args);
})

// 전역 변수들
const chatBody = document.querySelector('.chat-body');
const userTitle = document.querySelector('#user-title');
const loginContainer = document.querySelector('.login-container');
const userTable = document.querySelector('.users');
const userTagline = document.querySelector('#users-tagline');
const title = document.querySelector('#active-user');
const messages = document.querySelector('.messages');
const msgDiv = document.querySelector('.msg-form');

// login form handler
const loginForm = document.querySelector('.user-login');
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // 리프레쉬 안되게 설정
    const name = document.getElementById('username');
    createSession(username.value.toLowerCase());
    username.value = '';

})

const createSession = async (username) => {
    const option = {
        method: 'Post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
    }

    await fetch('/session', option)
        .then(res => res.json())
        .then(data => {
            socketConnect(data.username, data.userID);

            // localStorage에 세션을 Set
            localStorage.setItem('session-username', data.username);
            localStorage.setItem('session-userID', data.userID);

            loginContainer.classList.add('d-none');
            chatBody.classList.remove('d-none');
            userTitle.innerHTML = data.username;
        })
        .catch(err => console.log(err))

}

const socketConnect = async (username, userID) => {
    socket.auth = { username, userID };
    await socket.connect();
}

socket.on('users-data', ({ users }) => {
    // 유저 본인 제거
    const index = users.findIndex(user => user.userID === socket.id);
    if (index > -1) users.splice(index, 1);

    // user table list 생성
    userTable.innerHTML = '';
    let ul = `<table class="table table-hover">`;
    for (const user of users) {
        ul += `<tr class="socket-users"
                onclick="setActiveUser(this, '${user.username}' , '${user.userID}')">
                <td>${user.username}<span class="text-danger ps-1 d-none"
                id="${user.userID}">!</span></td>
             </tr> `;
    }
    ul += `</table>`;
    if (users.length > 0) {
        userTable.innerHTML = ul;
        userTagline.innerHTML = '접속 중인 유저'
        userTagline.classList.remove('text-danger');
        userTagline.classList.add('text-success');
    } else {
        userTagline.innerHTML = '접속 중인 유저 없음';
        userTagline.classList.remove('text-success');
        userTagline.classList.add('text-danger');
    }
})

// 페이지 리프레쉬 했을때 자동 로그인
const sessUsername = localStorage.getItem('session-username');
const sessUserID = localStorage.getItem('session-userID');
if (sessUsername && sessUserID) {
    socketConnect(sessUsername, sessUserID);

    loginContainer.classList.add('d-none');
    chatBody.classList.remove('d-none');
    userTitle.innerHTML = sessUsername;
}
