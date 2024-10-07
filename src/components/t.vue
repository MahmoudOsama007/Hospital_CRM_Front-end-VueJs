<!-- <script>
import auth from '../store/auth'

export default {
    data() {
        return {
            loginData: {
                username: '',
                password: '',
            },
        }
    },
    methods: {
        loadCompanies() {
            //auth.login();

            if (auth.isAuthenticated) {
                fetch('http://localhost:5140/api/Company', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        this.companies = data
                    })
                    .catch((error) => {
                        console.error('Error fetching companies:', error)
                    })
                    .catch((error) => console.error('Error:', error))
            } else {
                this.$router.push('/login')
            }
        },
    },
}
</script> -->

<!-- 
<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">My App</a>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
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
                        <router-link class="nav-link" to="/area-management"
                            >Manage Areas</router-link
                        >
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/city-management"
                            >Manage Cities</router-link
                        >
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/company-management"
                            >Manage Companies</router-link
                        >
                    </li>
                    <li class="nav-item">
                        <button class="btn btn-outline-danger" @click="logout">
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import auth from '../store/auth'

export default {
    methods: {
        logout() {
            auth.logout()
            localStorage.removeItem('token') // Remove the token from localStorage
            this.$router.push('/') // Redirect to login
        },
    },
}
</script>

<style scoped>
nav {
    padding: 30px;
}

a {
    font-weight: bold;
    color: #2c3e50;
}

.router-link-exact-active {
    color: #42b983;
}
</style>
 -->

<!-- Customer View  -->

