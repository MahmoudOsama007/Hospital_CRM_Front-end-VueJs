<template>
    <div class="container mt-4">
        <h1 class="mb-4">Major Specialist Management</h1>
        <form
            @submit.prevent="
                isSpecialistEditing ? updateSpecialist() : addSpecialist()
            "
            class="mb-4"
        >
            <div class="mb-3">
                <label for="specialistName" class="form-label"
                    >Specialist Name:</label
                >
                <input
                    type="text"
                    v-model="specialist.name"
                    class="form-control"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="hospitalId" class="form-label">Hospital:</label>
                <select
                    v-model="specialist.hospitalId"
                    class="form-select"
                    required
                >
                    <option
                        v-for="hospital in hospitals"
                        :key="hospital.id"
                        :value="hospital.id"
                    >
                        {{ hospital.name }}
                    </option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">
                {{
                    isSpecialistEditing ? 'Update Specialist' : 'Add Specialist'
                }}
            </button>
            <button
                type="button"
                @click="resetSpecialistForm"
                class="btn btn-secondary ms-2"
            >
                Cancel
            </button>
        </form>

        <h2>Major Specialists List (Total: {{ specialists.length }})</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Specialist ID</th>
                    <th>Specialist Name</th>
                    <th>Hospital</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="specialist in specialists" :key="specialist.id">
                    <td>{{ specialist.id }}</td>
                    <td>
                        <input
                            v-if="editingSpecialistId === specialist.id"
                            v-model="specialist.name"
                            type="text"
                            class="form-control"
                        />
                        <span v-else>{{ specialist.name }}</span>
                    </td>
                    <td>
                        <select
                            v-if="editingSpecialistId === specialist.id"
                            v-model="specialist.hospitalId"
                            class="form-select"
                        >
                            <option
                                v-for="hospital in hospitals"
                                :key="hospital.id"
                                :value="hospital.id"
                            >
                                {{ hospital.name }}
                            </option>
                        </select>
                        <span v-else>{{
                            getHospitalName(specialist.hospitalId)
                        }}</span>
                    </td>
                    <td>
                        <button
                            v-if="editingSpecialistId === specialist.id"
                            @click="saveSpecialist(specialist)"
                            class="btn btn-primary btn-sm ms-2"
                        >
                            Save
                        </button>
                        <button
                            v-if="editingSpecialistId === specialist.id"
                            @click="cancelEditingSpecialist"
                            class="btn btn-secondary btn-sm ms-2 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            v-else
                            @click="editSpecialist(specialist.id)"
                            class="btn btn-warning btn-sm ms-2 mr-2"
                        >
                            Edit
                        </button>
                        <button
                            v-if="specialist.isDeleted"
                            @click="confirmRestoreSpecialist(specialist.id)"
                            class="btn btn-success btn-sm"
                        >
                            Restore
                        </button>
                        <button
                            v-else
                            @click="confirmDeleteSpecialist(specialist.id)"
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
            specialists: [],
            hospitals: [],
            specialist: {
                name: '',
                hospitalId: null,
            },
            isSpecialistEditing: false,
            editingSpecialistId: null,
        }
    },

    methods: {
        loadSpecialists() {
            fetch('http://localhost:5140/api/MajorSpecialist', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.specialists = data
                })
                .catch((error) =>
                    console.error('Error loading specialists:', error)
                )
        },

        loadHospitals() {
            fetch('http://localhost:5140/api/Hospital', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.hospitals = data
                })
                .catch((error) =>
                    console.error('Error loading hospitals:', error)
                )
        },

        addSpecialist() {
            fetch('http://localhost:5140/api/MajorSpecialist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.specialist),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to add specialist: ' + response.statusText
                        )
                    }
                    return response.json()
                })
                .then(() => {
                    this.loadSpecialists() // Reload specialists to show the newly added one
                    this.resetSpecialistForm()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error adding specialist:', error)
                })
        },

        resetSpecialistForm() {
            this.specialist = {
                name: '',
                hospitalId: null,
            }
            this.isSpecialistEditing = false // Reset editing state
            this.editingSpecialistId = null // Clear the editing ID
        },

        editSpecialist(id) {
            this.editingSpecialistId = id
        },

        saveSpecialist(specialist) {
            fetch(
                `http://localhost:5140/api/MajorSpecialist/${specialist.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                    body: JSON.stringify(specialist),
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to update specialist: ' +
                                response.statusText
                        )
                    }
                    this.loadSpecialists()
                    this.cancelEditingSpecialist()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error updating specialist:', error)
                })
        },

        confirmDeleteSpecialist(specialistId) {
            fetch(
                `http://localhost:5140/api/MajorSpecialist/${specialistId}/softdelete`,
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
                        const specialist = this.specialists.find(
                            (s) => s.id === specialistId
                        )
                        if (specialist) specialist.isDeleted = true
                    }
                })
                .catch((error) =>
                    console.error('Error deleting specialist:', error)
                )
        },

        confirmRestoreSpecialist(specialistId) {
            fetch(
                `http://localhost:5140/api/MajorSpecialist/${specialistId}/restore`,
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
                        const specialist = this.specialists.find(
                            (s) => s.id === specialistId
                        )
                        if (specialist) specialist.isDeleted = false
                    }
                })
                .catch((error) =>
                    console.error('Error restoring specialist:', error)
                )
        },

        getHospitalName(hospitalId) {
            const hospital = this.hospitals.find((h) => h.id === hospitalId)
            return hospital ? hospital.name : 'Unknown'
        },

        cancelEditingSpecialist() {
            this.editingSpecialistId = null
        },
    },

    created() {
        this.loadHospitals() // Load hospitals when the component is created
        this.loadSpecialists() // Load specialists when the component is created
    },
}
</script>

<style scoped>
/* Add your styles here */
</style>
