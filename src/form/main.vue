<template>
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" action="#" v-on:submit.prevent="onSubmit">
        <div>
          <label for="name" class="block text-sm font-medium leading-6 text-gray-900">姓名</label>
          <div class="mt-2">
            <input id="name" v-model="name" name="name" type="text" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="age" class="block text-sm font-medium leading-6 text-gray-900">年龄</label>
            <!-- <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div> -->
          </div>
          <div class="mt-2">
            <input id="age" v-model="age" name="age" type="text" autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="telephone" class="block text-sm font-medium leading-6 text-gray-900">电话</label>
            <!-- <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div> -->
          </div>
          <div class="mt-2">
            <input id="telephone" v-model="telephone" name="telephone" type="tel" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="member" class="block text-sm font-medium leading-6 text-gray-900">新西兰高尔夫球场会籍</label>
            <!-- <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div> -->
          </div>
          <div class="mt-2">
            <input id="member" v-model="member" name="member" type="text" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="company" class="block text-sm font-medium leading-6 text-gray-900">公司</label>
            <!-- <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div> -->
          </div>
          <div class="mt-2">
            <input id="company" v-model="company" name="company" type="text" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="whereKnown" class="block text-sm font-medium leading-6 text-gray-900">在哪里知道我们粤海高尔夫</label>
            <!-- <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div> -->
          </div>
          <div class="mt-2">
            <textarea id="whereKnown" v-model="whereKnown" name="whereKnown" type="text"  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">提交</button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
function randomStr () {
  return (Math.floor(Math.random() * 100000) * Date.now()).toString(16)
}

const callRpc = (params) => {
    return new Promise((resolve, reject) => {
        const successCallbackName = 'jsonp_' + randomStr();
        window[successCallbackName] = (json) => {
            resolve(json)
            delete window[successCallbackName];
        };

        const failedCallbackName = 'jsonp_failed_' + randomStr();
        window[failedCallbackName] = () => {
            reject()
            delete window[failedCallbackName];
        };

        window.rpc.postMessage(JSON.stringify({
            ...params,
            onSuccess: successCallbackName,
            onError: failedCallbackName,
        }));
    });
}

const callUtil = (command) => {
  window.utils.postMessage(command);
}


export default {
  name: "Page",
  methods: {
    async onSubmit() {
        if (!window.rpc) {
            return;
        }
        try {
          await callRpc({
              "url": "/user/widget/apply",
              "data": {
                  "name": this.name,
                  "age": this.age,
                  "telephone": this.telephone,
                  "member": this.member,
                  "company": this.company,
                  "whereKnown": this.whereKnown,
              }
          });
          callUtil("closeAndReload");
        } catch (e) {
          console.log(e)
        }

    }
  }
}
</script>
