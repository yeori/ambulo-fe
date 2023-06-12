import { TabModel } from './tab-model.js'

export class TabData {
  constructor(readonly id: string, readonly text: string) {}
}
const regionTabs = [
  new TabData('route', '코스'),
  new TabData('place', '관광지'),
  new TabData('festival', '행사')
]

export const regionTabModel: TabModel<TabData> = TabModel.create(
  regionTabs,
  (tab) => tab.id,
  (tab) => tab.text
)
