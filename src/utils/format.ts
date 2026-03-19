const numberFormatter = new Intl.NumberFormat('ko-KR')

export function formatNumber(value: number) {
  return numberFormatter.format(value)
}

export function formatPercent(value: number) {
  return `${formatNumber(value)}%`
}

export function formatRuleCount(value: number) {
  return `${formatNumber(value)}개`
}

export function formatKoreanDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return value
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(year, month - 1, day))
}

export function formatVerdictLabel(
  verdict:
    | 'eligible'
    | 'conditional'
    | 'reviewRequired'
    | 'ineligible'
    | 'insufficient',
) {
  const labels = {
    eligible: '가능',
    conditional: '조건부 가능',
    reviewRequired: '심의 필요',
    ineligible: '불가',
    insufficient: '정보 부족',
  } as const

  return labels[verdict]
}
