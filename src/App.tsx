import { useState, useCallback } from 'react'
import type { Relationship, Length } from './types'
import { useModelSelect } from './hooks/useModelSelect'
import { useGenerate } from './hooks/useGenerate'
import { useFreeUsage } from './hooks/useFreeUsage'
import { useApiConfig } from './hooks/useApiConfig'
import Header from './components/Header'
import ModelSelector from './components/ModelSelector'
import InputPanel from './components/InputPanel'
import ResultPanel from './components/ResultPanel'
import Particles from './components/Particles'
import ErrorBoundary from './components/ErrorBoundary'
import QueuePage from './components/QueuePage'
import ApiConfigModal from './components/ApiConfigModal'

export default function App() {
  const { models, selectedModel, setSelectedModel, loading: modelsLoading, error: modelsError } = useModelSelect()
  const { apiConfig, setApiConfig, clearApiConfig } = useApiConfig()
  const { results, overallStatus, generate, cancel, reset } = useGenerate(selectedModel, apiConfig)
  const { freeUsed, markFreeUsed } = useFreeUsage()

  const [relationship, setRelationship] = useState<Relationship>('elder')
  const [length, setLength] = useState<Length>('medium')
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [reference, setReference] = useState('')

  const [showQueue, setShowQueue] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState(false)

  const canGenerate = !!selectedModel || !!apiConfig

  const handleGenerate = useCallback(() => {
    if (apiConfig) {
      generate({ relationship, length, name: name.trim() || undefined, note: note.trim() || undefined, reference: reference.trim() || undefined })
      return
    }
    if (!selectedModel) return
    if (freeUsed) {
      setShowQueue(true)
      return
    }
    markFreeUsed()
    generate({ relationship, length, name: name.trim() || undefined, note: note.trim() || undefined, reference: reference.trim() || undefined })
  }, [apiConfig, selectedModel, freeUsed, markFreeUsed, generate, relationship, length, name, note, reference])

  const handleReset = useCallback(() => {
    reset()
  }, [reset])

  const handleCopy = useCallback(() => {
    // Analytics or feedback could go here
  }, [])

  const handleOpenConfig = useCallback(() => {
    setShowQueue(false)
    setShowConfigModal(true)
  }, [])

  const handleSaveConfig = useCallback((config: typeof apiConfig) => {
    if (config) {
      setApiConfig(config)
    }
    setShowConfigModal(false)
  }, [setApiConfig])

  const handleClearConfig = useCallback(() => {
    clearApiConfig()
    setShowConfigModal(false)
  }, [clearApiConfig])

  const showingResult = overallStatus !== 'idle'

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col relative overflow-x-hidden">
        <Particles />

        {/* Top accent bars */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-primary z-50" />
        <div className="absolute top-0.5 left-0 w-full h-0.5 bg-accent-gold z-50" />

        <Header hasApiConfig={!!apiConfig} onOpenConfig={handleOpenConfig} />

        <main className="flex-grow px-4 pb-12 max-w-lg mx-auto w-full relative z-10">
          {/* Title section */}
          <div className="text-center mb-8 pt-2">
            <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 bg-[#FBF9F4] border border-[#EBE3D0] rounded-full shadow-sm">
              <span className="text-accent-gold font-serif font-black text-sm">丙午</span>
              <span className="w-1 h-1 bg-primary rounded-full" />
              <span className="text-[0.6rem] font-bold text-primary tracking-[0.15em]">马年大吉</span>
            </div>
            <h2 className="text-3xl font-serif text-text-main font-black tracking-tight leading-tight">
              定制新春
              <span className="text-primary italic relative inline-block px-1">
                祝福
                <svg className="absolute bottom-0 left-0 w-full h-2 text-accent-gold/60" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </h2>
            <p className="text-text-muted text-sm mt-3 max-w-sm mx-auto leading-relaxed">
              AI 驱动的新春祝福语生成器，为不同关系量身定制
            </p>
          </div>

          {/* Model Selector - hidden when user has their own API config */}
          {!apiConfig && (
            <div className="mb-6">
              <ModelSelector
                models={models}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                loading={modelsLoading}
                error={modelsError}
              />
            </div>
          )}

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent mb-8 relative">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border border-accent-gold bg-bg-warm" />
          </div>

          {/* Main content: Input or Result based on state */}
          {!showingResult ? (
            <InputPanel
              relationship={relationship}
              length={length}
              name={name}
              note={note}
              reference={reference}
              onRelationshipChange={setRelationship}
              onLengthChange={setLength}
              onNameChange={setName}
              onNoteChange={setNote}
              onReferenceChange={setReference}
              onGenerate={handleGenerate}
              isGenerating={false}
              canGenerate={canGenerate}
            />
          ) : (
            <ResultPanel
              results={results}
              overallStatus={overallStatus}
              onCopy={handleCopy}
              onRegenerate={handleGenerate}
              onCancel={cancel}
              onReset={handleReset}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto py-8 text-center relative z-10 border-t border-accent-gold/10 bg-white/40 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-3 opacity-40">
            <div className="h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent w-16" />
            <div className="w-1.5 h-1.5 border border-accent-gold rotate-45 bg-white" />
            <div className="h-px bg-gradient-to-r from-transparent via-accent-gold to-transparent w-16" />
          </div>
          <p className="text-[0.6rem] text-text-muted/60 uppercase tracking-widest">
            新春祝福生成器 · 2026
          </p>
        </footer>
      </div>

      {/* Queue overlay */}
      {showQueue && (
        <QueuePage
          onConfigureKey={handleOpenConfig}
          onClose={() => setShowQueue(false)}
        />
      )}

      {/* API Config modal */}
      {showConfigModal && (
        <ApiConfigModal
          currentConfig={apiConfig}
          onSave={handleSaveConfig}
          onClear={handleClearConfig}
          onClose={() => setShowConfigModal(false)}
        />
      )}
    </ErrorBoundary>
  )
}
