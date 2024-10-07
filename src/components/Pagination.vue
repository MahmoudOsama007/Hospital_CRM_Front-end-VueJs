<template>
    <nav aria-label="Page navigation example">
        <ul class="pagination">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" href="#" @click.prevent="goToPage(1)"
                    >First</a
                >
            </li>

            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a
                    class="page-link"
                    href="#"
                    @click.prevent="goToPage(currentPage - 1)"
                    >Previous</a
                >
            </li>

            <template v-for="(page, index) in pagesToShow" :key="index">
                <li v-if="page === '...'" class="page-item disabled">
                    <span class="page-link">...</span>
                </li>
                <li
                    v-else
                    class="page-item"
                    :class="{ active: currentPage === page }"
                >
                    <a
                        class="page-link"
                        href="#"
                        @click.prevent="goToPage(page)"
                        >{{ page }}</a
                    >
                </li>
            </template>

            <li class="page-item">
                <span class="page-link"
                    >Page {{ currentPage }} of {{ totalPages }}</span
                >
            </li>

            <li class="page-item">
                <input
                    type="number"
                    v-model="inputPage"
                    @keyup.enter="goToPage(inputPage)"
                    class="form-control"
                    min="1"
                    :max="totalPages"
                    style="width: 60px; margin: 0 10px"
                    placeholder="Go to"
                />
            </li>

            <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
            >
                <a
                    class="page-link"
                    href="#"
                    @click.prevent="goToPage(currentPage + 1)"
                    >Next</a
                >
            </li>

            <li
                class="page-item"
                :class="{ disabled: currentPage === totalPages }"
            >
                <a
                    class="page-link"
                    href="#"
                    @click.prevent="goToPage(totalPages)"
                    >Last</a
                >
            </li>
        </ul>
    </nav>
</template>

<script>
export default {
    name: 'AppPagination', // Set the component name to multi-word
    props: {
        currentPage: {
            type: Number,
            required: true,
        },
        totalPages: {
            type: Number,
            required: true,
        },
        pagesToShow: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            inputPage: this.currentPage, // Initialize inputPage with the current page
        }
    },
    methods: {
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.$emit('page-changed', page) // Emit event with the new page
                this.inputPage = page // Update the input field
            }
        },
    },
}
</script>

<style scoped>
/* You can add custom styles for your pagination here */
</style>