<!-- <template>
    <div class="container mt-5">
        <div class="card p-4 shadow-sm">
            <h2 class="card-title">
                {{ isEditing ? 'Edit Customer' : 'Add New Customer' }}
            </h2>
            <form @submit.prevent="isEditing ? updateCustomer() : submitForm()">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            v-model="customerData.name"
                            class="form-control"
                            required
                        />
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="address" class="form-label">Address:</label>
                        <input
                            type="text"
                            id="address"
                            v-model="customerData.address"
                            class="form-control"
                            required
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="city" class="form-label">City:</label>
                        <select
                            id="city"
                            v-model="customerData.cityId"
                            @change="fetchAreas"
                            class="form-select"
                            required
                        >
                            <option value="" disabled>Select a city</option>
                            <option
                                v-for="city in cities"
                                :key="city.id"
                                :value="city.id"
                            >
                                {{ city.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="area" class="form-label">Area:</label>
                        <select
                            id="area"
                            v-model="customerData.areaId"
                            :disabled="!customerData.cityId"
                            class="form-select"
                            required
                        >
                            <option value="" disabled>Select an area</option>
                            <option
                                v-for="area in filteredAreas"
                                :key="area.id"
                                :value="area.id"
                            >
                                {{ area.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="company" class="form-label">Company:</label>
                        <select
                            id="company"
                            v-model="customerData.companyId"
                            class="form-select"
                            required
                        >
                            <option value="" disabled>Select a company</option>
                            <option
                                v-for="company in companies"
                                :key="company.id"
                                :value="company.id"
                            >
                                {{ company.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="phoneNumber" class="form-label"
                            >Phone Number:</label
                        >
                        <input
                            type="text"
                            id="phoneNumber"
                            v-model="customerData.phoneNumber"
                            class="form-control"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="otherPhoneNumber" class="form-label"
                            >Other Phone Number:</label
                        >
                        <input
                            type="text"
                            id="otherPhoneNumber"
                            v-model="customerData.otherPhoneNumber"
                            class="form-control"
                        />
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="landLineNumber" class="form-label"
                            >Landline Number:</label
                        >
                        <input
                            type="text"
                            id="landLineNumber"
                            v-model="customerData.landLineNumber"
                            class="form-control"
                        />
                    </div>
                </div>
                <div class="mb-3">
                    <label for="patientNumber" class="form-label"
                        >Patient Number:</label
                    >
                    <input
                        type="text"
                        id="patientNumber"
                        v-model="customerData.patientNumber"
                        class="form-control"
                    />
                </div>
                <button type="submit" class="btn btn-primary">
                    {{ isEditing ? 'Update Customer' : 'Add Customer' }}
                </button>
                <button
                    type="button"
                    class="btn btn-secondary ms-2"
                    v-if="isEditing"
                    @click="cancelEdit"
                >
                    Cancel
                </button>
            </form>
        </div>

        <div class="container mt-5">
            <div class="card mt-5 shadow-sm">
                <h2 class="card-title p-3">Customer List</h2>
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Area</th>
                            <th>Company</th>
                            <th>Phone Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in customers" :key="customer.id">
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.address }}</td>
                            <td>{{ getAreaName(customer.areaId) }}</td>
                            <td>{{ getCompanyName(customer.companyId) }}</td>
                            <td>{{ customer.phoneNumber }}</td>
                            <td>
                                <button
                                    @click="editCustomer(customer)"
                                    class="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </button>
                                <button
                                    v-if="!customer.isDeleted"
                                    @click="softDeleteCustomer(customer.id)"
                                    class="btn btn-danger btn-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    v-if="customer.isDeleted"
                                    class="btn btn-success btn-sm"
                                    @click="confirmRestoreCustomer(customer.id)"
                                >
                                    Restore
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isEditing: false, // Determines if we're editing an existing customer
            customerIdToEdit: null, // Stores the ID of the customer being edited
            customerData: {
                name: '',
                address: '',
                areaId: null,
                companyId: null,
                phoneNumber: '',
                otherPhoneNumber: '',
                landLineNumber: '',
                patientNumber: '',
                cityId: null, // New property to track selected city
            },
            cities: [],
            filteredAreas: [],
            companies: [],
            customers: [],
            allAreas: [], // Add this property to store all areas
        }
    },
    created() {
        this.fetchCities()
        this.fetchAreas()
        this.fetchCompanies()
    },
    methods: {
        async fetchCities() {
            const response = await fetch('http://localhost:5140/api/city')
            this.cities = await response.json()
        },
        async fetchAreas() {
            const response = await fetch('http://localhost:5140/api/area')
            this.allAreas = await response.json() // Store all areas here

            // If a city is selected, filter areas by that city.
            if (this.customerData.cityId) {
                this.filteredAreas = this.allAreas.filter(
                    (area) => area.cityId === this.customerData.cityId
                )
            } else {
                this.filteredAreas = []
                this.customerData.areaId = null
            }
        },
        async fetchCompanies() {
            const response = await fetch('http://localhost:5140/api/company')
            this.companies = await response.json()
        },
        async fetchCustomers() {
            const response = await fetch('http://localhost:5140/api/customer')
            this.customers = await response.json()
            console.log(this.customers)
        },
        async submitForm() {
            try {
                const response = await fetch(
                    'http://localhost:5140/api/customer',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                        body: JSON.stringify(this.customerData),
                    }
                )

                if (!response.ok) {
                    const errorData = await response.json()
                    console.error('Error details:', errorData)
                    throw new Error(
                        errorData.message || 'Error submitting form'
                    )
                }

                this.resetForm()
                alert('Customer added successfully!')
                await this.fetchCustomers()
            } catch (error) {
                console.error('Error submitting form:', error)
                alert('Error adding customer: ' + error.message)
            }
        },
        async editCustomer(customer) {
            this.isEditing = true
            this.customerIdToEdit = customer.id
            this.customerData = { ...customer }
            this.customerData.cityId = this.getCityIdFromArea(customer.areaId)
            await this.fetchAreas() // Fetch and filter areas after setting cityId
        },
        async updateCustomer() {
            try {
                const response = await fetch(
                    `http://localhost:5140/api/customer/${this.customerIdToEdit}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                        body: JSON.stringify(this.customerData),
                    }
                )

                if (!response.ok) {
                    const errorData = await response.json()
                    console.error('Error details:', errorData)
                    throw new Error(
                        errorData.message || 'Error updating customer'
                    )
                }

                this.resetForm()
                alert('Customer updated successfully!')
                await this.fetchCustomers()
            } catch (error) {
                console.error('Error updating customer:', error)
                alert('Error updating customer: ' + error.message)
            }
        },
        cancelEdit() {
            this.resetForm()
            this.isEditing = false
            this.customerIdToEdit = null
        },
        async softDeleteCustomer(customerId) {
            if (!confirm('Are you sure you want to delete this customer?'))
                return
            try {
                const response = await fetch(
                    `http://localhost:5140/api/customer/${customerId}/softdelete`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                )
                if (!response.ok) {
                    const errorData = await response.text() // Use text() instead of json() for debugging
                    console.error('Error details:', errorData)
                    throw new Error(
                        response.statusText || 'Error deleting customer'
                    )
                }
                alert('Customer deleted successfully!')
                await this.fetchCustomers()
            } catch (error) {
                console.error('Error deleting customer:', error)
                alert('Error deleting customer: ' + error.message)
            }
        },
        resetForm() {
            this.customerData = {
                name: '',
                address: '',
                areaId: null,
                companyId: null,
                phoneNumber: '',
                otherPhoneNumber: '',
                landLineNumber: '',
                patientNumber: '',
                cityId: null,
            }
            this.isEditing = false
        },
        getAreaName(areaId) {
            const area = this.allAreas.find((a) => a.id === areaId)
            return area ? area.name : 'N/A'
        },
        getCompanyName(companyId) {
            const company = this.companies.find((c) => c.id === companyId)
            return company ? company.name : 'N/A'
        },
        getCityIdFromArea(areaId) {
            const area = this.allAreas.find((a) => a.id === areaId)
            return area ? area.cityId : null
        },
        /********************************************************************/
        confirmRestoreCustomer(customerId) {
            fetch(`http://localhost:5140/api/Customer/${customerId}/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const customer = this.customers.find(
                            (c) => c.id === customerId
                        )
                        if (customer) customer.isDeleted = false
                    }
                })
                .catch((error) =>
                    console.error('Error restoring customer:', error)
                )
        },
        /*******************************************************************/
    },
    async mounted() {
        await this.fetchCities()
        await this.fetchCompanies()
        await this.fetchCustomers()
    },
}
</script> -->

<!-- Customer View V2 DATA to form  -->

<template>
    <div class="container mt-5">
        <div class="card p-4 shadow-sm">
            <h2 class="card-title">
                {{ isEditing ? 'Edit Customer' : 'Add New Customer' }}
            </h2>
            <form @submit.prevent="isEditing ? updateCustomer() : submitForm()">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label">Name:</label>
                        <input
                            type="text"
                            id="name"
                            v-model="customerData.name"
                            class="form-control"
                            required
                        />
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="address" class="form-label">Address:</label>
                        <input
                            type="text"
                            id="address"
                            v-model="customerData.address"
                            class="form-control"
                            required
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="city" class="form-label">City:</label>
                        <select
                            id="city"
                            v-model="customerData.cityId"
                            @change="fetchAreas"
                            class="form-select"
                            required
                        >
                            <option value="" disabled>Select a city</option>
                            <option
                                v-for="city in cities"
                                :key="city.id"
                                :value="city.id"
                            >
                                {{ city.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="area" class="form-label">Area:</label>
                        <select
                            id="area"
                            v-model="customerData.areaId"
                            :disabled="!customerData.cityId"
                            class="form-select"
                            required
                        >
                            <option value="" disabled>Select an area</option>
                            <option
                                v-for="area in filteredAreas"
                                :key="area.id"
                                :value="area.id"
                            >
                                {{ area.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="company" class="form-label">Company:</label>
                        <select
                            id="company"
                            v-model="customerData.companyId"
                            class="form-select"
                            required
                        >
                            <option value="" disabled>Select a company</option>
                            <option
                                v-for="company in companies"
                                :key="company.id"
                                :value="company.id"
                            >
                                {{ company.name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="phoneNumber" class="form-label"
                            >Phone Number:</label
                        >
                        <input
                            type="text"
                            id="phoneNumber"
                            v-model="customerData.phoneNumber"
                            class="form-control"
                        />
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="otherPhoneNumber" class="form-label"
                            >Other Phone Number:</label
                        >
                        <input
                            type="text"
                            id="otherPhoneNumber"
                            v-model="customerData.otherPhoneNumber"
                            class="form-control"
                        />
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="landLineNumber" class="form-label"
                            >Landline Number:</label
                        >
                        <input
                            type="text"
                            id="landLineNumber"
                            v-model="customerData.landLineNumber"
                            class="form-control"
                        />
                    </div>
                </div>
                <div class="mb-3">
                    <label for="patientNumber" class="form-label"
                        >Patient Number:</label
                    >
                    <input
                        type="text"
                        id="patientNumber"
                        v-model="customerData.patientNumber"
                        class="form-control"
                    />
                </div>
                <button type="submit" class="btn btn-primary">
                    {{ isEditing ? 'Update Customer' : 'Add Customer' }}
                </button>
                <button
                    type="button"
                    class="btn btn-secondary ms-2"
                    v-if="isEditing"
                    @click="cancelEdit"
                >
                    Cancel
                </button>
            </form>
        </div>

        <div class="container mt-5">
            <div class="card mt-5 shadow-sm">
                <h2 class="card-title p-3">Customer List</h2>
                <table class="table table-striped table-hover">
                    <thead class="table-dark">
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>City</th>
                            <!-- Added city column -->
                            <th>Area</th>
                            <th>Company</th>
                            <th>Phone Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="customer in customers" :key="customer.id">
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.address }}</td>
                            <td>{{ getCityName(customer.cityId) }}</td>
                            <!-- Display city -->
                            <td>{{ getAreaName(customer.areaId) }}</td>
                            <td>{{ getCompanyName(customer.companyId) }}</td>
                            <td>{{ customer.phoneNumber }}</td>
                            <td>
                                <button
                                    @click="editCustomer(customer)"
                                    class="btn btn-warning btn-sm me-2"
                                >
                                    Edit
                                </button>
                                <button
                                    v-if="!customer.isDeleted"
                                    @click="softDeleteCustomer(customer.id)"
                                    class="btn btn-danger btn-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    v-if="customer.isDeleted"
                                    class="btn btn-success btn-sm"
                                    @click="confirmRestoreCustomer(customer.id)"
                                >
                                    Restore
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isEditing: false,
            customerIdToEdit: null,
            customerData: {
                name: '',
                address: '',
                areaId: null,
                companyId: null,
                phoneNumber: '',
                otherPhoneNumber: '',
                landLineNumber: '',
                patientNumber: '',
                cityId: null,
            },
            cities: [],
            filteredAreas: [],
            companies: [],
            customers: [],
            allAreas: [],
        }
    },
    created() {
        this.fetchCities()
        this.fetchCompanies()
        this.fetchCustomers()
    },
    methods: {
        async fetchCities() {
            const response = await fetch('http://localhost:5140/api/city')
            this.cities = await response.json()
        },
        async fetchAreas() {
            const response = await fetch('http://localhost:5140/api/area')
            this.allAreas = await response.json() // Store all areas here

            // If a city is selected, filter areas by that city.
            if (this.customerData.cityId) {
                this.filteredAreas = this.allAreas.filter(
                    (area) => area.cityId === this.customerData.cityId
                )
            } else {
                this.filteredAreas = []
                this.customerData.areaId = null
            }
        },
        async fetchCompanies() {
            const response = await fetch('http://localhost:5140/api/company')
            this.companies = await response.json()
        },
        async fetchCustomers() {
            const response = await fetch('http://localhost:5140/api/customer')
            this.customers = await response.json()
            console.log(this.customers)
        },
        async submitForm() {
            try {
                const response = await fetch(
                    'http://localhost:5140/api/customer',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                        body: JSON.stringify(this.customerData),
                    }
                )

                if (!response.ok) {
                    const errorData = await response.json()
                    console.error('Error details:', errorData)
                    throw new Error(
                        errorData.message || 'Error submitting form'
                    )
                }

                this.resetForm()
                alert('Customer added successfully!')
                await this.fetchCustomers()
            } catch (error) {
                console.error('Error submitting form:', error)
                alert('Error adding customer: ' + error.message)
            }
        },
        async editCustomer(customer) {
            this.isEditing = true
            this.customerIdToEdit = customer.id
            this.customerData = { ...customer }
            this.customerData.cityId = this.getCityIdFromArea(customer.areaId)
            await this.fetchAreas()
        },
        async updateCustomer() {
            try {
                const response = await fetch(
                    `http://localhost:5140/api/customer/${this.customerIdToEdit}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                        body: JSON.stringify(this.customerData),
                    }
                )

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(
                        errorData.message || 'Error updating customer'
                    )
                }

                this.resetForm()
                alert('Customer updated successfully!')
                await this.fetchCustomers()
            } catch (error) {
                console.error('Error updating customer:', error)
                alert('Error updating customer: ' + error.message)
            }
        },
        async softDeleteCustomer(customerId) {
            if (!confirm('Are you sure you want to delete this customer?'))
                return
            try {
                const response = await fetch(
                    `http://localhost:5140/api/customer/${customerId}/softdelete`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                )
                if (!response.ok) {
                    const errorData = await response.text() // Use text() instead of json() for debugging
                    console.error('Error details:', errorData)
                    throw new Error(
                        response.statusText || 'Error deleting customer'
                    )
                }
                alert('Customer deleted successfully!')
                await this.fetchCustomers()
            } catch (error) {
                console.error('Error deleting customer:', error)
                alert('Error deleting customer: ' + error.message)
            }
        },
        confirmRestoreCustomer(customerId) {
            fetch(`http://localhost:5140/api/Customer/${customerId}/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const customer = this.customers.find(
                            (c) => c.id === customerId
                        )
                        if (customer) customer.isDeleted = false
                    }
                })
                .catch((error) =>
                    console.error('Error restoring customer:', error)
                )
        },
        resetForm() {
            this.isEditing = false
            this.customerIdToEdit = null
            this.customerData = {
                name: '',
                address: '',
                areaId: null,
                companyId: null,
                phoneNumber: '',
                otherPhoneNumber: '',
                landLineNumber: '',
                patientNumber: '',
                cityId: null,
            }
            this.filteredAreas = []
        },
        cancelEdit() {
            this.resetForm()
        },
        getCityIdFromArea(areaId) {
            const area = this.allAreas.find((a) => a.id === areaId)
            return area ? area.cityId : null
        },
        getCityName(cityId) {
            const city = this.cities.find((c) => c.id === cityId)
            return city ? city.name : 'Unknown'
        },
        getAreaName(areaId) {
            const area = this.allAreas.find((a) => a.id === areaId)
            return area ? area.name : 'N/A'
        },
        getCompanyName(companyId) {
            const company = this.companies.find((c) => c.id === companyId)
            return company ? company.name : 'Unknown'
        },
    },
}
</script>

<!-- 
restore


async editCustomer(customer) {
    this.isEditing = true
    this.customerIdToEdit = customer.id
    this.customerData = { ...customer }
    this.customerData.cityId = this.getCityIdFromArea(customer.areaId)
    await this.fetchAreas() // Ensure areas are fetched based on the city
    this.customerData.areaId = customer.areaId // Set areaId after fetching areas
}, -->

<!-- async editCustomer(customer) {
    this.isEditing = true
    this.customerIdToEdit = customer.id
    this.customerData = { ...customer }
    this.customerData.cityId = this.getCityIdFromArea(customer.areaId)
    await this.fetchAreas() // Ensure areas are fetched based on the city
    this.customerData.areaId = customer.areaId // Set areaId after fetching areas
}, -->
