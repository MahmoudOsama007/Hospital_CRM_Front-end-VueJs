<template>
    <div class="container mt-4">
        <h1 class="mb-4">
            <i class="bi bi-phone-fill"></i> Call Service Management
        </h1>
        <form
            @submit.prevent="
                isCallServiceEditing ? updateCallService() : addCallService()
            "
            class="mb-4"
        >
            <div class="mb-3">
                <label for="serviceName" class="form-label"
                    >Service Name:</label
                >
                <input
                    type="text"
                    v-model="callService.name"
                    class="form-control"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="callAboutId" class="form-label">Call About:</label>
                <select
                    v-model="callService.callAboutId"
                    class="form-select"
                    required
                >
                    <option
                        v-for="callAbout in callAbouts"
                        :key="callAbout.id"
                        :value="callAbout.id"
                    >
                        {{ callAbout.name }}
                    </option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">
                {{
                    isCallServiceEditing
                        ? 'Update Call Service'
                        : 'Add Call Service'
                }}
            </button>
            <button
                type="button"
                @click="resetCallServiceForm"
                class="btn btn-secondary ms-2"
            >
                Cancel
            </button>
        </form>

        <h2>Call Service List (Total: {{ callServices.length }})</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Service ID</th>
                    <th>Service Name</th>
                    <th>Call About</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="callService in callServices" :key="callService.id">
                    <td>{{ callService.id }}</td>
                    <td>
                        <input
                            v-if="editingCallServiceId === callService.id"
                            v-model="callService.name"
                            type="text"
                            class="form-control"
                        />
                        <span v-else>{{ callService.name }}</span>
                    </td>
                    <td>
                        <select
                            v-if="editingCallServiceId === callService.id"
                            v-model="callService.callAboutId"
                            class="form-select"
                            required
                        >
                            <option
                                v-for="callAbout in callAbouts"
                                :key="callAbout.id"
                                :value="callAbout.id"
                            >
                                {{ callAbout.name }}
                            </option>
                        </select>
                        <span v-else>{{
                            getCallAboutName(callService.callAboutId)
                        }}</span>
                    </td>
                    <td>
                        <button
                            v-if="editingCallServiceId === callService.id"
                            @click="saveCallService(callService)"
                            class="btn btn-primary btn-sm ms-2"
                        >
                            Save
                        </button>
                        <button
                            v-if="editingCallServiceId === callService.id"
                            @click="cancelEditingCallService"
                            class="btn btn-secondary btn-sm ms-2 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            v-else
                            @click="editCallService(callService)"
                            class="btn btn-warning btn-sm ms-2"
                        >
                            Edit
                        </button>
                        <button
                            v-if="callService.isDeleted"
                            @click="confirmRestoreCallService(callService.id)"
                            class="btn btn-success btn-sm"
                        >
                            Restore
                        </button>
                        <button
                            v-else
                            @click="confirmDeleteCallService(callService.id)"
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
            callService: {
                name: '',
                callAboutId: null,
            },
            isCallServiceEditing: false,
            editingCallServiceId: null,
        }
    },

    methods: {
        loadCallServices() {
            fetch('http://localhost:5140/api/CallService', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.callServices = data
                })
                .catch((error) =>
                    console.error('Error loading call services:', error)
                )
        },

        loadCallAbouts() {
            fetch('http://localhost:5140/api/CallAbout', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.callAbouts = data
                })
                .catch((error) =>
                    console.error('Error loading call abouts:', error)
                )
        },

        addCallService() {
            fetch('http://localhost:5140/api/CallService', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.callService),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to add call service: ' + response.statusText
                        )
                    }
                    return response.json()
                })
                .then(() => {
                    this.loadCallServices()
                    this.resetCallServiceForm()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error adding call service:', error)
                })
        },

        resetCallServiceForm() {
            this.callService = {
                name: '',
                callAboutId: null,
            }
            this.isCallServiceEditing = false
            this.editingCallServiceId = null
        },

        editCallService(callService) {
            this.isCallServiceEditing = true
            this.editingCallServiceId = callService.id

            // Load the selected call service details into the callService object
            this.callService = { ...callService } // Copying callService properties
        },

        saveCallService(callService) {
            fetch(`http://localhost:5140/api/CallService/${callService.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(callService),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to save call service')
                    }
                    this.resetCallServiceForm() // Reset form after saving
                    this.loadCallServices()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error saving call service:', error)
                })
        },

        confirmDeleteCallService(callServiceId) {
            fetch(
                `http://localhost:5140/api/CallService/${callServiceId}/softdelete`,
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
                        const callService = this.callServices.find(
                            (c) => c.id === callServiceId
                        )
                        if (callService) callService.isDeleted = true
                    }
                })
                .catch((error) =>
                    console.error('Error deleting call service:', error)
                )
        },

        confirmRestoreCallService(callServiceId) {
            fetch(
                `http://localhost:5140/api/CallService/${callServiceId}/restore`,
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
                        const callService = this.callServices.find(
                            (c) => c.id === callServiceId
                        )
                        if (callService) callService.isDeleted = false
                    }
                })
                .catch((error) =>
                    console.error('Error restoring call service:', error)
                )
        },

        getCallAboutName(callAboutId) {
            const callAbout = this.callAbouts.find(
                (callAbout) => callAbout.id === callAboutId
            )
            return callAbout ? callAbout.name : 'Unknown'
        },

        cancelEditingCallService() {
            this.resetCallServiceForm()
        },
    },

    created() {
        this.loadCallServices()
        this.loadCallAbouts()
    },
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
