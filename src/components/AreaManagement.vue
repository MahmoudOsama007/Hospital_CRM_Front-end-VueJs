<template>
    <div class="container mt-4">
        <h1 class="mb-4">Area Management</h1>
        <form
            @submit.prevent="isAreaEditing ? updateArea() : addArea()"
            class="mb-4"
        >
            <div class="mb-3">
                <label for="areaName" class="form-label">Area Name:</label>
                <input
                    type="text"
                    v-model="area.name"
                    class="form-control"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="cityId" class="form-label">City:</label>
                <select v-model="area.cityId" class="form-select" required>
                    <option
                        v-for="city in cities"
                        :key="city.id"
                        :value="city.id"
                    >
                        {{ city.name }}
                    </option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">
                {{ isAreaEditing ? 'Update Area' : 'Add Area' }}
            </button>
            <button
                type="button"
                @click="resetAreaForm"
                class="btn btn-secondary ms-2"
            >
                Cancel
            </button>
        </form>

        <h2>Areas List (Total: {{ areas.length }})</h2>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Area ID</th>
                    <th>Area Name</th>
                    <th>City</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="area in areas" :key="area.id">
                    <td>{{ area.id }}</td>
                    <td>
                        <input
                            v-if="editingAreaId === area.id"
                            v-model="area.name"
                            type="text"
                            class="form-control"
                        />
                        <span v-else>{{ area.name }}</span>
                    </td>
                    <td>
                        <span v-if="!editingAreaId">{{
                            getCityName(area.cityId)
                        }}</span>
                        <select
                            v-if="editingAreaId === area.id"
                            v-model="area.cityId"
                            class="form-select"
                        >
                            <option
                                v-for="city in cities"
                                :key="city.id"
                                :value="city.id"
                            >
                                {{ city.name }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <button
                            v-if="editingAreaId === area.id"
                            @click="saveArea(area)"
                            class="btn btn-primary btn-sm ms-2"
                        >
                            Save
                        </button>
                        <button
                            v-if="editingAreaId === area.id"
                            @click="cancelEditingArea"
                            class="btn btn-secondary btn-sm ms-2 mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            v-else
                            @click="editArea(area.id)"
                            class="btn btn-warning btn-sm ms-2 mr-2"
                        >
                            Edit
                        </button>
                        <button
                            v-if="area.isDeleted"
                            @click="confirmRestoreArea(area.id)"
                            class="btn btn-success btn-sm"
                        >
                            Restore
                        </button>
                        <button
                            v-else
                            @click="confirmDeleteArea(area.id)"
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
            areas: [],
            cities: [],
            area: {
                name: '',
                cityId: null,
            },
            isAreaEditing: false,
            editingAreaId: null,
        }
    },

    methods: {
        loadAreas() {
            fetch('http://localhost:5140/api/Area', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.areas = data
                })
                .catch((error) => console.error('Error loading areas:', error))
        },

        loadCities() {
            fetch('http://localhost:5140/api/City', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    this.cities = data
                })
                .catch((error) => console.error('Error loading cities:', error))
        },

        addArea() {
            fetch('http://localhost:5140/api/Area', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.area),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to add area: ' + response.statusText
                        )
                    }
                    return response.json()
                })
                .then(() => {
                    this.loadAreas() // Reload areas to show the newly added one
                    this.resetAreaForm()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error adding area:', error)
                })
        },

        resetAreaForm() {
            this.area = {
                name: '',
                cityId: null,
            }
            this.isAreaEditing = false // Reset editing state
            this.editingAreaId = null // Clear the editing ID
        },

        editArea(id) {
            this.editingAreaId = id
        },

        saveArea(area) {
            fetch(`http://localhost:5140/api/Area/${area.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(area),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to update area: ' + response.statusText
                        )
                    }
                    this.loadAreas()
                    this.cancelEditingArea()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error updating area:', error)
                })
        },

        confirmDeleteArea(areaId) {
            fetch(`http://localhost:5140/api/Area/${areaId}/softdelete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const area = this.areas.find((a) => a.id === areaId)
                        if (area) area.isDeleted = true
                    }
                })
                .catch((error) => console.error('Error deleting area:', error))
        },

        confirmRestoreArea(areaId) {
            fetch(`http://localhost:5140/api/Area/${areaId}/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const area = this.areas.find((a) => a.id === areaId)
                        if (area) area.isDeleted = false
                    }
                })
                .catch((error) => console.error('Error restoring area:', error))
        },

        getCityName(cityId) {
            const city = this.cities.find((c) => c.id === cityId)
            return city ? city.name : 'Unknown'
        },

        cancelEditingArea() {
            this.editingAreaId = null
        },
    },

    created() {
        this.loadCities() // Load cities when the component is created
        this.loadAreas() // Load areas when the component is created
    },
}
</script>

<style scoped>
/* Add your styles here */
</style>
