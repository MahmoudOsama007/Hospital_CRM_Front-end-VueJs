<template>
    <div class="container mt-5">
        <h2>Manage Hospitals</h2>
        <div v-if="currentSection === 'hospital'">
            <div class="form-section">
                <h2 class="form-title">
                    {{ isHospitalEditing ? 'Update Hospital' : 'Add Hospital' }}
                </h2>
                <form
                    @submit.prevent="
                        isHospitalEditing ? updateHospital() : addHospital()
                    "
                >
                    <div class="mb-3">
                        <label for="hospitalName" class="form-label"
                            >Hospital Name</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            id="hospitalName"
                            v-model="hospital.name"
                            required
                        />
                    </div>
                    <div class="mb-3">
                        <label for="hospitalAddress" class="form-label"
                            >Address</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            id="hospitalAddress"
                            v-model="hospital.address"
                            required
                        />
                    </div>
                    <div class="mb-3">
                        <label for="hospitalContact" class="form-label"
                            >Contact Number</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            id="hospitalContact"
                            v-model="hospital.contactNumber"
                            required
                        />
                    </div>
                    <button type="submit" class="btn btn-primary">
                        {{
                            isHospitalEditing
                                ? 'Update Hospital'
                                : 'Add Hospital'
                        }}
                    </button>
                    <button
                        v-if="isHospitalEditing"
                        @click.prevent="resetHospitalForm"
                        class="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </form>
            </div>
            <h3>Hospital List</h3>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hospital Name</th>
                        <th>Address</th>
                        <th>Contact Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="hospital in hospitals" :key="hospital.id">
                        <td>{{ hospital.id }}</td>
                        <td>
                            <span
                                v-if="
                                    !isHospitalEditing ||
                                    currentHospitalId !== hospital.id
                                "
                                >{{ hospital.name }}</span
                            >
                            <input
                                v-if="
                                    isHospitalEditing &&
                                    currentHospitalId === hospital.id
                                "
                                type="text"
                                class="form-control"
                                v-model="hospital.name"
                                required
                            />
                        </td>
                        <td>
                            <span
                                v-if="
                                    !isHospitalEditing ||
                                    currentHospitalId !== hospital.id
                                "
                                >{{ hospital.address }}</span
                            >
                            <input
                                v-if="
                                    isHospitalEditing &&
                                    currentHospitalId === hospital.id
                                "
                                type="text"
                                class="form-control"
                                v-model="hospital.address"
                                required
                            />
                        </td>
                        <td>
                            <span
                                v-if="
                                    !isHospitalEditing ||
                                    currentHospitalId !== hospital.id
                                "
                                >{{ hospital.contactNumber }}</span
                            >
                            <input
                                v-if="
                                    isHospitalEditing &&
                                    currentHospitalId === hospital.id
                                "
                                type="text"
                                class="form-control"
                                v-model="hospital.contactNumber"
                                required
                            />
                        </td>
                        <td class="table-actions">
                            <button
                                v-if="
                                    !isHospitalEditing ||
                                    currentHospitalId !== hospital.id
                                "
                                class="btn btn-warning btn-sm"
                                @click.prevent="editHospital(hospital)"
                            >
                                Edit
                            </button>
                            <button
                                v-if="
                                    isHospitalEditing &&
                                    currentHospitalId === hospital.id
                                "
                                class="btn btn-primary btn-sm"
                                @click.prevent="updateHospital2(hospital.id)"
                            >
                                Update
                            </button>
                            <button
                                v-if="!hospital.isDeleted"
                                class="btn btn-danger btn-sm"
                                @click="confirmDeleteHospital(hospital.id)"
                            >
                                Delete
                            </button>
                            <button
                                v-if="hospital.isDeleted"
                                class="btn btn-success btn-sm"
                                @click="confirmRestoreHospital(hospital.id)"
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
            hospital: { name: '', address: '', contactNumber: '' },
            hospitals: [],
            isHospitalEditing: false,
            currentHospitalId: null,
            currentSection: 'hospital',
        }
    },
    mounted() {
        this.fetchHospitals()
    },
    methods: {
        updateHospital2(hospitalId) {
            const hospitalToEdit = this.hospitals.find(
                (h) => h.id === hospitalId
            )
            if (
                confirm(
                    `Are you sure you want to update the hospital '${hospitalToEdit.name}'?`
                )
            ) {
                const updatedHospital = {
                    id: hospitalToEdit.id, // ID of the hospital being updated
                    name: hospitalToEdit.name, // Current value from the input field
                    address: hospitalToEdit.address, // Current value for address
                    contactNumber: hospitalToEdit.contactNumber, // Current value for contactNumber
                }

                // Send the updated hospital to the API
                fetch(
                    `http://localhost:5140/api/Hospital/${this.currentHospitalId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                        body: JSON.stringify(updatedHospital),
                    }
                )
                    .then((response) => {
                        if (response.ok) {
                            // Update the local hospital array
                            const index = this.hospitals.findIndex(
                                (h) => h.id === hospitalId
                            )
                            if (index !== -1) {
                                this.hospitals[index] = { ...updatedHospital } // Update hospital locally
                            }
                            this.resetHospitalForm() // Reset form and exit editing mode
                        } else {
                            alert('Failed to update hospital.') // Handle failure
                        }
                    })
                    .catch((error) => {
                        console.error('Error updating hospital:', error) // Log errors
                    })
            }
        },

        fetchHospitals() {
            fetch('http://localhost:5140/api/Hospital', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to fetch hospitals: ' + response.statusText
                        )
                    }
                    return response.json()
                })
                .then((data) => {
                    this.hospitals = data
                })
                .catch((error) =>
                    console.error('Error fetching hospitals:', error)
                )
        },
        addHospital() {
            fetch('http://localhost:5140/api/Hospital', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.hospital),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to add hospital: ' + response.statusText
                        )
                    }
                    return response.json()
                })
                .then(() => {
                    this.fetchHospitals()
                    this.resetHospitalForm()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error adding hospital:', error)
                })
        },
        editHospital(hospital) {
            this.hospital = { ...hospital }
            this.currentHospitalId = hospital.id
            this.isHospitalEditing = true
        },
        updateHospital() {
            fetch(
                `http://localhost:5140/api/Hospital/${this.currentHospitalId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                    body: JSON.stringify(this.hospital),
                }
            )
                .then((response) => {
                    if (response.ok) {
                        this.fetchHospitals()
                        this.resetHospitalForm()
                    } else {
                        alert('Failed to update hospital.')
                    }
                })
                .catch((error) => {
                    console.error('Error updating hospital:', error)
                })
        },
        resetHospitalForm() {
            this.isHospitalEditing = false
            this.hospital = { name: '', address: '', contactNumber: '' }
            this.currentHospitalId = null
        },
        confirmDeleteHospital(hospitalId) {
            fetch(
                `http://localhost:5140/api/Hospital/${hospitalId}/softdelete`,
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
                .then((response) => {
                    if (response.ok) {
                        const hospital = this.hospitals.find(
                            (h) => h.id === hospitalId
                        )
                        if (hospital) hospital.isDeleted = true
                    }
                })
                .catch((error) =>
                    console.error('Error deleting hospital:', error)
                )
        },
        confirmRestoreHospital(hospitalId) {
            fetch(`http://localhost:5140/api/Hospital/${hospitalId}/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const hospital = this.hospitals.find(
                            (h) => h.id === hospitalId
                        )
                        if (hospital) hospital.isDeleted = false
                    }
                })
                .catch((error) =>
                    console.error('Error restoring hospital:', error)
                )
        },
    },
}
</script>

<style scoped>
.table {
    margin-top: 20px;
}
</style>
