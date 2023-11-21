<template>
  <div class="form-title">
    <h2>Adicionar cliente</h2>
  </div>
  <form action="" class="add-form">
    <div class="input-inline-field">
      <InputField label="dcn_id:" placeholder="00.000.000/0000-01" v-model="dcn_idValue" />
      <InputField label="Telefone:" placeholder="(12) 996534789" v-model="phoneValue" />
    </div>
    <div class="input-inline-field">
      <InputField label="dcn_verbete:" placeholder="Informe o dcn_verbete" v-model="nameValue" />
      <InputField label="E-mail:" placeholder="Informe o dcn_significado" v-model="dcn_significadoValue" />
    </div>
    <div class="input-inline-field">
      <InputField label="Endereço:" placeholder="Rua Itajaí n° 435" v-model="addressValue" />
    </div>
    <div class="send-button">
      <InputButton text-button="Salvar" @click="createClient" />
    </div>
  </form>
  <div v-if="successMessage" class="success-message">
    {{ successMessage }}
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const dcn_idValue = ref("");
const phoneValue = ref("");
const nameValue = ref("");
const dcn_significadoValue = ref("");
const addressValue = ref("");
const successMessage = ref(""); 


async function createClient() {
  event?.preventDefault();

  const client = {
    dcn_id: dcn_idValue.value, 
    dcn_verbete: nameValue.value,
    dcn_significado: dcn_significadoValue.value,
    dcn_versao: addressValue.value
  };

  try {
    const response = await axios.post('http://localhost:8080/dicionario', client);
    window.alert("Cliente criado com sucesso");
    dcn_idValue.value = "";
    phoneValue.value = "";
    nameValue.value = "";
    dcn_significadoValue.value = "";
    addressValue.value = "";
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    window.alert("Erro ao criar cliente");
    successMessage.value = "";
  }
}
</script>