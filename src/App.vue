<template>
    <div id="app">
        <!-- Conditionally render NavBar only if the user is authenticated -->
        <NavBar v-if="isAuthenticated" />

        <!-- Wrap the router-view to center all views except login -->
        <div
            :class="{ 'centered-container': !isLoginPage }"
            class="content-container"
        >
            <router-view />
        </div>
    </div>
</template>

<script>
import NavBar from './components/NavBar.vue'

export default {
    components: {
        NavBar,
    },
    data() {
        return {
            isAuthenticated: false,
        }
    },
    computed: {
        isLoginPage() {
            return this.$route.name === 'login' // Ensure correct check for login page
        },
    },
    watch: {
        $route() {
            // Watch route changes to update authentication status
            this.isAuthenticated = !!localStorage.getItem('token')
        },
    },
    created() {
        // Check if user is authenticated on app load
        this.isAuthenticated = !!localStorage.getItem('token')
    },
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

.centered-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh; /* Adjust to fit your design */
}
</style>
