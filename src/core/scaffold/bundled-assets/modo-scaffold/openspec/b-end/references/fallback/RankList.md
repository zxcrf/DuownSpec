## 20. RankList

**Biz Component**: `ModoRankList` → **Fallback**: `antd List`

### 补偿对比

| Biz 功能 | Tailwind 补偿 |
|---------|--------------|
| 排名序号（前 3 高亮） | 手动渲染圆形序号，前 3 用 #3261CE |
| 进度条 | `antd Progress` |
| 字号 12px | `text-[12px]` |
| 行间距紧凑 | `[&_.ant-list-item]:py-[6px]` |
| 数值右对齐 | `ml-auto text-right` |
| 标题行：左标题 + 右数值标签 | `flex justify-between` |

### TSX 示例

```tsx
import { List, Progress } from 'antd'

interface RankItem {
  key: string
  name: string
  value: number
  /** 最大值，用于计算进度条百分比 */
  maxValue?: number
}

interface Props {
  title?: string
  /** 数值单位标签 */
  valueLabel?: string
  items: RankItem[]
}

export function RankListFallback({ title, valueLabel, items }: Props) {
  const maxValue = items[0]?.value ?? 1

  // 前 3 名序号高亮颜色
  const getRankColor = (index: number) => {
    if (index === 0) return '#3261CE'
    if (index === 1) return '#5B8DEF'
    if (index === 2) return '#8AADF4'
    return '#C8D6E8'
  }

  return (
    <div>
      {/* 标题行 */}
      {(title || valueLabel) && (
        <div className="flex items-center justify-between mb-2 px-0">
          <span className="text-[12px] text-[#79879C]">{title}</span>
          <span className="text-[12px] text-[#79879C]">{valueLabel}</span>
        </div>
      )}

      <List
        dataSource={items}
        split={false}
        renderItem={(item, index) => (
          <List.Item
            className={[
              'py-[6px]!',
              'px-0!',
              'border-0!',
            ].join(' ')}
          >
            <div className="flex items-center gap-2 w-full">
              {/* 排名序号 */}
              <div
                className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[11px] font-medium flex-shrink-0 text-white"
                style={{ backgroundColor: getRankColor(index) }}
              >
                {index + 1}
              </div>

              {/* 名称 + 进度条 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-[2px]">
                  <span className="text-[12px] text-[#242E43] truncate max-w-[120px]">
                    {item.name}
                  </span>
                  <span className="text-[12px] text-[#242E43] font-medium ml-2 flex-shrink-0">
                    {item.value.toLocaleString()}
                  </span>
                </div>
                <Progress
                  percent={Math.round((item.value / (item.maxValue ?? maxValue)) * 100)}
                  showInfo={false}
                  size={['100%', 4]}
                  strokeColor={getRankColor(index)}
                  trailColor="#EFF4F9"
                  className="[&_.ant-progress-inner]:rounded-[2px] [&_.ant-progress-bg]:rounded-[2px]"
                />
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}
```

---

