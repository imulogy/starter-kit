export type SettingsProfileDatePickerFieldProps = {
  value: Date | null
  onChange: (date: Date | undefined) => void
  placeholder: string
  minDate?: Date
  maxDate?: Date
}
