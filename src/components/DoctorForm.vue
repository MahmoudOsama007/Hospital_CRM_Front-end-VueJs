<template>
    <div class="container mt-4">
        <h1 class="mb-4">Doctor Management</h1>
        <form
            @submit.prevent="isDoctorEditing ? updateDoctor() : addDoctor()"
            class="mb-4"
        >
            <div class="mb-3">
                <label for="doctorName" class="form-label">Doctor Name:</label>
                <input
                    type="text"
                    v-model="doctor.name"
                    class="form-control"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="qualifications" class="form-label"
                    >Qualifications:</label
                >
                <input
                    type="text"
                    v-model="doctor.qualifications"
                    class="form-control"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="contactNumber" class="form-label"
                    >Contact Number:</label
                >
                <input
                    type="text"
                    v-model="doctor.contactNumber"
                    class="form-control"
                    required
                />
            </div>
            <button type="submit" class="btn btn-primary">
                {{ isDoctorEditing ? 'Update Doctor' : 'Add Doctor' }}
            </button>
            <button
                type="button"
                @click="resetDoctorForm"
                class="btn btn-secondary ms-2"
            >
                Cancel
            </button>
        </form>

        <h2>Doctors List (Total: {{ doctors.length }})</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Doctor ID</th>
                    <th>Doctor Name</th>
                    <th>Qualifications</th>
                    <th>Contact Number</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="doctor in doctors" :key="doctor.id">
                    <td>{{ doctor.id }}</td>
                    <td>
                        <input
                            v-if="editingDoctorId === doctor.id"
                            v-model="doctor.name"
                            type="text"
                            class="form-control"
                        />
                        <span v-else>{{ doctor.name }}</span>
                    </td>
                    <td>
                        <input
                            v-if="editingDoctorId === doctor.id"
                            v-model="doctor.qualifications"
                            type="text"
                            class="form-control"
                        />
                        <span v-else>{{ doctor.qualifications }}</span>
                    </td>
                    <td>
                        <input
                            v-if="editingDoctorId === doctor.id"
                            v-model="doctor.contactNumber"
                            type="text"
                            class="form-control"
                        />
                        <span v-else>{{ doctor.contactNumber }}</span>
                    </td>
                    <td>
                        <button
                            v-if="editingDoctorId === doctor.id"
                            @click="updateDoctor(doctor)"
                            class="btn btn-primary btn-sm ms-2"
                        >
                            Save
                        </button>
                        <button
                            v-if="editingDoctorId === doctor.id"
                            @click="cancelEditingDoctor"
                            class="btn btn-secondary btn-sm ms-2 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            v-else
                            @click="editDoctor(doctor)"
                            class="btn btn-warning btn-sm ms-2 mr-2"
                        >
                            Edit
                        </button>
                        <button
                            v-if="doctor.isDeleted"
                            @click="confirmRestoreDoctor(doctor.id)"
                            class="btn btn-success btn-sm"
                        >
                            Restore
                        </button>
                        <button
                            v-else
                            @click="confirmDeleteDoctor(doctor.id)"
                            class="btn btn-danger btn-sm"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            doctors: [],
            doctor: {
                name: '',
                qualifications: '',
                contactNumber: '',
            },
            isDoctorEditing: false,
            editingDoctorId: null,
        }
    },

    methods: {
        loadDoctors() {
            fetch('http://localhost:5140/api/Doctor', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.doctors = data
                })
                .catch((error) =>
                    console.error('Error loading doctors:', error)
                )
        },

        addDoctor() {
            console.log('Adding doctor:', this.doctor) // Log the data
            fetch('http://localhost:5140/api/Doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.doctor),
            })
        },

        resetDoctorForm() {
            this.doctor = {
                name: '',
                qualifications: '',
                contactNumber: '',
            }
            this.isDoctorEditing = false // Reset editing state
            this.editingDoctorId = null // Clear the editing ID
        },

        editDoctor(doctor) {
            this.editingDoctorId = doctor.id
            // Populate the form fields with the doctor's data
            this.doctor = { ...doctor }
            this.isDoctorEditing = true
        },

        updateDoctor(doctor) {
            fetch(`http://localhost:5140/api/Doctor/${doctor.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.doctor), // Use the data from the form
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `Failed to update doctor: ${response.statusText}`
                        )
                    }
                    return response.json()
                })
                .then(() => {
                    this.loadDoctors()
                    this.cancelEditingDoctor()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error updating doctor:', error)
                })
        },

        confirmDeleteDoctor(doctorId) {
            fetch(`http://localhost:5140/api/Doctor/${doctorId}/softdelete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const doctor = this.doctors.find(
                            (d) => d.id === doctorId
                        )
                        if (doctor) doctor.isDeleted = true
                    }
                })
                .catch((error) =>
                    console.error('Error deleting doctor:', error)
                )
        },

        confirmRestoreDoctor(doctorId) {
            fetch(`http://localhost:5140/api/Doctor/${doctorId}/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const doctor = this.doctors.find(
                            (d) => d.id === doctorId
                        )
                        if (doctor) doctor.isDeleted = false
                    }
                })
                .catch((error) =>
                    console.error('Error restoring doctor:', error)
                )
        },

        cancelEditingDoctor() {
            this.editingDoctorId = null
            this.resetDoctorForm() // Reset the form after canceling
        },
    },

    created() {
        this.loadDoctors() // Load doctors when the component is created
    },
}
</script>

<style scoped>
/* Add your styles here */
</style>
