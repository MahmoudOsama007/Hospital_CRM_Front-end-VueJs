<template>
    <div class="container mt-5">
        <h2>Manage Call Types</h2>
        <div v-if="currentSection === 'callType'">
            <div class="form-section">
                <h2 class="form-title">
                    {{
                        isCallTypeEditing ? 'Update Call Type' : 'Add Call Type'
                    }}
                </h2>
                <form
                    @submit.prevent="
                        isCallTypeEditing ? updateCallType() : addCallType()
                    "
                >
                    <div class="mb-3">
                        <label for="callTypeName" class="form-label"
                            >Call Type Name</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            id="callTypeName"
                            v-model="callType.name"
                            required
                        />
                    </div>
                    <button type="submit" class="btn btn-primary">
                        {{
                            isCallTypeEditing
                                ? 'Update Call Type'
                                : 'Add Call Type'
                        }}
                    </button>
                    <button
                        v-if="isCallTypeEditing"
                        @click.prevent="resetCallTypeForm"
                        class="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </form>
            </div>
            <h3>Call Type List</h3>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Call Type Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="callType in callTypes" :key="callType.id">
                        <td>{{ callType.id }}</td>
                        <td>
                            <span
                                v-if="
                                    !isCallTypeEditing ||
                                    currentCallTypeId !== callType.id
                                "
                            >
                                {{ callType.name }}
                                <!-- <span
                                    v-if="callType.isDeleted"
                                    class="text-danger"
                                    >(Deleted)</span
                                > -->
                            </span>
                            <input
                                v-if="
                                    isCallTypeEditing &&
                                    currentCallTypeId === callType.id
                                "
                                type="text"
                                class="form-control"
                                v-model="callType.name"
                                required
                            />
                        </td>
                        <td class="table-actions">
                            <button
                                v-if="
                                    !isCallTypeEditing ||
                                    currentCallTypeId !== callType.id
                                "
                                class="btn btn-warning btn-sm"
                                @click.prevent="editCallType(callType)"
                            >
                                Edit
                            </button>
                            <button
                                v-if="
                                    isCallTypeEditing &&
                                    currentCallTypeId === callType.id
                                "
                                class="btn btn-primary btn-sm"
                                @click.prevent="updateCallType2(callType.id)"
                            >
                                Update
                            </button>
                            <button
                                v-if="!callType.isDeleted"
                                class="btn btn-danger btn-sm"
                                @click="confirmDeleteCallType(callType.id)"
                            >
                                Delete
                            </button>
                            <button
                                v-if="callType.isDeleted"
                                class="btn btn-success btn-sm"
                                @click="confirmRestoreCallType(callType.id)"
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
            callType: { name: '' },
            callTypes: [],
            isCallTypeEditing: false,
            currentCallTypeId: null,
            currentSection: 'callType',
        }
    },
    mounted() {
        this.fetchCallTypes()
    },
    methods: {
        async fetchCallTypes() {
            try {
                const response = await fetch(
                    'http://localhost:5140/api/calltype', // Ensure your API returns all call types, including deleted ones
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
                        'Failed to fetch call types: ' + response.statusText
                    )
                }
                const data = await response.json()
                this.callTypes = data // Make sure your API includes isDeleted in the response
            } catch (error) {
                console.error('Error fetching call types:', error)
            }
        },
        async addCallType() {
            try {
                const response = await fetch(
                    'http://localhost:5140/api/calltype',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem(
                                'token'
                            )}`,
                        },
                        body: JSON.stringify({ name: this.callType.name }),
                    }
                )
                if (!response.ok) {
                    throw new Error(
                        'Failed to add call type: ' + response.statusText
                    )
                }
                this.fetchCallTypes()
                this.resetCallTypeForm()
            } catch (error) {
                alert(error.message)
                console.error('Error adding call type:', error)
            }
        },
        editCallType(callType) {
            this.callType = { ...callType }
            this.currentCallTypeId = callType.id
            this.isCallTypeEditing = true
        },
        async updateCallType2(callTypeId) {
            const callTypeToEdit = this.callTypes.find(
                (c) => c.id === callTypeId
            )
            if (
                confirm(
                    `Are you sure you want to update the call type '${callTypeToEdit.name}'?`
                )
            ) {
                const updatedCallType = {
                    id: callTypeToEdit.id,
                    name: callTypeToEdit.name,
                }

                try {
                    const response = await fetch(
                        `http://localhost:5140/api/calltype/${this.currentCallTypeId}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem(
                                    'token'
                                )}`,
                            },
                            body: JSON.stringify(updatedCallType),
                        }
                    )
                    if (response.ok) {
                        this.fetchCallTypes()
                        this.resetCallTypeForm()
                    } else {
                        alert('Failed to update call type.')
                    }
                } catch (error) {
                    console.error('Error updating call type:', error)
                }
            }
        },
        resetCallTypeForm() {
            this.isCallTypeEditing = false
            this.callType = { name: '' }
            this.currentCallTypeId = null
        },
        confirmDeleteCallType(callTypeId) {
            const callTypeToDelete = this.callTypes.find(
                (c) => c.id === callTypeId
            )
            if (
                confirm(
                    `Are you sure you want to delete the call type '${callTypeToDelete.name}'?`
                )
            ) {
                fetch(
                    `http://localhost:5140/api/calltype/${callTypeId}/softdelete`,
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
                            // Update the local callTypes array to reflect the soft delete
                            const callType = this.callTypes.find(
                                (c) => c.id === callTypeId
                            )
                            if (callType) callType.isDeleted = true // Set the isDeleted property to true
                        } else {
                            alert('Failed to delete call type.') // Handle failure case
                        }
                    })
                    .catch((error) =>
                        console.error('Error deleting call type:', error)
                    )
            }
        },
        async confirmRestoreCallType(callTypeId) {
            try {
                const response = await fetch(
                    `http://localhost:5140/api/calltype/${callTypeId}/restore`,
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
                    const callType = this.callTypes.find(
                        (c) => c.id === callTypeId
                    )
                    if (callType) callType.isDeleted = false
                }
            } catch (error) {
                console.error('Error restoring call type:', error)
            }
        },
    },
}
</script>

<style scoped>
.table {
    margin-top: 20px;
}
.text-danger {
    font-weight: bold;
}
</style>
