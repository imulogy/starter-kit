export type SettingsProfileNumericSelectProps = {
  value: number | null
  onValueChange: (v: number | null) => void
  options: string[]
  placeholder?: string
}
