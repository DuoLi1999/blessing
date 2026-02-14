import type { Relationship, Length, RelationshipMeta, LengthMeta } from '../types'
import { RELATIONSHIPS, LENGTHS } from '../types'

interface Props {
  relationship: Relationship
  length: Length
  name: string
  note: string
  reference: string
  onRelationshipChange: (r: Relationship) => void
  onLengthChange: (l: Length) => void
  onNameChange: (v: string) => void
  onNoteChange: (v: string) => void
  onReferenceChange: (v: string) => void
  onGenerate: () => void
  isGenerating: boolean
  canGenerate: boolean
}

function RelationshipCard({ item, selected, onClick }: { item: RelationshipMeta; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`card-interactive relative px-3 py-2.5 rounded-lg cursor-pointer text-left flex items-center gap-2.5 ${selected ? 'selected' : ''}`}
    >
      {selected && (
        <div className="absolute top-1.5 right-1.5">
          <span className="text-primary text-sm">&#10003;</span>
        </div>
      )}
      <div className="w-7 h-7 shrink-0 bg-white border border-accent-gold/20 rounded-md flex items-center justify-center shadow-sm">
        <span className="text-base">{item.icon}</span>
      </div>
      <div className="min-w-0">
        <h3 className="font-serif font-bold text-sm text-text-main leading-tight">{item.label}</h3>
        <p className="text-[0.6rem] text-text-muted leading-tight">{item.desc}</p>
      </div>
    </button>
  )
}

function LengthOption({ item, selected, onClick }: { item: LengthMeta; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-lg text-center transition-all duration-300 ${
        selected
          ? 'bg-primary text-white shadow-md'
          : 'bg-white text-text-muted hover:text-primary border border-gray-200 hover:border-primary'
      }`}
    >
      <span className="text-sm font-medium block">{item.label}</span>
      <span className={`text-[0.6rem] ${selected ? 'text-white/70' : 'text-text-muted'}`}>{item.desc}</span>
    </button>
  )
}

export default function InputPanel({
  relationship, length, name, note, reference,
  onRelationshipChange, onLengthChange, onNameChange, onNoteChange, onReferenceChange,
  onGenerate, isGenerating, canGenerate,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Section 1: Relationship */}
      <section>
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-sans font-bold">1</span>
          <h3 className="text-lg font-serif font-bold text-text-main">选择关系</h3>
          <div className="h-px flex-grow bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {RELATIONSHIPS.map((item) => (
            <RelationshipCard
              key={item.id}
              item={item}
              selected={relationship === item.id}
              onClick={() => onRelationshipChange(item.id)}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Length */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-sans font-bold">2</span>
          <h3 className="text-lg font-serif font-bold text-text-main">篇幅</h3>
          <div className="h-px flex-grow bg-gray-200" />
        </div>
        <div className="flex gap-3">
          {LENGTHS.map((item) => (
            <LengthOption
              key={item.id}
              item={item}
              selected={length === item.id}
              onClick={() => onLengthChange(item.id)}
            />
          ))}
        </div>
      </section>

      {/* Section 3: Personalization */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-xs font-sans font-bold">3</span>
          <h3 className="text-lg font-serif font-bold text-text-main">个性化</h3>
          <div className="h-px flex-grow bg-gray-200" />
          <span className="text-xs text-text-muted italic">可选</span>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={'称呼，如"张叔叔""王总"'}
            className="w-full px-4 py-3 rounded-lg border border-accent-gold/30 bg-[#FBF9F4] focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all text-sm placeholder-gray-400"
          />
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-accent-gold pointer-events-none opacity-60" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-accent-gold pointer-events-none opacity-60" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-accent-gold pointer-events-none opacity-60" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-accent-gold pointer-events-none opacity-60" />
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder={'补充备注，如"他喜欢钓鱼""希望祝她考研顺利"'}
              rows={2}
              className="w-full bg-[#FBF9F4] border border-accent-gold/30 focus:border-primary focus:ring-1 focus:ring-primary/20 px-4 py-3 text-sm resize-none placeholder-gray-400 transition-all rounded-lg outline-none"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs text-text-muted mb-1.5">
              <span className="text-accent-gold text-sm">&#128337;</span>
              往年祝福参考
            </label>
            <textarea
              value={reference}
              onChange={(e) => onReferenceChange(e.target.value)}
              placeholder={'粘贴你之前给 TA 发过的拜年信息，AI 会参考风格但不重复'}
              rows={3}
              className="w-full bg-[#FBF9F4] border border-accent-gold/30 focus:border-primary focus:ring-1 focus:ring-primary/20 px-4 py-3 text-sm resize-none placeholder-gray-400 transition-all rounded-lg outline-none"
            />
          </div>
        </div>
      </section>

      {/* Generate Button */}
      <div className="pt-2">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !canGenerate}
          className="shimmer-btn w-full py-4 rounded-lg font-serif font-bold text-lg tracking-widest flex items-center justify-center gap-3 border border-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isGenerating ? (
            <>
              <span className="text-accent-gold text-xl animate-spin inline-block">&#x21BB;</span>
              生成中...
            </>
          ) : (
            <>
              <span className="text-accent-gold text-xl">&#10024;</span>
              生成祝福语
            </>
          )}
        </button>
        {!canGenerate && (
          <p className="text-center text-xs text-text-muted mt-2">暂无可用模型</p>
        )}
      </div>
    </div>
  )
}
