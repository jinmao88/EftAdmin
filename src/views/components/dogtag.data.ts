import { FormSchema } from '/@/components/Table';

export const formSchema: FormSchema[] = [
  {
    field: 'map',
    label: '地图',
    component: 'RadioButtonGroup',
    required: true,
    componentProps: {
      options: [
        {
          label: '实验室',
          value: 'laboratory',
        },
        {
          label: '海关',
          value: 'customs',
        },
        {
          label: '海岸线',
          value: 'coastline',
        },
        {
          label: '储备站',
          value: 'reserve',
        },
        {
          label: '森林',
          value: 'forest',
        },
        {
          label: '立交桥',
          value: 'overpass',
        },
        {
          label: '工厂',
          value: 'factory',
        },
      ],
    },
  },
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
    slot: 'weapon',
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
    component: 'InputNumber',
    componentProps: {
      min: 1,
      max: 71,
    },

    required: true,
  },
];
