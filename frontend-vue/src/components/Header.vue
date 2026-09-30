<template>
    <header class="p-5 px-8 w-full bg-[#284B63] flex items-center justify-between">
        <h1 class="text-3xl text-white font-bold font-baloo">Dashflow</h1>
        <div class="flex gap-8">
            <RouterLink to="/register"><button class="text-white py-2 px-4 rounded-md hover:bg-[#1A3A4D]">Cadastrar</button></RouterLink>
            <RouterLink to="/login"><button class="text-white bg-[#3C6E71] py-2 px-4 rounded-md hover:bg-[#3b686b]">Login</button></RouterLink>
        </div>
    </header>
</template>