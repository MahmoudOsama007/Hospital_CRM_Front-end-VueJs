import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import AreaManagement from '../components/AreaManagement.vue'
import CompanyManagement from '../components/CompanyManagement.vue'
import CityManagement from '../components/CityManagement.vue'
import auth from '../store/auth'
import LoginView from '../views/LoginView.vue'
import CustomerManagement from '../views/CustomerManagement.vue'
import CallType from '../components/CallType.vue'
import CallAbout from '../components/CallAbout.vue'
import CallService from '../components/CallService.vue'
import NewTicket from '../views/NewTicket.vue'
import Hospital from '../components/HospitalForm.vue' // Import the new view
import MajorSpecialist from '../components/MajorSpecialistForm.vue'
import MinorSpecialist from '../components/MinorSpecialistForm.vue'
import VerySpecificSpecialist from '../components/VerySpecificSpecialistForm.vue'
import DoctorComponent from '../components/DoctorForm.vue'
const routes = [
    {
        path: '/',
        redirect: '/login', // Redirect default route to login page
    },
    {
        path: '/doctor',
        name: 'DoctorComponent ',
        component: DoctorComponent, // Adjust the path accordingly
        meta: { requiresAuth: true },
    },
    {
        path: '/very-specific-specialist',
        name: 'VerySpecificSpecialist',
        component: VerySpecificSpecialist, // Adjust the path accordingly
        meta: { requiresAuth: true },
    },
    {
        path: '/minor-specialist',
        name: 'MinorSpecialistManagement',
        component: MinorSpecialist, // Adjust the path accordingly

        meta: { requiresAuth: true },
    },
    {
        path: '/major-specialist',
        name: 'MajorSpecialist',
        component: MajorSpecialist,
        meta: { requiresAuth: true },
    },
    {
        path: '/hospital',
        name: 'Hospital',
        component: Hospital,
        meta: { requiresAuth: true },
    },
    {
        path: '/home',
        name: 'home',
        component: Home,
        meta: { requiresAuth: true },
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
    },
    {
        path: '/area-management',
        name: 'area-management',
        component: AreaManagement,
        meta: { requiresAuth: true },
    },
    {
        path: '/company-management',
        name: 'company-management',
        component: CompanyManagement,
        meta: { requiresAuth: true },
    },
    {
        path: '/city-management',
        name: 'city-management',
        component: CityManagement,
        meta: { requiresAuth: true },
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/SettingsView.vue'), // Lazy load the component
        meta: { requiresAuth: true },
    },
    {
        path: '/customer-management',
        name: 'CustomerManagement',
        component: CustomerManagement,
        meta: { requiresAuth: true },
    },
    { path: '/call-type', component: CallType, meta: { requiresAuth: true } },
    { path: '/call-about', component: CallAbout, meta: { requiresAuth: true } },
    {
        path: '/call-service',
        component: CallService,
        meta: { requiresAuth: true },
    },
    {
        path: '/new-ticket',
        name: 'NewTicket',
        component: NewTicket,
        meta: { requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation Guard for Authentication
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!auth.isAuthenticated()) {
            next({ name: 'login' }) // Redirect to login if not authenticated
        } else {
            next() // Allow access if authenticated
        }
    } else {
        next() // Allow access for routes without 'requiresAuth'
    }
})

export default router
