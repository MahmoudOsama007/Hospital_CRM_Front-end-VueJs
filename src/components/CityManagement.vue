<template>
    <div class="container mt-5">
        <h2>Manage Cities</h2>
        <div v-if="currentSection === 'city'">
            <div class="form-section">
                <h2 class="form-title">
                    {{ isCityEditing ? 'Update City' : 'Add City' }}
                </h2>
                <form
                    @submit.prevent="isCityEditing ? updateCity() : addCity()"
                >
                    <div class="mb-3">
                        <label for="cityName" class="form-label"
                            >City Name</label
                        >
                        <input
                            type="text"
                            class="form-control"
                            id="cityName"
                            v-model="city.name"
                            required
                        />
                    </div>
                    <button type="submit" class="btn btn-primary">
                        {{ isCityEditing ? 'Update City' : 'Add City' }}
                    </button>
                    <button
                        v-if="isCityEditing"
                        @click.prevent="resetCityForm"
                        class="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </form>
            </div>
            <h3>City List</h3>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>City Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="city in cities" :key="city.id">
                        <td>{{ city.id }}</td>
                        <td>
                            <span
                                v-if="
                                    !isCityEditing || currentCityId !== city.id
                                "
                            >
                                {{ city.name }}
                            </span>
                            <input
                                v-if="
                                    isCityEditing && currentCityId === city.id
                                "
                                type="text"
                                class="form-control"
                                v-model="city.name"
                                required
                            />
                        </td>
                        <td class="table-actions">
                            <button
                                v-if="
                                    !isCityEditing || currentCityId !== city.id
                                "
                                class="btn btn-warning btn-sm"
                                @click.prevent="editCity(city)"
                            >
                                Edit
                            </button>

                            <button
                                v-if="
                                    isCityEditing && currentCityId === city.id
                                "
                                class="btn btn-primary btn-sm"
                                @click.prevent="updateCity2(city.id)"
                            >
                                Update
                            </button>
                            <button
                                v-if="!city.isDeleted"
                                class="btn btn-danger btn-sm"
                                @click="confirmDeleteCity(city.id)"
                            >
                                Delete
                            </button>
                            <button
                                v-if="city.isDeleted"
                                class="btn btn-success btn-sm"
                                @click="confirmRestoreCity(city.id)"
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
            city: { name: '' },
            cities: [],
            isCityEditing: false,
            currentCityId: null,
            currentSection: 'city',
        }
    },
    mounted() {
        this.fetchCities()
    },
    methods: {
        updateCity2(cityId) {
            const cityToEdit = this.cities.find((c) => c.id === cityId)
            if (
                confirm(
                    `Are you sure you want to update the company '${cityToEdit.name}'?`
                )
            ) {
                const updatedCity = {
                    id: cityToEdit.id, // ID of the city being updated
                    name: cityToEdit.name, // Current value from the input field
                }

                // Send the updated city to the API
                fetch(`http://localhost:5140/api/City/${this.currentCityId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                    body: JSON.stringify(updatedCity),
                })
                    .then((response) => {
                        if (response.ok) {
                            // Update the local city array
                            const index = this.cities.findIndex(
                                (c) => c.id === cityId
                            )
                            if (index !== -1) {
                                this.cities[index].name = cityToEdit.name // Update name locally
                            }
                            this.resetCityForm() // Reset form and exit editing mode
                        } else {
                            alert('Failed to update city.') // Handle failure
                        }
                    })
                    .catch((error) => {
                        console.error('Error updating city:', error) // Log errors
                    })
            }
        },

        fetchCities() {
            fetch('http://localhost:5140/api/City', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to fetch cities: ' + response.statusText
                        )
                    }
                    return response.json()
                })
                .then((data) => {
                    this.cities = data
                })
                .catch((error) =>
                    console.error('Error fetching cities:', error)
                )
        },
        addCity() {
            fetch('http://localhost:5140/api/City', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ name: this.city.name }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            'Failed to add city: ' + response.statusText
                        )
                    }
                    return response.json()
                })
                .then(() => {
                    this.fetchCities()
                    this.resetCityForm()
                })
                .catch((error) => {
                    alert(error.message)
                    console.error('Error adding city:', error)
                })
        },
        editCity(city) {
            this.city = { ...city }
            this.currentCityId = city.id
            this.isCityEditing = true
        },
        updateCity() {
            fetch(`http://localhost:5140/api/City/${this.city.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(this.city),
            })
                .then((response) => {
                    if (response.ok) {
                        this.fetchCities()
                        this.resetCityForm()
                    } else {
                        alert('Failed to update city.')
                    }
                })
                .catch((error) => {
                    console.error('Error updating city:', error)
                })
        },
        resetCityForm() {
            this.isCityEditing = false
            this.city = { name: '' }
            this.currentCityId = null
        },
        confirmDeleteCity(cityId) {
            fetch(`http://localhost:5140/api/City/${cityId}/softdelete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const city = this.cities.find((c) => c.id === cityId)
                        if (city) city.isDeleted = true
                    }
                })
                .catch((error) => console.error('Error deleting city:', error))
        },
        confirmRestoreCity(cityId) {
            fetch(`http://localhost:5140/api/City/${cityId}/restore`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (response.ok) {
                        const city = this.cities.find((c) => c.id === cityId)
                        if (city) city.isDeleted = false
                    }
                })
                .catch((error) => console.error('Error restoring city:', error))
        },
    },
}
</script>

<style scoped>
.table {
    margin-top: 20px;
}
</style>
