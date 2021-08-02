<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <Upload :beforeUpload="beforeUpload" :fileList="null">
      <Button type="primary">上传</Button>
    </Upload>
    <BasicForm @register="registerForm"> </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicTree, TreeItem } from '/@/components/Tree';
  import { Upload } from 'ant-design-vue';
  import { uploadDogtag } from '/@/api/sys/upload';
  import { getBase64WithFile } from '/@/components/Upload/src/helper';
  import { curd } from '/@/api/curd';
  import { Button } from '/@/components/Button';
  import { dateUtil } from '/@/utils/dateUtil';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm, BasicTree, Upload, Button },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const treeData = ref<TreeItem[]>([]);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: formSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
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

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await curd({ i: 'dogtag', a: 'add', ...values });
          console.log(values);
          // closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }
      const beforeUpload = async (file) => {
        const { result } = await getBase64WithFile(file);
        const data = await uploadDogtag({ image: result.replace('data:image/png;base64,', '') });
        console.log(data);

        setFieldsValue({
          player_name: data[1]?.text,
          killer_name: data[8]?.text.replace('击杀者为', ''),
          kill_at: dateUtil(
            data[3]?.text.slice(0, 10) + ' ' + data[3]?.text.slice(10),
            'MM/DD/YYYY HH:mm:ss'
          ).format('YYYY-MM-DD HH:MM:SS'),
          weapon: data[12]?.text,
          camp: data[5]?.text,
          level: data[11].text.indexOf('武器') > -1 ? data[10].text : data[11].text,
        });

        return false;
      };
      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
        treeData,
        beforeUpload,
      };
    },
  });
</script>
