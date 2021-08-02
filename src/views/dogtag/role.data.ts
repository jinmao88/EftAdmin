import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import { uploadApi } from '/@/api/sys/upload';
export const columns: BasicColumn[] = [
  {
    title: '被杀的',
    dataIndex: 'player_name',
    width: 200,
  },
  {
    title: '阵营',
    dataIndex: 'camp',
    width: 200,
  },
  {
    title: '地图',
    dataIndex: 'map',
    width: 200,
    customRender: ({ text }) => {
      switch (text) {
        case 'laboratory':
          return '实验室';
        case 'customs':
          return '海关';
        case 'coastline':
          return '海岸线';
        case 'reserve':
          return '储备站';
        case 'forest':
          return '森林';
        case 'overpass':
          return '立交桥';
        case 'factory':
          return '工厂';
        default:
          return '未知地图';
      }
    },
  },
  {
    title: '等级',
    dataIndex: 'level',
    width: 200,
  },
  {
    title: '武器',
    dataIndex: 'weapon',
    width: 200,
  },

  {
    title: '时间',
    dataIndex: 'kill_at',
    width: 180,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'player_name',
    label: '被杀的人',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'killer_name',
    label: '杀人的人',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const formSchema: FormSchema[] = [
  {
    field: 'player_name',
    label: '昵称',
    component: 'Input',
    required: true,
  },
  {
    field: 'killer_name',
    label: '击杀者',
    component: 'Input',
    required: true,
  },
  {
    field: 'kill_at',
    label: '死亡时间',
    component: 'Input',
    required: true,
  },
  {
    field: 'weapon',
    label: '击杀武器',
    component: 'Input',
    required: true,
  },
  {
    field: 'camp',
    label: '阵营',
    component: 'Select',
    componentProps: {
      options: [
        { title: 'BEAR', value: 'BEAR' },
        { title: 'USEC', value: 'USEC' },
      ],
    },
    required: true,
  },
  {
    field: 'level',
    label: '等级',
    component: 'Input',

    required: true,
  },
];
