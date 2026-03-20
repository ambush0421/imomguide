import { Calculator, Factory, FlaskConical } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { calculateLayoutSimulation } from '@/features/eligibility/utils/layout-calculator'
import type { EligibilityInput } from '@/features/eligibility/types'
import { formatNumber } from '@/utils/format'

interface LayoutSimulatorProps {
  input: EligibilityInput
}

function formatArea(value: number) {
  return Number.isInteger(value)
    ? `${formatNumber(value)}평`
    : `${value.toLocaleString('ko-KR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}평`
}

export function LayoutSimulator({ input }: LayoutSimulatorProps) {
  const simulation = calculateLayoutSimulation(input)

  return (
    <section className="rounded-[24px] border border-[var(--border)] bg-white p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="muted">마곡 입주 레이아웃 시뮬레이션</Badge>
        <Badge variant="muted">
          {input.companyScale === 'large' ? '대기업 50%' : '중소기업 40%'}
        </Badge>
      </div>
      <h4 className="mt-4 font-display text-lg font-semibold text-[var(--foreground)]">
        총 면적 기준으로 연구시설과 제조시설 여유를 바로 계산합니다.
      </h4>
      <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
        관리기본계획의 연구시설 비율과 제조시설 상한을 기반으로 빠르게 보는 예비 계산입니다.
        영업 현장에서는 이 숫자를 먼저 보여주고, 이후 실제 배치도와 인력계획으로 보완하면
        됩니다.
      </p>

      {simulation ? (
        <>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(241,247,255,0.9)] p-4">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-subtle)]">
                <FlaskConical className="size-4 text-[var(--accent)]" />
                최소 연구시설
              </div>
              <div className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {formatArea(simulation.minimumResearchAreaPy)}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(255,249,243,0.75)] p-4">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-subtle)]">
                <Factory className="size-4 text-[var(--accent)]" />
                제조시설 상한
              </div>
              <div className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {formatArea(simulation.maximumManufacturingAreaPy)}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(247,250,255,0.9)] p-4">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-subtle)]">
                <Calculator className="size-4 text-[var(--accent)]" />
                일반 활용 가능 면적
              </div>
              <div className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {formatArea(simulation.remainingGeneralAreaPy)}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[rgba(247,250,255,0.9)] p-4">
              <div className="flex items-center gap-2 text-xs text-[var(--foreground-subtle)]">
                <Calculator className="size-4 text-[var(--accent)]" />
                연구인력 1인당 면적
              </div>
              <div className="mt-2 text-lg font-semibold text-[var(--foreground)]">
                {simulation.researchAreaPerPersonPy
                  ? formatArea(simulation.researchAreaPerPersonPy)
                  : '인력 입력 없음'}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[rgba(248,251,255,0.84)] p-4">
            <div className="text-sm font-semibold text-[var(--foreground)]">
              실무 메모
            </div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--foreground-muted)]">
              {simulation.notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[rgba(248,251,255,0.72)] p-4 text-sm leading-6 text-[var(--foreground-muted)]">
          세부 조건에서 `총 면적(평)`과 `기업 규모`를 입력하면 이 자리에
          `연구시설 최소 면적`, `제조시설 상한`, `남는 면적`이 바로 계산됩니다.
        </div>
      )}
    </section>
  )
}
