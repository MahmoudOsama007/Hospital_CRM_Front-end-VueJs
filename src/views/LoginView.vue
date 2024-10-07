<template>
    <div v-if="!isAuthenticated" class="form-section centered-form">
        <h2 class="form-title">Login</h2>
        <form @submit.prevent="handleLogin">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input
                    type="text"
                    class="form-control"
                    id="username"
                    v-model="loginData.username"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="loginData.password"
                    required
                />
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        </form>
    </div>
</template>

<script>
import auth from '../store/auth'

export default {
    name: 'LoginView',
    data() {
        return {
            loginData: {
                username: '',
                password: '',
            },
            isAuthenticated: false,
        }
    },
    created() {
        // If user is already authenticated, redirect to home
        this.isAuthenticated = auth.isAuthenticated()
        if (this.isAuthenticated) {
            this.$router.push('/home')
        }
    },
    methods: {
        handleLogin() {
            fetch('http://localhost:5140/api/Account/LogIn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.loginData),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to log in')
                    }
                    return response.json()
                })
                .then((data) => {
                    console.log('API Response:', data) // Log the API response
                    if (data.token) {
                        // Safely get the first role from the roles array
                        const userRole =
                            data.roles && data.roles.length > 0
                                ? data.roles[0]
                                : null
                        auth.login(data.token, data.username, userRole) // Store username and role
                        this.isAuthenticated = true // Update local state
                        this.$router.push('/home') // Redirect to home
                    } else {
                        alert(
                            'Login failed! Please check your username and password.'
                        )
                    }
                })
                .catch((error) => {
                    console.error('Error:', error)
                    alert(
                        'An error occurred during login. Please try again later.'
                    )
                })
        },
    },
}
</script>

<style scoped>
.centered-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 400px;
}

.form-section {
    padding: 20px;
    background-color: #f8f9fa; /* Light background */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
}

.form-title {
    margin-bottom: 20px;
    font-size: 1.5rem;
    color: #333; /* Darker color for better contrast */
}
</style>
