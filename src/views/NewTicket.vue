<template>
    <div class="container mt-4">
        <div class="card p-4 shadow-sm">
            <form>
                <div class="mb-4">
                    <h3>Customer Details</h3>
                    <hr />

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="name" class="form-label">Name:</label>
                            <input
                                type="text"
                                id="name"
                                v-model="customerData.name"
                                class="form-control"
                                disabled
                            />
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="address" class="form-label"
                                >Address:</label
                            >
                            <input
                                type="text"
                                id="address"
                                v-model="customerData.address"
                                class="form-control"
                                disabled
                            />
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label for="phoneNumber" class="form-label"
                                >Phone Number:</label
                            >
                            <input
                                type="text"
                                id="phoneNumber"
                                v-model="customerData.phoneNumber"
                                class="form-control"
                                disabled
                            />
                        </div>
                        <div class="col-md-4">
                            <label for="otherPhoneNumber" class="form-label"
                                >Other Phone Number:</label
                            >
                            <input
                                type="text"
                                id="otherPhoneNumber"
                                v-model="customerData.otherPhoneNumber"
                                class="form-control"
                                disabled
                            />
                        </div>
                        <div class="col-md-4">
                            <label for="landLineNumber" class="form-label"
                                >Landline Number:</label
                            >
                            <input
                                type="text"
                                id="landLineNumber"
                                v-model="customerData.landLineNumber"
                                class="form-control"
                                disabled
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
                            disabled
                        />
                    </div>
                </div>
            </form>
            <!-- <p>Customer Id : {{ id }}</p> -->

            <br /><br /><br />

            <form @submit.prevent="isEditing ? updateCustomer() : submitForm()">
                <div class="container mt-4">
                    <h4 class="mb-3">Ticket Details</h4>
                    <hr />

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="callType" class="form-label"
                                >Select Call Type:</label
                            >
                            <select
                                id="callType"
                                v-model="selectedCallTypeId"
                                @change="fetchCallAbouts"
                                class="form-select"
                                required
                            >
                                <option value="" disabled>
                                    Select a call type
                                </option>
                                <option
                                    v-for="callType in callTypes"
                                    :key="callType.id"
                                    :value="callType.id"
                                >
                                    {{ callType.name }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label for="callAbout" class="form-label"
                                >Select Call About:</label
                            >
                            <select
                                id="callAbout"
                                v-model="selectedCallAboutId"
                                @change="fetchCallServices"
                                :disabled="!selectedCallTypeId"
                                class="form-select"
                                required
                            >
                                <option value="" disabled>
                                    Select a call about
                                </option>
                                <option
                                    v-for="callAbout in callAbouts"
                                    :key="callAbout.id"
                                    :value="callAbout.id"
                                >
                                    {{ callAbout.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="callService" class="form-label"
                                >Select Call Service:</label
                            >
                            <select
                                id="callService"
                                v-model="selectedCallServiceId"
                                class="form-select"
                                :disabled="!selectedCallAboutId"
                            >
                                <option value="" disabled>
                                    Select a call service
                                </option>
                                <option
                                    v-for="service in callServices"
                                    :key="service.id"
                                    :value="service.id"
                                >
                                    {{ service.name }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label for="hospital" class="form-label"
                                >Select Hospital:</label
                            >
                            <select
                                id="hospital"
                                v-model="customerData.hospitalId"
                                @change="loadMajorSpecialists"
                                class="form-select"
                                required
                            >
                                <option value="" disabled>
                                    Select a hospital
                                </option>
                                <option
                                    v-for="hospital in hospitals"
                                    :key="hospital.id"
                                    :value="hospital.id"
                                >
                                    {{ hospital.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="majorSpecialist" class="form-label"
                                >Select Major Specialist:</label
                            >
                            <select
                                id="majorSpecialist"
                                v-model="customerData.majorSpecialistId"
                                @change="loadMinorSpecialists"
                                class="form-select"
                                :disabled="!customerData.hospitalId"
                                required
                            >
                                <option value="" disabled>
                                    Select a major specialist
                                </option>
                                <option
                                    v-for="majorSpecialist in majorSpecialists"
                                    :key="majorSpecialist.id"
                                    :value="majorSpecialist.id"
                                >
                                    {{ majorSpecialist.name }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label for="minorSpecialist" class="form-label"
                                >Select Minor Specialist:</label
                            >
                            <select
                                id="minorSpecialist"
                                v-model="customerData.minorSpecialistId"
                                @change="loadVerySpecificSpecialists"
                                class="form-select"
                                :disabled="!customerData.majorSpecialistId"
                                required
                            >
                                <option value="" disabled>
                                    Select a minor specialist
                                </option>
                                <option
                                    v-for="minorSpecialist in minorSpecialists"
                                    :key="minorSpecialist.id"
                                    :value="minorSpecialist.id"
                                >
                                    {{ minorSpecialist.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label
                                for="verySpecificSpecialist"
                                class="form-label"
                                >Select Very Specific Specialist:</label
                            >
                            <select
                                id="verySpecificSpecialist"
                                v-model="customerData.verySpecificSpecialistId"
                                @change="loadDoctors"
                                class="form-select"
                                :disabled="!customerData.minorSpecialistId"
                                required
                            >
                                <option value="" disabled>
                                    Select a very specific specialist
                                </option>
                                <option
                                    v-for="verySpecificSpecialist in verySpecificSpecialists"
                                    :key="verySpecificSpecialist.id"
                                    :value="verySpecificSpecialist.id"
                                >
                                    {{ verySpecificSpecialist.name }}
                                </option>
                            </select>
                        </div>

                        <div class="col-md-6">
                            <label for="doctor" class="form-label"
                                >Select Doctor:</label
                            >
                            <select
                                id="doctor"
                                v-model="customerData.doctorId"
                                class="form-select"
                                :disabled="
                                    !customerData.verySpecificSpecialistId
                                "
                                required
                            >
                                <option value="" disabled>
                                    Select a doctor
                                </option>
                                <option
                                    v-for="doctor in doctors"
                                    :key="doctor.id"
                                    :value="doctor.id"
                                >
                                    {{ doctor.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" class="btn btn-primary mt-3">
                        {{ isEditing ? 'Update Ticket' : 'Add Ticket' }}
                    </button>
                    <button
                        type="button"
                        class="btn btn-secondary mt-3 ms-2"
                        v-if="isEditing"
                        @click="cancelEdit"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>

        <!-- <div class="card mt-5 shadow-sm">
            <h2 class="card-title p-3 text-center">Customer List</h2>
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

        <nav aria-label="Page navigation example" class="mt-4">
            <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <a class="page-link" href="#" @click.prevent="goToPage(1)"
                        >First</a
                    >
                </li>
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
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
                <li class="page-item">
                    <span class="page-link"
                        >Page {{ currentPage }} of {{ totalPages }}</span
                    >
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
        </nav> -->
    </div>
</template>
<script>
export default {
    data() {
        return {
            customerData: {
                hospitalId: null,
                majorSpecialistId: null,
                minorSpecialistId: null,
                doctorId: null,
                customerId: 1,
                item: null, // This will hold the passed item data
                name: '',
                address: '',
                phoneNumber: '',
                otherPhoneNumber: '',
                landLineNumber: '',
                patientNumber: '',
                // other fields...
            },
            hospitals: [],
            majorSpecialists: [],
            minorSpecialists: [],
            doctors: [],
            isEditing: false,
            customerIdToEdit: null,
            items: [],
            currentPage: 1,
            itemsPerPage: 6,
            totalPages: 0,
            callTypes: [],
            callAbouts: [],
            callServices: [],
            verySpecificSpecialists: [],
            customers: [],
            selectedCallTypeId: null,
            selectedCallAboutId: null,
            selectedCallServiceId: null,
            callAbout: {
                name: '',
                callTypeId: null,
            },
            callService: {
                name: '',
                callAboutId: null,
            },
            filteredCallAbouts: [],
            isLoading: false,
        }
    },

    created() {
        //  this.fetchCities()
        //  this.fetchCompanies()
        //    this.fetchCustomers(this.currentPage, this.itemsPerPage)
        console.log(this.item)
        this.fetchCallTypes()
        this.loadHospitals()
        this.loadMajorSpecialists()
        this.loadMinorSpecialists()
        this.loadDoctors()
        this.fetchCustomerData()
        console.log(this.item) // Optional: Log the item data to the console
    },
    props: {
        id: {
            type: Number,
            required: true,
        },
    },

    methods: {
        async fetchCustomerData() {
            // Use the id prop to fetch customer data
            try {
                const response = await fetch(
                    `http://localhost:5140/api/Customer/${this.id}`
                )

                // Check if the response is ok (status in the range 200-299)
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }

                const data = await response.json()

                // Assign the fetched data to the customerData object
                this.customerData = data
            } catch (error) {
                console.error('Error fetching customer data:', error)
            }
        },
        submitForm() {
            console.log('Submitting form with data:', {
                selectedCallTypeId: this.selectedCallTypeId,
                selectedCallAboutId: this.selectedCallAboutId,
                selectedCallServiceId: this.selectedCallServiceId,
                AssignedHospitalId: this.customerData.hospitalId,
                majorSpecialistId: this.customerData.majorSpecialistId,
                minorSpecialistId: this.customerData.minorSpecialistId,
                verySpecificSpecialistId:
                    this.customerData.verySpecificSpecialistId,
                doctorId: this.customerData.doctorId,
                customerId: this.id,
                CustomerName: this.customerData.name,
            })

            // Prepare your payload
            const payload = {
                callTypeId: this.selectedCallTypeId,
                callAboutId: this.selectedCallAboutId,
                callServiceId: this.selectedCallServiceId,
                AssignedHospitalId: this.customerData.hospitalId,
                majorSpecialistId: this.customerData.majorSpecialistId,
                minorSpecialistId: this.customerData.minorSpecialistId,
                verySpecificSpecialistId:
                    this.customerData.verySpecificSpecialistId,
                doctorId: this.customerData.doctorId,
                customerId: this.id,
                CustomerName: this.customerData.name,
            }

            // Use fetch to make your API call
            fetch('http://localhost:5140/api/Ticket', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(payload),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Network response was not ok: ' +
                                response.statusText
                        )
                    }
                    return response.json()
                })
                .then((data) => {
                    console.log('Ticket created successfully:', data)
                    // Handle successful response
                    // Reset form or perform additional actions here
                })
                .catch((error) => {
                    console.error('Error submitting form:', error)
                })
        },
        async updateCustomer() {
            try {
                const response = await fetch(
                    `http://localhost:5140/api/Ticket/${this.customerIdToEdit}`,
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
                        errorData.message || 'Error updating ticket'
                    )
                }

                this.resetForm()
                alert('Ticket updated successfully!')
                await this.fetchCustomers() // Refresh ticket list
            } catch (error) {
                console.error('Error updating ticket:', error)
                alert('Error updating ticket: ' + error.message)
            }
        },
        async fetchMajorSpecialistsByHospital(hospitalId) {
            if (!hospitalId) {
                this.majorSpecialists = [] // Reset if no hospitalId is provided
                return
            }

            try {
                const response = await fetch(
                    `http://localhost:5140/api/majorspecialist/hospital/${hospitalId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        'Failed to fetch major specialists: ' +
                            response.statusText
                    )
                }

                const data = await response.json()
                this.majorSpecialists = data // Store the fetched major specialists
            } catch (error) {
                console.error(
                    'Error fetching major specialists by hospital:',
                    error
                )
            }
        },

        // Call this method when a hospital is selected, for example:
        onHospitalChange(selectedHospitalId) {
            this.fetchMajorSpecialistsByHospital(selectedHospitalId)
        },
        fetchWithAuth(url) {
            return fetch(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.statusText}`)
                }
                return response.json()
            })
        },

        loadHospitals() {
            this.isLoading = true // Set loading state
            this.fetchWithAuth('http://localhost:5140/api/Hospital')
                .then((data) => {
                    this.hospitals = data
                })
                .catch((error) => {
                    console.error('Error loading hospitals:', error)
                })
                .finally(() => {
                    this.isLoading = false // Reset loading state
                })
        },

        async loadMajorSpecialists() {
            const hospitalId = this.customerData.hospitalId

            if (!hospitalId) {
                this.majorSpecialists = [] // Reset the major specialists list if no hospital is selected
                return
            }

            try {
                // Fetch major specialists related to the selected hospital
                const response = await fetch(
                    `http://localhost:5140/api/majorspecialist/hospital/${hospitalId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`, // Include token for authorization if needed
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error(
                        `Failed to fetch major specialists: ${response.statusText}`
                    )
                }

                const data = await response.json()
                this.majorSpecialists = data // Store the fetched major specialists
            } catch (error) {
                console.error('Error fetching major specialists:', error)
                this.majorSpecialists = [] // Reset the list in case of an error
            }
        },

        loadMinorSpecialists() {
            const majorSpecialistId = this.customerData.majorSpecialistId

            if (!majorSpecialistId) {
                this.minorSpecialists = [] // Reset the minor specialists list if no major specialist is selected
                return
            }

            this.isLoading = true // Set loading state

            // Fetch minor specialists related to the selected major specialist
            fetch(
                `http://localhost:5140/api/MinorSpecialist/bymajorspecialist/${majorSpecialistId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`, // Include token for authorization
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch minor specialists')
                    }
                    return response.json()
                })
                .then((data) => {
                    this.minorSpecialists = data // Store the fetched minor specialists
                })
                .catch((error) => {
                    console.error('Error loading minor specialists:', error)
                    this.minorSpecialists = [] // Reset the list in case of an error
                })
                .finally(() => {
                    this.isLoading = false // Reset loading state
                })
        },
        async loadVerySpecificSpecialists() {
            const minorSpecialistId = this.customerData.minorSpecialistId

            if (!minorSpecialistId) {
                this.verySpecificSpecialists = []
                return
            }

            try {
                const response = await fetch(
                    `http://localhost:5140/api/veryspecificspecialist/byminorspecialist/${minorSpecialistId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error('Failed to fetch very specific specialists')
                }

                const data = await response.json()
                this.verySpecificSpecialists = data
            } catch (error) {
                console.error(error)
                this.verySpecificSpecialists = []
            }
        },
        async loadDoctors() {
            this.isLoading = true // Set loading state
            const verySpecificSpecialistId =
                this.customerData.verySpecificSpecialistId // Get the selected VerySpecificSpecialistId

            // Check if a VerySpecificSpecialistId is selected
            if (!verySpecificSpecialistId) {
                this.doctors = [] // Clear doctors if no VerySpecificSpecialistId is selected
                this.isLoading = false // Reset loading state
                return
            }

            try {
                // Use the selected VerySpecificSpecialistId to fetch doctors
                const response = await fetch(
                    `http://localhost:5140/api/Doctor/byveryspecificspecialist/${verySpecificSpecialistId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`, // Add authorization token
                        },
                    }
                )

                // Check if the response is okay
                if (!response.ok) {
                    throw new Error('Failed to fetch doctors')
                }

                const data = await response.json() // Parse the JSON response
                this.doctors = data // Store the fetched doctors
            } catch (error) {
                console.error('Error loading doctors:', error)
                this.doctors = [] // Clear doctors on error
            } finally {
                this.isLoading = false // Reset loading state
            }
        },

        // async fetchCities() {
        //     const response = await fetch('http://localhost:5140/api/city')
        //     this.cities = await response.json()
        // },

        // async fetchAreas() {
        //     const response = await fetch('http://localhost:5140/api/area')
        //     this.allAreas = await response.json()
        //     if (this.customerData.cityId) {
        //         this.filteredAreas = this.allAreas.filter(
        //             (area) => area.cityId === this.customerData.cityId
        //         )
        //     } else {
        //         this.filteredAreas = []
        //         this.customerData.areaId = null
        //     }
        // },

        // async fetchCompanies() {
        //     const response = await fetch('http://localhost:5140/api/company')
        //     this.companies = await response.json()
        // },

        // async fetchCustomers(
        //     page = this.currentPage,
        //     limit = this.itemsPerPage
        // ) {
        //     try {
        //         const response = await fetch(
        //             `http://localhost:5140/api/Customer/page/${page}/limit/${limit}`,
        //             {
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     Authorization: `Bearer ${localStorage.getItem(
        //                         'token'
        //                     )}`,
        //                 },
        //             }
        //         )
        //         const data = await response.json()
        //         this.customers = data.customers // Ensure this matches your API response structure
        //         this.totalPages = data.totalPages // Update based on API response
        //     } catch (error) {
        //         console.error('Error fetching customers:', error)
        //     }
        // },
        fetchCallTypes() {
            // Fetch the call types from API
            fetch('http://localhost:5140/api/CallType')
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Network response was not ok: ' +
                                response.statusText
                        )
                    }
                    return response.json()
                })
                .then((data) => {
                    this.callTypes = data // Store call types
                })
                .catch((error) => {
                    console.error('Error fetching call types:', error)
                })
        },
        fetchCallAbouts() {
            if (this.selectedCallTypeId) {
                fetch(
                    `http://localhost:5140/api/CallAbout/calltype/${this.selectedCallTypeId}`
                )
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(
                                'Network response was not ok: ' +
                                    response.statusText
                            )
                        }
                        return response.json()
                    })
                    .then((data) => {
                        this.callAbouts = data // Store Call Abouts
                        this.selectedCallAboutId = null // Reset selected Call About
                        this.callServices = [] // Reset Call Services
                        this.selectedCallServiceId = null // Reset selected Call Service
                    })
                    .catch((error) => {
                        console.error('Error fetching call abouts:', error)
                    })
            } else {
                this.callAbouts = [] // Reset Call Abouts if no Call Type is selected
                this.callServices = [] // Reset Call Services
                this.selectedCallServiceId = null // Reset selected Call Service
            }
        },
        async fetchCallServices() {
            if (!this.selectedCallAboutId) return // Don't fetch if no Call About is selected

            try {
                const response = await fetch(
                    `http://localhost:5140/api/CallService/callabout/${this.selectedCallAboutId}`
                )

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                this.callServices = data // Set the call services from the response
            } catch (error) {
                console.error('Error fetching call services:', error)
            }
        },
        // This function can be called when changing the selected call about
        onCallAboutChange() {
            this.callServices = [] // Clear services
            this.fetchCallServices() // Fetch services based on selected call about
        },
        // async submitForm() {
        //     try {
        //         const response = await fetch(
        //             'http://localhost:5140/api/customer',
        //             {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     Authorization: `Bearer ${localStorage.getItem(
        //                         'token'
        //                     )}`,
        //                 },
        //                 body: JSON.stringify(this.customerData),
        //             }
        //         )

        //         if (!response.ok) {
        //             const errorData = await response.json()
        //             throw new Error(
        //                 errorData.message || 'Error submitting form'
        //             )
        //         }

        //         this.resetForm()
        //         alert('Customer added successfully!')
        //         await this.fetchCustomers() // Refresh customer list
        //     } catch (error) {
        //         console.error('Error submitting form:', error)
        //         alert('Error adding customer: ' + error.message)
        //     }
        // },

        async editCustomer(customer) {
            this.isEditing = true
            this.customerIdToEdit = customer.id
            this.customerData = { ...customer }
            this.customerData.cityId = this.getCityIdFromArea(customer.areaId)
            await this.fetchAreas() // Ensure areas are fetched based on the city
            this.customerData.areaId = customer.areaId // Set areaId after fetching areas
        },

        // async updateCustomer() {
        //     try {
        //         const response = await fetch(
        //             `http://localhost:5140/api/customer/${this.customerIdToEdit}`,
        //             {
        //                 method: 'PUT',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     Authorization: `Bearer ${localStorage.getItem(
        //                         'token'
        //                     )}`,
        //                 },
        //                 body: JSON.stringify(this.customerData),
        //             }
        //         )

        //         if (!response.ok) {
        //             const errorData = await response.json()
        //             throw new Error(
        //                 errorData.message || 'Error updating customer'
        //             )
        //         }

        //         this.resetForm()
        //         alert('Customer updated successfully!')
        //         await this.fetchCustomers() // Refresh customer list
        //     } catch (error) {
        //         console.error('Error updating customer:', error)
        //         alert('Error updating customer: ' + error.message)
        //     }
        // },

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

        loadCallTypes() {
            fetch('http://localhost:5140/api/CallType', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.callTypes = data
                })
                .catch((error) =>
                    console.error('Error loading call types:', error)
                )
        },

        loadCallAbouts() {
            // Fetch call abouts based on selected call type
            if (this.selectedCallTypeId) {
                fetch(
                    `http://localhost:5140/api/CallAbouts/${this.selectedCallTypeId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                )
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(
                                `HTTP error! Status: ${response.status}`
                            )
                        }
                        return response.json()
                    })
                    .then((data) => {
                        this.callAbouts = data // Update call abouts
                        this.selectedCallAboutId = null // Reset selected Call About
                        this.callServices = [] // Clear services when Call About changes
                    })
                    .catch((error) => {
                        console.error('Error loading call abouts:', error)
                    })
            }
        },
        loadCallServices() {
            // Fetch call services based on selected call about
            if (this.selectedCallAboutId) {
                fetch(
                    `http://localhost:5140/api/CallServices/${this.selectedCallAboutId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                    }
                )
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(
                                `HTTP error! Status: ${response.status}`
                            )
                        }
                        return response.json()
                    })
                    .then((data) => {
                        this.callServices = data // Update call services
                        this.selectedCallServiceId = null // Reset selected Call Service
                    })
                    .catch((error) => {
                        console.error('Error loading call services:', error)
                    })
            }
        },

        filterCallAbouts() {
            if (this.selectedCallTypeId) {
                this.filteredCallAbouts = this.callAbouts.filter(
                    (callAbout) =>
                        callAbout.callTypeId === this.selectedCallTypeId
                )
            } else {
                this.filteredCallAbouts = []
            }
        },
        resetCallAboutForm() {
            this.callAbout = {
                name: '',
                callTypeId: null,
            }
            this.isCallAboutEditing = false
            this.editingCallAboutId = null
        },

        resetCallServiceForm() {
            this.callService = {
                name: '',
                callAboutId: null,
            }
            this.isCallServiceEditing = false
            this.editingCallServiceId = null
        },

        getCallTypeName(callTypeId) {
            const callType = this.callTypes.find(
                (callType) => callType.id === callTypeId
            )
            return callType ? callType.name : 'Unknown'
        },
        getCallAboutName(callAboutId) {
            const callAbout = this.callAbouts.find(
                (callAbout) => callAbout.id === callAboutId
            )
            return callAbout ? callAbout.name : 'Unknown'
        },
        async fetchHospitals() {
            try {
                const response = await fetch('/api/medical/hospitals')
                if (!response.ok) throw new Error('Network response was not ok')
                this.hospitals = await response.json()
            } catch (error) {
                console.error('Error fetching hospitals:', error)
            }
        },
        async fetchMajorSpecialists() {
            try {
                const response = await fetch(`/api/medical/majorspecialists`)
                if (!response.ok) throw new Error('Network response was not ok')
                this.majorSpecialists = await response.json()
            } catch (error) {
                console.error('Error fetching major specialists:', error)
            }
        },
        async fetchMinorSpecialists() {
            try {
                const response = await fetch(`/api/medical/minorspecialists`)
                if (!response.ok) throw new Error('Network response was not ok')
                this.minorSpecialists = await response.json()
            } catch (error) {
                console.error('Error fetching minor specialists:', error)
            }
        },
        async fetchDoctors() {
            try {
                const response = await fetch(`/api/medical/doctors`)
                if (!response.ok) throw new Error('Network response was not ok')
                this.doctors = await response.json()
            } catch (error) {
                console.error('Error fetching doctors:', error)
            }
        },
    },
    watch: {
        selectedCallType(newType) {
            console.log('Selected Call Type:', newType) // You can log or use newType if needed
            this.fetchCallAbouts() // Fetch call abouts when the call type changes
            this.selectedCallAbout = null // Reset the call about selection
            this.callServices = [] // Clear call services
        },
        selectedCallAbout(newAbout) {
            console.log('Selected Call About:', newAbout) // You can log or use newAbout if needed
            this.fetchCallServices() // Fetch call services when the call about changes
            this.selectedCallService = null // Reset the call service selection
        },
    },
    mounted() {
        // Fetch call types and call abouts on mount
        this.fetchCallTypes()
        // this.fetchCallAbouts()
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

.container {
    max-width: 1200px;
}

.card {
    border: none;
}

.table th,
.table td {
    vertical-align: middle;
}

.btn {
    transition: background-color 0.3s ease;
}

.btn:hover {
    background-color: #0056b3; /* A darker shade for hover */
}

.pagination {
    margin-top: 20px;
}

.pagination .page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
}
</style>
