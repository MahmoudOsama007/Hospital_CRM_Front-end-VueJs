<template>
    <div
        class="container mt-4 text-center d-flex align-items-center justify-content-center"
        style="min-height: 80vh"
    >
        <div class="row mb-4 justify-content-center">
            <div class="col-md-3 mt-3">
                <router-link to="/area-management" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i class="bi bi-map" style="font-size: 50px"></i>
                            <h5 class="card-title">Manage Areas</h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class="col-md-3 mt-3">
                <router-link to="/city-management" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i class="bi bi-house" style="font-size: 50px"></i>
                            <h5 class="card-title">Manage Cities</h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class="col-md-3 mt-3">
                <router-link to="/company-management" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i
                                class="bi bi-building"
                                style="font-size: 50px"
                            ></i>
                            <h5 class="card-title">Manage Companies</h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <!-- Add more cards as needed -->
            <div class="col-md-3 mt-3">
                <router-link to="/customer-management" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i class="bi bi-people" style="font-size: 50px"></i>
                            <h5 class="card-title">Manage Customers</h5>
                        </div>
                    </div>
                </router-link>
            </div>

            <div class="col-md-3 mt-3">
                <router-link to="/call-type" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i
                                class="bi bi-telephone"
                                style="font-size: 50px"
                            ></i>
                            <h5 class="card-title">Call Type</h5>
                        </div>
                    </div>
                </router-link>
            </div>

            <div class="col-md-3 mt-3">
                <router-link to="/call-about" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i
                                class="bi bi-info-circle"
                                style="font-size: 50px"
                            ></i>
                            <h5 class="card-title">Call About</h5>
                        </div>
                    </div>
                </router-link>
            </div>

            <div class="col-md-3 mt-3">
                <router-link to="/call-service" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i
                                class="bi bi-telephone-fill"
                                style="font-size: 50px"
                            ></i>
                            <h5 class="card-title">Call Service</h5>
                        </div>
                    </div>
                </router-link>
            </div>

            <div class="col-md-3 mt-3">
                <router-link to="/hospital" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i
                                class="bi bi-hospital"
                                style="font-size: 50px"
                            ></i>
                            <h5 class="card-title">Hospital</h5>
                        </div>
                    </div>
                </router-link>
            </div>

            <div class="col-md-3 mt-3">
                <router-link to="/major-specialist" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i
                                class="bi bi-person-circle"
                                style="font-size: 50px"
                            ></i>
                            <h5 class="card-title">
                                Major Specialist Management
                            </h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class="col-md-3 mt-3">
                <router-link to="/minor-specialist" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i
                                class="bi bi-person-heart"
                                style="font-size: 50px"
                            ></i>
                            <h5 class="card-title">
                                Minor Specialist Management
                            </h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <div class="col-md-3 mt-3">
                <router-link to="/very-specific-specialist" class="nav-link">
                    <div class="card hover-card">
                        <div class="card-body">
                            <i
                                class="fas fa-user-md"
                                style="font-size: 50px"
                            ></i>
                            <h5 class="card-title">
                                Very Specific Specialist Management (Skill)
                            </h5>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SettingsView',
}
</script>

<style scoped>
.hover-card {
    transition: transform 0.2s;
}

.hover-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>
