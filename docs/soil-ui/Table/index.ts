// export * from './render-table';
// export * from './const';
// export * from './icon';
// export * from './table-setting';

import { RenderTable } from './render-table';
import { SettingTable } from './table-setting';
import { initialData } from './const';

export default { render: RenderTable, setting: SettingTable, initialData, text: 'table' };
