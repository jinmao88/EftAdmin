<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    showFooter
    title="狗牌录入"
    :width="'70%'"
    @ok="handleSubmit"
  >
    <div class="container m-3" v-if="img">
      <div class="cropper-container">
        <CropperImage ref="refCropper" :src="img" @cropend="handleCropend" />
      </div>
    </div>
    <img :src="cropperImg" class="croppered" v-if="cropperImg && cropper" alt="" />

    <div class="m-4 flex flex-row justify-center">
      <Button type="primary" @click="changeCropper" class="mr-4">裁剪</Button>

      <Upload :beforeUpload="beforeUpload" :fileList="null" class="mr-4">
        <Button type="primary" color="error">上传</Button>
      </Upload>
      <Button type="primary" color="success" @click="fetchOcr" class="mr-4">识别</Button>
    </div>

    <Loading :loading="loading" :absolute="absolute" :tip="tip" />
    <BasicForm @register="registerForm">
      <template #weapon="{ model, field }">
        <NCascader
          v-model:value="model[field]"
          placeholder="没啥用的值"
          :options="weaponOption"
          :cascade="true"
          :showPath="false"
          remote
          :onLoad="handleLoad"
          :leafOnly="true"
        />
      </template>
    </BasicForm>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, onMounted, nextTick, reactive, toRefs } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './dogtag.data';
  import { Upload } from 'ant-design-vue';
  import { uploadDogtag } from '/@/api/sys/upload';
  import { getBase64WithFile } from '/@/components/Upload/src/helper';
  import { curd } from '/@/api/curd';
  import { Button } from '/@/components/Button';
  import { dateUtil } from '/@/utils/dateUtil';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { CropperImage } from '/@/components/Cropper';
  import { Loading } from '/@/components/Loading';
  import { NCascader } from 'naive-ui';
  export default defineComponent({
    name: 'DogtagModal',
    components: {
      BasicModal,
      BasicForm,
      Upload,
      Button,
      CropperImage,
      Loading,
      NCascader,
    },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const refCropper = ref(null);
      const cropperImg = ref();
      const info = ref('');
      const img = ref();
      const cropper = ref(false);
      const compState = reactive({
        absolute: true,
        loading: false,
        tip: '加载中...',
      });
      const weaponOption = ref([{ label: '突击步枪', value: '7', isLeaf: false, depth: 1 }]);
      function handleLoad(option) {
        return new Promise((resolve) => {
          console.log(option);
          curd({ i: 'weapon', a: 'list', type: option.value }).then((res) => {
            option.children = res.items.map((v) => {
              return { label: v.name, value: v.id, isLeaf: true, depth: 2 };
            });
            resolve();
          });
        });
      }
      onMounted(() => {
        nextTick(() => {
          document.addEventListener('paste', async function (event) {
            if (event.clipboardData || event.originalEvent) {
              //某些chrome版本使用的是event.originalEvent
              var clipboardData = event.clipboardData || event.originalEvent.clipboardData;
              if (clipboardData.items) {
                // for chrome
                var items = clipboardData.items,
                  len = items.length,
                  blob = null;
                for (var i = 0; i < len; i++) {
                  // console.log(items[i]);
                  if (items[i].type.indexOf('image') !== -1) {
                    img.value = '';
                    //getAsFile() 此方法只是living standard firefox ie11 并不支持
                    blob = items[i].getAsFile();
                    const { result } = await getBase64WithFile(blob);
                    img.value = result;
                    cropper.value = false;

                    setModalProps({ visible: true });
                  }
                }
              }
            }
          });
        });
      });
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
        img.value = '';
        //   setDrawerProps({ confirmLoading: false });
        //   isUpdate.value = !!data?.isUpdate;
        //
        //   if (unref(isUpdate)) {
        //     setFieldsValue({
        //       ...data.record,
        //     });
        //   }
        //   treeData.value = ((await getMenuList()) as any) as TreeItem[];
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setModalProps({ confirmLoading: true });
          await curd({ i: 'dogtag', a: 'add', ...values });
          closeModal();
          emit('success');
        } finally {
          setModalProps({ confirmLoading: false });
        }
      }
      const beforeUpload = async (file) => {
        img.value = '';
        const { result } = await getBase64WithFile(file);
        img.value = result;
        resetFields();
        return false;
      };
      function findKey(s, keys) {
        for (const k of keys) {
          if (s.indexOf(k) > -1) {
            return false;
          }
        }
        return true;
      }

      const fetchOcr = async () => {
        compState.loading = true;
        resetFields();
        const image = cropper ? cropperImg.value : img.value;
        const data = await uploadDogtag({
          image: image.replace('data:image/png;base64,', ''),
        });
        console.log(data);
        let list: string[] = [];
        data.forEach((v) => {
          if (v.text === '!') {
            list.push('1');
            return;
          }
          if (
            findKey(v.text, '昵称死亡时间阵营状态等级武器!') &&
            v.text !== 'a' &&
            v.text !== 'G' &&
            v.text !== '元' &&
            v.text !== 'o' &&
            v.text !== '?'
          ) {
            list.push(v.text);
          }
        });
        console.log(list);

        setFieldsValue({
          player_name: list[0],
          kill_at: dateUtil(
            list[1].slice(0, 10) + ' ' + list[1].slice(10),
            'MM/DD/YYYY HH:mm:ss'
          ).format('YYYY-MM-DD HH:MM:SS'),
          killer_name: list[3].slice(4),
          weapon: list[5],
          camp: list[2],
          level: list[4],
        });
        compState.loading = false;
      };
      function handleCropend({ imgBase64, imgInfo }) {
        info.value = imgInfo;
        cropperImg.value = imgBase64;
      }
      function changeCropper() {
        cropper.value = !cropper.value;
      }
      return {
        registerModal,
        registerForm,
        handleSubmit,
        beforeUpload,
        refCropper,
        cropperImg,
        handleCropend,
        img,
        info,
        fetchOcr,
        changeCropper,
        cropper,
        ...toRefs(compState),
        weaponOption,
        handleLoad,
      };
    },
  });
</script>
<style scoped>
  .container {
    width: 100vw;
  }

  .cropper-container {
    width: 65vw;
  }

  .croppered {
    height: 360px;
  }

  p {
    margin: 10px;
  }
</style>
