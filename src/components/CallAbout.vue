<template>
    <div class="container mt-4">
        <h1 class="mb-4">Call About Management</h1>
        <form
            @submit.prevent="
                isCallAboutEditing ? updateCallAbout() : addCallAbout()
            "
            class="mb-4"
        >
            <div class="mb-3">
                <label for="callAboutName" class="form-label"
                    >Call About Name:</label
                >
                <input
                    type="text"
                    v-model="callAbout.name"
                    class="form-control"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="callTypeId" class="form-label">Call Type:</label>
                <select
                    v-model="callAbout.callTypeId"
                    class="form-select"
                    required
                >
                    <option
                        v-for="callType in callTypes"
                        :key="callType.id"
                        :value="callType.id"
                    >
                        {{ callType.name }}
                    </option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">
                {{
                    isCallAboutEditing ? 'Update Call About' : 'Add Call About'
                }}
            </button>
            <button
                type="button"
                @click="resetCallAboutForm"
                class="btn btn-secondary ms-2"
            >
                Cancel
            </button>
        </form>

        <h2>Call About List (Total: {{ callAbouts.length }})</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Call About ID</th>
                    <th>Call About Name</th>
                    <th>Call Type</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="callAbout in callAbouts" :key="callAbout.id">
                    <td>{{ callAbout.id }}</td>
                    <td>
                        <input
                            v-if="editingCallAboutId === callAbout.id"
                            v-model="callAbout.name"
                            type="text"
                            class="form-control"
                        />
                        <span v-else>{{ callAbout.name }}</span>
                    </td>
                    <td>
                        <select
                            v-if="editingCallAboutId === callAbout.id"
                            v-model="callAbout.callTypeId"
                            class="form-select"
                        >
                            <option
                                v-for="callType in callTypes"
                                :key="callType.id"
                                :value="callType.id"
                            >
                                {{ callType.name }}
                            </option>
                        </select>
                        <span v-else>{{
                            getCallTypeName(callAbout.callTypeId)
                        }}</span>
                    </td>
                    <td>
                        <button
                            v-if="editingCallAboutId === callAbout.id"
                            @click="saveCallAbout(callAbout)"
                            class="btn btn-primary btn-sm ms-2"
                        >
                            Save
                        </button>
                        <button
                            v-if="editingCallAboutId === callAbout.id"
                            @click="cancelEditingCallAbout"
                            class="btn btn-secondary btn-sm ms-2 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            v-else
                            @click="editCallAbout(callAbout.id)"
                            class="btn btn-warning btn-sm ms-2"
                        >
                            Edit
                        </button>
                        <button
                            v-if="callAbout.isDeleted"
                            @click="confirmRestoreCallAbout(callAbout.id)"
                            class="btn btn-success btn-sm"
                        >
                            Restore
                        </button>
                        <button
                            v-else
                            @click="confirmDeleteCallAbout(callAbout.id)"
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
            callAbouts: [],
            callTypes: [],
            callAbout: {
                name: '',
                callTypeId: null,
            },
            isCallAboutEditing: false,
            editingCallAboutId: null,
        }
    },

    methods: {
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

        addCallAbout() {
            fetch('http://localhost:5140/api/CallAbout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.callAbout),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to add call about: ' + response.statusText
                        )
                    }
                    return response.json()
                })
                .then(() => {
                    this.loadCallAbouts()
                    this.resetCallAboutForm()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error adding call about:', error)
                })
        },

        resetCallAboutForm() {
            this.callAbout = {
                name: '',
                callTypeId: null,
            }
            this.isCallAboutEditing = false
            this.editingCallAboutId = null
        },

        editCallAbout(callAboutId) {
            this.isCallAboutEditing = true
            this.editingCallAboutId = callAboutId
        },

        saveCallAbout(callAbout) {
            fetch(`http://localhost:5140/api/CallAbout/${callAbout.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(callAbout),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to save call about')
                    }
                    this.editingCallAboutId = null
                    this.isCallAboutEditing = false
                    this.loadCallAbouts()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error saving call about:', error)
                })
        },

        confirmDeleteCallAbout(callAboutId) {
            fetch(
                `http://localhost:5140/api/CallAbout/${callAboutId}/softdelete`,
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
                    if (!response.ok) {
                        throw new Error('Failed to delete call about')
                    }
                    this.loadCallAbouts() // Reload list to see updated state
                })
                .catch((error) =>
                    console.error('Error deleting call about:', error)
                )
        },

        confirmRestoreCallAbout(callAboutId) {
            fetch(
                `http://localhost:5140/api/CallAbout/${callAboutId}/restore`,
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
                    if (!response.ok) {
                        throw new Error('Failed to restore call about')
                    }
                    this.loadCallAbouts() // Reload list to see updated state
                })
                .catch((error) =>
                    console.error('Error restoring call about:', error)
                )
        },
        getCallTypeName(callTypeId) {
            const callType = this.callTypes.find(
                (callType) => callType.id === callTypeId
            )
            return callType ? callType.name : 'Unknown'
        },
        cancelEditingCallAbout() {
            this.editingCallAboutId = null
            this.isCallAboutEditing = false
            this.loadCallAbouts() // Optional: Reload to discard unsaved changes
        },
    },

    created() {
        this.loadCallAbouts()
        this.loadCallTypes()
    },
}
</script>

<style scoped>
/* Add your styles here */
</style>
