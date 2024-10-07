// auth.js
export default {
    login(token, username, role) {
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        localStorage.setItem('role', role)
    },
    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('role')
    },
    isAuthenticated() {
        return !!localStorage.getItem('token')
    },
    getToken() {
        return localStorage.getItem('token')
    },
    getUser() {
        return {
            username: localStorage.getItem('username'),
            role: localStorage.getItem('role'),
        }
    },
}
