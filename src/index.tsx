import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native'

const COLORS = {
  darkGrey: 'darkgrey',
  iris: 'iris',
  irisSelection: 'iris',
  white: 'white',
  whiteTwo: 'white',
  paleGrey: 'palegrey'
}
const FONT_FAMILY = {
  HEAVY: 'sans'
}
const UTILITY_STYLES = {
  borderRadius14: 14
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  containerInner: {},
  input: {
    borderRadius: UTILITY_STYLES.borderRadius14,
    borderWidth: 1,
    color: COLORS.darkGrey,
    fontFamily: FONT_FAMILY.HEAVY,
    fontSize: 18,
    height: 50,
    width: 50,
    marginVertical: 8,
    paddingHorizontal: 14,
    textAlign: 'center'
  }
})

const OTPInput = (
  {
    maxLength,
    onComplete,
    onChange,
    onFocusResetError
  }: {
    maxLength: number
    onComplete: (pin: string) => void
    onChange?: (pin: string) => void
    onFocusResetError?: () => void
  },
  ref: any
) => {
  const initValues = (len: number) =>
    Array(len)
      .fill({})
      .reduce((p, _, i) => ({ ...p, [i]: undefined }), {})
  const fields = useRef<TextInput[]>([])
  const [input, setInput] = useState<{ [key: number]: number | undefined }>(
    initValues(maxLength)
  )

  useEffect(() => {
    fields.current[0].clear()
    fields.current[0].focus()
  }, [])

  useImperativeHandle(ref, () => ({
    blur: () => {
      fields.current.forEach((field) => {
        field.blur()
      })
    }
  }))

  const fill = (i: number, text?: string) => {
    if (i === 0 && `${text}`?.length > 0 && text?.length === maxLength) {
      fields.current[i].blur()
      const newInput = text
        ?.split('')
        .reduce((p, n, _i) => ({ ...p, [_i]: parseInt(n, 10) }), {})
      setInput(newInput)
      return onComplete(text)
    } else {
      if (`${text}`.length > 1 && `${text}`.length < maxLength) {
        const newInput = text
          ?.split('')
          .reduce((p, n, _i) => ({ ...p, [_i]: parseInt(n, 10) }), {})
        setInput(newInput!)
        onChange && onChange(Object.values(newInput!).join(''))
        return fields.current[`${text}`.length].focus()
      } else {
        const num = parseInt(`${text}`, 10)
        if (isNaN(num)) return

        setInput((old) => ({ ...old, [i]: num }))
        onChange && onChange(Object.values({ ...input, [i]: num }).join(''))
      }

      if (i + 1 === maxLength) {
        fields.current[i].blur()
        const result = Object.values(input).join('')
        return onComplete(`${result}${text}`)
      } else if (i + 1 < maxLength) fields.current[i + 1].focus()
    }
  }

  const keyPress = (key: string, i: number) => {
    if (key === 'Backspace' && i > 0) {
      setInput((old) => ({ ...old, [i - 1]: undefined }))
      onChange &&
        onChange(Object.values({ ...input, [i - 1]: undefined }).join(''))
      fields.current[i - 1].focus()
    }
  }

  const focus = () => {
    clear()
    fields.current[0].focus()
    onFocusResetError && onFocusResetError()
  }

  const clear = () => {
    onChange && onChange('')
    setInput(initValues(maxLength))
  }

  return (
    <TouchableWithoutFeedback onPress={focus} style={styles.outerContainer}>
      <View style={styles.container}>
        {Array(maxLength)
          .fill({})
          .map((_, i) => (
            <View key={i} style={styles.containerInner} pointerEvents="none">
              <TextInput
                ref={(element) => (fields.current[i] = element!)}
                style={[
                  styles.input,
                  {
                    borderColor: input[i]
                      ? COLORS.iris
                      : fields.current[i]?.isFocused()
                        ? COLORS.whiteTwo
                        : COLORS.paleGrey,
                    backgroundColor:
                      fields.current[i]?.isFocused() || input[i]
                        ? COLORS.white
                        : COLORS.paleGrey
                  }
                ]}
                selectionColor={COLORS.irisSelection}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                maxLength={maxLength}
                value={
                  fields.current[i]?.isFocused()
                    ? ''
                    : input[i] === undefined
                      ? '-'
                      : `${input[i]}`
                }
                onChangeText={(text) => {
                  fill(i, text)
                }}
                onKeyPress={({ nativeEvent: { key } }) => keyPress(key, i)}
              />
            </View>
          ))}
      </View>
    </TouchableWithoutFeedback>
  )
}

export default forwardRef<
  { blur: () => void },
  {
    maxLength: number
    onComplete: (pin: string) => void
    onChange?: (pin: string) => void
    onFocusResetError?: () => void
  }
>(OTPInput)
