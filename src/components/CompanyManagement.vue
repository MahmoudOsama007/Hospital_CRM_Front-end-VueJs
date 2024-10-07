<template>
    <div class="container mt-5">
        <h2>Manage Companies</h2>
        <div v-if="currentSection === 'company'">
            <div class="form-section">
                <h2 class="form-title">
                    {{ isCompanyEditing ? 'Update Company' : 'Add Company' }}
                </h2>
                <form
                    @submit.prevent="
                        isCompanyEditing ? updateCompany() : addCompany()
                    "
                >
                    <div class="mb-3">
                        <label for="companyName" class="form-label"
                            >Company Name</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            id="companyName"
                            v-model="company.name"
                            required
                        />
                    </div>
                    <button type="submit" class="btn btn-primary">
                        {{
                            isCompanyEditing ? 'Update Company' : 'Add Company'
                        }}
                    </button>
                    <button
                        v-if="isCompanyEditing"
                        @click.prevent="resetCompanyForm"
                        class="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </form>
            </div>
            <h3>Company List</h3>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Company Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="company in companies" :key="company.id">
                        <td>{{ company.id }}</td>
                        <td>
                            <span
                                v-if="
                                    !isCompanyEditing ||
                                    currentCompanyId !== company.id
                                "
                            >
                                {{ company.name }}
                            </span>
                            <input
                                v-if="
                                    isCompanyEditing &&
                                    currentCompanyId === company.id
                                "
                                type="text"
                                class="form-control"
                                id="companyName"
                                v-model="company.name"
                                required
                            />
                        </td>
                        <td class="table-actions">
                            <button
                                v-if="
                                    !isCompanyEditing ||
                                    currentCompanyId !== company.id
                                "
                                class="btn btn-warning btn-sm"
                                @click.prevent="editCompany(company.id)"
                            >
                                Edit
                            </button>

                            <button
                                v-if="
                                    isCompanyEditing &&
                                    currentCompanyId === company.id
                                "
                                class="btn btn-primary btn-sm"
                                @click.prevent="updateCompany2(company.id)"
                            >
                                Update
                            </button>
                            <button
                                v-if="!company.isDeleted"
                                class="btn btn-danger btn-sm"
                                @click="confirmDeleteCompany(company.id)"
                            >
                                Delete
                            </button>
                            <button
                                v-if="company.isDeleted"
                                class="btn btn-success btn-sm"
                                @click="confirmRestoreCompany(company.id)"
                            >
                                Restore
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            company: { name: '' },
            companies: [],
            isCompanyEditing: false,
            currentCompanyId: null,
            currentSection: 'company',
        }
    },
    methods: {
        updateCompany() {
            // Update existing company in API
            fetch(`http://localhost:5140/api/Company/${this.company.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.company),
            }).then((response) => {
                if (response.ok) {
                    this.fetchCompanies() // Refresh company list after updating
                    this.resetCompanyForm() // Reset the form
                } else {
                    alert('Failed to update company.') // Alert for failure
                }
            })
        },
        updateCompany2(companyId) {
            const companyToEdit = this.companies.find((c) => c.id === companyId)

            // Display a confirmation alert before updating
            if (
                confirm(
                    `Are you sure you want to update the company '${companyToEdit.name}'?`
                )
            ) {
                const updatedCompany = {
                    id: companyToEdit.id, // ID of the company being updated
                    name: companyToEdit.name, // Current value from the input field
                }

                // Send the updated company to the API
                fetch(
                    `http://localhost:5140/api/Company/${this.currentCompanyId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                        body: JSON.stringify(updatedCompany),
                    }
                )
                    .then((response) => {
                        if (response.ok) {
                            // Update the local company array
                            const index = this.companies.findIndex(
                                (c) => c.id === companyId
                            )
                            if (index !== -1) {
                                this.companies[index].name = companyToEdit.name // Update name locally
                            }
                            this.resetCompanyForm() // Reset form and exit editing mode
                        } else {
                            alert('Failed to update company.') // Handle failure
                        }
                    })
                    .catch((error) => {
                        console.error('Error updating company:', error) // Log errors
                    })
            }
        },

        loadCompanies() {
            fetch('http://localhost:5140/api/Company', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.companies = data
                })
                .catch((error) => {
                    console.error('Error fetching companies:', error)
                })
        },
        addCompany() {
            fetch('http://localhost:5140/api/Company', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name: this.company.name }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to add company: ' + response.statusText
                        )
                    }
                    return response.json()
                })
                .then(() => {
                    this.loadCompanies()
                    this.resetCompanyForm()
                })
                .catch((error) => {
                    alert(error.message) // Show the error in an alert
                    console.error('Error adding company:', error)
                })
        },
        confirmDeleteCompany(companyId) {
            fetch(`http://localhost:5140/api/Company/${companyId}/softdelete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const company = this.companies.find(
                            (c) => c.id === companyId
                        )
                        if (company) company.isDeleted = true
                    }
                })
                .catch((error) =>
                    console.error('Error deleting company:', error)
                )
        },
        confirmRestoreCompany(companyId) {
            fetch(`http://localhost:5140/api/Company/${companyId}/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const company = this.companies.find(
                            (c) => c.id === companyId
                        )
                        if (company) company.isDeleted = false
                    }
                })
                .catch((error) =>
                    console.error('Error restoring company:', error)
                )
        },
        editCompany(companyId) {
            this.currentCompanyId = companyId // Set the ID of the company being edited
            const companyToEdit = this.companies.find((c) => c.id === companyId)
            console.log(companyToEdit)
            if (companyToEdit) {
                this.company = { ...companyToEdit } // Fill the form with the company data
                this.isCompanyEditing = true // Set the editing flag
            }
        },
        resetCompanyForm() {
            this.isCompanyEditing = false // Reset company editing flag
            this.currentCompanyId = null // Reset current company ID
            this.company = { name: '' } // Reset company form
        },
        fetchCompanies() {
            this.loadCompanies() // Load companies on component mount or when needed
        },
    },
    created() {
        this.fetchCompanies() // Fetch companies when the component is created
    },
}
</script>

<style scoped>
.table {
    margin-top: 20px;
}
</style>
