<template>
    <div class="container">
        <div class="container-top">

        </div>
        <div class="list-view">
            <div class="add-client-button-container">
                <div class="add-client-button">
                    <button @click="addDialog = true">
                        Adicionar dicionario
                    </button>
                </div>
            </div>
            <div class="list-container">
                <div class="top-list">
                    <h3><strong>Carteira de dicionarios</strong></h3>
                    <div class="search-filter">
                        <SelectField 
                            :option-values="filterSelectOptions" 
                            v-model="selectedFilter" 
                            value-prop="value" 
                            display-prop="label">
                        </SelectField>
                        <input type="text" placeholder="Filtrar..." v-model="filterInput">
                    </div>
                </div>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Nome</th>
                                <th>Endereço</th>
                                <th>Cnpj</th>
                                <th>Telefone</th>
                                <th>E-mail</th>
                                <th></th>
                            </tr>
                        </thead>
                    <tbody v-for="(dicionario, index) in paginatedClients" :key="index">
                    <tr>
                    <td>{{ dicionario.dcn_id }}</td>
                    <td>{{ dicionario.dcn_verbete }}</td>
                    <td>{{ dicionario.dcn_significado ?? 'Não informado' }}</td>
                    <td>{{ dicionario.dcn_versao }}</td>
                    <td>{{ dicionario.dcn_data_hora_cadastro }}</td>
                    <td>{{ dicionario.dcn_data_hora_revisado }}</td>
                    <td>
                    </td>
                    </tr>
                    </tbody>
                    </table>
                    <div class="pagination">
                        <ul class="pagination-list">
                            <li v-for="pageNumber in totalPages" :key="pageNumber" @click="changePage(pageNumber)">
                                <a :class="{ active: page === pageNumber }">
                                    {{ pageNumber }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <v-dialog v-model="addDialog" width="80%">
            <div class="add-client-container">
                <div class="close-button">
                    <span class="material-symbols-outlined" @click="addDialog = false">
                        close
                    </span>
                </div>
                <AddClientForm></AddClientForm>
            </div>
        </v-dialog>
        
        
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted, type Ref, watch, computed, watchEffect } from 'vue';
import axios from 'axios';
import AddClientForm from "./AdddicionarioForm.vue";
import '../styles/form-styles.css'
import '../styles/table-styles.css'
import '../styles/dialog-styles.css'
import type IClient from './IDicionario'
import { useRouter } from 'vue-router';

const router = useRouter()

let addDialog = ref(false)
let editDialog = ref(false)
let deleteDialog = ref(false)

let clients = ref<Array<IClient>>([])
let clientSelected = ref<IClient>()
let paginatedClients = ref<Array<IClient>>([]);
let filteredClients = ref<Array<IClient>>([])
let filterInput = ref("")
let selectedFilter = ref("nome")

console.log(paginatedClients.value)

function editClient(clientCnpj: string) {
    router.push({query: { cnpj: clientCnpj }})
    editDialog.value = true
}

function clearUrlParam(newValue: boolean) {
  if (!newValue && router.currentRoute.value.query.cnpj !== undefined) {
    router.push({ query: { ...router.currentRoute.value.query, cnpj: undefined } });
  }
}

const filterSelectOptions = [
    {
        label: "Nome",
        value: "nome"
    },
    {
        label: "Cnpj",
        value: "cnpj"
    },
    {
        label: "Telefone",
        value: "telefone"
    },
]

const page = ref(1);
const itemsPerPage = ref(5);

function listClients() {
    axios.get<any>('http://localhost:8080/dicionario') 
        .then((response: any) => {
            clients.value = response.data
            filteredClients.value = response.data;
            clients.value.forEach((client, index) => {
               
            })
            filterClients();
        })
        .catch((error: any) => {
            console.error('Erro ao buscar dicionarios:', error);
        });
}

function filterClients() {  
    filteredClients.value = clients.value.filter((client: any) => {
        const selectedValue = client[selectedFilter.value];
        totalPages = computed(() => Math.ceil(filteredClients.value.length / itemsPerPage.value));
        if(selectedValue){
            return selectedValue.toLowerCase().includes(filterInput.value.toLowerCase());
        } else {
            return clients.value
        }
    })
    paginate()
}

const paginate = () => {
    const startIndex = (page.value - 1) * itemsPerPage.value;
    const endIndex = startIndex + itemsPerPage.value;

    paginatedClients.value = filteredClients.value.slice(startIndex, endIndex);
}

let totalPages = computed(() => Math.ceil(clients.value.length / itemsPerPage.value));

onMounted(() => {
    listClients();
})

watch(filterInput, filterClients)

watch(page, (newPage) => {
    paginate();
});

watch(editDialog, clearUrlParam)

const changePage = (pageNumber: any) => {
    page.value = pageNumber;
};

function deletClient(clientCnpj: string){
    router.push({query: { cnpj: clientCnpj }})
    deleteDialog.value = true
}

function deleteClient() {
    const cnpj = router.currentRoute.value.query.cnpj;
    axios.delete(`http://localhost:8080/dicionario/excluir/${cnpj}`)
        .then((response) => {
            window.alert('dicionario excluído com sucesso!!');
            listClients();
            deleteDialog.value = false;
        })
        .catch((error) => {
            window.alert('Erro ao excluir o dicionario');
            deleteDialog.value = false;
        });
}

</script>