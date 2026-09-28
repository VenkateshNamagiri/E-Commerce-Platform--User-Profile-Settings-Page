import { useState } from 'react'

/**
 * Small form helper.
 *
 *   const form = useForm({ name: '', email: '' }, validate)
 *
 * - initialValues: starting field values
 * - validate(values): optional. Returns an object of { fieldName: 'message' }
 *   (empty object = valid). Runs on submit, before your handler is called.
 *
 * Returns:
 *   values, errors        current state
 *   handleChange          use as onChange on inputs that have a `name`
 *   handleSubmit(fn)      returns a <form onSubmit> handler: prevents the page
 *                         reload, validates, then calls fn(values) if valid
 *   setValues, reset      replace / restore values (e.g. after loading a profile)
 *   setFieldError         show a server-side error under one field
 *   isSubmitting          true while your async submit handler is running
 */
export function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    // typing in a field clears its old error
    setErrors(prev => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  function setFieldError(name, message) {
    setErrors(prev => ({ ...prev, [name]: message }))
  }

  function reset(newValues = initialValues) {
    setValues(newValues)
    setErrors({})
  }

  function handleSubmit(onSubmit) {
    return async e => {
      e.preventDefault()

      const found = validate ? validate(values) : {}
      const hasErrors = Object.values(found).some(Boolean)
      setErrors(found)
      if (hasErrors) return

      setIsSubmitting(true)
      try {
        await onSubmit(values)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return {
    values, errors, handleChange, handleSubmit,
    setValues, reset, setFieldError, isSubmitting,
  }
}
