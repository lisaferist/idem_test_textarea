const editor = document.getElementById('editor');
const dropdown = document.getElementById('dropdown');
const mirror = document.getElementById('mirror');

const users = [
  {id: 1, name: 'Анна Петрова', username: 'annpetrova'},
  {id: 2, name: 'Алексей Чудаков', username: 'alexchudo'},
  {id: 3, name: 'Михаил Боярский', username: 'dartanian'},
  {id: 4, name: 'Олег Петров', username: 'olegp'},
  {id: 5, name: 'Федор Большаков', username: 'bigfedor'},
  {id: 6, name: 'Данил Колбасенко', username: 'danilkolbasenko'},
  {id: 7, name: 'Юлий Коньков', username: 'juliy'}
]
let atPos = -1
function editorOnchange()  {
  const text = editor.value;
  const cursorPos = editor.selectionStart;
  atPos = text.lastIndexOf('@', cursorPos - 1);

  if (atPos !== -1) {
    const query = text.substring(atPos + 1, cursorPos);
    showDropdown(query)
  } else {
    hideDropdown()
  }
}
editor.addEventListener('input', editorOnchange)

function hideDropdown() {
  dropdown.style.display = 'none';
}

function showDropdown(query) {
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().startsWith(query.toLowerCase()) ||
    user.name.toLowerCase().startsWith(query.toLowerCase()));

  // если необходимо, чтобы ФИО или username содержал вводимый текст,
  // но необязательно начинался с него:

  // const filteredUsers = users.filter(user =>
  //   user.username.toLowerCase().includes(query.toLowerCase()) ||
  //   user.name.toLowerCase().includes(query.toLowerCase()));

  if (filteredUsers.length === 0) {
    hideDropdown();
  } else {
    renderList(filteredUsers);
    positionDropdown(query.length);
  }
}

function renderList(users) {
  dropdown.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.innerText = `${user.name} (@${user.username})`;
    li.onclick = () => insertMention(user.username);
    dropdown.appendChild(li);
  })

  dropdown.style.display = 'block';
}

function positionDropdown(insertionLength) {
  // для позиционирования списка под курсором
  mirror.textContent = editor.value.substring(0, atPos + insertionLength);

  // для позиционирования списка под собачкой
  // mirror.textContent = editor.value.substring(0, atPos);

  const marker = document.createElement('span');
  marker.textContent = '@';
  mirror.appendChild(marker);

  dropdown.style.left = (marker.offsetLeft + 20)+ 'px';
  dropdown.style.top = (marker.offsetTop + 20 - editor.scrollTop) + 'px';
}

function insertMention(username) {
  const text = editor.value;
  const cursorPos = editor.selectionStart;
  const before = text.substring(0, atPos);
  const after = text.substring(cursorPos);

  editor.value = before + '@' + username + ' ' + after;
  hideDropdown();
  editor.focus();

  const newPos = (before + '@' + username + ' ').length;
  editor.setSelectionRange(newPos, newPos);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideDropdown();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('#dropdown')) hideDropdown();
});

dropdown.addEventListener('focusout', () => {
  hideDropdown();
})