<template>
      <div class="surface-0 flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="h-fit w-fit p-8" style="background-color: var(--primary-50); border-radius: 12px">
            <div class="grid flex flex-column align-items-center">
                <h1 class="text-900 font-bold text-3xl lg:text-5xl mb-2">Not Found</h1>
                <span class="text-gray-600"> Requested resource is not available. </span>

                <img src="@/assets/svg/404.svg" alt="404" style="width: 50%" />
                <div class="col-12 mt-5 text-center">
                    <router-link to="/" class="text-blue-500 font-bold"> Back Home </router-link>
                </div>
            </div>
        </div>
    </div>
</template>