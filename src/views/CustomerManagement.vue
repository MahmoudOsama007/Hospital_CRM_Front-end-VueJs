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
                            <td>{{ customer.cityName }}</td>
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
                                    @click="confirmRestoreCustomer(customer.id)"
                                    class="btn btn-success btn-sm"
                                >
                                    Restore
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- <nav>
                <ul class="pagination">
                    <li
                        class="page-item"
                        :class="{ disabled: currentPage === 1 }"
                    >
                        <a class="page-link nav-link" @click="prevPage"
                            >Previous</a
                        >
                    </li>
                    <li
                        class="page-item"
                        v-for="page in totalPages"
                        :key="page"
                        :class="{ active: currentPage === page }"
                    >
                        <a class="page-link nav-link" @click="goToPage(page)">{{
                            page
                        }}</a>
                    </li>
                    <li
                        class="page-item"
                        :class="{ disabled: currentPage === totalPages }"
                    >
                        <a class="page-link nav-link" @click="nextPage">Next</a>
                    </li>
                </ul>
            </nav> -->
            <!-- <nav>
                <ul class="pagination">
                    <li
                        class="page-item"
                        :class="{ disabled: currentPage === 1 }"
                    >
                        <a class="page-link nav-link" @click="previousPage"
                            >Previous</a
                        >
                    </li>
                    <li
                        class="page-item"
                        v-for="page in totalPages"
                        :key="page"
                        :class="{ active: currentPage === page }"
                    >
                        <a class="page-link nav-link" @click="goToPage(page)">{{
                            page
                        }}</a>
                    </li>
                    <li
                        class="page-item"
                        :class="{ disabled: currentPage === totalPages }"
                    >
                        <a class="page-link nav-link" @click="nextPage">Next</a>
                    </li>
                </ul>
            </nav> -->

            <nav aria-label="Page navigation example">
                <ul class="pagination">
                    <li
                        class="page-item"
                        :class="{ disabled: currentPage === 1 }"
                    >
                        <a
                            class="page-link"
                            href="#"
                            @click.prevent="goToPage(1)"
                            >First</a
                        >
                    </li>

                    <li
                        class="page-item"
                        :class="{ disabled: currentPage === 1 }"
                    >
                        <a
                            class="page-link"
                            href="#"
                            @click.prevent="goToPage(currentPage - 1)"
                            >Previous</a
                        >
                    </li>

                    <template v-for="(page, index) in pagesToShow" :key="index">
                        <li v-if="page === '...'" class="page-item disabled">
                            <span class="page-link">...</span>
                        </li>
                        <li
                            v-else
                            class="page-item"
                            :class="{ active: currentPage === page }"
                        >
                            <a
                                class="page-link"
                                href="#"
                                @click.prevent="goToPage(page)"
                                >{{ page }}</a
                            >
                        </li>
                    </template>

                    <!-- Current Page Display -->
                    <li class="page-item">
                        <span class="page-link"
                            >Page {{ currentPage }} of {{ totalPages }}</span
                        >
                    </li>

                    <!-- Input for Page Number -->
                    <li class="page-item">
                        <input
                            type="number"
                            v-model="inputPage"
                            @keyup.enter="goToPage(inputPage)"
                            class="form-control"
                            min="1"
                            :max="totalPages"
                            style="width: 90px; margin: 0 10px"
                            placeholder="Page"
                        />
                    </li>

                    <li
                        class="page-item"
                        :class="{ disabled: currentPage === totalPages }"
                    >
                        <a
                            class="page-link"
                            href="#"
                            @click.prevent="goToPage(currentPage + 1)"
                            >Next</a
                        >
                    </li>

                    <li
                        class="page-item"
                        :class="{ disabled: currentPage === totalPages }"
                    >
                        <a
                            class="page-link"
                            href="#"
                            @click.prevent="goToPage(totalPages)"
                            >Last</a
                        >
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            isEditing: false,
            customerIdToEdit: null,
            items: [],
            currentPage: 1,
            itemsPerPage: 6, // Can be adjusted by user
            totalPages: 0, // Initialize to 0, update dynamically
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
            customerCityNames: {},
        }
    },

    created() {
        this.fetchCities()
        this.fetchCompanies()
        this.fetchCustomers(this.currentPage, this.itemsPerPage)
    },

    methods: {
        async fetchCities() {
            const response = await fetch('http://localhost:5140/api/city')
            this.cities = await response.json()
        },

        async fetchAreas() {
            const response = await fetch('http://localhost:5140/api/area')
            this.allAreas = await response.json()
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

        async fetchCustomers(
            page = this.currentPage,
            limit = this.itemsPerPage
        ) {
            try {
                const response = await fetch(
                    `http://localhost:5140/api/Customer/page/${page}/limit/${limit}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                )
                const data = await response.json()
                this.customers = data.customers // Ensure this matches your API response structure
                this.totalPages = data.totalPages // Update based on API response
            } catch (error) {
                console.error('Error fetching customers:', error)
            }
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
                    throw new Error(
                        errorData.message || 'Error submitting form'
                    )
                }

                this.resetForm()
                alert('Customer added successfully!')
                await this.fetchCustomers() // Refresh customer list
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
            await this.fetchAreas() // Ensure areas are fetched based on the city
            this.customerData.areaId = customer.areaId // Set areaId after fetching areas
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
                await this.fetchCustomers() // Refresh customer list
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
                    throw new Error(
                        response.statusText || 'Error deleting customer'
                    )
                }

                alert('Customer deleted successfully!')
                await this.fetchCustomers() // Refresh customer list
            } catch (error) {
                console.error('Error deleting customer:', error)
                alert('Error deleting customer: ' + error.message)
            }
        },
        async confirmRestoreCustomer(customerId) {
            try {
                const response = await fetch(
                    `http://localhost:5140/api/Customer/${customerId}/restore`,
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

                if (response.ok) {
                    alert('Customer restored successfully!')
                    await this.fetchCustomers() // Refresh customer list
                } else {
                    const errorData = await response.text()
                    console.error('Error details:', errorData)
                    throw new Error('Error restoring customer')
                }
            } catch (error) {
                console.error('Error restoring customer:', error)
                alert('Error restoring customer: ' + error.message)
            }
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
            return city ? city.name : 'Unknown City'
        },

        getAreaName(areaId) {
            const area = this.allAreas.find((a) => a.id === areaId)
            return area ? area.name : 'Unknown Area'
        },

        getCompanyName(companyId) {
            const company = this.companies.find((c) => c.id === companyId)
            return company ? company.name : 'Unknown'
        },

        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++
                this.fetchCustomers(this.currentPage, this.itemsPerPage)
            }
        },

        previousPage() {
            if (this.currentPage > 1) {
                this.currentPage--
                this.fetchCustomers(this.currentPage, this.itemsPerPage)
            }
        },
        goToPage(pageNumber) {
            // this.currentPage = pageNumber

            if (pageNumber >= 1 && pageNumber <= this.totalPages) {
                this.currentPage = pageNumber
                this.inputPage = pageNumber // Update input field
                // Fetch your data here based on the new page
                this.fetchCustomers() // Fetch customers for the new page
            }
        },
    },
}
</script>

<style scoped>
.nav-link {
    cursor: pointer; /* Change the cursor to a pointer on hover */
}

.nav-link:hover {
    text-decoration: underline; /* Optional: Add an underline effect on hover */
}
</style>
