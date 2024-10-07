<template>
    <nav
        class="navbar custom-navbar"
        style="width: 15%; height: 100vh; position: fixed"
    >
        <div
            class="container-fluid flex-column d-flex justify-content-between"
            style="height: 100%"
        >
            <div style="align-items: center; justify-content: space-around">
                <h1
                    class="navbar-brand"
                    style="font-weight: bold; cursor: pointer"
                >
                    <router-link class="nav-link" to="/">My CRM</router-link>
                </h1>

                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/about"
                            >About</router-link
                        >
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/settings"
                            >Settings</router-link
                        >
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/new-ticket"
                            >New Ticket</router-link
                        >
                    </li>
                </ul>
            </div>
            <div>
                <div class="user-info" v-if="isAuthenticated">
                    <div class="text-center mb-2">
                        <h5 class="mb-0">
                            <b>{{ username }}</b>
                        </h5>
                        <span class="badge bg-secondary">{{ role }}</span>
                    </div>
                </div>
                <button class="btn btn-outline-danger w-100" @click="logout">
                    Logout
                </button>
            </div>
        </div>
    </nav>
</template>

<script>
import auth from '../store/auth'

export default {
    data() {
        return {
            username: '',
            role: '',
            isAuthenticated: false,
        }
    },
    created() {
        this.isAuthenticated = auth.isAuthenticated()
        if (this.isAuthenticated) {
            const user = auth.getUser()
            this.username = user.username
            this.role = user.role
        }
    },
    methods: {
        logout() {
            auth.logout()
            this.$router.push('/') // Redirect to login
        },
    },
}
</script>

<style scoped>
.custom-navbar {
    background-color: #e6eaee; /* Customize your background color here */
    padding: 30px;
    height: 100vh; /* Full height for the navbar */
}

a {
    font-weight: bold;
    color: #2c3e50;
}

a:hover {
    font-weight: bold;
    color: #42b983;
}

.navbar .router-link-exact-active {
    font-weight: bold;
    color: #42b983;
}

.user-info {
    margin-bottom: 10px; /* Space between username/role and nav items */
}
</style>
