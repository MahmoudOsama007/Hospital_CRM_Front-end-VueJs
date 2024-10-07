<template>
    <div class="container mt-4">
        <h1 class="mb-4">Minor Specialist Management</h1>
        <form
            @submit.prevent="
                isMinorSpecialistEditing
                    ? updateMinorSpecialist()
                    : addMinorSpecialist()
            "
            class="mb-4"
        >
            <div class="mb-3">
                <label for="minorSpecialistName" class="form-label"
                    >Minor Specialist Name:</label
                >
                <input
                    type="text"
                    v-model="minorSpecialist.name"
                    class="form-control"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="majorSpecialistId" class="form-label"
                    >Major Specialist:</label
                >
                <select
                    v-model="minorSpecialist.majorSpecialistId"
                    class="form-select"
                    required
                >
                    <option
                        v-for="specialist in majorSpecialists"
                        :key="specialist.id"
                        :value="specialist.id"
                    >
                        {{ specialist.name }}
                    </option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">
                {{
                    isMinorSpecialistEditing
                        ? 'Update Minor Specialist'
                        : 'Add Minor Specialist'
                }}
            </button>
            <button
                type="button"
                @click="resetMinorSpecialistForm"
                class="btn btn-secondary ms-2"
            >
                Cancel
            </button>
        </form>

        <h2>Minor Specialist List (Total: {{ minorSpecialists.length }})</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Minor Specialist ID</th>
                    <th>Minor Specialist Name</th>
                    <th>Major Specialist</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="specialist in minorSpecialists" :key="specialist.id">
                    <td>{{ specialist.id }}</td>
                    <td>
                        <input
                            v-if="editingMinorSpecialistId === specialist.id"
                            v-model="specialist.name"
                            type="text"
                            class="form-control"
                        />
                        <span v-else>{{ specialist.name }}</span>
                    </td>
                    <td>
                        <select
                            v-if="editingMinorSpecialistId === specialist.id"
                            v-model="specialist.majorSpecialistId"
                            class="form-select"
                        >
                            <option
                                v-for="majorSpecialist in majorSpecialists"
                                :key="majorSpecialist.id"
                                :value="majorSpecialist.id"
                            >
                                {{ majorSpecialist.name }}
                            </option>
                        </select>
                        <span v-else>{{
                            getMajorSpecialistName(specialist.majorSpecialistId)
                        }}</span>
                    </td>
                    <td>
                        <button
                            v-if="editingMinorSpecialistId === specialist.id"
                            @click="saveMinorSpecialist(specialist)"
                            class="btn btn-primary btn-sm ms-2"
                        >
                            Save
                        </button>
                        <button
                            v-if="editingMinorSpecialistId === specialist.id"
                            @click="cancelEditingMinorSpecialist"
                            class="btn btn-secondary btn-sm ms-2 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            v-else
                            @click="editMinorSpecialist(specialist)"
                            class="btn btn-warning btn-sm ms-2 mr-2"
                        >
                            Edit
                        </button>
                        <button
                            v-if="specialist.isDeleted"
                            @click="
                                confirmRestoreMinorSpecialist(specialist.id)
                            "
                            class="btn btn-success btn-sm"
                        >
                            Restore
                        </button>
                        <button
                            v-else
                            @click="confirmDeleteMinorSpecialist(specialist.id)"
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
            minorSpecialists: [],
            majorSpecialists: [],
            minorSpecialist: {
                name: '',
                majorSpecialistId: null,
            },
            isMinorSpecialistEditing: false,
            editingMinorSpecialistId: null,
        }
    },

    methods: {
        loadMinorSpecialists() {
            fetch('http://localhost:5140/api/MinorSpecialist', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.minorSpecialists = data
                })
                .catch((error) =>
                    console.error('Error loading minor specialists:', error)
                )
        },

        loadMajorSpecialists() {
            fetch('http://localhost:5140/api/MajorSpecialist', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.majorSpecialists = data
                })
                .catch((error) =>
                    console.error('Error loading major specialists:', error)
                )
        },

        addMinorSpecialist() {
            fetch('http://localhost:5140/api/MinorSpecialist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.minorSpecialist),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to add minor specialist: ' +
                                response.statusText
                        )
                    }
                    return response.json()
                })
                .then(() => {
                    this.loadMinorSpecialists()
                    this.resetMinorSpecialistForm()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error adding minor specialist:', error)
                })
        },

        updateMinorSpecialist() {
            fetch(
                `http://localhost:5140/api/MinorSpecialist/${this.editingMinorSpecialistId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                    body: JSON.stringify(this.minorSpecialist),
                }
            )
                .then((response) => {
                    if (response.ok) {
                        this.loadMinorSpecialists()
                        this.resetMinorSpecialistForm()
                    } else {
                        alert('Failed to update minor specialist.')
                    }
                })
                .catch((error) =>
                    console.error('Error updating minor specialist:', error)
                )
        },

        resetMinorSpecialistForm() {
            this.minorSpecialist = {
                name: '',
                majorSpecialistId: null,
            }
            this.isMinorSpecialistEditing = false
            this.editingMinorSpecialistId = null
        },

        editMinorSpecialist(specialist) {
            this.minorSpecialist = { ...specialist }
            this.isMinorSpecialistEditing = true
            this.editingMinorSpecialistId = specialist.id
        },

        saveMinorSpecialist(specialist) {
            this.minorSpecialist = { ...specialist }
            this.updateMinorSpecialist()
        },

        confirmDeleteMinorSpecialist(specialistId) {
            fetch(
                `http://localhost:5140/api/MinorSpecialist/${specialistId}/softdelete`,
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
                        const specialist = this.minorSpecialists.find(
                            (s) => s.id === specialistId
                        )
                        if (specialist) specialist.isDeleted = true
                    }
                })
                .catch((error) =>
                    console.error('Error deleting minor specialist:', error)
                )
        },

        confirmRestoreMinorSpecialist(specialistId) {
            fetch(
                `http://localhost:5140/api/MinorSpecialist/${specialistId}/restore`,
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
                        const specialist = this.minorSpecialists.find(
                            (s) => s.id === specialistId
                        )
                        if (specialist) specialist.isDeleted = false
                    }
                })
                .catch((error) =>
                    console.error('Error restoring minor specialist:', error)
                )
        },

        getMajorSpecialistName(specialistId) {
            const specialist = this.majorSpecialists.find(
                (s) => s.id === specialistId
            )
            return specialist ? specialist.name : 'Unknown'
        },

        cancelEditingMinorSpecialist() {
            this.resetMinorSpecialistForm()
        },
    },

    mounted() {
        this.loadMinorSpecialists()
        this.loadMajorSpecialists()
    },
}
</script>
